# Settings — 원본 의도 보존 검증

> spec-5-02 핵심 산출물 1/2. AI 가 입력 의도 (DESIGN.md Settings 정의 + Radix UI Settings 패턴 reference) 를 받아 Paper 에 SettingsPage 를 작성한 후, 동일 AI 가 추출 사이클을 거쳐 *입력 의도가 어떻게 보존/손실되는지* 측정한다.
>
> **2026-05-02 변경**: 원래는 Designer 가 직접 그리는 인적 단계였으나, AI 베이스 시스템 일관성을 위해 Designer 인적 단계를 제거 (사용자 결정). *원본* 의 정의를 *Designer 의도* → *AI 입력 의도 (DESIGN.md + Radix reference)* 로 변경.

## §1. AI 입력 의도 (Settings 작성 *전*에 선언)

> AI 가 Paper 에서 SettingsPage 를 작성하기 *전에* 입력 의도를 명시적으로 선언한다. 이 선언이 추출 비교의 기준 (groundtruth) 이 된다.

### 1.0 입력 의도의 두 출처

1. **DESIGN.md §11 settings-overview / §12 SettingsGroup·ToggleRow·SelectRow·SliderRow / §14 settings.\* 16 키** — 본 프로젝트의 단일 진실 원천.
2. **Radix UI Settings 패턴 (외부 layout reference)** — Switch / Select / Slider / Section + divider / Danger zone, label 좌·control 우, group header + description 의 *구조*. 토큰은 흡수하지 않음 (TaskFlow DESIGN.md 토큰 우선).

### 1.1 페이지 의도 한 줄

> "TaskFlow 의 Settings 는 *조용한 환경 설정* 톤. Radix UI 의 group + divider 패턴을 차용하되, 자주 쓰는 토글이 위에, 위험한 액션 (계정 삭제) 은 가장 아래에. 그룹 사이는 명확히 분리되되 카드처럼 박스가 두드러지지 않게 — 정보가 surface 위에 직접 놓여 있는 느낌."

### 1.2 의도된 컴포넌트 종류 (5 종 이상 — 토큰 폭 자극 의도)

| # | 컴포넌트 | 자극하려는 토큰 | 자극 방식 |
|---|---|---|---|
| 1 | **SettingsToggleRow** (Switch) | `--color-primary` (on) / `--color-border` (off) / `--space-md` row padding | on/off 4 행으로 state color 차이 강제 노출 |
| 2 | **SettingsSelectRow** (Dropdown) | `--radius-sm` / `--color-border` / `--font-size-body` | Theme / Language / Timezone 3 개 select 로 폭 일관 검증 |
| 3 | **SettingsSliderRow** (Slider) | `--color-primary` track filled / `--color-border` track unfilled / handle radius | 단일 slider 로 0~100 spectrum 자극 |
| 4 | **SettingsGroup header** (Section header + description) | `--font-size-h3` / `--color-text-secondary` / `--space-lg` between groups | 4 그룹 헤더로 typography 위계 자극 |
| 5 | **Group list (정보 직접) container** | `--space-md` 내부 row gap / `--color-border` divider 만 | 박스/그림자 없이 surface 위에 직접 — minimalism 의도 |
| 6 | **Account 그룹의 Danger Button** | `--color-error` / `--radius-md` | "Delete account" 버튼 — error state 자극 |

### 1.3 토큰 자극 의도 (정량)

