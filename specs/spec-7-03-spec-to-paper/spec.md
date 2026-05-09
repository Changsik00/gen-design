# spec-7-03: spec.md → Paper compiler

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-03` |
| **Phase** | `phase-7` |
| **Branch** | `spec-7-03-spec-to-paper` |
| **상태** | Planning |
| **타입** | Feature (foundation — 디자이너의 메인 루프) |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-10 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-7 의 첫 두 spec 이 완료되어 다음을 보유:
- **spec-7-01**: 어휘 카탈로그 (catalog.json) + spec-schema.json + DTCG tokens.json
- **spec-7-02**: spec.md grammar + parser + lint + 28 fixture (`spec/`)

또한 phase-6 의 자산이 그대로 살아있음:
- `studio/src/components/{ui,composites,templates}/` — 28 React 컴포넌트
- `studio/src/lib/paper-sync/` — `resolveSemanticColors` (tokens.json → CSS vars)
- `studio/src/lib/paper-normalizer/` — 5 정규화 함수 (border / padding / hex-alpha / line-height / font-fallback)
- `studio/src/lib/paper-e2e/render-helpers.ts` — `pageWrapper` (Paper write_html 페이로드 형식)
- spec-6-10 회고 C1: **Paper ↔ React 시각 정합 미검증** (Critical 잔존)

### 문제점

1. **컴파일러 부재**: spec.md AST → 시각 출력의 라우트가 없다. 디자이너가 spec.md 작성 → 파일 저장 → *그 다음* 이 비어있다.
2. **paper-e2e/render-helpers 의 COMPOSITES / TEMPLATES 레지스트리가 빈 스캐폴드**: 핵심 기능 (실제 컴포넌트별 HTML 렌더) 미구현.
3. **시각 round-trip 검증 부재**: 회고 C1 — Paper 가 React 와 정확히 같은 모양인지 비교한 적 없다. spec-7-03 의 PaperFromSpec ↔ React 가 일치해야 본 시스템의 핵심 약속이 성립.
4. **Studio UI 부재**: 디자이너가 *spec.md 입력 → Paper 시각화* 를 자기 작업 흐름에서 직접 시도할 진입점 없음.

### 해결 방안 (요약)

spec.md AST → **React SSR + 토큰 + i18n 해소** → HTML/CSS 페이로드 → (a) Studio 의 미리보기 panel + (b) Paper write_html 직접 송신 가능. 28 fixture 회귀 + React-측 렌더링과 시각 비교 (스냅샷 또는 DOM 등가).

## 📊 개념도

```
[입력] spec/login-page.spec.md
  <LoginPage>
    <BrandHeader />
    <LoginForm>
      {{i18n.ko.login.email-placeholder}}
      <Button variant="default">{{i18n.ko.action.login}}</Button>
    </LoginForm>
  </LoginPage>

[1. parse]   spec-7-02 의 parser → AST
[2. lint]    spec-7-02 의 lint → ParseError[] (중단 없으면 계속)
[3. resolve] i18n + token placeholder 해소 (default 번들 + tokens.json)
[4. render]  AST → React 엘리먼트 트리 → ReactDOMServer.renderToString
[5. wrap]    paper-e2e/pageWrapper (CSS vars + Tailwind play CDN 포함)
[6. emit]    HtmlPayload { html, css, tokens }
                ↓
   ┌──────────────────────┬──────────────────────┐
   ↓                      ↓                      ↓
[Studio preview]    [Paper write_html]     [snapshot test]
 (in-browser iframe) (MCP 직접 송신, 사용자 액션)
