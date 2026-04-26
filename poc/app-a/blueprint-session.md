# Blueprint Session — App A (TaskFlow)

> `schema/blueprint-protocol.md` 의 3 단계 질의를 실제로 실행한 세션 기록.
> 각 Step 의 질문 / 응답 / 결정 근거 + 마지막 통합 YAML (Fill Executor 입력) 을 포함.
>
> **세션 일자**: 2026-04-26
> **세션 주체**: Dennis (User) + Claude (Agent)
> **목표**: spec-5-01 산출물 (REQUIREMENTS / DESIGN / AGENT) 의 입력 YAML 확정

---

## Step 1 — 앱 유형 선택

### 질문 (protocol §Step 1)

> 어떤 유형의 앱을 만들고 싶으신가요? (SaaS / E-commerce / Social / Content / Utility / Custom)

### 응답

- **선택**: 1) SaaS (B2B 서비스)
- **앱 이름 후보**: TaskFlow, FlowDesk, Sprintly
- **확정**: `TaskFlow`

### 결정 근거

- Phase 2 가 이미 LoginPage / SignupPage / DashboardPage 3 종 Template 을 제공 — SaaS 추천 세트와 가장 잘 맞음
- "작은 팀의 작업 / 일정 관리, 1 인 PM 도 운영 가능" 이라는 핵심 가치 → 대시보드 + 인증 + 마이페이지 조합으로 충분히 표현 가능
- spec-4-02 가 LoginPage 1 종만 검증한 한계를 phase-5 에서 다양한 페이지로 확장하기 위해 5 종 이상 페이지를 가지는 SaaS 가 적합

### 출력 (내부 상태)

```yaml
meta:
  appType: "saas"
  appName: "TaskFlow"
  name: "taskflow"
recommendedPages:
  - { id: "auth-login",        priority: "required",    variant: "modal" }
  - { id: "auth-signup",       priority: "required",    variant: "page" }
  - { id: "auth-forgot-pw",    priority: "recommended", variant: "modal" }
  - { id: "dash-overview",     priority: "required",    variant: "page" }
  - { id: "dash-analytics",    priority: "recommended", variant: "page" }
  - { id: "profile-settings",  priority: "required",    variant: "page" }
  - { id: "content-list",      priority: "recommended", variant: "page" }
  - { id: "common-error",      priority: "required",    variant: "page" }
  - { id: "common-onboarding", priority: "recommended", variant: "modal" }
```

---

## Step 1.5 — 비기능 요구사항 (NFR)

### 질문 (protocol §Step 1.5)

인증 / 다국어 / 테마 일괄 확인.

### 응답

| 항목 | 응답 | 기본값과 비교 |
|---|---|---|
| 1) 인증 방식 | `email-password` | 기본값 유지 |
| 2) 소셜 로그인 | `google`, `github` | 기본 (없음) → SaaS 협업 도구 특성상 GitHub 필수 추가 |
| 3) 세션 전략 | `jwt-refresh` | 기본값 유지 |
| 4) 지원 언어 | `en` (앱 A 기준) | 기본 `ko` 에서 변경 — 앱 B (spec-5-04) 에서 `ko` 로 교체하여 재사용성 검증 목적 |
| 5) 기본 언어 | `en` | 4 와 일치 |
| 6) 지원 테마 | `light` | 기본값 유지 (다크 테마는 phase-6 에서 |
| 7) 기본 테마 | `light` | 6 과 일치 |

### 결정 근거

- 앱 A 를 영어 단일 로케일로 고정 → 앱 B 에서 `ko` 로 교체했을 때 토큰 / i18n 만 바꿔서 재사용 가능한지가 phase-5 핵심 가설
- 다크 테마는 본 PoC 범위 밖 (Studio v1 / phase-6 이후)
- GitHub 소셜 로그인은 개발자 / 팀 협업 도구 SaaS 의 사실상 표준

### 출력 (내부 상태)

