# TaskFlow — Design System

> Blueprint 질의서(`schema/blueprint-protocol.md`) Step 1~3 의 출력 + 디자인 의도(brand intent) 로 초안 작성.
> 시각 디자인 상세값(정확한 hex / shadow / spacing scale 등) 은 **spec-5-02 (Paper 시안 추출)** 단계에서 채워진다.
>
> **스키마**: `schema/design-md-schema.md` (14 섹션).
>
> **TODO 표기 규칙**: `TODO(spec-5-02)` 는 Paper MCP 에서 추출 예정, `TODO(spec-5-03)` 는 React 구현 단계에서 확정 예정.

| 항목 | 값 |
|---|---|
| **앱 이름** | TaskFlow |
| **기본 테마** | light |
| **지원 테마** | light |
| **토큰 리소스** | `poc/app-a/tokens.json` (spec-5-03 생성 예정) |
| **i18n 리소스** | `poc/app-a/i18n/en.json` (spec-5-03 생성 예정) |

---

## 1. Visual Theme & Atmosphere

TaskFlow 의 시각 분위기는 **차분한 인디고 베이스 + 청록 액센트** 의 협업 도구 미감을 지향한다. 강한 채도보다 절제된 톤으로 장시간 사용에도 피로가 적도록 설계하고, 강조 (Primary CTA / Active state) 에서만 인디고를 진하게 사용한다. 본문은 가독성 우선의 sans-serif (Inter 기준), 모노스페이스는 코드 스니펫 / 단축키 표기에만 제한적으로 사용한다.

### Key Characteristics

- 인디고 (`hsl(232, 50%, 50%)` 부근) 단일 Primary, 청록 (`hsl(186, 60%, 45%)` 부근) Accent 의 2-color 시스템
- 흰색 + 매우 옅은 회색 (`#FAFBFC` ~ `#F2F4F7`) 의 surface, 본문은 진한 슬레이트 (`#1F2937` 부근)
- 테이블 / 카드 / 버튼 모두 Radius 8px ~ 12px 범위로 통일 — 둥근 정도가 균질
- 그림자는 1 단계 (`elevation-card`) 와 2 단계 (`elevation-modal`) 만 사용 — 3 단계 이상 금지
- 일러스트나 화려한 그라디언트 없음 — 작업 도구의 정직함 / 기능성 우선
- Status 색은 의미 (success / warning / error / info) 에 맞게 4 종 — 액센트 청록과 충돌하지 않도록 sat 낮춤

> 정확한 hex 값과 hsla 표기는 `TODO(spec-5-02)` — Paper 시안에서 추출.

---

## 2. Color Palette & Roles

### Primary

- **Indigo / Primary** (`TODO(spec-5-02)` 정확 hex): `--color-primary`. CTA, 활성 메뉴, Focus 링.
- **Indigo / Primary-hover** (`TODO(spec-5-02)`): `--color-primary-hover`. 호버 상태.
- **Indigo / Primary-active** (`TODO(spec-5-02)`): `--color-primary-active`. 눌림 상태.

### Accent

- **Teal / Accent** (`TODO(spec-5-02)`): `--color-accent`. Secondary CTA, 그래프 보조선, 태그.

### Neutral Scale

- **Slate-900** (`#0F172A` 후보): `--color-text`. 본문 텍스트.
- **Slate-700** (`#334155` 후보): `--color-text-secondary`. 보조 텍스트.
- **Slate-500** (`#64748B` 후보): `--color-text-tertiary`. 캡션 / placeholder.
- **Slate-200** (`#E2E8F0` 후보): `--color-border`. Border / divider.
- **Slate-50**  (`#F8FAFC` 후보): `--color-surface-alt`. 카드 / 호버 배경.
- **White**     (`#FFFFFF`): `--color-surface`. 기본 배경.

### Status

- **Success** (`TODO(spec-5-02)`): `--color-success`. 완료 상태, 배지.
- **Warning** (`TODO(spec-5-02)`): `--color-warning`. 경고 / 마감 임박.
- **Error**   (`TODO(spec-5-02)`): `--color-error`. 폼 에러, 삭제.
- **Info**    (`TODO(spec-5-02)`): `--color-info`. 안내, 일반 알림.

> 전체 토큰 정의: `poc/app-a/tokens.json` (spec-5-03 생성).

---

## 3. Typography Rules

### Font Family

