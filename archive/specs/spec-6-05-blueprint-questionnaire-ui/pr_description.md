# feat(spec-6-05): Blueprint 질의서 위저드 UI 구현

## 📋 Summary

### 배경 및 목적

Studio 의 `#/blueprint` 화면이 placeholder stub 상태였습니다. `schema/blueprint-protocol.md` 에 정의된 3+1 단계 질의 프로토콜(Step 1 앱유형 → Step 1.5 NFR → Step 2 페이지구성 → Step 3 variant/섹션)을 완전한 웹 위저드 UI로 구현하여, 사용자가 CLI 없이 Studio 에서 직접 새 앱을 기획하고 REQUIREMENTS.md 초안을 생성/다운로드할 수 있게 합니다.

### 주요 변경 사항

- [x] **BlueprintWizard**: 5단계 위저드 오케스트레이터. 단계 전환/유효성 검사, stepper 헤더
- [x] **types.ts**: `BlueprintSession` / `NfrConfig` / `PageSelection` 등 protocol YAML 스키마와 1:1 대응 TypeScript 타입
- [x] **catalog.ts**: `page-catalog.md` 18개 페이지 + 6종 앱유형별 추천 세트를 TS 상수로 정적 임베드
- [x] **generator.ts**: `BlueprintSession → REQUIREMENTS.md` 마크다운 변환 순수 함수 (단위 테스트 7개)
- [x] **Step1AppType**: 6종 앱유형 카드 선택 UI
- [x] **Step15Nfr**: 6 카테고리 NFR 체크리스트, 기본값 pre-fill, 자체 컴포넌트 dogfooding
- [x] **Step2Pages**: 추천 페이지 필수/권장/선택 badge + 카탈로그 전체 목록 패널
- [x] **Step3Variants**: 페이지별 variant radio + 선택 섹션 Switch, 일괄 기본값 적용
- [x] **OutputPreview**: REQUIREMENTS.md 미리보기 + Blob 다운로드 버튼
- [x] **index.tsx stub 교체**: 실제 위저드 export로 대체
- [x] **app-smoke 테스트 갱신**: stub 기대값 → 위저드 렌더 기대값으로 업데이트

### Phase 컨텍스트
- **Phase**: `phase-6` (Studio v1)
- **본 SPEC 의 역할**: Track A 핵심 — Blueprint 질의서 UI. spec-6-03 의 protocol 정합화를 실제 UI로 구현. spec-6-06 (DESIGN.md 편집기) 의 전제.

## 🎯 Key Review Points

1. **generator.ts — 순수 함수 설계**: 부수효과 없이 `BlueprintSession → string` 변환. 단위 테스트 100% 통과. blueprint-protocol.md §Output 매핑 규칙 준수 여부 확인.
2. **catalog.ts — 추천 세트 완성도**: 6종 앱유형 × 추천 페이지 조합이 `page-catalog.md` 와 일치하는지, `getRecommendedPages()` 의 auto-derive 로직(route/layout) 이 F-03 규칙을 따르는지.
3. **dogfooding 비율**: `Card` / `Button` / `Switch` 자체 컴포넌트만 사용, 외부 UI 라이브러리 없음.

## 🧪 Verification

### 자동 테스트
```bash
pnpm --filter studio test
```

**결과 요약**:
- ✅ `generateRequirements — appName 이 헤더에 포함된다`: 통과
- ✅ `generateRequirements — appType 이 메타 표에 포함된다`: 통과
- ✅ `generateRequirements — 선택된 페이지가 각각 섹션으로 포함된다`: 통과
- ✅ `generateRequirements — Template 매핑 표가 포함된다`: 통과
- ✅ `generateRequirements — pageCount 가 selectedPages.length 와 일치한다`: 통과
- ✅ `generateRequirements — NFR 인증 정보가 포함된다`: 통과
- ✅ `generateRequirements — implemented 페이지는 체크 표시가 붙는다`: 통과
- ✅ `App smoke — default route → BlueprintWizard 렌더`: 통과
- ✅ 전체 39 test files, 223 tests PASS

### 빌드
```bash
pnpm --filter studio run build
```
✅ tsc 타입 체크 + vite build 통과 (336.82 kB gzip 106.50 kB)

### 수동 검증 시나리오
1. **#/blueprint 접근** → Step 1 앱유형 카드 6종 표시, stepper 헤더 노출
2. **SaaS 선택 + 앱 이름 입력 → 다음** → Step 1.5 NFR 체크리스트 기본값 pre-fill
3. **NFR 확인 → 다음** → Step 2 SaaS 추천 페이지 8개 목록
4. **페이지 추가/제거 → 다음** → Step 3 variant/섹션 테이블
5. **결과 보기** → OutputPreview REQUIREMENTS.md 미리보기 + 다운로드 버튼

## 📦 Files Changed

### 🆕 New Files
- `studio/src/features/blueprint/types.ts`: BlueprintSession 등 타입 정의
- `studio/src/features/blueprint/catalog.ts`: 페이지 카탈로그 + 앱유형별 추천 세트 상수
- `studio/src/features/blueprint/generator.ts`: REQUIREMENTS.md 생성 순수 함수
- `studio/src/features/blueprint/BlueprintWizard.tsx`: 5단계 위저드 오케스트레이터
- `studio/src/features/blueprint/OutputPreview.tsx`: 미리보기 + 다운로드
- `studio/src/features/blueprint/steps/Step1AppType.tsx`
- `studio/src/features/blueprint/steps/Step15Nfr.tsx`
- `studio/src/features/blueprint/steps/Step2Pages.tsx`
- `studio/src/features/blueprint/steps/Step3Variants.tsx`
- `studio/src/features/blueprint/__tests__/generator.test.ts`
- `specs/spec-6-05-blueprint-questionnaire-ui/` (spec artifacts)

### 🛠 Modified Files
- `studio/src/features/blueprint/index.tsx`: stub → BlueprintWizard export
- `studio/src/__tests__/app-smoke.test.tsx`: stub 기대값 → 위저드 기대값 갱신

**Total**: 13 files changed, 1267 insertions(+), 20 deletions(-)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (39 files, 223 tests)
- [x] 빌드 통과 (tsc + vite)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-6.md`
- Walkthrough: `specs/spec-6-05-blueprint-questionnaire-ui/walkthrough.md`
- 프로토콜: `schema/blueprint-protocol.md`
- 카탈로그: `schema/page-catalog.md`
