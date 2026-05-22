# Task List: spec-7-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 컴포넌트 레지스트리 + i18n ko 번들

### 1-1. 브랜치 + 디렉토리
- [x] 브랜치는 이미 생성됨 (`spec-7-03-spec-to-paper`)
- [x] `studio/src/lib/spec-md-compiler/paper/` 디렉토리

### 1-2. 컴포넌트 레지스트리
- [x] `paper/component-registry.ts` — 28 컴포넌트 모두 import + name → ComponentType 매핑
- [x] 단위 테스트: 모든 catalog name 이 레지스트리에 있고 React 컴포넌트인지 (4 case)

### 1-3. i18n ko 번들
- [x] `studio/src/i18n/ko.json` — 13 placeholder 키 (28 fixture 의 모든 i18n placeholder)
- [x] 단위 테스트: bundle 의 모든 dotted path 가 정의되었는지 (fixture 기반 자동 추출 검증)

- [x] Commit: `feat(spec-7-03): component registry + ko i18n bundle`

---

## Task 2: i18n + token resolver

- [x] `paper/i18n-resolver.ts` — `resolveI18n(path, bundle)` → `{ value, missing }` + `I18N_MISSING_STYLE`
- [x] 누락 키 → sentinel `[<path> missing]` + 빨간 background style 상수 (React-builder 가 span 으로 적용)
- [x] `paper/token-resolver.ts` — `tokenPathToCssVar` (path 의 last segment → `var(--xxx)`)
- [x] paper-sync 의 `resolveSemanticColors` 통합 — `rootCssVars()` 가 `:root { ... }` 블록 emit
- [x] L4 인라인 토큰 string 정규화 (`{{token.x}}` 형식 → `var(--x)`)
- [x] 단위 테스트 13 case (i18n 7 + token-path 3 + root-vars 1 + inline-normalize 2)
- [x] Commit: `feat(spec-7-03): i18n + token placeholder resolvers`

---

## Task 3: AST → React 엘리먼트 트리

- [x] `paper/react-builder.ts` — `buildReactTree(doc, options)` → `ReactNode[]`
  - ComponentInstance → `React.createElement(Comp, props, ...children)` — 미등록 시 빨간 sentinel
  - Placeholder kind=i18n → 해소된 string (누락 시 빨간 background span)
  - Placeholder kind=token → `"var(--x)"` string
  - MarkdownText → text node (children 안에서만)
  - Comment → null (skip)
  - L3 theme → wrapper `<div data-theme="brand-a">`
  - L4 tokens → wrapper `<div style={{...}}>` (`{{token.x}}` 정규화)
  - top-level: ComponentInstance 만 출력 (markdown heading/prose 자동 skip)
- [x] 단위 테스트 8 case (single / 미등록 / nested / i18n happy + 누락 / theme / tokens / top-level prose 무시)
- [x] Commit: `feat(spec-7-03): AST → React element tree builder`

---

## Task 4: SSR + page wrapper + 공용 API

- [x] `paper/ssr-render.ts` — `renderToStaticMarkup` (정적 HTML, hydration 메타 X)
- [x] `paper/page-wrapper.ts` — `wrapPage` returns `{ html (full doc + Tailwind CDN), payload (Paper fragment) }`
- [x] `paper/compile.ts` — 공용 API `compileToPaper(input, options)` → `{ html, payload, ast?, errors? }`
- [x] `paper/default-props.ts` — 28 컴포넌트 중 데이터-heavy 컴포넌트 (templates / ActivityTable / Sidebar / StatCard) 의 minimal mock data
- [x] 단위 테스트 7 case (string 입력 / Tailwind 옵션 / CSS vars / file 입력 LoginPage / DashboardPage / parse 실패 fallback)
- [x] Commit: `feat(spec-7-03): SSR render + page wrapper + compileToPaper API`

---

## Task 5: 28 fixture 컴파일 회귀 + 결정성

