# DESIGN.md Extended Schema

> Stitch/awesome-design-md 9섹션 기반 + 확장 5섹션.
> 기존 포맷과 100% 하위 호환 — 확장 섹션은 모두 선택(optional).

## Schema 요약

| # | 섹션 | 필수 | 출처 |
|---|------|:---:|------|
| 1 | Visual Theme & Atmosphere | ✅ | 기존 |
| 2 | Color Palette & Roles | ✅ | 기존 |
| 3 | Typography Rules | ✅ | 기존 |
| 4 | Component Stylings | ✅ | 기존 |
| 5 | Layout Principles | ✅ | 기존 |
| 6 | Depth & Elevation | ✅ | 기존 |
| 7 | Do's and Don'ts | ⚠️ | 기존 (대체 가능) |
| 8 | Responsive Behavior | ✅ | 기존 |
| 9 | Agent Prompt Guide | ✅ | 기존 |
| 10 | Naming Convention | — | **확장** |
| 11 | Page Specifications | — | **확장** |
| 12 | Composite Components | — | **확장** |
| 13 | Token Mapping | — | **확장** |
| 14 | i18n References | — | **확장** |

---

## 기존 섹션 (1~9)

### 1. Visual Theme & Atmosphere (필수)

브랜드의 전체적인 시각적 인상과 디자인 철학을 산문체로 기술.

**필수 항목**:
- 전체 분위기 설명 (1~2 문단)
- **Key Characteristics**: 핵심 시각 특성 불릿 리스트 (5~10항)

**권장 항목**:
- 대표 폰트와 그 선택 이유
- 브랜드 색상의 감성적 역할
- 경쟁/유사 브랜드와의 차별점

### 2. Color Palette & Roles (필수)

모든 색상 값과 시맨틱 역할 정의.

**필수 항목**:
- **Primary**: 핵심 브랜드 색상 (hex 값 + 용도)
- **Neutral Scale**: 텍스트/배경용 회색 계열

**권장 서브섹션**:
- Secondary & Accent
- Interactive (hover, active, selected)
- Status (success, error, warning)
- Surface & Background
- Border & Divider
- Shadow Colors (Stripe 패턴)

**포맷**:
```markdown
- **Color Name** (`#hex`): `--css-var-name`. 용도 설명.
```

### 3. Typography Rules (필수)

폰트 패밀리, 타입 스케일, 웨이트, 행간, 자간.

**필수 항목**:
- **Font Family**: Primary + Monospace (fallback 포함)
- **Hierarchy**: 테이블 형식

**Hierarchy 테이블 포맷**:
```markdown
| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | ... | 56px | 300 | 1.03 | -1.4px | ... |
```

**권장 항목**:
- OpenType Features (ss01, tnum 등)
- Principles (사용 원칙 설명)

### 4. Component Stylings (필수)

UI 컴포넌트의 시각적 스타일 상세.

**필수 컴포넌트**:
- Buttons (variant별: primary, secondary, ghost 등)
- Cards & Containers

**권장 컴포넌트**:
- Inputs & Forms
- Navigation
- Image Treatment
- Badges / Tags / Pills
- Distinctive Components (브랜드 고유 컴포넌트)

**각 컴포넌트 포맷**:
```markdown
**Variant Name**
- Background: `#hex`
- Text: `#hex`
- Padding: Npx Npx
- Radius: Npx
- Shadow: `...`
- 설명
```

### 5. Layout Principles (필수)

간격 시스템, 그리드, 컨테이너, 여백 철학.

**필수 항목**:
- **Spacing System**: Base unit + 스케일
- **Grid & Container**: 최대 너비, 컬럼 구조

**권장 항목**:
- Whitespace Philosophy
- Border Radius Scale

### 6. Depth & Elevation (필수)

그림자 시스템과 레이어링 규칙.

**필수 항목**:
- 엘리베이션 레벨 테이블

**포맷**:
```markdown
| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 | No shadow | 배경 |
| Level 1 | `shadow value` | 카드 |
```

### 7. Do's and Don'ts (선택 — 대체 가능)

디자인 가드레일. 브랜드 특성에 따라 다른 주제(Interaction & Motion, Dark Mode, Accessibility)로 대체 가능.

**포맷**:
```markdown
### Do
- 규칙 1
- 규칙 2

