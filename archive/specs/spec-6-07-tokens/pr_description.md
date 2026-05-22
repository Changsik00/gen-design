# feat(spec-6-07): 토큰 편집기 + 미리보기 구현

## 요약

`studio/src/features/tokens/` 에 semantic 토큰 시각 편집 UI + 실시간 컴포넌트 미리보기를 구현합니다.
Color / Radius / Typography 3개 카테고리 편집, CSS 변수 inline 주입으로 변경 즉시 미리보기 반영, CSS 파일 다운로드 제공.

## 변경 내용

### 신규 파일

| 파일 | 설명 |
|---|---|
| `features/tokens/types.ts` | `EditableTokens` (16개 필드) + `DEFAULT_TOKENS` |
| `features/tokens/utils.ts` | `toCssVars` / `generateCssOutput` 순수 함수 |
| `features/tokens/__tests__/utils.test.ts` | 12개 단위 테스트 |
| `features/tokens/TokenNav.tsx` | Color / Radius / Typography 탭 |
| `features/tokens/ComponentPreview.tsx` | CSS vars 주입 실시간 미리보기 + CSS 다운로드 |
| `features/tokens/TokenEditor.tsx` | 3열 레이아웃 오케스트레이터 |
| `features/tokens/sections/ColorSection.tsx` | 13개 semantic color 피커 (Brand/Surface/Text/UI/Status 그룹) |
| `features/tokens/sections/RadiusSection.tsx` | 슬라이더 (0~2rem) + radius 배율 프리뷰 |
| `features/tokens/sections/TypographySection.tsx` | fontSans / fontHeading 입력 + 실시간 폰트 프리뷰 |

### 수정 파일

| 파일 | 변경 |
|---|---|
| `features/tokens/index.tsx` | stub Card → `<TokenEditor />` 교체 |
| `src/__tests__/app-smoke.test.tsx` | `#/tokens` 테스트: stub 텍스트 → TokenEditor 기반 기대값 |

## 아키텍처

```
TokensPage
  └── TokenEditor
        ├── [좌] TokenNav — Color / Radius / Typography 탭
        ├── [중] 편집 섹션 — activeCategory 기반 렌더
        └── [우] ComponentPreview — toCssVars(tokens) → div style 주입 → 실시간 반영
```

**CSS 변수 주입 방식**: `<div style={{ '--primary': val, ... }}>` → 자식 Tailwind 클래스(`bg-primary` 등)가 CSS 변수를 cascade 상속 → 라이브러리 없이 실시간 미리보기 구현.

**색상 피커**: HTML native `<input type="color">` — 외부 라이브러리 0.

## 테스트

```
Test Files  41 passed (41)
Tests       244 passed (244)   ← 12 new token utils tests
```

빌드: `✓ built in 227ms` (TypeScript 오류 0건)

## 체크리스트

- [x] 단위 테스트 PASS (244/244)
- [x] TypeScript 빌드 오류 없음
- [x] dogfooding: Card / Button / Input / Label / Slider 자체 컴포넌트 사용
- [x] walkthrough.md 작성
- [x] pr_description.md 작성
