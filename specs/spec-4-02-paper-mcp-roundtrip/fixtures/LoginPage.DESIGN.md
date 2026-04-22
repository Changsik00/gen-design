# LoginPage — DESIGN.md Fixture

> spec-4-02 Paper MCP 왕복 PoC 의 **입력 픽스처**.
> 출처: `docs/guides/e2e-demo-loginpage.md` §실험설계 재구성.
> `schema/design-md-schema.md` 14 섹션 중 본 PoC 에 필수인 §1~§6, §11 을 채우고 나머지는 placeholder.
> ADR-002 표기 규칙: `실제 값 (CSS 변수 / Tailwind 클래스)`.

---

## 1. Visual Theme & Atmosphere (필수)

Clean · minimal · shadcn-inspired. 중앙 정렬 카드 기반의 인증 화면 — 브랜드 주장을 최소화하고 입력 명료성을 최대화한 실용 계열.

**Key Characteristics**:
- 중립 뉴트럴 (oklch 기반) 배경 + 단일 indigo 계열 primary
- 1px 저채도 테두리 + 약한 그림자 (card-level elevation)
- 모서리 반경은 Input/Button 5px, Card 8.75px 로 계단식
- 타이포는 system-ui 기반. 가변 weight (500/600) 로 위계만 주고 장식 제거

## 2. Color Palette & Roles (필수)

