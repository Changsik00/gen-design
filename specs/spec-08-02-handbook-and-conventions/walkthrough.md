# Walkthrough: spec-08-02

> handbook full 재작성 — phase-8 의 *agent 매개 chat 흐름* 비전을 *살아있는 핸드북* 으로 명문화.
> 도그푸딩 시뮬레이션 (PoC) + 사용자 비전 (chat = 자연어 + 3층 + agent) 을 시스템적으로 통합.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| handbook 분량 증가 폭 | (a) 320 → 500 (보존적) / (b) 320 → 700-900 (PoC + agent 도서관 + 새 컴포넌트) | **(b)** 결과 664 줄 | 3층 구조 / agent 사서 / §4.5 신규 / playground 인용 모두 필수. 단 plan 의 700-900 하단 (664). 추가 fluff 없이 충분 |
| README 진입점 형식 | (a) 첫 줄 / (b) 별도 섹션 (## 🚀 신규 진입자) / (c) 부록 | **(b)** | 첫 단락 직후 = *visibility 최대*. 부록은 늦음 |
| §1 mermaid 갱신 범위 | (a) 어휘만 spec → chat / (b) agent 매개 흐름 자체 재구조 | **(b)** | spec-08-01 이 어휘는 정합. 본 spec 의 가치는 *흐름의 형태* 갱신. agent → 컨텍스트 read → 제안 → 합의 → 갱신 |
| §2 Glossary 신규 정의 우선순위 | (a) chat 3층 / agent / shell / scene-component / layer-name 식별 / variant L1-L4 모두 / (b) 핵심만 (3층 + agent) | **(a) 모두** | Glossary 는 *참조 자료*. 분량 폭증 OK |
| §3 매트릭스 행 추가 | (a) chat.md 1 행 (이전) / (b) 3 분리 (정식 chats / 도그푸딩 / 회귀) + shell 행 | **(b)** | 가변성 등급 3 정도 (🪨 / 🌊 / 💨) 도 같이 — 디자이너 *자유* 와 *안정* 균형 시각화 |
| §4 워크플로 재작성 깊이 | (a) Page → Scene 어휘 갱신만 / (b) agent 매개 흐름으로 완전 재작성 | **(b)** | PoC 검증된 새 흐름 (자연어 → agent → 양방향 sync) 을 5 일 시나리오에 명시 |
| §4 Day 1 의 *Studio Paper preview* 상태 | (a) 현재 작동 / (b) phase-9 후보로 명시 | **(b)** | 사용자 재프레임 — 현재 디자이너 = MCP 환경 직접. Studio 패널은 미래 |
| §4.5 신규 vs §4 안에 통합 | (a) 별 섹션 / (b) Day 0 으로 통합 | **(a)** 별 §4.5 | 새 컴포넌트는 *드물지만 큰 작업*. 별로 두면 *발견 가능* + 회피 가능 (재사용 시나리오만 보고 싶은 디자이너에 노이즈 0) |
| §4.5 사례 = EmptyState 5 단계 | (a) 추상 가이드 / (b) 구체 사례 | **(b) 구체** | playground/chats/components/empty-state.chat.md 가 *진짜 산물*. 추상보다 강력 |
| §5 신규 원칙 P6/P7 vs §6 룰 | 원칙(왜) vs 룰(어떻게) | **원칙으로** | agent 도서관 사서 / chat 살아있음 *공식 약속*. 룰 (R7 layer-name) 은 *형식적* 컨벤션 |
| §6 R7 layer-name 컨벤션 | (a) `[chat:slug]` / (b) `[chat:type/slug]` (type = scenes/components) | **(b)** | type 분류가 paper-inference 의 *디렉토리 라우팅* 단서. PoC 사례 검증 |
| ADR-010 자리 예약 형식 | (a) §8 인덱스에 placeholder 행만 / (b) 인덱스 + 타임라인 | **(b)** | history 타임라인이 *결정의 흐름* 시각화. phase-8 행 추가 |
| 회귀 안전 약속 | 코드 변경 0 → 725/725 PASS 약속 | **유지** | 본 spec 은 docs only. studio 변경 0 |

## 💬 사용자 협의

- **주제**: phase-8 의 두 번째 spec 후보 우선순위
  - **사용자 의견**: "1번으로 진행" — handbook full 재작성 우선
  - **합의**: spec-08-02 = handbook + 진입점. 다른 spec 에 *근거 자료* 가 됨

- **주제**: 사용자 재프레임 (디자이너 = MCP 환경 직접 사용자)
  - **사용자 의견**: "디자이너에게 mcp 로 paper 를 연동해 주세요 라고 시작" / "paper / figma 는 별개로 디자이너가 현재는 관리 하는 수준"
  - **합의**: handbook §4 Day 1 에 Studio Paper preview 패널 = phase-9 후보 명시. 현재 디자이너 환경 = Claude Code + Paper MCP 직접

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 + 통합 테스트
- **명령**: `cd studio && pnpm test`
- **결과**: ✅ Passed (725 tests in 8.57s) — 회귀 0 (코드 변경 0)

#### 빌드
- **명령**: `pnpm --filter studio build`
- **결과**: ✅ exit 0 (`built in 211ms`)

### 2. 수동 검증 (handbook reading test)

1. **Action**: README 진입점 발견
   - **Result**: 첫 단락 직후 *"신규 진입자"* 섹션 노출 — 5초 안에 handbook 으로 이동.
2. **Action**: handbook §1 통독 (5초)
   - **Result**: 한 줄 정의 + mermaid 시각 흐름 + 4축 어휘 정합 박스. agent 매개 의도 즉시 이해.
3. **Action**: handbook §2 통독 (1분)
   - **Result**: chat 3층 + scene/component/shell + agent 사서 + layer-name 컨벤션 + Tier/Variant/Canonical 모두 정의됨.
4. **Action**: handbook §4 Profile Scene 통독 (5분)
   - **Result**: agent 매개 흐름 mermaid + 5 일 시나리오 (Day 1 Paper / Day 2 자연어 정리 / Day 3 양방향 sync / Day 4 글로벌 / Day 5 검증). playground 살아있는 예시 3 링크.
5. **Action**: handbook §4.5 EmptyState 사례 통독 (3분)
   - **Result**: 새 컴포넌트 5 단계 (chat.md / 코드 / catalog 자동 / status 갱신 / 재사용) 명시.
6. **Action**: 링크 정합성 (ADR + playground)
   - **Result**: 9 ADR + 3 playground markdown 링크 모두 OK. profile.chat.md 는 §4 가상 시나리오 (코드 블록 안) 라 markdown 링크 X.

### 분량
- **Before**: 320 줄
- **After**: 664 줄 (plan 의 700-900 하단)
- **분배** (대략): §1 60줄 / §2 130줄 / §3 60줄 / §4 130줄 / §4.5 130줄 / §5 60줄 / §6 60줄 / §7 70줄 / §8 50줄

## 🔍 발견 사항

- **Glossary 가 가장 큰 가치 더해짐** — chat 3층 / agent 사서 / shell 의 *공식 정의* 가 phase-8 후속 spec (특히 8-04 grammar, 8-06 incremental infer) 의 *근거 자료* 로 즉시 활용. 이전 §2 는 어휘 카탈로그 정도였으나 이제는 *시스템 어휘 사전*.
- **§4.5 의 EmptyState 사례 = PoC 의 최대 활용** — 추상 가이드보다 *진짜 만들어진 chat.md 인용* 이 강력. 외부 디자이너 alpha (W10) 시 *바로 따라할 수 있는* 모범.
- **agent 도서관 사서 P6 의 명문화** — agent.md (harness-kit operating rules) 와 별도로 *디자인 도구의 agent 약속*. 두 종 agent 의 분리 명확.
- **handbook §4 Day 1 의 *현재 환경* 명시** — Studio Paper preview 패널 = phase-9 후보. 사용자 재프레임 후 정직 표현. 현 디자이너 (= Claude Code 사용자 본인) 의 *진짜 환경* 을 가이드.
- **playground 링크 ↔ §4.5 사례** — chat.md 의 실제 형식 + 컨벤션이 *문서가 아니라 산물* 로 검증됨. spec-08-04 (grammar) 가 형식 강제 도입할 때 본 PoC 가 *형식의 baseline*.

## 🚧 이월 항목

- **chat-md grammar 의 형식 강제** — frontmatter 검증 / 섹션 의무 / shell 의미론 → spec-08-04
- **ADR-010 본문** — chat 승격 정책 (ADR-008 reconsider) → spec-08-05
- **gen-design paper-import 명령 구현** — handbook §7 의 ⭐ 0 후보 → spec-08-03
- **외부 디자이너 alpha** — handbook 의 *진짜* self-contained 검증 → spec-08-11

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작성 기간** | 2026-05-10 |
| **최종 commit** | `53bda49` (Ship commit 추가 후 갱신 예정) |
| **commit 수** | 9 (README + 8 handbook 섹션 갱신) + Ship commit |
