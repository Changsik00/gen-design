# feat(spec-6-04): Studio 앱 셋업 (router + layout + DESIGN.md)

> phase-6 의 Track A 첫 spec. Studio 의 본격 앱 구조 시작 — hash router + StudioLayout + 4 페이지 placeholder + 기존 playground 격리 + Studio 자체 DESIGN.md skeleton.

## 📋 Summary

### 배경 및 목적

Track B 3 spec 머지 (`spec-6-01` API 정합화 + `spec-6-02` paper-normalizer + `spec-6-03` Blueprint protocol) 후 Studio 본격 앱 구조 시작. 현재 `App.tsx` 는 컴포넌트 *playground* (page/brand/locale/variant 토글) 였음 — 이를 정식 Studio 앱 (라우팅 / 레이아웃 / 4 기능 페이지 placeholder) 으로 전환.

### 주요 변경 사항

- [x] **Hash-based router** (`studio/src/lib/router.ts` + 6 단위 테스트) — 외부 의존성 0. `StudioRoute` enum / `ROUTE_PATHS` / `parseHash` / `navigate` / `useCurrentRoute` hook.
- [x] **StudioLayout** (`studio/src/components/layout/StudioLayout.tsx`) — 자체 `Sidebar` 컴포넌트 재사용 (dogfooding 시작). Sidebar wrapper 의 capture-phase click → router navigate.
- [x] **4 페이지 placeholder** (`studio/src/features/{blueprint,editor,tokens,export}/`) — "Coming soon — spec-6-0X" + Card UI.
- [x] **Playground 격리** (`studio/src/features/playground/`) — 기존 page/brand/locale/variant 토글 + LoginPage/DashboardPage 데모를 `#/__playground` 숨김 route 로 이동. 보존.
- [x] **App.tsx 통합** (143 → 28 lines) — router + StudioLayout + 5 route 분기. 기존 mock 데이터 / 토글 코드 모두 playground 로 격리.
- [x] **`studio/DESIGN.md`** (236 lines) — 14 섹션 skeleton + 7 섹션 prefill (§2/3/4/5/7/10/13).
- [x] **App smoke tests** (7 case) — default / 4 route / playground / fallback / nav.

### Phase 컨텍스트

- **Phase**: `phase-6` (Studio v1)
- **본 SPEC 의 역할**: Track A 첫 spec. 라우팅 / 레이아웃 / 페이지 자리 정립 → 후속 4 spec (`spec-6-05` Blueprint UI ~ `spec-6-08` Export) 의 본격 구현 토대. dogfooding 비율 (success criteria #4) 측정 시작점.

## 🎯 Key Review Points

1. **외부 router 의존성 0**: hash-based 자체 구현 ~58 lines. 단순 5 route 에 적합. 향후 nested / dynamic params 필요 시 react-router 도입 검토.
2. **Sidebar API 보존**: `composites/Sidebar` 자체는 변경 없음. wrapper event delegation 으로 nav 라우팅 처리 — Sidebar 의 다른 사용자 (Page templates) 에 영향 0.
3. **Playground 격리 (`#/__playground`)**: 숨김 prefix + Sidebar nav 미노출. 기존 `pnpm dev` 사용자는 default `#/blueprint` 노출 → `#/__playground` 직접 진입으로 기존 데모 확인.
4. **`studio/DESIGN.md` skeleton**: 14 섹션 모두 작성, tokens.json / code 추출 가능 영역 (§2 Color / §3 Typography / §4 Component / §5 Layout / §7 Icon / §10 Page Map / §13 Token Mapping) 채움. TODO 7 (§1/6/8/9/11/12/14) 은 후속 spec 누적.
5. **Task 3+4 통합**: StudioLayout 의 wrapper onClick 이 자연스럽게 sidebar wire 포함. 분리 시 의미 없는 중간 commit 발생 회피.
6. **Smoke test 의 `getAllByText`**: Sidebar nav label 과 Page heading 이 동일 텍스트 ("Blueprint" / "Export" 등) — `getByText` 단일 매칭 실패 → `getAllByText().length >= 2` 로 변경. 향후 Sidebar nav 라벨 구체화 후보.

## 🧪 Verification

```bash
cd studio
pnpm exec tsc --noEmit --ignoreDeprecations 6.0   # ✅ 0 errors
pnpm exec vitest run                               # ✅ 38 files / 216 tests PASS
```

**결과 요약**:
- ✅ router 6 case + smoke 7 case = 신규 13
- ✅ 기존 회귀 203 case 모두 유지
- ✅ tsc 0 errors

## 📦 Files Changed

### 🆕 New Files

- `studio/src/lib/router.ts` (58 lines) — hash router
- `studio/src/lib/__tests__/router.test.ts` (38 lines) — 6 case
- `studio/src/components/layout/StudioLayout.tsx` (56 lines)
- `studio/src/features/blueprint/index.tsx`, `editor/`, `tokens/`, `export/` — 4 placeholder
- `studio/src/features/playground/index.tsx` (128 lines) — 기존 데모 격리
- `studio/src/__tests__/app-smoke.test.tsx` (85 lines) — 7 case
- `studio/DESIGN.md` (236 lines) — Studio 자체 design system 명세
- `specs/spec-6-04-studio-app-setup/{spec,plan,task,walkthrough,pr_description}.md`

### 🛠 Modified Files

- `studio/src/App.tsx` (143 → 28 lines, -115) — router + layout + 5 route 분기로 단순화
- `backlog/phase-6.md` / `backlog/queue.md` — sdd auto-update

**Total**: 16 files changed (+1075, -116)

## ✅ Definition of Done

- [x] hash router + 단위 테스트 PASS (6/6)
- [x] StudioLayout (자체 Sidebar 재사용 = dogfooding 시작)
- [x] 4 페이지 placeholder ("Coming soon" + 후속 spec 링크)
- [x] App.tsx 가 router + layout 으로 재구성
- [x] `studio/DESIGN.md` skeleton + prefill §2/3/4/5/7/10/13
- [x] Smoke test 7/7 PASS
- [x] 전체 회귀 216/216 PASS
- [x] walkthrough.md / pr_description.md 작성 + ship commit
- [x] PR 생성 (target: phase-6-studio-v1)

## 🔗 관련 자료

- 회고: `docs/poc-retro.md` (success criteria #4 — dogfooding 비율 시작점)
- 라우터: `studio/src/lib/router.ts`
- 레이아웃: `studio/src/components/layout/StudioLayout.tsx`
- 페이지: `studio/src/features/{blueprint,editor,tokens,export,playground}/`
- DESIGN: `studio/DESIGN.md`
- Walkthrough: `specs/spec-6-04-studio-app-setup/walkthrough.md`
- 이전 spec: `spec-6-03` (Blueprint protocol) — 머지 완료