```yaml
auth:
  method: "email-password"
  socialProviders: ["google", "github"]
  sessionStrategy: "jwt-refresh"
i18n:
  defaultLocale: "en"
  supportedLocales: ["en"]
theme:
  defaultTheme: "light"
  supportedThemes: ["light"]
```

---

## Step 2 — 페이지 구성 확인

### 질문 (protocol §Step 2)

추천 9 종 그대로 진행할지, 추가 / 제거할지.

### 응답

- **선택**: 2) 추가 / 제거 후 진행
- **변경 사항**:
  - 제거: `auth-forgot-pw` (PoC 범위 밖, Phase 6 으로 이관)
  - 제거: `dash-analytics` (DashboardPage 가 ⬜ analytics 분리 미구현, PoC 단순화)
  - 제거: `content-list` (TaskFlow 의 "작업 / 일정" 모델은 본 PoC 에서 Dashboard 위젯으로 흡수)
  - 제거: `common-onboarding` (PoC 범위 밖)
  - 변경: `profile-settings` → `profile-mypage` (마이페이지가 spec.md 명시 페이지)
- **최종 5 종**: `auth-login`, `auth-signup`, `dash-overview`, `profile-mypage`, `common-error`

### 결정 근거

- spec.md "Functional Requirements 2 — 5 종 이상" 충족
- Phase 2 가 구현한 ✅ Template (Login / Signup / Dashboard) + ⬜ 신규 (MyPage / Error) 조합 → spec-5-03 React 구현 단계에서 "기존 Template 활용 vs 신규 작성" 부담을 적절히 분배
- 마이페이지는 단순 정보 표시 → spec-5-03 에서 새 Template 작성이 가벼움
- NotFoundPage (`common-error`) 는 SaaS 추천 세트의 필수 항목 + 라우팅 검증에 필수

### 출력 (내부 상태)

```yaml
selectedPages:
  - { id: "auth-login",     priority: "required", defaultVariant: "modal" }
  - { id: "auth-signup",    priority: "required", defaultVariant: "page" }
  - { id: "dash-overview",  priority: "required", defaultVariant: "page" }
  - { id: "profile-mypage", priority: "required", defaultVariant: "page" }
  - { id: "common-error",   priority: "required", defaultVariant: "page" }
```

---

## Step 3 — variant / 섹션 커스터마이징

### 질문 (protocol §Step 3)

5 종 페이지의 기본 variant + 섹션을 일괄 확인.

### 응답

- **선택**: 2) 페이지별 세부 조정
- **조정 사항**:

#### auth-login

- **variant**: `modal` (그대로)
- **선택 섹션 ON/OFF**:
  - [x] ForgotPasswordLink — phase 4 가 검증한 LoginPage 와 정합
  - [x] SignupPrompt — 회원가입 유도 (UX 표준)
  - [ ] FooterLinks — 약관 / 개인정보는 별도 정적 페이지로 위임
  - [ ] RememberMe — PoC 범위 밖

#### auth-signup

- **variant**: `page` (그대로)
- **선택 섹션 ON/OFF**:
  - [x] SocialAuthBlock — Login 과 일관
  - [x] TermsAgreement — 약관 동의는 회원가입 필수 UX
  - [x] LoginPrompt — 로그인 유도
  - [ ] PasswordStrength — PoC 단순화

#### dash-overview

- **variant**: `page` (그대로 — 카탈로그상 page 만 정의됨)
- **선택 섹션 ON/OFF**:
  - [x] QuickActions — TaskFlow 핵심 (작업 빠른 추가)
  - [ ] ChartArea — Phase 5 PoC 단순화
  - [ ] NotificationBanner — 알림은 phase 6

#### profile-mypage

- **variant**: `page` (그대로)
- **선택 섹션 ON/OFF**:
  - [x] AvatarUpload — 마이페이지 핵심 UX
  - [ ] RecentActivity — Dashboard 와 중복 가능성
  - [ ] BadgeList — TaskFlow 도메인에 부적합

