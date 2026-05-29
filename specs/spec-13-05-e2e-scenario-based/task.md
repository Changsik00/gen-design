# Task List: spec-13-05

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [ ] `git checkout spec-13-05-e2e-scenario-based`
- Commit: 없음

---

## Task 2 — smoke.spec.ts 작성

6개 라우트 로딩 + JS 오류 없음 검증.

- [ ] `studio/e2e/smoke.spec.ts` 신규 작성
- [ ] `pnpm --filter studio test:e2e --grep smoke` 로컬 PASS
- [ ] Commit: `test(spec-13-05): add smoke e2e — 6 route loading tests`

---

## Task 3 — chats.spec.ts 작성

Chat Viewer 3개 시나리오.

- [ ] `studio/e2e/chats.spec.ts` 신규 작성:
  - 시나리오 A: 파일 목록 렌더링
  - 시나리오 B: 파일 선택 → 컨텐츠 표시
  - 시나리오 C: 탭 전환
- [ ] `pnpm --filter studio test:e2e --grep chats` 로컬 PASS
- [ ] Commit: `test(spec-13-05): add chat viewer scenario e2e tests`

---

## Task 4 — CI e2e job 복원

- [ ] `.github/workflows/ci.yml` — e2e job 복원 (fixtures:gen 포함)
- [ ] Commit: `ci(spec-13-05): restore e2e job with fixtures:gen step`

---

## Task 5 — Ship

- [x] `pnpm --filter studio test:e2e` 전체 PASS (9개)
- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [x] **Ship Commit**: `docs(spec-13-05): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-13-05-e2e-scenario-based`
- [x] **PR 생성**: `phase-13-vertical-slice` 타겟
- [x] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 |
| **예상 commit 수** | 4 |
| **현재 단계** | Done |
| **마지막 업데이트** | 2026-05-29 |
