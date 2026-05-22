# feat(spec-5-03): 앱 A React 구현 + 5 페이지 + 시각적 일치도 검증

## 📋 Summary

### 배경 및 목적

phase-5 ("PoC 검증 — End-to-End") 의 통합 시나리오 1 은 "Blueprint → DESIGN.md → Paper → React" 의 4 단계 파이프라인을 앱 A (TaskFlow) 로 검증하는 것이다. spec-5-01 (Blueprint), spec-5-02 (Paper) 가 머지된 상태에서, **본 spec 이 React 구현 + 시각 일치도 검증** 의 마지막 단계를 완성한다.

phase-5 success criteria 중 #1 (앱 A 전 과정 완료), #4 (디자인 시안 ↔ React 시각 일치도 검증) 를 충족하고, spec-5-04 (앱 B 재사용성 — "토큰 + i18n 만 교체") 와 spec-5-05 (회고) 의 토대를 제공한다.

### 주요 변경 사항

- [x] **pnpm workspace 도입** — root 에 `pnpm-workspace.yaml`, studio + poc/app-a 패키지화. studio = 공유 컴포넌트 라이브러리, app-a = 앱 진입점
- [x] **studio 의 DESIGN.md SSOT 정렬** — `LoginPageTexts.socialGithub` 추가 + `SignupPageTexts.socialGoogle/Github` 추가 (additive). LoginPage modal 480px / SignupPage split-screen / SocialAuthBlock 4 provider optional
- [x] **신규 ui atoms 3 종** — `Switch`, `Select` (base-ui Root + Trigger + Value + Popup + Item composite), `Slider` (base-ui Root + Control + Track + Indicator + Thumb)
- [x] **신규 composites 12 종** — ProfileHeader / ProfileInfoCard / ActivitySummary / AvatarUpload / SettingsHeader / SettingsGroup / SettingsToggleRow / SettingsSelectRow / SettingsSliderRow / ErrorIcon / ErrorMessage / HomeButton
- [x] **신규 templates 3 종** — MyPage / SettingsPage / ErrorPage (DESIGN.md §11 명세 준수, 신규 SettingsPageProps 가 4 group + 8 핸들러)
- [x] **`poc/app-a/tokens.json`** (DTCG, semantic.color.light + radius + spacing + font + elevation 5 종)
- [x] **`poc/app-a/i18n/en.json`** (60+ 키, namespace `{page}.{section}.{element}.{property}`, default 영어)
- [x] **`poc/app-a/` vite 앱** — vite 8 + React 19 + tailwind 4 + base-ui + react-router 7. workspace path import 로 studio source 사용. tokens 빌드 → CSS 변수 자동 생성
- [x] **6 라우트** — `/login`, `/signup`, `/`, `/me`, `/settings`, `/*` (catch-all → 404 ErrorPage)
- [x] **`poc/app-a/visual-comparison.md`** — 6 페이지 정성 비교 (✅ 1 / ⚠️ 5 / ❌ 0)

### Phase 컨텍스트

- **Phase**: `phase-5` (PoC 검증, base branch 미사용)
- **본 SPEC 의 역할**:
  - 통합 시나리오 1 (앱 A E2E) 의 마지막 단계 — Paper 시안 → React 코드
  - phase-5 SC #1, #4 충족
  - spec-5-04 의 "토큰 + i18n 만 교체" 가설을 실증할 수 있는 코드베이스 마련 (workspace 분리)

## 🎯 Key Review Points

1. **pnpm workspace alias 전략** (`poc/app-a/vite.config.ts` + `tsconfig.app.json`)
   - studio 의 자기참조 `@/components/*`, `@/lib/*` 를 across-package import 시 어떻게 해석할지가 핵심 결정. 정규식 prefix + 정의 순서로 우회 (Phase 2 source 변경 없이). 향후 `imports` (Node `#` subpath) 로의 전환 여지를 walkthrough 에 기록

