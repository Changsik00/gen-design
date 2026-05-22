# Implementation Plan: spec-6-01

## 📋 Branch Strategy

- 신규 브랜치: `spec-6-01-studio-api-alignment` (브랜치 이름 = spec 디렉토리 이름, `feature/` prefix 없음)
- 시작 지점: `phase-6-studio-v1` (phase base branch — 사용자 메모리 `feedback_phase_branch.md` 정책)
- PR target: `phase-6-studio-v1`
- 첫 task 가 브랜치 생성을 수행

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **App.tsx 호출부 변경 (C-01c)**: 현재 `<DashboardPage variant="page" texts={dashboardTexts} stats={...} activities={...} />` 에 `appName` 누락 — required 화 시 명시 추가 필요. App.tsx 에서 어떤 값으로 전달할지 결정 필요. **권장**: phase-5 회고에서 식별된 dogfooding 시나리오에 따라 임시 하드 문자열 `appName="Studio"` (또는 `"Design Studio"`) 로 통일. spec-6-04 (Studio 앱 셋업) 에서 `data/` 의 정식 명칭으로 교체.
> - [ ] **Sidebar width 224 → 240 px 변경의 시각 영향**: 16 px 차이로 Sidebar 가 약간 넓어짐. 기존 컴포넌트 테스트의 layout snapshot 영향 가능 — 영향 범위는 task 단계에서 확인.
> - [ ] **VariantWrapper required 화 (C-01d)**: SignupPage 만 호출하고 이미 `texts.title` 전달 중이라 호출부 변경 불필요. 단, 향후 새 호출부에서 강제 (TypeScript 에러).

> [!WARNING]
> - [ ] **Breaking 변경 (default 제거 4 건)**: studio repo 외부 사용자 없음 가정. 만약 외부 import 가 있다면 깨짐 — 사전 grep 으로 외부 호출 부재 확인.
> - [ ] **`templates/assets/tokens/tokens.json` schema 의존**: 기존 schema 가 `semantic.spacing` 또는 `semantic.size` 그룹 중 어디에 sidebar.width 를 추가할지 task 단계에서 결정. 잘못 추가 시 `pnpm tokens` 빌드 실패 가능.

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```mermaid
flowchart TB
  subgraph "tokens 파이프라인"
    T1[templates/assets/tokens/tokens.json<br/>+ sidebar.width: 240] -->|pnpm tokens| T2[studio/src/styles/_tokens-light.css<br/>--sidebar-width: 240px]
    T2 -->|@theme inline| T3[studio/src/index.css]
    T3 -->|Tailwind utility| T4[Sidebar w-sidebar 또는<br/>w-[var--sidebar-width]]
  end
  subgraph "API 정합화"
    A1[Page Templates<br/>DashboardPage / MyPage / SettingsPage] -->|appName: required| A2[App.tsx 호출부]
    A3[VariantWrapper<br/>triggerLabel: required] -->|texts.title| A4[SignupPage 호출부]
  end
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **C-01a/b/c (appName)** | `?:` 제거 → required prop. 타입 시그니처 갱신. | 다른 default 값 (TaskFlow / Admin) 이라 leak 위험이 컴포넌트마다 다름 — TypeScript 강제가 가장 강한 가드 |
| **C-01d (triggerLabel)** | `?:` 제거 → required prop. 호출부 변경 불필요 (SignupPage 가 이미 합류). | 회고가 권장한 "i18n 격리 회복". 호출부가 1 곳뿐이라 비용 0 |
| **C-05 (Sidebar width)** | `--sidebar-width` 토큰 (240 px) + Tailwind utility 매핑 | 전역 일관성, 향후 spec-6-07 토큰 편집기에서 변경 가능 |
| **C-06 (body bg)** | `bg-background` → `bg-surface-alt` 매핑 | Paper page ground 와 일치, 토큰 재사용 |
| **Commit 분리** | 6 정합화 항목 = 6 commit (Task 2~7) | constitution §8 + phase-4 회고 W4 (commit 통합 위반 재발 방지) |

## 📂 Proposed Changes

### Page Templates

#### [MODIFY] `studio/src/components/templates/MyPage/index.tsx`

```text
- appName = "TaskFlow",
+ appName,
```

타입 시그니처 (`MyPageProps` 또는 인라인 interface) 의 `appName?: string` → `appName: string` 변경. `studio/src/components/templates/types.ts` 에서 `MyPageProps` 정의 시 동일 갱신.

#### [MODIFY] `studio/src/components/templates/SettingsPage/index.tsx`

C-01a 와 동일 패턴 (`appName = "TaskFlow"` 제거). `SettingsPageProps` 타입 갱신.

#### [MODIFY] `studio/src/components/templates/DashboardPage/index.tsx`

`appName = "Admin"` 제거 → required. `DashboardPageProps` 타입 갱신.

#### [MODIFY] `studio/src/App.tsx`

```text
  <DashboardPage
    variant="page"