### Don't
- 금지 1
- 금지 2
```

### 8. Responsive Behavior (필수)

브레이크포인트, 터치 타겟, 컬랩싱 전략.

**필수 항목**:
- **Breakpoints**: 테이블 (이름, 너비, 주요 변경)
- **Collapsing Strategy**: 레이아웃 변환 규칙

**권장 항목**:
- Touch Targets (최소 44x44px)
- Image Behavior

### 9. Agent Prompt Guide (필수)

AI 에이전트가 코드 생성 시 참조하는 빠른 레퍼런스.

**필수 항목**:
- **Quick Color Reference**: 주요 색상 이름 + hex
- **Example Component Prompts**: 최소 3개

**권장 항목**:
- Iteration Guide (단계별 코드 생성 규칙)

---

## 확장 섹션 (10~14) — 모두 선택

> 이 섹션들은 기존 DESIGN.md에 없는 정보를 추가한다.
> 모두 선택(optional)이며, 포함하지 않아도 기존 9섹션 DESIGN.md는 유효하다.

### 10. Naming Convention (선택)

디자인 도구, 코드, 요구사항에서 동일하게 사용하는 **중간 언어** 계층 정의.

**목적**: 디자인 툴의 레이어명 = React의 컴포넌트명 = 요구사항의 참조명

**계층 구조**:
```
Page > Section > Block > Element
```

**각 레벨 정의**:

| 레벨 | 역할 | 예시 | 디자인 툴 | React |
|------|------|------|----------|-------|
| **Page** | 라우팅 가능한 전체 화면 | `LoginPage` | Top-level Frame | Route component |
| **Section** | 페이지 내 시각적 영역 구분 | `HeroSection` | Section group | `<section>` wrapper |
| **Block** | 기능적 단위 그룹 | `CredentialBlock` | Component group | Composite component |
| **Element** | 최소 인터랙션 단위 | `EmailInput` | Leaf node | Primitive component |

**명명 규칙**:
- PascalCase 사용 (디자인 도구 레이어명에도 동일 적용)
- 레벨 접미사 포함: `LoginPage`, `HeroSection`, `CredentialBlock`, `EmailInput`
- 약어 금지: `Nav` → `NavigationSection`

**포맷**:
```markdown
## 10. Naming Convention

### Hierarchy
Page > Section > Block > Element

### Page Map
| Page | Route | Description |
|------|-------|-------------|
| LoginPage | /login | 로그인 화면 |
| DashboardPage | /dashboard | 대시보드 메인 |

### Naming Examples
- LoginPage > HeroSection > CredentialBlock > EmailInput
- DashboardPage > StatsSection > RevenueBlock > ChartElement
```

### 11. Page Specifications (선택)

앱의 페이지 목록과 각 페이지의 내부 구조(Section → Block) 정의.

**목적**: "이 앱에 어떤 화면이 있고, 각 화면이 어떻게 구성되는가"

**포맷**:
```markdown
## 11. Page Specifications

### LoginPage
- **Route**: `/login`
- **Variant**: page | modal | bottom-sheet
- **Layout**: centered-card

| Section | Block | Description |
|---------|-------|-------------|
| BrandSection | LogoBlock | 앱 로고 + 이름 |
| FormSection | CredentialBlock | 이메일, 비밀번호 입력 |
| FormSection | SocialAuthBlock | Google, Apple, Kakao 로그인 |
| FooterSection | LinksBlock | 약관, 개인정보, 회원가입 링크 |

### DashboardPage
- **Route**: `/dashboard`
- **Variant**: sidebar-layout | full-page
- **Layout**: sidebar + main

| Section | Block | Description |
|---------|-------|-------------|
| StatsSection | RevenueBlock | 매출 차트 |
| StatsSection | UserCountBlock | 사용자 수 카드 |
| ActivitySection | RecentListBlock | 최근 활동 목록 |
```

### 12. Composite Components (선택)

Primitive를 조합한 재사용 컴포넌트 정의. Phase 2 (Page Template)에서 구현할 대상.

**목적**: "LoginForm은 어떤 Element로 구성되고, 어떤 variant를 지원하는가"

**포맷**:
```markdown
## 12. Composite Components