- **Primary**: `Inter, ui-sans-serif, system-ui, sans-serif`
- **Monospace**: `ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Display | Inter | 36px | 600 | 1.2 | -0.02em |
| H1 | Inter | 28px | 600 | 1.25 | -0.015em |
| H2 | Inter | 22px | 600 | 1.3 | -0.01em |
| H3 | Inter | 18px | 600 | 1.4 | -0.005em |
| Body / Default | Inter | 14px | 400 | 1.5 | 0 |
| Body Strong | Inter | 14px | 600 | 1.5 | 0 |
| Caption | Inter | 12px | 400 | 1.4 | 0.005em |
| Mono | JetBrains Mono | 13px | 400 | 1.5 | 0 |

> 정확한 size 단위 (px vs rem) 와 line-height 은 `TODO(spec-5-02)` — Paper 추출 후 확정.

---

## 4. Component Stylings

> 본 섹션의 정확한 값(background hex, exact padding 등) 은 `TODO(spec-5-02)`.
> spec-5-01 단계에서는 컴포넌트별 variant 종류만 선언한다.

### Button

- **Primary**: 인디고 배경 + 흰색 텍스트, radius 8px, padding `10px 16px`.
- **Secondary**: 흰색 배경 + 인디고 보더 + 인디고 텍스트.
- **Ghost**: 투명 배경 + 슬레이트-700 텍스트, hover 시 surface-alt.
- **Danger**: 적색 배경 + 흰색 텍스트 (계정 삭제 등).

### Input (TextField)

- 기본: 흰색 배경 + slate-200 보더 + slate-900 텍스트, radius 6px.
- Focus: 인디고 보더 + 인디고 ring 2px.
- Error: 에러 보더 + 에러 ring + helper text.

### Card

- 흰색 배경 + 슬레이트-200 보더 + radius 12px + elevation-card.

### Modal

- 흰색 배경 + radius 16px + elevation-modal + 백드롭 `rgba(15, 23, 42, 0.5)`.

---

## 5. Layout Principles

### Spacing System

- **Base unit**: 4px
- **Scale**: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 80 (px)

### Grid & Container

- **Max width**: 1280px (Dashboard / MyPage), 480px (Login modal)
- **Columns**: Dashboard 12-col grid, gutter 24px

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | 그림자 없음 | 기본 surface |
| 1 (`elevation-card`) | `0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)` (TODO 검증) | Card / Dropdown |
| 2 (`elevation-modal`) | `0 12px 32px rgba(15, 23, 42, 0.12)` (TODO 검증) | Modal / Popover |

> 정확 그림자값은 `TODO(spec-5-02)` — Paper 의 export 와 일치 검증.

---

## 7. Do's and Don'ts

### Do
- Primary 인디고는 페이지당 1 ~ 2 곳 (메인 CTA, 활성 메뉴) 에만 사용
- 본문은 14px / 400, 강조는 weight 만 600 으로 — 색이 아닌 weight 로 위계 표현
- 카드 / 버튼 / 인풋의 radius 는 모두 토큰 (`--radius-sm/md/lg`) 만 사용

### Don't
- 그라디언트 / 네온 / 글래스모피즘 사용 금지 — 차분한 톤 유지
- 본문에 인디고 텍스트 사용 금지 (CTA 텍스트 / 링크에만 허용)
- Body 크기를 12px 이하로 떨어뜨리지 말 것 (가독성)

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Primary Change |
|------|-------|----------------|
| sm | 0 ~ 640px | Sidebar → 햄버거, modal → bottom-sheet (variant) |
| md | 641 ~ 1024px | Sidebar 축약 모드 (아이콘만) |
| lg | 1025px ~ | 풀 사이드바 + 다단 그리드 |

### Collapsing Strategy

Dashboard 의 좌측 Sidebar 는 `md` 에서 아이콘 only, `sm` 에서 햄버거 메뉴로 접힌다. LoginPage 의 modal variant 는 `sm` 에서 bottom-sheet variant 로 자동 전환 (spec-5-02 에서 검증 예정).

---

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary**: 인디고 (`TODO(spec-5-02)` hex)
- **Accent**: 청록 (`TODO(spec-5-02)` hex)
- **Body Text**: Slate-900 (`#0F172A`)
- **Background**: White (`#FFFFFF`)

### Example Component Prompts

