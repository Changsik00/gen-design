# Task List: spec-1-002

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-1.md SPEC 표 갱신 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-1-002-react-project-setup`
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 2: Vite + React + TypeScript 프로젝트 생성

### 2-1. 프로젝트 초기화
- [x] `npm create vite@latest studio -- --template react-ts`
- [x] `cd studio && npm install`
- [x] 빌드 확인: `npm run build`
- [x] Commit: `feat(spec-1-002): initialize vite react-ts project`

---

## Task 3: Tailwind CSS 설치

### 3-1. Tailwind v4 설치 및 설정
- [x] Tailwind CSS v4 설치
- [x] 기본 스타일 적용 확인
- [x] Commit: `feat(spec-1-002): add tailwind css v4`

---

## Task 4: shadcn/ui 초기화 및 컴포넌트 설치

### 4-1. shadcn/ui 셋업
- [x] `npx shadcn@latest init` (설정 선택)
  - 자동 포함 확인: `clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss-animate`
  - `cn()` 유틸 생성 확인: `src/lib/utils.ts`
- [x] `npx shadcn@latest add button input card dialog`
- [x] App.tsx에서 4개 컴포넌트 + `cn()` 유틸 + cva variant 사용 렌더링 확인
- [x] `npm run build` 성공 확인
- [x] Commit: `feat(spec-1-002): add shadcn/ui with base components`

---

## Task 5: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] `npm run build` 최종 확인
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Archive Commit**: `docs(spec-1-002): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-1-002-react-project-setup`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 (브랜치 + Vite + Tailwind + shadcn + Ship) |
| **예상 commit 수** | 4 (Vite 1 + Tailwind 1 + shadcn 1 + archive 1) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-12 |
