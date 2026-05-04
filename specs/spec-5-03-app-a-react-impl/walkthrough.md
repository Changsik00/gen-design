# Walkthrough: spec-5-03

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| # | 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|---|
| 1 | spec-5-03 시작 시 §10.1 (No Work on main) 위반 우려 | A: spec.md 작성 후 브랜치 생성 / B: alignment 직후 즉시 브랜치 | **B** | 직전 spec-5-02 머지 후 main 직접 push 한 chore 3 건이 §10.1 위반 가능성으로 회고됨. 재발 방지 차원에서 spec 디렉토리 생성 직후 즉시 spec branch 로 이동. plan 의 첫 task `git checkout -b` 는 [-] pass + 사유 기록 |
| 2 | i18n 기본 언어 — 한국어 vs 영어 | A: ko 기본 (사용자 답변) / B: en 기본 (DESIGN.md / phase-5 success criteria) | **B** | Q4 추천 시 제가 "한국어 기본" 으로 잘못 적은 사실을 인지. DESIGN.md / REQUIREMENTS.md 가 en 기본 + spec-5-04 에서 ko 로 교체로 정의되어 있고, phase-5 의 "토큰 + i18n 만 교체" 가설이 en→ko 전환으로 검증되는 정공. 사용자 재확인하여 "정공대로" 답변 받음 |
| 3 | studio LoginPageTexts 의 socialApple/Kakao → socialGithub 교체 — Phase 2 호환 | A: breaking (Apple/Kakao 제거 + Github 추가) / B: additive (Apple/Kakao 유지 + Github 추가) | **B** | plan 의 "호출 측 0" 가정 정정 발견 (lib/i18n.ts + assets/i18n/{en,ko}.json + LoginPage/index.tsx 가 사용 중). Apple/Kakao 는 앱 B 등 다른 provider 셋이 필요할 때 재사용 여지로 유지. SocialAuthBlock 도 4 provider 모두 optional 로 변경하여 호출 측이 prop 으로 선택 |
| 4 | DashboardPage 의 ActivityTable 의미 모델 (Paper "작업 목록" vs Phase 2 "활동 로그") | A: Phase 2 데이터 모델 변경 (user/action → task/assignee) / B: 인터페이스 유지, 라벨만 DESIGN.md 와 일치 | **B** | 데이터 모델 변경은 spec scope 너머. 화면에 보이는 라벨 (DashboardPageTexts.activityColumns) 만 DESIGN.md §14 의 task/assignee/updated 로 매핑. 의미 모델 차이는 visual-comparison.md 의 drift 로 기록. Task 5 가 [-] pass (코드 변경 없음) 로 처리됨 |
| 5 | studio source 의 `@/components/*` 자기참조를 app-a 빌드에서 어떻게 해석할 것인가 | A: studio 의 모든 `@/` import 를 상대경로로 일괄 변경 (대량) / B: app-a 의 vite + tsconfig alias 에 더 specific 한 prefix 우선 매핑 (정규식) | **B** | A 는 깊이별 path 변환이라 자동화 부담 크고 Phase 2 source 대량 수정. B 는 vite alias array 형식의 정의 순서 + 정규식 prefix 로 `@/components/*` → studio src 매핑 + `@/lib/*` → studio src + `@` → app-a src 의 fallback 우선순위 활용. 정상 작동 |
| 6 | Paper PNG / 렌더링 PNG 수집 vs visual-comparison.md 만 | A: PNG 수집 + 표 / B: 정성 비교 표만 | **B** | Paper MCP `get_screenshot` 응답이 base64 image 라 디스크 저장 도구 부재. dev 서버 수동 캡처도 ship 단계 외 작업. 핵심 산출물 `visual-comparison.md` 는 design-extract (이미 텍스트로 충분히 추출됨) ↔ studio 구현 cross-reference 로 정성 비교 가능. PNG 보강은 후속 사용자 협조 작업 |

## 💬 사용자 협의

- **주제**: Q4 추천 (i18n 기본 언어) 의 정정
  - **사용자 의견**: "정공대로.."
  - **합의**: en 기본 + spec-5-04 에서 ko 추가 (DESIGN.md / phase-5 success criteria 따름)

- **주제**: 자동 진행 여부 (Task 4 ~ Ship)
  - **사용자 의견**: "1" (옵션 1 — 계속 자동 진행, push 직전 1회 확인)
  - **합의**: Strict Loop 자동 진행. push 만 사용자 confirm

- **주제**: spec-5-02 머지 후 main 직접 push 한 chore 3 건
  - **사용자 의견**: "그럼 너의 문제는 아닌거 같다 잘 했어"
  - **합의**: hook 부재 + alignment 생략의 합산. 본 spec 부터 §10.1 재발 방지 — alignment 즉시 spec branch 이동

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트

- **명령**:
  ```bash
  pnpm -r test
  ```
- **결과**: ✅ Passed
- **로그 요약**:
  ```text
  studio test:  Test Files  30 passed (30)
  studio test:       Tests  115 passed (115)
  studio test:    Duration  2.70s
  poc/app-a test:  Test Files  1 passed (1)
  poc/app-a test:       Tests  5 passed (5)
  poc/app-a test:    Duration  657ms
  ```

#### 통합 테스트 (Integration Test Required = no)

- 본 spec 은 통합 테스트 미요구. phase-5 통합 시나리오 1 ("앱 A E2E") 는 phase-ship 단계에서 종합 검증.

