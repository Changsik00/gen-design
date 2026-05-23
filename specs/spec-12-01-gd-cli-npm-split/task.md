# Task List: spec-12-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성
- [x] 백로그 업데이트 (phase-12.md SPEC 표)
- [ ] 사용자 Plan Accept
- [ ] 브랜치 생성 (phase-12 base 에서)

---

## Task 1: pre-flight commit

- [ ] Commit: `docs(spec-12-01): pre-flight spec plan task`

---

## Task 2: `packages/chat-md-compiler/` 분리

- [ ] 패키지 scaffold (package.json / tsconfig / tsup / vitest)
- [ ] `git mv studio/src/lib/chat-md-compiler/ packages/chat-md-compiler/src/`
- [ ] `src/index.ts` public API re-export
- [ ] studio frontend (preview / chat-viewer) import 경로 갱신
- [ ] studio package.json + tsconfig paths 갱신
- [ ] studio `pnpm test` PASS
- [ ] Commit: `refactor(spec-12-01): extract @gd/chat-md-compiler package`

---

## Task 3: `packages/gd-cli/` 생성

- [ ] 패키지 scaffold (package.json / bin: gen-design / tsup)
- [ ] `src/cli.ts` dispatcher 이전
- [ ] `src/commands/` 각 subcommand 이전 (react / doctor / diff / lint / merge / paper-import)
- [ ] import 경로 → `@gd/chat-md-compiler`
- [ ] `pnpm build` 성공
- [ ] Commit: `feat(spec-12-01): create @gd/cli package with gen-design commands`

---

## Task 4: 테스트 이전

- [ ] `studio/scripts/__tests__/gen-design.test.ts` → `packages/gd-cli/`
- [ ] `studio/scripts/gen-design/doctor/*.test.ts` → `packages/gd-cli/`
- [ ] chat-md-compiler 관련 *.test.ts → `packages/chat-md-compiler/`
- [ ] 두 패키지 `pnpm test` PASS
- [ ] Commit: `test(spec-12-01): migrate tests to new packages`

---

## Task 5: studio 정리

- [ ] `studio/src/lib/chat-md-compiler/` 삭제
- [ ] `studio/scripts/gen-design.ts` + `studio/scripts/gen-design/` 삭제
- [ ] `studio/package.json` scripts 갱신
- [ ] studio `pnpm test` PASS
- [ ] Commit: `chore(spec-12-01): remove studio inline gen-design + chat-md-compiler`

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
- [ ] studio preview (vite dev) 동작 확인
- [ ] Commit: `test(spec-12-01): integration — gd commands work from external dir`

---

## Task 8: Ship

- [ ] walkthrough.md + pr_description.md 작성
- [ ] sdd ship + push + PR (`--base phase-12-conversation-depth-and-orchestration`)

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **현재 단계** | Pre-flight (Plan Accept 대기) |
