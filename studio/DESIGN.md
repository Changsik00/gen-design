# Studio — Design System

> Studio 자체의 design system 명세. spec-6-04 에서 14 섹션 skeleton 으로 생성.
> Studio 가 자체 컴포넌트 라이브러리 (`studio/src/components/`) 와 토큰 (`templates/assets/tokens/tokens.json`) 으로 구성된다는 dogfooding 의 reference.
>
> **소속 spec**: `spec-6-04`
> **Schema**: `schema/design-md-schema.md` (14 섹션)
> **Placeholder 기원**: `schema/blueprint-placeholder-map.md`

---

## 1. Visual Theme & Atmosphere

> TODO — Paper / Figma 추출 대기. 향후 작성자 / 디자이너가 Studio 의 시각 분위기 (Mood / Tone) 정의.

---

## 2. Color Palette & Roles

> tokens.json `semantic.color.light` 기반 prefill (자동 생성 CSS 변수: `studio/src/styles/_tokens-light.css`).

| Role | Light Value | Token | 용도 |
|---|---|---|---|
| `--background` | `#F8FAFC` (neutral-50) | `--background` | body / 메인 배경 |
| `--foreground` | `#0F172A` (neutral-900) | `--foreground` | 본문 텍스트 |
| `--card` | `#FFFFFF` (neutral-0) | `--card` | Card / Panel 배경 |
| `--card-foreground` | `#0F172A` | `--card-foreground` | Card 내부 텍스트 |
| `--primary` | `#6366F1` (indigo-500) | `--primary` | CTA / 액션 / 활성 nav |
| `--primary-foreground` | `#FFFFFF` | `--primary-foreground` | primary 위 텍스트 |
| `--secondary` | `#F1F5F9` (neutral-100) | `--secondary` | 보조 표면 |
| `--muted` | `#F1F5F9` | `--muted` | 비활성 / hover 배경 |
| `--muted-foreground` | `#64748B` (neutral-500) | `--muted-foreground` | 보조 텍스트 |
| `--accent` | `#EEF2FF` (indigo-50) | `--accent` | 강조 표면 (Hover 등) |
| `--border` | `#E2E8F0` (neutral-200) | `--border` | 테두리 / divider |
| `--input` | `#E2E8F0` | `--input` | input 테두리 |
| `--ring` | `#818CF8` (indigo-400) | `--ring` | focus ring |
| `--destructive` | `#EF4444` (red-500) | `--destructive` | 위험 / 삭제 |
| `--sidebar` | `#0F172A` | `--sidebar` | Sidebar bg |
| `--sidebar-foreground` | `#F1F5F9` | `--sidebar-foreground` | Sidebar 텍스트 |
| `--sidebar-primary` | `#6366F1` | `--sidebar-primary` | Sidebar 활성 nav |
| chart-{1..5} | indigo / green / blue / neutral / red 500 계열 | `--chart-N` | 데이터 시각화 |

> Brand B 변형 (`--brand-b` class scope) 은 teal 계열 — `_tokens-brand-b.css` 자동 생성.
> Dark theme (`.dark` class) — `_tokens-dark.css` 자동 생성.

---

## 3. Typography Rules

> tokens.json `semantic.font` 기반 prefill.

| Token | Value | 용도 |
|---|---|---|
| `--font-sans` | `'Inter', system-ui, sans-serif` | 본문 / UI 전반 |
| `--font-heading` | `'Inter', system-ui, sans-serif` | 제목 / 강조 |
| (variable font) | `@fontsource-variable/geist` | 브랜드 정체성 (Studio 자체 — 실제 적용 검토 중) |

**Hierarchy**: Tailwind v4 의 type scale 기본값 사용 (`text-xs ~ text-4xl`). Studio 내부 사용 사례:

| Class | size / line-height | 용도 |
|---|---|---|
| `text-2xl font-semibold` | 24px / 32px / 600 | 페이지 타이틀 (placeholder Card 내) |
| `text-base` | 16px / 24px | 본문 |
| `text-sm` | 14px / 20px | Sidebar nav / 보조 |
| `text-xs uppercase tracking-wider` | 12px / 16px | Section label |

> 정확한 letter-spacing / line-height 비율은 추후 `paper-normalizer` C3/C4 룰 기반 보강.

---

## 4. Component Stylings

> Studio 의 핵심 컴포넌트 인벤토리. 자체 라이브러리 (`studio/src/components/`) 활용 = dogfooding.

