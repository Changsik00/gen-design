# Walkthrough: spec-7-03 — spec.md → Paper compiler

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-03` |
| **Branch** | `spec-7-03-spec-to-paper` |
| **Base** | `phase-7-design-md` |
| **상태** | Ready to ship |
| **소요 commit** | 9 (Task 1-8 + ship) |
| **누적 테스트** | 432 → 477 (+45 신규) |

## 🎯 목표 vs 결과

| 목표 | 결과 |
|---|---|
| spec.md AST → Paper-renderable HTML | ✅ `compileToPaper()` 공용 API |
| 4 layer 어휘 모두 처리 (variant / axis / theme / tokens) | ✅ react-builder 가 props/theme/tokens wrapper 분리 |
| i18n + token placeholder 해소 | ✅ ko 번들 + token CSS var 정규화 |
| paper-e2e/render-helpers 의 빈 레지스트리 채움 | ✅ COMPONENT_REGISTRY 28 컴포넌트 — paper-e2e 의 ALL_TOKENS / pageWrapper 재사용 |
| Studio Preview Panel | ✅ `#/preview` 라우트 + 좌(React) 우(Paper iframe) split |
| CLI spec-paper | ✅ `pnpm spec-paper <file>` |
| 28 fixture 컴파일 회귀 | ✅ 모두 PASS + 결정성 + DOM 등가 스냅샷 3 |
| **회고 C1 해소** (Paper ↔ React 정합 검증) | ⚠️ **부분 해소** — 구조 ✅ / 시각 fidelity ⚠️ (다음 섹션 참조) |

## 🛠️ 결정 기록

### D-1: React 컴포넌트를 정적 markup 으로 export (vs hand-coded HTML)

`studio/src/components/{ui,composites,templates}/` 가 *진실 원천*. 같은 React 컴포넌트를 `react-dom/server` 의 **`renderToStaticMarkup`** 으로 정적 HTML 만 emit.

> **명확화**: "SSR" 이라고 부르기 모호해서 정정 — 본 컴파일러는 hydration-friendly server-side rendering 이 *아니라* **static markup generation** (디자인 도구 export 의 표준 접근). `renderToString` 의 pitfall (Suspense / streaming 미지원) 은 동일하게 적용되지만, *우리 use case 에는 적합* (아래 검증 참조).

근거:
- 단일 진실 원천 — spec.md 의 컴포넌트 어휘 + 실제 React 코드 1:1
- spec-7-04 (React compiler) 와 컴포넌트 레지스트리 재사용 가능 (DRY)
- 컴포넌트 props 를 그대로 사용 → variant / size / theme 가 자동 작동

API 선택 검증:
- 28 컴포넌트 모두 순수 presentational — `useState` / `useEffect` / `Suspense` / async data fetch 0 건.
- React 공식 docs: `renderToStaticMarkup` 은 *static export use case* (이메일 / 디자인 도구) 의 권장 API.
- *향후* 컴포넌트가 Suspense / async 도입 시 → `renderToReadableStream` 으로 마이그레이션 필요. 현재는 불필요.

Trade-off:
- studio 의 컴포넌트가 *데이터-heavy* (texts/profile/notifications 등 복잡한 prop) → fixture 의 spec.md 가 데이터를 안 넘김 → `default-props.ts` 의 mock data merge 가 추가됨
- React 컴포넌트가 client-only API 사용 시 hydration mismatch warning (정적 HTML 만 필요해서 무시)

### D-2: Tailwind play CDN (vs PostCSS 정밀 컴파일)

phase-7 MVP 는 *눈으로 확인 가능* 우선. PostCSS 정밀 통합은 phase-8 후보.

근거: Studio iframe 안에서 Tailwind play CDN 이 정상 작동 — JIT 컴파일로 모든 Tailwind 클래스 해소.

발견 갭 (Task 8): Paper 자체 HTML 렌더러는 Tailwind 미실행 → 클래스 무시. 즉 Studio iframe 미리보기는 정확하지만 Paper 직접 송신 시에는 시각 미스타일. 해결책 (phase-8): Tailwind 정밀 컴파일 → CSS 추출 → `<style>` inline.

### D-3: i18n / token placeholder 해소 정책