- "Primary Button 으로 'Sign in' CTA 를 만들어줘 — 인디고 배경 + 흰색 텍스트, radius 8px"
- "Dashboard StatCardGrid 에 4 개 카드 — 흰색 배경 + 슬레이트-200 보더 + Title (H3) + 큰 숫자 (Display)"
- "LoginPage modal variant — 480px 폭, radius 16px, elevation-modal, 중앙 정렬"

---

## 10. Naming Convention

### Hierarchy

```
Page > Section > Block > Element
```

### Page Map

| Page | Route | Description |
|------|-------|-------------|
| 로그인 | `/login` | 모달 형태, 이메일 + 패스워드 + 소셜 (Google/GitHub) |
| 회원가입 | `/signup` | 풀페이지, 이름/이메일/비밀번호 + 약관 동의 + 소셜 |
| 대시보드 개요 | `/` | 사이드바 + StatCardGrid + ActivityTable + QuickActions |
| 마이페이지 | `/me` | 프로필 카드 + 활동 요약 + 아바타 업로드 |
| 에러 (404/500) | `/*` (catch-all) | 에러 아이콘 + 메시지 + 홈으로 이동 |

---

## 11. Page Specifications

> Blueprint Step 2~3 의 결과. Section / Block 매핑 규칙: `schema/design-component-mapping.md` §11.

### 로그인 (auth-login)

- **Route**: `/login`
- **Variant**: modal
- **Layout**: centered-card

| Section | Block | Description |
|---------|-------|-------------|
| BrandSection | LogoBlock | TaskFlow 로고 (텍스트 마크) |
| FormSection | CredentialBlock | 이메일 / 패스워드 입력 (LoginForm) |
| FormSection | SocialAuthBlock | Google / GitHub 버튼 |
| FormSection | ForgotPasswordLink | 비밀번호 잊으셨나요 링크 (선택 ON) |
| FormSection | SignupPrompt | "처음이신가요? Sign up" (선택 ON) |

---

### 회원가입 (auth-signup)

- **Route**: `/signup`
- **Variant**: page
- **Layout**: split-screen

| Section | Block | Description |
|---------|-------|-------------|
| BrandSection | LogoBlock | TaskFlow 로고 |
| FormSection | SignupForm | 이름 / 이메일 / 비밀번호 / 확인 |
| FormSection | SocialAuthBlock | Google / GitHub (선택 ON) |
| FormSection | TermsAgreement | 약관 동의 체크박스 (선택 ON) |
| FormSection | LoginPrompt | "이미 계정이 있으신가요? Sign in" (선택 ON) |

---

### 대시보드 개요 (dash-overview)

- **Route**: `/`
- **Variant**: page
- **Layout**: shell (sidebar + main)

| Section | Block | Description |
|---------|-------|-------------|
| ChromeSection | Sidebar | 좌측 내비게이션 (Home / Tasks / Settings) |
| HeaderSection | DashboardHeader | 페이지 제목 + 검색 + 사용자 아바타 |
| MainSection | StatCardGrid | 4 종 지표 카드 (Active Tasks / Done / Overdue / Members) |
| MainSection | ActivityTable | 최근 활동 테이블 (작업명 / 담당 / 상태 / 시간) |
| MainSection | QuickActions | "+ New Task" 등 빠른 액션 (선택 ON) |

---

### 마이페이지 (profile-mypage)

- **Route**: `/me`
- **Variant**: page
- **Layout**: shell (sidebar + main)

| Section | Block | Description |
|---------|-------|-------------|
| ChromeSection | Sidebar | 공통 사이드바 |
| HeaderSection | ProfileHeader | 아바타 + 이름 + 역할 |
| MainSection | ProfileInfoCard | 이메일 / 가입일 / 팀 |
| MainSection | ActivitySummary | 작업 / 댓글 / 완료율 요약 |
| MainSection | AvatarUpload | 아바타 변경 영역 (선택 ON) |

---

### 에러 (common-error)

- **Route**: `/*` (catch-all)
- **Variant**: page
- **Layout**: centered-card

| Section | Block | Description |
|---------|-------|-------------|
| ContentSection | ErrorIcon | 404/500 아이콘 |
| ContentSection | ErrorMessage | 에러 코드 + 한 줄 설명 |
| ContentSection | HomeButton | "Back to Home" Primary Button |

---

## 12. Composite Components

> Phase 2 `studio/src/components/composites/` 와 1:1 매핑. 매핑 규칙: `schema/design-component-mapping.md` §12.

