# spec-11-04: Dogfooding Alpha — zero → React TSX 실증

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-11-04` |
| **Phase** | `phase-11` |
| **Branch** | `spec-11-04-dogfooding-alpha` |
| **상태** | Planning |
| **타입** | Research / Validation |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-11 의 spec-11-01~11-03 으로 *기술 자산* 완성:
- ✅ `npx create-gd-react` scaffold (shadcn 표준 41 파일)
- ✅ 4 능동 스킬 (gd-start / chat / token / design)
- ✅ `gd doctor` 12 검증 카테고리

그러나 *실제로 작동하는가?* 는 *시뮬레이션* 만 됐을 뿐 *실증 안 됨*.

### 문제점

- 스킬 본문이 *디자이너 입장에서 정말 이해 가능* 한가?
- scaffold → chat.md → React TSX 까지 *실제로 끊김 없이* 작동하는가?
- `gd doctor` 의 한국어 메시지가 *실제 막힘 상황* 에서 도움이 되는가?
- handbook / FRONT.md / AGENT.md 의 *누락 / 모호* 항목은 무엇인가?
- preset 의 `pnpm gd doctor` 가 *실제 사용 환경* 에서 동작하는가?

### 해결 방안 (요약)

dennis 가 *디자이너 페르소나* 로 zero state 부터 *로그인 신* React 까지 진행. 모든 막힘 / 헷갈림 / handbook 누락을 *experiments/dogfooding-alpha-2026-05.md* 보고서에 기록.

본 spec 은 *코드 작성이 아닌 실증 + 보고서*. 산출물은 *발견 사항 + 후속 phase 입력*.

## 🎯 요구사항

### Functional Requirements

1. **재현 가능한 환경**: `experiments/dogfood-alpha/` 디렉토리에 scaffold 결과를 *영구 보존* — 미래 다른 alpha 가 같은 출발점 참조 가능
2. **dennis dogfooding** — *디자이너 모드* 로 진행:
   - zero state (빈 디렉토리) → `npx create-gd-react dogfood-alpha --offline`
   - Claude Code 안에서 `/gd-start` 호출 시뮬레이션 → memory 초기화
   - `/gd-chat` 호출 시뮬레이션 → `chats/scenes/login.chat.md` 작성
   - `pnpm gd react chats/scenes/login.chat.md` → `src/scenes/login.tsx` 생성
   - `pnpm gd doctor` → 정합 검증
   - 결과 시각 확인 (`pnpm dev`)
3. **보고서 작성** — `experiments/dogfooding-alpha-2026-05.md`:
   - 정량 측정: 각 단계 *소요 시간* + 명령 횟수 + 에러 수
   - 정성 기록: *알고 있어서 우회한 경로* vs *실제 막힌 지점* 분리
   - handbook / FRONT.md / AGENT.md 누락 항목 목록
   - 스킬 본문의 *부정확 / 모호* 항목
   - phase-12 후보 작업 도출
4. **편향 인지**: dennis 는 *시스템 작성자* 이므로 *진정한 외부 디자이너 alpha 가 아님* — 보고서에 명시

### Non-Functional Requirements

1. 실제 명령은 *실 환경* 에서 동작 (mock X)
2. 보고서는 한국어 + 객관적 (성공만 강조 X, 실패도 정직 기록)
3. dogfooding 결과 디렉토리 (`experiments/dogfood-alpha/`) 가 git 추적 — 재현 가능

## 🚫 Out of Scope

- 외부 디자이너 alpha (실 사용자 채용 / 인터뷰) — phase-12 후보
- 발견된 *모든 문제 즉시 수정* — 본 spec 은 *발견 + 기록*. 수정은 후속 spec
- Paper MCP 사용 (scaffold default 가 SSG-first 이므로 Paper 없이 진행)
- 추가 신 작성 (로그인 1개로 충분 — 4축 정합 검증 가능)

## 📑 ADR 후보

- [ ] 없음 (본 spec 은 실증 — 새 결정 도출보다는 *기존 결정의 검증*)

## ✅ Definition of Done

- [ ] `experiments/dogfood-alpha/` scaffold 결과 git 추적
- [ ] `chats/scenes/login.chat.md` 작성 + `src/scenes/login.tsx` 생성
- [ ] `pnpm gd doctor` 실행 결과 캡처 (PASS 또는 진단 목록)
- [ ] `experiments/dogfooding-alpha-2026-05.md` 보고서 — *정량 + 정성 + 누락 항목 + 후속 후보*
- [ ] phase-12 후보 작업 목록 별도 (보고서 마지막 섹션 또는 backlog/queue.md icebox)
- [ ] walkthrough.md + pr_description.md ship
- [ ] `spec-11-04-dogfooding-alpha` 브랜치 push
- [ ] 사용자 검토 요청 알림