- **i18n 누락 키** → 빨간 background sentinel span (`[ko.x.missing]`). 디자이너에게 *시각으로* 누락 알림.
- **token path** → last-segment 만 CSS var 이름으로 사용 (`semantic.color.light.primary` → `var(--primary)`). 단순하지만 catalog 와 일치. paper-sync 의 `:root { ... }` 블록이 매칭값 제공.
- **L4 inline tokens** (`tokens={{ "--x": "{{token.y}}" }}`) → `normalizeInlineTokenString` 가 `var(--y)` 로 정규화 → wrapper `<div style="...">`.

### D-4: default-props 자동 주입

spec.md 는 *시각 구조* 만 선언 — texts/data 같은 복잡한 prop 은 명시 X.
컴파일 시 `default-props.ts` 의 mock data 가 자동 merge → React 컴포넌트가 정상 렌더.

우선순위: spec props > defaults.

향후 확장 (out of scope): spec.md attribute 문법으로 데이터를 declarative 하게 넘기는 패턴.

## 🐛 해결한 이슈

### tsx 의 JSX runtime

studio/tsconfig.json 에는 `jsx` 설정 없고 `tsconfig.app.json` 에만 `"jsx": "react-jsx"` 있다. tsx 는 root tsconfig 를 읽어서 React 컴포넌트 SSR 시 `React is not defined` 던졌다.

해결: `package.json` 의 `spec-paper` 스크립트에 `--tsconfig tsconfig.app.json` 추가.

### Vite glob 의 project root 제한

spec/ 디렉토리가 studio/ 밖에 있어 Vite `import.meta.glob("/../spec/*.spec.md")` 가 작동 안 함.

해결: `scripts/generate-fixtures-index.ts` 가 빌드 단계에서 fixture 들을 inline TS 로 내보냄. `pnpm fixtures:gen` 이 dev/build 의 prerun 으로 자동 호출.

### testing-library 의 multi-render 누수

`PreviewPage` 테스트 두 번째 it 가 첫 번째 it 의 DOM 잔재로 "multiple elements" 에러. `afterEach(cleanup)` 으로 해결.

## 💬 리뷰 피드백 — `renderToString` pitfall 인식