### LoginForm

- **Type**: Composite
- **Reusable**: yes
- **Variants**: default

| Element | Type | Required | Props |
|---------|------|:---:|-------|
| EmailField | TextField (Atom) | yes | label, value, onChange |
| PasswordField | TextField (Atom) | yes | label, value, onChange, type=password |
| SubmitButton | Button (Atom) | yes | variant=primary, type=submit |

### SocialAuthBlock

- **Type**: Composite
- **Reusable**: yes
- **Variants**: default, condensed

| Element | Type | Required | Props |
|---------|------|:---:|-------|
| GoogleButton | Button (Atom) | yes | variant=secondary, icon=google |
| GithubButton | Button (Atom) | yes | variant=secondary, icon=github |

### StatCard

- **Type**: Composite
- **Reusable**: yes
- **Variants**: default, trending-up, trending-down

| Element | Type | Required | Props |
|---------|------|:---:|-------|
| Title | Text (Atom) | yes | role=h3 |
| Value | Text (Atom) | yes | role=display |
| TrendIndicator | Icon + Text | no | direction, delta |

> 추가 Composite (DashboardHeader / Sidebar / ActivityTable / ProfileHeader / ProfileInfoCard / ActivitySummary / AvatarUpload / ErrorIcon / ErrorMessage / HomeButton) 는 spec-5-03 React 구현 단계에서 정의.

---

## 13. Token Mapping

> 디자인 값 → 코드 참조. 정확한 값 입력은 `TODO(spec-5-02)` (Paper 추출) 또는 `TODO(spec-5-03)` (실 구현 시 확정).
> 실제 토큰 값: `poc/app-a/tokens.json` (spec-5-03 에서 생성).

### Color Tokens

| Design Name | Hex | CSS Variable | Tailwind Class |
|-------------|-----|--------------|----------------|
| Primary | TODO | `--color-primary` | `bg-primary` |
| Primary-hover | TODO | `--color-primary-hover` | `hover:bg-primary-hover` |
| Accent | TODO | `--color-accent` | `bg-accent` |
| Text | `#0F172A` | `--color-text` | `text-foreground` |
| Surface | `#FFFFFF` | `--color-surface` | `bg-surface` |
| Border | `#E2E8F0` | `--color-border` | `border-border` |
| Success / Warning / Error / Info | TODO | `--color-{status}` | `bg-{status}` |

### Typography Tokens

| Role | CSS Variable | Tailwind Class |
|------|--------------|----------------|
| display | `--font-size-display` | `text-display` |
| h1 / h2 / h3 | `--font-size-h{n}` | `text-h{n}` |
| body | `--font-size-body` | `text-body` |
| caption | `--font-size-caption` | `text-caption` |

### Spacing Tokens

| Name | Value | CSS Variable | Tailwind Class |
|------|-------|--------------|----------------|
| xs | 4px | `--space-xs` | `p-1` |
| sm | 8px | `--space-sm` | `p-2` |
| md | 16px | `--space-md` | `p-4` |
| lg | 24px | `--space-lg` | `p-6` |
| xl | 32px | `--space-xl` | `p-8` |

### Radius Tokens

| Name | Value | CSS Variable | Tailwind Class |
|------|-------|--------------|----------------|
| sm | 6px | `--radius-sm` | `rounded-sm` |
| md | 8px | `--radius-md` | `rounded-md` |
| lg | 12px | `--radius-lg` | `rounded-lg` |
| xl | 16px | `--radius-xl` | `rounded-xl` |

---

## 14. i18n References

> 매핑 규칙: `schema/design-component-mapping.md` §14.
> 실제 리소스: `poc/app-a/i18n/en.json` (spec-5-03 에서 생성). 기본 언어 `en`, 지원 언어 `["en"]`.
> 앱 B (spec-5-04) 에서 `ko.json` 추가 → 토큰 / i18n 만 교체 재사용성 검증.

### Namespace Convention

```
{page}.{section}.{element}.{property}
```

Example: `login.form.email.placeholder` → "Enter your email"

### Key Map