#### 빌드 검증

- **명령**: `pnpm -r build`
- **결과**: ✅ Passed
- **로그 요약**:
  ```text
  poc/app-a build: dist/index.html      0.40 kB │ gzip: 0.28 kB
  poc/app-a build: dist/assets/index-*.css   12.34 kB │ gzip: 3.39 kB
  poc/app-a build: dist/assets/index-*.js   453.03 kB │ gzip: 146.72 kB
  poc/app-a build: ✓ built in 207ms
  ```

#### 타입 체크

- **명령**: `pnpm --filter studio exec tsc -p tsconfig.app.json --noEmit`
- **결과**: ✅ Clean
- 추가: `pnpm --filter app-a build` 에서 `tsc -b` 도 통과

### 2. 수동 검증

> Strict Loop 의 각 task 단계에서 단위 테스트 + tsc 통과를 매번 확인.

1. **Action**: `bash .harness-kit/bin/sdd plan accept`
   - **Result**: Plan Accepted, hook (check-plan-accept) 통과
2. **Action**: `git checkout -b spec-5-03-app-a-react-impl`
   - **Result**: Switched to new branch (alignment 단계, §10.1 재발 방지)
3. **Action**: `pnpm install` (workspace 셋업 후)
   - **Result**: 2 workspace projects, 625 packages, lockfile 통합
4. **Action**: 신규 컴포넌트 작성 + `pnpm --filter studio test` 매 task
   - **Result**: 12 → 15 → 19 → 20 → 25 → 26 → 30 files, 63 → 72 → 89 → 94 → 103 → 108 → 115 tests 점진 증가
5. **Action**: `pnpm --filter app-a tokens && pnpm --filter app-a build`
   - **Result**: `_tokens.css` 50+ CSS 변수 생성, dist 정상 생성
6. **Action**: 라우트 smoke test (`pnpm --filter app-a test`)
   - **Result**: 5 케이스 모두 PASS (`/login`, `/signup`, `/me`, `/settings`, `/*` 404 라우트)

## 🔍 발견 사항

- **Phase 2 산출물의 SocialAuthBlock 인터페이스 (4 props)** 가 앱 별로 다른 provider 셋을 표현하기에 자연스러운 형태가 아님 — `providers: Array<{provider, label}>` 형태가 더 generic. 본 spec 은 4 props 모두 optional 로 보강하여 LoginPage 에서 google+github 만 전달하는 식으로 우회. spec-x 후보.

- **studio source 의 `@/` 자기참조 alias 가 across-package import 에 약함** — vite alias 의 정규식 + 정의 순서로 우회했지만 이상적이지 않음. studio 가 `imports` field (Node 표준 subpath imports `#`) 를 사용하면 더 견고. spec-x 후보.

- **Sidebar 너비 `w-56` (224px)** 와 Paper 의도 240px 의 16px 차이는 토큰화 안 된 magic number. studio 의 Sidebar 컴포넌트가 width 를 prop 또는 토큰 (`--sidebar-width`) 으로 빼면 좋음. spec-5-04 또는 후속.

- **`bg-background` 가 light 테마에서 `#FFFFFF`** 로 정의되어 있어 Paper 의 page ground (`#F8FAFC` surface-alt) 와 다름. 토큰 매핑 시 `body { @apply bg-surface-alt }` 로 변경 가능. 후속.

- **DashboardPage 의 `ActivityRowData` 의미 모델 (user/action) vs DESIGN.md (task/assignee)** 가 같은 4-column 구조지만 row 의 정체성이 다름. Phase 2 의 `ActivityTable` 컴포넌트 자체는 generic 4-column 으로 유지 + 앱 별 데이터 의미만 다른 것으로 해석 가능. spec-5-05 회고 입력.

- **Paper MCP 의 `get_screenshot` 응답이 base64 image** 라 디스크 저장이 어려움. visual regression 자동화에 영향. spec-5-05 회고에서 도구 한계로 보고.

## 🚧 이월 항목 (Optional)

본 spec 의 진행 중 발견된 보강 가능 항목들. 핵심 PoC 검증은 충족하므로 본 spec 에 포함하지 않고 후속 처리 후보:

1. **studio Sidebar width 토큰화** (224 → 240 또는 prop) → spec-x 또는 spec-5-04
2. **app-a body bg 토큰 매핑** (background → surface-alt) → spec-5-04 의 토큰 교체 검증과 함께
3. **studio source `@/` alias 의 `#` subpath imports 전환** → spec-x
4. **SocialAuthBlock providers 배열 patterned API** → spec-x
5. **MyPage 2-column layout** → spec-5-04 또는 후속
6. **ActivitySummary 의 ProgressBar 컴포넌트 신규** → spec-5-04 또는 후속
7. **AvatarUpload 의 Remove (outline danger) 버튼 추가** → 후속
8. **SettingsGroup 의 Card wrapper 제거** (Paper minimalism 의도) → spec-5-04 또는 후속
9. **Paper PNG / 렌더링 PNG 의 visual/ 디렉토리 보강** → 후속 (사용자 협조 + Playwright 도입 검토)
10. **자동 visual regression 도입** → spec-5-05 회고에서 평가

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7 1M context) + Dennis |
| **작성 기간** | 2026-05-02 (Plan Accept) ~ 2026-05-04 |
| **최종 commit** | (ship commit 후 채움) |
| **총 commit 수** | 22 (Pre-flight 1 + 본 작업 21) |
