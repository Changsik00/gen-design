# settings-overview — Paper 추출 결과

> spec-5-02 추출 산출물 5/5. Paper artboard `1LR-0` ("TaskFlow — Settings", AI Radix-based 자동 생성) 의 schema 14 섹션 추출.
> 본 페이지는 *원본 의도 보존 검증* 의 핵심 측정 대상 — `intent-preservation.md` 에서 입력 의도와 항목별 비교.

## 1. Visual Theme & Atmosphere

shell layout 의 환경 설정 — 동일 Sidebar (clone) + Main flex. Radix UI 패턴 차용한 group 구조: 헤더 좌측 220px + rows 우측 flex. 카드 박스 없이 surface 위에 직접 row 들이 놓여 있고, 그룹 사이만 1px divider 로 분리. 마지막 Account 그룹의 Delete account 만 tinted danger zone 으로 시각적으로 분리.

**Key Characteristics**:
- 카드 그림자 0 단계 (intent §1.5 에서 명시한 minimalism 의도 — *카드처럼 박스가 두드러지지 않게*)
- Switch / Select trigger / Slider 3 종 control 컴포넌트 + Group header / Row / Danger zone 구조 컴포넌트
- 그룹 4 개 — Notifications / Appearance / Language & Region / Account
- Danger zone 단 1 인스턴스 — Delete account, tinted bg + red border + DangerButton

## 2. Color Palette & Roles

### Primary
- **Indigo / Primary** (`#4F46E5`): Switch on bg / Slider track filled / Slider handle border / Font size value text / NavItem active.

### Status
- **Error** 변주 (Danger zone):
  - Danger zone bg `#FEF2F2` (Red-50)
  - Danger zone border `#FECACA` (Red-200)
  - Danger title color `#991B1B` (Red-900)
  - Danger description color `#B91C1C` (Red-700)
  - DangerButton bg `#DC2626` (Red-600) → white label

### Neutral & Surface
- 동일 — Slate 토큰 (text/border/divider) + Surface `#FFFFFF` row direct + Surface alt `#F8FAFC` page ground.

### Border & Divider
- **Border** `#E2E8F0`: Group divider (그룹 사이 border-bottom) / Select trigger border.
- **Divider Soft** `#F1F5F9`: Row 사이 border-bottom (row 단위 분리).

## 3. Typography Rules

### Hierarchy (페이지 사용분 — 추가)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Group Header | Inter | 16px | 600 | (default) | -0.005em |
| Group Description | Inter | 12px | 400 | 1.5 | 0 |
| Row Label | Inter | 14px | 500 | (default) | 0 |
| Row Helper | Inter | 12px | 400 | (default) | 0 |
| Slider Range Label | Inter | 11px | 400 | (default) | 0 |
| Slider Value | Inter | 12px | 600 | (default) | 0 |

> Settings 16/600 group header 는 Login modal 의 22/600 Title 과 다른 크기 — 페이지 내 위계의 차이 (Settings 페이지 헤더는 22, 그룹 헤더는 16).

## 4. Component Stylings

### Switch (NEW — Radix-pattern primitive)
- 38×22, padding 2px, border-radius 999px.
- **On**: bg `#4F46E5`, knob 18×18 round white, knob shadow `#0F172A33 0px 1px 2px` (= `rgba(15, 23, 42, 0.2)`), justify-content flex-end.
- **Off**: bg `#E2E8F0`, knob 18×18 round white (동일 shadow), justify-content flex-start.

### Select Trigger (NEW — Radix-pattern primitive)
- width 200, height 36, padding-inline 12, gap 8, border-radius 6, bg `#FFFFFF`, border 1px `#E2E8F0`.
- Value 13/500 `#0F172A`. Chevron 12×12 `#64748B` (down).