```

## 🎯 요구사항

### Functional Requirements

#### FR-1. spec.md → HtmlPayload 변환

- 입력: spec/*.spec.md 파일 경로 또는 AST
- 출력: `{ html: string; css: string; payload: string }` — payload 가 Paper write_html 에 직접 전달 가능
- ComponentInstance.name → studio/src/components 의 실제 React 컴포넌트로 매핑
- props 적용: variant / size / 기타 axis 가 React 컴포넌트의 prop 으로 그대로 전달
- theme: HTML 컨테이너의 `data-theme` 또는 클래스로 적용 (CSS scope)
- tokens: 인라인 CSS 변수 override (`<div style="--primary: ...">`)

#### FR-2. i18n placeholder 해소

- `{{i18n.ko.x.y}}` → 사전 (i18n bundle JSON) 의 ko.x.y 값으로 치환
- 키가 없으면 placeholder 자체를 *빨간 background* 로 시각 표시 (디자이너에게 누락 알림)
- 본 spec 은 *기본 ko 번들* 만 — en/ja 등은 spec-7-04 또는 후속에서

#### FR-3. token placeholder 해소

- `{{token.semantic.color.light.primary}}` → `var(--primary)` (CSS 변수 참조)
- paper-sync 의 `resolveSemanticColors` 결과를 inline `<style>` 의 `:root { ... }` 에 주입
- L4 인라인 토큰 override (`tokens={{ "--primary": "..." }}`) 는 컴포넌트 wrapper 의 inline style 로 적용

#### FR-4. Studio UI — Paper Preview Panel

- studio 의 좌측 영역 (또는 별도 라우트 `/preview`):
  - fixture 드롭다운 (spec/*.spec.md 자동 스캔)
  - **React 측 렌더** (실제 studio 컴포넌트, 좌측)
  - **Paper-compiled 미리보기** (HTML 페이로드, 우측 iframe)
  - "Send to Paper" 버튼 (clipboard 복사 또는 MCP 호출 — 사용자가 Claude Code 에서 paste)
- 회고 C1 해소: React vs Paper 시각 비교가 *클릭 한 번에* 가능

#### FR-5. 28 fixture 회귀 — 컴파일 + 결정성

- 28 fixture 모두 `compileToPaper(ast)` 호출 시 에러 없음
- 같은 입력 → 같은 HTML (deterministic — i18n 키 정렬 + 토큰 정렬)
- 스냅샷 테스트로 변경 추적

#### FR-6. CLI: spec-paper

- `pnpm --filter studio spec-paper <file>` — 컴파일된 HTML 을 stdout 출력
- `--output <file>` — 파일로 저장
- 옵션: `--theme brand-a`, `--locale ko`, `--with-tailwind` (default: true)

### Non-Functional Requirements

1. **결정성**: 같은 spec.md + 같은 tokens.json + 같은 i18n bundle → 같은 HTML
2. **시각 정합**: React 측 렌더와 Paper-compiled HTML 의 *DOM 등가성* (배제: 인라인 style ≠ class — 핵심 시각 속성만 비교)
3. **성능**: 28 fixture 컴파일 합산 1 초 미만
4. **부분 컴파일**: parser 에러 시에도 가능한 한 *부분 HTML* 출력 (디자이너 디버깅 용)
5. **외부 의존성**: Tailwind play CDN 사용 (offline preview 는 phase-8 후보)

## 🚫 Out of Scope

- **React compiler** (spec-7-04) — 본 spec 은 *Paper-target* 만
- **Paper → spec.md 추론** (spec-7-06)
- **Figma 어댑터** (spec-7-05)
- **Tailwind 정밀 컴파일** (PostCSS 통합) — 본 spec 은 play CDN
- **i18n 다국어** (en/ja 등) — ko 만
- **모션 / interactivity** — 정적 HTML 만

## ✅ Definition of Done

- [ ] `studio/src/lib/spec-md-compiler/paper/` 라이브러리 — `compileToPaper(ast | text | path)` 공용 API
- [ ] `studio/src/i18n/ko.json` — 28 fixture 의 모든 placeholder 키 채움
- [ ] `paper-e2e/render-helpers.ts` 의 COMPOSITES / TEMPLATES 레지스트리 채움 (또는 동등한 신규 모듈)
- [ ] Studio Preview Panel 동작 — fixture 선택 → 좌(React) 우(Paper preview) 동시 표시
- [ ] CLI `pnpm --filter studio spec-paper <file>`
- [ ] 28 fixture 컴파일 회귀 PASS
- [ ] 시각 정합 검증 — 최소 LoginPage / DashboardPage / ErrorPage 3 fixture 의 *DOM 등가* 스냅샷
- [ ] **Paper MCP 실제 송신 1 회 검증** (사용자 또는 에이전트가 LoginPage 페이로드를 write_html → Paper 에 시각 표시 — phase-6 회고 C1 해소)
- [ ] studio 전체 단위 테스트 회귀 0
- [ ] walkthrough.md / pr_description.md ship + main PR (spec → `phase-7-design-md`)

## 🔗 관련 자료

- ADR-005: grammar / IR 형식 결정 (D-2 자체 JSON tree IR — 본 spec 의 입력 형식)
- spec-7-01: vocabulary & formats — catalog 입력
- spec-7-02: spec.md grammar + parser — AST 입력
- vision.md: 디자이너의 메인 루프 (spec.md → Paper 시각화)
- 회고 phase-6 C1: Paper ↔ React 정합 미검증 (본 spec 에서 해소)
- spec-6-10: paper-e2e fresh-page 인프라 (본 spec 의 building block)
- 외부: https://react.dev/reference/react-dom/server/renderToString
- 외부: https://tailwindcss.com/docs/installation/play-cdn