#### common-error

- **variant**: `page` (그대로)
- **선택 섹션 ON/OFF**:
  - [ ] SearchBox — 단순 404 화면
  - [ ] SuggestedLinks — 단순 404 화면
  - [ ] ReportButton — phase 6

### 결정 근거

- 모든 페이지의 variant 는 page-catalog.md 추천을 그대로 유지 — 변형은 spec-5-02 (Paper 시안) 에서 LoginPage modal / bottom-sheet 변환 실험 때 의도적으로 도입
- 선택 섹션 활성화는 "PoC 으로 의미 있는 최소" 기준 — 너무 풍부하면 재사용성 검증이 흐려짐
- AvatarUpload 활성화로 spec-5-03 에서 파일 업로드 컴포넌트의 토큰 적용 검증 가능

---

## 최종 통합 출력 YAML

> 본 YAML 이 `templates/REQUIREMENTS.md.template`, `templates/DESIGN.md.template`, `templates/AGENT.md.template` 의 Fill Executor 입력이 된다.

```yaml
meta:
  appName: "TaskFlow"
  name: "taskflow"
  appType: "saas"
  pageCount: 5

auth:
  method: "email-password"
  socialProviders: ["google", "github"]
  sessionStrategy: "jwt-refresh"

i18n:
  defaultLocale: "en"
  supportedLocales: ["en"]

theme:
  defaultTheme: "light"
  supportedThemes: ["light"]

finalPages:
  - id: "auth-login"
    name: "로그인"
    category: "auth"
    variant: "modal"
    componentPath: "@/components/templates/LoginPage"
    requiredSections:
      - "BrandHeader"
      - "LoginForm"
      - "SocialAuthBlock"
    optionalSections:
      - "ForgotPasswordLink"
      - "SignupPrompt"
    templateMapping:
      template: "LoginPage"
      status: "implemented"

  - id: "auth-signup"
    name: "회원가입"
    category: "auth"
    variant: "page"
    componentPath: "@/components/templates/SignupPage"
    requiredSections:
      - "BrandHeader"
      - "SignupForm"
    optionalSections:
      - "SocialAuthBlock"
      - "TermsAgreement"
      - "LoginPrompt"
    templateMapping:
      template: "SignupPage"
      status: "implemented"

  - id: "dash-overview"
    name: "대시보드 개요"
    category: "dashboard"
    variant: "page"
    componentPath: "@/components/templates/DashboardPage"
    requiredSections:
      - "DashboardHeader"
      - "Sidebar"
      - "StatCardGrid"
      - "ActivityTable"
    optionalSections:
      - "QuickActions"
    templateMapping:
      template: "DashboardPage"
      status: "implemented"

  - id: "profile-mypage"
    name: "마이페이지"
    category: "profile"
    variant: "page"
    componentPath: ""
    requiredSections:
      - "ProfileHeader"
      - "ProfileInfoCard"
      - "ActivitySummary"
    optionalSections:
      - "AvatarUpload"
    templateMapping:
      template: "MyPage"
      status: "not-implemented"

  - id: "common-error"
    name: "에러 (404/500)"
    category: "common"
    variant: "page"
    componentPath: ""
    requiredSections:
      - "ErrorIcon"
      - "ErrorMessage"
      - "HomeButton"
    optionalSections: []
    templateMapping:
      template: "ErrorPage"
      status: "not-implemented"
```

---

## 세션 메타

| 항목 | 값 |
|---|---|
| **총 질의 단계** | 4 (Step 1, 1.5, 2, 3) |
| **총 페이지 수** | 5 |
| **구현된 Template** | 3 (LoginPage / SignupPage / DashboardPage) |
| **미구현 Template** | 2 (MyPage / ErrorPage) — spec-5-03 에서 신규 작성 |
| **다음 단계** | REQUIREMENTS.md / DESIGN.md / AGENT.md 작성 (Task 3 ~ 5) |
