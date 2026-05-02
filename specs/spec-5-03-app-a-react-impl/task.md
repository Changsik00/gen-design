# Task List: spec-5-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new app-a-react-impl`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (`backlog/phase-5.md` SPEC 표 자동 갱신)
- [x] 사용자 Plan Accept (`/hk-plan-accept`) — 2026-05-03

---

## Task 1: 브랜치 생성 + workspace 셋업

### 1-1. 브랜치 생성

- [-] `git checkout -b spec-5-03-app-a-react-impl` — **Pass 사유**: alignment 단계에서 §10.1 (No Work on main) 재발 방지 차원으로 이미 생성 (현재 브랜치).
- [-] Commit: 없음 (브랜치만)

### 1-2. workspace 파일 작성

- [ ] `pnpm-workspace.yaml` 신규 — packages: `studio`, `poc/app-a`
- [ ] root `package.json` 신규 — name `design-monorepo`, private, scripts (`-r test/build/lint`)
- [ ] `studio/package.json` 의존성 검증 (변경 없음 또는 최소)
- [ ] `pnpm install` 실행 → 루트에서 lockfile 생성 / 통합 PASS
- [ ] Commit: `chore(spec-5-03): introduce pnpm workspace`

---

## Task 2: studio 의 ui atoms (Switch / Select / Slider) 신규

### 2-1. 테스트 작성 (TDD Red)

- [ ] 테스트: `studio/src/components/ui/__tests__/switch.test.tsx`, `select.test.tsx`, `slider.test.tsx` — 기본 렌더링 + onChange 핸들러 호출 검증
- [ ] `pnpm --filter studio test` → Fail
- [ ] Commit: `test(spec-5-03): add failing tests for switch/select/slider atoms`

### 2-2. 구현 (TDD Green)

- [ ] `studio/src/components/ui/switch.tsx` — base-ui Switch wrapper + variants
- [ ] `studio/src/components/ui/select.tsx` — base-ui Select wrapper
- [ ] `studio/src/components/ui/slider.tsx` — base-ui Slider wrapper
- [ ] `pnpm --filter studio test` → Pass
- [ ] Commit: `feat(spec-5-03): add switch/select/slider atoms with base-ui`

---

## Task 3: studio templates types 보강 (DESIGN.md SSOT 정렬)

### 3-1. 테스트 작성 (TDD Red)

- [ ] `studio/src/components/templates/types.test.ts` 갱신 — `LoginPageTexts.socialGoogle/Github`, `SignupPageTexts.socialGoogle/Github`, `MyPageTexts`, `SettingsPageTexts`, `ErrorPageTexts` 인터페이스 존재 검증
- [ ] `pnpm --filter studio test` → Fail
- [ ] Commit: `test(spec-5-03): add failing types test for design.md alignment`

### 3-2. 구현 (TDD Green)

- [ ] `studio/src/components/templates/types.ts` — 위 인터페이스 추가 / 보강
- [ ] `pnpm --filter studio test` → Pass
- [ ] Commit: `refactor(spec-5-03): align template texts types with DESIGN.md`

---

## Task 4: studio LoginPage / SignupPage 보강

### 4-1. 테스트 갱신 + 구현

- [ ] `studio/src/components/templates/LoginPage/*.test.tsx` — google/github 버튼 렌더링 + texts 매핑 검증
- [ ] `studio/src/components/templates/LoginPage/*.tsx` — 보강 (modal variant width 480px / radius 16px / elevation-modal)
- [ ] `studio/src/components/composites/SocialAuthBlock/*` 보강 (google/github)
- [ ] `studio/src/components/templates/SignupPage/*` 보강 (split-screen layout)
- [ ] 테스트 PASS
- [ ] Commit: `refactor(spec-5-03): align login/signup page with DESIGN.md`

---

## Task 5: studio DashboardPage 보강 + 관련 composite 점검

### 5-1. 테스트 + 구현

- [ ] DashboardPage / DashboardHeader / StatCard / ActivityTable 4 컬럼 / 4 종 카드 정합성 점검 + 보강
- [ ] 테스트 PASS
- [ ] Commit: `refactor(spec-5-03): align dashboard page composites with DESIGN.md`

---

## Task 6: studio 신규 composites — MyPage 군

### 6-1. 테스트 작성 (TDD Red)

- [ ] `ProfileHeader.test.tsx`, `ProfileInfoCard.test.tsx`, `ActivitySummary.test.tsx`, `AvatarUpload.test.tsx` — 기본 렌더링 + props 매핑
- [ ] Fail 확인
- [ ] Commit: `test(spec-5-03): add failing tests for mypage composites`

### 6-2. 구현 (TDD Green)

- [ ] `studio/src/components/composites/ProfileHeader/`, `ProfileInfoCard/`, `ActivitySummary/`, `AvatarUpload/` 신규 작성
- [ ] `studio/src/components/composites/index.ts` re-export 추가
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-5-03): add mypage composites (profile/activity/avatar)`

---

## Task 7: studio MyPage template 신규

### 7-1. 테스트 + 구현

- [ ] `MyPage.test.tsx` — variant=page + texts 렌더링
- [ ] `studio/src/components/templates/MyPage/MyPage.tsx`, `index.ts`
- [ ] `studio/src/components/templates/index.ts` re-export
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-5-03): add MyPage template`

---

## Task 8: studio 신규 composites — Settings 군

### 8-1. 테스트 (TDD Red)