### 4.1 ui/ (shadcn 기반 primitive)

`button` / `card` / `dialog` / `select` / `checkbox` / `slider` / `separator` 등. shadcn registry 합류 + Tailwind v4 매핑.

### 4.2 composites/ (다중 primitive 조합)

- `Sidebar` — Studio chrome 의 좌측 nav (NAV_ITEMS 4 + activeIndex). `--sidebar-width: 240px` 토큰 (spec-6-01).
- `LoginForm` / `SignupForm` — auth 페이지 (현재 playground 한정).
- `DashboardHeader` / `StatCard` / `ActivityTable` — dashboard 페이지 (playground).
- `ProfileHeader` / `ProfileInfoCard` / `AvatarUpload` / `ActivitySummary` — MyPage.
- `SettingsHeader` / `SettingsGroup` / `SettingsToggleRow` / `SettingsSelectRow` / `SettingsSliderRow` — SettingsPage.

### 4.3 templates/ (page-level)

`LoginPage` / `SignupPage` / `DashboardPage` / `MyPage` / `SettingsPage` — variant prop (`page` / `modal` / `bottom-sheet`) + `texts` i18n + 카테고리별 nav.

### 4.4 layout/ (Studio 전용)

`StudioLayout` (spec-6-04 신설) — Sidebar + Main shell. 자체 Sidebar 재사용 (dogfooding 첫 사례).

---

## 5. Layout Principles

> Studio shell 의 layout 룰.

- **Shell**: `flex h-screen` — Sidebar (240px 고정) + Main (flex-1, overflow-auto).
- **Page padding**: 페이지 placeholder 는 `flex flex-1 items-center justify-center p-6` 로 중앙 정렬. 후속 spec 의 본격 페이지는 `p-6` 또는 `p-8` 표준.
- **Card max-width**: `max-w-md` (448 px) 가 placeholder 기본. 본격 form 은 `max-w-2xl` 등 페이지별 결정.
- **Z-stack**: playground 의 control panel 만 `z-50` 사용. Studio chrome 자체는 z-stack 없음 (단순 flow).

---

## 6. Depth & Elevation

> TODO — Paper extraction 후. 임시: shadcn `card` 의 기본 shadow 사용 (`shadow-sm` Tailwind).

---

## 7. Icon

- **라이브러리**: `lucide-react` (^1.8.0). 단일 라이브러리, 외부 추가 없음.
- **Sidebar nav icons**: `LayoutDashboard` / `MessageSquare` / `Database` / `Settings` (현재 Sidebar 내장 — 향후 Studio nav 와 align 필요).
- **사용 가이드**: `<Icon className="size-4" />` (16 px, Tailwind size utility).

> Studio 본격 페이지 (Blueprint / Editor / Tokens / Export) 의 icon 매핑은 후속 spec 결정.

---

## 8. Motion

> TODO — `tw-animate-css` (^1.4.0) 합류. Hover / focus / route transition 룰 정의 대기.

---

## 9. Agent Prompt Guide

> TODO — Studio 작성/편집 시 LLM agent 가 따를 prompt convention. 향후 spec-6-05 ~ 08 의 form 입력 검증 / spec-6-09 (Paper sync) 의 추출 / spec-6-10 (visual regression) 등에서 점진 정의.

---

## 10. Page Map (Naming Convention)

> Studio 의 5 route 매핑. `studio/src/lib/router.ts` 의 `ROUTE_PATHS` 와 1:1.

| Route | Path | Page | 구현 spec |
|---|---|---|---|
| `blueprint` | `#/blueprint` | `BlueprintPage` | spec-6-05 |
| `editor` | `#/editor` | `EditorPage` | spec-6-06 |
| `tokens` | `#/tokens` | `TokensPage` | spec-6-07 |
| `export` | `#/export` | `ExportPage` | spec-6-08 |
| `playground` (숨김) | `#/__playground` | `Playground` | spec-6-04 (현재) |

**Naming convention**:
- Route id: kebab-case (예: `blueprint`, `editor`)
- Page component: PascalCase + `Page` 접미 (예: `BlueprintPage`)
- Feature dir: `studio/src/features/{route-id}/index.tsx`
- Schema 의 F-06 룰 (`schema/page-catalog.md`) 따름.

---

## 11. Page Specifications

