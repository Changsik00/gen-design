# auth-login — Paper 추출 결과

> spec-5-02 추출 산출물 1/5. Paper artboard `1CH-0` ("TaskFlow — Login") 의 schema 14 섹션 추출.
> 표기 정규화 전 원본값. 정규화 / 비교는 `poc/app-a/drift-report.md` 참조.

## 1. Visual Theme & Atmosphere

차분한 인디고 액센트 + 어두운 백드롭의 modal 로그인. 정중앙 480px 카드 + 상하 여백. 본문은 슬레이트 텍스트, CTA 만 인디고로 강조.

**Key Characteristics**:
- 백드롭 색 `#0F172A` (Slate 900) 자체 — modal variant 의 페이지 시안 표현
- Modal 카드 단일 인스턴스 (480px), elevation-modal 1 단계
- Inter 단일 패밀리, 22px / 14px / 13px / 12px 4 단계
- 인디고 단일 액센트, 슬레이트 보조 (그라디언트 / 일러스트 없음)

## 2. Color Palette & Roles

### Primary
- **Indigo / Primary** (`#4F46E5`): `--color-primary`. SubmitButton bg / LogoMark bg / Forgot link / Focus border + ring / Sign up link.

### Neutral
- **Slate-900** (`#0F172A`): `--color-text` + `--color-backdrop` (modal variant).
- **Slate-700** (`#334155`): `--color-text-secondary`. Email/Password label.
- **Slate-500** (`#64748B`): `--color-text-tertiary`. Subtitle / SignupPrompt 의문문.
- **Slate-400** (`#94A3B8`): placeholder / divider 라벨 "OR CONTINUE WITH".
- **Slate-200** (`#E2E8F0`): `--color-border`. Input default border / divider line / Google·GitHub button border.
- **White** (`#FFFFFF`): `--color-surface`. Modal bg / Input bg / Social button bg.

### Brand Identity (3rd-party reference)
- Google: `#4285F4 / #34A853 / #FBBC05 / #EA4335` — 그대로 유지 (외부 IdP 표기).
- GitHub icon: `#0F172A` (slate-900) 사용 — 기본 black 대신 본 시스템의 text 토큰 적용.

### Status
N/A (Login 페이지에는 status 색 미사용)

## 3. Typography Rules

### Font Family
- **Primary**: `"Inter", system-ui, sans-serif`

### Hierarchy (페이지 사용분)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Title | Inter | 22px | 600 | round(up, 130%, 1px) | -0.01em |
| BrandMark | Inter | 18px | 700 | (default) | -0.01em |
| Body | Inter | 14px | 400 | (default) | 0 |
| Body Strong | Inter | 14px | 500 | (default) | 0 |
| Label | Inter | 13px | 500 | (default) | 0 |
| Helper / Subtitle | Inter | 14px | 400 | 1.5 | 0 |
| Caption (Divider) | Inter | 12px | 500 | (default) | 0.04em (uppercase) |

## 4. Component Stylings

### Button — Primary (SubmitButton)
- height 44px, border-radius 8px, bg `#4F46E5`, white text 14px / 600.

### Button — Secondary (Google / GitHub)
- height 44px, border-radius 8px, bg `#FFFFFF`, border 1px `#E2E8F0`, gap 10px (icon + label), label 14px / 500 / `#334155`.

### Input (TextField)
- height 44px, border-radius 6px, bg `#FFFFFF`, border 1px `#E2E8F0`, padding-inline 14px.
- **Focus state**: border `#4F46E5`, box-shadow `#4F46E52E 0px 0px 0px 3px` (= `rgba(79, 70, 229, 0.18)` 3px ring).

### Modal (LoginModal)
- width 480px, border-radius 16px, padding 40px, gap 24px, bg `#FFFFFF`.
- box-shadow: `#0F172A2E 0px 12px 32px, #0F172A14 0px 2px 6px` (= `rgba(15, 23, 42, 0.18)` + `rgba(15, 23, 42, 0.08)` 2-stop).

### LogoMark
- 28×28, border-radius 8px, bg `#4F46E5`, inner glyph 12×12 white square radius 3px.

### Divider (with label)
- 1px line `#E2E8F0` 좌우, 가운데 12px label uppercase tracking 0.04em.

## 5. Layout Principles

- **Page layout**: centered-card. 1440×900 viewport, modal 480px 정중앙.
- **Modal padding**: 40px all sides.
- **Internal gap**: 24px (sections), 16px (form rows), 6px (label↔input).
- **Form button height**: 44px (Submit / Social 동일 — vertical lane 일관).

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | 그림자 없음 | Input / Button base |
| modal | `#0F172A2E 0px 12px 32px, #0F172A14 0px 2px 6px` | Modal |
| focus-ring | `#4F46E52E 0px 0px 0px 3px` | Input focus |

## 7. Do's and Don'ts

- **Do**: Primary indigo 는 CTA / Logo / Focus / Link 4 곳에만 사용.
- **Do**: Body 텍스트는 weight (400 vs 500/600) 로 위계 표현, 색은 보조.
- **Don't**: Modal variant 의 백드롭이 어두워도 지정 fade 만 (`#0F172A` 단색 표현).

## 8. Responsive Behavior