### Slider (NEW — Radix-pattern primitive)
- Track: 4px height, border-radius 999px, bg `#E2E8F0` (unfilled).
- Range filled: 4px height, width 45% (= "14 px" 의 spectrum 위치), bg `#4F46E5`.
- Handle: 16×16, border-radius 50%, bg `#FFFFFF`, border 1.5px `#4F46E5`, shadow `#0F172A1F 0px 1px 3px` (= `rgba(15, 23, 42, 0.12)`).
- Range labels (12px / 18px): 11px 400 `#94A3B8` 좌우.

### Group container
- max-width 760, padding-bottom 32, border-bottom 1px `#E2E8F0` (마지막 Account 그룹은 border-bottom 없음).
- 내부 layout: flex row — GroupHeader 220px fixed-width + GroupRows flex-1.

### GroupHeader
- gap 6px, padding-right 24px.
- Title 16/600 -0.005em + Description 12/400 `#64748B` line-height 1.5.

### Row (Toggle / Select / Slider / Info / Action)
- align center, gap 16, padding 16×0 (vertical), border-bottom 1px `#F1F5F9` (마지막 row 는 border-bottom 없음).
- Label container flex 1 — Label 14/500 + Helper 12/400.
- Control 우측 정렬, flex-shrink 0.

### Danger Zone (DangerRowDelete)
- padding 18×16, margin-top 8, bg `#FEF2F2`, border 1px `#FECACA`, border-radius 8.
- 내부: Description (flex 1 — Title 14/600 `#991B1B` + Helper 12/400 `#B91C1C`) + DangerButton (height 36, padding-inline 14, border-radius 8, bg `#DC2626`, label 13/600 white).

### Inline Outline Button (Change / Update — Account 액션)
- height 32 (Settings 한정 작은 사이즈), padding-inline 12, border-radius 6, bg white, border 1px `#E2E8F0`, label 12/600 `#334155`.

## 5. Layout Principles

- **Page layout**: shell (Sidebar 240 + Main flex).
- **MainSection padding**: 36×80 (top·side) / 48×80 (bottom·side), gap 32 (그룹 사이).
- **Group internal**: GroupHeader 220 + GroupRows flex-1, gap 0 (rows 사이는 row padding 으로 흡수).
- **Max-width**: 760 (모든 그룹 동일).

## 6. Depth & Elevation

| Level | Value | Use |
|---|---|---|
| 0 | 그림자 없음 | 모든 row / 그룹 (intent §1.5 minimalism 의도) |
| elevation-knob (NEW) | `#0F172A33 0px 1px 2px` (= `rgba(15, 23, 42, 0.2)`) | Switch knob |
| elevation-handle (NEW) | `#0F172A1F 0px 1px 3px` (= `rgba(15, 23, 42, 0.12)`) | Slider handle |

> Elevation 토큰 신규 2 종 — Switch / Slider 의 control affordance 강조용. 카드 elevation 과 분리.

## 7. Do's and Don'ts

- **Do**: 정보는 surface 위에 직접 — 그룹 박스 / 카드 그림자 미사용 (intent §1.5 명시 의도).
- **Do**: Danger zone 은 페이지 *최하단* 1 곳만, Account 그룹 안에서만 사용.
- **Don't**: Switch / Select / Slider 의 토큰을 Radix Themes 그대로 차용하지 말 것 — DESIGN.md TaskFlow 의 indigo / slate 만 사용.
- **Don't**: Group header (16/600) 를 Page header (22/600) 와 동일 크기로 키우지 말 것 — 위계 무너짐.

## 8. Responsive Behavior

본 시안은 desktop 단일. 좁은 viewport 에서는 GroupHeader 가 위로 stack 되는 변형이 자연스러우나 본 spec 범위 외.

## 9. Agent Prompt Guide

- "Switch on — 38×22 pill / bg #4F46E5 / knob 18 white / shadow rgba(15,23,42,0.2) 0 1px 2px"
- "Select trigger — 200×36 / radius 6 / border 1 #E2E8F0 / chevron #64748B / value 13/500"
- "Slider — 4px track #E2E8F0 / 45% filled #4F46E5 / handle 16 white border 1.5 #4F46E5 / range labels 11/400 #94A3B8"
- "Danger zone — bg #FEF2F2 / border 1 #FECACA / radius 8 / title 14/600 #991B1B + DangerButton bg #DC2626 13/600 white"