> TODO — 각 페이지 spec (spec-6-05 ~ spec-6-08) 에서 자체 §11 추가.

현재 placeholder 만 정의:

| Page | 목적 | 구현 시점 |
|---|---|---|
| BlueprintPage | Step-by-step 위저드 (앱 유형 → 페이지 → variant) → REQUIREMENTS.md export | spec-6-05 |
| EditorPage | DESIGN.md 14 섹션 폼 입력 + 마크다운 미리보기 | spec-6-06 |
| TokensPage | 색상 / 타이포 / 간격 시각 편집 + 컴포넌트 미리보기 | spec-6-07 |
| ExportPage | DESIGN.md + REQUIREMENTS.md + AGENT.md + assets 번들 다운로드 | spec-6-08 |
| Playground | 컴포넌트 시각 확인 (개발 중 dogfooding 도구) | spec-6-04 (본 spec) |

---

## 12. Composite Components

> TODO — Studio 본격 페이지 (spec-6-05~08) 에서 발생하는 composite. 현재는 §4.2 의 카탈로그가 대신.

향후 추가 예정:
- `BlueprintWizardStepper` (spec-6-05)
- `DesignSectionForm` (spec-6-06)
- `ColorPickerGroup` / `TypographyControls` (spec-6-07)
- `ExportBundlePanel` (spec-6-08)

---

## 13. Token Mapping

> CSS 변수 ↔ Tailwind utility ↔ tokens.json 경로.

### 13.1 Color

| CSS 변수 | Tailwind utility | tokens.json path |
|---|---|---|
| `--primary` | `bg-primary` / `text-primary` / `border-primary` | `semantic.color.light.primary` (= `primitive.indigo.500`) |
| `--background` | `bg-background` | `semantic.color.light.background` (= `primitive.neutral.50`) |
| `--foreground` | `text-foreground` | `semantic.color.light.foreground` (= `primitive.neutral.900`) |
| `--card` | `bg-card` | `semantic.color.light.card` (= `primitive.neutral.0`) |
| `--border` | `border` (`border-border`) | `semantic.color.light.border` (= `primitive.neutral.200`) |
| `--ring` | `ring-ring` / `outline-ring` | `semantic.color.light.ring` (= `primitive.indigo.400`) |
| `--sidebar` | `bg-sidebar` | `semantic.color.light.sidebar` (= `primitive.neutral.900`) |

> 전체 매핑: `studio/src/index.css` 의 `@theme inline` 블록 — 모든 `--color-*` 가 그대로 Tailwind utility 노출.

### 13.2 Dimension / Spacing

| CSS 변수 | Tailwind utility | tokens.json path |
|---|---|---|
| `--sidebar-width: 240px` | `w-sidebar` (via `--spacing-sidebar`) | `semantic.size.sidebar-width` (spec-6-01 신설) |
| `--radius (= --base)` | `rounded-{sm,md,lg,xl,2xl,3xl,4xl}` | `semantic.radius.base` (= `0.5rem`) |

### 13.3 Font

| CSS 변수 | Tailwind | tokens.json |
|---|---|---|
| `--font-sans` | `font-sans` (default) | `semantic.font.sans` |
| `--font-heading` | `font-heading` | `semantic.font.heading` |

---

## 14. i18n References

> TODO — Studio 자체의 i18n. 현재 컴포넌트 (`studio/src/lib/i18n.ts`) 가 `getLoginPageTexts(locale)` 등 페이지별 함수 노출. Studio chrome (Sidebar nav, Header) 의 텍스트는 영문 default — 본격 i18n 합류는 별도 spec.

향후 작성 가이드:
- `templates/assets/i18n/{locale}.json` 경로
- key 명명: `studio.{feature}.{element}` (예: `studio.blueprint.startButton`)
- spec-6-05 의 Blueprint UI 가 본격 합류 시점

---

## 🔗 관련 자료

- 라우터: `studio/src/lib/router.ts`
- 레이아웃: `studio/src/components/layout/StudioLayout.tsx`
- 토큰: `templates/assets/tokens/tokens.json` + 자동 생성 CSS (`studio/src/styles/_tokens-*.css`)
- 페이지 카탈로그: `schema/page-catalog.md`
- placeholder 기원 분류: `schema/blueprint-placeholder-map.md`
- 회고: `docs/poc-retro.md` §3.3 + dogfooding 비율 측정 (success criteria #4)