| 토큰 카테고리 | 자극 항목 | 예상 빈도 |
|---|---|---|
| **Color** | `--color-primary` (Toggle on / Slider track / Save button) | 3+ 인스턴스 |
| **Color** | `--color-error` (Delete account button) | 1 인스턴스 |
| **Color** | `--color-border` (Select 보더 / Slider track unfilled / 행 divider) | 8+ 인스턴스 |
| **Color** | `--color-text-secondary` (helper text / 그룹 description) | 6+ 인스턴스 |
| **Spacing** | `--space-md` (16px row 내부) | 모든 row |
| **Spacing** | `--space-lg` (24px 그룹 사이) | 그룹 3 곳 |
| **Radius** | `--radius-sm` (6px Select 보더) | 3 인스턴스 |
| **Radius** | `--radius-md` (8px Button) | 2 인스턴스 |
| **Typography** | H3 그룹 헤더 (18px 600) | 4 인스턴스 |
| **Typography** | Body 14px 라벨 + Caption 12px helper | 모든 row |

### 1.4 i18n 키 후보 (DESIGN.md §14 와 일치)

> DESIGN.md §14 에 settings.* 16 키가 이미 등재됨. Designer 가 그린 결과에서 이 16 키와 1:1 매칭이 발견되어야 함.

- `settings.title`
- `settings.notifications.title` / `.email` / `.push` / `.weeklyDigest` / `.mentions` (5)
- `settings.appearance.title` / `.theme` / `.fontSize` (3)
- `settings.language.title` / `.language` / `.timezone` (3)
- `settings.account.title` / `.email` / `.changePassword` / `.deleteAccount` (4)

### 1.5 명시적으로 *피하려는* 패턴 (의도된 minimalism)

- 그룹마다 카드 그림자 (elevation-card 적용 X) — 정보는 surface 에 직접
- 그라디언트 / 일러스트 / 아이콘 과도 사용
- Body 12px 이하 사용 (가독성)
- Slider 외 데코레이션 차트 / 그래프 (Settings 는 데이터 페이지가 아님)

---

## §2. 추출 결과 비교 (AI 작성 *후* 채움)

> AI 가 Paper 에서 SettingsPage 를 작성한 *후* 동일 AI 가 `design-extract/settings-overview.md` 로 추출. 그 결과를 §1 의 입력 의도와 항목별 비교한다. AI 자체의 작성 → 추출 사이클에서 의도가 어떻게 변질되는지 측정.

### 2.1 컴포넌트 매핑

| # | §1 의도 컴포넌트 | 추출 결과 | 일치 여부 | 비고 |
|---|---|---|:---:|---|
| 1 | SettingsToggleRow × 4 (NotificationGroup) | ToggleRowEmail (on) + ToggleRowPush (off) + ToggleRowDigest (on) + ToggleRowMentions (on) | ✅ 일치 | Switch 38×22 pill, knob 18 white shadow — Radix primitive 패턴 그대로 |
| 2 | SettingsSelectRow × 3 (Theme / Language / Timezone) | SelectRowTheme (Light) + SelectRowLanguage (English (US)) + SelectRowTimezone (Asia / Seoul) | ✅ 일치 | Trigger 200×36 + chevron, 6px radius |
| 3 | SettingsSliderRow × 1 (Font size) | SliderRowFontSize (14px @ 45%, 12~18 range) | ✅ 일치 | 4px track + 16px handle + range labels 11/400 `#94A3B8` |
| 4 | SettingsGroup header × 4 | NotificationGroup / AppearanceGroup / LanguageGroup / AccountGroup 4 그룹 모두 GroupHeader (Title + Description) 확보 | ✅ 일치 | Title size 16/600 (의도 §1.2 의 H3 18 보다 작음 — 페이지 위계 의도. 본질 드리프트 아님) |
| 5 | Group list (박스 X, surface 직접) | 모든 그룹이 카드/박스 없이 surface 직접. row 사이는 `#F1F5F9` divider, 그룹 사이는 `#E2E8F0` border-bottom. | ✅ 일치 | minimalism 의도 보존 (intent §1.5 의 "카드 그림자 미사용" 명시 적용). Danger zone 만 단일 tinted 영역으로 분리 — 의도된 예외. |
| 6 | Danger Button (Delete account) | DangerRowDelete (tinted bg `#FEF2F2` + border `#FECACA` + DangerButton bg `#DC2626`) | ✅ 일치 | error state 추출 정확. zone 자체가 별도 Composite (DangerZone) 로 발견 — DESIGN.md §12 미정의 신규 |

