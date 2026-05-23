# Task List: spec-12-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> Task 2 진행 중 ADR 재결정 (A → C) — chat-md-compiler 는 studio 에 그대로 유지.

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성
- [x] 백로그 업데이트 (phase-12.md SPEC 표)
- [x] 사용자 Plan Accept
- [x] 브랜치 생성

---

## Task 1: pre-flight commit ✅

- [x] Commit: `docs(spec-12-01): pre-flight spec plan task`

---

## Task 2: ADR 재결정 (A → C)

- [ ] plan.md / task.md / spec.md 의 ADR-12-01-A 결정 갱신
- [ ] Commit: `docs(spec-12-01): ADR-A revise to C — keep chat-md-compiler in studio`

---

## Task 3: `packages/gd-cli/` scaffold + 코드 이전

- [ ] 패키지 scaffold (package.json `@gd/cli` / bin `gen-design` / tsup / vitest)
- [ ] tsconfig path alias `@studio-compiler/*`
- [ ] `src/cli.ts` — dispatcher 이전
- [ ] `src/commands/` — react / doctor / diff / lint / merge / paper-import 이전
- [ ] import 경로 갱신 (`../../src/lib/chat-md-compiler` → `@studio-compiler`)
- [ ] `pnpm build` 성공
- [ ] Commit: `feat(spec-12-01): create @gd/cli package with gen-design commands`

---

## Task 4: 테스트 이전

- [ ] `studio/scripts/__tests__/gen-design.test.ts` → `packages/gd-cli/src/`
- [ ] `studio/scripts/gen-design/doctor/*.test.ts` → `packages/gd-cli/src/commands/doctor/`
- [ ] vitest config 동기
- [ ] `pnpm --filter @gd/cli test` PASS
- [ ] Commit: `test(spec-12-01): migrate gen-design tests to @gd/cli`

---

## Task 5: studio 정리

- [ ] `studio/scripts/gen-design.ts` + `studio/scripts/gen-design/` 삭제
- [ ] `studio/package.json` scripts → `gen-design` (bin) 호출
- [ ] studio devDep `@gd/cli: workspace:*`
- [ ] studio `pnpm test` PASS
- [ ] Commit: `chore(spec-12-01): remove studio inline gen-design — use @gd/cli`

---

## Task 6: preset 동기

- [ ] preset `package.json` devDep `@gd/cli: workspace:*`
- [ ] preset `scripts.gd` → `gen-design`
- [ ] create-gd-react `pnpm test` PASS
- [ ] Commit: `feat(spec-12-01): preset references @gd/cli via workspace`

---

## Task 7: 통합 테스트

- [ ] dogfood-alpha-v4 `pnpm gd react login` 0 errors
- [ ] dogfood-alpha-v4 `pnpm gd doctor` 0 errors
- [ ] 새 임시 디렉토리 create-gd-react + gd react 통합 시나리오
- [ ] studio preview 동작 확인 (chat-md-compiler 그대로라 회귀 최소)
- [ ] Commit: `test(spec-12-01): integration — gd commands work from external dir`

---

## Task 8: Ship

- [ ] walkthrough.md + pr_description.md
- [ ] sdd ship + push + PR (`--base phase-12-conversation-depth-and-orchestration`)

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **현재 단계** | Task 2 (ADR 갱신 commit) |