본 페이지 시안은 desktop (1440×900) 기준 단일 표현. modal → bottom-sheet variant 는 본 spec 범위 외 (Icebox `phase-5 이월 follow-ups`).

## 9. Agent Prompt Guide

### Quick Reference
- Primary CTA: `bg #4F46E5 / radius 8 / height 44 / text white 14px 600`
- Input: `bg white / border 1 #E2E8F0 / radius 6 / height 44`
- Input Focus: `border #4F46E5 / box-shadow #4F46E52E 0 0 0 3px`

### Example Prompts
- "Sign in CTA — `#4F46E5` 배경 + 흰색 14px 600 텍스트, radius 8, height 44"
- "Email input default — radius 6, border `#E2E8F0`, padding-inline 14, placeholder `#94A3B8`"

## 10. Naming Convention

### Page Map (본 페이지)

| Page | Route | Description |
|---|---|---|
| 로그인 | `/login` | Modal centered-card |

### Hierarchy (Section > Block > Element)

```
LoginPage
├─ LoginModal (Card)
│  ├─ BrandSection
│  │  ├─ LogoBlock (LogoMark + WordMark)
│  │  ├─ Title
│  │  └─ Subtitle
│  ├─ CredentialBlock
│  │  ├─ EmailField (Label + Input)
│  │  ├─ PasswordField (Label + ForgotLink + Input focus)
│  │  └─ SubmitButton
│  ├─ Divider (line + label "OR CONTINUE WITH" + line)
│  ├─ SocialAuthBlock
│  │  ├─ GoogleButton (icon + label)
│  │  └─ GithubButton (icon + label)
│  └─ SignupPrompt (text + link)
```

## 11. Page Specifications

### 로그인 (auth-login)

- **Route**: `/login`
- **Variant**: modal
- **Layout**: centered-card

| Section | Block | Description |
|---|---|---|
| BrandSection | LogoBlock | 28px LogoMark + "TaskFlow" 18px 700 |
| BrandSection | Title | "Sign in to TaskFlow" 22px 600 |
| BrandSection | Subtitle | "Pick up where your team left off." 14px 400 `#64748B` |
| FormSection | CredentialBlock | EmailField (default) + PasswordField (focus state, ForgotLink 포함) + SubmitButton |
| FormSection | Divider | 1px line `#E2E8F0` + uppercase label |
| FormSection | SocialAuthBlock | GoogleButton + GithubButton |
| FormSection | SignupPrompt | "Don't have an account? Sign up" |

## 12. Composite Components (페이지 사용분)

### LoginForm — 본 페이지 변주
- EmailField (Atom Input default)
- PasswordField (Atom Input focus + ForgotLink 우상단)
- SubmitButton (Atom Button primary)

### SocialAuthBlock
- GoogleButton (Atom Button secondary + brand icon)
- GithubButton (Atom Button secondary + slate-900 icon)

## 13. Token Mapping

### Color Tokens (페이지 사용분)

| Design Name | Hex | CSS Variable |
|---|---|---|
| Primary | `#4F46E5` | `--color-primary` |
| Text | `#0F172A` | `--color-text` |
| Text Secondary | `#334155` | `--color-text-secondary` |
| Text Tertiary | `#64748B` | `--color-text-tertiary` |
| Text Placeholder | `#94A3B8` | `--color-text-placeholder` |
| Surface | `#FFFFFF` | `--color-surface` |
| Border | `#E2E8F0` | `--color-border` |

### Radius Tokens (페이지 사용분)

| Name | Value | Usage |
|---|---|---|
| sm | 6px | Input |
| md | 8px | Button / LogoMark |
| 2xl | 16px | Modal |

### Spacing Tokens (페이지 사용분)

| Name | Value | Usage |
|---|---|---|
| xs | 6px | label↔input |
| md | 16px | form rows |
| lg | 24px | section gap |
| xl | 40px | modal padding |

## 14. i18n References

| Key | Default (en) | Source |
|---|---|---|
| `app.name` | "TaskFlow" | LogoBlock WordMark |
| `login.title` | "Sign in to TaskFlow" | Title |
| `login.subtitle` | "Pick up where your team left off." | Subtitle (NEW — DESIGN.md §14 미등재, drift 신호) |
| `login.form.email.label` | "Email" | EmailField label |
| `login.form.email.placeholder` | "you@company.com" | EmailField placeholder |
| `login.form.password.label` | "Password" | PasswordField label |
| `login.form.submit` | "Sign in" | SubmitButton |
| `login.divider.or` | "OR CONTINUE WITH" | Divider (NEW — uppercase) |
| `login.social.google` | "Continue with Google" | GoogleButton |
| `login.social.github` | "Continue with GitHub" | GithubButton |
| `login.forgot` | "Forgot password?" | ForgotLink |
| `login.signupPrompt.text` | "Don't have an account?" | SignupPrompt 의문문 |
| `login.signupPrompt.cta` | "Sign up" | SignupPrompt 링크 |

> drift 신호: `login.subtitle` / `login.divider.or` 는 DESIGN.md §14 에 미등재 (생성 시 추가됨). `login.signupPrompt` 는 DESIGN.md 가 단일 키 `login.signupPrompt` 로 정의했으나 추출은 의문문 / 링크 분리.