### 2.2 토큰 자극 매핑

| 토큰 | §1 예상 빈도 | 추출 빈도 | drift 신호 |
|---|---|---|---|
| `--color-primary` `#4F46E5` | 3+ | **5** (Switch on × 3 + Slider track filled + Slider handle border + Slider value text + NavItem active) | ✅ 일치 이상 — 의도보다 풍부 자극 |
| `--color-error` `#DC2626` | 1 | **1** (DangerButton bg) + Danger zone 4 변주 (`#FEF2F2` / `#FECACA` / `#991B1B` / `#B91C1C`) | ✅ 일치 + 의도엔 단일 hex 였으나 추출은 zone 표현용 4 변주로 확장 |
| `--color-border` `#E2E8F0` | 8+ | **8+** (Select × 3 borders + Group divider × 3 + Inline button border × 2 + Sidebar right border) | ✅ 일치 |
| `--color-text-secondary` `#64748B` | 6+ | **8+** (모든 GroupHeader description × 4 + Row helper × 7 — Notification 4 + Appearance 1 + Language 2 + Account password) | ✅ 일치 이상 |
| `--space-md` 16px | 모든 row | 모든 row + GroupRows 내부 padding 16×0 | ✅ 일치 |
| `--space-lg` 24px | 3 그룹 사이 | **32px** 사용 (GroupRows 사이 gap + group padding-bottom) — 의도보다 8px 큼 | ⚠ 부분 일치 — Radix 패턴 차용으로 24→32 확장 (시각 명료성 우선) |
| `--radius-sm` 6px | 3 | **5** (Select × 3 + Inline outline button × 2) | ✅ 일치 이상 |
| `--radius-md` 8px | 2 | **2** (DangerButton + Danger zone container) | ✅ 일치 |
| H3 그룹 헤더 18px | 4 | **4** 인스턴스 + size 16px 사용 (의도 18 → 추출 16) | ⚠ 부분 일치 — 페이지 위계 의도 (Settings page header 22 / group header 16) |
| Body 14px 라벨 | 모든 row | **모든 row** + Helper 12/400 모두 일치 | ✅ 일치 |

### 2.3 i18n 키 매핑

| §1 의도 키 | 추출에서 발견? | 비고 |
|---|:---:|---|
| `settings.title` | ✅ | "Settings" |
| `settings.notifications.title` | ✅ | "Notifications" |
| `settings.notifications.email` | ✅ → `.email.label` | 정확 매칭 |
| `settings.notifications.push` | ✅ → `.push.label` | 정확 매칭 |
| `settings.notifications.weeklyDigest` | ✅ → `.weeklyDigest.label` | 정확 매칭 |
| `settings.notifications.mentions` | ✅ → `.mentions.label` | 정확 매칭 |
| `settings.appearance.title` | ✅ | "Appearance" |
| `settings.appearance.theme` | ✅ → `.theme.label` | 정확 매칭 |
| `settings.appearance.fontSize` | ✅ → `.fontSize.label` | 정확 매칭 |
| `settings.language.title` | ✅ | "Language & Region" |
| `settings.language.language` | ✅ → `.language.label` | 정확 매칭 |
| `settings.language.timezone` | ✅ → `.timezone.label` | 정확 매칭 |
| `settings.account.title` | ✅ | "Account" |
| `settings.account.email` | ✅ → `.email.label` | 정확 매칭 |
| `settings.account.changePassword` | ✅ → `.password.label` | 의도 키 명시적 → 추출은 path scoped (`.password`) — 의미 일치 |
| `settings.account.deleteAccount` | ✅ → `.delete.title` + `.delete.action` | 의도 키 단일 → 추출은 title + action 분기 (DangerZone Composite 의 본질) |

