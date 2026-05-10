# Implementation Plan: spec-7-04

## 📋 Branch Strategy

- 신규 브랜치: `spec-7-04-paper-to-spec` (이미 생성됨)
- 시작 지점: `phase-7-design-md` (phase base)

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **Research / PoC 성격** — Go/No-Go 게이트 (accuracy ≥ 60%) 명시. 미달 시 알고리즘 폐기 + spec.md 직접 편집 fallback.
> - [ ] **Paper MCP 분리** — 알고리즘은 *Paper tree JSON in / spec.md out* 순수 함수. Paper MCP 호출은 agent / CLI 가 담당. studio runtime 은 Paper MCP 직접 호출 불가.
> - [ ] **레이어 명명 컨벤션** — 4 후보 평가 후 1 개 채택. 결정 기록은 walkthrough + (장래) FRONT.md §5.
> - [ ] **벤치마크 비용** — 28 fixture round-trip 은 Paper write_html 28 회 + read tree 28 회. 자동화 비싸므로 *대표 5-10 fixture* 를 정밀 측정 + 나머지는 합성 트리 (synthetic) 로 단위 테스트.
> - [ ] **방향성 검토** — 본 알고리즘이 미래 spec-7-07 (Figma adapter) 와도 매핑 룰 공유 가능한 형태 (FRONT.md §5).

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```
[입력]
  Paper tree JSON (agent 가 MCP 로 fetch)
  catalog.json    (spec-7-01)

[알고리즘 — 본 spec]
  paper-inference/
    │
    ├── tree-types.ts          — Paper tree JSON 타입 정의
    ├── component-matcher.ts   — layer.name → catalog 매칭 (정확 + fuzzy)
    ├── variant-extractor.ts   — 컨벤션 파싱 (`Button:primary` 등)
    ├── image-classifier.ts    — fill 이 image 인 노드 → Image
    ├── confidence.ts          — per-node score [0..1]
    ├── ast-builder.ts         — Paper tree → spec.md AST (Document)
    ├── classify.ts            — confident / confirm / unknown 분류
    ├── emit.ts                — Document → spec.md 텍스트
    └── infer.ts               — public API: inferSpec(tree, catalog, options)
                                  → { ast, report, text }

[Output]
  text:    spec.md 문자열
  report:  per-node confidence + 분류
  ast:     Document (디버그 / 추가 변환용)

[CLI / Agent 워크플로]
  agent (or designer) → Paper MCP (get_tree_summary, get_node_info)
                     → JSON dump (file or stdin)
  pnpm paper-to-spec <tree.json> → stdout spec.md
```

### Paper tree JSON 형식 (가정)

Paper MCP `get_tree_summary` 출력 + 부분 `get_node_info` (로 채울 수 있는) 형식. 본 spec 에서 *지원하는 최소 형식* 정의:

```typescript
interface PaperTreeNode {
  id: string;
  name: string;            // layer name (e.g. "Button:primary")
  component: string;       // Paper 의 노드 component type ("Frame" / "Text" / "Rectangle" 등)
  styles?: Record<string, string>;
  fills?: { type: "image" | "color"; src?: string; color?: string }[];
  children?: PaperTreeNode[];
}
```

실 형식과 차이 있을 수 있으나 *가정 + 매퍼* 로 흡수.

### 레이어 명명 컨벤션 평가 (Task 2)

| 후보 | 예시 | 장점 | 단점 |
|---|---|---|---|
| (A) `Button:primary` | `Button:primary`, `Button:lg` | 짧음, 디자이너 친화 | multiple variant 표현 모호 (`Button:primary:lg`?) |
| (B) `Button[variant=primary, size=lg]` | 대괄호 + key=value | 명시적, multi-axis 자연 | 디자이너에게 syntax noise |
| (C) Paper data attribute | layer attribute `data-variant=primary` | 이름 깔끔 + 명시 | Paper UI 의존 (수동 입력 어려움 가능) |
| (D) `Button.primary.lg` | dot 연결 (CSS class style) | multi-axis 자연 + 짧음 | `Button.Caps` 같은 컴포넌트 이름과 충돌 가능 |

