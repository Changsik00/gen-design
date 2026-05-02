# dash-overview — Paper 추출 결과

> spec-5-02 추출 산출물 3/5. Paper artboard `1FI-0` ("TaskFlow — Dashboard") 의 schema 14 섹션 추출.

## 1. Visual Theme & Atmosphere

shell layout 의 productivity 대시보드 — 240px Sidebar + Main flex. 상단 인사 + 검색 + CTA, 4 종 stat 카드, ActivityCard 1 개. 카드는 elevation-card 1 단계 (1px 그림자) 만 사용.

**Key Characteristics**:
- Surface alt `#F8FAFC` 페이지 ground, 카드 surface `#FFFFFF`
- 12px radius 카드 단일 패턴 (StatCard / ActivityCard)
- elevation-card 1 단계 그림자 `rgba(15, 23, 42, 0.04) 0 1px 2px`
- Status 4 종: indigo (in progress) / green (done) / red (overdue) / slate (backlog)

## 2. Color Palette & Roles

### Primary
- **Indigo / Primary** (`#4F46E5`): Sidebar nav active text + LogoMark + QuickActionNewTask CTA + Stat trending arrow + Activity row indigo dot.

### Neutral
- 동일 — Slate-900/700/500/400/200 + White (auth-login.md §2 참조).
- **Slate-50** (`#F8FAFC`): `--color-surface-alt`. Page ground / UserCard bg / ActivityTableHeaderRow bg.
- **Slate-100** (`#F1F5F9`): `--color-divider-soft`. Activity row divider (Slate-200 보다 옅음) / 상태 backlog badge bg.

### Status
- **Success** (text `#16A34A`, bg `#DCFCE7`, label `#166534`): "Done" badge / "+12%" trend / activity success dot.
- **Error** (text `#DC2626`, bg `#FEE2E2`, label `#991B1B`): Overdue stat / Overdue badge / activity error dot.
- **Default** (text `#94A3B8`, bg `#F1F5F9`, label `#475569`): Backlog badge.
- **In Progress** (text `#4F46E5`, bg `#EEF2FF`): 활성 작업 — Primary 재사용.

### Brand-subtle
- **Indigo-50** (`#EEF2FF`): `--color-primary-subtle`. NavItem active bg / Status badge in-progress bg.

### Accent
- **Teal** (`#0EA5B7`): `--color-accent`. UserCard avatar / Activity row 1 의 Jamie Min avatar / Stat trending text.

## 3. Typography Rules

### Hierarchy (페이지 사용분 — Login 외 추가)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Stat Display | Inter | 32px | 600 | 1.0 | -0.02em |
| Card Title | Inter | 15px | 600 | (default) | (default) |
| Caption Uppercase | Inter | 11px | 600 | (default) | 0.04em (uppercase) |

> 그 외 Body 14/Label 13/Helper 12 는 동일.

## 4. Component Stylings

### Sidebar
- width 240px, padding 20×16px, gap 24px, bg `#FFFFFF`, border-right 1px `#E2E8F0`.

### NavItem (default / active)
- height 36px, padding-inline 10px, border-radius 6px, gap 12px.
- **Active** (Home): bg `#EEF2FF`, label color `#4F46E5` 14/600.
- **Default** (Tasks / Settings): bg transparent, label `#475569` 14/500.
- **Badge** (Tasks): pill min-width 22 height 20 padding 0 6 bg `#E2E8F0`, label 11px 600 `#475569`.

### UserCard (Sidebar bottom)
- padding 10px, border-radius 8px, bg `#F8FAFC`.
- Avatar 32×32 round bg `#0EA5B7` (accent teal).

### StatCard
- flex 1, padding 20px, gap 12px, border-radius 12px, border 1px `#E2E8F0`, box-shadow `#0F172A0A 0px 1px 2px` (elevation-card).
- Title 13px 500 `#64748B`.
- Value 32px 600 -0.02em.
- Trend 12px 500 (status-color 기반).

### ActivityCard
- flex 1, border-radius 12px, border 1px `#E2E8F0`, box-shadow `#0F172A0A 0px 1px 2px`, overflow clip.
- Header padding 18×20, border-bottom 1px `#E2E8F0`.
- TableHeaderRow padding 10×20, bg `#F8FAFC`, border-bottom 1px `#E2E8F0`.
- Row padding 14×20, border-bottom 1px `#F1F5F9` (마지막 row 도 동일 — extract 후 보정 필요).
- Vertical lane: 흐름 dot 6×6 + Task flex 2 / Avatar+Assignee flex 1 / Status width 110 / Updated width 100.