+   appName="Studio"
    texts={dashboardTexts}
    stats={mockStats}
    activities={mockActivities}
  />
```

> 임시 하드 문자열 `"Studio"` 사용. spec-6-04 에서 정식 데이터 모델로 교체.

#### [MODIFY] `studio/src/components/templates/VariantWrapper.tsx`

```text
- triggerLabel = "Open",
+ triggerLabel,
```

`VariantWrapperProps.triggerLabel: string` (required). 호출부 `SignupPage` 는 이미 `triggerLabel={texts.title}` 전달 — 변경 없음.

### Tokens & Styling

#### [MODIFY] `templates/assets/tokens/tokens.json`

`sidebar.width: { $value: "240px", $type: "dimension" }` 항목 추가 (정확한 그룹 위치는 기존 schema 확인 후 결정 — `semantic.spacing` 또는 신규 `semantic.size` 그룹).

#### [MODIFY] `studio/src/styles/_tokens-light.css` (자동 생성)

`pnpm tokens` 1 회 실행. `--sidebar-width: 240px` 자동 추가. (수동 편집 금지 주석 그대로 유지)

#### [MODIFY] `studio/src/index.css`

- `@theme inline` 블록에 `--sidebar-width: var(--sidebar-width);` 매핑 추가 (Tailwind v4 utility 노출).
- body 배경 매핑: 기존 `body { @apply bg-background ... }` → `body { @apply bg-surface-alt ... }` 로 변경. (정확한 라인은 task 단계에서 확인)

#### [MODIFY] `studio/src/components/composites/Sidebar/index.tsx`

```text
- <aside className="... w-56 ...">
+ <aside className="... w-(--sidebar-width) ...">
```

> Tailwind v4 의 arbitrary value 또는 매핑된 utility (`w-sidebar`) 중 빌드 결과에 따라 결정. Tailwind v4 의 `@theme` 기반 utility 가 더 권장.

### Tests

#### [MODIFY] `studio/src/components/composites/Sidebar/Sidebar.test.tsx`

- 240 px 너비 적용 검증 케이스 추가 (DOM `getBoundingClientRect()` 또는 className 매칭).
- 기존 `appName="Admin"` 호출은 그대로 유지 (테스트 컨텍스트).

#### [MODIFY] DashboardPage / MyPage / SettingsPage / VariantWrapper 관련 단위 테스트

required prop 누락 케이스가 있다면 명시적 값 추가. (대부분 이미 명시 — task 단계에서 grep 으로 영향 범위 확인)

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)

```bash
cd studio && pnpm test
```

### 타입 체크

```bash
cd studio && pnpm typecheck
# 또는: cd studio && pnpm exec tsc --noEmit
```

### 토큰 빌드

```bash
cd studio && pnpm tokens
```

### 통합 테스트 (Integration Test Required = no)

해당 없음 (단위 테스트로 충분).

### 수동 검증 시나리오

1. `cd studio && pnpm dev` → 브라우저에서 Dashboard 진입 → Sidebar 폭 240 px (DevTools), App name "Studio" 노출 — 기대: leak 없음.
2. body 배경 색상이 `surface-alt` 토큰 값 (예: `#F8FAFC` 계열) 으로 렌더 — Paper page ground 와 일치.
3. 외부 grep: `git grep "appName=\"TaskFlow\"\|appName=\"Admin\"\|triggerLabel=\"Open\""` → studio/src 에 0 건 (테스트 컨텍스트 제외).

## 🔁 Rollback Plan

- 각 commit 단위로 revert 가능 — One Task = One Commit 원칙.
- tokens.json 변경이 빌드 깨면 해당 commit revert + `studio/src/styles/_tokens-light.css` 재생성.
- Breaking 변경 (default 제거) 으로 외부 영향 발견 시: 해당 prop 만 다시 optional + 명시적 default `undefined` 처리 후 별도 spec 으로 마이그레이션.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료 (1 scaffold + 6 정합화 + 1 ship = 8 commit)
- [ ] (실행 후) walkthrough.md / pr_description.md ship
- [ ] (실행 후) PR URL 사용자 보고
