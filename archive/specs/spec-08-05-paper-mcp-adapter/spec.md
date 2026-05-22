# spec-08-05: Paper MCP adapter — `gen-design paper-import` (⭐0 dogfooding gate)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-08-05` |
| **Phase** | `phase-08` (chat-agent-flow) |
| **Branch** | `spec-08-05-paper-mcp-adapter` |
| **상태** | Planning |
| **타입** | Feature (CLI + adapter + identity 파서) |
| **Integration Test Required** | yes (PoC chat → tree.json round-trip) |
| **작성일** | 2026-05-10 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

ADR-009 D-1 채택 — **단일 CLI** `studio/scripts/gen-design.ts` 가 phase-8 첫 spec 안에서 도입 예정. 그러나 *현 시점* (spec-08-05 시작):

- `studio/scripts/gen-design.ts` 미존재 — 산발적 CLI (`pnpm paper-to-spec`, `pnpm chat-paper`, `pnpm spec-react`) 만
- Paper artboard → chat.md 흐름의 *입력* (PaperTreeNode JSON) 추출 자동화 0
- chat.md frontmatter 의 `identity` 필드 (`chats/scenes/login`) ↔ Paper layer name (`[chat:scenes/login]`) 매칭 *컨벤션만* 존재 (R7) — 파서 / 검증기 0

### 문제점

1. **gen-design CLI 진입점 부재**: ADR-009 결정 후 6 개월 — `gen-design.ts` 코드 0. 후속 spec (08-06 ~ 08-09) 모두 이 CLI 가 필요
2. **Paper → tree.json 추출 표준 0**: 현재 디자이너 / agent 가 *수동* 으로 Paper MCP 호출 → tree 구조 즉흥 작성. 검증 / 정규화 없음
3. **Identity 파서 없음**: PoC `playground/chats/scenes/login.chat.md` 의 frontmatter `paper.layerNameAnchor: "[chat:scenes/login]"` 가 *기록만* 됨 — 실제로 Paper layer name 에서 추출 / 매칭 안 됨
4. **dogfooding gate**: phase-8 의 핵심 검증 (Paper 변경 → chat 갱신 → React 컴파일) 시작 자체가 막힘 — *입력* 이 없음

### 해결 방안 (요약)

본 spec 은 *MCP client 도입 X* — 대신 **tree.json 입력 표준화 + identity 파서 + gen-design CLI 진입점** 까지:

1. **`studio/scripts/gen-design.ts` 신규** — ADR-009 D-1 의 단일 CLI 진입점 (subcommand 라우터). `pnpm gen-design <cmd>` script 추가
2. **`gen-design paper-import <tree.json>` 서브커맨드** — PaperTreeNode JSON 검증 + identity 파싱 + (옵션) inferChat chain
3. **Identity 파서** — `[chat:scenes/login]` → `{ kind: "scene", slug: "login" }`. Paper layer name 의 `[chat:type/slug]` 마커 추출. spec-08-04 의 frontmatter.identity 와 자동 매칭
4. **검증기** — PaperTreeNode 구조 + identity 컨벤션 (kind ∈ {scenes, components, _shell})
5. **chain 모드**: `gen-design paper-import tree.json --chain inferChat --output chat.md` — Paper artboard → chat.md 한번에

> **MCP client (stdio/SSE) 도입 X** — 현재는 agent (Claude session 안 Paper MCP 사용자) 가 tree.json 을 추출. 본 spec 은 *추출 후 처리* 표준만. Reconsider trigger: agent 의 수동 추출이 주 1회 이상 마찰 보고 시 → MCP client 도입 검토.

## 🎯 요구사항

### Functional Requirements

#### F-1: `studio/scripts/gen-design.ts` — 단일 CLI 진입점

- subcommand 라우터: `gen-design <cmd> [args...]`
- 지원 명령 (본 spec): `paper-import` (추후 spec 에서 lint / merge / react / paper / diff 추가)
- `pnpm gen-design ...` script 등록 (`studio/package.json`)
- 도움말: `gen-design --help` / `gen-design <cmd> --help` (각 명령 도움말)
- 종료 코드: 0 (성공) / 1 (오류) / 2 (사용법 위반)

#### F-2: `gen-design paper-import <tree.json>` — 핵심 명령

- 입력: PaperTreeNode JSON 파일 (또는 `--from-stdin`)
- 출력 (기본): *enriched* PaperTreeNode JSON (각 노드에 `identity?: { kind, slug }` 추가) → stdout
- 옵션:
  - `--output <path>` — 파일 저장
  - `--validate-only` — 검증만 (변경 없음)
  - `--chain inferChat` — inferChat 까지 chain → chat.md 출력
  - `--threshold 0.8` — inferChat threshold (chain 시)
