# docs(spec-3-01): 페이지 카탈로그 정의

## 📋 Summary

### 배경 및 목적

새 앱을 만들 때 "어떤 페이지가 필요한가?"에 대한 체계적 가이드가 없었다. Phase 2에서 3종의 Page Template을 구현했지만, 전체 페이지 유형의 카탈로그가 없어 Blueprint 질의서나 REQUIREMENTS.md 생성의 기초가 부재했다.

### 주요 변경 사항

- [x] 6개 카테고리(auth, dashboard, profile, content, commerce, common)로 18종 페이지 카탈로그 정의
- [x] 각 페이지에 variant, 필수/선택 섹션(Composite 단위) 명시
- [x] Phase 2 Template 3종(LoginPage, SignupPage, DashboardPage) 매핑 완료
- [x] 앱 유형별(SaaS, E-commerce, Social, Content, Utility) 추천 세트 5종 정의

### Phase 컨텍스트

- **Phase**: `phase-3` (App Blueprint)
- **본 SPEC의 역할**: Blueprint 질의서(spec-3-002)와 산출물 템플릿(spec-3-003)의 기초 데이터 제공

## 🎯 Key Review Points

1. **카테고리 구성**: 6개 카테고리가 주요 앱 유형을 충분히 커버하는지
2. **앱 유형별 추천 세트**: 필수/권장/선택 구분이 실제 앱 기획에 유용한지

## 🧪 Verification

### 수동 검증 시나리오

1. **카테고리 수 확인**: 6개 카테고리 존재 → ✅
2. **페이지 수 확인**: 각 카테고리 2종 이상, 총 18종 → ✅
3. **Template 매핑 확인**: 3종 ✅ 표시, 15종 ⬜ 표시 → ✅

## 📦 Files Changed

### 🆕 New Files

- `schema/page-catalog.md`: 페이지 카탈로그 (6 카테고리, 18 페이지, 5 앱 유형 추천 세트)

**Total**: 1 file changed

## ✅ Definition of Done

- [x] 6개 이상 카테고리, 각 2종 이상 페이지 정의
- [x] 각 페이지에 variant 2개 이상, 필수/선택 섹션 정의
- [x] 기존 Template 3종 매핑 완료
- [x] 앱 유형별 추천 세트 5종 정의
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료

## 🔗 관련 자료

- Phase: `backlog/phase-3.md`
- Walkthrough: `specs/spec-3-01-page-catalog/walkthrough.md`
