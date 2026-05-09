# Walkthrough: spec-6-01

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| C-01d (VariantWrapper triggerLabel) 처리 방향 | (a) required prop / (b) `texts.openLabel` i18n 합류 | **(b)** | 회고 권장 + SignupPage 호출부가 이미 `triggerLabel={texts.title}` 전달 → 변경 비용 0 으로 i18n 격리 자동 회복 |
| C-05 (Sidebar width) 토큰 vs prop | (a) `--sidebar-width` 토큰 / (b) `width` prop | **(a)** | 전역 일관, spec-6-07 토큰 편집기에서 변경 가능. tokens.json 합류로 향후 대체 가능 |
| C-06 (body bg) 적용 대상 | (a) studio 본체만 / (b) studio + poc/app-a / (c) studio 만, poc/app-a 는 archive 시 | **(a)** | 본 spec 의 본질은 Studio API 정합화. poc/app-a 는 phase-5 archive 단계에서 별도 처리 |
| Task 7 (C-06 body bg→surface-alt 매핑) 진행 여부 | (A) Pass — 이미 정합 / (B) `surface-alt` 토큰 신규 정의 / (C) Out of Scope 명시 | **(A) Pass** | studio 의 `--background` 값 (`#F8FAFC`) 이 이미 Paper page ground 와 일치. 시맨틱 토큰 (`surface-alt`) 신규 정의는 spec 범위 확장 — Icebox 로 분리 |
| `sidebar.width` 토큰 그룹 위치 | (i) `semantic.size` 신규 그룹 / (ii) `semantic.radius` 에 추가 / (iii) top-level | **(i)** | radius 와 동일 패턴 (`semantic.X.Y` → `Y` transform) 적용 가능, 향후 dimension 토큰 확장 가능 |
| Task 1 commit 처리 | (a) branch 만 + scaffold commit 별도 / (b) branch + scaffold 묶음 | **(b)** | phase-5 패턴 (`8079301 docs(spec-5-01): scaffold spec/plan/task...`) 따름. 첫 commit = scaffold |

## 💬 사용자 협의

- **주제**: phase-6 Spec 인벤토리 — Track A 5 개 → Track A/B/C 통합 10 개
  - **사용자 의견**: "권장대로" — 옵션 C → B 순서로 진행
  - **합의**: phase-6.md 에 10 spec 인벤토리 등재 후 Track B 의 첫 spec (`spec-6-01 = studio-api-alignment`) 부터 시작 (`6806687 chore(phase-6): expand spec inventory ...`)

- **주제**: Q1 / Q2 / Q3 결정
  - **사용자 의견**: "모두 권장대로"
  - **합의**: Q1=(b) `texts.openLabel` 합류, Q2=(a) `--sidebar-width` 토큰, Q3=(a) studio 본체만

- **주제**: commit timestamp 위장
  - **사용자 의견**: "이번에 커밋은 모두 1시간 전으로 해 주고 pr 도 1시간 전으로"
  - **합의**: 8 commit (Task 1 ~ ship) 의 author/committer date 를 `-60min ~ -7min` 범위에 자연 분포 (1~10 분 간격). PR `Created at` 은 GitHub 서버 시각 — 1 시간 전 적용 불가 (commit list 만 위장 시각 반영). 직전 chore commit `6806687` 은 amend 안 함.

- **주제**: Task 7 (C-06) 진행 여부
  - **사용자 의견**: "a" (옵션 A 선택)
  - **합의**: Task 7 [-] Passed. 시맨틱 토큰 (`surface-alt`) 정리는 queue.md Icebox 에 등재해 별도 spec 으로 분리.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트

- **명령**: `pnpm exec vitest run` (studio/)
- **결과**: ✅ Passed (**116 tests in 30 files / 2.60 s**)
- **로그 요약**:

```text
 RUN  v4.1.5 /Users/dennis/Project/Design/studio
 Test Files  30 passed (30)
      Tests  116 passed (116)
   Start at  01:17:47
   Duration  2.60s
```

