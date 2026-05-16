# spec-08-04: chat.md grammar 확장 — frontmatter + 3 layers + shell semantics

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-08-04` |
| **Phase** | `phase-08` (chat-agent-flow) |
| **Branch** | `spec-08-04-chat-md-grammar` |
| **상태** | Planning |
| **타입** | Feature (grammar 확장 + AST + schema) |
| **Integration Test Required** | yes (playground/chats fixtures parse PASS) |
| **작성일** | 2026-05-10 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-7 의 chat.md grammar (`studio/src/lib/chat-md/grammar/chat-md.ts` 217 줄) 는 **body only** parser:

```
Document = Block*
Block    = Comment / ComponentTag / Placeholder / MarkdownText
```

→ frontmatter / 섹션 구조 / shell 인식 전혀 없음 — JSX 본문만 인식.

phase-8 PoC `poc-chat-agent-flow` 가 만든 `playground/chats/` 6 개 chat 파일은 *전부* 다음 구조:

```markdown
---
type: shell | scene | component
name: PascalName
identity: chats/{type}/{slug}
shell: { inherit: bool, exclude: [...] }
catalog: { tier, family, status }
paper: { artboard, layerNameAnchor }
references: [...]
created: 2026-05-10
---

# {Name}

## 💬 Narrative
... (자연어 설계 의도)

## 🧩 Structure
` ``jsx ... `` `

## 📜 History
- **2026-05-10** ...
```

→ 현재 grammar 로 parse 시 frontmatter / section heading 은 *MarkdownText* 로 통째로 들어감. 의미 정보 0.

### 문제점

1. **frontmatter 미인식**: `type` (shell/scene/component) / `identity` (Paper layerNameAnchor 매칭) / `shell.inherit/exclude` 가 AST 에 없음 → compile 단계 (paper / react) 에서 활용 불가
2. **3-layer section 미인식**: Narrative (자연어) ↔ Structure (JSX) ↔ History (변경 기록) 가 *섞임* → agent (도서관 사서) 가 컨텍스트 읽을 때 의미 영역 분리 불가
3. **schema 검증 부재**: chat type 별 frontmatter 필수 필드 (예: scene → identity 필수) 검증 0 — 잘못된 chat 도 parse 통과
4. **shell semantics 미정의**: `shell.inherit: true` 의 의미가 grammar 차원에서 *기록만* 되는지 / *해석* 되는지 미결정

### 해결 방안 (요약)

본 spec 은 **grammar + AST + schema** 까지만 (compile 단계는 후속 spec):

1. **frontmatter parsing** — peggy grammar 가 `^---\n...\n---\n` 영역 parse → YAML-lite subset (k:v / nested object / array)
2. **3-layer section parsing** — `## 💬 Narrative` / `## 🧩 Structure` / `## 📜 History` 헤딩으로 body 분할 → AST named 영역
3. **AST 확장** — `Document` 에 `frontmatter`, `narrative`, `structure`, `history` 추가. 기존 `body` 는 backward-compat 보존
4. **chat type schema** — `validateChatSchema(ast)` 가 type 별 필수 필드 검증 → `ParseError[]`
5. **shell semantics = 기록만** — AST 에 `frontmatter.shell.{inherit, exclude}` 보존. *해석* 은 spec-08-07 (chat-react-compiler) 의 책임

## 🎯 요구사항

### Functional Requirements

#### F-1: Frontmatter 문법 (YAML-lite subset)

문법 규칙:
- `^---\n` 으로 시작, `\n---\n` 으로 종료 (BOM/공백 허용)
- 각 줄: `<key>: <value>` (top-level)
- 중첩: 2-space indent (`shell:\n  inherit: true\n  exclude: [Foo]`)
- value 타입: string (raw / quoted) / boolean / number / null / array (`[a, b, c]`) / nested object
- comment: `# ...` 무시

지원 안 함 (Out of scope):
- multi-line string (`|`, `>`)
- anchor / alias (`&foo`, `*foo`)
- complex YAML 1.2 features

#### F-2: 3-layer section 문법

섹션 구분자:
- `## 💬 Narrative` — 자연어 (markdown 자유 형식, JSX 태그 X — 텍스트만)
- `## 🧩 Structure` — JSX *fenced code block* (` ```jsx ... ``` `) 만. 기존 ComponentTag grammar 적용
- `## 📜 History` — 마크다운 (bullet/header 자유)

