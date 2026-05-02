# Task List: spec-5-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.
> 본 spec 은 코드 변경이 없는 디자인·문서 산출물 spec 이므로 TDD Red/Green 대신 *작성 → 검증* 사이클을 사용합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new app-a-paper-design`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-5.md SPEC 표 갱신 + Icebox 추가) — Task 1 (housekeeping) commit 으로 push 예정
- [x] 사용자 Plan Accept (2026-04-28)

---

## Task 1: Housekeeping — spec-5-01 잔재 정리 + 거버넌스 갱신

> 이미 working tree 에 있는 변경 (`.gitignore` / `task.md` / `phase-5.md` / `queue.md`) 을 첫 commit 으로 흡수.
> 브랜치는 PLANNING 단계에서 이미 생성됨 (`spec-5-02-app-a-paper-design`).

### 1-1. 변경 확인 + commit

- [x] `git status` — 미커밋 변경 확인 (`.gitignore` / `backlog/phase-5.md` / `backlog/queue.md` / `specs/spec-5-01-app-a-blueprint/task.md` / `specs/spec-5-02-app-a-paper-design/`)
- [x] `git add .gitignore backlog/phase-5.md backlog/queue.md specs/spec-5-01-app-a-blueprint/task.md specs/spec-5-02-app-a-paper-design/`
- [x] `.claude/settings.local.json` 은 stage 하지 않음 (사용자 로컬 설정)
- [x] Commit: `chore(spec-5-02): housekeeping — spec-5-01 ship 잔재 + phase-5 spec-5-02 정의 갱신`

---

## Task 2: DESIGN.md 에 Settings 페이지 정의 추가

> spec-5-01 산출물 `poc/app-a/DESIGN.md` 의 §10 (Page Map) / §11 (Page Specifications) / §12 (Composite Components) / §14 (i18n References) 에 Settings 페이지 추가. 시각 디자인 정확값 (`TODO(spec-5-02)`) 은 이 task 에서는 채우지 않음 (Task 6 에서 Paper 추출 후 일괄).

### 2-1. Settings 페이지 정의 작성

- [x] §10 Page Map 에 행 추가: `| 설정 | /settings | 사용자 환경 설정 — 알림 / 외관 / 언어 / 계정 (Toggle / Select / Slider / Group) |`
- [x] §11 Page Specifications 에 `### 설정 (settings-overview)` 섹션 추가 — `shell` 레이아웃, ChromeSection / HeaderSection / MainSection (Notification / Appearance / Language / Account 4 그룹) 으로 구성
- [x] §12 Composite Components 에 SettingsGroup / SettingsToggleRow / SettingsSelectRow / SettingsSliderRow 4 종 추가
- [x] §14 i18n References 에 `settings.*` 키 16 개 추가 (제목 + 4 그룹 × 평균 4 항목)
- [x] §10 의 Page Map 행과 기존 `nav.settings` (Sidebar) 라우팅 일관성 확인 — `/settings` 로 일관
- [x] Commit: `docs(spec-5-02): add Settings page spec to DESIGN.md`

---

## Task 3: 4 페이지 AI 자동 생성 (Login / Signup / Dashboard / MyPage)

> Paper MCP 로 artboard 4 개 작성. 작성 직후 사용자 시각 검수 → 의도적 보정 최소화.

### 3-1. Paper MCP 사전 점검

- [x] `get_basic_info` — 기존 12 artboard + 폰트(Inter/JetBrains Mono/Geist) 확인
- [x] `get_font_family_info(["Inter", "JetBrains Mono"])` — 100~900 weight + Italic 모두 가용
- [x] `get_guide({ topic: "paper-mcp-instructions" })` — 세션 첫 사용

### 3-2. Login artboard 작성

- [x] `create_artboard` "TaskFlow — Login" (artboard `1CH-0`, 1440×900, 백드롭 `#0F172A`) + 480px modal
- [x] BrandSection (LogoBlock + Title + Subtitle) → CredentialBlock (Email/Password focus state + Submit) → Divider → SocialAuthBlock (Google/GitHub) → SignupPrompt
- [x] `get_screenshot` 검수 — modal 중앙, vertical lane 일관, indigo CTA 가시성 OK
- [x] artboard 메타 (ID `1CH-0`) — 실제 공유 URL 은 walkthrough 단계에서 사용자가 추가

