# Task List: spec-09-01

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

- [x] `git checkout -b spec-09-01-gen-design-merge`
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: merge-args 단위 테스트 작성 (TDD Red)

- [x] `studio/scripts/gen-design/__tests__/merge-args.test.ts` 작성
  - `parseMergeArgs`: `--apply` / `--yes` / `--threshold <N>` / `--chat-root <dir>` 파싱
  - 잘못된 threshold (음수, 문자) → `{ error: ... }` 반환
  - `--help` 플래그 인식
- [x] `cd studio && pnpm test scripts/gen-design/__tests__/merge-args` → Fail 확인
- [x] Commit: `test(spec-09-01): add failing merge-args tests`

---

## Task 3: merge-args 구현 (TDD Green)

- [x] `studio/scripts/gen-design/merge.ts` 생성 — `parseMergeArgs` + `MergeArgs` 인터페이스만
- [x] `cd studio && pnpm test scripts/gen-design/__tests__/merge-args` → Pass 확인 (14/14)
- [x] Commit: `feat(spec-09-01): implement parseMergeArgs`

---

## Task 4: merge-runtime 단위 테스트 작성

- [x] `studio/scripts/gen-design/__tests__/merge-runtime.test.ts` 작성 (실제 fs + tmpdir 패턴)
  - `extractComponents` 5케이스 / `detectCandidates` 5케이스 / `buildPreview` 2케이스 / `applyPromotion` 5케이스
- [x] `cd studio && pnpm test scripts/gen-design/__tests__/merge-runtime` → 17/17 PASS
- [x] Commit: `test(spec-09-01): add failing merge-runtime tests`

---

## Task 5: merge 코어 로직 구현

- [-] Task 3 커밋에서 merge.ts 전체 구현 포함 (extractComponents / detectCandidates / applyPromotion / buildPreview / runMerge) — 별도 커밋 불필요.

---

## Task 6: gen-design.ts 에 merge 등록

- [x] `studio/scripts/gen-design.ts` 의 `COMMANDS` + `COMMAND_DESCRIPTIONS` 에 `merge` 추가
- [x] `cd studio && pnpm test` → 950/950 PASS
- [x] Commit: `feat(spec-09-01): register merge subcommand in gen-design router`

---

## Task 7: Ship

> `/hk-ship` 절차를 따릅니다.

- [ ] `cd studio && pnpm build` → exit 0 확인
- [ ] 전체 테스트 `cd studio && pnpm test` → PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-09-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-09-01-gen-design-merge`
- [ ] **PR 생성**: `phase-09-gen-design-live` 브랜치 대상 (base branch 자동 생성)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (+ Ship) |
| **예상 commit 수** | 6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |
