# Implementation Plan: spec-7-03

## 📋 Branch Strategy

- 신규 브랜치: `spec-7-03-spec-to-paper`
- 시작 지점: `phase-7-design-md` (phase base)

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **시각 round-trip 우선** — 회고 C1 (Paper ↔ React 정합 미검증) 해소를 *최우선* 목표로 둠. 단위 테스트보다 Studio UI + 실 Paper 송신 검증 가치가 큼.
> - [ ] **Tailwind 처리 = play CDN** — phase-7 MVP 는 정확도 보단 *눈으로 확인 가능* 우선. 정밀한 PostCSS 통합은 phase-8 후보.
> - [ ] **i18n 기본 = ko** — 모든 fixture 의 placeholder 가 정의된 ko bundle 1 개만. en/ja 는 추후.
> - [ ] **컴포넌트 → React SSR** — composites/templates 가 이미 React. 따로 HTML 템플릿 작성하지 않고 *React component 를 진실 원천* 으로 ReactDOMServer.renderToString 사용.
> - [ ] **방향성 검토** — 본 접근이 spec-7-04 (React compiler) 와 잘 맞물리는지 (예: 동일 component 매핑 테이블 공유 가능?).

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```
[입력]
  spec/<page>.spec.md          (디자이너가 작성)
  studio/src/i18n/ko.json      (placeholder 사전)
  assets/tokens/tokens.json    (DTCG)
  studio/src/components/       (React composites/templates — 진실 원천)

[컴파일 — 본 spec]
  spec-md/parser.parse(text)
    → Document AST
  
  spec-md-compiler/paper/compile(ast, options)
    │
    ├── resolveI18n(ast, bundle)        — placeholder 사전 치환
    ├── buildReactTree(ast, registry)   — AST → React.createElement(...)
    ├── renderToString(tree)            — ReactDOMServer.renderToString
    ├── resolveTokens(tokens.json)      — paper-sync.resolveSemanticColors
    └── pageWrapper(html, css, ...)     — paper-e2e
    
  → HtmlPayload { html, css, payload }

[출력]
  Studio Preview Panel  (fixture select → 좌 React / 우 Paper-html iframe)
  CLI spec-paper <file>  (stdout 또는 --output)
  Paper MCP write_html  (사용자가 결과 paste, 또는 에이전트가 직접 호출)
```

### 컴포넌트 매핑 전략

```typescript
// studio/src/lib/spec-md-compiler/paper/component-registry.ts
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/composites/login-form";
import { LoginPage } from "@/components/templates/login-page";
// ... 28 컴포넌트 모두

export const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  Button, LoginForm, LoginPage, /* ... */
};
```

이 레지스트리는 spec-7-04 (React compiler) 도 *동일하게* 사용 가능 → DRY.

### i18n 번들 전략

```json
// studio/src/i18n/ko.json
{
  "ko": {
    "action": { "login": "로그인", "signup": "회원가입", "submit": "확인", "confirm": "확인" },
    "login": {
      "email-placeholder": "이메일 입력",
      "password-placeholder": "비밀번호 입력"
    },
    "signup": { ... },
    "error": { "not-found": "페이지를 찾을 수 없습니다", "generic": "오류가 발생했습니다" },
    "my-page": { "bio-placeholder": "자기소개" },
    "profile": { "bio": "자기소개" }
  }
}
```

placeholder 의 path 는 ko 부터 시작 — `{{i18n.ko.action.login}}` → bundle["ko"]["action"]["login"]. 누락 키는 *빨간 background span* 으로 표시.

### Token 해소 전략

paper-sync 의 `resolveSemanticColors(tokens.json)` 가 이미 `{ "--primary": "oklch(...)", ... }` 레코드를 만든다. 이 레코드를 inline `<style>:root { --primary: ...; }</style>` 로 페이지 wrapper 에 주입. spec.md 안의 `{{token.semantic.color.light.primary}}` 는 → `var(--primary)` 변환.