### 3-3. Signup artboard 작성

- [x] `create_artboard` "TaskFlow — Signup" (artboard `1DR-0`, 1440×900, split-screen)
- [x] BrandPanel (좌측 560px, indigo `#4338CA`, LogoBlock + BrandPitch "A calmer way to ship work." + BrandFooter) + FormPanel (FormHeader → SignupForm Name/Email/Password+Confirm 2-column → TermsAgreement → SubmitButton 48px → Divider → SocialAuthBlock → LoginPrompt)
- [x] `get_screenshot` 검수 — 2-column password row vertical lane OK, brand pitch 36px display 위계 OK

### 3-4. Dashboard artboard 작성

- [x] `create_artboard` "TaskFlow — Dashboard" (artboard `1FI-0`, 1440×900, shell)
- [x] Sidebar (240px `1FJ-0`, LogoBlock + NavGroup Home/Tasks badge=12/Settings + UserCard) + MainSection (DashboardHeader Title+Subtitle / SearchInput+QuickActionNewTask) + StatCardGrid 4 카드 (Active/Done/Overdue/Members, 컬러 status 차별) + ActivityCard (Header+TableHeaderRow + 4 Row, status badge 4 종 In progress/Done/Overdue/Backlog)
- [x] `get_screenshot` 검수 — vertical lane (avatar/badge/Updated) 일관, status badge 4 종 색 톤 분리 OK, 하단 빈 공간은 스크롤 영역 가정

### 3-5. MyPage artboard 작성

- [x] `create_artboard` "TaskFlow — MyPage" (artboard `1J5-0`, 1440×900, shell)
- [x] Sidebar 는 `1FJ-0` 를 `<x-paper-clone>` 으로 clone (`1J6-0`) — 토큰 절약
- [x] MainSection — ProfileHeader (80px avatar + 이름 + Product Lead chip + Design Systems · Seoul + Change avatar/Edit profile actions) + ContentRow (ProfileInfoCard Email/Joined/Team + ActivitySummaryCard Tasks 142/Comments 87/Completion 93% + ProgressBar) + AvatarUploadCard (64px preview + 안내문 + Upload new/Remove)
- [x] `get_screenshot` 검수 — 2-column 카드 폭 일관, ProgressBar 토큰 자극 OK

### 3-6. Commit

- [x] Commit: `docs(spec-5-02): create 4 paper artboards (login/signup/dashboard/mypage) via AI`
  - 4 페이지 artboard ID 인라인 기록. 실제 공유 URL 은 walkthrough 작성 시 사용자가 추가.

---

## Task 4: Settings 입력 의도 메모 + AI Radix-based 자동 생성

> 2026-05-02 변경 (사용자 결정): AI 베이스 시스템 일관성을 위해 Designer 인적 단계 제거. AI 가 Radix UI Settings 패턴을 reference 로 활용해 Paper 에 작성.

### 4-1. 원본 의도 메모 작성

- [x] `poc/app-a/intent-preservation.md` 신규 작성
- [x] §1 "Settings 원본 의도" — 페이지 톤 한 줄 + 컴포넌트 6 종 (Toggle/Select/Slider/Group header/Group list/Danger Button) + 토큰 자극 의도 (color 4 카테고리 / spacing 2 / radius 2 / typography 2) + i18n 키 16 (DESIGN.md §14 와 1:1) + 명시적으로 피하려는 패턴 4 종
- [x] §2 "추출 결과 비교" — 빈 표 3 종 (컴포넌트 매핑 / 토큰 자극 매핑 / i18n 키 매핑) + 손실 패턴 요약 + 결론 (32 점 만점)
- [x] Commit: `docs(spec-5-02): write Settings intent memo before manual paper drawing`

### 4-2. AI Radix-based Settings artboard 작성

