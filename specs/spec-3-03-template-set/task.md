# Task List: spec-3-03

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

## Task 1: 템플릿 세트 + assets 구조

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-3-03-template-set` (base: `phase-3-app-blueprint`)

### 1-2. 템플릿 + assets 작성
- [x] `templates/REQUIREMENTS.md.template` 작성
- [x] `templates/AGENT.md.template` 작성
- [x] `templates/assets/README.md` 작성
- [x] Commit: `docs(spec-3-03): add project template set and assets structure`

---

## Task 2: DESIGN.md ↔ Component 매핑 명세

### 2-1. 매핑 문서 작성
- [x] `schema/design-component-mapping.md` 작성
- [x] Commit: `docs(spec-3-03): add design-to-component mapping specification`

---

## Task 3: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-3-03): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-3-03-template-set`
- [ ] **PR 생성**: `phase-3-app-blueprint` 대상 PR
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 3 (2 작업 + 1 Ship) |
| **예상 commit 수** | 3 |
| **현재 단계** | Ship |