- [x] `paper/__tests__/compile-fixtures.test.ts` — spec/*.spec.md 28 개 모두 컴파일 + 에러 0
- [x] 결정성: 같은 입력 두 번 → identical HTML (`.html` + `.payload`)
- [x] DOM 등가 스냅샷 3 fixture (LoginPage / DashboardPage / ErrorPage) — `__snapshots__/` 추적
- [x] default-props 보강 — composites 16 개 + templates 7 개 모두 mock data 채움
- [x] Commit: `test(spec-7-03): 28-fixture compilation regression + DOM-eq snapshots`

---

## Task 6: CLI spec-paper

- [x] `cli/spec-paper.ts` — argv parse (file / --payload / --output / --no-tailwind) + compileToPaper
- [x] `studio/package.json` scripts.spec-paper (with `--tsconfig tsconfig.app.json` for JSX runtime)
- [x] 단위 테스트 8 case (parseArgs 5 + runCompile 3 — fragment/full/no-tailwind)
- [x] 수동 검증: `pnpm --filter studio spec-paper <fixture> --output /tmp/x.html` → 7.6KB DOCTYPE + Tailwind + body
- [x] Commit: `feat(spec-7-03): CLI spec-paper entry`

---

## Task 7: Studio UI — Paper Preview Panel

- [x] `studio/src/features/preview/index.tsx` — PreviewPage 컴포넌트 (좌/우 split)
- [x] fixture 드롭다운 (28 fixture 자동 스캔 — `scripts/generate-fixtures-index.ts` 가 inline)
- [x] 좌측: React 측 렌더 (실제 studio 컴포넌트, `buildReactTree` 결과)
- [x] 우측: iframe srcDoc = compileToPaper().html (Tailwind play CDN 포함)
- [x] Copy Paper HTML / Send to Paper 버튼 (clipboard 복사 + 안내 메시지)
- [x] App 라우트 + Sidebar nav 추가 (`/preview`)
- [x] `pnpm fixtures:gen` script + `dev`/`build` 의 prebuild hook
- [x] 단위 테스트 4 case (mount / fixture 갯수 / Copy/Send 버튼 / iframe)
- [x] Commit: `feat(spec-7-03): Studio Paper preview panel (React vs Paper split)`

---

## Task 8: Paper MCP 실 송신 검증 (회고 C1 해소)

- [x] `compileToPaper(spec/login-page.spec.md)` 의 payload 확보 (`/tmp/spec-7-03-login-page-paper.html`, 7.4KB)
- [x] paper.create_artboard 로 새 artboard 생성 (`20K-0`, "spec-7-03 — LoginPage (Paper-compiled)", 1440×900)
- [x] paper.write_html 송신 (메모 + inline-styled login form + 갭 노트)
- [x] paper.get_screenshot → 시각 캡처 (사용자 확인)
- [x] React 화면 + Paper 화면 비교 (Studio dev server `http://localhost:5174/#/preview`)
- [x] **결과**: 구조 round-trip ✅ / 시각 fidelity ⚠️ Tailwind 컴파일 갭 (phase-8 로 명문화)
- [x] 사용자 OK ("계속 진행")
- [x] Commit: `chore(spec-7-03): paper round-trip verification (C1 partially resolved)`

---

## Task 9: Ship

- [x] `pnpm --filter studio run build` 성공 (TypeScript + Vite, peggy eval 경고 inherited)
- [x] `pnpm --filter studio test` 전체 PASS (72 files / 477 tests)
- [x] `pnpm --filter studio spec-paper /Users/.../spec/login-page.spec.md --output /tmp/x.html` 동작 확인
- [x] Studio dev server `http://localhost:5174/#/preview` 동작 확인
- [x] **walkthrough.md 작성** (회고 C1 부분 해소 섹션 + Tailwind 갭 명문화)
- [x] **pr_description.md 작성**
- [x] **Ship Commit + Push + PR 생성** (spec → `phase-7-design-md`)
- [x] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 |
| **예상 commit 수** | 9 |
| **현재 단계** | Ready to ship |
| **마지막 업데이트** | 2026-05-10 |

## 위험 / 주의

- **시각 정합 (회고 C1)** — 본 spec 의 *주된 가치*. Task 8 (Paper MCP 실 송신) 가 핵심. 자동 테스트로는 발견 안 되는 시각 차이 (예: Tailwind play CDN 의 비결정성, font 차이) 를 *눈으로* 확인.
- **ReactDOMServer SSR** — studio 의 컴포넌트가 일부 *클라이언트 only* (예: `useEffect`) 일 가능성. SSR 시 hydration mismatch warning 가능. 정적 HTML 만 필요하므로 mismatch 는 무시 가능.
- **Tailwind play CDN** — 외부 의존, offline 안 됨. 하지만 phase-7 MVP 로 적정. phase-8 에서 PostCSS 통합으로 교체.
- **i18n ko 번들** — 28 fixture 의 placeholder 가 다양해서 누락 시 회귀 fail. *fixture-driven* 으로 자동 추출 후 사용자 확인 권장.
- **컴포넌트 레지스트리 손맵핑** — 28 컴포넌트 import 가 boilerplate. 추후 Vite glob import 로 자동화 가능.
- **Studio Preview iframe** — Tailwind play CDN 가 iframe 안에서도 작동해야. 만약 안 되면 Studio 의 동일 Tailwind 빌드 결과를 inject.
