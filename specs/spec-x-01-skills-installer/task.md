# Task List: spec-x-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight

- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] queue.md spec-x 등록
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-x-01-skills-installer` (base: `main`)
- [ ] Commit: 없음

---

## Task 2: `packages/gd-skills/` 패키지 신규

- [ ] `packages/gd-skills/package.json` — `@gd/skills`, bin: `gd-skills`
- [ ] `packages/gd-skills/src/cli.ts` — installer 로직 (복사 + 안전 체크 + 완료 메시지)
- [ ] `packages/gd-skills/skills/` — 스킬 파일 4개 복사 (create-gd-react 원본 기준)
- [ ] `pnpm-workspace.yaml` 에 `packages/gd-skills` 추가
- [ ] `npx tsx packages/gd-skills/src/cli.ts` 수동 확인 → `.claude/skills/` 생성 확인
- [ ] Commit: `feat(spec-x-01): add @gd/skills installer package`

---

## Task 3: README.md 개편

- [ ] 기존 README.md → `docs/motivation.md` 로 이동 (동기/철학 섹션 보존)
- [ ] README.md 전면 재작성 — 30초 퀵스타트 + 워크플로우 + 스킬/CLI 표 + details 접이식 배경
- [ ] Commit: `docs(spec-x-01): overhaul README — quickstart and workflow focus`

---

## Task 4: Ship

- [ ] 최종 확인: `npx @gd/skills` 시뮬레이션 동작
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-x-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-x-01-skills-installer`
- [ ] **PR 생성**: `gh pr create` (base: `main`)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 |
| **예상 commit 수** | 3 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-23 |
