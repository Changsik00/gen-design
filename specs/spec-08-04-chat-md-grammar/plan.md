# Implementation Plan: spec-08-04

## 📋 Branch Strategy

- 신규 브랜치: `spec-08-04-chat-md-grammar`
- 시작 지점: `phase-08-chat-agent-flow`
- 첫 task 가 브랜치 생성

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **frontmatter parsing 위치 = peggy grammar 내부** (별도 YAML 파서 도입 X) — *단일 파서 / 단일 에러 좌표계* 이점. trade-off: YAML 1.2 fully-compatible X (subset 만)
> - [ ] **3-layer section 의 *순서 자유*** — Narrative / Structure / History 가 어느 순서로 등장해도 OK. 의미 분리만 보장
> - [ ] **shell semantics = 기록만** — `shell.inherit/exclude` 가 AST 에 들어가지만 *해석* (inject) 은 spec-08-07. 본 spec 은 *문법 / 검증* 까지

> [!WARNING]
> - [ ] **AST breaking change** — `Document.body` deprecate. compile 단계 (paper / react) 가 새 `structure.body` 사용으로 *동시 갱신* 필요 — Task 6 에서 처리
> - [ ] **fixtures-regression** — 28 개 fixtures/chats 파일 중 frontmatter 없는 legacy 형식 존재 가능 → Task 5 에서 케이스 분리

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```mermaid
flowchart TB
  IN[chat.md 텍스트]
  PA[peggy parser<br/>= grammar/chat-md.ts]
  AST[Document AST<br/>frontmatter + 3 sections]
  SCH[validateChatSchema<br/>type 별 필수 검증]
  RES[ParseResult<br/>ok / errors]

  IN --> PA --> AST --> SCH --> RES

  subgraph Downstream [후속 spec - Out of scope]
    PR[paper compiler<br/>spec-08-05]
    RC[react compiler<br/>spec-08-07]
    LN[lint<br/>spec-08-09]
    MR[merge<br/>spec-08-08]
  end

  AST -.frontmatter.identity.-> PR
  AST -.frontmatter.shell.-> RC
  AST -.catalog.-> LN
  AST -.shell promotion.-> MR
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **frontmatter parser** | peggy grammar 내부 (외부 YAML 라이브러리 X) | 단일 파서 / 단일 에러 좌표계 / build size 절감. YAML-lite subset 으로 충분 (현재 chat 흐름의 모든 frontmatter 가 subset 안에 들어감) |
| **3-layer 인식** | `## ` heading 의 *명칭* 으로 분류 (`Narrative` / `Structure` / `History`) — emoji 는 옵션 | 디자이너의 자유 형식 보존 + 의미 분류. 강한 정규화는 마찰 |
| **shell semantics** | grammar 차원 = *기록만* (AST 에 raw 보존). 해석은 compile 단계 | 책임 분리 — grammar 는 *문법*, compile 은 *의미*. 후속 spec-08-07 가 inherit/exclude 적용 |
| **schema 검증** | parse 후 별도 단계 (`validateChatSchema`) | parse 실패와 schema 실패의 에러 분리 → friendly error |
| **backward compat** | frontmatter 없으면 `frontmatter: null` + `body` 노출 (legacy spec.md) | 기존 28 fixtures + 725 테스트 영향 0 |

## 📂 Proposed Changes

### grammar 확장

#### [MODIFY] `studio/src/lib/chat-md/grammar/chat-md.ts`

기존 217 줄 → 약 420 줄. 추가 절:

```text
Document
  = fm:Frontmatter? title:Title? sections:Section* {
      const split = splitSections(sections, location());
      return {
        type: "Document",
        frontmatter: fm ?? null,
        title: title ?? null,
        narrative: split.narrative,
        structure: split.structure,
        history: split.history,
        body: split.legacyBody,  // backward-compat
      };
    }

Frontmatter "frontmatter"
  = "---" Newline lines:FmLine* "---" Newline { return parseFmTree(lines); }

FmLine
  = key:FmKey ":" __ value:FmValue Newline    { return { key, value }; }
  / Indent2 nested:FmLine                     { return { nested }; }
  / Comment Newline                           { return null; }
  / EmptyLine

FmValue
  = String / Number / Boolean / Null / Array / Inline   { ... }

Title  = "#" __ text:LineRest Newline { return text.trim(); }

Section
  = SectionHeading body:Block*

SectionHeading
  = "##" __ emoji:Emoji? __ name:SectionName __ Newline
    { return { kind: classifySection(name) }; }   // Narrative / Structure / History / Other
```

핵심 헬퍼 (action block 안):
- `parseFmTree(lines)` — indent-based nesting → JSON 객체
- `splitSections(sections, loc)` — 3-layer 분류 + Other (Narrative-호환) 합치기
- `classifySection(name)` — `/^Narrative$/i` / `/^Structure$/i` / `/^History$/i` 매칭

#### [MODIFY] `studio/src/lib/chat-md/parser/ast-types.ts`

