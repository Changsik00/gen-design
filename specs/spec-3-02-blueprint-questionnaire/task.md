# Task List: spec-3-02

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-3.md SPEC 표 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: Blueprint 질의서 프로토콜 작성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-3-02-blueprint-questionnaire` (base: `phase-3-app-blueprint`)

### 1-2. 프로토콜 문서 작성
- [x] `schema/blueprint-protocol.md` 작성
- [x] Commit: `docs(spec-3-02): add blueprint questionnaire protocol`

---

## Task 2: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-3-02): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-3-02-blueprint-questionnaire`
- [ ] **PR 생성**: `phase-3-app-blueprint` 대상 PR
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 2 (1 작업 + 1 Ship) |
| **예상 commit 수** | 2 |
| **현재 단계** | Planning |
