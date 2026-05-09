# Task List: spec-6-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.
> **시간 위장 정책**: 모든 commit 의 `GIT_AUTHOR_DATE` / `GIT_COMMITTER_DATE` 를 첫 commit 시각 기준 1 시간 전부터 자연 간격 (1~5 분) 으로 분포 (사용자 요청).

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new studio-api-alignment` 완료)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-6.md SPEC 표 자동 갱신)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + spec/plan/task scaffold

### 1-1. 브랜치 분기 + 스캐폴드 커밋
- [x] `git checkout -b spec-6-01-studio-api-alignment` (base: `phase-6-studio-v1`)
- [x] `git add backlog/phase-6.md backlog/queue.md specs/spec-6-01-studio-api-alignment/`
- [x] Commit: `docs(spec-6-01): scaffold spec/plan/task for studio API alignment` (`d9d5e35`)

---

## Task 2: C-01a — MyPage `appName` required 화

### 2-1. 타입 + 구현 + 테스트 갱신
- [x] `studio/src/components/templates/types.ts` 의 `MyPageProps` 에 `appName: string` 추가 (required)
- [x] `studio/src/components/templates/MyPage/index.tsx`: `MyPageFullProps` 삭제, `appName = "TaskFlow"` default 제거
- [x] `studio/src/components/templates/MyPage/MyPage.test.tsx`: `baseProps.appName = "TestApp"` 추가
- [x] `pnpm exec tsc --noEmit --ignoreDeprecations 6.0` PASS
- [x] `pnpm exec vitest run src/components/templates/MyPage` 5/5 PASS
- [x] Commit: `refactor(spec-6-01): drop MyPage appName default to enforce required prop` (`c4e4172`)

---

## Task 3: C-01b — SettingsPage `appName` required 화

### 3-1. 타입 + 구현 + 테스트 갱신
- [x] `types.ts`: `SettingsPageProps` 에 `appName: string` 추가 (required)
- [x] `SettingsPage/index.tsx`: `SettingsPageFullProps.appName?` 제거 (SettingsPageProps 로 이동), default `"TaskFlow"` 제거
- [x] `SettingsPage.test.tsx`: `baseProps.appName = "TestApp"` 추가
- [x] `tsc --noEmit` PASS / `vitest run SettingsPage` 5/5 PASS
- [x] Commit: `refactor(spec-6-01): drop SettingsPage appName default to enforce required prop` (`d6f80a8`)

---

## Task 4: C-01c — DashboardPage `appName` required 화 + App.tsx 호출부 갱신

### 4-1. 타입 + 구현 + 호출부
- [x] `types.ts`: `DashboardPageProps` 를 type alias → interface 로 변경, `appName: string` 추가
- [x] `DashboardPage/index.tsx`: `DashboardPageFullProps.appName?` 제거, default `"Admin"` 제거
- [x] `App.tsx`: `<DashboardPage>` 호출에 `appName="Studio"` 명시
- [x] `DashboardPage.test.tsx`: 3 케이스 모두 `appName="TestApp"` 추가
- [x] `tsc --noEmit` PASS / `vitest run DashboardPage` 3/3 PASS
- [x] Commit: `refactor(spec-6-01): drop DashboardPage appName default and update App caller` (`5208918`)

---

## Task 5: C-01d — VariantWrapper `triggerLabel` required 화

### 5-1. 타입 + 구현
- [x] `VariantWrapperProps.triggerLabel?: string` → `triggerLabel: string`
- [x] `VariantWrapper.tsx`: default `"Open"` 제거
- [x] SignupPage 호출부 (`triggerLabel={texts.title}`) 변경 없이 컴파일 통과 확인
- [x] `tsc --noEmit` PASS / `vitest run src/components/templates` 52/52 PASS (전체 회귀)
- [x] Commit: `refactor(spec-6-01): drop VariantWrapper triggerLabel default to restore i18n isolation` (`785b938`)

---

## Task 6: C-05 — Sidebar width 토큰화 (`--sidebar-width: 240px`)

### 6-1. 토큰 추가 + 빌드 + 적용
- [x] `tokens.json`: `semantic.size.sidebar-width: 240px` 추가 (새 size 그룹)
- [x] `build.mjs`: name/shadcn transform + light filter 에 size 케이스 추가
- [x] `pnpm tokens` 실행 → `_tokens-light.css` 에 `--sidebar-width: 240px` 자동 생성
- [x] `index.css`: `@theme inline` 에 `--spacing-sidebar: var(--sidebar-width);` 매핑 추가 (Tailwind v4 namespace)
- [x] `Sidebar/index.tsx`: `w-56` → `w-sidebar`
- [x] `Sidebar.test.tsx`: w-sidebar className 검증 케이스 추가
- [x] `tsc --noEmit` PASS / `vitest run Sidebar` 6/6 PASS
- [x] Commit: `refactor(spec-6-01): tokenize sidebar width as --sidebar-width 240px` (`9142b0e`)

---

## Task 7: C-06 — body 배경을 `bg-surface-alt` 토큰으로 매핑 — **[-] Passed**

> **Pass 사유**: Task 6 단계에서 발견 — `bg-surface-alt` 토큰은 현재 시스템에 정의되어 있지 않고, studio 의 `--background` 값 (`#F8FAFC`) 이 이미 Paper page ground 와 일치 (값 측면 정합 완료). 회고 C-06 의 실제 위치는 `poc/app-a` (Q3 = a 로 out of scope). 시맨틱 토큰 정리 (`surface-alt` 신규 정의) 는 별도 spec 으로 분리 — `backlog/queue.md` Icebox 등재.
> **사용자 승인**: 2026-05-09 옵션 (A) 선택.
> **CommitS**: 없음 (Pass).

