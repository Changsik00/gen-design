# test(spec-2-005): 테스트 보강 (phase-2 회고 대응)

## 📋 Summary

### 배경 및 목적

phase-2 회고에서 테스트 품질 C등급 — "렌더링되면 통과" 수준. 핵심 기능(variant 전환, brand 교체, i18n 레이아웃)의 자동화 테스트 추가.

### 주요 변경 사항

- [x] Composite 단독 테스트 4종 (StatCard, Sidebar, ActivityTable, DashboardHeader)
- [x] variant 전환 테스트 (page split-screen vs modal Dialog)
- [x] i18n 레이아웃 유지 테스트 (ko/en 동일 DOM 구조)
- [x] 통합 시나리오 3개 자동화 (Auth 렌더링 + 토큰 교체 + variant 전환)
- [x] 테스트 수: 28개 → 61개 (+118%)

### Phase 컨텍스트

- **Phase**: `phase-2` (Page Template 시스템)
- **역할**: 회고 대응. phase-2 Done 조건의 "통합 테스트 전 시나리오 PASS" 충족

## 🧪 Verification

- ✅ 전체 테스트 61/61 PASS
- ✅ `pnpm build` 성공

## 📦 Files Changed (7 new test files)

- `studio/src/components/composites/StatCard/StatCard.test.tsx`
- `studio/src/components/composites/Sidebar/Sidebar.test.tsx`
- `studio/src/components/composites/ActivityTable/ActivityTable.test.tsx`
- `studio/src/components/composites/DashboardHeader/DashboardHeader.test.tsx`
- `studio/src/components/templates/LoginPage/LoginPage.variant.test.tsx`
- `studio/src/components/templates/LoginPage/LoginPage.i18n.test.tsx`
- `studio/src/__tests__/integration.test.tsx`

**구현 코드 변경 없음** — 테스트만 추가
