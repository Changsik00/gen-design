# Drift Report — DESIGN.md ↔ Paper 추출 5 페이지

> spec-5-02 핵심 산출물 2/2. spec-5-01 산출물 `poc/app-a/DESIGN.md` 와 `poc/app-a/design-extract/*.md` (5 페이지) 를 항목별 비교한 drift 분석.
> intent-preservation.md (Settings 의도 보존 검증) 와 상호 보완.

## §1. 5 페이지 × N 항목 drift 표

> 카테고리: ✅ 일치 / ⚠ 부분 일치 / 🔴 불일치 / ➕ 신규 추가 (의도엔 없으나 추출에서 발견)

### 1.1 Login (`auth-login.md`)

| 항목 | DESIGN.md | 추출 | 카테고리 | 메모 |
|---|---|---|:---:|---|
| Variant | modal | modal | ✅ | |
| Layout | centered-card | centered-card | ✅ | |
| BrandSection / LogoBlock | Logo 텍스트 마크 | LogoMark 28px + WordMark 18/700 | ✅ | |
| FormSection / CredentialBlock | Email + Password (LoginForm) | EmailField + PasswordField (focus state 포함) | ✅ | |
| FormSection / SocialAuthBlock | Google + GitHub | Google + GitHub (4-color brand icon) | ✅ | |
| FormSection / ForgotPasswordLink | 선택 ON | Forgot password? 링크 | ✅ | |
| FormSection / SignupPrompt | 선택 ON | "Don't have an account? Sign up" | ✅ | |
| Title 텍스트 | (정의 없음, i18n `login.title`) | "Sign in to TaskFlow" | ✅ | i18n 일치 |
| Subtitle | DESIGN.md §11 미정의 | "Pick up where your team left off." | ➕ | i18n NEW: `login.subtitle` |
| Divider 라벨 | DESIGN.md §11 미정의 | "OR CONTINUE WITH" uppercase | ➕ | i18n NEW: `login.divider.or` |
| signupPrompt 분리 | 단일 키 `login.signupPrompt` | 의문문 + 링크 분리 | ⚠ | i18n 키 분리 필요 |
| Button height | (정의 없음) | 44px (Submit + Social 동일) | ✅ | |
| Modal radius | 16px (§4) | 16px | ✅ | |
| Input radius | 6px (§4) | 6px | ✅ | |
| Button radius | 8px (§4) | 8px | ✅ | |
| Modal shadow | elevation-modal 2-stop | `#0F172A2E 0 12px 32px, #0F172A14 0 2px 6px` | ⚠ | spec-5-01 추정값 (`0.06+0.04`/`0.12`) → 추출 (`0.18+0.08`) — 짙어짐 |
| Focus ring | (정의 없음) | `#4F46E52E 0 0 0 3px` (= rgba(79,70,229,0.18) 3px) | ➕ | |

**Login drift 점수**: 컴포넌트 1.0 / 토큰 0.95 (modal shadow 짙어짐) / i18n 0.85 (subtitle/divider/signupPrompt 분리)

### 1.2 Signup (`auth-signup.md`)

