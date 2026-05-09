# Task List: spec-6-10

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + render-helpers 스캐폴드

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-6-10-fresh-page-e2e`

### 1-2. render-helpers 스캐폴드
- [x] `studio/src/lib/paper-e2e/render-helpers.ts` 신규 (scripts/ 대신 src/lib/ 로 위치 — paper-sync 와 동일 레이어, C2 더 명확히 해소)
- [x] paper-sync 의 resolveSemanticColors 를 import 해서 light scheme CSS vars 객체 생성
- [x] simple tokens (radius / sidebar-width / font) 별도 추출
- [x] cssVarsBlock 헬퍼 + pageWrapper HTML 래퍼
- [x] COMPOSITES / TEMPLATES 빈 레지스트리 (Task 2~4 에서 채움)
- [x] 12 단위 테스트 PASS (studio 전체 278/278)
- [x] Commit: `feat(spec-6-10): add render-helpers scaffold using paper-sync resolver`

---

## Task 2: Composites 아트보드 — 1차 그룹 (10 컴포넌트)

- [x] Paper 새 아트보드 생성 "Phase-6 E2E — Composites" (id `1PJ-0`)
- [x] write_html 으로 다음 10 개 렌더 (각 노드 ID 는 walkthrough 부록 참조):
  - ErrorIcon, HomeButton, BrandHeader, ErrorMessage, StatCard, AvatarUpload, SocialAuthBlock, SettingsHeader, SettingsGroup, SettingsToggleRow
- [-] render-helpers 의 COMPOSITES 레지스트리 채우기 — **deferred**: HTML 을 .ts 로 옮기면 ~400 lines 추가 비용. Paper 노드 ID 가 source of truth 이고, 본 spec 의 핵심 deliverable 은 *findings.md* 이므로 레지스트리 채우기는 phase-7 spec-x 후보. (`feedback_relative_paths.md` 등 메모리는 backlog 추가.)
- [x] Commit: `feat(spec-6-10): render 10 simple composites to paper artboard`

---

## Task 3: Composites 아트보드 — 2차 그룹 (10 컴포넌트)

- [x] write_html 추가 10 개 (1PJ-0 아트보드에 누적):
  - SettingsSelectRow, SettingsSliderRow, DashboardHeader, ProfileHeader, ProfileInfoCard, ActivitySummary, ActivityTable, LoginForm, SignupForm, Sidebar
- [x] 아트보드 height: fit-content 로 전환 (전체 컨텐츠 표시)
- [x] Commit: `feat(spec-6-10): render 10 complex composites to paper artboard`

---

## Task 4: Templates 아트보드 (6 페이지)

- [x] Paper 새 아트보드 "Phase-6 E2E — Templates" (id `1VW-0`)
- [x] write_html 으로 6 페이지 렌더 (composite 들을 조합한 페이지 단위):
  - LoginPage (page variant — split screen), SignupPage, DashboardPage (sidebar+header+stats+activity), MyPage, SettingsPage, ErrorPage (404)
- [x] Commit: `feat(spec-6-10): render 6 templates to paper artboard`

---

## Task 5: React 측 캡처 + 시각 비교

- [ ] `pnpm --filter studio dev` 백그라운드 실행
- [ ] Studio playground/template 라우트 또는 임시 비교 페이지에서 26 컴포넌트 React 렌더
- [ ] 각 컴포넌트 React vs Paper get_screenshot 사람 눈 비교
- [ ] (코드 변경 없는 분석 단계 — 본 task 는 commit 없음. Task 6 의 findings.md 작성 시 통합 commit)

---

## Task 6: findings.md 작성

- [ ] `specs/spec-6-10-fresh-page-e2e/findings.md` 작성
- [ ] 26 컴포넌트 각각 ✓ / ⚠️ / ❌ 분류 + 증거
- [ ] 요약 통계 + 발견 항목 분류 (token-level / component-level / 시스템적)
- [ ] backlog/queue.md Icebox 에 component-level / 시스템적 이월 항목 등재
- [ ] Commit: `docs(spec-6-10): add findings report and backlog spillover`

---

## Task 7: (조건부) 발견된 단순 drift 수정

- [ ] findings 가 token-level 단순 drift 도출 시 tokens.json 수정 + token CSS 재빌드
- [ ] findings 가 component-level 단순 fix 도출 시 해당 파일 수정
- [ ] `pnpm --filter studio test` PASS 유지
- [ ] Commit: `fix(spec-6-10): apply simple drifts found in fresh-page e2e` (수정 없으면 skip)

---

## Task 8: Ship

- [ ] `pnpm --filter studio run build` 성공
- [ ] `pnpm --filter studio test` 전체 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit + Push + PR 생성**
- [ ] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 (Task 7 조건부) |
| **예상 commit 수** | 6~7 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-09 |
