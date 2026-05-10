# plan: spec-7-09 — React compiler 품질 개선

## 📋 Branch Strategy

- 신규 브랜치: `spec-7-09-react-compiler-quality`
- 시작 지점: `phase-7-design-md` (spec-7-08 merge 후)

## 🎯 핵심 전략

각 이슈 독립적 수정. 기존 determinism 테스트는 유지하고 *추가* 검증만 붙임.

### C1 — CLI identifier fix

```ts
// 현재 (broken)
basename(args.file, ".md").split(/[-_]/).map(capitalize).join("")
// "login-page.spec.md" → "login-page.spec" → "LoginPage.spec" (invalid)

// 수정
basename(args.file)
  .replace(/\.spec\.md$|\.md$/, "")  // .spec.md 또는 .md 제거
  .split(/[-_]/)
  .map(capitalize)
  .join("")
// "login-page.spec.md" → "login-page" → "LoginPage" ✓
```

### C2 — imports-builder fix

i18n 사용 시: `react-i18next` 대신 **inline comment** + literal 패턴. 이 프로젝트는 자체 ko.json 번들 사용 (i18next 미설치).

```ts
// 수정: usedI18nKeys 있으면 주석으로 힌트만
if (ctx.usedI18nKeys.size > 0) {
  lines.push("// i18n: replace with your project's t() or useTranslation hook");
}
```

token 사용 시: `@/lib/tokens` 대신 **CSS 변수 reference**

```ts
// 수정: token 참조는 CSS var 패턴 주석
if (ctx.usedTokenKeys.size > 0) {
  lines.push("// tokens: values replaced with CSS variables (e.g. var(--primary))");
}
```

컴포넌트 import: composite/template 컴포넌트도 `@/components/ui/` 가 아닌 `@/components/` 로 올바른 경로 방출. (component-registry.ts 의 `compositeComponents`, `templateComponents` 확인 후 경로 분기)

### C4 — noise-injected 픽스처

benchmark 테스트에 노이즈 입력 5개 추가:

| 픽스처 | 노이즈 유형 | 기대 결과 |
|---|---|---|
| `Btn.primary` | 약어 | fuzzy match → Button.primary, distance=2 |
| `Bton.primary` | 오타 | fuzzy match 또는 unmatched |
| `button.primary` | 소문자 | unmatched (case-sensitive) |
| `로그인버튼` | 한글 레이어명 | unmatched |
| `Button_primary` | underscore | unmatched (dot syntax 외) |

각 노이즈 입력에 대해 `matched === false` 또는 `distance > 0` 를 예상값으로 검증.

### C5 — TSX 유효성 검증

`determinism.test.ts` 옆에 `tsx-validity.test.ts` 추가:
- 28 fixture → compileToReact → tsx 문자열이 `import`/`export` 구문을 포함하는지 최소 검증
- 생성된 식별자가 `/^[A-Za-z_$][A-Za-z0-9_$]*$/` 패턴인지 검증 (실제 tsc 실행 없이 regex로)

## 📂 Proposed Changes

### [MODIFY] `studio/src/lib/spec-md-compiler/react/cli/spec-react.ts`
basename 처리: `.spec.md` suffix 제거

### [MODIFY] `studio/src/lib/spec-md-compiler/react/imports-builder.ts`
- i18n/token import 제거 → 주석으로 대체
- 컴포넌트 import 경로 분기 (ui vs composite/template)

### [NEW] `studio/src/lib/paper-inference/__tests__/noise-fixtures.test.ts`
노이즈 주입 5개 케이스 — unmatched 또는 fuzzy 검증

### [NEW] `studio/src/lib/spec-md-compiler/react/__tests__/tsx-validity.test.ts`
생성 TSX 구문 유효성 검증 (28 fixture)

### [MODIFY] `studio/src/lib/spec-md-compiler/react/__tests__/` 기존 snapshot 갱신
imports-builder 변경으로 snapshot 갱신 필요 가능

## 🧪 검증 계획

```bash
# 전체 테스트
cd studio && pnpm test

# CLI 수동 검증
pnpm exec tsx src/lib/spec-md-compiler/react/cli/spec-react.ts \
  ../../spec/login-page.spec.md
# → "export function LoginPage()" 포함, react-i18next/tokens import 없음
```

## 📦 Deliverables

- [ ] task.md 작성
- [ ] 사용자 Plan Accept (spec-7-08 완료 후)
