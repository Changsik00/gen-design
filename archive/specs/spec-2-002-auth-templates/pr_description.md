# feat(spec-2-002): Auth 템플릿 구현 (LoginPage + SignupPage)

## 📋 Summary

### 배경 및 목적

spec-2-001에서 설계한 3계층 아키텍처(Primitive → Composite → Page Template)와 슬롯 인터페이스를 실제로 구현한다. LoginPage와 SignupPage를 shadcn/ui 기반 Composite 컴포넌트로 조합하고, i18n texts prop과 variant(page/modal) 슬롯을 적용한다.

### 주요 변경 사항

- [x] Composite 4종: BrandHeader, LoginForm, SignupForm, SocialAuthBlock
- [x] Page Template 2종: LoginPage, SignupPage (variant + i18n 슬롯 지원)
- [x] VariantWrapper: page(Card 중앙) / modal(Dialog) / bottom-sheet 레이아웃 전환
- [x] i18n 헬퍼: ko.json/en.json → flat texts 변환 (타입 안전)
- [x] App.tsx 교체: 하드코딩 → LoginPage 컴포넌트

### Phase 컨텍스트

- **Phase**: `phase-2` (Page Template 시스템)
- **본 SPEC의 역할**: 3계층 아키텍처의 첫 구현. contract(spec-2-001)을 이행하여 실제 동작하는 Auth 템플릿 제공

## 🎯 Key Review Points

1. **Composite 분리**: LoginForm, SocialAuthBlock 등이 독립적으로 재사용 가능한 단위로 잘 분리되었는지
2. **VariantWrapper**: page/modal/bottom-sheet 전환 메커니즘이 확장 가능한지
3. **i18n 매핑**: JSON 중첩 구조 → flat texts 변환이 깔끔한지

## 🧪 Verification

### 자동 테스트
```bash
cd studio && pnpm exec vitest run
```

**결과 요약** (21/21 PASS):
- ✅ i18n 헬퍼: ko/en 변환 정확성 (6건)
- ✅ LoginPage: 한국어/영어 렌더링 + 링크 (3건)
- ✅ SignupPage: 한국어/영어 렌더링 + 링크 (3건)
- ✅ 타입 테스트: 슬롯 인터페이스 (9건)

## 📦 Files Changed

### 🆕 New Files
- `studio/src/components/composites/BrandHeader/index.tsx`
- `studio/src/components/composites/LoginForm/index.tsx`
- `studio/src/components/composites/SignupForm/index.tsx`
- `studio/src/components/composites/SocialAuthBlock/index.tsx`
- `studio/src/components/templates/VariantWrapper.tsx`
- `studio/src/components/templates/LoginPage/index.tsx`
- `studio/src/components/templates/LoginPage/LoginPage.test.tsx`
- `studio/src/components/templates/SignupPage/index.tsx`
- `studio/src/components/templates/SignupPage/SignupPage.test.tsx`
- `studio/src/lib/i18n.ts` + `i18n.test.ts`
- `studio/vitest.config.ts` + `src/test-setup.ts`

### 🛠 Modified Files
- `studio/src/App.tsx`: 하드코딩 → LoginPage 컴포넌트
- `studio/src/i18n/ko.json`, `en.json`: description 필드 추가
- `studio/src/components/composites/index.ts`: re-export 추가
- `studio/src/components/templates/index.ts`: 컴포넌트 re-export 추가
- `studio/package.json`: testing-library 의존성 추가

**Total**: 18 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (21/21)
- [x] `walkthrough.md` archive commit 완료
- [x] `pr_description.md` archive commit 완료
- [x] lint / type check 통과 (`pnpm build` 성공)
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-2.md`
- Walkthrough: `specs/spec-2-002-auth-templates/walkthrough.md`
- 선행 Spec: `specs/spec-2-001-page-template-arch/` (contract 정의)
