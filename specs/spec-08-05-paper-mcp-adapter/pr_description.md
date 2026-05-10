# spec-08-05: Paper MCP adapter — `gen-design paper-import` (⭐0 dogfooding gate)

## 🎯 목적

ADR-009 D-1 의 *단일 CLI* `studio/scripts/gen-design.ts` 첫 코드 도입 + `paper-import` 서브커맨드. **phase-8 dogfooding ⭐0 gate 통과** — Paper artboard → chat.md 흐름의 *입력* 표준화.

## 🔄 Before / After

### Before
- `gen-design.ts` 코드 0 (산발적 CLI: `chat-paper`, `paper-to-chat`, `chat-react`)
- Paper layer name `[chat:scenes/login]` ↔ chat frontmatter `identity` 매칭 *컨벤션만* 존재
- 6 PoC chat 의 입력 (PaperTreeNode JSON) 검증 / 표준 0

### After
- `gen-design <subcommand>` 단일 진입점 (라우터 패턴)
- `gen-design paper-import` — validate / enrich / chain inferChat
- Identity 파서 + 검증 + match 헬퍼 (paper-inference 모듈)
- 6 paper-tree fixtures + 18 round-trip 통합 테스트

## 📌 핵심 변경

| 파일 | 변경 |
|---|---|
| `studio/scripts/gen-design.ts` | 신규 — subcommand 라우터 |
| `studio/scripts/gen-design/paper-import.ts` | 신규 — 핵심 명령 (args + runtime + chain) |
| `studio/src/lib/paper-inference/identity.ts` | 신규 — `parseIdentity()` + `IdentityRef` |
| `studio/src/lib/paper-inference/validate.ts` | 신규 — `validateTree()` |
| `studio/src/lib/paper-inference/enrich.ts` | 신규 — `enrichWithIdentity()` (immutable) |
| `studio/src/lib/paper-inference/match.ts` | 신규 — `matchPaperToChat()` (3 상태) |
| `studio/src/lib/paper-inference/tree-types.ts` | `identity?` optional 필드 추가 (비파괴) |
| `studio/package.json` | `gen-design` script 등록 |
| `fixtures/paper-trees/` | 신규 — 6 tree.json (playground/chats 와 1:1) |
| 테스트 (8 파일 신규) | 72 신규 케이스 |

## 🔑 7 핵심 결정

1. **CLI 진입점 = 단일 라우터** (`studio/scripts/gen-design.ts`) — ADR-009 D-1 첫 코드
2. **subcommand 모듈화** — 명령마다 1 파일 (`gen-design/paper-import.ts`)
3. **identity 컨벤션** — `[chat:(scenes|components|_shell)/<kebab>]` 유일 표준
4. **MCP client 도입 X** — agent 가 MCP 호출 → 파일 dump. 본 spec 은 *입력 후 처리*
5. **PaperTreeNode 비파괴 확장** — `identity?` optional, 기존 영향 0
6. **`--chain inferChat`** — Paper → chat.md 한번에
7. **기존 `paper-to-chat` CLI 보존** — 회귀 0

## ✅ 검증

- **신규 테스트**: **72/72 PASS** (identity 12 / validate 5 / enrich 6 / match 4 / args 12 / runtime 10 / router 5 / round-trip 18)
- **전체 회귀**: 762 → **836/836 PASS**
- **`pnpm --filter studio build`**: exit 0
- **manual CLI**:
  - `pnpm gen-design paper-import .../login.tree.json --validate-only` → exit 0 + `✓ valid`
  - `pnpm gen-design paper-import .../login.tree.json --chain inferChat` → `<LoginForm extra_0="default" extra_1="md" />`

## 🔗 후속 spec 영향

- **spec-08-06** inferChat diff 모드 — `matchPaperToChat()` + enriched tree 활용
- **spec-08-07** chat-react-compiler — chain 패턴 확장 (`--chain react`?)
- **spec-08-08** gen-design merge — 라우터 활용 (`merge` 서브커맨드)
- **spec-08-09** gen-design lint — 라우터 활용 (`lint` 서브커맨드)

## 📦 Commits

1. `test(spec-08-05): add failing tests for parseIdentity`
2. `feat(spec-08-05): implement parseIdentity for layer names`
3. `feat(spec-08-05): extend PaperTreeNode with optional identity field`
4. `test(spec-08-05): add failing tests for validate and enrich`
5. `feat(spec-08-05): implement validate and enrich`
6. `feat(spec-08-05): implement matchPaperToChat helper`
7. `feat(spec-08-05): implement paper-import args parser`
8. `feat(spec-08-05): implement paper-import runtime with chain support`
9. `feat(spec-08-05): add gen-design CLI entry with subcommand router`
10. `test(spec-08-05): add 6 paper-tree fixtures aligned with playground/chats`
11. `test(spec-08-05): add round-trip integration tests for 6 fixtures`
12. `docs(spec-08-05): ship walkthrough and pr description`

## 🛡️ Rollback

단일 PR. `git revert <merge-commit>` 안전 — 신규 파일만 + `identity?` optional (비파괴) + script 1 추가.

## 📚 References

- [walkthrough.md](walkthrough.md) — 7 핵심 결정 + 후속 영향 + 교훈
- [ADR-009 gen-design CLI](../../docs/decisions/ADR-009-gen-design-cli.md) — D-1 단일 CLI 결정의 첫 코드
- [handbook §3 R7](../../docs/handbook.md) — `[chat:type/slug]` layer-name 컨벤션