### Primary
- **Primary** (`oklch(0.205 0 0)`): `--primary` / Tailwind `bg-primary`. 로그인 CTA 버튼 배경. (토큰 #1)
- **Primary Foreground** (`oklch(0.985 0 0)`): `--primary-foreground` / `text-primary-foreground`. CTA 버튼 텍스트. (토큰 #2)

### Surfaces
- **Card** (`#ffffff`): `--card` / `bg-card`. 카드 배경. (토큰 #3)
- **Background** (`oklch(1 0 0)`): `--background` / `bg-background`. 페이지 전체 배경.

### Neutrals
- **Foreground** (`oklch(0.145 0 0)`): `--foreground` / `text-foreground`. 주요 제목·본문. (토큰 #6)
- **Muted Foreground** (`oklch(0.556 0 0)`): `--muted-foreground` / `text-muted-foreground`. Description / placeholder. (토큰 #5)
- **Border** (`oklch(0.922 0 0)`): `--border` / `border-border`. Card / Input 경계. (토큰 #4)

## 3. Typography Rules (필수)

### Family
- **Primary**: `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`. (토큰 #7) — Paper 환경 폰트 가용성은 Task 3-1 에서 `get_font_family_info` 로 확인.

### Scale (Tailwind 대응)
- **text-2xl**: `24px`, line-height `32px`. Title "로그인". (토큰 #9)
- **text-lg**: `18px`, line-height `28px`. Modal variant title.
- **text-sm**: `14px`, line-height `20px`. Label / Button / Description. (토큰 #8)
- **text-xs**: `12px`, line-height `16px`. Divider ("or continue with").

### Weight
- **semibold (600)**: Title. (토큰 #10)
- **medium (500)**: Label / Button / 강조 링크. (토큰 #10)
- **normal (400)**: 본문 기본.

## 4. Component Stylings (필수)

### Card (Login 컨테이너)
- `bg-card` (#ffffff), `border` (`--border`), `rounded-xl` (8.75px, 토큰 #14), `shadow-sm` (토큰 #15), `p-8` (32px, 토큰 #11)

### CardHeader
- Title: "로그인" — `text-2xl font-semibold text-foreground`
- Description: "계정에 로그인하세요" — `text-sm text-muted-foreground`

### Input (이메일 / 비밀번호)
- Label: `text-sm font-medium text-foreground`
- Input: `h-10`, `border` (`--border`), `rounded-md` (5px, 토큰 #13), placeholder `text-muted-foreground`
- Gap between rows: `space-y-4` (16px, 토큰 #12)

### Button (로그인 — default)
- `bg-primary text-primary-foreground`, `rounded-md` (5px, 토큰 #13), `h-10`, `text-sm font-medium`, `w-full`

### Button (소셜 — outline, × 3)
- `bg-background border`, `text-foreground`, `rounded-md` (5px), `h-10`, `text-sm font-medium`

### Divider
- `border-t border-border`, 중앙 `text-xs text-muted-foreground` "or continue with"

## 5. Layout Principles (필수)

- 중앙 정렬 페이지 레이아웃 (`flex items-center justify-center`)
- 카드 너비: `w-[380px]` (`384px` Tailwind `w-96` 와 근사)
- 카드 내부 수직 리듬: `space-y-6` (24px) — header / form / divider / social / prompt

**Spacing Scale** (LoginPage 에 관찰되는 값):
- `p-8` = 32px (토큰 #11)
- `space-y-6` = 24px
- `space-y-4` = 16px (토큰 #12)
- `px-3` = 12px (divider label)

## 6. Depth & Elevation (필수)

- **Card**: `shadow-sm` = `0 1px 2px 0 rgba(0, 0, 0, 0.05)` 또는 Tailwind default `0 1px 3px rgba(0,0,0,0.1)` (토큰 #15)
- Input / Button: elevation 없음 (flat)
- Modal variant: Dialog 내부 기본 shadow (shadcn)

## 7~10. (본 PoC 범위 밖 — placeholder)

- §7 Do's and Don'ts: TODO
- §8 Responsive Behavior: TODO (mobile 은 `bottom-sheet` variant 에서 다룸)
- §9 Agent Prompt Guide: TODO
- §10 Naming Convention: Phase 2 BEM 혼합 없음 — Tailwind + shadcn 관례 준수

## 11. Page Specifications (확장)

### LoginPage

| 항목 | 값 |
|---|---|
| Variant | `page` (본 PoC) · `modal` · `bottom-sheet` |
| Layout | centered-card |
| Route | `/login` |
| Template | `LoginPage` (studio/src/components/templates/LoginPage) |

**Section × Block 테이블**:

| Section | Block | Description |
|---|---|---|
| BrandSection | — (미구현, 선택) | Logo + 앱 이름 |
| CardSection | CardHeader | Title + Description |
| CardSection | LoginForm | Email + Password + CTA |
| CardSection | Divider | "or continue with" |
| CardSection | SocialAuthBlock | Google / Apple / Kakao |
| CardSection | SignupPrompt | "계정이 없으신가요?" + link |

## 12~14. (선택 — 본 PoC 에선 미사용)

- §12 Composite Components: `LoginForm`, `SocialAuthBlock` — studio 에서 import
- §13 Token Mapping: 본 문서의 §2/§3/§6 값이 그대로 토큰
- §14 i18n References: `templates/assets/i18n/{ko,en}.json` 의 `login.*` 키 참조

---

## 측정 토큰 (15) — plan.md §측정 토큰 과 대응

| # | 계열 | 본 픽스처 값 | 소스 섹션 |
|---|:---:|---|:---:|
| 1 | color | `oklch(0.205 0 0)` / `--primary` | §2 |
| 2 | color | `oklch(0.985 0 0)` / `--primary-foreground` | §2 |
| 3 | color | `#ffffff` / `--card` | §2 |
| 4 | color | `oklch(0.922 0 0)` / `--border` | §2 |
| 5 | color | `oklch(0.556 0 0)` / `--muted-foreground` | §2 |
| 6 | color | `oklch(0.145 0 0)` / `--foreground` | §2 |
| 7 | typography | `system-ui ...` font-family | §3 |
| 8 | typography | `14px` / `text-sm` | §3 |
| 9 | typography | `24px` / `text-2xl` | §3 |
| 10 | typography | `500`, `600` font-weight | §3 |
| 11 | spacing | `32px` / `p-8` (card padding) | §4, §5 |
| 12 | spacing | `16px` / `space-y-4` (form rows) | §4, §5 |
| 13 | radius | `5px` / `rounded-md` (Input/Button) | §4 |
| 14 | radius | `8.75px` / `rounded-xl` (Card) | §4 |
| 15 | shadow | `0 1px 3px rgba(0,0,0,0.1)` / `shadow-sm` | §6 |

---

## 주의 사항

- 본 픽스처는 **Paper 에 렌더링할 때 기준값**. 실제 Phase 2 studio 구현의 CSS 계산 값 (oklch 원본 vs 브라우저 rendered rgb) 과 일부 차이가 있을 수 있음 — 이 차이는 PoC 측정 대상 밖 (원본 동등성은 가정).
- Paper 가 oklch 색공간을 지원하지 않을 가능성이 있으면 Task 3 에서 hex/rgb 변환 필요 — 발견 시 walkthrough 에 기록.
- shadow 는 Tailwind `shadow-sm` 의 기본값 (1 layer) 로 가정. 실제 Paper 의 `get_computed_styles` 가 어떻게 shadow 를 기술하는지는 Task 4 에서 확인.
