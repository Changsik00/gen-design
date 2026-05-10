# fix(spec-7-09): React compiler 품질 개선 (C1/C2/C4/C5)

## 📋 Summary

### 배경 및 목적

Phase-7 독립 감사 (Opus) 가 발견한 React compiler 4가지 품질 문제를 수정한다.
determinism 테스트는 PASS 였지만 *결정적으로 잘못된 코드*를 생성하던 상태였음.

### 주요 변경 사항

- [x] **C1** — `deriveComponentName()` 추출: `.spec.md` suffix 올바르게 제거 → `LoginPage.spec` → `LoginPage`
- [x] **C2** — `imports-builder.ts`: `react-i18next` / `@/lib/tokens` import 제거 → 주석 힌트로 대체
- [x] **C4** — `noise-fixtures.test.ts` 추가: 약어/오타/소문자/한글/언더스코어 5개 노이즈 케이스
- [x] **C5** — `tsx-validity.test.ts` 추가: 28 fixture 전체에 대해 유효 식별자 + 금지 import 없음 검증

### Phase 컨텍스트

- **Phase**: `phase-7`
- **본 SPEC 의 역할**: Opus 감사가 지적한 "결정적으로 잘못된 코드를 결정성 테스트 PASS 로 통과" 문제 해결. phase-7 phase-ship 선결 조건 C1/C2/C4/C5 해소.

## 🎯 Key Review Points

1. **`deriveComponentName` (CLI)**: `basename(file).replace(/\.spec\.md$|\.md$/, "")` — 이제 `.spec.md` 와 `.md` 모두 올바르게 제거
2. **`imports-builder` 변경**: i18n/token import 줄 → 주석으로 바뀜 — 생성 코드가 `tsc` 통과 가능한 상태
3. **`noise-fixtures.test.ts`**: self-referential benchmark 의 보완. 실제 디자이너 노이즈 입력에 대한 *미매칭 보장*
4. **`tsx-validity.test.ts`**: 향후 imports-builder 변경 시 regression 방지

## 🧪 Verification

```bash
cd studio && pnpm test  # 99 files, 672 tests PASS

# CLI 수동
pnpm exec tsx src/lib/spec-md-compiler/react/cli/spec-react.ts \
  ../../spec/login-page.spec.md
# → export function LoginPage() { ... }  (no react-i18next, no @/lib/tokens)
```

## 📦 Files Changed

### 🆕 New Files
- `react/cli/__tests__/spec-react-args.test.ts`: CLI identifier 테스트
- `react/__tests__/imports-builder.test.ts`: 업데이트 (스펙 변경 반영)
- `paper-inference/__tests__/noise-fixtures.test.ts`: 노이즈 픽스처 6 case
- `react/__tests__/tsx-validity.test.ts`: TSX 유효성 3 case

### 🛠 Modified Files
- `react/cli/spec-react.ts`: `deriveComponentName` export + 적용
- `react/imports-builder.ts`: 금지 import → 주석 힌트

**Total**: 6 files changed

## ✅ Definition of Done

- [x] `spec-react login-page.spec.md` → `export function LoginPage()` (valid)
- [x] 생성 TSX 에 `react-i18next`, `@/lib/tokens` import 없음
- [x] noise fixture 6 case PASS
- [x] TSX validity 3 case PASS
- [x] 99 files, 672 tests PASS