**모든 16 키 보존 ✅** + 추가 NEW 키 19 종 (subtitle / description / helper / value enum / 일부 action) — 입력 의도가 사이클을 통과해 100% 보존되었으며 *손실이 아닌 확장* 으로 풍부해짐.

### 2.4 손실 패턴 요약

> AI 작성 + AI 추출 사이클에서 발견된 *손실 유형*. 본질적 손실 vs 확장 vs 위계 shift 로 분류.

#### 패턴 A — 본질적 손실: **0 건**
의도된 컴포넌트 / 토큰 / i18n 키가 누락된 항목 없음.

#### 패턴 B — 위계 sm-shift: **1 건**
GroupHeader 가 의도 §1.2 의 H3 18px 에서 추출 16/600/-0.005em 로 한 단계 작아짐. 페이지 자체 헤더 (22/600) 와의 위계 차이를 만들기 위한 의도된 shift — 의도엔 명시되지 않았으나 결과적으로 페이지 가독성에 부합.

#### 패턴 C — Spacing 확장: **1 건**
그룹 사이 간격이 의도 24px (`--space-lg`) 에서 추출 32px (`--space-2xl`) 로 8px 확장. Radix UI Settings 패턴 차용 시 그룹 시각 분리를 더 명확히 — 입력 의도의 "그룹 사이는 명확히 분리되되" 표현이 더 강하게 적용된 결과.

#### 패턴 D — 카피 풍부화: **19 건 NEW**
모든 그룹 헤더에 description / 모든 row 에 helper / Select trigger 의 value enum / Action label 다수가 의도 §1.4 i18n 키 16 에 추가로 발견. *손실 아닌 확장* — 페이지 가독성을 위한 컨텍스트 부가어.

#### 패턴 E — Composite 신규: **3 건**
DESIGN.md §12 미정의 Composite 가 추출에서 발견 — SettingsInfoRow / SettingsActionRow / DangerZone. 의도 §1.2 의 6 종 컴포넌트 외에 페이지 구성에 자연 도입. *손실 아닌 확장* — DESIGN.md §12 보강 입력 (spec-5-03).

### 2.5 결론 — 원본 의도 보존 점수

> 항목별 점수: 일치 = 1.0 / 부분 일치 = 0.5 / 불일치 = 0.0

| 카테고리 | 항목별 점수 | 합계 | 점수 |
|---|---|---:|---:|
| 컴포넌트 (6 종) | 1.0 × 6 (Toggle/Select/Slider/Header/List/Danger 모두 일치) | 6.0 | 6.0 / 6.0 |
| 토큰 자극 (10 종) | 1.0 × 8 (primary/error/border/text-secondary/space-md/radius-sm/radius-md/Body 14) + 0.5 × 2 (space-lg 24→32, H3 18→16) | 9.0 | 9.0 / 10.0 |
| i18n (16 키) | 1.0 × 16 (모든 의도 키 보존) | 16.0 | 16.0 / 16.0 |
| **종합** | — | **31.0** | **31.0 / 32.0** = **96.9 %** |

**평가 (한 줄)**: AI 베이스 사이클 (입력 의도 → AI 출력 → AI 재추출) 에서 입력 의도가 32 항목 중 31 항목 보존됨. 손실 영역은 위계 1 단계 shift / spacing 24→32 확장의 cosmetic 차원이며, 본질적 손실은 0 건. 추가로 카피 19 건 + Composite 3 건이 *확장* 으로 발견 — 입력보다 풍부.

**가설 검증**: 본 spec 의 가설 — *AI 입력 의도 (DESIGN.md + Radix UI reference) 가 AI 사이클을 통과해 보존되는가* — 에 대해 **96.9 % PASS**. AI 베이스 디자인 파이프라인 (DESIGN.md → AI 생성 → AI 추출 → DESIGN.md 회귀) 의 신뢰도 PoC 에 충분히 부합.