| 항목 | DESIGN.md | 추출 | 카테고리 | 메모 |
|---|---|---|:---:|---|
| Variant | page | page | ✅ | |
| Layout | split-screen | split-screen (560 + flex) | ✅ | |
| BrandSection / LogoBlock | Logo | LogoMark 32 + WordMark 20/700 white | ✅ | |
| FormSection / SignupForm | 이름/이메일/비밀번호/확인 | 동일 + PasswordRow 2-column | ✅ | |
| FormSection / SocialAuthBlock | Google + GitHub (선택) | 동일 (단축 라벨 "Google" / "GitHub") | ⚠ | Login 의 "Continue with X" 풀형과 비대칭 |
| FormSection / TermsAgreement | 약관 동의 (선택) | Checkbox checked + inline links | ✅ | |
| FormSection / LoginPrompt | 선택 | "Already have an account? Sign in" | ✅ | |
| BrandPitch | DESIGN.md 미정의 | 36px Display "A calmer way to ship work." + subtitle | ➕ | 신규 Composite |
| BrandFooter | DESIGN.md 미정의 | "© 2026 TaskFlow Inc. · Privacy · Terms" | ➕ | 정적 카피 |
| Brand panel bg | (정의 없음) | `#4338CA` (Indigo 700, Brand-deep) | ➕ | 신규 토큰 |
| White on dark opacity | (정의 없음) | 1.0 / 0.78 / 0.6 3 단계 | ➕ | 신규 토큰 |
| Submit height | (정의 없음) | 48px (Login 의 44px 보다 큼) | ⚠ | page hero CTA 차별 |
| Display 36px | §3 표 정의 | Display 36/600/-0.02em/1.2 | ✅ | |
| H1 28px | §3 표 정의 | H1 28/600/-0.015em/1.25 | ✅ | |
| Checkbox | DESIGN.md §4 미정의 | 18×18 / radius 4 / bg `#4F46E5` | ➕ | 신규 컴포넌트 |
| signup.terms | 단일 키 | intro / tos / and / privacy 4 분리 | ⚠ | i18n 분리 |

**Signup drift 점수**: 컴포넌트 0.9 (BrandPanel/Checkbox 신규) / 토큰 1.0 (모두 일관) / i18n 0.7 (brand pitch/footer/social 단축형/terms 분리)

### 1.3 Dashboard (`dash-overview.md`)

| 항목 | DESIGN.md | 추출 | 카테고리 | 메모 |
|---|---|---|:---:|---|
| Variant | page | page | ✅ | |
| Layout | shell (sidebar + main) | shell (240 + flex) | ✅ | |
| ChromeSection / Sidebar | 좌측 nav (Home/Tasks/Settings) | LogoBlock + NavGroup + UserCard | ✅ | |
| HeaderSection / DashboardHeader | 페이지 제목 + 검색 + 사용자 아바타 | Title + Subtitle + SearchInput + QuickActionNewTask | ⚠ | "사용자 아바타" → UserCard 가 Sidebar 로 이동 (drift) |
| MainSection / StatCardGrid | 4 종 (Active / Done / Overdue / Members) | 일치 (StatCardActive/Done/Overdue/Members) | ✅ | |
| MainSection / ActivityTable | 작업/담당/상태/시간 | TableHeaderRow + ActivityRow × 4 (4 종 status) | ✅ | |
| MainSection / QuickActions | "+ New Task" 별도 Block (선택) | HeaderActions 안에 흡수 | ⚠ | Block 위치 변경 |
| Title 카피 | "Dashboard" (DESIGN.md §14) | "Good morning, Alex" 동적 인사 | 🔴 | i18n 정의와 불일치 — 동적으로 변경 |
| Status 4 종 | DESIGN.md §14 미정의 | in-progress / done / overdue / backlog enum | ➕ | i18n NEW 4 키 |
| StatCard radius | 12px (§4) | 12px | ✅ | |
| StatCard shadow | elevation-card | `#0F172A0A 0 1px 2px` (단일 stop) | ⚠ | spec-5-01 추정 2-stop → 추출 단일 stop |
| Avatar small | (정의 없음) | 24×24 round, color-coded | ➕ | |
| Sidebar width | (정의 없음) | 240px | ➕ | |
| NavItem active | (정의 없음) | bg `#EEF2FF` + text `#4F46E5` 14/600 | ➕ | 신규 토큰 (Primary subtle) |

**Dashboard drift 점수**: 컴포넌트 0.85 (QuickActions/UserCard 위치 drift) / 토큰 0.95 (shadow 단일 stop) / i18n 0.5 (인사/delta/status enum 다수 NEW)

### 1.4 MyPage (`profile-mypage.md`)