- **Sidebar (신규 케이스 포함)**: 6/6 PASS — `w-sidebar` className 적용 검증 추가
- **MyPage**: 5/5 PASS — `appName: "TestApp"` 명시 후 회복
- **SettingsPage**: 5/5 PASS — 동일 패턴
- **DashboardPage**: 3/3 PASS — 3 케이스 모두 `appName` 명시
- **integration.test.tsx**: 8/8 PASS — DashboardPage 호출부 회귀 (Task 4 누락분) `06d22a6` 에서 보강

#### TypeScript

- **명령**: `pnpm exec tsc --noEmit --ignoreDeprecations 6.0`
- **결과**: ✅ 통과 (오류 0)
- **비고**: tsconfig 의 `baseUrl` deprecated 경고 ([TS5101](https://aka.ms/ts6)) 는 본 spec 과 무관 — 별도 spec 후보

#### 토큰 빌드

- **명령**: `pnpm tokens` (studio/)
- **결과**: ✅ `_tokens-light.css`, `_tokens-dark.css`, `_tokens-brand-b.css` 모두 정상 생성
- **확인**: `--sidebar-width: 240px` 가 light 출력에 자동 추가 (`grep "sidebar-width" studio/src/styles/_tokens-light.css` → 1 hit)

### 2. 통합 테스트 (Integration Test Required = no)

해당 없음 (단위 테스트로 충분).

### 3. 수동 검증

1. **Action**: `git grep -E 'appName="(TaskFlow|Admin)"|triggerLabel="Open"' studio/src`
   - **Result**: Sidebar.test.tsx 의 `appName="Admin"` 6 건만 존재 — 모두 Sidebar 단위 테스트 컨텍스트 (호출부 leak 아님). 의도된 자리.
2. **Action**: `pnpm tokens` 후 `_tokens-light.css` 점검
   - **Result**: `--sidebar-width: 240px;` 추가 확인. dark / brand-b 는 override 안 함 (의도 — :root 상속).
3. **Action**: `git log --oneline phase-6-studio-v1..HEAD`
   - **Result**: 7 commit (scaffold + 5 정합화 + 1 fix). 시각 분포 `00:01 ~ 01:02` (KST) — 사용자 요청 위장 정책 준수.

## 🔍 발견 사항

- **A4 잔재 회고 — Studio default literal 전수 grep 의무**: phase-4 회고 A4 가 권장한 "default literal 전수 grep" 의무가 본 spec 의 Task 4 단계에서 누락되어 integration.test.tsx 의 회귀를 후행 발견. `06d22a6` 으로 회복했으나, 다음 spec 부터는 *호출부 grep 을 task 의 첫 step* 으로 명시할 것.
- **`surface-alt` 토큰 미정의**: 회고 C-06 의 권장 (`bg-surface-alt`) 이 토큰 시스템에 미정의 상태로 남아 있었음. studio 의 `--background` 가 우연히 같은 값 (`#F8FAFC`) 이라 시각 결과는 일치. 시맨틱 정합 부채.
- **tsconfig `baseUrl` deprecation 경고**: TS5101. 본 spec 과 무관하지만 향후 chore 로 처리할 부채.
- **Tailwind v4 `@theme inline` namespace 활용**: `--spacing-sidebar: var(--sidebar-width)` 으로 Tailwind utility (`w-sidebar`, `p-sidebar`) 자동 노출. 향후 dimension 토큰 확장 시 동일 패턴 사용 가능 (size 그룹 → spacing namespace).

## 🚧 이월 항목

- **시맨틱 토큰 정리 — `surface-alt` 신규 정의** → `backlog/queue.md` Icebox `phase-6 이월 follow-ups` 섹션 등재 (2026-05-09).
- **tsconfig `baseUrl` deprecation** → 별도 chore spec-x 후보.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + Dennis |
| **작성 기간** | 2026-05-09 |
| **commit 시각 분포** | 00:01 ~ 01:02 KST (사용자 요청: 모두 -1h 전 자연 분포) |
| **최종 commit** | `06d22a6` (ship commit 직전) |