- [ ] `SettingsHeader.test.tsx`, `SettingsGroup.test.tsx`, `SettingsToggleRow.test.tsx`, `SettingsSelectRow.test.tsx`, `SettingsSliderRow.test.tsx`
- [ ] Fail 확인
- [ ] Commit: `test(spec-5-03): add failing tests for settings composites`

### 8-2. 구현 (TDD Green)

- [ ] `studio/src/components/composites/SettingsHeader/`, `SettingsGroup/`, `SettingsToggleRow/`, `SettingsSelectRow/`, `SettingsSliderRow/`
- [ ] index.ts re-export
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-5-03): add settings composites (group/toggle/select/slider rows)`

---

## Task 9: studio SettingsPage template 신규

### 9-1. 테스트 + 구현

- [ ] `SettingsPage.test.tsx` — 4 group (Notification / Appearance / Language / Account) 렌더링
- [ ] `studio/src/components/templates/SettingsPage/SettingsPage.tsx`, `index.ts`
- [ ] re-export
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-5-03): add SettingsPage template with 4 groups`

---

## Task 10: studio ErrorPage + 관련 composites

### 10-1. 테스트 + 구현

- [ ] `ErrorIcon.test.tsx`, `ErrorMessage.test.tsx`, `HomeButton.test.tsx`
- [ ] composites 작성 (`ErrorIcon`, `ErrorMessage`, `HomeButton`)
- [ ] `ErrorPage.test.tsx` — variant '404' / '500' 렌더링
- [ ] `studio/src/components/templates/ErrorPage/ErrorPage.tsx`, `index.ts`
- [ ] re-export
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-5-03): add ErrorPage template with 404/500 variants`

---

## Task 11: poc/app-a — 토큰 / i18n 자원

### 11-1. tokens.json 작성

- [ ] `poc/app-a/tokens.json` 작성 — DESIGN.md §13 의 모든 토큰 (color 14+ / typography 8 / spacing 10 / radius 4 / elevation 5)
- [ ] `studio/tokens/build.mjs` 가 본 파일 처리 가능 검증 (필요 시 빌드 입력 경로 보강)
- [ ] Commit: `feat(spec-5-03): write tokens.json for app-a from DESIGN.md`

### 11-2. i18n/en.json 작성

- [ ] `poc/app-a/i18n/en.json` — DESIGN.md §14 의 60+ 키, default 영어 텍스트
- [ ] Commit: `feat(spec-5-03): write i18n/en.json for app-a`

---

## Task 12: poc/app-a — vite 앱 셋업

### 12-1. 패키지 / 빌드 설정

- [ ] `poc/app-a/package.json` 신규 (workspace `studio` 의존, react-router-dom)
- [ ] `poc/app-a/vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`
- [ ] `poc/app-a/src/main.tsx`, `App.tsx`, `routes.tsx`
- [ ] `pnpm install` PASS, `pnpm --filter app-a build` PASS (빈 라우트라도)
- [ ] Commit: `chore(spec-5-03): bootstrap poc/app-a vite app`

### 12-2. 페이지 컴포넌트 + 라우팅

- [ ] `poc/app-a/src/hooks/useTexts.ts` — i18n/en.json 에서 namespace 추출
- [ ] `poc/app-a/src/pages/login.tsx`, `signup.tsx`, `dashboard.tsx`, `mypage.tsx`, `settings.tsx`, `error.tsx` — 각 페이지 = `<Template variant texts={useTexts(namespace)} />`
- [ ] 라우터 매핑 (`/login`, `/signup`, `/`, `/me`, `/settings`, `/*`)
- [ ] `pnpm --filter app-a dev` 기동 확인 (수동)
- [ ] `pnpm --filter app-a test` PASS (있으면 smoke test)
- [ ] Commit: `feat(spec-5-03): wire 5 pages + error route in app-a`

---

## Task 13: 시각적 일치도 비교

### 13-1. Paper export 수집

- [ ] Paper MCP `get_screenshot` 으로 5 페이지 + error 1 PNG 저장 → `poc/app-a/visual/paper/{auth-login,auth-signup,dash-overview,profile-mypage,settings-overview,common-error}.png`
- [ ] (Settings 신설은 spec-5-02 의 artboard URL 참조)
- [ ] Commit: `chore(spec-5-03): capture paper screenshots for 6 pages`

### 13-2. dev 서버 스크린샷 수집

- [ ] dev 서버 기동 후 6 페이지 각각 스크린샷 → `poc/app-a/visual/render/*.png`
- [ ] Commit: `chore(spec-5-03): capture render screenshots for 6 pages`

### 13-3. visual-comparison.md 작성

- [ ] `poc/app-a/visual-comparison.md` — 페이지별 표 (Paper 썸네일 / Render 썸네일 / 일치도 등급 / 차이 / 원인)
- [ ] DESIGN.md 의 누락 / studio 패턴 차이 / 토큰 미적용 / 정상 차이 4 분류로 원인 정리
- [ ] Commit: `docs(spec-5-03): write visual comparison report`

---

## Task 14: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm -r lint`, `pnpm -r build` 모두 PASS
- [ ] 전체 테스트: `pnpm -r test` PASS
- [ ] **walkthrough.md 작성** — 각 task 의 결과물 / 발견 / drift 정성 분석
- [ ] **pr_description.md 작성** — 템플릿 준수
- [ ] **Ship Commit**: `docs(spec-5-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-5-03-app-a-react-impl`
- [ ] **PR 생성**: `gh pr create` (target: `main`) — 사용자 confirm 1 회 후 자동 진행
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 14 (Pre-flight 제외) |
| **예상 commit 수** | 약 18~20 (TDD red/green 분리 + 일부 task 의 sub-commit) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-02 |
