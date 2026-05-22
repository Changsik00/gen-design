# spec-11-06: Designer Persona Alpha — 미경의 대시보드 (2회차 dogfooding)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-11-06` |
| **Phase** | `phase-11` |
| **Branch** | `spec-11-06-designer-persona-alpha` |
| **상태** | Planning |
| **타입** | Research / Validation |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis (agent 가 미경 roleplay) |

## 📋 배경 및 문제 정의

### 현재 상황

spec-11-04 dogfooding alpha 는 *dennis simulation* — 시스템 작성자가 *합리적 외부 디자이너 답변* 을 *추정*. 편향이 컸음:
- 모든 어휘 (shadcn / cn / cva / Tailwind / React) 를 알고 있음
- 명령 실행 막히면 *경험으로 우회*
- 결과물 부정확 시 *원인 추정 가능*

spec-11-05 가 *4 fix* 를 통합한 후 *진짜 외부 디자이너 경험* 검증 필요.

### 문제점

phase-11 의 Success Criteria #2 가 *spec-11-05 fix 후* 진정 PASS 인지 검증되지 않음. 외부 디자이너 채용 / 인터뷰는 *시간 / 비용* 부담 (phase-12 후보 OPT). 본 spec 은 그 *간극* 을 *strict roleplay simulation* 으로 채움.

### 해결 방안 (요약)

**미경 (가상 Figma 디자이너) 페르소나 strict roleplay** — agent 가 *미경의 입장* 에서 *모르는 건 진짜 모름 표현*, *추측 우회 금지*, *시각 결과 안 보이면 멈춤*. dennis 본인이 *agent role* (스킬 가이드 / 명령 실행) 로.

이전과 다른 점:
- **모름 표현**: "shadcn 이 뭐예요?" "cva 가 뭐예요?" 같은 진짜 질문
- **시각 우선**: TSX 파일을 *직접 안 봄*. `pnpm dev` 의 *브라우저 결과* 만 확인
- **에러 만나면 멈춤**: 추측 안 하고 *질문* 으로
- **다른 신**: 대시보드 (StatCard + 최근 활동 리스트) — 이전 로그인보다 *복합 컴포넌트*

## 🎯 요구사항

### Functional Requirements

1. **미경 페르소나 strict 정의** (`PERSONA.md` 또는 보고서 §0):
   - 28세, Figma 5년차, 사이드 SaaS "TaskFlow" 만들고 싶음
   - React / TypeScript / Tailwind / shadcn / cn / cva *모름*
   - `npx`, `pnpm` 들어봤지만 *왜 두 개 다른지 모름*
   - i18n 키 명명 첫 만남
   - 시각 결과를 *브라우저* 에서 확인하는 게 *유일한 진척감*
2. **재현 가능한 환경**: `experiments/dogfood-alpha-v2/` 신규 (`v1` = spec-11-04 결과 보존)
3. **strict roleplay 흐름** — agent (Claude) 가 *미경 페르소나* 로 일관 답변:
   - scaffold: `npx create-gd-react taskflow --offline`
   - `/gd-start`: 미경 답변 ("미경 / 빠른 결정 / 시각 우선" / "TaskFlow / 1인 개발자 SaaS / 신뢰감")
   - `/gd-chat`: "대시보드 만들고 싶어요. Stats card + 최근 활동 리스트" — *그 외 상세는 모름*
   - `gd react`: 명령 실행 → 결과 확인 (`pnpm dev` 시도 — 가능하면 실행)
   - `gd doctor`: 진단 메시지 *한국어인지* 확인 + 막힌 부분
4. **모름 트래킹** — 보고서에 *미경이 모른 채로 진행* 한 모든 지점 기록
5. **시각 결과 검증**: 가능하면 `pnpm dev` 실행 → 브라우저 스크린샷 또는 *컴파일 결과만 확인* (e2e Playwright 환경 활용 가능)
6. **보고서**: `experiments/dogfooding-alpha-v2-2026-05.md`:
   - §0 페르소나 — 미경의 *알고 모르는 것* 표
   - §1 정량 (이전과 비교)
   - §2 단계별 미경의 *실제 답변 / 막힘* 트랜스크립트
   - §3 발견 사항 — *spec-11-04 와 비교* (해소 / 신규 / 동일)
   - §4 phase-12 후보 갱신
   - §5 결론 + 외부 alpha 시도 가능성 판단

### Non-Functional Requirements

1. agent (Claude) 가 페르소나 깨면 *명시 표시* (예: "[Claude 깨짐 — 미경은 이거 모름]")
2. 모든 명령은 *실제 실행* (mock X)
3. 보고서 한국어
4. dennis 의 *agent 역할 답변* 도 *미경에게 친절한 한국어* (영어 용어 X)

## 🚫 Out of Scope

- 실 외부 디자이너 채용 / 인터뷰 — phase-12 OPT
- 3 이상의 신 작성 — 본 spec 은 *대시보드 1개* 만
- `@gd/cli` 분리 (phase-12)
- 새 fix 즉시 적용 — 본 spec 은 *발견 + 기록*, fix 는 phase-12

## 📑 ADR 후보

- [ ] 없음 (실증 spec)

## ✅ Definition of Done

- [ ] `experiments/dogfood-alpha-v2/` scaffold 결과 git 추적
- [ ] `chats/scenes/dashboard.chat.md` 작성 (미경 페르소나)
- [ ] `src/scenes/dashboard.tsx` 생성 (`gd react` 결과)
- [ ] `gd doctor` 실행 결과 캡처
- [ ] (가능 시) `pnpm dev` 시각 확인 — 또는 *컴파일 결과* 만
- [ ] `experiments/dogfooding-alpha-v2-2026-05.md` 보고서 (페르소나 + 트랜스크립트 + 비교)
- [ ] phase-12 후보 갱신 (보고서 §4)
- [ ] walkthrough.md + pr_description.md
- [ ] PR 생성 + phase-11 base 머지 안내 (PR #68 자동 갱신)
