# Task List: spec-6-10

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + render-helpers 스캐폴드

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-6-10-fresh-page-e2e`

### 1-2. render-helpers 스캐폴드
- [ ] `studio/scripts/paper-e2e/render-helpers.mjs` 신규
- [ ] paper-sync 의 resolveSemanticColors 를 import 해서 light scheme CSS vars 객체 생성하는 함수
- [ ] CSS vars → `<style>:root { ... }</style>` 문자열 변환 헬퍼
- [ ] 기본 페이지 frame HTML wrapper (font, background)
- [ ] Commit: `feat(spec-6-10): add render-helpers scaffold using paper-sync resolver`

---

## Task 2: Composites 아트보드 — 1차 그룹 (10 컴포넌트)

- [ ] Paper 새 아트보드 생성 "Phase-6 E2E — Composites"
- [ ] write_html 으로 다음 10 개 렌더:
  - ErrorIcon, HomeButton, BrandHeader, ErrorMessage, AvatarUpload, StatCard, SocialAuthBlock, SettingsHeader, SettingsGroup, SettingsToggleRow
- [ ] render-helpers 에 각 컴포넌트의 HTML template 추가
- [ ] Commit: `feat(spec-6-10): render 10 simple composites to paper artboard`

---

## Task 3: Composites 아트보드 — 2차 그룹 (10 컴포넌트)

- [ ] write_html 추가 10 개:
  - SettingsSelectRow, SettingsSliderRow, DashboardHeader, ProfileHeader, ProfileInfoCard, ActivitySummary, ActivityTable, LoginForm, SignupForm, Sidebar
- [ ] Commit: `feat(spec-6-10): render 10 complex composites to paper artboard`

---

## Task 4: Templates 아트보드 (6 페이지)

- [ ] Paper 새 아트보드 "Phase-6 E2E — Templates"
- [ ] write_html 으로 6 페이지 렌더 (composite 들을 조합한 페이지 단위):
  - LoginPage, SignupPage, DashboardPage, MyPage, SettingsPage, ErrorPage
- [ ] Commit: `feat(spec-6-10): render 6 templates to paper artboard`

---

## Task 5: React 측 캡처 + 시각 비교

- [ ] `pnpm --filter studio dev` 백그라운드 실행
- [ ] Studio playground/template 라우트 또는 임시 비교 페이지에서 26 컴포넌트 React 렌더
- [ ] 각 컴포넌트 React vs Paper get_screenshot 사람 눈 비교
- [ ] (코드 변경 없는 분석 단계 — 본 task 는 commit 없음. Task 6 의 findings.md 작성 시 통합 commit)

---

## Task 6: findings.md 작성

- [ ] `specs/spec-6-10-fresh-page-e2e/findings.md` 작성
- [ ] 26 컴포넌트 각각 ✓ / ⚠️ / ❌ 분류 + 증거
- [ ] 요약 통계 + 발견 항목 분류 (token-level / component-level / 시스템적)
- [ ] backlog/queue.md Icebox 에 component-level / 시스템적 이월 항목 등재
- [ ] Commit: `docs(spec-6-10): add findings report and backlog spillover`

---

## Task 7: (조건부) 발견된 단순 drift 수정

- [ ] findings 가 token-level 단순 drift 도출 시 tokens.json 수정 + token CSS 재빌드
- [ ] findings 가 component-level 단순 fix 도출 시 해당 파일 수정
- [ ] `pnpm --filter studio test` PASS 유지
- [ ] Commit: `fix(spec-6-10): apply simple drifts found in fresh-page e2e` (수정 없으면 skip)

---

## Task 8: Ship

- [ ] `pnpm --filter studio run build` 성공
- [ ] `pnpm --filter studio test` 전체 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit + Push + PR 생성**
- [ ] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 (Task 7 조건부) |
| **예상 commit 수** | 6~7 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-09 |