- 검증:
  - 구조 (id / name / component / children)
  - identity 컨벤션 (kind ∈ {scenes, components, _shell}, slug = kebab-case)
  - 중복 identity 검출 (한 artboard 안 같은 `[chat:scenes/login]` 두 번 등장 시 경고)

#### F-3: Identity 파서

```ts
function parseIdentity(layerName: string): IdentityRef | null {
  // "[chat:scenes/login]" → { kind: "scene", slug: "login", raw: "[chat:scenes/login]" }
  // "BrandHeader" → null (마커 없음)
  // "[chat:components/empty-state]" → { kind: "component", slug: "empty-state" }
  // "[chat:_shell]" → { kind: "shell", slug: "_shell" }
  // 잘못된 형식 → ParseError
}

interface IdentityRef {
  kind: "scene" | "component" | "shell";
  slug: string;
  raw: string;          // 원본 layer name 마커
  expectedPath: string; // 예상 chat.md 경로 (chats/scenes/login.chat.md)
}
```

- 정규식: `/\[chat:(scenes|components|_shell)\/([a-z0-9-]+)\]/`
- 누락 시 null (오류 X — 모든 layer 가 chat 관련일 필요는 없음)

#### F-4: PaperTreeNode 확장

```ts
interface PaperTreeNode {
  id: string;
  name: string;
  component: string;
  styles?: Record<string, string>;
  fills?: PaperFill[];
  children?: PaperTreeNode[];
  /** spec-08-05 추가 — paper-import 가 자동 채움. 신규 입력에는 부재. */
  identity?: IdentityRef;
}
```

#### F-5: 통합 — chat.md frontmatter 와 매칭

- enriched tree 의 `identity.expectedPath` ↔ frontmatter.identity 비교 헬퍼 (`matchPaperToChat(tree, chatFile): MatchResult`)
- 매칭 결과: `match` / `tree-only` (chat 없음) / `chat-only` (paper 안 layer 없음)
- 본 spec 은 *매칭 헬퍼만* — 실제 sync 액션은 spec-08-06 (inferChat diff) 가 사용

### Non-Functional Requirements

1. **회귀 0**: 기존 paper-to-spec CLI 영향 0 — `gen-design paper-import` 는 *별도* 진입점. 기존 CLI 는 alias 로 보존
2. **결정성**: 같은 tree.json 입력 → 같은 enriched tree 출력 (deep equal)
3. **테스트 커버리지**: identity 파서 (10+ 케이스) + paper-import CLI (8+ 케이스) + chain 모드 (3+ 케이스)
4. **fixture**: `playground/chats/` 6 파일에 대응하는 tree.json fixture 6 개 (`fixtures/paper-trees/`) — round-trip 검증

## 🚫 Out of Scope

- **MCP stdio/SSE client 도입** — 본 spec 은 tree.json *입력 후 처리* 만. agent 가 Paper MCP 로 tree 추출 후 파일로 dump 가정. Reconsider trigger 시 후속 spec
- **inferChat diff 모드** — `spec-08-06` (변경분만 갱신)
- **chat → Paper 역방향** — 기존 `chat-paper` CLI (phase-7) 보존 — 본 spec 은 *Paper → chat* 방향만
- **gen-design lint / merge / react / diff / paper** — 별도 spec (08-08, 08-09)
- **identity 자동 생성** (Paper layer 가 마커 없을 때) — 디자이너 / agent 의 수동 작업
- **studio runtime 통합** — phase-9 후보

## ✅ Definition of Done

- [ ] `studio/scripts/gen-design.ts` 신규 (subcommand 라우터 + `paper-import` 서브커맨드)
- [ ] `studio/package.json` 에 `gen-design` script 등록
- [ ] Identity 파서 (`parseIdentity`) + 단위 테스트 10+
- [ ] `paper-import` CLI 단위 테스트 8+ (validate / chain / output / from-stdin / 오류)
- [ ] `matchPaperToChat()` 헬퍼 + 단위 테스트 4+
- [ ] `fixtures/paper-trees/` 6 개 tree.json fixture (playground/chats/ 와 1:1)
- [ ] 통합 테스트 — fixture tree → paper-import → chat.md 와 playground/chats/ 비교
- [ ] `pnpm test` 회귀 0 (≥ 762, 신규 테스트 추가분 +)
- [ ] `pnpm --filter studio build` exit 0
- [ ] `gen-design --help` / `gen-design paper-import --help` 도움말 검증
- [ ] walkthrough.md + pr_description.md ship commit
- [ ] PR 생성 + 사용자 검토
