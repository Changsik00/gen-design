# Task List: spec-6-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new studio-app-setup`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-6.md SPEC 표 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + scaffold

- [ ] `git checkout -b spec-6-04-studio-app-setup`
- [ ] add scaffold + Commit: `docs(spec-6-04): scaffold spec/plan/task for studio app setup`

---

## Task 2: Hash-based router (`studio/src/lib/router.ts`)

- [ ] `studio/src/lib/router.ts` NEW: `StudioRoute` enum + `ROUTE_PATHS` + `parseHash` + `navigate` + `useCurrentRoute` hook
- [ ] `studio/src/lib/__tests__/router.test.ts`: parseHash 정상 / fallback / playground / unknown → blueprint fallback (~5 case)
- [ ] `tsc --noEmit` PASS / `vitest run router` PASS
- [ ] Commit: `feat(spec-6-04): implement hash-based router with route enum`

---

## Task 3: StudioLayout + 4 페이지 placeholder

- [ ] `studio/src/components/layout/StudioLayout.tsx` NEW — Sidebar (자체 컴포넌트 재사용) + Main 구조
- [ ] `studio/src/features/blueprint/index.tsx` NEW — Coming soon placeholder
- [ ] `studio/src/features/editor/index.tsx` NEW — Coming soon
- [ ] `studio/src/features/tokens/index.tsx` NEW — Coming soon
- [ ] `studio/src/features/export/index.tsx` NEW — Coming soon
- [ ] `tsc` PASS
- [ ] Commit: `feat(spec-6-04): add StudioLayout and 4 placeholder feature pages`

---

## Task 4: Sidebar nav 클릭 → router 통합

- [ ] StudioLayout 에서 Sidebar 호출 시 nav 클릭 이벤트 처리 — onNavigate prop 또는 wrapper event delegation
- [ ] StudioLayout 단위 테스트 (smoke): nav 클릭 → hash 변경 / activeIndex 갱신
- [ ] 기존 Sidebar 테스트 (6 case) 회귀 PASS
- [ ] Commit: `feat(spec-6-04): wire sidebar nav clicks to router navigation`

---

## Task 5: Playground 격리 (`#/__playground`)

- [ ] `studio/src/features/playground/index.tsx` NEW — 기존 App.tsx 의 page/brand/locale/variant 토글 + LoginPage / DashboardPage 데모 코드 이동
- [ ] mockStats / mockActivities 도 함께 이동
- [ ] `tsc` PASS
- [ ] Commit: `refactor(spec-6-04): move existing playground demo to hidden #/__playground route`

---

## Task 6: App.tsx 통합

- [ ] `studio/src/App.tsx`: router + StudioLayout + 5 route 분기로 재구성. 기존 토글 / mock 데이터 / LoginPage·DashboardPage import 제거
- [ ] `studio/src/__tests__/integration.test.tsx` 영향 확인 — DashboardPage 직접 호출하던 케이스가 깨지면 playground import 형태로 보강
- [ ] `tsc` PASS / `vitest run` 전수 회귀 PASS
- [ ] Commit: `refactor(spec-6-04): integrate router and layout into App.tsx`

---

## Task 7: `studio/DESIGN.md` skeleton + prefill

- [ ] `studio/DESIGN.md` NEW — 14 섹션 (`schema/design-md-schema.md` 기준) skeleton
- [ ] prefill: §2 Colors (tokens.json semantic.color.light) / §3 Typography (semantic.font) / §4 Spacing / §5 Radius (semantic.radius / size) / §7 Icon (lucide-react) / §10 Page Map (5 route) / §13 Token Map (CSS 변수 매핑)
- [ ] TODO 명시: §1 Visual Theme / §6 Shadow / §8 Motion / §9 State / §11 Page Spec / §12 Composite / §14 i18n
- [ ] Commit: `docs(spec-6-04): add studio DESIGN.md skeleton with token prefill`

---

## Task 8: Smoke test + 회귀

- [ ] `studio/src/__tests__/app-smoke.test.tsx` NEW — App 렌더 + 4 route placeholder 노출 + playground hidden route 동작
- [ ] 전체 vitest run PASS
- [ ] tsc 0 errors
- [ ] Commit: `test(spec-6-04): add app smoke tests for routing and layout`

---

## Task 9: Ship

- [ ] **walkthrough.md** 작성
- [ ] **pr_description.md** 작성
- [ ] **Ship Commit**: `docs(spec-6-04): ship walkthrough and pr description`
- [ ] **Push** + **PR 생성** (target: `phase-6-studio-v1`)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 (Pre-flight 제외) |
| **예상 commit 수** | 9 (1 scaffold + router + layout + sidebar wire + playground + App + DESIGN.md + smoke + ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-09 |
