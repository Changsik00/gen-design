# Phase Ship: phase-08 — chat-agent-flow

> Phase base branch (`phase-08-chat-agent-flow`) → `main` 최종 PR.

## 📋 Overview

phase-7 이 *spec.md grammar + Paper/React 컴파일러* 인프라를 만들었다면, phase-08 은 *그 인프라 위에 살아있는 사용자 경험* 을 구축한다. PoC 도그푸딩 시뮬레이션 (`poc-chat-agent-flow`) 에서 발견된 *어휘 충돌 / 디렉토리 3 역할 충돌 / Paper MCP 어댑터 부재 / chat 3층 의미 / agent 도서관 사서 역할* 비전을 시스템 코드로 정착. 인프라 7 spec 으로 *닫힌 루프* (Paper → chat → React) 완성, 활용 4 spec (merge / lint / studio-runtime / external-alpha) 은 phase-9 이연.

## 📦 Scope: 계획 vs 실제

| 구분 | 항목 | 비고 |
|:---:|---|---|
| ✅ 완료 | spec-08-01: 어휘 / 디렉토리 / 코드 일괄 rename — `spec` → `chat`, `*Page` → `*Scene` (PR #48) | base branch 분기 이전에 main 직 머지 |
| ✅ 완료 | spec-08-02: handbook full 재작성 + README 진입점 + 새 컴포넌트 워크플로 (PR #49) | |
| ✅ 완료 | spec-08-03: ADR-010 chat 승격 정책 (Hybrid 확정) (PR #50) | |
| ✅ 완료 | spec-08-04: chat.md grammar 확장 — frontmatter + 3 layers + shell 의미론 (PR #51) | |
| ✅ 완료 | spec-08-05: Paper MCP adapter — `gen-design paper-import` (PR #52) | |
| ✅ 완료 | spec-08-06: inferChat diff 모드 — Narrative/History 보존 + Paper 변경 patch (PR #53) | |
| ✅ 완료 | spec-08-07: chat → React 컴파일러 — shell inherit + scene 통합 TSX (PR #54) | |
| ⏭ 이연 | spec-08-08: gen-design merge — shell 승격 휴리스틱 | phase-9 후보 (📌 D-1) — 인프라 ship 후 실 사용 데이터로 정의 |
| ⏭ 이연 | spec-08-09: gen-design lint — catalog ↔ chats ↔ templates 정합 | phase-9 후보 (📌 D-1) |
| ⏭ 이연 | spec-08-10: studio-runtime — fixtures 빌드타임 → 런타임 fetch | phase-9 후보 (📌 D-1) |
| ⏭ 이연 | spec-08-11: external-alpha — 외부 디자이너 1 명 도그푸딩 | phase-9 후보 (📌 D-1) — 인프라 안정 후 외부 노출이 안전 |

## 📊 Spec Summary

| PR | Spec | 핵심 변경 |
|---|---|---|
| #48 | spec-08-01-rename-and-restructure | `spec/` → `fixtures/chats/{scenes,components}/` + `playground/chats/` + `chats/`. `*Page` → `*Scene`. `studio/lib/spec-md*` → `chat-md*`. 28 fixture 분류. 회귀 0 |
| #49 | spec-08-02-handbook-and-conventions | handbook §1~§7 재작성 (agent-매개 5일 시나리오 + chat 어휘 + agent 도서관 사서 + identity 원칙). §4.5 새 컴포넌트 워크플로 |
| #50 | spec-08-03-adr-010-chat-promotion-policy | ADR-010 작성 (Hybrid = 제안 자동 + 실행 수동). 5 결정 + 3 reconsider trigger. ADR-008 reconsider. gen-design merge 의미 *조력자* 로 명확화 |
| #51 | spec-08-04-chat-md-grammar | chat.md grammar 확장 — frontmatter (yaml) + Narrative + Structure + History + shell.{inherit,exclude}. 4 신규 AST 노드. backward-compat (.spec.md 도 인식) |
| #52 | spec-08-05-paper-mcp-adapter | `gen-design paper-import` CLI 신규. `parseIdentity` (layer-name `[chat:type/slug]`) + `validate` + `enrich` + `matchPaperToChat`. 6 round-trip fixture |
| #53 | spec-08-06-infer-chat-diff | `gen-design diff` CLI 신규. `inferChatDiff` — Narrative/History/frontmatter bit-for-bit 보존 + Structure 영역 patch. 5 시나리오 (text/variant/add/remove/mixed) |
| #54 | spec-08-07-chat-react-compiler | `gen-design react` CLI 신규. `compileScene` + `mergeShellAndScene` (shell.inherit + exclude + `{{scene.content}}` 치환). 단일 TSX 출력 (Next.js layout 패턴). dogfood integration: login scene |

## ✅ Success Criteria Checklist

> phase.md 의 9 성공 기준 중 1~6 (인프라) 진행, 7~9 (활용) phase-9 이연.

| # | 기준 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | 어휘 전환 완료 — `grep` 잔재 0 + ADR-010 작성 | ✅ PASS | `docs/decisions/ADR-010-chat-promotion-policy.md` 존재. grep 81 매치 / 41 파일 — 모두 *역호환 (.chat.md + .spec.md + .md 동시 인식) / UI 텍스트 / 역사적 주석* 의도된 보존 (spec-08-01 walkthrough D-8, D-9) |
| 2 | `fixtures/chats/` + `playground/chats/` + `chats/` 분리 | ✅ PASS | 세 디렉토리 모두 존재. fixtures 28 (scene 7 + component 21), playground 6 (PoC), chats 6 (production 슬라이스 자리). 런타임 동적 fetch 는 spec-08-10 이연 명시 |
| 3 | chat.md grammar 확장 — 28 fixture parse | ✅ PASS | peggy frontmatter + 3 layers + shell.{inherit,exclude}. `chat-md/parser` + `chat-md/grammar` 단위 테스트 PASS (919/919) |
| 4 | Paper MCP → CLI — `pnpm gen-design paper-import` | ✅ PASS | spec-08-05 ship — 6 round-trip fixture PASS (commit `90fabd0`). `parseIdentity` + `validate` + `enrich` + `matchPaperToChat` |
| 5 | inferChat diff 모드 — 5+ 시나리오 PASS | ✅ PASS | `fixtures/diff-scenarios/` 5 시나리오 (A-text-only / B-variant / C-add / D-remove / E-mixed) 통합 테스트 PASS (commit `5ccd3aa`) |
| 6 | chat → React 컴파일러 — shell inherit + 결정성 + ts-diagnose 0 | ✅ PASS | spec-08-07 dogfood integration (commit `1566ac4`) — login scene 컴파일 → ts-diagnose critical 0 + build exit 0. shell + scene 단일 TSX |
| 7 | `gen-design merge` | ⏭ 이연 | phase-9 (spec-08-08) — 📌 D-1 |
| 8 | `gen-design lint` | ⏭ 이연 | phase-9 (spec-08-09) — 📌 D-1 |
| 9 | 외부 디자이너 alpha 1 명 | ⏭ 이연 | phase-9 (spec-08-11) — 📌 D-1 |

**종합**: 6/6 PASS (인프라) + 3 phase-9 이연 (활용). 인프라 닫힌 루프 완성 100%.

## 🧪 Integration Test Results

| # | 시나리오 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | 재사용 흐름 자동화 — agent 가 catalog 매칭 + 재사용 후보 능동 제시 | ✅ PASS | spec-08-02 handbook §4.5 (new component workflow) + spec-08-04 grammar (`catalog.{tier,family}`) 기반. `playground/chats/components/` 3 component 가 누적 예시 |
| 2 | shell 승격 — `gen-design merge` 휴리스틱 | ⏭ 이연 | spec-08-08 의존 → phase-9 |
| 3 | 역방향 동기 — Paper 수정 → chat.md Structure 갱신 + Narrative/History 보존 | ✅ PASS | `fixtures/diff-scenarios/` 5 시나리오 PASS. emit bit-for-bit 보존 (commit `7064d23`) |
| 4 | 통짜 페이지 컴파일 — shell + scene 단일 TSX | ✅ PASS | spec-08-07 dogfood — `pnpm gen-design react login --chat-root playground/chats` → 단일 TSX, ts-diagnose 0, 결정성 100% (build PASS) |
| 5 | 외부 디자이너 alpha — handbook self-contained 검증 | ⏭ 이연 | spec-08-11 의존 → phase-9 |

**자동 테스트**: 125 test files / 919 tests PASS (11.69s). `pnpm build` exit 0 (451ms).

## 🏗 Architecture Decisions

- **어휘 분리 (spec ↔ chat)**: harness-kit 의 `spec/` (작업 흔적) 과 디자인 도구 산출물의 *spec.md* 가 같은 이름이라 신규 디자이너 첫 5분에 혼란. *chat* 어휘 (소통 채널 + 명령 + 부산물) 로 후자 분리. 회귀 fixture / 도그푸딩 / 정식 산출물 셋의 *3 역할 충돌* 도 디렉토리 분리로 동시 해소 (spec-08-01).
- **chat = 3층 구조 (Narrative + Structure + History)**: PoC 에서 자연 출현한 패턴을 grammar 로 정착. *Narrative* = 디자이너 의도, *Structure* = Paper 시각 구조, *History* = 변경 history. 이 3층이 *agent 가 매개* 할 때 디자이너 자연어 ↔ Paper 시각 ↔ chat 텍스트 간 lossy 변환을 *덜 잃게* 한다 (spec-08-04).
- **ADR-010 Hybrid (제안 자동 + 실행 수동)**: ADR-008 옵션 B (글로벌 직접 편집) 의 수동 정신 유지 + chat-매개 흐름의 *agent 능동 제안* 가치 결합. *제안* 과 *실행* 의 분리가 *agent 능력* 과 *디자이너 권한* 의 자연 균형 (spec-08-03).
- **CLI 통합 — `gen-design` 단일 진입점**: ADR-009 의 5 명령 중 3 명령 (paper-import / diff / react) 구현. shell 승격 휴리스틱과 lint 는 *축적 데이터 기반* 휴리스틱이라 실 사용 후 정의 위해 phase-9 이연 (📌 D-1).
- **닫힌 루프 우선, 외부 검증 후순위**: phase-08 의 *인프라 4 spec (8-04~8-07)* 가 자체로 dogfooding 가능 → 외부 alpha (8-11) 는 *인프라 안정 후* 노출이 안전. 활용 spec 4 개 모두 phase-9 로 결집.

## ⚠️ Known Issues / Technical Debt

- **CLI `gen-design merge` / `lint` 미구현 (ADR-009 ⭐5 / ⭐4)**: phase-9 후보. 실 사용 데이터 (`chats/` production 슬라이스 누적) 후 휴리스틱 정의가 효율적이라는 결정 (📌 D-1).
- **Studio UI 의 런타임 fetch 부재 (spec-08-10 이연)**: 현재 `fixtures.generated.ts` 빌드타임 인덱스 방식. fixtures + playground + chats 세 source 동적 인식은 spec-08-10 (phase-9) 에서 처리. chat 편집 UI (3층 표시) + shell preview 도 같이 묶임.
- **외부 디자이너 alpha 미실행 (W10 이연)**: phase-7 에서 명시 이연된 항목 (W10) 이 phase-08 에서도 이연. handbook self-contained 검증의 *진짜 도그푸딩 N=1+* 데이터 부재. phase-9 의 spec-08-11 에서 처리 예정.
- **어휘 잔재 81 매치**: spec-08-01 walkthrough D-8/D-9 에서 *역호환 보존* 으로 명시된 의도된 잔재 (`.spec.md` 인식 + 역사적 주석 + UI 텍스트). 시맨틱 잔재 0. 향후 *완전 전환* 시 spec-x 후보.

## 📝 Follow-up Work

- **phase-9 전체 계획**: 활용 4 spec (8-08 merge / 8-09 lint / 8-10 studio-runtime / 8-11 external-alpha) 정리 + Figma adapter (phase-7 spec-7-07 PoC) 정착 후보.
- **harness-kit upstream**: phase-4 회고 발견 C4 (phase-ship.md 템플릿 부재) 는 0.8.0 에서 해소됨. 본 phase ship 이 그 템플릿 활용.
- **handbook §8 ADR-010 인용 보강**: spec-08-02 에서 §8 placeholder 만 추가. 본 PR 머지 후 ADR-010 의 reconsider trigger 가 phase-9 spec-08-11 의 *데이터 수집 가설* 로 인용되어야.

## 📊 Stats

- **Files changed**: 100 (+8,914 / -114) — `git diff main...phase-08-chat-agent-flow` (spec-08-01 제외, base branch 분기 후 기준)
- **Commits**: 62 (spec-08-02 ~ 08-07 + ship 정리)
- **Test suites**: 125 files / 919 tests, all PASS (11.69s)
- **Build**: exit 0 (vite 451ms, ts-diagnose critical 0)
- **Specs**: 7 완료 (08-01~07) + 4 이연 (08-08~11 → phase-9)
- **PR 수**: 7 spec PR (#48 ~ #54) — #48 main 직 머지, #49~#54 가 본 Phase PR 에 포함
- **신규 ADR**: 1 (ADR-010 chat-promotion-policy)
- **신규 CLI 서브명령**: 3 (`paper-import` / `diff` / `react`)
