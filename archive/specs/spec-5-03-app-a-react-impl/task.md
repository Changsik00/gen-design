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

- [x] `pnpm-workspace.yaml` 신규 — packages: `studio`, `poc/app-a`
- [x] root `package.json` 갱신 — name `design-monorepo`, scripts (`-r test/build/lint`, `--filter`)
- [x] `studio/package.json` test/test:watch script 추가 (Phase 2 누락분 보강)
- [x] `studio/pnpm-lock.yaml` → root 로 이동 (workspace lockfile SSOT)
- [x] `pnpm install` PASS (Scope: 2 workspace projects, 625 packages)
- [x] `pnpm --filter studio test` PASS (12 files / 63 tests)
- [x] Commit: `chore(spec-5-03): introduce pnpm workspace` (6b42156)

---

## Task 2: studio 의 ui atoms (Switch / Select / Slider) 신규

### 2-1. 테스트 작성 (TDD Red)

- [x] 테스트: `studio/src/components/ui/{switch,select,slider}.test.tsx` — 기본 렌더링 + onCheckedChange/onValueChange + disabled 검증
- [x] `pnpm --filter studio test` → 3 files Fail (resolve "./switch" 등)
- [x] Commit: `test(spec-5-03): add failing tests for switch/select/slider atoms` (82ca16a)

### 2-2. 구현 (TDD Green)

- [x] `studio/src/components/ui/switch.tsx` — Switch.Root + Thumb, knob 그림자
- [x] `studio/src/components/ui/select.tsx` — Root + Trigger + Value + Popup + Item (composite export)
- [x] `studio/src/components/ui/slider.tsx` — Root + Control + Track + Indicator + Thumb
- [x] slider.test 의 ARIA 검증을 native input attribute (min/max/disabled) 기반으로 조정 — base-ui 가 thumb 안에 nested input 렌더
- [x] `pnpm --filter studio test` → 15 files / 72 tests PASS
- [x] Commit: `feat(spec-5-03): add switch/select/slider atoms with base-ui` (e0ef520)

---

## Task 3: studio templates types 보강 (DESIGN.md SSOT 정렬)

### 3-1. 테스트 작성 (TDD Red)

- [x] `studio/src/components/templates/types.test.ts` 갱신 — socialGithub (Login/Signup), socialGoogle (Signup), MyPageTexts/SettingsPageTexts/ErrorPageTexts 검증
- [x] `tsc -p tsconfig.app.json --noEmit` → 10 type errors (vitest 는 type-only check 를 runtime 통과)
- [x] Commit: `test(spec-5-03): add failing types tests for design.md alignment` (2e31910)

### 3-1b. Task 2 fix-up — Select wrapper generic forwarding

- [x] `select.tsx` 의 SelectPrimitive.Root.Props 가 `<Value, Multiple>` generic 요구 → wrapper 도 동일 generic 으로 forward
- [x] Commit: `fix(spec-5-03): forward generic Value/Multiple types in Select wrapper` (5b2b31f)

### 3-2. 구현 (TDD Green)

- [x] `studio/src/components/templates/types.ts` — Login/SignupPageTexts 보강 (socialGithub 추가, Signup 에 socialGoogle/Github 추가) + MyPageTexts/SettingsPageTexts/ErrorPageTexts 신규 + ProfileData/SummaryData/Notifications/Option/ErrorVariant 보조 타입
- [x] `studio/src/lib/i18n.ts` — getLoginPageTexts 에 socialGithub, getSignupPageTexts 에 socialGoogle/Github 매핑 추가
- [x] `templates/assets/i18n/{en,ko}.json` — login.social.github 추가, signup.social 신규 (google + github)
- [x] `tsc -p tsconfig.app.json --noEmit` clean, `vitest` 15 files / 82 tests PASS
- [x] Commit: `refactor(spec-5-03): align template texts types with DESIGN.md` (7d676c4)

---

## Task 4: studio LoginPage / SignupPage 보강

### 4-1. 테스트 갱신 + 구현

- [x] SocialAuthBlock: 4 provider 모두 optional (google/github/apple/kakao 중 prop 으로 전달된 것만 렌더)
- [x] LoginPage modal variant: sm:max-w-[480px] + rounded-2xl + elevation-modal 그림자 적용. SocialAuthBlock 호출 google+github 만
- [x] SignupPage page variant: split-screen 레이아웃 분기. modal/bottom-sheet 는 VariantWrapper 유지. SocialAuthBlock 추가
- [x] integration.test.tsx 정정: SocialAuthBlock apple/kakao 검증 → google+github
- [x] Commit: `refactor(spec-5-03): align login/signup page with DESIGN.md` (08a5e88)

