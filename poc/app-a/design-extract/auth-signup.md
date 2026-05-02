# auth-signup — Paper 추출 결과

> spec-5-02 추출 산출물 2/5. Paper artboard `1DR-0` ("TaskFlow — Signup") 의 schema 14 섹션 추출.
> 공통 토큰은 `auth-login.md` §13 과 일치. 본 파일은 Signup 특화 항목 위주.

## 1. Visual Theme & Atmosphere

split-screen 회원가입 — 좌측 인디고 brand panel + 우측 흰 form panel. Brand panel 은 36px Display 헤드라인으로 brand pitch 를 강조, form panel 은 14px 밀도 폼.

**Key Characteristics**:
- Brand panel bg `#4338CA` (Indigo darker variant — primary `#4F46E5` 보다 진함)
- 좌측 56px / 우측 80~96px 의 비대칭 padding
- Display 36px 사용은 본 페이지가 유일 (page hero 표현)
- 흰 폼은 Login modal 과 동일 컴포넌트 재사용

## 2. Color Palette & Roles

### Primary
- **Indigo / Primary** (`#4F46E5`): SubmitButton / Checkbox / Login link / Terms link.
- **Indigo / Brand-deep** (`#4338CA`): `--color-brand-deep`. Brand panel bg + LogoMark inverse glyph color.

### Neutral
- 동일 — Slate-900/700/500/400/200 + White (auth-login.md §2 참조).

### Brand Identity (3rd-party)
- 동일 — Google 4-color / GitHub `#0F172A`.

### Status
N/A.

## 3. Typography Rules

### Hierarchy (페이지 사용분 — Login 외 추가)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Display | Inter | 36px | 600 | 1.2 | -0.02em |
| H1 | Inter | 28px | 600 | round(up, 125%, 1px) | -0.015em |

> Body / Label / Helper / Caption 은 Login 과 동일.

## 4. Component Stylings

### Button — Primary (SubmitButton, Signup variant)
- height 48px (Login 의 44px 보다 큼 — page hero CTA), border-radius 8px, bg `#4F46E5`, label 15px / 600 / white.

### Checkbox (TermsAgreement)
- 18×18, border-radius 4px, bg `#4F46E5` (checked), border 1px `#4F46E5`, inner SVG check stroke `#FFFFFF`.

### BrandPanel
- bg `#4338CA`, padding 56px, width 560px (1440 의 ≈39%).
- Inner stack: LogoBlock (top) / BrandPitch (mid, justify-content: space-between) / BrandFooter (bottom).
- BrandFooter color `rgba(255, 255, 255, 0.6)`.

### Input / SocialAuthBlock / Divider / LoginPrompt
- 동일 — auth-login.md §4 참조.

## 5. Layout Principles

- **Page layout**: split-screen.
- **Brand panel**: 560px fixed, 56px padding.
- **Form panel**: flex (≈880px), padding 80×96px (top×right==bottom×left 비대칭).
- **Form internal gap**: 28px (sections), 16px (rows), 12px (PasswordRow gap = horizontal 2-column).
- **2-column password row**: PasswordField (flex 1) + PasswordConfirmField (flex 1).

## 6. Depth & Elevation

N/A — Brand panel 은 단색, form panel 은 surface 위 직접. elevation 미사용.

## 7. Do's and Don'ts

- **Do**: Brand pitch 는 Display 단 1 인스턴스. 본 페이지에서만 36px 사용.
- **Don't**: Brand panel 에 흰색 텍스트의 opacity 는 0.6 (footer) / 0.78 (subtitle) / 1.0 (title) 3 단계만 — 그 외 사용 금지.

## 8. Responsive Behavior

본 시안은 desktop (1440×900) 단일. 좁은 viewport 에서는 BrandPanel 이 위로 stack 되는 변형이 일반적이나 본 spec 범위 외.

## 9. Agent Prompt Guide

- "Signup CTA — `#4F46E5` bg / radius 8 / height 48 / 15px 600 white"
- "Brand panel — `#4338CA` bg / 56px padding / 560 width / 36px Display 위 + 14px 78% white 아래"

## 10. Naming Convention

```
SignupPage (split-screen)
├─ BrandPanel (left 560px)
│  ├─ LogoBlock (32px LogoMark + 20px WordMark)
│  ├─ BrandPitch (Display + Subtitle)
│  └─ BrandFooter (12px caption + dot separator)
└─ FormPanel (right flex)
   ├─ FormHeader (H1 + Subtitle)
   ├─ SignupForm
   │  ├─ NameField
   │  ├─ EmailField
   │  └─ PasswordRow (PasswordField + PasswordConfirmField)
   ├─ TermsAgreement (Checkbox + text)
   ├─ SubmitButton (large)
   ├─ Divider
   ├─ SocialAuthBlock (Google + GitHub, 2-column)
   └─ LoginPrompt
```

## 11. Page Specifications

### 회원가입 (auth-signup)

- **Route**: `/signup`
- **Variant**: page
- **Layout**: split-screen

