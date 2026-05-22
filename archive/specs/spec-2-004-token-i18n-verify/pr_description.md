# feat(spec-2-004): 토큰/i18n 교체 검증 + Paper 디자인 매칭

## 📋 Summary

### 배경 및 목적

phase-2 마지막 Spec. Paper 디자인에서 추출한 토큰으로 tokens.json을 업데이트하고, 브랜드 교체/i18n 교체/variant 전환이 동작하는지 검증한다.

### 주요 변경 사항

- [x] tokens.json: Paper 디자인 값 반영 (indigo primary, slate sidebar, Inter 폰트)
- [x] 브랜드 B 토큰: teal 계열 대체 셋 + 빌드 파이프라인 확장
- [x] LoginPage: split-screen 레이아웃 (Paper "Login" 디자인)
- [x] App 전환 UI: page(login/dashboard) + brand(A/B) + locale(ko/en) + variant(page/modal)

### Phase 컨텍스트

- **Phase**: `phase-2` (Page Template 시스템)
- **역할**: phase-2 최종 검증. 토큰 교체→UI 변경, i18n 교체→텍스트 변경이 실증됨

## 🎯 Key Review Points

1. **tokens.json 값**: Paper에서 추출한 #6366F1(indigo), #0F172A(slate-900) 등이 올바른지
2. **brand-b 전환**: `.brand-b` CSS 클래스 토글로 테마가 바뀌는 메커니즘
3. **LoginPage split-screen**: 좌측 다크 브랜딩 + 우측 폼 레이아웃

## 🧪 Verification

- ✅ 전체 테스트 28/28 PASS
- ✅ `pnpm build` 성공
- ✅ `pnpm tokens` → 3파일 생성

### 수동 검증 (`pnpm dev`)
1. Brand A → indigo primary, Brand B → teal primary
2. KO → 한국어 텍스트, EN → 영어 텍스트, 레이아웃 유지
3. page → split-screen, modal → Dialog 내부

## 📦 Files Changed

### 🆕 New Files
- `studio/tokens/tokens-brand-b.json`
- `studio/src/styles/_tokens-brand-b.css`

### 🛠 Modified Files
- `studio/tokens/tokens.json`: Paper 토큰 반영
- `studio/tokens/build.mjs`: brand-b 빌드 추가
- `studio/src/index.css`: brand-b import + font 변수
- `studio/src/App.tsx`: 4종 전환 UI
- `studio/src/components/templates/LoginPage/index.tsx`: split-screen
- `studio/src/components/templates/LoginPage/LoginPage.test.tsx`: 테스트 수정
- `studio/src/styles/_tokens-light.css`, `_tokens-dark.css`: 재생성

**Total**: 10 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (28/28)
- [x] `walkthrough.md` archive commit 완료
- [x] `pr_description.md` archive commit 완료
- [x] lint / type check 통과
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-2.md`
- Walkthrough: `specs/spec-2-004-token-i18n-verify/walkthrough.md`
