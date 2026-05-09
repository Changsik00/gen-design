# refactor(spec-6-01): studio API 정합화 — hardcode 4 건 제거 + sidebar width 토큰화

> phase-6 의 첫 spec (Track B 전제 조건). phase-5 회고의 hardcode 4 건 (C-01a/b/c/d) default 를 모두 제거하고 Sidebar width 240 px 을 토큰화해 Studio 본격 개발 (spec-6-04 이후) 의 클린 베이스를 마련합니다.

## 📋 Summary

### 배경 및 목적

phase-5 PoC 회고 (`docs/poc-retro.md` §3.3 + 2026-05-05 비판적 감사) 에서 Studio 컴포넌트 API 의 P1 부채로 식별된 항목:

- **hardcode 4 건** (C-01a/b/c/d): MyPage / SettingsPage / DashboardPage `appName` default + VariantWrapper `triggerLabel="Open"` default — 다른 제품 prop 누락 시 사이드바 / 버튼에 default literal leak 위험.
- **토큰화 미흡 2 건** (C-05, C-06): Sidebar `w-56` (224 px) 이 Paper 240 px 와 불일치, body bg 매핑 어긋남.

이 부채를 정리해 phase-6 의 Studio 본격 개발 (spec-6-04~008) 의 *전제 조건* 을 충족합니다.

### 주요 변경 사항

- [x] **C-01a/b/c — appName required 화**: MyPage / SettingsPage / DashboardPage 의 `appName` default (`"TaskFlow"` × 2, `"Admin"` × 1) 모두 제거 → required prop. TypeScript 컴파일 에러로 누수 차단.
- [x] **C-01d — VariantWrapper triggerLabel required 화**: `"Open"` default 제거 → required. 호출부 SignupPage 가 이미 `texts.title` 전달이라 i18n 격리 자동 회복.
- [x] **C-05 — Sidebar width 토큰화**: `templates/assets/tokens/tokens.json` 에 `semantic.size.sidebar-width: 240px` 추가, `pnpm tokens` 으로 `--sidebar-width` 자동 생성. `studio/src/index.css` 의 `@theme inline` 에 `--spacing-sidebar` 매핑 → `w-sidebar` Tailwind utility 노출. Sidebar 의 `w-56` → `w-sidebar` 교체.
- [x] **C-06 — body bg 매핑**: studio `--background` 값이 이미 `#F8FAFC` = Paper page ground 와 일치하여 *값 측면* 으로 정합 완료. 시맨틱 토큰 (`surface-alt`) 신규 정의는 별도 spec 으로 분리 — `backlog/queue.md` Icebox 등재. 본 spec 에서 Task 7 [-] Passed.
- [x] **App.tsx 호출부 갱신**: DashboardPage required 화에 따라 `appName="Studio"` 명시 추가 (임시 하드 문자열 — spec-6-04 에서 정식 데이터 모델로 교체).
- [x] **integration test 회귀 fix**: Task 4 의 누락 호출부 — integration.test.tsx 의 DashboardPage 단일 호출에 `appName="TestApp"` 추가.

### Phase 컨텍스트

- **Phase**: `phase-6` (Studio v1)
- **본 SPEC 의 역할**: Track B 전제 조건의 첫 항목. Studio 본격 개발 (spec-6-04 이후) 시 default literal leak / 토큰 미적용으로 인한 retrofit 비용을 사전 차단. 토큰 파이프라인에 size 그룹 합류로 향후 dimension 토큰 확장 토대 마련.

## 🎯 Key Review Points

1. **타입 정합**: `MyPageProps` / `SettingsPageProps` / `DashboardPageProps` 모두 `appName: string` 추가 (interface 일관 패턴). DashboardPage 는 type alias → interface 로 변경.
2. **VariantWrapper i18n 격리 회복**: 회고가 표방한 "texts props pattern" 가설을 default 제거로 강제. SignupPage 호출부는 이미 합류된 상태라 영향 0.
3. **토큰 파이프라인 확장**: `tokens.json` 에 신규 `semantic.size` 그룹 + `studio/tokens/build.mjs` 의 `name/shadcn` transform / light filter 에 `size` 케이스 추가. `--width-*` 가 아닌 `--spacing-*` namespace 채택 — Tailwind v4 의 spacing utility (`w-*`, `p-*`, `m-*`) 일관성.
4. **Task 7 Pass 처리**: `surface-alt` 토큰이 시스템에 미정의된 상태였음을 발견. 값 측면 일치 + 시맨틱 정리 별도 spec 분리 결정 — 사용자 협의 후 옵션 (A) 채택.
5. **integration test 회귀 fix (`06d22a6`)**: A4 회고 권장 "default literal 전수 grep" 의무를 Task 4 에서 누락한 결과. 향후 spec 부터 호출부 grep 을 task 의 첫 step 으로 명시 권장.

## 🧪 Verification

### 자동 테스트

