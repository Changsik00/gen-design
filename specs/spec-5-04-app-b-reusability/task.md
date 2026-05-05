# Task List: spec-5-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 + 디렉토리 생성 (`sdd spec new app-b-reusability`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (자동)
- [x] 사용자 Plan Accept (`/hk-plan-accept`) — 2026-05-05

---

## Task 1: 브랜치 생성 + workspace 등록

### 1-1. 브랜치 생성

- [-] `git checkout -b spec-5-04-app-b-reusability` — **Pass 사유**: alignment 단계에서 §10.1 재발 방지 차원으로 이미 생성. spec-5-03 와 동일 패턴.

### 1-2. workspace 등록

- [ ] `pnpm-workspace.yaml` 갱신 — `poc/app-b` 추가
- [ ] Commit: `chore(spec-5-04): register poc/app-b in pnpm workspace`

---

## Task 2: app-b 패키지 셋업

### 2-1. 패키지 / 빌드 설정 복사 + 보강

- [ ] `poc/app-b/{package.json, vite.config.ts, tsconfig*, index.html}` — app-a 패턴 답습, name `app-b`
- [ ] `poc/app-b/src/{main.tsx, test-setup.ts, index.css}`
- [ ] `poc/app-b/tokens/build.mjs` — output `poc/app-b/src/styles/_tokens.css`
- [ ] `pnpm install` PASS
- [ ] Commit: `chore(spec-5-04): bootstrap poc/app-b vite app skeleton`

---

## Task 3: tokens.json (emerald + amber)

- [x] `poc/app-b/tokens.json` — color 만 변경 (primary emerald, accent amber). 나머지 동일
- [x] `pnpm --filter app-b tokens` PASS
- [x] Commit: `feat(spec-5-04): write tokens.json for app-b (emerald + amber)`

---

## Task 4: i18n/ko.json (한국어 번역)

- [x] `poc/app-b/i18n/ko.json` — DESIGN.md §14 의 60+ 키 모두 한국어 (73 개)
- [x] en.json 과 키 1:1 정합
- [x] Commit: `feat(spec-5-04): write i18n/ko.json for app-b`

---

## Task 5: 페이지 + 라우팅 (app-a 복제)

- [x] `poc/app-b/src/hooks/useTexts.ts` — i18n source 를 ko.json 으로
- [x] `poc/app-b/src/pages/*.tsx` (6 종) — app-a 복제 + mock 한국어로
- [x] `poc/app-b/src/App.tsx` — 동일 6 라우트
- [x] Commit: `feat(spec-5-04): wire 6 pages from app-a with ko mocks`

---

## Task 6: smoke test + 빌드 검증

### 6-1. routes test

- [x] `poc/app-b/src/__tests__/routes.test.tsx` — 한국어 텍스트 검증
- [x] `pnpm --filter app-b test` PASS (5/5)
- [x] Commit: `test(spec-5-04): add routes smoke test for app-b in korean`

### 6-2. 빌드 검증

- [x] `pnpm -r build` PASS (3 패키지)
- [x] `pnpm -r test` PASS (studio 115 + app-a 5 + app-b 5)
- [x] Commit: 없음 (검증만)

---

## Task 7: reuse-report.md (LOC 측정)

- [x] `find` + `wc -l` 으로 studio / app-a / app-b LOC 측정
- [x] 공유 비율 계산, 80%+ 충족 (코드만 87.1% / 데이터 포함 79.8%)
- [x] 발견 hardcode 목록 (2 건)
- [x] `poc/app-b/reuse-report.md` 작성
- [x] Commit: `docs(spec-5-04): write reuse report with LOC measurement`

---

## Task 8: Ship

- [x] `pnpm -r {build,test}` PASS
- [x] **walkthrough.md** + **pr_description.md** 작성
- [ ] Ship commit
- [ ] Push (사용자 confirm 1 회)
- [ ] `gh pr create --base main`
- [ ] PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **예상 commit 수** | 약 8~9 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-05 |