ship 직후 사용자 리뷰: *"renderToString does not support streaming or waiting for data — 이거 확인했어? SSR 이 원천이라고 했는데..."* (https://react.dev/reference/react-dom/server/renderToString 참조)

**처음 표현의 문제**: pr_description.md / walkthrough.md 가 "React SSR" 이라는 모호한 표현 사용 → `renderToString` 의 알려진 pitfall 을 의식하지 않은 것처럼 읽혔다.

**점검 결과**:

| 점검 항목 | 결과 |
|---|---|
| 실제 사용 API | `renderToStaticMarkup` (NOT `renderToString`) — `ssr-render.ts:13` 에 import 명시 |
| `useState` 사용 컴포넌트 | 0 / 28 |
| `useEffect` 사용 컴포넌트 | 0 / 28 |
| `Suspense` 또는 async data | 0 / 28 |
| pitfall 영향 | 없음 |

**왜 `renderToStaticMarkup` 가 옳은 선택인지**:
- React 공식 docs 가 *디자인 도구 export / 이메일 / 정적 HTML 출력* use case 에 **이 API 를 권장**.
- `renderToString` 의 *대안* 으로 (a) 정적 use case → `renderToStaticMarkup`, (b) 동적/스트리밍 → `renderToReadableStream` 둘 모두 제시.
- 본 컴파일러는 (a) 의 정확한 use case (Paper 에 정적 HTML 송신, Studio iframe 정적 미리보기). hydration 없음.

**향후 마이그레이션 트리거**: 컴포넌트가 `Suspense` boundary / `use()` hook / async data fetching 도입 시 → `renderToReadableStream` 으로 교체. 현재는 불필요.

**교훈 (프로세스)**:
- API 이름이 모호한 표현 ("SSR") 은 review 시 잘못된 것을 가정한 것처럼 읽힌다 — *실제 호출하는 함수 이름* 으로 명시.
- ssr-render.ts 의 docstring + walkthrough.md / pr_description.md 모두 명시 + 검증 표 첨부.
- 코드 자체는 정확했음 — 표현만 정정.

**조치**: PR #38 머지 전 `docs(spec-7-03): clarify renderToStaticMarkup (not renderToString)` commit 으로 ssr-render.ts docstring + walkthrough D-1 + pr_description 갱신.

## ⚠️ 회고 C1 부분 해소 (시각 fidelity 갭)

phase-6 회고의 Critical 1: "Paper ↔ React 시각 정합 미검증".

**검증 절차** (Task 8):
1. `compileToPaper(spec/login-page.spec.md)` 의 payload 확보 (7.4KB HTML)
2. `paper.create_artboard` 로 새 artboard (1440×900) 생성
3. `paper.write_html` 로 송신 (메모 + inline-styled form + 갭 노트)
4. `paper.get_screenshot` 으로 시각 캡처
5. Studio dev server (#/preview) 의 React + iframe 비교

**결과**:
- ✅ **구조 round-trip 성공** — Paper 가 form / input / button / 한국어 i18n 텍스트 모두 노드로 정상 생성
- ⚠️ **시각 fidelity 갭** — Paper 자체 HTML 렌더러는 Tailwind JIT 미실행 → `bg-primary` / `flex` 등 무시 → 미스타일

**해석**:
- spec-7-03 의 핵심 약속 (spec.md → 시각화 라우트 작동) 은 *구조 단계* 검증 완료.
- 시각 *완전 일치* 는 Tailwind 정밀 컴파일 추가가 필요 → phase-8 후보.
- Studio iframe 미리보기 (Tailwind play CDN 적용) 는 React 와 시각적으로 거의 동일 — 디자이너 daily 작업에는 충분.

**의미**: C1 의 *완전* 해소는 phase-8 으로 이월. 그러나 spec-7-04 (React compiler) 진행에는 충분한 검증.

## 📂 산출물 요약

```
studio/src/lib/spec-md-compiler/
├── paper/
│   ├── component-registry.ts    — 28 컴포넌트 매핑
│   ├── i18n-resolver.ts          — placeholder + missing sentinel
│   ├── token-resolver.ts         — CSS var 정규화 + paper-sync 통합
│   ├── default-props.ts          — 28 컴포넌트 의 mock data
│   ├── react-builder.ts          — AST → React 트리 (theme/tokens wrapper)
│   ├── ssr-render.ts             — renderToStaticMarkup
│   ├── page-wrapper.ts           — { html (full doc), payload (Paper fragment) }
│   ├── compile.ts                — 공용 API: compileToPaper(input, options)
│   └── __tests__/                — 33 case (registry / resolvers / builder / compile / 28 fixture / snapshots)
└── cli/
    ├── spec-paper.ts             — CLI entry
    └── __tests__/                — 8 case

studio/src/i18n/ko.json           — 13 placeholder 키 (28 fixture 의 모든 i18n)
studio/src/features/preview/      — Studio Preview Panel (좌/우 split + Copy/Send)
  ├── index.tsx
  ├── fixtures.generated.ts       — auto-generated (28 fixture inline)
  └── __tests__/
studio/scripts/generate-fixtures-index.ts  — fixtures.generated.ts 빌더
studio/package.json               — spec-paper / fixtures:gen + dev/build prerun
src/lib/router.ts + App.tsx + StudioLayout.tsx  — #/preview 라우트 추가
```

## ✅ Definition of Done 검증

- [x] `studio/src/lib/spec-md-compiler/paper/` 라이브러리 — `compileToPaper(ast | text | path)`
- [x] `studio/src/i18n/ko.json` — 28 fixture 의 모든 placeholder 키
- [x] paper-e2e/render-helpers 의 ALL_TOKENS / pageWrapper / SIMPLE_TOKENS 재사용 (회고 C2 강화)
- [x] Studio Preview Panel 동작 — fixture 선택 → 좌(React) 우(Paper iframe) 동시
- [x] CLI `pnpm --filter studio spec-paper <file>` (with `--payload` / `--output` / `--no-tailwind`)
- [x] 28 fixture 컴파일 회귀 PASS + 결정성
- [x] DOM 등가 스냅샷 3 fixture (LoginPage / DashboardPage / ErrorPage)
- [x] **Paper MCP 실 송신 1 회 검증** — 구조 round-trip ✅ / 시각 fidelity 갭은 phase-8 로 명문화
- [x] studio 전체 단위 테스트 회귀 0 (432 → 477)
- [x] walkthrough.md / pr_description.md ship + main PR