`tokens={...}` (L4 인라인 토큰 override) 는 컴포넌트의 wrapper `<div style="--primary: ...; --bg: ...;">` 로 감싸서 적용. CSS cascade 가 자동으로 작동.

### 라이브러리 위치

```
studio/src/lib/spec-md-compiler/
├── paper/
│   ├── compile.ts               — 공용 API: compileToPaper(input, options)
│   ├── component-registry.ts    — name → React.ComponentType 매핑 (28 컴포넌트)
│   ├── i18n-resolver.ts         — placeholder 치환 + 누락 표시
│   ├── token-resolver.ts        — token reference → CSS var
│   ├── react-builder.ts         — AST → React.createElement
│   ├── ssr-render.ts            — renderToString + Tailwind injection
│   ├── page-wrapper.ts          — paper-e2e 의 pageWrapper 활용
│   └── __tests__/
│       ├── i18n-resolver.test.ts
│       ├── token-resolver.test.ts
│       ├── react-builder.test.ts
│       └── compile-fixtures.test.ts  — 28 fixture 회귀
├── shared/
│   └── ast-walker.ts            — spec-7-04 와 공유 가능한 AST walker
└── cli/
    └── spec-paper.ts            — CLI entry

studio/src/i18n/
└── ko.json

studio/src/components/preview/
└── PaperPreviewPanel.tsx         — fixture 선택 + 좌/우 split (React vs Paper)
```

### Studio UI Preview Panel — sketch

```
┌────────────────────────────────────────────────────────────────┐
│ Paper Preview                                                  │
├────────────────────────────────────────────────────────────────┤
│ Fixture: [login-page.spec.md ▾]   Theme: [light ▾]            │
│                                                                │
│   ┌──────────────────────────┬──────────────────────────┐     │
│   │  React                   │  Paper-compiled HTML     │     │
│   │  (실제 컴포넌트)          │  (iframe srcDoc)         │     │
│   │                          │                          │     │
│   │  [LoginForm 렌더]        │  [동일 시각]             │     │
│   │                          │                          │     │
│   └──────────────────────────┴──────────────────────────┘     │
│                                                                │
│ [📋 Copy Paper HTML]  [📤 Send to Paper (Claude Code)]        │
└────────────────────────────────────────────────────────────────┘
```

### 시각 정합 검증 (회고 C1 해소)

3 시나리오:
1. **DOM 등가 스냅샷** — React 측 mount 후 outerHTML vs Paper-compiled HTML — 핵심 클래스 + 데이터 속성 비교 (인라인 style 은 제외)
2. **시각 스냅샷** — `vitest-image-snapshot` 으로 화면 캡처 (fail-soft, 회귀 추적)
3. **사용자 / 에이전트 수동 검증** — LoginPage 의 Paper write_html 호출 후 get_screenshot → 시각 비교

본 spec 의 DoD 는 #1 + #3 (자동 #1, 수동 #3 1 회).

## 📂 Proposed Changes

### [NEW] `studio/src/lib/spec-md-compiler/paper/`

전체 컴파일러 + tests.

### [NEW] `studio/src/i18n/ko.json`

28 fixture placeholder 키 모두 채움. 누락 시 회귀 fail.

### [NEW] `studio/src/components/preview/PaperPreviewPanel.tsx`

fixture 선택 + split view + Send-to-Paper 버튼.

### [MODIFIED] `studio/src/lib/paper-e2e/render-helpers.ts`

COMPOSITES / TEMPLATES 빈 레지스트리를 spec-md-compiler 의 `compileToPaper` 결과로 채울 수 있게 helper 추가 (또는 기존 빈 레지스트리 deprecate).

### [MODIFIED] `studio/package.json`

scripts.spec-paper = `tsx src/lib/spec-md-compiler/cli/spec-paper.ts`.

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) Paper write_html 1 회 실 송신 검증 — DoD 핵심
- [ ] (실행 후) walkthrough.md / pr_description.md ship
- [ ] (실행 후) main PR (spec → phase-7-design-md)
