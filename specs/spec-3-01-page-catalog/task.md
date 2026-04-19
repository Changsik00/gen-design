# Task List: spec-3-01

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

## Task 1: 페이지 카탈로그 문서 작성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-3-01-page-catalog`

### 1-2. 카탈로그 작성
- [x] `schema/page-catalog.md` 작성
  - 6개 카테고리(auth, dashboard, profile, content, commerce, common)
  - 각 카테고리 2종 이상 페이지 (총 18종)
  - 각 페이지: variant, 필수/선택 섹션, Template 매핑 상태
  - 앱 유형별 추천 세트 5종
- [x] Commit: `docs(spec-3-01): add page catalog with 6 categories and app presets`

---

## Task 2: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-3-01): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-3-01-page-catalog`
- [ ] **PR 생성**: `/hk-pr-gh`
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 2 (1 작업 + 1 Ship) |
| **예상 commit 수** | 2 |
| **현재 단계** | Ship |