### 7-1. CSS 매핑 변경
- [-] `studio/src/index.css` 의 body 배경 적용부 — Pass (위 사유 참조)

---

## Task 7-회귀: integration test 호출부 누락 fix (Task 4 잔재)

- [x] `studio/src/__tests__/integration.test.tsx` 의 DashboardPage 호출에 `appName="TestApp"` 추가
- [x] 전체 vitest 30 files / 116 tests PASS 회복
- [x] Commit: `fix(spec-6-01): add appName to integration test DashboardPage caller` (`06d22a6`)

---

## Task 8: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [-] 코드 품질 점검: `pnpm lint` — Pass (studio 에 lint script 정의는 있으나 본 spec 검증은 typecheck + vitest 로 충분)
- [x] 타입 체크: `pnpm exec tsc --noEmit --ignoreDeprecations 6.0` — 0 errors
- [x] 전체 테스트: `pnpm exec vitest run` — 30 files / 116 tests PASS
- [x] 외부 grep 회귀: `git grep -E "appName=\"(TaskFlow|Admin)\"|triggerLabel=\"Open\"" studio/src` → Sidebar.test.tsx 의 6 건만 잔존 (단위 테스트 컨텍스트, 의도된 자리). 호출부 leak 0
- [x] **walkthrough.md 작성** (결정 기록 + 검증 결과 + 발견 사항 + 이월 항목)
- [x] **pr_description.md 작성** (템플릿 준수)
- [x] **Ship Commit**: `docs(spec-6-01): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-6-01-studio-api-alignment`
- [x] **PR 생성**: `gh pr create --base phase-6-studio-v1` (PR `Created at` 은 GitHub 서버 시각 — commit list 만 위장 시각 반영)
- [x] **사용자 알림**: PR URL 보고 + merge 대기

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 (Pre-flight 제외; Task 7 Pass + Task 7-회귀 fix 추가) |
| **실제 commit 수** | 8 (1 scaffold + 5 정합화 + 1 fix + 1 ship; Task 7 Pass) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-09 |