| Section | Block | Description |
|---|---|---|
| BrandSection | LogoBlock | 32px LogoMark (white inner glyph indigo `#4338CA`) + "TaskFlow" 20px 700 white |
| BrandSection | BrandPitch | "A calmer way to ship work." 36px 600 white + 14px 400 white@78% |
| BrandSection | BrandFooter | "© 2026 TaskFlow Inc. · Privacy · Terms" 12px 400 white@60% |
| FormSection | FormHeader | "Create your TaskFlow account" 28px 600 + 14px 400 `#64748B` |
| FormSection | SignupForm | NameField + EmailField + PasswordRow (2-column) |
| FormSection | TermsAgreement | Checkbox checked + 13px 400 + Terms / Privacy 링크 (indigo 600) |
| FormSection | SubmitButton | "Create account" — 48px height (page hero CTA) |
| FormSection | Divider | 1px line `#E2E8F0` + "OR SIGN UP WITH" caption |
| FormSection | SocialAuthBlock | Google + GitHub 2-column flex 1 each, 12px gap |
| FormSection | LoginPrompt | "Already have an account? Sign in" |

## 12. Composite Components (페이지 사용분)

### SignupForm
- NameField (Atom Input)
- EmailField (Atom Input)
- PasswordField (Atom Input password)
- PasswordConfirmField (Atom Input password)

### TermsAgreement
- Checkbox (Atom)
- AgreementText (rich text — 본문 + 2 inline link)

### BrandPanel (NEW Composite — page-level)
- LogoBlock (inverse — light surface on dark)
- BrandPitch (Display headline + Subtitle)
- BrandFooter (small print)

## 13. Token Mapping

### Color Tokens (페이지 사용분 — Login 외 추가)

| Design Name | Hex | CSS Variable |
|---|---|---|
| Brand-deep | `#4338CA` | `--color-brand-deep` |
| White-78% | `rgba(255, 255, 255, 0.78)` | `--color-on-brand-secondary` |
| White-60% | `rgba(255, 255, 255, 0.6)` | `--color-on-brand-tertiary` |

### Radius Tokens (페이지 사용분 — Login 외 추가)

| Name | Value | Usage |
|---|---|---|
| xs | 4px | Checkbox |

### Spacing Tokens (페이지 사용분 — Login 외 추가)

| Name | Value | Usage |
|---|---|---|
| 2xl | 28px | form section gap |
| 4xl | 56px | brand panel padding |
| 5xl | 80px | form panel vertical padding |
| 6xl | 96px | form panel horizontal padding |

## 14. i18n References

| Key | Default (en) | Source |
|---|---|---|
| `app.name` | "TaskFlow" | BrandPanel WordMark |
| `signup.brand.headline` | "A calmer way to ship work." | BrandPitch (NEW — DESIGN.md §14 미등재, drift 신호) |
| `signup.brand.subtitle` | "TaskFlow brings your tasks, activity, and teammates into one quiet workspace — built for focus, not noise." | BrandPitch subtitle (NEW) |
| `signup.brand.footer` | "© 2026 TaskFlow Inc. · Privacy · Terms" | BrandFooter (NEW — 정적 텍스트) |
| `signup.title` | "Create your TaskFlow account" | FormHeader |
| `signup.subtitle` | "Free for individuals. Upgrade your team anytime." | FormHeader subtitle (NEW) |
| `signup.form.name.label` | "Full name" | NameField |
| `signup.form.name.placeholder` | "Alex Park" | NameField placeholder (NEW) |
| `signup.form.email.label` | "Email" | EmailField |
| `signup.form.email.placeholder` | "alex@taskflow.app" | EmailField placeholder (NEW) |
| `signup.form.password.label` | "Password" | PasswordField |
| `signup.form.passwordConfirm.label` | "Confirm password" | PasswordConfirmField |
| `signup.terms.intro` | "I agree to the" | TermsAgreement (NEW — split text) |
| `signup.terms.tos` | "Terms of Service" | inline link |
| `signup.terms.and` | "and" | inline word |
| `signup.terms.privacy` | "Privacy Policy" | inline link |
| `signup.form.submit` | "Create account" | SubmitButton |
| `signup.divider.or` | "OR SIGN UP WITH" | Divider |
| `signup.social.google` | "Google" | GoogleButton (NEW — Login 의 "Continue with Google" 보다 짧음, drift 신호) |
| `signup.social.github` | "GitHub" | GithubButton (NEW — 동일 drift) |
| `signup.loginPrompt.text` | "Already have an account?" | LoginPrompt 의문문 |
| `signup.loginPrompt.cta` | "Sign in" | LoginPrompt 링크 |

> drift 신호 요약: ① Brand pitch / footer 는 정적 카피 (i18n 키 신설 필요) ② Social button label 이 "Google"/"GitHub" 단축형 (Login 은 "Continue with X" 풀형) — 동일 컴포넌트의 페이지 별 카피 차이 ③ Terms 분리 키 (intro / tos / and / privacy) 가 단일 문자열 보다 i18n 친화적이지만 DESIGN.md §14 는 단일 `signup.terms` 로 정의.
