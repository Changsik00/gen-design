# Task List: spec-13-06

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [x] `git checkout -b spec-13-06-gd-react-removal`
- Commit: 없음

---

## Task 2 — CLI 명령 + 테스트 파일 삭제

react.ts, order.ts 및 관련 테스트 7개 삭제.

- [ ] `git rm packages/gd-cli/src/commands/react.ts`
- [ ] `git rm packages/gd-cli/src/commands/order.ts`
- [ ] `git rm packages/gd-cli/src/commands/__tests__/react-annotation.test.ts`
- [ ] `git rm packages/gd-cli/src/commands/__tests__/react-args.test.ts`
- [ ] `git rm packages/gd-cli/src/commands/__tests__/react-runtime.test.ts`
- [ ] `git rm packages/gd-cli/src/commands/__tests__/order-args.test.ts`
- [ ] `git rm packages/gd-cli/src/commands/__tests__/order-runtime.test.ts`
- [ ] Commit: `refactor(spec-13-06): remove gd react + order CLI commands and tests`

---

## Task 3 — cli.ts 정리

- [ ] `packages/gd-cli/src/cli.ts`에서 react import + COMMANDS + DESCRIPTIONS 제거
- [ ] `pnpm --filter @gd/cli test` → PASS
- [ ] `pnpm --filter @gd/cli typecheck` → 기존과 동일 (pre-existing 에러만)
- [ ] Commit: `refactor(spec-13-06): remove react command from CLI router`

---

## Task 4 — Ship

- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-13-06): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-13-06-gd-react-removal`
- [ ] **PR 생성**: `phase-13-vertical-slice` 타겟
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 |
| **예상 commit 수** | 3 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-29 |