| Key | Default (en) | Context |
|-----|--------------|---------|
| `app.name` | "TaskFlow" | 브랜드 이름 |
| `login.title` | "Sign in to TaskFlow" | 로그인 모달 제목 |
| `login.form.email.label` | "Email" | 이메일 입력 라벨 |
| `login.form.email.placeholder` | "you@company.com" | 이메일 입력 placeholder |
| `login.form.password.label` | "Password" | 비밀번호 입력 라벨 |
| `login.form.submit` | "Sign in" | 로그인 버튼 |
| `login.social.google` | "Continue with Google" | Google 로그인 버튼 |
| `login.social.github` | "Continue with GitHub" | GitHub 로그인 버튼 |
| `login.forgot` | "Forgot password?" | 비밀번호 잊음 링크 |
| `login.signupPrompt` | "Don't have an account? Sign up" | 회원가입 유도 |
| `signup.title` | "Create your TaskFlow account" | 회원가입 페이지 제목 |
| `signup.form.name.label` | "Full name" | 이름 라벨 |
| `signup.form.email.label` | "Email" | 이메일 라벨 |
| `signup.form.password.label` | "Password" | 비밀번호 라벨 |
| `signup.form.passwordConfirm.label` | "Confirm password" | 비밀번호 확인 라벨 |
| `signup.form.submit` | "Create account" | 회원가입 버튼 |
| `signup.terms` | "I agree to the Terms of Service" | 약관 동의 |
| `signup.loginPrompt` | "Already have an account? Sign in" | 로그인 유도 |
| `dashboard.title` | "Dashboard" | 대시보드 제목 |
| `dashboard.search.placeholder` | "Search tasks…" | 검색 placeholder |
| `dashboard.stats.activeTasks` | "Active Tasks" | 지표: 진행 작업 |
| `dashboard.stats.done` | "Done This Week" | 지표: 이번 주 완료 |
| `dashboard.stats.overdue` | "Overdue" | 지표: 지연 |
| `dashboard.stats.members` | "Team Members" | 지표: 팀원 |
| `dashboard.activity.title` | "Recent Activity" | 활동 테이블 제목 |
| `dashboard.activity.column.task` | "Task" | 컬럼: 작업명 |
| `dashboard.activity.column.assignee` | "Assignee" | 컬럼: 담당자 |
| `dashboard.activity.column.status` | "Status" | 컬럼: 상태 |
| `dashboard.activity.column.updated` | "Updated" | 컬럼: 변경 시각 |
| `dashboard.quickAction.newTask` | "+ New Task" | 빠른 액션 |
| `mypage.title` | "My Page" | 마이페이지 제목 |
| `mypage.info.email` | "Email" | 정보: 이메일 |
| `mypage.info.joinedAt` | "Joined" | 정보: 가입일 |
| `mypage.info.team` | "Team" | 정보: 소속 팀 |
| `mypage.summary.tasks` | "Tasks" | 요약: 작업 수 |
| `mypage.summary.comments` | "Comments" | 요약: 댓글 수 |
| `mypage.summary.completion` | "Completion Rate" | 요약: 완료율 |
| `mypage.avatar.upload` | "Change avatar" | 아바타 변경 |
| `error.404.title` | "Page not found" | 404 제목 |
| `error.404.message` | "We couldn't find the page you're looking for." | 404 본문 |
| `error.500.title` | "Something went wrong" | 500 제목 |
| `error.500.message` | "Please try again in a moment." | 500 본문 |
| `error.home` | "Back to Home" | 홈으로 버튼 |
| `nav.home` | "Home" | Sidebar: 홈 |
| `nav.tasks` | "Tasks" | Sidebar: 작업 |
| `nav.settings` | "Settings" | Sidebar: 설정 |
| `auth.user.signOut` | "Sign out" | 사용자 메뉴: 로그아웃 |

---

## 부록: 본 문서의 미완료 항목 요약 (TODO Index)

| TODO 출처 | 채우는 단계 | 항목 |
|---|---|---|
| `TODO(spec-5-02)` | Paper 시안 추출 | 색상 정확 hex, 그림자값, 정확한 size 단위 |
| `TODO(spec-5-03)` | React 구현 | tokens.json, i18n/en.json, 추가 Composite (DashboardHeader 등) |

> 본 DESIGN.md 는 spec-5-01 의 Blueprint 단계 산출물이며, **시각 디자인 정확값은 spec-5-02 에서 채워진다**.
> 이 분리는 의도적 — Phase 4 회고 (W2) 에서 "Stage 3 Blueprint vs Stage 4 Compose 의 측정 분리" 가 부채로 등재됨에 따라, 본 spec 에서 Blueprint 출력의 한계를 명확히 구분한다.