**잠정 채택 (Task 2 prototype 후 확정)**: (D) PostCSS-style `Button.primary.lg`
- multi-axis 자연 (예: `Button.primary.lg`)
- 디자이너에게 친숙한 dot syntax
- `[]` 대비 가벼움
- catalog 의 PascalCase 이름과 충돌 없음 (catalog 는 `Button`, dot 뒤는 *값*)

### 신뢰도 점수 알고리즘

```typescript
function score(node: PaperTreeNode, match: CatalogMatch | null): number {
  if (!match) return 0.0;                  // 매칭 없음
  if (match.exact && match.styleAlign) return 1.0;  // 완벽
  if (match.exact) return 0.85;            // 이름 완벽 + 시각 일부 차이
  if (match.fuzzy && match.distance <= 1) return 0.7;  // 1 char 차이
  if (match.fuzzy && match.distance <= 2) return 0.5;
  return 0.3;
}
```

기본은 *결정적* 휴리스틱. LLM vision 통합은 Task 후반 (옵션).

### 28 fixture 벤치마크 비용 관리

자동화: **5 대표 fixture** (LoginPage / DashboardPage / ErrorPage / Button / SettingsPage) 만 *실 Paper 송신* + 자동 측정. 나머지 23 은 *합성 Paper tree* (compileToPaper 의 SSR HTML → 가상 Paper tree 변환) 로 단위 테스트.

비용 = 5 회 Paper MCP write_html + 5 회 read tree = 디자이너 한 번 검증으로 충분.

### 라이브러리 위치

```
studio/src/lib/paper-inference/
├── tree-types.ts             — PaperTreeNode 타입
├── component-matcher.ts      — exact + fuzzy
├── variant-extractor.ts      — `Comp.x.y` 컨벤션 (Task 2 결정)
├── image-classifier.ts
├── confidence.ts
├── ast-builder.ts
├── classify.ts
├── emit.ts                   — Document → spec.md 텍스트 (round-trip stable)
├── infer.ts                  — public API
├── synthetic-tree.ts         — HTML → 가상 Paper tree (벤치마크용)
└── __tests__/
    ├── matcher.test.ts
    ├── variant.test.ts
    ├── emit.test.ts
    ├── infer.test.ts
    ├── synthetic.test.ts
    └── benchmark.test.ts     — 28 fixture round-trip
```

### CLI

```
studio/src/lib/paper-inference/cli/paper-to-spec.ts
```

```bash
$ pnpm --filter studio paper-to-spec /tmp/tree.json
<LoginPage>
  <BrandHeader />
  <LoginForm>
    {{i18n.ko.login.email-placeholder}}
    ...
  </LoginForm>
</LoginPage>

$ pnpm --filter studio paper-to-spec /tmp/tree.json --report
{ "confident": [...], "confirm": [...], "unknown": [...] }
```

## 📂 Proposed Changes

### [NEW] `studio/src/lib/paper-inference/`
전체 라이브러리 + tests + CLI

### [NEW] `studio/scripts/fetch-paper-tree.ts` (선택)
Paper MCP 의 get_tree_summary 호출 결과를 JSON 으로 dump 하는 헬퍼 (agent 용도)

### [MODIFIED] `studio/package.json`
- `paper-to-spec` 스크립트 추가
- `paper-inference:bench` 스크립트 추가 (28 fixture 회귀)

### [MODIFIED — 작은] `docs/decisions/ADR-007-front-md-compilation-rulebook.md`
§5 (Paper Layer ↔ Component 매핑) 의 결정 fragment 추가 (실 컨벤션 정착됨을 표시).

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) **accuracy ≥ 60% PASS** (Go) 또는 *FAIL → 알고리즘 폐기 + fallback 보고* (No-Go)
- [ ] (실행 후) walkthrough.md / pr_description.md ship
- [ ] (실행 후) main PR (spec → phase-7-design-md)