## 10. Naming Convention

```
SettingsPage (shell)
├─ Sidebar (clone)
└─ MainSection
   ├─ SettingsHeader (Title + Description)
   ├─ NotificationGroup (border-bottom)
   │  ├─ GroupHeader
   │  └─ GroupRows: ToggleRow × 4 (Email on / Push off / Weekly on / Mention on)
   ├─ AppearanceGroup (border-bottom)
   │  ├─ GroupHeader
   │  └─ GroupRows: SelectRowTheme + SliderRowFontSize
   ├─ LanguageGroup (border-bottom)
   │  ├─ GroupHeader
   │  └─ GroupRows: SelectRowLanguage + SelectRowTimezone
   └─ AccountGroup (no border-bottom)
      ├─ GroupHeader
      └─ GroupRows: InfoRowEmail (Change btn) + ActionRowPassword (Update btn) + DangerRowDelete (tinted)
```

## 11. Page Specifications

### 설정 (settings-overview)

- **Route**: `/settings`
- **Variant**: page
- **Layout**: shell (sidebar + main)

| Section | Block | Description |
|---|---|---|
| ChromeSection | Sidebar | clone |
| HeaderSection | SettingsHeader | "Settings" 22/600 + "Manage your notifications, appearance, language, and account preferences." 13/400 |
| MainSection | NotificationGroup | header "Notifications" + description "Choose what reaches you and when." + ToggleRow × 4 |
| MainSection | AppearanceGroup | header "Appearance" + description "Tune how TaskFlow looks on your screen." + SelectRowTheme (Light) + SliderRowFontSize (14px @ 45%, 12~18) |
| MainSection | LanguageGroup | header "Language & Region" + description "Set how dates, numbers, and copy appear." + SelectRowLanguage (English (US)) + SelectRowTimezone (Asia / Seoul) |
| MainSection | AccountGroup | header "Account" + description "Identity, security, and the danger zone." + InfoRowEmail + ActionRowPassword + DangerRowDelete |

## 12. Composite Components (페이지 사용분)

### SettingsGroup (DESIGN.md §12 정의 일치)
- GroupHeader (Title + Description) + GroupRows (Array<Row>)
- 마지막 그룹 외 border-bottom 1px `#E2E8F0`

### SettingsToggleRow
- Label container (Label + Helper) + Switch
- Switch on/off variant

### SettingsSelectRow
- Label container + Select Trigger (200px width)

### SettingsSliderRow (NEW Composite — DESIGN.md 정의 일치)
- Label container (Label + ValueDisplay 12/600 indigo) + Slider track + Range labels

### SettingsInfoRow (NEW — DESIGN.md 미정의, 추출 신규)
- Label container + Inline Outline Button (small, height 32)

### SettingsActionRow (NEW — DESIGN.md 미정의, 추출 신규)
- 동일 형태 (Label container + Inline Outline Button)

### DangerZone (NEW Composite — DESIGN.md 미정의, 추출 신규)
- Description (Title 14/600 + Helper 12/400) + DangerButton

## 13. Token Mapping

### Color Tokens (페이지 사용분 — 추가)

| Design Name | Hex | CSS Variable |
|---|---|---|
| Danger Zone bg | `#FEF2F2` | `--color-error-bg-soft` |
| Danger Zone border | `#FECACA` | `--color-error-border` |
| Danger Zone title | `#991B1B` | `--color-error-strong` |
| Danger Zone helper | `#B91C1C` | `--color-error-fg-strong` |
| DangerButton bg | `#DC2626` | `--color-error` |

### Radius Tokens

| Name | Value | Usage |
|---|---|---|
| md | 6px | Select trigger / Inline button (Settings 한정 small) |
| lg | 8px | DangerButton / Danger zone container |
| pill | 999px / 50% | Switch / Slider track / Slider handle |

