# spec-11-08: 4-Scene Designer Journey — 이지의 누적 학습 검증

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-11-08` |
| **Phase** | `phase-11` |
| **Branch** | `spec-11-08-four-scene-journey` |
| **상태** | Planning |
| **타입** | Research / Validation (extended) |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

spec-11-07 가 *single-scene converge* 달성. 그러나 *진짜 디자이너 워크플로* = *여러 신을 연속 작성* 하며 *공통 패턴 발견 / 재사용 / Tier 3 승격* 의 누적 학습.

검증 누락:
- 신 → 신 사이 *어휘 재사용*
- 같은 패턴 3회 반복 시 *Tier 3 composite 승격* (FRONT.md §9 3회 룰)
- `.gd/memory/decisions.md` 누적 — 신 1 결정이 신 2-4 에 반영
- 디자이너 *학습 곡선* — 신 1 어렵지만 신 4 자연스러움

## 🎯 요구사항

### Functional Requirements

1. **페르소나**: **이지** — 2년차 주니어 디자이너 (Figma 기본 / shadcn 들어봄 / React props 정도)
2. **4 신 연속** (학습 누적 순서):
   - **신 1: 로그인** (가장 단순 — Card + Form + Input + Button)
   - **신 2: 회원가입** (로그인 form *재사용* 발견 기회)
   - **신 3: 대시보드** (StatCard *Tier 3 승격 후보*)
   - **신 4: 마이페이지** (대시보드 Card 재사용 + Avatar / Tabs 신규)
3. **각 신 단계별 대화 트랜스크립트** (turn-by-turn 8-15 turn)
4. **`.gd/memory/decisions.md` 누적** — 4 entry
5. **각 신 후 gd doctor** — 누적 진단 / 일관성 확인
6. **보고서** `experiments/dogfooding-alpha-v4-journey-2026-05.md`:
   - §0 페르소나
   - §1 신 별 트랜스크립트 (4)
   - §2 누적 학습 매트릭스 (어휘 재사용 / 신규 / 승격)
   - §3 decisions.md 추적
   - §4 single-scene vs multi-scene 발견
   - §5 phase-12 후보 갱신

### Non-Functional Requirements

1. 페르소나 strict — 2년차 답변 패턴 일관 (학습 욕구 ↑ / 결정 망설임 ↑)
2. 모든 명령 실 실행
3. 재사용 결정의 *근거* 기록

## 🚫 Out of Scope

- 5+ 신 — 4 신만
- `pnpm install + dev` 시각 — skip
- 외부 alpha — phase-12

## ✅ Definition of Done

- [ ] `experiments/dogfood-alpha-v4/` scaffold + 이지 memory
- [ ] 4 신 chat.md (login / signup / dashboard / mypage)
- [ ] 4 신 모두 gd react 컴파일 + gd doctor 0 errors
- [ ] decisions.md 4 entry
- [ ] 보고서 (~400 줄)
- [ ] walkthrough + pr_description
