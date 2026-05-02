# profile-mypage — Paper 추출 결과

> spec-5-02 추출 산출물 4/5. Paper artboard `1J5-0` ("TaskFlow — MyPage") 의 schema 14 섹션 추출.

## 1. Visual Theme & Atmosphere

shell layout 의 프로필 — 동일 Sidebar (clone) + Main flex. 80px ProfileAvatar 가 시각적 anchor, 2-column 카드 (Account info + Activity summary), 하단 단독 AvatarUploadCard.

**Key Characteristics**:
- ProfileAvatar 80×80 + dual shadow (subtle base + brand glow `rgba(67, 56, 202, 0.18)`)
- 카드 elevation-card 1 단계 (Dashboard 와 동일)
- 2-column ContentRow (flex 1 + flex 1)
- ProgressBar 6px 높이 999px radius — 비주얼 라이트.

## 2. Color Palette & Roles

### Primary
- **Indigo / Primary** (`#4F46E5`): Edit profile CTA / ProgressBar fill / Product Lead chip text.
- **Indigo / Brand-deep** (`#4338CA`): ProfileAvatar bg + AvatarUploadCard preview bg.

### Status (page 사용분)
- **Error** (`#DC2626` / `#FEE2E2`): Remove (avatar) button border-only — outline danger 변형.

### Brand-subtle
- **Indigo-50** (`#EEF2FF`): Product Lead chip bg.

### Neutral & Surface
- 동일 — Slate 토큰 + Surface alt `#F8FAFC` page ground (Dashboard 와 일관).

## 3. Typography Rules

### Hierarchy (페이지 사용분 — 추가)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Profile Display | Inter | 24px | 600 | round(up, 125%, 1px) | -0.015em |
| Stat Display Sub | Inter | 24px | 600 | 1.0 | -0.015em |

> 그 외 Card title 15/600 / Body 14/Label 13/Helper 12 동일.

## 4. Component Stylings

### ProfileAvatar (large)
- 80×80, border-radius 50%, bg `#4338CA`.
- box-shadow combined: `#0F172A0F 0px 1px 2px, #4338CA2E 0px 4px 12px` (= base micro-shadow + brand glow).
- inner initials 28px / 600 / white.

### ProfileChip (Product Lead)
- height 22, padding-inline 8, border-radius 6, bg `#EEF2FF`, label 11px 600 `#4F46E5`.

### Card (Account / Activity / AvatarUpload)
- 동일 base — flex 1 (또는 stretch), padding 20×22, border-radius 12, border 1px `#E2E8F0`, shadow `#0F172A0A 0px 1px 2px`.

### InfoRow (Account card)
- align-items center / justify space-between / padding-bottom 10 / border-bottom 1px `#F1F5F9`.
- Label 13px 500 `#64748B` / Value 14px 500 `#0F172A`.

### Stat triple (Activity summary card)
- 3 column flex with vertical 1px `#F1F5F9` divider.
- Label 12px 500 `#64748B` / Value 24px 600 -0.015em.

### ProgressBar
- track height 6px, border-radius 999px, bg `#F1F5F9`.
- fill width 93%, height 6px, border-radius 999px, bg `#4F46E5`.

### Button — Outline Danger (Remove avatar)
- height 36, padding-inline 14, bg `#FFFFFF`, border 1px `#FEE2E2`, border-radius 8, label 13px 600 `#DC2626`.

### Button — Secondary (Change avatar / Upload new)
- height 36, padding-inline 14, bg `#FFFFFF`, border 1px `#E2E8F0`, border-radius 8, label 13px 600 `#334155`.

### Button — Primary (Edit profile, smaller variant)
- height 36, padding-inline 14, bg `#4F46E5`, border-radius 8, label 13px 600 white.

## 5. Layout Principles

- **Page layout**: shell (Sidebar 240 + Main flex).
- **Main padding**: 28×40 / 40×40, gap 24.
- **ProfileHeader**: align center, gap 20, HeaderActions margin-left auto.
- **ContentRow**: 2 column flex 1 + flex 1, gap 16.
- **AvatarUploadCard**: full-width, padding 22, gap 20.

## 6. Depth & Elevation

| Level | Value | Use |
|---|---|---|
| elevation-card | `#0F172A0A 0px 1px 2px` | InfoCard / ActivityCard / AvatarUploadCard |
| elevation-avatar (NEW) | `#0F172A0F 0px 1px 2px, #4338CA2E 0px 4px 12px` | ProfileAvatar 80px (brand glow combined) |

## 7. Do's and Don'ts

- **Do**: ProfileAvatar 의 brand glow 는 본 페이지 단 1 인스턴스. 다른 카드에 brand glow 사용 금지.
- **Don't**: Account 카드의 InfoRow divider 는 `#F1F5F9` (soft). `#E2E8F0` (default border) 사용 시 시각이 무거워짐.

## 8. Responsive Behavior

본 시안은 desktop 단일.

## 9. Agent Prompt Guide

- "ProfileAvatar — 80 round / bg #4338CA / shadow rgba(15,23,42,0.06) 0 1px 2px + rgba(67,56,202,0.18) 0 4px 12px"
- "ProgressBar 93% — track 6 #F1F5F9 / fill 6 #4F46E5 / radius 999"
- "Outline danger — bg white / border 1 #FEE2E2 / radius 8 / 13/600 #DC2626"

