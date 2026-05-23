# Task List: spec-11-07

> 모든 task 는 한 commit 에 대응합니다.

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성
- [x] 백로그 갱신 (sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + pre-flight commit
- [ ] `git checkout -b spec-11-07-fix-v2-findings`
- [ ] Commit: `docs(spec-11-07): pre-flight spec plan task`

## Task 2: Fix #v2-1 — token-ref Tailwind size 제외 (TDD)
- [ ] token-ref.test.ts — `text-xs` / `text-lg` 무시 테스트 (Red)
- [ ] check-token-ref.ts — TAILWIND_SIZE_KEYWORDS exclude
- [ ] PASS
- [ ] Commit: `fix(spec-11-07): doctor token-ref skips Tailwind size keywords (xs/sm/lg)`

## Task 3: Fix #v2-2 — doctor shadcn 화이트리스트 (TDD)
- [ ] vocab-similar.test.ts — shadcn 컴포넌트 (Card / Form / Field 등) 화이트리스트 통과 테스트 (Red)
- [ ] check-vocab-similar.ts — SHADCN_KNOWN set + 우회
- [ ] PASS
- [ ] Commit: `fix(spec-11-07): doctor shadcn Tier 2 whitelist (Card/Form/Field/etc)`

## Task 4: Fix #v2-3 — doctor 우선순위 + 요약 출력
- [ ] integration.test.ts — 요약 출력 형식 (top 3 + 나머지 N) 검증 추가
- [ ] doctor/index.ts — 정렬 + collapse 로직
- [ ] Commit: `fix(spec-11-07): doctor output prioritization (top 3 + N more)`

## Task 5: Fix #v2-4~7 — 스킬 본문 4건 일괄
- [ ] gd-start §7 "처음이면 /gd-chat" 강한 추천 + 시각 결과 우선
- [ ] gd-chat §4 frontmatter "자동 — 안 만져도 OK" 명시
- [ ] gd-chat §7 "Tailwind 클래스 자동" + i18n placeholder 안내
- [ ] Commit: `fix(spec-11-07): refine gd-start / gd-chat skills for designer friendliness`

## Task 6: v3 dogfooding 재실행
- [ ] `experiments/dogfood-alpha-v3/` scaffold
- [ ] 도훈 페르소나 또는 미경 재방문 결정
- [ ] memory + chat.md + gd react + gd doctor 흐름
- [ ] 새 발견 *기록*
- [ ] Commit: `chore(spec-11-07): v3 dogfooding — verify v2 fixes`

## Task 7: 종료 조건 평가 + 보고서
- [ ] `experiments/dogfooding-alpha-v3-2026-05.md` 작성:
  - §0 페르소나
  - §1 v2 fix 검증 (7건 모두 작동?)
  - §2 v3 신규 발견
  - §3 종료 조건 평가 (HIGH 0 / MID ≤ 2 / 멈춤 0)
  - §4 PR 머지 가능 여부 / spec-11-08 필요 여부
- [ ] Commit: `docs(spec-11-07): write dogfooding alpha v3 report + convergence eval`

## Task 8: Ship
- [ ] 회귀 테스트 (studio + create-gd-react)
- [ ] walkthrough.md + pr_description.md
- [ ] Ship Commit
- [ ] Push + PR (--base phase-11)
- [ ] (converge PASS 시) PR #68 머지 안내 / (FAIL 시) spec-11-08 안내

---

## 진행 요약

| 항목 | 값 |
|---|---|
| 총 Task 수 | 8 |
| 종료 조건 | HIGH 0 / MID ≤ 2 / 페르소나 멈춤 0 |
| FAIL 시 | spec-11-08 사이클 |
