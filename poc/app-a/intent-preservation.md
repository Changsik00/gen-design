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
| 1 | SettingsToggleRow × 4 (NotificationGroup) | TBD (Designer 그린 후 추출) | TBD | TBD |
| 2 | SettingsSelectRow × 3 (Theme / Language / Timezone) | TBD | TBD | TBD |
| 3 | SettingsSliderRow × 1 (Font size) | TBD | TBD | TBD |
| 4 | SettingsGroup header × 4 | TBD | TBD | TBD |
| 5 | Group list (박스 X, surface 직접) | TBD | TBD | minimalism 의도 보존 여부 |
| 6 | Danger Button (Delete account) | TBD | TBD | error state 추출 정확도 |

### 2.2 토큰 자극 매핑

| 토큰 | §1 예상 빈도 | 추출 빈도 | drift 신호 |
|---|---|---|---|
| `--color-primary` | 3+ | TBD | TBD |
| `--color-error` | 1 | TBD | TBD |
| `--color-border` | 8+ | TBD | TBD |
| `--color-text-secondary` | 6+ | TBD | TBD |
| `--space-md` | 모든 row | TBD | TBD |
| `--space-lg` | 3 그룹 사이 | TBD | TBD |
| `--radius-sm` | 3 | TBD | TBD |
| `--radius-md` | 2 | TBD | TBD |
| H3 그룹 헤더 | 4 | TBD | TBD |
| Body 14px 라벨 | 모든 row | TBD | TBD |

### 2.3 i18n 키 매핑

| §1 의도 키 | 추출에서 발견? | 비고 |
|---|:---:|---|
| `settings.title` | TBD | TBD |
| `settings.notifications.*` (5) | TBD | TBD |
| `settings.appearance.*` (3) | TBD | TBD |
| `settings.language.*` (3) | TBD | TBD |
| `settings.account.*` (4) | TBD | TBD |

### 2.4 손실 패턴 요약 (TBD)

> Designer 그리기 + AI 추출 *후* 채움. 일치/부분 일치/불일치를 카테고리화하여 손실 유형을 분류.

- TBD

### 2.5 결론 — 원본 의도 보존 점수 (TBD)

> 항목별 점수: 일치 = 1.0 / 부분 일치 = 0.5 / 불일치 = 0.0
> 카테고리별 평균 점수와 그 의미를 한 줄로 정리.

- 컴포넌트: TBD / 6.0
- 토큰: TBD / 10.0
- i18n: TBD / 16.0
- **종합**: TBD / 32.0