2. **DESIGN.md SSOT 정렬 — additive 변경 패턴**
   - Phase 2 산출물 (LoginPageTexts / SignupPageTexts / lib/i18n.ts / assets/i18n) 이 호출 측이라는 발견 후 breaking 대신 additive 변경 (Apple/Kakao 유지 + Github 추가). 앱 B 등 다른 provider 셋이 필요할 때 재사용 여지 보존

3. **studio 신규 templates / composites / atoms 의 props 인터페이스**
   - MyPageProps / SettingsPageProps / ErrorPageProps 의 데이터 형태 (profile / summary / notifications / options / errorVariant) 가 spec-5-04 에서도 그대로 활용될지 검토
   - SettingsPage 의 8 핸들러 (4 notification + theme/fontSize/language/timezone + changePassword/deleteAccount) 가 적절한 입자성인지

4. **시각적 일치도 검증 (visual-comparison.md)**
   - 6 페이지의 ⚠️ 부분 일치 5 건의 drift 가 "study 패턴 차이" (B) 4 건 + "정상 차이" (D) 1 건 (LoginPage variant 분기) — 토큰 미적용 (C) 0 건은 토큰 SSOT 정렬 성공 신호
   - 보강 가능 항목 (Sidebar width / page ground bg / brand panel 색 / SettingsGroup wrapper / MyPage 2-column) 은 walkthrough 의 이월 항목으로 정리

5. **One Task = One Commit 정합성 + Strict Loop**
   - 22 commit 중 TDD red/green 분리 7 쌍 + green-only 8 + chore/fix 7. constitution §8 준수 (Phase 4 회고 부채 W4 의 재발 방지)

## 🧪 Verification

### 자동 테스트

```bash
pnpm -r test
```

**결과 요약**:
- ✅ studio: 30 files / 115 tests PASS (Phase 2 의 12/63 → 본 spec 의 30/115)
- ✅ poc/app-a: 1 file / 5 tests PASS (라우트 smoke)

### 빌드

```bash
pnpm -r build
```

- ✅ studio: tokens build + tsc + vite build PASS
- ✅ poc/app-a: tokens build + tsc -b + vite build PASS (12 KB CSS, 453 KB JS minified, 147 KB gzip)

### 수동 검증 시나리오

1. **시나리오 1**: `pnpm install` (workspace) → 2 workspace projects 인식, lockfile 통합 → ✅ PASS
2. **시나리오 2**: `pnpm --filter app-a tokens` → `_tokens.css` 50+ CSS 변수 자동 생성 → ✅ PASS
3. **시나리오 3**: 라우트 smoke (5 라우트 진입 시 핵심 헤딩 확인) → ✅ PASS
4. **시나리오 4**: tsc clean (`pnpm --filter studio exec tsc -p tsconfig.app.json --noEmit`) → ✅ Clean
5. **시나리오 5**: 시각 일치도 정성 비교 → ✅ visual-comparison.md (6 페이지 분석)

## 📦 Files Changed

### 🆕 New Files

**Workspace 셋업**:
- `pnpm-workspace.yaml`: workspace packages (studio + poc/app-a)
- `pnpm-lock.yaml` (root): workspace lockfile SSOT (studio/pnpm-lock.yaml 에서 이동)

**studio 보강 (tests + components)**:
- `studio/src/components/ui/{switch,select,slider}.tsx` + `*.test.tsx`: 3 신규 ui atoms
- `studio/src/components/composites/{ProfileHeader,ProfileInfoCard,ActivitySummary,AvatarUpload}/{index,*.test}.tsx`: MyPage 군 4 composites
- `studio/src/components/composites/{SettingsHeader,SettingsGroup,SettingsToggleRow,SettingsSelectRow,SettingsSliderRow}/`: Settings 군 5 composites
- `studio/src/components/composites/{ErrorIcon,ErrorMessage,HomeButton}/`: Error 군 3 composites
- `studio/src/components/templates/MyPage/`: 신규 template
- `studio/src/components/templates/SettingsPage/`: 신규 template
- `studio/src/components/templates/ErrorPage/`: 신규 template

