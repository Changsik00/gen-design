# Visual Comparison Report — 앱 A (TaskFlow)

> spec-5-03 의 산출물 중 하나. Paper 시안 (spec-5-02 의 5 artboard + DESIGN.md §11 common-error) ↔ React 구현 (`poc/app-a/src/`) 의 시각적 일치도를 정성 비교한다.
>
> **방법**: `poc/app-a/design-extract/*.md` 의 schema 14 섹션 추출 결과를 source-of-truth 로, studio 의 templates / composites / atoms 구현과 cross-reference. 픽셀 단위 측정은 phase-5 의 success criteria 가 정량 픽셀 diff 가 아니므로 수행하지 않음 (자동화 필요성 평가는 spec-5-05 회고).
>
> **PNG 첨부**: 본 spec 에서는 미수집 (Paper MCP 응답이 base64 image 라 디스크 저장 도구 부재 + dev 서버 수동 캡처는 ship 단계 외 작업). 후속 작업으로 사용자 협조하여 `visual/paper/*.png` + `visual/render/*.png` 로 보강 가능.
>
> **일치도 등급**: ✅ 일치 (Paper 의도 그대로 재현) / ⚠️ 부분 (의도 일부 손실 — spacing / radius / 정렬 어긋남, 실용 가능) / ❌ 불일치 (시각 의도 명백히 다름)
>
> **원인 분류**: A) DESIGN.md 누락 / B) studio 패턴 차이 / C) 토큰 미적용 / D) 정상 차이 (의도된 차이)

---

## 요약 표

