# docs(spec-2-001): Page Template 3계층 아키텍처 설계

## 📋 Summary

### 배경 및 목적

shadcn/ui는 Button, Card 같은 Primitive만 제공하고, 페이지 단위 재사용 컴포넌트(LoginPage, DashboardPage)는 없다. 매번 처음부터 페이지를 조립해야 하며, AI가 일관된 구조로 코드를 생성할 가이드도 없다. 이 Spec에서 3계층 아키텍처를 설계하고, 슬롯 인터페이스를 정의하며, Headless UI 선택을 확정한다.

### 주요 변경 사항

- [x] Primitive → Composite → Page Template 3계층 아키텍처 문서 작성 (ARCHITECTURE.md)
- [x] 슬롯 인터페이스 TypeScript 타입 정의 (variant, i18n, base props)
- [x] ADR-003: shadcn/ui(Radix) 확정 결정문 작성
- [x] 타입 안전성 검증 테스트 추가 (vitest, 9건 PASS)

### Phase 컨텍스트

- **Phase**: `phase-2` (Page Template 시스템)
- **본 SPEC의 역할**: phase-2의 기반 설계. 후속 Spec(002 Auth 템플릿, 003 Dashboard, 004 토큰/i18n 검증)이 이 아키텍처 위에서 구현됨

## 🎯 Key Review Points

1. **계층 네이밍 결정**: Atomic Design(Atom/Molecule) 대신 Radix 생태계 용어(Primitive/Composite) 채택 — AI 학습 데이터 일관성 + Molecule/Organism 경계 모호성 해소
2. **슬롯 설계**: 토큰(CSS 변수), i18n(props 주입), variant(union type) — 각각 독립적 교체 가능 메커니즘

## 🧪 Verification

### 자동 테스트
```bash
pnpm exec vitest run src/components/templates/types.test.ts
```

**결과 요약**:
- ✅ `PageTemplateVariant` 유효/무효 variant 검증: 통과
- ✅ `BaseTemplateProps` 필수 prop 검증: 통과
- ✅ `LoginPageProps/SignupPageProps/DashboardPageProps` 텍스트 타입 검증: 통과

### 수동 검증 시나리오
1. `pnpm build` → ✅ 타입 에러 없이 빌드 성공
2. ARCHITECTURE.md 리뷰 → ✅ 3계층 + 슬롯 + AI 규칙 포함

## 📦 Files Changed

### 🆕 New Files
- `studio/src/components/ARCHITECTURE.md`: 3계층 아키텍처 가이드
- `studio/src/components/templates/types.ts`: 슬롯 인터페이스 타입
- `studio/src/components/templates/types.test.ts`: 타입 검증 테스트
- `studio/src/components/templates/index.ts`: 타입 re-export
- `studio/src/components/composites/index.ts`: 빈 re-export 허브
- `docs/decisions/ADR-003-headless-ui-selection.md`: Headless UI 결정문

### 🛠 Modified Files
- `studio/package.json`: vitest 의존성 추가

**Total**: 7 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (9/9)
- [x] `walkthrough.md` archive commit 완료
- [x] `pr_description.md` archive commit 완료
- [x] lint / type check 통과 (`pnpm build` 성공)
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-2.md`
- Walkthrough: `specs/spec-2-001-page-template-arch/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-003-headless-ui-selection.md`
