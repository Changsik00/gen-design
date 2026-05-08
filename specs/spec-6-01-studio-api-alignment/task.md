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
- [ ] `git checkout -b spec-6-01-studio-api-alignment` (base: `phase-6-studio-v1`)
- [ ] `git add backlog/phase-6.md backlog/queue.md specs/spec-6-01-studio-api-alignment/`
- [ ] Commit: `docs(spec-6-01): scaffold spec/plan/task for studio API alignment`

---

## Task 2: C-01a — MyPage `appName` required 화

### 2-1. 타입 + 구현 + 테스트 갱신
- [ ] `studio/src/components/templates/types.ts` 의 `MyPageProps` (또는 인라인 interface) 에서 `appName?: string` → `appName: string`
- [ ] `studio/src/components/templates/MyPage/index.tsx:23` 의 `appName = "TaskFlow"` → `appName,`
- [ ] `studio/src/components/templates/MyPage/*.test.tsx` 의 prop 호출 케이스 확인 + 필요 시 명시 추가
- [ ] `pnpm typecheck` PASS
- [ ] `pnpm test studio/src/components/templates/MyPage` PASS
- [ ] Commit: `refactor(spec-6-01): drop MyPage appName default to enforce required prop`

---

## Task 3: C-01b — SettingsPage `appName` required 화

### 3-1. 타입 + 구현 + 테스트 갱신
- [ ] `studio/src/components/templates/types.ts` 의 `SettingsPageProps` 갱신
- [ ] `studio/src/components/templates/SettingsPage/index.tsx:34` 의 `appName = "TaskFlow"` → `appName,`
- [ ] 관련 테스트 갱신
- [ ] `pnpm typecheck` PASS / `pnpm test studio/src/components/templates/SettingsPage` PASS
- [ ] Commit: `refactor(spec-6-01): drop SettingsPage appName default to enforce required prop`

---

## Task 4: C-01c — DashboardPage `appName` required 화 + App.tsx 호출부 갱신

### 4-1. 타입 + 구현 + 호출부
- [ ] `studio/src/components/templates/types.ts` 의 `DashboardPageProps` 갱신
- [ ] `studio/src/components/templates/DashboardPage/index.tsx:15` 의 `appName = "Admin"` → `appName,`
- [ ] `studio/src/App.tsx` 의 `<DashboardPage>` 호출에 `appName="Studio"` 추가
- [ ] 관련 테스트 갱신 + `pnpm typecheck` PASS / `pnpm test` PASS
- [ ] Commit: `refactor(spec-6-01): drop DashboardPage appName default and update App caller`

---

## Task 5: C-01d — VariantWrapper `triggerLabel` required 화

### 5-1. 타입 + 구현
- [ ] `VariantWrapperProps.triggerLabel?: string` → `triggerLabel: string`
- [ ] `studio/src/components/templates/VariantWrapper.tsx:20` 의 `triggerLabel = "Open"` → `triggerLabel,`
- [ ] SignupPage 호출부 (이미 `texts.title` 전달) 컴파일 확인
- [ ] 관련 테스트 갱신 + `pnpm typecheck` PASS / `pnpm test` PASS
- [ ] Commit: `refactor(spec-6-01): drop VariantWrapper triggerLabel default to restore i18n isolation`

---

## Task 6: C-05 — Sidebar width 토큰화 (`--sidebar-width: 240px`)

### 6-1. 토큰 추가 + 빌드 + 적용
- [ ] `templates/assets/tokens/tokens.json` 에 `sidebar.width` (240 px, dimension type) 추가 (그룹 위치는 기존 schema 따라 결정)
- [ ] `cd studio && pnpm tokens` 실행 → `studio/src/styles/_tokens-light.css` (및 dark / brand-b) 에 `--sidebar-width` 자동 추가 확인
- [ ] `studio/src/index.css` 의 `@theme inline` 블록에 `--sidebar-width: var(--sidebar-width);` 매핑 추가
- [ ] `studio/src/components/composites/Sidebar/index.tsx` 의 `w-56` → 토큰 기반 utility (예: `w-(--sidebar-width)` 또는 매핑된 `w-sidebar`)
- [ ] `studio/src/components/composites/Sidebar/Sidebar.test.tsx` 에 240 px 너비 검증 케이스 추가
- [ ] `pnpm typecheck` + `pnpm test` PASS
- [ ] Commit: `refactor(spec-6-01): tokenize sidebar width as --sidebar-width 240px`

---

## Task 7: C-06 — body 배경을 `bg-surface-alt` 토큰으로 매핑

### 7-1. CSS 매핑 변경
- [ ] `studio/src/index.css` 의 body 배경 적용부 (`@apply bg-background ...`) → `@apply bg-surface-alt ...`
- [ ] dev 빌드 확인 (`pnpm dev` 후 body 배경이 surface-alt 값으로 렌더 — 수동)
- [ ] 기존 단위 테스트 PASS
- [ ] Commit: `refactor(spec-6-01): map body background to surface-alt token`

---

## Task 8: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `cd studio && pnpm lint` (있다면)
- [ ] 타입 체크: `cd studio && pnpm typecheck`
- [ ] 전체 테스트: `cd studio && pnpm test`
- [ ] 외부 grep 회귀: `git grep -E "appName=\"(TaskFlow|Admin)\"|triggerLabel=\"Open\"" studio/src` → 0 건 (테스트 컨텍스트 제외 또는 의도된 자리만)
- [ ] **walkthrough.md 작성** (각 task 의 변경 / 측정 / 의사결정 기록)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-6-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-6-01-studio-api-alignment`
- [ ] **PR 생성**: `gh pr create --base phase-6-studio-v1` (PR `Created at` 은 GitHub 서버 시각 — 1 시간 전 적용 불가; PR 본문 commit list 만 위장 시각 반영)
- [ ] **사용자 알림**: PR URL 보고 + merge 대기

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 (Pre-flight 제외) |
| **예상 commit 수** | 8 (Task 1 scaffold + Task 2~7 6 정합화 + Task 8 ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-09 |