---

## Task 5: studio DashboardPage 보강 + 관련 composite 점검

### 5-1. 정합성 점검 — 변경 불필요

- [-] DashboardPage 가 이미 DESIGN.md §11 dash-overview 의 4 섹션 (Sidebar / DashboardHeader / StatCardGrid 4 카드 / ActivityTable 4 컬럼) 을 표시. composite 인터페이스도 props 로 정상 받음.
- [-] **드러난 의미 차이**: Phase 2 의 `ActivityRowData = {userName, initials, action, status, time}` 와 `activityColumns = {user, action, status, time}` 는 "사용자 활동 로그" 모델. DESIGN.md §11 의 "작업명 / 담당 / 상태 / 시간" 은 "작업 목록" 모델. 4-column 테이블의 형태는 같지만 row 의 의미가 다름.
- [-] **결정**: Phase 2 인터페이스 변경하지 않음 (의미 모델 변경은 spec scope 너머의 데이터 모델 결정). 앱 A 의 i18n 텍스트만 DESIGN.md §14 의 `Task/Assignee/Status/Updated` 로 매핑하여 시각 결과는 일치시킴 (Task 11 의 `poc/app-a/i18n/en.json` 에서 처리). 차이는 `visual-comparison.md` 에 drift 로 기록.
- [-] Commit: 없음 (코드 변경 없음, 본 task.md 갱신만으로 결정 기록)

---

## Task 6: studio 신규 composites — MyPage 군

### 6-1. 테스트 작성 (TDD Red)

- [x] 4 test files (ProfileHeader / ProfileInfoCard / ActivitySummary / AvatarUpload)
- [x] 4 files Fail
- [x] Commit: `test(spec-5-03): add failing tests for mypage composites` (a7b6f9c)

### 6-2. 구현 (TDD Green)

- [x] 4 composites 작성 + composites/index.ts re-export
- [x] 19 files / 89 tests PASS
- [x] Commit: `feat(spec-5-03): add mypage composites (profile/activity/avatar)` (18b9107)

---

## Task 7: studio MyPage template 신규

### 7-1. 테스트 + 구현

- [x] MyPage.test.tsx (5 케이스: profile / info card / summary / avatar / sidebar nav)
- [x] MyPage 구현: Sidebar (activeIndex=3) + ProfileHeader → ProfileInfoCard → ActivitySummary → AvatarUpload
- [x] templates/index.ts 모든 새 타입 + MyPage re-export
- [x] 20 files / 94 tests PASS
- [x] Commit: `feat(spec-5-03): add MyPage template` (c83d3c3)

---

## Task 8: studio 신규 composites — Settings 군

### 8-1. 테스트 (TDD Red)

- [x] 5 test files (SettingsHeader/Group/ToggleRow/SelectRow/SliderRow)
- [x] 5 files Fail
- [x] Commit: `test(spec-5-03): add failing tests for settings composites` (a78389f)

### 8-2. 구현 (TDD Green)

- [x] 5 composites 작성. ToggleRow→Switch, SelectRow→Select, SliderRow→Slider 의존
- [x] composites/index.ts re-export
- [x] 25 files / 103 tests PASS
- [x] Commit: `feat(spec-5-03): add settings composites (group/toggle/select/slider rows)` (cc26b44)

---

## Task 9: studio SettingsPage template 신규

### 9-1. 테스트 + 구현

- [x] SettingsPage.test.tsx (5 케이스: 4 group title / 4 toggle / 4 switch checked state / Change pw + Delete account button / email value)
- [x] SettingsPage 구현: Sidebar + SettingsHeader + 4 group (Notifications/Appearance/Language/Account). Account 그룹의 Delete 행은 error-soft 토큰 인라인.
- [x] templates/index.ts re-export
- [x] 26 files / 108 tests PASS
- [x] Commit: `feat(spec-5-03): add SettingsPage template with 4 groups` (c266bc0)

---

## Task 10: studio ErrorPage + 관련 composites

### 10-1. 테스트 (TDD Red)

- [x] 4 test files (ErrorIcon/Message/HomeButton + ErrorPage)
- [x] Fail 확인
- [x] Commit: `test(spec-5-03): add failing tests for error page + composites` (0a3c730)

### 10-2. 구현 (TDD Green)

- [x] 3 composites + 1 template 구현 (lucide FileSearch/ServerCrash 아이콘, centered-card 레이아웃)
- [x] composites/templates index.ts re-export
- [x] 30 files / 115 tests PASS
- [x] Commit: `feat(spec-5-03): add ErrorPage template with 404/500 variants` (56923cb)