규칙:
- 3 영역 모두 *선택* (없어도 parse OK — schema 단계에서 type 별 필수 검증)
- 영역 순서 자유 (단 권장: Narrative → Structure → History)
- 영역 내 부 헤딩 (`### `) 허용
- emoji 는 *권장* — `## Narrative` (emoji 없음) 도 인식

#### F-3: AST 확장

```ts
interface Document {
  type: "Document";
  frontmatter: ChatFrontmatter | null;
  title: string | null;            // # H1 (단일)
  narrative: NarrativeSection | null;
  structure: StructureSection | null;
  history: HistorySection | null;
  /** @deprecated — frontmatter 없는 legacy spec.md 호환용 */
  body?: Block[];
}

interface ChatFrontmatter {
  type: "shell" | "scene" | "component";
  name: string;
  identity?: string;
  shell?: { inherit?: boolean; exclude?: string[] };
  catalog?: { tier?: number; family?: string; status?: string };
  paper?: { artboard?: string | null; layerNameAnchor?: string };
  references?: string[];
  created?: string;
  applies?: "scenes" | "components";  // shell type only
  [key: string]: unknown;             // 추가 필드 raw 보존 (forward-compat)
}

interface NarrativeSection { type: "Narrative"; markdown: string; location: SourceLocation }
interface StructureSection { type: "Structure"; body: Block[]; location: SourceLocation }
interface HistorySection   { type: "History";   markdown: string; location: SourceLocation }
```

#### F-4: chat type 별 schema

| type | 필수 frontmatter | 추가 검증 |
|---|---|---|
| `shell` | `name`, `applies` | `shell.*` 사용 X (shell 자신은 inherit X) |
| `scene` | `name`, `identity` | identity prefix = `chats/scenes/`. shell.exclude 항목은 PascalCase |
| `component` | `name`, `identity`, `catalog.tier`, `catalog.family` | identity prefix = `chats/components/` |

검증 함수: `validateChatSchema(ast: Document): ParseError[]` — `stage: "schema"` 표시.

#### F-5: 후방 호환

- 기존 `spec.md` (frontmatter 없음, 섹션 없음) 도 parse 통과 — `frontmatter: null`, `body` 노출
- 기존 725 테스트 PASS 유지
- `parse()` API 시그니처 불변

### Non-Functional Requirements

1. **테스트 커버리지**: playground/chats/ 6 파일 + fixtures/chats/ 28 파일 (혹은 frontmatter 있는 일부) parse PASS
2. **에러 친화성**: frontmatter 오류 (예: `type: invalid`) → `ParseError { stage: "schema", message: "...", suggestion: "..." }` + line/col
3. **회귀 0**: 725/725 PASS 유지 (현재 spec.md 파일 영향 X)
4. **분량**: grammar +200 줄 / AST +60 줄 / schema +120 줄 / tests +400 줄 (총 ~800 줄)

## 🚫 Out of Scope

- **shell.inherit *해석*** (실제 shell 본문 inject) — `spec-08-07` (chat-react-compiler)
- **incremental inferChat diff 모드** — `spec-08-06`
- **Paper layerNameAnchor 매칭 *실행*** — `spec-08-05` (paper-mcp-adapter)
- **catalog 자동 추출 갱신** (component frontmatter 의 catalog.tier/family 와 catalog.json 동기화) — `spec-08-09` (lint)
- **multi-line YAML string / anchor** — 후속 검토 (현재 chat 흐름에서 불필요)

## ✅ Definition of Done

- [ ] grammar 확장 (frontmatter + 3 layer section)
- [ ] AST 타입 확장 (`ChatFrontmatter`, `NarrativeSection`, `StructureSection`, `HistorySection`)
- [ ] `validateChatSchema()` 구현 (3 type 검증)
- [ ] 새 테스트 (frontmatter parse / section split / schema fail 친화 메시지)
- [ ] playground/chats/ 6 파일 fixtures-regression 통과
- [ ] fixtures/chats/ frontmatter 있는 파일 parse 통과
- [ ] `pnpm test` 회귀 0 (≥ 725, 신규 테스트 추가분 +)
- [ ] `pnpm --filter studio build` exit 0
- [ ] walkthrough.md + pr_description.md ship commit
- [ ] PR 생성 + 사용자 검토