- [x] `create_artboard` "TaskFlow — Settings" (artboard `1LR-0`, 1440×fit-content, shell) — 처음 1100px 로 시작했으나 danger row 가 잘려 `update_styles` 로 fit-content 전환
- [x] Sidebar 는 `1FJ-0` 를 `<x-paper-clone>` 으로 clone (`1LS-0`)
- [x] MainSection (`1MP-0`) — SettingsHeader + 4 그룹 (Notifications / Appearance / Language / Account)
  - Radix UI Settings 패턴 차용: 그룹 헤더 좌측 220px + rows 우측 flex / row 단위 label 좌 + control 우 / divider 로 분리 / danger zone 은 tinted background + red border + Danger Button 으로 명확히 분리
  - 컴포넌트 6 종 모두 포함: Toggle × 4 (NotificationGroup, on 3 / off 1) / Select × 3 (Theme / Language / Timezone) / Slider × 1 (Font size, 14px @ 45%) / Group header × 4 / Group list (박스 X, surface 직접) / Danger Button × 1 (Delete account)
  - 토큰: DESIGN.md TaskFlow indigo `#4F46E5` / slate `#0F172A`/`#64748B`/`#E2E8F0` / radius 6/8 / spacing 12/16/24/32 / Inter 600/500/400 그대로 — Radix 의 layout 만 흡수, 토큰 미차용
- [x] `get_screenshot` 검수 — 6 컴포넌트 종류 모두 가시성 확인. Spacing / Typography / Contrast / Alignment / Repetition 모두 OK
- [x] Commit: `docs(spec-5-02): create Settings artboard via AI with Radix UI reference`

---

## Task 5: 5 페이지 AI 추출 → design-extract/

### 5-1. Login 추출

- [x] `get_computed_styles` batch (1CH-0 / 1CI-0 / 1CL-0 / 1CO-0 / 1CT-0 / 1CZ-0 / 1D1-0 / 1D8-0)
- [x] `poc/app-a/design-extract/auth-login.md` 작성 (14 섹션, modal 480 / radius 16 / shadow 2-stop / focus ring `#4F46E52E 0 0 0 3px`)

### 5-2. Signup 추출

- [x] `poc/app-a/design-extract/auth-signup.md` (split-screen / brand panel `#4338CA` / 36px Display / Submit 48 / Checkbox 18 radius 4)

### 5-3. Dashboard 추출

- [x] `poc/app-a/design-extract/dash-overview.md` (shell / Sidebar 240 / NavItem active `#EEF2FF` / StatCard radius 12 + elevation-card / Status badge 4 종 / Activity vertical lane 2-1-110-100)

### 5-4. MyPage 추출

- [x] `poc/app-a/design-extract/profile-mypage.md` (shell / ProfileAvatar 80 + brand glow combined shadow / 2-column ContentRow / ProgressBar 6 / outline-danger Remove)

### 5-5. Settings 추출

- [x] `poc/app-a/design-extract/settings-overview.md` (shell / GroupHeader 220 + GroupRows flex / Switch 38×22 + knob shadow / Select trigger 200×36 / Slider 4 track + 16 handle / Danger zone tinted)

### 5-6. Commit

- [x] schema 정합성 검사: `for f in poc/app-a/design-extract/*.md; do grep -c "^## " "$f"; done` — 모두 14 섹션 PASS
- [x] Commit: `docs(spec-5-02): extract 5 paper artboards into design-extract/`

---

## Task 6: DESIGN.md 의 TODO(spec-5-02) 채우기

> 5 페이지 추출 결과를 비교해 합의된 값만 채움. 페이지 간 모순값은 finding 으로 기록 (Task 8).

### 6-1. 토큰 합의값 추출

- [x] §2 Color Palette: Primary `#4F46E5` / Primary-hover `#4338CA` / Primary-active `#3730A3` / Accent `#0EA5B7` / Status (Success `#16A34A`+bg+strong / Error `#DC2626`+bg+strong+5 변주 / Warning·Info 미관찰 명시)
- [x] §3 Typography: 본문 표가 이미 정확값 포함 — 안내문 갱신 (Settings 16/600 group header 는 위계 차이 의도)
- [x] §4 Component Stylings: 본문이 정확값 포함 — 안내문 갱신 + Switch/Select trigger/Slider/Danger zone 신규 도입 명시
- [x] §6 Depth & Elevation: elevation-card 단일 stop / elevation-modal 2-stop / avatar-glow / knob / handle 5 단계로 확장
- [x] §13 Token Mapping: Color Tokens 표 hex 컬럼 모두 채움 — Primary 4 변주 + Text 4 단계 + Surface 2 단계 + Status 4 종 (Warning/Info 미관찰 명시)