---

## Task 11: poc/app-a — 토큰 / i18n 자원

### 11-1. tokens.json 작성

- [x] DESIGN.md §13 의 모든 토큰 — DTCG 형식으로 semantic.color.light + radius + spacing + font + elevation. primitive 없이 직접 hex
- [x] Commit: `feat(spec-5-03): write tokens.json for app-a from DESIGN.md` (b6715c1)

### 11-2. i18n/en.json 작성

- [x] DESIGN.md §14 의 60+ 키 (7 페이지 + nav + auth + app)
- [x] Commit: `feat(spec-5-03): write i18n/en.json for app-a` (e826b2a)

---

## Task 12: poc/app-a — vite 앱 셋업

### 12-0. 추가 fix-up — studio SettingsPage 의 boolean param

- [x] app-a 빌드의 tsc 가 across-package import 시 contextual type 손실 → `(next: boolean)` 명시
- [x] Commit: `fix(spec-5-03): explicit boolean param in SettingsPage onCheckedChange` (114a39c)

### 12-1. 패키지 / 빌드 설정

- [x] `poc/app-a/package.json` (workspace studio + react-router-dom 등)
- [x] `vite.config.ts` (alias 4 종 — studio + 자기참조 @/components/@/lib + @ 자체)
- [x] `tsconfig.{json,app,node}.json` (paths 동일 매핑, types: ['vite/client'])
- [x] `index.html` + `tokens/build.mjs` (style-dictionary, semantic 매핑)
- [x] `src/{main,App,test-setup,index.css,styles/_tokens.css}`
- [x] `pnpm install` PASS, `pnpm --filter app-a build` PASS
- [x] Commit: `chore(spec-5-03): bootstrap poc/app-a vite app` (ab978f6)

### 12-2. 페이지 컴포넌트 + 라우팅

- [x] `src/hooks/useTexts.ts` (7 namespace getter — login/signup/dashboard/mypage/settings/error/nav)
- [x] `src/pages/{login,signup,dashboard,mypage,settings,error}.tsx`
- [x] `src/App.tsx` 라우터 (6 route, /* → ErrorRoute 404)
- [x] `src/__tests__/routes.test.tsx` (5 smoke 케이스, MemoryRouter)
- [x] `pnpm --filter app-a test` PASS (1 file / 5 tests), `pnpm -r build` PASS (12 KB CSS, 453 KB JS)
- [x] Commit: `feat(spec-5-03): wire 5 pages + error route in app-a` (88f9e1c)

---

## Task 13: 시각적 일치도 비교

### 13-1. Paper export 수집

- [-] **Pass 사유**: Paper MCP `get_screenshot` 응답이 base64 image — 디스크 저장 도구 부재로 PNG 파일 생성 불가. 후속 사용자 협조 작업 (Paper UI export 또는 별도 자동화) 으로 보강 가능.

### 13-2. dev 서버 스크린샷 수집

- [-] **Pass 사유**: dev 서버 기동 + 라우트별 수동 캡처 필요 (PoC 본 spec scope 외). spec-5-05 회고에서 Playwright 자동화 도입 평가 대상.

### 13-3. visual-comparison.md 작성

- [x] `poc/app-a/visual-comparison.md` — 6 페이지 정성 비교 + 종합 평가
- [x] design-extract (Paper 추출) ↔ studio 구현 cross-reference
- [x] 일치도 등급 ✅ 1 / ⚠️ 5 / ❌ 0
- [x] 원인 분류: A 0 / B 5 / C 0 / D 2
- [x] phase-5 SC #1, #4 매핑 + spec-5-04/05 입력
- [x] Commit: `docs(spec-5-03): write visual comparison report` (0d583be)

---

## Task 14: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] 코드 품질 점검: `pnpm -r build` PASS (lint 별도 실행 가능)
- [x] 전체 테스트: `pnpm -r test` PASS (studio 30/115 + app-a 1/5 = 31 files / 120 tests)
- [x] **walkthrough.md 작성** — 결정 6 / 사용자 협의 3 / 검증 결과 / 발견 6 / 이월 10
- [x] **pr_description.md 작성** — 템플릿 준수
- [ ] **Ship Commit**: `docs(spec-5-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-5-03-app-a-react-impl` (사용자 confirm)
- [ ] **PR 생성**: `gh pr create` (target: `main`)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 14 (Pre-flight 제외) |
| **실제 commit 수** | 22 (Pre-flight 1 + 본 작업 21, ship commit 추가 예정) |
| **현재 단계** | Ship (push 사용자 confirm 대기) |
| **마지막 업데이트** | 2026-05-04 |