### Status Badge (활동 행)
- height 22px, padding-inline 8px, border-radius 6px, gap 6px (dot + label), label 11px 600.
- 4 종: in-progress / done / overdue / backlog (bg-text 페어 위 §2 참조).

### SearchInput
- width 240, height 36, padding-inline 12, gap 8, border-radius 8 (Input 의 6 보다 큼 — search 패턴), border 1px `#E2E8F0`, bg `#FFFFFF`.

### QuickActionNewTask
- height 36, padding-inline 14, border-radius 8, bg `#4F46E5`, label 13px 600 white.

### Avatar (small)
- 24×24 / 32×32 round, color-coded bg (`#0EA5B7` / `#4F46E5` / `#DC2626` / `#6366F1`), inner 10px / 13px 600 white initials.

## 5. Layout Principles

- **Page layout**: shell (Sidebar 240 + Main flex).
- **Main padding**: 28×40px top / 40×40px bottom.
- **Main gap**: 24px between blocks (Header / StatGrid / ActivityCard).
- **StatCardGrid gap**: 16px.

## 6. Depth & Elevation

| Level | Value | Use |
|---|---|---|
| 0 | 그림자 없음 | Sidebar / NavItem / Avatar |
| elevation-card | `#0F172A0A 0px 1px 2px` (= `rgba(15, 23, 42, 0.04)`) | StatCard / ActivityCard |

## 7. Do's and Don'ts

- **Do**: 카드는 elevation-card 1 단계만, 카드 안의 row 는 elevation 0.
- **Do**: Status badge 는 4 종 (in-progress / done / overdue / backlog) 만 사용. 추가 status 가 필요하면 새 토큰 정의 후.
- **Don't**: Sidebar 의 active 표시는 bg 색만 (border-left 강조선 X — minimalism).

## 8. Responsive Behavior

본 시안은 desktop 단일. md 에서 Sidebar 아이콘 only / sm 에서 햄버거 변형은 본 spec 범위 외.

## 9. Agent Prompt Guide

- "StatCard — flex 1 / padding 20 / border-radius 12 / border 1 #E2E8F0 / shadow rgba(15,23,42,0.04) 0 1px 2px / bg white"
- "Status badge done — pill / height 22 / padding-inline 8 / radius 6 / dot #16A34A + label #166534 11/600 + bg #DCFCE7"
- "Sidebar NavItem active — bg #EEF2FF / label #4F46E5 14/600"

## 10. Naming Convention

```
DashboardPage (shell)
├─ Sidebar (left 240, ChromeSection)
│  ├─ LogoBlock
│  ├─ NavGroup
│  │  ├─ NavItemHome (active)
│  │  ├─ NavItemTasks (with badge 12)
│  │  └─ NavItemSettings
│  └─ UserCard (Avatar + name + plan)
└─ MainSection
   ├─ DashboardHeader
   │  ├─ Title + Subtitle
   │  └─ HeaderActions (SearchInput + QuickActionNewTask)
   ├─ StatCardGrid (4 cards: Active / Done / Overdue / Members)
   └─ ActivityCard
      ├─ ActivityHeader (title + "View all")
      ├─ ActivityTableHeaderRow
      └─ ActivityRow × 4
```

## 11. Page Specifications

### 대시보드 개요 (dash-overview)

- **Route**: `/`
- **Variant**: page
- **Layout**: shell (sidebar + main)

| Section | Block | Description |
|---|---|---|
| ChromeSection | Sidebar | LogoBlock + NavGroup + UserCard, 240px fixed |
| HeaderSection | DashboardHeader | "Good morning, Alex" + "Monday, April 28 — 12 active tasks today" + SearchInput + QuickActionNewTask |
| MainSection | StatCardGrid | 4 종 카드 — Active 12 / Done 28 (+12%) / Overdue 3 / Members 7 |
| MainSection | ActivityCard | Header "Recent Activity" + 4 row (status 4 종) |
| MainSection | QuickActions | "+ New Task" — DashboardHeader 우측에 흡수됨 (별도 Block 아님) |

> drift 신호: DESIGN.md §11 의 dash-overview 는 QuickActions 를 별도 MainSection Block 으로 정의. 추출 결과는 HeaderActions 안에 흡수.

## 12. Composite Components (페이지 사용분)

### Sidebar (Composite — chrome)
- LogoBlock / NavGroup (NavItemHome × 1 active + NavItemTasks × 1 with badge + NavItemSettings × 1) / UserCard

