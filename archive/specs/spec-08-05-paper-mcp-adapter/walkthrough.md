# Walkthrough: spec-08-05 — Paper MCP adapter (`gen-design paper-import`)

## 🎯 한 줄 요약

ADR-009 D-1 의 *단일 CLI* `studio/scripts/gen-design.ts` 첫 코드 도입 + `paper-import` 서브커맨드 (Paper tree.json → enriched / chat.md) + identity 파서 (`[chat:type/slug]` ↔ chat frontmatter). **phase-8 dogfooding ⭐0 gate 통과**.

## 📊 Before / After

### Before

- ADR-009 결정 후 6 개월 — `gen-design.ts` 코드 0 (산발적 CLI: `pnpm chat-paper` / `pnpm paper-to-chat` / `pnpm chat-react`)
- Paper layer name `[chat:scenes/login]` ↔ chat.md frontmatter `identity: chats/scenes/login` 매칭 *컨벤션만* 존재 (R7) — 파서 / 검증기 0
- PoC 흐름의 *입력* (PaperTreeNode JSON) 추출 / 검증 / 표준 0

### After

- `studio/scripts/gen-design.ts` — subcommand 라우터 (지원: `paper-import`, 추가 예정: lint / merge / react / paper / diff)
- `gen-design paper-import <tree.json>` — validate / enrich (identity 자동 채움) / chain inferChat (chat.md)
- `parseIdentity()` — `[chat:scenes/login]` → `IdentityRef { kind, slug, raw, expectedPath }`
- `validateTree()` — 구조 + 중복 identity 경고
- `enrichWithIdentity()` — immutable walk + 모든 노드의 layer name 마커 자동 추출
- `matchPaperToChat()` — tree ↔ chat 파일 3 상태 분류 (match / tree-only / chat-only)
- 6 paper-tree fixtures + 18 round-trip 통합 테스트

## 🔑 7 핵심 결정

| ID | 결정 | 근거 |
|---|---|---|
| **D-1** | CLI 진입점 = `studio/scripts/gen-design.ts` 단일 라우터 | ADR-009 D-1 (YAGNI). 본 프로젝트 의존성 (peggy / typescript) 그대로 활용 |
| **D-2** | subcommand 모듈화 = `gen-design/paper-import.ts` (명령마다 1 파일) | 후속 명령 추가 시 라우터 1 줄 + 파일 추가만. 격리 |
| **D-3** | identity 컨벤션 = `[chat:(scenes\|components\|_shell)/<kebab>]` | R7. `_shell` 은 prefix 로 shell *암시 동의어* — 별도 slug 없음 |
| **D-4** | MCP client (stdio/SSE) 도입 X | 본 spec 은 *입력 후 처리* 만. MCP 호출은 agent 책임 (Claude session). Reconsider trigger 시 후속 |
| **D-5** | PaperTreeNode 비파괴 확장 (`identity?` optional) | 기존 paper-inference / paper compiler 영향 0 — 추가만 |
| **D-6** | `--chain inferChat` 옵션 | dogfooding 마찰 ↓ — 한 명령으로 Paper → chat.md 가능 |
| **D-7** | 기존 `paper-to-chat` CLI 보존 | 두 진입점 동시 존재 — 회귀 0. 통합은 후속 spec 후보 |

## 🧪 테스트 결과

| 영역 | 신규 | 결과 |
|---|---|---|
| identity (정상 / null / 결정성) | 12 | 12/12 PASS |
| validate (구조 / identity 컨벤션) | 5 | 5/5 PASS |
| enrich (단순 / 중첩 / immutable) | 6 | 6/6 PASS |
| match (3 상태) | 4 | 4/4 PASS |
| paper-import args (정상 / 오류) | 12 | 12/12 PASS |
| paper-import runtime (validate / enrich / chain / stdin / help) | 10 | 10/10 PASS |
| gen-design router | 5 | 5/5 PASS |
| round-trip 6 fixture × 3 모드 | 18 | 18/18 PASS |
| **총 신규** | **72** | **72/72 PASS** |
| **전체 회귀** | **836** | **836/836 PASS** |
| **studio build** | — | exit 0 |
| **manual CLI** | `--validate-only` / `--chain inferChat` | PASS |

## 🔗 후속 spec 연결점

| spec | 활용 |
|---|---|
| **spec-08-06** inferChat diff 모드 | `matchPaperToChat()` 헬퍼 + enriched tree → 변경분 검출 |
| **spec-08-07** chat-react-compiler | 본 spec 의 chain 흐름 — chat.md → React 통합 |
| **spec-08-08** gen-design merge | 라우터 패턴 활용 — `merge` 서브커맨드 추가 |
| **spec-08-09** gen-design lint | 라우터 패턴 활용 — `lint` 서브커맨드 추가 |

## 💬 사용자 협의

- **MCP client 도입 X** — 현재는 agent 가 Paper MCP 사용 → tree.json 파일 dump. 본 spec 은 *입력 후 처리* 만. Reconsider trigger 시 (agent 의 수동 추출이 주 1회 마찰 보고) 후속 spec 에서 MCP client 도입 검토.
- **identity 컨벤션 = 유일 표준** — `[chat:type/slug]` 외 형식 (`[scenes:login]`, raw `chats/scenes/login`) 인식 X. 명확한 단일 표준 합의.
- **PaperTreeNode 비파괴 확장** — `identity?` optional 추가만. 기존 paper-inference / paper compiler 28 fixture 회귀 0.

## 🎓 교훈

- **dogfooding 의 가치 (phase-8 의 핵심)** — playground/chats 6 파일과 1:1 대응하는 paper-tree fixture 6 개를 만들면서 *실제 Paper 출력의 layer name 컨벤션* 이 정착. 이론에서 그칠 수 있던 R7 (handbook) 가 *실행 가능한* 표준이 됨.
- **단일 CLI 패턴의 가치** — `gen-design <subcommand>` 가 후속 4 spec (06/07/08/09) 의 *진입점* 으로 작동. ADR-009 결정의 *첫 코드* 를 본 spec 이 만들었다는 의미가 phase-8 끝까지 영향.
- **MCP 직접 호출 회피의 trade-off** — agent-mediated 흐름은 *간단* 하지만 *수동 마찰* 가능. 측정 가능 trigger (주 1회 마찰) 에 따라 향후 변경 가능성. 명시적 미래 결정 deferring.
- **chain 모드의 발견** — `--chain inferChat` 가 dogfooding 시나리오 (Paper → chat.md 한번에) 의 자연 패턴. 후속 spec 에서 다른 chain (e.g., `--chain react`) 도 가능 — 라우터 패턴이 자연스럽게 받아들임.