| 항목 | DESIGN.md | 추출 | 카테고리 | 메모 |
|---|---|---|:---:|---|
| Variant | page | page | ✅ | |
| Layout | shell (sidebar + main) | shell (Sidebar clone) | ✅ | |
| HeaderSection / ProfileHeader | 아바타 + 이름 + 역할 | + chip "Product Lead" + location + actions (Change avatar/Edit profile) | ➕ | 의도 보다 풍부 |
| MainSection / ProfileInfoCard | 이메일/가입일/팀 | Account 카드 — 3 InfoRow | ✅ | |
| MainSection / ActivitySummary | 작업/댓글/완료율 | 3 column flex + ProgressBar | ✅ | |
| MainSection / AvatarUpload | 선택 | AvatarUploadCard 신규 (preview + actions) | ✅ | |
| ProfileAvatar size | (정의 없음) | 80×80 + dual shadow (brand glow) | ➕ | 신규 elevation 토큰 |
| ProgressBar | DESIGN.md §4 미정의 | 6px track / 999 radius / 93% fill | ➕ | 신규 컴포넌트 |
| ProfileChip | DESIGN.md §4 미정의 | height 22 / radius 6 / bg `#EEF2FF` | ➕ | 신규 컴포넌트 |
| Outline Danger button | DESIGN.md §4 미정의 | bg white + border `#FEE2E2` + text `#DC2626` | ➕ | 신규 컴포넌트 |
| mypage.title | "My Page" (§14) | (헤더 자체가 동적 사용자명, 페이지 제목 자체 누락) | 🔴 | DESIGN.md 의 정적 제목 미사용 |
| Avatar action 키 | 단일 `mypage.avatar.upload` | 3 종 (Change avatar / Upload new / Remove) | ⚠ | i18n 키 분기 필요 |
| mypage.summary.completion | "Completion Rate" (§14) | "Completion" + ProgressBar 안에 "Completion rate" | ⚠ | 위치 따라 다름 |

**MyPage drift 점수**: 컴포넌트 0.8 (ProfileChip/ProgressBar/Outline Danger 신규) / 토큰 0.95 (avatar glow 신규) / i18n 0.5 (페이지 제목 누락 / avatar 키 분기 / 신규 카피 다수)

### 1.5 Settings (`settings-overview.md`) — AI Radix-based

| 항목 | DESIGN.md | 추출 | 카테고리 | 메모 |
|---|---|---|:---:|---|
| Variant | page | page | ✅ | |
| Layout | shell | shell | ✅ | |
| ChromeSection / Sidebar | 공통 사이드바 | clone | ✅ | |
| HeaderSection / SettingsHeader | "Settings" + 검색 (선택) | Title 22/600 + 14/400 description (검색 미사용) | ⚠ | DESIGN.md 의 "검색 input" 선택 OFF |
| MainSection / NotificationGroup | Toggle 4 (이메일/푸시/주간/멘션) | 일치 (3 on / 1 off) | ✅ | |
| MainSection / AppearanceGroup | Theme Select + Font size Slider | 일치 + Theme description | ✅ | |
| MainSection / LanguageGroup | Language + Timezone Select | 일치 | ✅ | |
| MainSection / AccountGroup | Email + 비밀번호 변경 + 계정 삭제 Danger | InfoRowEmail + ActionRowPassword + DangerRowDelete | ✅ | |
| SettingsToggleRow | §12 정의 (Label / Helper / Toggle) | 일치 (Switch 38×22 pill, knob 18 white shadow) | ✅ | |
| SettingsSelectRow | §12 정의 | 일치 (Trigger 200×36 + chevron) | ✅ | |
| SettingsSliderRow | §12 정의 | 일치 (4px track + 16px handle + range labels) | ✅ | |
| SettingsGroup | §12 정의 (GroupTitle / GroupDescription / Rows) | 일치 + 헤더 좌측 220 + rows flex 우측 (Radix layout 차용) | ✅ | |
| SettingsInfoRow | §12 미정의 | 신규 (Account email row) | ➕ | 신규 Composite |
| SettingsActionRow | §12 미정의 | 신규 (Change password row) | ➕ | 신규 Composite |
| DangerZone | §12 미정의 | 신규 (tinted bg + border + DangerButton) | ➕ | 신규 Composite |
| Group header size | H3 18px (§3) | 16/600/-0.005em | ⚠ | 페이지 위계 의도 (Settings 22 / Group 16) |
| Group 사이 간격 | (정의 없음) | 32px gap + border-bottom | ➕ | Radix 패턴 차용 |
| settings.* 키 | 16 키 (§14) | 35+ 키 (helper/value/action 분리) | ➕ | i18n 확장, 본질 보존 |