```bash
cd studio
pnpm exec tsc --noEmit --ignoreDeprecations 6.0   # ✅ 0 errors
pnpm tokens                                        # ✅ 3 CSS files 생성
pnpm exec vitest run                               # ✅ 30 files / 116 tests PASS
```

**결과 요약**:
- ✅ MyPage 5/5 / SettingsPage 5/5 / DashboardPage 3/3 / Sidebar 6/6 (신규 width 케이스 포함)
- ✅ integration.test.tsx 8/8 (DashboardPage 호출부 회귀 fix 후 회복)
- ✅ tsc 0 errors / pnpm tokens 정상

### 수동 검증 시나리오

1. **호출부 leak grep**: `git grep -E 'appName="(TaskFlow|Admin)"|triggerLabel="Open"' studio/src` → Sidebar.test.tsx 의 `appName="Admin"` 6 건만 잔존 (단위 테스트 컨텍스트, 의도된 자리). 호출부 leak 0.
2. **토큰 합류**: `grep "sidebar-width" studio/src/styles/_tokens-light.css` → `--sidebar-width: 240px;` 1 hit.

## 📦 Files Changed

### 🆕 New Files
- `specs/spec-6-01-studio-api-alignment/spec.md`: 본 spec 정의 (한국어, 6 정합화 항목 카탈로그)
- `specs/spec-6-01-studio-api-alignment/plan.md`: 8 task 실행 계획
- `specs/spec-6-01-studio-api-alignment/task.md`: task 진행 추적
- `specs/spec-6-01-studio-api-alignment/walkthrough.md`: 작업 기록
- `specs/spec-6-01-studio-api-alignment/pr_description.md`: 본 문서

### 🛠 Modified Files

**API 정합화 (Page Templates)**
- `studio/src/components/templates/types.ts`: `MyPageProps` / `SettingsPageProps` / `DashboardPageProps` 에 `appName: string` 추가 (DashboardPage 는 type alias → interface 변경)
- `studio/src/components/templates/MyPage/index.tsx`: `MyPageFullProps` 삭제, default `"TaskFlow"` 제거
- `studio/src/components/templates/SettingsPage/index.tsx`: `SettingsPageFullProps.appName?` 제거, default `"TaskFlow"` 제거
- `studio/src/components/templates/DashboardPage/index.tsx`: `DashboardPageFullProps.appName?` 제거, default `"Admin"` 제거
- `studio/src/components/templates/VariantWrapper.tsx`: `triggerLabel?` → `triggerLabel: string`, default `"Open"` 제거

**토큰 파이프라인 (Sidebar width 토큰화)**
- `templates/assets/tokens/tokens.json`: `semantic.size.sidebar-width: 240px` 추가 (신규 size 그룹)
- `studio/tokens/build.mjs`: `name/shadcn` transform + light filter 에 size 케이스 추가
- `studio/src/styles/_tokens-light.css`: 자동 생성 — `--sidebar-width: 240px` 추가
- `studio/src/index.css`: `@theme inline` 에 `--spacing-sidebar: var(--sidebar-width)` 매핑
- `studio/src/components/composites/Sidebar/index.tsx`: `w-56` → `w-sidebar`

**호출부 / 테스트 갱신**
- `studio/src/App.tsx`: `<DashboardPage>` 에 `appName="Studio"` 명시
- `studio/src/__tests__/integration.test.tsx`: DashboardPage 호출부 `appName="TestApp"` 추가 (회귀 fix)
- `studio/src/components/composites/Sidebar/Sidebar.test.tsx`: `w-sidebar` className 검증 케이스 추가
- `studio/src/components/templates/MyPage/MyPage.test.tsx`: `baseProps.appName = "TestApp"` 추가
- `studio/src/components/templates/SettingsPage/SettingsPage.test.tsx`: `baseProps.appName = "TestApp"` 추가
- `studio/src/components/templates/DashboardPage/DashboardPage.test.tsx`: 3 케이스 모두 `appName="TestApp"` 추가

**메타**
- `backlog/phase-6.md`: spec-6-01 표 자동 갱신
- `backlog/queue.md`: active spec 갱신 + Icebox `phase-6 이월 follow-ups` 섹션 추가 (`surface-alt` 토큰 정리)

**Total**: 21 files changed (+423, -21)

## ✅ Definition of Done

- [x] 5 정합화 항목 적용 (C-01a/b/c/d, C-05) + C-06 [-] Passed
- [x] 모든 단위 테스트 PASS (`pnpm exec vitest run` — 116/116)
- [x] TypeScript 통과 (`tsc --noEmit` — 0 errors)
- [x] `pnpm tokens` 빌드 성공 + 자동 생성 CSS 합류
- [x] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [x] `spec-6-01-studio-api-alignment` 브랜치 push 완료
- [x] PR 생성 (target: `phase-6-studio-v1`)
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-6.md`
- Walkthrough: `specs/spec-6-01-studio-api-alignment/walkthrough.md`
- 회고 출처: `docs/poc-retro.md` §3.3 + 2026-05-05 비판적 감사
- 메모리 정책: `feedback_phase_branch.md` (phase-6 base branch 모드)
