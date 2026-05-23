# spec-x-01 Task 목록

## Task 1 — Branch + spec 문서 ✅

- [x] `spec-x-01-skills-installer` 브랜치 생성 (from main)
- [x] spec.md / plan.md / task.md 작성

## Task 2 — @gd/skills 패키지 ✅

- [x] `packages/gd-skills/package.json` (tsup 빌드, pnpm sync-skills prebuild)
- [x] `packages/gd-skills/src/cli.ts` (설치 / 스킵 / --force 로직)
- [x] `packages/gd-skills/skills/` (4종 스킬 파일 sync)
- [x] `pnpm build` 통과 + 수동 검증
- [x] commit: `feat(spec-x-01): add @gd/skills installer package`

## Task 3 — README.md 개편 ✅

- [x] 기존 동기/배경 내용 → `docs/motivation.md` 이동
- [x] README 재작성: 30s 퀵스타트 + 워크플로 + 스킬 테이블 + CLI 테이블 + details 아코디언
- [x] commit: `docs(spec-x-01): overhaul README with quickstart and skills guide`

## Task 4 — Ship ✅

- [x] walkthrough.md 작성
- [x] pr_description.md 작성
- [ ] push + PR (target: main)