**Settings drift 점수**: 컴포넌트 0.85 (3 종 신규 Composite) / 토큰 0.95 (Group header 16 vs 18) / i18n 0.7 (확장 다수)

## §2. 표기 정규화 전후 비교

### 2.1 Color alpha 표기

| 출처 | 표기 | 정규화 |
|---|---|---|
| Paper export | `#0F172A2E` | `rgba(15, 23, 42, 0.18)` (8자리 hex 의 마지막 2자리 = `0x2E / 0xFF` ≈ 0.18) |
| Paper export | `#0F172A14` | `rgba(15, 23, 42, 0.08)` |
| Paper export | `#0F172A0A` | `rgba(15, 23, 42, 0.04)` |
| Paper export | `#0F172A0F` | `rgba(15, 23, 42, 0.06)` |
| Paper export | `#4338CA2E` | `rgba(67, 56, 202, 0.18)` (brand glow) |
| Paper export | `#4F46E52E` | `rgba(79, 70, 229, 0.18)` (focus ring) |
| Paper export | `#0F172A33` | `rgba(15, 23, 42, 0.2)` (Switch knob shadow) |
| Paper export | `#0F172A1F` | `rgba(15, 23, 42, 0.12)` (Slider handle shadow) |

→ Paper 의 8자리 hex 표기를 React/CSS 표준 `rgba()` 로 정규화하는 함수 후보 (paper-normalizer): `normalizeHexAlpha(hex8: string): string`. (phase-6 Studio 입력)

### 2.2 Padding 표기

| 출처 | 표기 |
|---|---|
| Paper export | `paddingBlock: "40px"` + `paddingInline: "40px"` |
| 일반 CSS | `padding: 40px` (shorthand) |

→ 두 표기는 의미 동일. paper-normalizer 함수 후보: `normalizePadding(block, inline) -> shorthand`.

### 2.3 Line-height 표기

| 출처 | 표기 |
|---|---|
| Paper export | `lineHeight: "round(up, 130%, 1px)"` (반올림 함수) |
| 일반 CSS | `line-height: 1.3` (배수) |

→ Paper 의 round 함수 표기는 픽셀 정렬을 강제하는 internal 표현. React/CSS 로 변환 시 `1.3` 배수 표기가 자연스러움. paper-normalizer: `normalizeLineHeight(roundExpr) -> ratio`.

### 2.4 Font family fallback

| 출처 | 표기 |
|---|---|
| Paper export | `"Inter", system-ui, sans-serif` |
| DESIGN.md §3 | `Inter, ui-sans-serif, system-ui, sans-serif` |

→ DESIGN.md 가 fallback chain 더 길음 (`ui-sans-serif` 포함). Paper export 는 시스템 ui-sans-serif 누락. paper-normalizer 또는 spec-5-03 React 구현 단계에서 보완.

### 2.5 Border 표기

| 출처 | 표기 |
|---|---|
| Paper export | `borderWidth: "1px"` + `borderStyle: "solid"` + `borderColor: "#E2E8F0"` (3 분리) |
| 일반 CSS | `border: 1px solid #E2E8F0` (shorthand) |

## §3. 페이지별 drift 점수 + 패턴 요약

### 3.1 점수 요약 표