```text
+ export interface ChatFrontmatter { ... }
+ export interface NarrativeSection { ... }
+ export interface StructureSection { body: Block[]; ... }
+ export interface HistorySection { ... }

  export interface Document {
    type: "Document";
+   frontmatter: ChatFrontmatter | null;
+   title: string | null;
+   narrative: NarrativeSection | null;
+   structure: StructureSection | null;
+   history: HistorySection | null;
-   body: Block[];
+   /** @deprecated — frontmatter 없는 legacy spec.md 호환용 */
+   body?: Block[];
  }
```

### schema 검증

#### [NEW] `studio/src/lib/chat-md/parser/schema.ts`

```text
export function validateChatSchema(ast: Document): ParseError[] {
  if (!ast.frontmatter) return [];   // legacy → skip
  const fm = ast.frontmatter;
  const errors: ParseError[] = [];

  if (!fm.type)  errors.push(missingField("type", fm));
  if (!fm.name)  errors.push(missingField("name", fm));

  switch (fm.type) {
    case "shell":
      if (!fm.applies) errors.push(missingField("applies", fm));
      if (fm.shell)    errors.push(invalidField("shell", "shell type 은 inherit/exclude X", fm));
      break;
    case "scene":
      if (!fm.identity) errors.push(missingField("identity", fm));
      if (fm.identity && !fm.identity.startsWith("chats/scenes/"))
        errors.push(invalidField("identity", "scene identity 는 chats/scenes/ prefix", fm));
      break;
    case "component":
      if (!fm.identity)            errors.push(missingField("identity", fm));
      if (!fm.catalog?.tier)       errors.push(missingField("catalog.tier", fm));
      if (!fm.catalog?.family)     errors.push(missingField("catalog.family", fm));
      if (fm.identity && !fm.identity.startsWith("chats/components/"))
        errors.push(invalidField("identity", "component identity 는 chats/components/ prefix", fm));
      break;
    default:
      errors.push(invalidField("type", `unknown type "${fm.type}"`, fm));
  }
  return errors;
}
```

#### [MODIFY] `studio/src/lib/chat-md/parser/index.ts`

```text
- export function parse(text: string): ParseResult { ... }
+ export function parse(text: string, opts?: { skipSchema?: boolean }): ParseResult {
+   try {
+     const ast = parser.parse(text) as Document;
+     const schemaErrors = opts?.skipSchema ? [] : validateChatSchema(ast);
+     return { ok: schemaErrors.length === 0, ast, errors: schemaErrors };
+   } catch (e) { ... }
+ }
```

### 테스트

#### [NEW] `studio/src/lib/chat-md/parser/__tests__/frontmatter.test.ts`

- top-level k:v / nested object / array / boolean / null / number / quoted string
- comment 무시
- 잘못된 indent → ParseError stage:"parse"

#### [NEW] `studio/src/lib/chat-md/parser/__tests__/sections.test.ts`

- 3-layer 분리 (순서 자유)
- emoji 옵션 (있어도 / 없어도 분류)
- ` ```jsx ... ``` ` 안에서 ComponentTag parse
- Narrative 안의 markdown 보존

#### [NEW] `studio/src/lib/chat-md/parser/__tests__/schema.test.ts`

- shell type 검증 (applies 필수 / shell.* 금지)
- scene type 검증 (identity prefix)
- component type 검증 (catalog.tier/family 필수)
- 친화적 message + suggestion

#### [MODIFY] `studio/src/lib/chat-md/__tests__/fixtures-regression.test.ts`

- playground/chats/ 6 파일 추가
- frontmatter 있는 파일 → schema 검증 PASS 확인

### 후속 spec 영향 사전 정리

#### [MODIFY] `studio/src/lib/chat-md-compiler/...`

기존 `Document.body` 사용처를 `Document.structure?.body ?? Document.body ?? []` 로 안전 폴백.

> 본 spec 의 Task 6 가 *최소 변경* 으로 backward-compat 보장 (compile 의미 변경 X — 단순 경로 변경).

## 🧪 검증 계획

### 단위 테스트
```bash
cd studio && pnpm test
```

기대: 725 + 신규 (frontmatter 12+ / sections 8+ / schema 10+) = ≥ 755 PASS.

### 통합 테스트 — fixtures-regression
```bash
cd studio && pnpm test fixtures-regression
```

playground/chats/ 6 + fixtures/chats/ 일부 PASS 확인.

### 수동 검증
1. `playground/chats/scenes/login.chat.md` 직접 parse → AST 의 `frontmatter.shell.exclude = ["BrandHeader"]` 확인
2. `playground/chats/_shell.chat.md` parse → `frontmatter.type = "shell"`, `applies = "scenes"` 확인
3. 잘못된 chat (e.g. scene without identity) → `errors[0].stage = "schema"`, suggestion 포함

## 🔁 Rollback Plan

- 단일 PR. 머지 후 발견 시 `git revert <merge-commit>` — backward-compat 가 보장되므로 영향 0.
- AST 확장은 *additive* (`Document` 의 새 필드는 optional 또는 nullable) → 기존 코드 깨짐 X.

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