### 6-2. 검증 + commit

- [x] `grep -c "TODO(spec-5-02)" poc/app-a/DESIGN.md` → 0 (메타 안내문 2 곳도 마커 표기 자체를 한국어로 풀어 PASS)
- [x] Commit: `docs(spec-5-02): fill DESIGN.md TODO markers with paper-extracted values`

---

## Task 7: drift 측정 + 의도 보존 비교

### 7-1. drift-report.md 작성

- [ ] `poc/app-a/drift-report.md` 신규 작성
- [ ] §1 "5 페이지 × N 항목 drift 표" — Section / Block / 컴포넌트 / 토큰 / i18n 키 단위
- [ ] §2 "표기 정규화 전후 비교" — oklch ↔ hex / rgba ↔ 8-hex / padding 단일 ↔ block-inline / fontFamily fallback
- [ ] §3 "페이지별 drift 점수 + 패턴 요약"
- [ ] §4 "결론" — 본질적 drift 와 표기 차이의 분리

### 7-2. intent-preservation.md 의 §2 채우기

- [ ] Settings 의도 메모(§1) vs `design-extract/settings-overview.md` 항목별 비교
- [ ] 일치 / 부분 일치 / 불일치 분류
- [ ] 손실 패턴 요약 (예: Slider state 누락 / Toggle on/off 색 표기 차이 등)

### 7-3. Commit

- [ ] Commit: `docs(spec-5-02): write drift report and intent preservation comparison`

---

## Task 8: findings.md 갱신 (phase-6 입력)

### 8-1. paper-normalizer 함수 후보 추가

- [ ] `poc/app-a/findings.md` 의 "phase-6 입력" 섹션 (없으면 신규 생성) 에 추가:
  - drift / 정규화 작업 중 발견된 반복 패턴 → 함수 후보 ≥ 1 개
  - 예: `normalizeOklchToHex(oklch: string): string` / `normalizePadding(padding: string | object): { block, inline }`
- [ ] Commit: `docs(spec-5-02): record paper-normalizer function candidates for phase-6`

---

## Task 9: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

### 9-1. 사전 점검

- [ ] schema 정합성 검사: `grep -c "^## " poc/app-a/DESIGN.md` (≥ 14) + `for f in poc/app-a/design-extract/*.md; do grep -c "^## " "$f"; done`
- [ ] 통합 테스트:
  - `grep -c "TODO(spec-5-02)" poc/app-a/DESIGN.md` → 0
  - `wc -l poc/app-a/drift-report.md poc/app-a/intent-preservation.md` → 모두 > 0
  - `ls poc/app-a/design-extract/*.md | wc -l` → 5
- [ ] task.md 의 모든 체크박스 `[x]` 또는 `[-]` 확인 (Pending `[ ]` 0 개)

### 9-2. walkthrough.md / pr_description.md 작성

- [ ] `.harness-kit/agent/templates/walkthrough.md` 읽고 작성
- [ ] `.harness-kit/agent/templates/pr_description.md` 읽고 작성
- [ ] 한국어 + 템플릿 준수

### 9-3. Ship commit + push + PR

- [ ] Commit: `docs(spec-5-02): ship walkthrough and pr description`
- [ ] Push: `git push -u origin spec-5-02-app-a-paper-design`
- [ ] PR 생성: `gh pr create` (또는 `/hk-pr-gh`) — base `main`
- [ ] 사용자 알림: 푸시 완료 + PR URL 보고 → 머지 대기

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 (Housekeeping / Settings 정의 / AI 4 페이지 / 의도 메모 + 사용자 작업 / AI 5 추출 / DESIGN TODO 채우기 / drift+의도 보고 / findings 갱신 / Ship) |
| **예상 commit 수** | 9 (Task 4-2 는 인적 작업 단계로 commit 없음, 따라서 8 commit. Ship 1 commit 포함 시 9 commit) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-27 |
