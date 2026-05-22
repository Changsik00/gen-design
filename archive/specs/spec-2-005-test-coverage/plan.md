# Implementation Plan: spec-2-005

## 📋 Branch Strategy

- 신규 브랜치: `spec-2-005-test-coverage`
- 시작 지점: `main`
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 구현 코드 변경 없음 — 테스트 파일만 추가/수정

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 항목 | 전략 | 이유 |
|:---:|:---|:---|
| **variant 테스트** | DOM 구조 차이로 검증 | page=split-screen(aside 존재), modal=Dialog(dialog role 존재) |
| **brand 테스트** | CSS 변수 값 검증 (getComputedStyle) | jsdom에서 CSS 변수 해석 한계 → 클래스 토글 + DOM 확인으로 대체 |
| **i18n 테스트** | 동일 DOM 구조 + 텍스트 차이 | container.innerHTML 비교는 과잉, 핵심 요소 존재 확인 |
| **Composite 테스트** | 각 컴포넌트 props 주입 → 렌더링 확인 | 독립 사용 가능성 검증 |

## 📂 Proposed Changes

### 테스트 파일만 추가/수정 (구현 코드 변경 없음)

#### [NEW] `studio/src/components/templates/LoginPage/LoginPage.variant.test.tsx`
page↔modal variant 전환 시 DOM 구조 차이 검증

#### [NEW] `studio/src/components/templates/LoginPage/LoginPage.i18n.test.tsx`
ko↔en 전환 시 동일 구조 + 텍스트만 다름 검증

#### [NEW] `studio/src/components/composites/StatCard/StatCard.test.tsx`
StatCard props 주입 → 라벨/값/변동률 렌더링

#### [NEW] `studio/src/components/composites/Sidebar/Sidebar.test.tsx`
Sidebar navItems → 네비게이션 렌더링, active 상태

#### [NEW] `studio/src/components/composites/ActivityTable/ActivityTable.test.tsx`
ActivityTable columns/rows → 테이블 헤더+행 렌더링

#### [NEW] `studio/src/components/composites/DashboardHeader/DashboardHeader.test.tsx`
DashboardHeader title/searchPlaceholder 렌더링

#### [NEW] `studio/src/__tests__/integration.test.tsx`
phase-2 통합 테스트 시나리오 3개: Auth 렌더링, 토큰 교체, variant 전환

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)
```bash
cd studio && pnpm exec vitest run
```

기존 28개 + 신규 전체 PASS

## 🔁 Rollback Plan

- 테스트 파일만 삭제하면 원복

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md archive