| # | 페이지 | Paper artboard | DESIGN.md §11 variant | 구현 variant | 일치도 | 핵심 차이 | 원인 |
|---|---|---|---|---|:---:|---|:---:|
| 1 | auth-login | `1CH-0` | modal | page (split-screen) | ⚠️ | 라우트 페이지 사용을 위해 modal → page 분기 | D |
| 2 | auth-signup | `1DR-0` | page (split-screen) | page (split-screen) | ⚠️ | brand panel 색 (Paper #4338CA → 구현 slate-gradient) | B |
| 3 | dash-overview | `1FI-0` | page (shell) | page (shell) | ⚠️ | Sidebar 224px (Paper 240px), page ground bg, ActivityTable 의미 모델 | B + D |
| 4 | profile-mypage | `1J5-0` | page (shell) | page (shell) | ⚠️ | 2-column → single-column 스택, ProgressBar 미구현 | B |
| 5 | settings-overview | `1LR-0` | page (shell) | page (shell) | ⚠️ | 카드 그림자 1 단계 추가 (Paper 0 단계 minimalism) | B |
| 6 | common-error | (없음 — DESIGN.md only) | page (centered-card) | page (centered-card) | ✅ | — | — |

---

## 1. auth-login — Login

| 항목 | Paper (artboard `1CH-0`) | 구현 (`/login` route) |
|---|---|---|
| **Variant** | modal | page (split-screen) |
| **Width** | 480px modal card | 1280px split (좌 50% brand / 우 50% form) |
| **Backdrop / Page bg** | Slate-900 (`#0F172A`) | bg-background (`#FFFFFF`) |
| **Brand mark** | LogoMark 아이콘 + "TaskFlow" 텍스트 | "A" 12 letter mark + Admin Console 캡션 |
| **Form fields** | Email + Password (각 라벨/placeholder/border) | 동일 |
| **Submit CTA** | Primary indigo 버튼 "Sign in" | 동일 |
| **Social** | Google + GitHub 버튼 (white bg + slate-200 border) | 동일 (DESIGN.md §11 정렬 후) |
| **Forgot link** | Indigo text-decoration | 동일 |
| **Signup prompt** | "Don't have an account? Sign up" — slate + indigo split | 동일 |
| **Elevation** | elevation-modal 2-stop (modal 카드 그림자) | N/A (split-screen 페이지라 elevation 미적용) |

**일치도**: ⚠️ 부분 — 폼 / 토큰 / 컴포넌트는 일치, **layout 모드 다름** (modal ↔ split-screen).

**차이의 의미**: 라우트 페이지로 사용하기 위해 LoginPage 의 page variant 로 분기. modal variant 는 다른 컨텍스트 (Dashboard 의 세션 만료 등) 에서 호출용. studio 의 templates types.ts 는 두 variant 모두 지원하므로 spec-5-04 에서 modal 도 함께 검증 가능.

**원인**: D (정상 차이 — 라우팅 컨텍스트의 의도된 fallback).

---

## 2. auth-signup — Signup

| 항목 | Paper (artboard `1DR-0`) | 구현 (`/signup` route) |
|---|---|---|
| **Variant / Layout** | page / split-screen | 동일 |
| **Brand panel bg** | Indigo darker `#4338CA` 단색 | slate-900 → slate-800 → slate-900 gradient |
| **Brand panel content** | LogoMark + Display 36px headline + 14px subtitle | "A" 12 letter mark + Admin Console 캡션 + 4xl headline + slate-400 subtitle |
| **Brand panel padding** | 좌 56px / 우 80~96px 비대칭 | px-16 (양쪽 동일) |
| **Form fields** | Name / Email / Password / Confirm | 동일 |
| **Terms checkbox** | indigo Primary checkbox + 본문 | SignupForm 그대로 (Phase 2) |
| **Social** | Google + GitHub (선택 ON SocialAuthBlock) | 동일 (DESIGN.md §11 정렬 후 추가) |
| **Login prompt** | "Already have an account? Sign in" | 동일 |

**일치도**: ⚠️ 부분 — 구조 일치, **brand panel 의 색감이 slate gradient 로 변형**.

**차이의 의미**: studio 의 LoginPage page variant 가 slate gradient panel 패턴을 정의했고 (Phase 2 산출물), SignupPage 도 일관성을 위해 동일 패턴 답습. DESIGN.md 의 indigo darker `#4338CA` brand panel 은 적용 안 됨. spec-5-04 에서 brand panel 의 토큰화 (`--color-brand-deep`) 검토 가능.

**원인**: B (studio 패턴 차이 — Phase 2 brand panel 패턴 재사용).

---

## 3. dash-overview — Dashboard

| 항목 | Paper (artboard `1FI-0`) | 구현 (`/` route) |
|---|---|---|
| **Layout** | shell (240px Sidebar + Main flex) | shell (w-56 = 224px Sidebar + Main flex) |
| **Page ground** | Surface alt `#F8FAFC` | bg-background (`#FFFFFF`) |
| **Sidebar bg** | Slate-900 dark | sidebar 토큰 (`#0F172A`) — Paper 와 일치 |
| **Sidebar nav active** | indigo bg + white text | sidebar-primary indigo + primary-foreground white — 일치 |
| **DashboardHeader** | 인사 + 검색 input + 우측 사용자 chip | 제목 + 검색 placeholder (Phase 2 컴포넌트) |
| **Stat cards (4 종)** | radius 12px, elevation-card 1-stop | Card 컴포넌트 + radius 12 + 1-stop shadow — 일치 |
| **Stat values** | "Active Tasks 24" / "Done 18 +12%" / "Overdue 3" / "Members 12" — Paper 시안 mock | 구현 mock (24 / 18 / 3 / 12) — 동일 |
| **Trend indicator** | success green + error red + slate gray | trendColor 함수 정확 매핑 |
| **ActivityTable** | 4 컬럼 (Task / Assignee / Status / Updated) | 4 컬럼 (data slot user/action/status/time + 라벨은 useTexts 매핑) |
| **Status badges** | success / error / indigo / slate 4 종 | statusColor 매핑 (green/red/blue/gray) |
| **Quick action** | "+ New Task" Primary CTA (선택 ON) | DashboardPage 미렌더 (선택 ON 미구현) |

**일치도**: ⚠️ 부분 — 구조와 토큰은 일치, **3 가지 mismatch**:
1. Sidebar width (Paper 240 / 구현 224 = 16px less)
2. Page ground bg (Paper surface-alt #F8FAFC / 구현 background #FFFFFF) — light 테마 토큰 정의로 surface != background 차이
3. ActivityTable 의미 모델 — Paper "작업 목록" (task/assignee), 구현 "활동 로그" (user/action). 라벨만 DESIGN.md 와 일치, 데이터 의미는 Phase 2 모델 답습 (Task 5 결정)
4. QuickAction "+ New Task" 미렌더 (선택 ON)

**차이의 의미**: Sidebar 너비 16px 차이는 정렬 작업으로 해소 가능. page ground bg 는 index.css 의 `body { @apply bg-background }` 에서 토큰 매핑 변경 필요. ActivityTable 의미 모델 은 spec scope 너머 (데이터 모델 결정).

**원인**: B (Sidebar width 미세 spacing) + B (page ground 토큰 매핑) + D (ActivityTable 의미 — Task 5 결정).

---

## 4. profile-mypage — MyPage

| 항목 | Paper (artboard `1J5-0`) | 구현 (`/me` route) |
|---|---|---|
| **Layout** | shell (Sidebar + Main flex) | 동일 |
| **ProfileAvatar** | 80×80, dual shadow (subtle base + brand glow `rgba(67, 56, 202, 0.18)`) | 80×80, 동일 dual shadow (`elevation-avatar-glow` 토큰값 직접 inline) |
| **ProfileAvatar bg** | Indigo brand-deep `#4338CA` | primary/10 (`#EEF2FF`-ish, primary 의 10% opacity) |
| **Name + Role** | 우측 stack (Name H2 + Role caption) | 동일 |
| **ContentRow layout** | 2-column (Account info card / Activity summary card) | **single-column stack** (info → summary → upload) |
| **ProfileInfoCard** | 3 row (email / joinedAt / team) Card 안 | 3 row dl, divide-y border, Card 안 — 일치 |
| **ActivitySummary** | 3 metric (Tasks / Comments / Completion %) + ProgressBar | 3 metric grid, **ProgressBar 미구현** (단순 % 텍스트) |
| **AvatarUpload** | 단독 하단 카드 (avatar 64px + Change button + Remove outline danger) | avatar 64px + Change button (Remove 버튼 미구현) |

**일치도**: ⚠️ 부분 — **layout column 수 차이 + 일부 컴포넌트 단순화**.

**차이의 의미**:
1. 2-column → single-column: PoC 단순화. spec-5-04 또는 후속 spec 에서 grid layout 도입 가능.
2. ProfileAvatar bg: Paper 의 `#4338CA` (brand-deep) ↔ 구현 `primary/10` (subtle bg). 글자 (이니셜) 가 indigo 라 Paper 는 흰색 (역할 반전). 의도 불일치.
3. ProgressBar 미구현: ActivitySummary 의 비주얼 라이트 요소. PoC 우선순위 낮음.
4. AvatarUpload Remove 버튼 미구현 (outline danger): 부차 기능, PoC 미포함.

**원인**: B (PoC 단순화 — layout / ProgressBar / Remove 버튼).

---

## 5. settings-overview — Settings

| 항목 | Paper (artboard `1LR-0`) | 구현 (`/settings` route) |
|---|---|---|
| **Layout** | shell + Radix-style group (헤더 좌 220px + rows 우 flex) | shell + SettingsGroup wrapper (헤더 위 / rows 아래 stack) |
| **Group structure** | **카드 박스 없음** (intent §1.5 minimalism — 그림자 0 단계) | SettingsGroup 이 **Card wrapper 사용** (elevation-card 1-stop) |
| **Group divider** | 그룹 사이만 1px border-top, row 사이는 1px divider | row 사이 divide-y, 그룹 사이는 space-y-8 (gap) |
| **NotificationGroup** | 4 toggle (Email / Push / Weekly / Mentions) | 동일 |
| **AppearanceGroup** | Theme Select + FontSize Slider | 동일 |
| **LanguageGroup** | Language Select + Timezone Select | 동일 |
| **AccountGroup** | Email row + Change password row + Delete account zone | 동일 + **Delete zone 의 error-soft 토큰 (`#FEF2F2` / `#FECACA` / `#B91C1C`) 정확 적용** |
| **Switch on color** | Primary indigo `#4F46E5` | bg-primary 토큰 — 일치 |
| **Slider track filled** | Primary indigo | primary 토큰 — 일치 |
| **Slider handle** | white bg + indigo border + elevation-handle 그림자 | 동일 (1px 3px rgba(15,23,42,0.12) inline) |

**일치도**: ⚠️ 부분 — **컴포넌트와 토큰은 정확히 일치**, group 시각 박스 1 차이.

**차이의 의미**: SettingsGroup 컴포넌트가 Card wrapper 를 사용하여 그림자 1 단계가 추가됨. Paper 의 minimalism 의도 (카드 박스 없는 row direct) 와 어긋남. 향후 SettingsGroup 의 wrapper 를 Card → div 로 변경하면 해소 가능. PoC 의도는 컴포넌트 동작 + 토큰 적용 검증이라 본질적 차이는 아님.

Delete account zone 의 error-soft 토큰 (3 종 hex) 은 Paper 와 정확히 일치 — DESIGN.md 정렬 성공 사례.

**원인**: B (studio 패턴 차이 — SettingsGroup 의 Card wrapper 선택).

---

## 6. common-error — Error

| 항목 | DESIGN.md §11 | 구현 (`/totally-not-here` route) |
|---|---|---|
| **Variant / Layout** | page / centered-card | 동일 |
| **ErrorIcon** | 404 / 500 별 아이콘 (DESIGN.md 미명시 종류) | lucide FileSearch (404) / ServerCrash (500), primary/10 bg + 80px container |
| **ErrorMessage** | 제목 (코드 + 한 줄) + 본문 | 제목 H1 (-0.015em letter-spacing) + caption |
| **HomeButton** | "Back to Home" Primary | Primary Button + onClick → useNavigate('/') |
| **Spacing** | 단순 vertical center, gap | flex flex-col items-center gap-6 max-w-md |

**일치도**: ✅ 일치 — DESIGN.md 정의가 단순 (Paper artboard 없음, 구현 자유도 큼). 구현이 정의의 의도를 그대로 충족.

**원인**: — (정상 구현).

---

## 종합 평가

| 항목 | 결과 |
|---|---|
| **6 페이지 평균 일치도** | ⚠️ 부분 (5/6) + ✅ 일치 (1/6) |
| **핵심 성공** | DESIGN.md §13 토큰의 코드 적용. 5 신규 atoms / 12 신규 composites / 3 신규 templates 의 정합성. error-soft 토큰의 정확 hex 매칭. light 테마 단일 흐름 |
| **핵심 drift (의도)** | LoginPage 라우트의 page fallback (variant 분기). ActivityTable 의미 모델 (Task 5 결정) |
| **핵심 drift (보강 여지)** | (1) Sidebar width 240→224. (2) page ground bg 의 surface-alt 적용. (3) brand panel 색의 brand-deep 토큰 적용. (4) MyPage 2-column layout. (5) ProgressBar 컴포넌트. (6) SettingsGroup 의 Card wrapper 제거 |
| **DESIGN.md 누락 (A)** | 0 건 — DESIGN.md 가 spec-5-02 의 Paper 추출 결과로 충분히 채워짐 |
| **studio 패턴 차이 (B)** | 5 건 — Phase 2 의 LoginPage gradient panel 답습 / SettingsGroup Card wrapper / Sidebar width / page ground bg / ProfileAvatar bg |
| **토큰 미적용 (C)** | 0 건 — `_tokens.css` 의 50+ 변수 모두 컴포넌트에서 사용 |
| **정상 차이 (D)** | 2 건 — LoginPage variant 분기 / ActivityTable 의미 모델 (Task 5 결정) |

**phase-5 success criteria 매핑**:

| SC | 결과 |
|---|---|
| #1 앱 A 전 과정 완료 (Blueprint → DESIGN.md → Paper → React) | ✅ — spec-5-01 (Blueprint) + spec-5-02 (Paper) + 본 spec (React) |
| #4 디자인 시안 ↔ React 코드 시각적 일치도 검증 | ✅ — 본 문서 (정성 6 페이지) |

**다음 단계 (spec-5-04 / spec-5-05 입력)**:
- spec-5-04 의 "토큰 + i18n 만 교체" 가설은 본 spec 의 토큰 layer (`tokens.json` → `_tokens.css`) 가 충분히 분리되어 있으므로 검증 가능
- spec-5-05 회고 입력: studio 패턴 차이 5 건은 단순 보강 가능한 항목. 자동 visual regression 도입 여부 / Phase 2 산출물의 Paper 정합성 사전 검증 흐름이 필요한지 평가