### LoginForm
- **Type**: Composite
- **Reusable**: yes (프로젝트 간)
- **Variants**: default | with-social | passwordless

| Element | Type | Required | Props |
|---------|------|:---:|-------|
| EmailInput | Input | ✅ | placeholder, validation |
| PasswordInput | Input | ✅ | placeholder, show/hide toggle |
| RememberCheckbox | Checkbox | — | label (i18n) |
| SubmitButton | Button | ✅ | label (i18n), loading state |
| SocialAuthGroup | ButtonGroup | — | providers[] |

### SignupForm
- **Type**: Composite
- **Reusable**: yes
- **Variants**: single-step | multi-step | social-only
...
```

### 13. Token Mapping (선택)

DESIGN.md의 색상/타이포/간격 값이 코드에서 어떻게 참조되는지 매핑.

**목적**: `#533afd` → `--color-primary` → `bg-primary` 연결

**포맷**:
```markdown
## 13. Token Mapping

### Color Tokens
| Design Name | Hex | CSS Variable | Tailwind Class |
|-------------|-----|-------------|----------------|
| Stripe Purple | #533afd | --color-primary | bg-primary / text-primary |
| Deep Navy | #061b31 | --color-heading | text-heading |
| Body Gray | #64748d | --color-body | text-body |

### Typography Tokens
| Role | CSS Variable | Tailwind Class |
|------|-------------|----------------|
| Display Hero | --font-display | text-display |
| Body | --font-body | text-body |

### Spacing Tokens
| Name | Value | CSS Variable | Tailwind Class |
|------|-------|-------------|----------------|
| space-xs | 4px | --space-xs | p-1 / gap-1 |
| space-sm | 8px | --space-sm | p-2 / gap-2 |
| space-md | 16px | --space-md | p-4 / gap-4 |

### Radius Tokens
| Name | Value | CSS Variable | Tailwind Class |
|------|-------|-------------|----------------|
| radius-sm | 4px | --radius-sm | rounded-sm |
| radius-md | 8px | --radius-md | rounded-md |
| radius-lg | 16px | --radius-lg | rounded-lg |
```

### 14. i18n References (선택)

다국어 텍스트 리소스의 키 네임스페이스와 참조 방식.

**목적**: UI 텍스트를 DESIGN.md에 하드코딩하지 않고, i18n JSON 키로 참조

**포맷**:
```markdown
## 14. i18n References

### Namespace Convention
`{page}.{section}.{element}.{property}`

Example: `login.form.email.placeholder` → "이메일을 입력하세요"

### Key Map
| Key | Default (ko) | en | Context |
|-----|-------------|-----|---------|
| login.form.email.placeholder | 이메일을 입력하세요 | Enter your email | LoginForm > EmailInput |
| login.form.submit.label | 로그인 | Sign in | LoginForm > SubmitButton |
| login.social.google.label | Google로 계속하기 | Continue with Google | SocialAuthGroup |
| login.footer.signup.prompt | 계정이 없으신가요? | Don't have an account? | FooterSection |

### Resource File Structure
```json
// i18n/ko.json
{
  "login": {
    "form": {
      "email": { "placeholder": "이메일을 입력하세요" },
      "submit": { "label": "로그인" }
    }
  }
}
```
```

---

## 하위 호환 규칙

1. **확장 섹션은 기존 9섹션 뒤에만 위치** — 기존 파서/도구에 영향 없음
2. **확장 섹션은 모두 선택** — 포함하지 않아도 유효한 DESIGN.md
3. **기존 섹션 제목 변경 금지** — `## 1. Visual Theme & Atmosphere` 등 그대로 유지
4. **확장 섹션 번호는 10부터** — 기존 번호 체계와 충돌 없음
5. **기존 DESIGN.md를 확장하려면** — 끝에 확장 섹션을 추가하기만 하면 됨