**poc/app-a (vite app)**:
- `poc/app-a/{package.json, vite.config.ts, tsconfig*.json, index.html}`
- `poc/app-a/tokens.json` (DESIGN.md §13)
- `poc/app-a/tokens/build.mjs` (style-dictionary)
- `poc/app-a/i18n/en.json` (DESIGN.md §14)
- `poc/app-a/src/{main,App,test-setup,index.css}.{tsx,ts}`
- `poc/app-a/src/styles/_tokens.css` (자동 생성)
- `poc/app-a/src/hooks/useTexts.ts`
- `poc/app-a/src/pages/{login,signup,dashboard,mypage,settings,error}.tsx`
- `poc/app-a/src/__tests__/routes.test.tsx`

**산출물**:
- `poc/app-a/visual-comparison.md`: 6 페이지 시각 일치도 정성 비교 + 종합 평가

**Spec / Ship 산출물**:
- `specs/spec-5-03-app-a-react-impl/{spec,plan,task,walkthrough,pr_description}.md`

### 🛠 Modified Files

**Root**:
- `package.json`: name = `design-monorepo`, scripts (`-r`, `--filter`)
- `.gitignore`: dist/, **/.tmp/

**Phase 2 (DESIGN.md 정렬)**:
- `studio/package.json`: test/test:watch script 추가 (vitest run / vitest)
- `studio/src/components/templates/types.ts`: socialGithub (Login/Signup), MyPage/Settings/Error 신규 인터페이스 + 보조 타입
- `studio/src/components/templates/index.ts`: 새 type / 새 template re-export
- `studio/src/components/composites/index.ts`: 12 신규 composite re-export
- `studio/src/components/templates/types.test.ts`: 새 인터페이스 검증 + socialGithub
- `studio/src/components/templates/LoginPage/index.tsx`: SocialAuthBlock google+github + modal 480px + elevation-modal
- `studio/src/components/templates/SignupPage/index.tsx`: page variant split-screen 분기 + SocialAuthBlock
- `studio/src/components/templates/SettingsPage/index.tsx`: onCheckedChange next 명시 boolean
- `studio/src/components/composites/SocialAuthBlock/index.tsx`: 4 provider optional
- `studio/src/__tests__/integration.test.tsx`: SocialAuthBlock google/github 검증 (apple/kakao 제거)
- `studio/src/lib/i18n.ts`: getLoginPageTexts / getSignupPageTexts 의 socialGithub / socialGoogle 매핑 추가
- `templates/assets/i18n/{en,ko}.json`: login.social.github + signup.social (google+github)

**Spec 디렉토리**:
- `specs/spec-5-03-app-a-react-impl/task.md`: 매 task 진행 시 체크박스 갱신
- `backlog/phase-5.md`: spec-5-03 → Active (sdd 자동 갱신)
- `backlog/queue.md`: NOW = spec-5-03 (sdd 자동 갱신)

**Total**: 80 files changed, +4279 insertions, -656 deletions

### 🗑 Deleted Files

- `studio/pnpm-lock.yaml`: workspace lockfile 이 root 로 이동

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (studio 30/115 + poc/app-a 1/5)
- [x] (Integration Test Required = no) 통합 테스트 미요구
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] lint / type check 통과 (tsc -p tsconfig.app.json clean, vite build PASS)
- [x] dev 서버 미수동 검증 (수동 캡처는 후속 작업, 라우트 smoke 로 대체)
- [ ] 사용자 검토 요청 알림 완료 (PR 생성 후)

## 🔗 관련 자료

- Phase: `backlog/phase-5.md`
- Spec: `specs/spec-5-03-app-a-react-impl/spec.md`
- Plan: `specs/spec-5-03-app-a-react-impl/plan.md`
- Task: `specs/spec-5-03-app-a-react-impl/task.md`
- Walkthrough: `specs/spec-5-03-app-a-react-impl/walkthrough.md`
- 시각 비교: `poc/app-a/visual-comparison.md`
- 입력 자료 (spec-5-02 산출물): `poc/app-a/DESIGN.md`, `poc/app-a/REQUIREMENTS.md`, `poc/app-a/design-extract/*.md`, `poc/app-a/drift-report.md`, `poc/app-a/intent-preservation.md`
