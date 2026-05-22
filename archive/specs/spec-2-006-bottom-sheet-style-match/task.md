# Task List: spec-2-006

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성
- [x] 백로그 업데이트
- [ ] 사용자 Plan Accept

---

## Task 1: bottom-sheet variant + 사이즈 조정

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-2-006-bottom-sheet-style-match`

### 1-2. VariantWrapper bottom-sheet + LoginForm 사이즈
- [ ] `VariantWrapper.tsx` — bottom-sheet variant 구현
- [ ] `LoginForm/index.tsx` — CTA h-11, gap 조정
- [ ] `LoginPage/index.tsx` — 폼 영역 gap-6 반영
- [ ] Commit: `feat(spec-2-006): add bottom-sheet variant and Paper size matching`

---

## Task 2: App 전환 UI + 테스트

### 2-1. App + 테스트
- [ ] `App.tsx` — variant 전환에 bottom-sheet 추가
- [ ] `LoginPage.variant.test.tsx` — bottom-sheet 테스트 추가
- [ ] 전체 테스트 실행 → Pass
- [ ] Commit: `test(spec-2-006): add bottom-sheet variant test`

---

## Task 3: Ship

- [ ] `pnpm build` → 빌드 성공
- [ ] 전체 테스트 → PASS
- [ ] **walkthrough.md / pr_description.md 작성**
- [ ] **Archive Commit**
- [ ] **Push + PR 생성**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 3 (2 작업 + 1 Ship) |
| **예상 commit 수** | 3 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-16 |
