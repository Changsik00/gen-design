# Task List: spec-09-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-09.md SPEC 표 자동 갱신 by sdd)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [x] `git checkout -b spec-09-02-gen-design-lint`
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: lint-args 단위 테스트 작성 (TDD Red)

- [x] `studio/scripts/gen-design/__tests__/lint-args.test.ts` 작성
  - `parseLintArgs`: 기본값 / `--chat-root` / `--no-compile` / `--help`+`-h` / 알 수 없는 플래그 → `{ error }` 반환
- [x] `cd studio && pnpm test scripts/gen-design/__tests__/lint-args` → Fail 확인
- [x] Commit: `test(spec-09-02): add failing lint-args tests`

---

## Task 3: lint-args 구현 (TDD Green)

- [x] `studio/scripts/gen-design/lint.ts` 생성 — `parseLintArgs` + `LintArgs` 인터페이스만
- [x] `cd studio && pnpm test scripts/gen-design/__tests__/lint-args` → Pass 확인 (12/12)
- [x] Commit: `feat(spec-09-02): implement parseLintArgs`

---

## Task 4: lint-runtime 단위 테스트 작성 (TDD Red)

- [x] `studio/scripts/gen-design/__tests__/lint-runtime.test.ts` 작성 (실제 fs + tmpdir 패턴)
  - `scanChatFiles` 2 케이스
  - `checkFrontmatter` 5 케이스 (유효 / type 누락 / name 누락 / 잘못된 type / 잘못된 tier)
  - `checkShellInherit` 4 케이스 (inherit+shell 존재 / inherit+shell 없음 / inherit=false skip / exclude 미등록 컴포넌트)
  - `checkNaming` 4 케이스 (유효 / 대문자 / 잘못된 위치 / 잘못된 확장자)
  - `formatLintReport` 2 케이스 (0 에러 / 에러 있음)
- [x] `cd studio && pnpm test scripts/gen-design/__tests__/lint-runtime` → 17/17 PASS (구현이 Task 3 커밋에 이미 포함됨)
- [x] Commit: `test(spec-09-02): add failing lint-runtime tests`

---

## Task 5: lint 코어 로직 구현 (TDD Green)

- [-] Task 3 커밋에서 lint.ts 전체 구현 포함 (모든 카테고리 함수 + runLint) — 별도 커밋 불필요.

---

## Task 6: gen-design.ts 에 lint 등록 + GitHub Actions CI

- [x] `studio/scripts/gen-design.ts` 의 `COMMANDS` + `COMMAND_DESCRIPTIONS` 에 `lint` 추가
- [x] `.github/workflows/ci.yml` 생성 (pnpm test + gen-design lint --no-compile)
- [x] `cd studio && pnpm test` → 979/979 PASS
- [x] Commit: `feat(spec-09-02): register lint subcommand and add GitHub Actions CI`

---

## Task 7: Ship

> `/hk-ship` 절차를 따릅니다.

- [ ] `cd studio && pnpm build` → exit 0 확인
- [ ] 전체 테스트 `cd studio && pnpm test` → PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-09-02): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-09-02-gen-design-lint`
- [ ] **PR 생성**: `phase-09-gen-design-live` 브랜치 대상
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (+ Ship) |
| **예상 commit 수** | 6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |
