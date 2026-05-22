# feat(spec-2-003): Dashboard 템플릿 구현

## 📋 Summary

### 배경 및 목적

phase-2의 세 번째 Page Template. Paper "Dashboard" 아트보드를 참고하여 사이드바 + StatCard + ActivityTable 구조의 DashboardPage를 구현한다.

### 주요 변경 사항

- [x] `DashboardPageTexts` 타입 확장 + `StatCardData`, `ActivityRowData` 데이터 타입
- [x] Composite 4종: Sidebar, DashboardHeader, StatCard, ActivityTable
- [x] DashboardPage 템플릿 (사이드바 레이아웃)
- [x] i18n 확장: dashboard nav/activity 텍스트 (ko/en)
- [x] `getDashboardPageTexts()` 헬퍼

### Phase 컨텍스트

- **Phase**: `phase-2` (Page Template 시스템)
- **역할**: 3번째 Page Template. Auth(카드 레이아웃)과 다른 사이드바 레이아웃 패턴 검증

## 🎯 Key Review Points

1. **사이드바 레이아웃**: VariantWrapper를 사용하지 않고 직접 CSS Grid 구성 — Dashboard는 카드 중앙 배치가 아님
2. **StatCard**: Paper 디자인의 라벨 + 큰 숫자 + 변동률 패턴 구현
3. **ActivityTable**: HTML table 직접 구현 (shadcn Table 컴포넌트 미사용)

## 🧪 Verification

- ✅ 전체 테스트 27/27 PASS
- ✅ `pnpm build` 성공

## 📦 Files Changed

### 🆕 New Files
- `studio/src/components/composites/Sidebar/index.tsx`
- `studio/src/components/composites/DashboardHeader/index.tsx`
- `studio/src/components/composites/StatCard/index.tsx`
- `studio/src/components/composites/ActivityTable/index.tsx`
- `studio/src/components/templates/DashboardPage/index.tsx`
- `studio/src/components/templates/DashboardPage/DashboardPage.test.tsx`

### 🛠 Modified Files
- `studio/src/components/templates/types.ts`: DashboardPageTexts 확장 + 데이터 타입
- `studio/src/components/templates/types.test.ts`: 확장 타입 테스트
- `studio/src/components/templates/index.ts`: DashboardPage re-export
- `studio/src/components/composites/index.ts`: 4종 re-export 추가
- `studio/src/i18n/ko.json`, `en.json`: dashboard 섹션 확장
- `studio/src/lib/i18n.ts`, `i18n.test.ts`: dashboard 헬퍼

**Total**: 14 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (27/27)
- [x] `walkthrough.md` archive commit 완료
- [x] `pr_description.md` archive commit 완료
- [x] lint / type check 통과
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-2.md`
- Walkthrough: `specs/spec-2-003-dashboard-template/walkthrough.md`