### Spacing Tokens (페이지 사용분 — 추가)

| Name | Value | Usage |
|---|---|---|
| 4xs | 6px | GroupHeader gap |
| sm | 8px | DangerRow margin-top |
| md | 16px | row gap |
| 2xl | 32px | group gap (MainSection) / group padding-bottom |
| 3xl | 36px | MainSection padding-top |

## 14. i18n References

| Key | Default (en) | Source |
|---|---|---|
| `settings.title` | "Settings" | SettingsHeader |
| `settings.subtitle` | "Manage your notifications, appearance, language, and account preferences." | SettingsHeader description (NEW) |
| `settings.notifications.title` | "Notifications" | GroupHeader |
| `settings.notifications.description` | "Choose what reaches you and when." | GroupHeader description (NEW) |
| `settings.notifications.email.label` | "Email notifications" | ToggleRow |
| `settings.notifications.email.helper` | "Daily activity summary delivered to your inbox." | (NEW) |
| `settings.notifications.push.label` | "Push notifications" | ToggleRow |
| `settings.notifications.push.helper` | "Real-time alerts on this device." | (NEW) |
| `settings.notifications.weeklyDigest.label` | "Weekly digest" | ToggleRow |
| `settings.notifications.weeklyDigest.helper` | "Monday morning recap of your team's progress." | (NEW) |
| `settings.notifications.mentions.label` | "Mention alerts" | ToggleRow |
| `settings.notifications.mentions.helper` | "Notify me when a teammate @-mentions me." | (NEW) |
| `settings.appearance.title` | "Appearance" | GroupHeader |
| `settings.appearance.description` | "Tune how TaskFlow looks on your screen." | (NEW) |
| `settings.appearance.theme.label` | "Theme" | SelectRowTheme |
| `settings.appearance.theme.helper` | "Light, dark, or follow your OS." | (NEW) |
| `settings.appearance.theme.value.light` | "Light" | trigger value |
| `settings.appearance.fontSize.label` | "Font size" | SliderRowFontSize |
| `settings.appearance.fontSize.value` | "14 px" | (dynamic) |
| `settings.language.title` | "Language & Region" | GroupHeader (DESIGN.md "Language & Region" 일치) |
| `settings.language.description` | "Set how dates, numbers, and copy appear." | (NEW) |
| `settings.language.language.label` | "Language" | SelectRowLanguage |
| `settings.language.language.helper` | "Used across the app interface." | (NEW) |
| `settings.language.language.value.enUs` | "English (US)" | trigger value |
| `settings.language.timezone.label` | "Time zone" | SelectRowTimezone |
| `settings.language.timezone.helper` | "Currently set to your device clock." | (NEW) |
| `settings.language.timezone.value.asiaSeoul` | "Asia / Seoul" | trigger value |
| `settings.account.title` | "Account" | GroupHeader |
| `settings.account.description` | "Identity, security, and the danger zone." | (NEW) |
| `settings.account.email.label` | "Email address" | InfoRow |
| `settings.account.email.action` | "Change" | inline button |
| `settings.account.password.label` | "Change password" | ActionRow |
| `settings.account.password.helper` | "You'll be signed out of all other sessions." | (NEW) |
| `settings.account.password.action` | "Update" | inline button |
| `settings.account.delete.title` | "Delete account" | Danger title |
| `settings.account.delete.helper` | "This permanently removes your TaskFlow workspace, tasks, and history. This action can't be undone." | (NEW) |
| `settings.account.delete.action` | "Delete account" | DangerButton (title 와 동일 — 카피 중복 drift 신호) |

> drift 신호 요약: ① DESIGN.md §14 의 settings.* 16 키 → 추출 결과는 설명문 / value 옵션 / action label 까지 포함해 35+ 키 ② Description (그룹/행) 카피가 모두 NEW — DESIGN.md §14 미등재 ③ "Delete account" 라벨이 title 과 button 에 중복.