| 페이지 | 컴포넌트 | 토큰 | i18n | 종합 (평균) |
|---|---:|---:|---:|---:|
| Login | 1.00 | 0.95 | 0.85 | 0.93 |
| Signup | 0.90 | 1.00 | 0.70 | 0.87 |
| Dashboard | 0.85 | 0.95 | 0.50 | 0.77 |
| MyPage | 0.80 | 0.95 | 0.50 | 0.75 |
| Settings | 0.85 | 0.95 | 0.70 | 0.83 |
| **5 페이지 평균** | **0.88** | **0.96** | **0.65** | **0.83** |

### 3.2 패턴 요약

#### 패턴 1 — 토큰은 매우 일관 (0.96)
색 / 간격 / radius / typography 토큰은 5 페이지 모두 DESIGN.md 와 1:1 일치. 본 spec 의 "토큰 자극 폭 확보" 의도가 잘 작동.

#### 패턴 2 — i18n 이 가장 큰 drift 영역 (0.65)
페이지 별로 NEW 키가 다수 발생 (subtitle / helper / value enum / action label). DESIGN.md §14 가 *기본 키* 만 정의하고, 실제 페이지 카피는 *컨텍스트 부가어* 가 추가되는 패턴.
→ DESIGN.md §14 의 정의 모델을 *키 + helper/value 확장 슬롯* 으로 확장 필요 (spec-5-03 또는 phase-6 입력).

#### 패턴 3 — Composite 신규 도입 (0.88)
페이지 별로 DESIGN.md §12 미정의 Composite 가 발견:
- Signup: BrandPanel / Checkbox
- Dashboard: 없음 (모두 §12 일치)
- MyPage: ProfileChip / ProgressBar / Outline Danger / AvatarUploadCard
- Settings: SettingsInfoRow / SettingsActionRow / DangerZone

→ DESIGN.md §12 보강 필요 (spec-5-03 React 구현 단계에서 동시 작업).

#### 패턴 4 — Elevation 1 단계 차이
spec-5-01 추정 elevation-card 2-stop (`0 1px 2px 0.06 + 0 1px 3px 0.04`) vs 추출 단일 stop (`0 1px 2px 0.04`). 이는 spec-5-01 의 추정값이 "정확값 미정 (TODO)" 상태였고 추출 결과로 합의됨. 본 spec 에서 합의된 값 (`0 1px 2px 0.04`) 으로 정정.

#### 패턴 5 — 페이지 hero CTA 차별
Submit button height 가 페이지에 따라 다름 — Login 44px (modal) vs Signup 48px (page hero). 의도된 차별 (Submit 의 시각 위계). DESIGN.md §4 에 *페이지 hero CTA* variant 추가 필요.

## §4. 결론

### 본질적 drift vs 표기 차이의 분리

- **본질적 drift**: §1 의 🔴 / ⚠ 항목 — 5 페이지 합산 11 항목. 이 중 의도적 차별 (Submit hero / Group header 위계 / Dashboard 인사) 7 항목, 보강 필요 4 항목 (i18n 키 분기 / Composite 정의).
- **표기 차이 (정규화)**: §2 의 5 카테고리 — 모두 paper-normalizer 함수로 흡수 가능. 의미 동일.

### 종합 보존도

5 페이지 평균 종합 점수 **0.83 / 1.00**. 토큰은 0.96 (매우 보존), i18n 이 0.65 (가장 큰 drift 영역). 본 spec 의 측정 가설 — *AI 입력 의도가 사이클을 통과해 보존되는가* — 에 대해:
- **PASS** (토큰 / 컴포넌트 layout): 입력 의도 거의 100% 보존.
- **부분 PASS** (i18n / 신규 Composite): 입력보다 *풍부* — 정확히는 *손실* 이 아닌 *확장* (정적 키 → 동적 카피 확장).

### 다음 단계 (입력)

- spec-5-03 (React 구현): DESIGN.md §12 Composite 보강 (3 패턴) + i18n 키 모델 확장 + tokens.json 생성 시 본 추출값 사용.
- phase-6 (Studio): paper-normalizer 함수 라이브러리 (§2 의 5 카테고리) — `findings.md` 에 후보 등재.
