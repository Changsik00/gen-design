# Walkthrough: spec-6-07 — 토큰 편집기 + 미리보기

## 실행 로그

### Task 1: 브랜치 + TDD Red

```
git checkout -b spec-6-07-tokens
```

`types.ts` — `EditableTokens` 인터페이스 (16개 필드: color 13 + radius 1 + font 2) + `DEFAULT_TOKENS`.

`utils.test.ts` — 12개 테스트 (Red):
- `toCssVars`: primary → `--primary`, camelCase → kebab-case 변환, 16개 키 생성, 커스텀 값 반영
- `generateCssOutput`: `:root { ... }` 블록, 모든 변수 포함

```
Test Files  1 failed (utils.test.ts — ../utils 없음)
```

Commit: `test(spec-6-07): add failing utils tests`

---

### Task 2: Utils 구현 (TDD Green)

`utils.ts`:
- `toCssVars(tokens)`: `EditableTokens` → `Record<string, string>` (CSS 변수명으로 매핑)
- `generateCssOutput(tokens)`: `:root { ... }` 형식 CSS 문자열

```
Test Files  41 passed (41)
Tests       244 passed (244)   ← 12 new utils tests
```

Commit: `feat(spec-6-07): implement token types and utils`

---

### Task 3: 편집 섹션 컴포넌트

| 파일 | 핵심 UX |
|---|---|
| `ColorSection.tsx` | 5 그룹(Brand/Surface/Text/UI/Status)별 Card. ColorRow: 색상 칩 + `<input type="color">` + hex 텍스트 Input 양방향 동기화 |
| `RadiusSection.tsx` | `Slider` (0~2rem, step 0.05) + 현재 값 텍스트 + sm/md/lg 배율 프리뷰 박스 |
| `TypographySection.tsx` | fontSans / fontHeading Input + 실시간 폰트 프리뷰 카드 |

dogfooding: `Card` / `Button` / `Input` / `Label` / `Slider` 자체 컴포넌트 사용.

```
Tests  244 passed (244)
```

Commit: `feat(spec-6-07): implement token editor sections`

---

### Task 4: TokenEditor 통합 + index.tsx 교체

`TokenNav.tsx`: Color / Radius / Typography 3탭. 활성 탭 `secondary` 배리언트.

`ComponentPreview.tsx`:
- `toCssVars(tokens)` → div `style` prop 으로 CSS 변수 inline 주입
- Tailwind `bg-primary` 등이 부모 CSS 변수를 상속 → 실시간 반영
- 샘플: Button 5종 + Card + Input + Surface 색상 바
- "초기화" 버튼 → `DEFAULT_TOKENS` 리셋
- "⬇ CSS 다운로드" → `Blob + URL.createObjectURL` → `tokens-custom.css`

`TokenEditor.tsx`: 3열 레이아웃 (TokenNav / 편집섹션 / ComponentPreview). `EditableTokens` state 소유.

`index.tsx` stub 교체 → `<TokenEditor />`

`app-smoke.test.tsx` 갱신:
- `#/tokens`: stub 텍스트 → `getByText("Color")` + `getByText("컴포넌트 미리보기")`

```
Tests  244 passed (244)
```

Commit: `feat(spec-6-07): wire up TokenEditor and replace stub`

---

### 빌드 오류 수정

`RadiusSection.tsx` — Slider `onValueChange` 타입 오류:
- `@base-ui/react/slider` 의 `onValueChange` 가 `number | readonly number[]` 유니언
- `Array.isArray(val)` 분기 + as 캐스트로 수정

```
✓ built in 227ms  (TypeScript 오류 0건)
```

Commit: `fix(spec-6-07): fix Slider onValueChange type in RadiusSection`

---

## 빌드 검증

```
dist/assets/index-CJHYL3lo.js  387.22 kB │ gzip: 121.17 kB
✓ built in 227ms
```

## 최종 테스트

```
Test Files  41 passed (41)
Tests       244 passed (244)
```

## 산출물 목록

| 파일 | 역할 |
|---|---|
| `features/tokens/types.ts` | EditableTokens + DEFAULT_TOKENS |
| `features/tokens/utils.ts` | toCssVars / generateCssOutput 순수 함수 |
| `features/tokens/__tests__/utils.test.ts` | 12개 단위 테스트 |
| `features/tokens/TokenNav.tsx` | Color/Radius/Typography 탭 내비게이션 |
| `features/tokens/ComponentPreview.tsx` | CSS vars 주입 실시간 미리보기 + 다운로드 |
| `features/tokens/TokenEditor.tsx` | 3열 레이아웃 오케스트레이터 |
| `features/tokens/sections/ColorSection.tsx` | 13개 색상 피커 (5그룹) |
| `features/tokens/sections/RadiusSection.tsx` | 슬라이더 + radius 프리뷰 |
| `features/tokens/sections/TypographySection.tsx` | 폰트 패밀리 입력 + 프리뷰 |
| `features/tokens/index.tsx` | stub → TokenEditor export |
| `src/__tests__/app-smoke.test.tsx` | #/tokens 테스트 갱신 |
