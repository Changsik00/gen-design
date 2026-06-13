# Task List: spec-13-08

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md / plan.md / task.md 작성
- [x] phase-13.md spec 표 + 성공기준 8 갱신
- [x] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [x] `git checkout -b spec-13-08-chatmd-action-layer`
- Commit: 없음

---

## Task 2 — Action 레이어 포맷 정의

- [x] `docs/chatmd-v2-format.md` — `## ⚡ Actions` 섹션 (forms / interactions / navigation / queries)
- [ ] Commit: `docs(spec-13-08): define Actions layer in chat.md v2 format`

---

## Task 3 — gd-chat 스킬 Action 가이드

- [x] `packages/gd-skills/skills/gd-chat.md` — Action 레이어 작성 가이드 (버튼 type 4종 → Actions 산출, Query/Mutation 연결 안내)
- [ ] Commit: `docs(spec-13-08): add Actions layer authoring guide to gd-chat`

---

## Task 4 — ADR-011 갱신 + 예시

- [x] `docs/decisions/ADR-011-...md` — v2 레이어에 Actions 추가
- [x] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md` — Actions 예시
- [ ] Commit: `docs(spec-13-08): update ADR-011 + dashboard example with Actions`

---

## Task 5 — 실증: todos Action 명세 + Query 재생성

- [x] todo-persona `chats/scenes/todos.chat.md` + `login.chat.md` 에 Actions 레이어 추가
- [x] `gd extract` → MSW 핸들러 생성
- [x] `src/scenes/todos.tsx` 재생성 — TanStack Query useQuery/useMutation (useState 제거)
- [x] MSW + Query 통합 e2e PASS
- [ ] Commit: `test(spec-13-08): todos action-spec → MSW + TanStack Query 실증 (e2e)`
  - 참고: todo-persona 미추적 — e2e 로그를 walkthrough 첨부

---

## Task 6 — Ship

- [x] **walkthrough.md** (Action 레이어 정의 + todos Query 전환 e2e 증거)
- [x] **pr_description.md**
- [x] **Ship Commit**: `docs(spec-13-08): ship walkthrough and pr description`
- [x] **Push** + **PR 생성** (`phase-13-vertical-slice` 타겟)
- [x] 사용자 알림

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 |
| **예상 commit 수** | 5 |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-29 |