### DashboardHeader
- Title (22px 600) + Subtitle (13px 400 `#64748B`) + HeaderActions (SearchInput + QuickActionNewTask)

### StatCard (variants: default / trending-up / trending-down / status-error / muted)
- Title 13/500 + Value 32/600 + Trend 12/500 (color: success / primary / error / muted)

### ActivityTable (Composite)
- Header row + Body row × N
- Body row vertical lane: dot 6×6 + Task (flex 2) + Avatar+Name (flex 1) + Status badge (110px) + Updated (100px)

## 13. Token Mapping

### Color Tokens (페이지 사용분)

| Design Name | Hex | CSS Variable |
|---|---|---|
| Primary | `#4F46E5` | `--color-primary` |
| Primary Subtle | `#EEF2FF` | `--color-primary-subtle` |
| Accent | `#0EA5B7` | `--color-accent` |
| Surface | `#FFFFFF` | `--color-surface` |
| Surface Alt | `#F8FAFC` | `--color-surface-alt` |
| Divider Soft | `#F1F5F9` | `--color-divider-soft` |
| Border | `#E2E8F0` | `--color-border` |
| Status Success bg / text / label | `#DCFCE7` / `#16A34A` / `#166534` | `--color-success-bg` / `-fg` / `-strong` |
| Status Error bg / text / label | `#FEE2E2` / `#DC2626` / `#991B1B` | `--color-error-bg` / `-fg` / `-strong` |
| Status Default bg / text / label | `#F1F5F9` / `#94A3B8` / `#475569` | `--color-muted-bg` / `-fg` / `-strong` |

### Radius Tokens (페이지 사용분)

| Name | Value | Usage |
|---|---|---|
| md | 6px | NavItem / Status badge |
| lg | 8px | UserCard / SearchInput / QuickActionNewTask |
| pill | 999px / 50% | Avatar / activity dot / Tasks badge / status badge dot |
| xl | 12px | StatCard / ActivityCard |

### Spacing Tokens (페이지 사용분)

| Name | Value | Usage |
|---|---|---|
| sm | 8px | UserCard padding |
| md | 12px / 14px / 16px | gaps |
| lg | 20px / 24px | card padding / main gap |
| xl | 28px / 40px | main top / horizontal padding |

## 14. i18n References

| Key | Default (en) | Source |
|---|---|---|
| `dashboard.title` | "Good morning, Alex" | DashboardHeader Title (NEW — DESIGN.md §14 는 "Dashboard" 정의, drift 신호) |
| `dashboard.subtitle` | "Monday, April 28 — 12 active tasks today" | DashboardHeader subtitle (NEW — 동적 카피) |
| `dashboard.search.placeholder` | "Search tasks…" | SearchInput |
| `dashboard.stats.activeTasks` | "Active Tasks" | StatCard 1 title |
| `dashboard.stats.activeTasks.delta` | "+3 today" | trend (NEW) |
| `dashboard.stats.done` | "Done This Week" | StatCard 2 |
| `dashboard.stats.done.delta` | "+12%" | trend (NEW) |
| `dashboard.stats.overdue` | "Overdue" | StatCard 3 |
| `dashboard.stats.overdue.note` | "needs attention" | (NEW) |
| `dashboard.stats.members` | "Team Members" | StatCard 4 |
| `dashboard.stats.members.note` | "2 online" | (NEW) |
| `dashboard.activity.title` | "Recent Activity" | ActivityHeader |
| `dashboard.activity.viewAll` | "View all" | ActivityHeader action (NEW) |
| `dashboard.activity.column.task` | "Task" | TableHeader |
| `dashboard.activity.column.assignee` | "Assignee" | TableHeader |
| `dashboard.activity.column.status` | "Status" | TableHeader |
| `dashboard.activity.column.updated` | "Updated" | TableHeader |
| `dashboard.activity.status.inProgress` | "In progress" | row badge |
| `dashboard.activity.status.done` | "Done" | row badge |
| `dashboard.activity.status.overdue` | "Overdue" | row badge |
| `dashboard.activity.status.backlog` | "Backlog" | row badge |
| `dashboard.quickAction.newTask` | "+ New Task" | QuickActionNewTask |
| `nav.home` | "Home" | Sidebar nav |
| `nav.tasks` | "Tasks" | Sidebar nav |
| `nav.settings` | "Settings" | Sidebar nav |

> drift 신호 요약: ① "Dashboard" 정적 제목이 동적 인사 ("Good morning, Alex") 로 확장 ② Stat delta / note 는 모두 신규 키 ③ Activity status 4 종은 enum-style 키 필요 (DESIGN.md §14 미등재).
