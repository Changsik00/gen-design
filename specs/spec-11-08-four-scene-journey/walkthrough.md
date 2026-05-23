# Walkthrough — spec-11-08: 4-Scene Journey (이지)

> spec-11-07 converge 이후 *연속 4 신* 환경에서 누적 학습 검증.
> 페르소나: **이지** (2년차 주니어). 시나리오: login → signup → dashboard → mypage.

## 1. 시작

`experiments/dogfood-alpha-v4/` scaffold + `.gd/memory/designer.md` (이지) + `project.md` (taskboard) 셋업.

## 2. 신 1 (로그인)

- `chats/scenes/login.chat.md` 작성 — Card + Form + FormField x 2 + Input + Button
- `gd react login` → `src/scenes/login.tsx` **2056 bytes**
- `gd doctor` → **0 errors**
- decisions.md entry: *표준 form pattern 첫 등장*

## 3. 신 2 (회원가입) — *첫 재사용*

- `signup.chat.md` 작성 — 신 1 의 모든 어휘 그대로 + Checkbox 신규
- `gd react signup` → 3045 bytes / `gd doctor` → 0 errors
- decisions.md entry: *form pattern 재사용 1회차 + Checkbox 신규 어휘*

## 4. 신 3 (대시보드) — *3 회 룰 발견*

- `dashboard.chat.md` 작성 — 통계 Card x 3 + 최근 활동 Card
- 이지의 발견: "Card 3 회 반복 — 공통 컴포넌트?" → 3 회 룰 *후보 등록*
- `gd react dashboard` → 2274 bytes / `gd doctor` → 0 errors
- decisions.md entry: *StatCard Tier 3 composite 후보 등록*

## 5. 신 4 (마이페이지) — *다중 신 재사용 + 승격 확정*

- `mypage.chat.md` 작성 — Tabs / Avatar / Switch 신규 + 신 1/2 form + 신 3 stat card 재사용
- StatCard 4회 등장 → *Tier 3 승격 확정*
- `gd react mypage` → 5015 bytes / `gd doctor` → 0 errors
- decisions.md entry: *StatCard 승격 확정 + FormBlock 후보*

## 6. 종합 보고서

`experiments/dogfooding-alpha-v4-journey-2026-05.md` — 234 줄. 단계별 대화 / 정량 / 누적 학습 매트릭스 / phase-11 의 깃발 평가.

## 7. 검증 점수

| 항목 | 결과 |
|---|---|
| 4 신 doctor errors | **0 / 0 / 0 / 0** |
| 페르소나 strict | 1회 미세 깨짐 (시스템 시선 발언) |
| 재사용 발견 | 신 2 (F1), 신 4 (F1+S1) |
| Tier 3 승격 | StatCard 확정 + FormBlock 후보 |
| 신규 막힘 | 0 건 |

## 8. 다음 (phase-12 후보)

- HIGH: `@gd/cli` npm 분리 (잔여)
- MID **(NEW)**: StatCard / FormBlock composite 실제 구현
- OPT: 외부 디자이너 alpha 채용 / `gd api` / `gd doctor --fix`
