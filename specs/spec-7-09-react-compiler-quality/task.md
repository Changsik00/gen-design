# Task List: spec-7-09

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] spec.md, plan.md, task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-7-09-react-compiler-quality`

---

## Task 2: C1 — CLI identifier fix (TDD Red)

- [ ] `cli/__tests__/spec-react-args.test.ts` 에 basename 케이스 추가
  - `"login-page.spec.md"` → `"LoginPage"` (not `"LoginPage.spec"`)
  - `"my-page.md"` → `"MyPage"`
- [ ] `pnpm test` → Fail 확인
- [ ] Commit: `test(spec-7-09): CLI identifier fix 테스트 (red)`

---

## Task 3: C1 구현 (TDD Green)

- [ ] `cli/spec-react.ts` basename 처리 수정
- [ ] `pnpm test` → Pass
- [ ] Commit: `fix(spec-7-09): CLI .spec.md identifier 처리`

---

## Task 4: C2 — imports-builder fix (TDD Red → Green)

- [ ] `imports-builder.test.ts` 에 케이스 추가
  - i18n keys 있어도 `react-i18next` import 없음
  - token keys 있어도 `@/lib/tokens` import 없음
  - 주석 힌트 포함 확인
- [ ] `imports-builder.ts` 수정
- [ ] 영향 snapshot 갱신 (`pnpm test -u`)
- [ ] `pnpm test` → Pass
- [ ] Commit: `fix(spec-7-09): imports-builder 존재하지 않는 모듈 제거`

---

## Task 5: C4 — noise-injected 픽스처 (TDD Red → Green)

- [ ] `paper-inference/__tests__/noise-fixtures.test.ts` 신규
  - 5개 노이즈 케이스: 약어/오타/소문자/한글/언더스코어
  - `matchResult.matched === false` 또는 `distance > 0` 검증
- [ ] `pnpm test` → Pass
- [ ] Commit: `test(spec-7-09): paper-inference 노이즈 픽스처 추가 (C4)`

---

## Task 6: C5 — TSX 유효성 검증

- [ ] `react/__tests__/tsx-validity.test.ts` 신규
  - 28 fixture → compileToReact → component name regex 검증
  - 생성 tsx 에 `export function` 포함 확인
  - `react-i18next`, `@/lib/tokens` import 없음 확인 (C2 연동)
- [ ] `pnpm test` → Pass
- [ ] Commit: `test(spec-7-09): 생성 TSX 유효성 검증 (C5)`

---

## Task 7: Ship

- [ ] `pnpm test` → 전체 PASS
- [ ] walkthrough.md 작성
- [ ] pr_description.md 작성
- [ ] Ship Commit
- [ ] Push + PR (`gh pr create --base phase-7-design-md`)

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 |
| **예상 commit 수** | 6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