## 10. Naming Convention

```
MyPage (shell)
├─ Sidebar (clone of Dashboard)
└─ MainSection
   ├─ ProfileHeader
   │  ├─ ProfileAvatar (80, brand glow)
   │  ├─ Identity (name H + chip + role-location text)
   │  └─ HeaderActions (Change avatar + Edit profile)
   ├─ ContentRow
   │  ├─ ProfileInfoCard (title + InfoRow × 3)
   │  └─ ActivitySummaryCard (title + stat triple + ProgressBar)
   └─ AvatarUploadCard (preview + text + actions)
```

## 11. Page Specifications

### 마이페이지 (profile-mypage)

- **Route**: `/me`
- **Variant**: page
- **Layout**: shell (sidebar + main)

| Section | Block | Description |
|---|---|---|
| ChromeSection | Sidebar | DashboardSidebar clone (NavItemHome active 그대로) |
| HeaderSection | ProfileHeader | 80px Avatar + "Alex Park" 24/600 + "Product Lead" chip + "Design Systems · Seoul" + Change avatar / Edit profile actions |
| MainSection | ProfileInfoCard | "Account" 15/600 + 3 InfoRow (Email / Joined / Team) |
| MainSection | ActivitySummaryCard | "Activity summary" 15/600 + 3 column (Tasks 142 / Comments 87 / Completion 93%) + "Completion rate" ProgressBar 93% |
| MainSection | AvatarUploadCard | 64px preview + "Profile picture" / 안내문 + Upload new (Secondary) / Remove (Outline Danger) |

> drift 신호: DESIGN.md §11 의 profile-mypage 는 ProfileHeader 가 단순 "아바타 + 이름 + 역할" 만 정의. 추출 결과는 chip + 위치 + actions 까지 확장.

## 12. Composite Components (페이지 사용분)

### ProfileHeader (Composite — page-level)
- ProfileAvatar (80, brand glow) + Identity (Heading + chip + caption) + HeaderActions

### ProfileInfoCard
- Title + InfoRow × N (label + value, divider soft)

### ActivitySummaryCard
- Title + StatTriple (3 column flex with divider) + ProgressBar

### AvatarUploadCard
- AvatarPreview (64px) + Description (title + body) + UploadActions (Secondary + Outline Danger)

## 13. Token Mapping

### Color Tokens (페이지 사용분 — Login/Signup/Dashboard 외 추가)

| Design Name | Hex | CSS Variable |
|---|---|---|
| Brand-deep | `#4338CA` | `--color-brand-deep` |
| Error border-only | `#FEE2E2` | `--color-error-border` |

### Radius Tokens (페이지 사용분)

| Name | Value | Usage |
|---|---|---|
| md | 6px | chip |
| lg | 8px | button |
| pill | 999px / 50% | Avatar / ProgressBar |
| xl | 12px | Card |

### Spacing Tokens (페이지 사용분)

| Name | Value | Usage |
|---|---|---|
| md | 16px | ContentRow gap |
| lg | 20px / 22px | ProfileHeader gap / Card padding |

## 14. i18n References

| Key | Default (en) | Source |
|---|---|---|
| `mypage.title` | (없음) | (NEW — DESIGN.md §14 는 "My Page" 정의, 추출엔 없음 — drift) |
| `mypage.user.name` | "Alex Park" | ProfileHeader (NEW — 동적 사용자명) |
| `mypage.user.role` | "Product Lead" | chip (NEW) |
| `mypage.user.location` | "Design Systems · Seoul" | (NEW) |
| `mypage.actions.changeAvatar` | "Change avatar" | HeaderActions (DESIGN.md §14 의 mypage.avatar.upload 와 의미 중복, drift) |
| `mypage.actions.editProfile` | "Edit profile" | HeaderActions (NEW) |
| `mypage.account.title` | "Account" | ProfileInfoCard (NEW — DESIGN.md §14 미등재) |
| `mypage.info.email` | "Email" | InfoRow |
| `mypage.info.joinedAt` | "Joined" | InfoRow |
| `mypage.info.team` | "Team" | InfoRow |
| `mypage.activity.title` | "Activity summary" | ActivitySummaryCard (NEW) |
| `mypage.summary.tasks` | "Tasks" | StatTriple |
| `mypage.summary.comments` | "Comments" | StatTriple |
| `mypage.summary.completion` | "Completion" | StatTriple (DESIGN.md "Completion Rate" 보다 짧음 — drift) |
| `mypage.summary.completionRate` | "Completion rate" | ProgressBar label |
| `mypage.avatar.title` | "Profile picture" | AvatarUploadCard title (NEW) |
| `mypage.avatar.helper` | "PNG or JPG up to 2 MB. Square images render best." | (NEW) |
| `mypage.avatar.uploadNew` | "Upload new" | (NEW — DESIGN.md "Change avatar" 와 의미 중복) |
| `mypage.avatar.remove` | "Remove" | (NEW) |

> drift 신호 요약: ① 페이지 제목 "My Page" 자체가 추출에서 누락 (Header 가 없음) ② Avatar action 카피가 3 종 (Change avatar / Upload new / Remove) — DESIGN.md 는 단일 키만 정의 ③ Activity summary 표현이 동적 캡션 위주 — 정적 i18n 키와 분리 필요.
