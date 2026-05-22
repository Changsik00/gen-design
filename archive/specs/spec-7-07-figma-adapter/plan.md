# plan: spec-7-07 — Figma → spec.md 어댑터 PoC

## 📋 Branch Strategy

- 신규 브랜치: `spec-7-07-figma-adapter`
- 시작 지점: `phase-7-design-md` (phase base branch 모드)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] Figma MCP `get_design_context` 응답 형식을 실제로 확인하지 않았음 — `figma-types.ts` 는 공개 문서 기반 추정치. PoC fixture 는 수동 작성하며, 추후 실 MCP 연결 시 타입 조정 가능.
> - [ ] `paper-inference` 의 `inferSpec` 을 외부에서 import 하므로, `figma-adapter` 와 `paper-inference` 의 public API 변경 시 동시 수정 필요.

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```mermaid
graph LR
  FIG[Figma JSON fixture] --> FM[figma-node-mapper]
  FM -->|PaperTreeNode| IS[inferSpec]
  IS --> OUT[spec.md 텍스트]

  subgraph figma-adapter (신규)
    FM
    AD[adapt.ts]
    CLI[cli/figma-adapt.ts]
  end

  subgraph paper-inference (재사용)
    IS
  end
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **매칭/분류/emit** | paper-inference 직접 import | 코드 중복 0, 어휘 룰 일원화 |
| **Figma 노드 → PaperTreeNode** | figma-node-mapper.ts 신규 | Figma API 형식 격리 |
| **슬래시→dot 정규화** | figma-node-mapper 내부 | 레이어 명명 컨벤션 단일화 |
| **통합 테스트** | 수동 JSON 픽스처 | Figma MCP 연결 없이 CI 가능 |

## 📂 Proposed Changes

### [NEW] `studio/src/lib/figma-adapter/figma-types.ts`
Figma MCP `get_design_context` 응답 형식의 타입 정의. 관련 노드 타입만 추출.

```ts
export type FigmaNodeType =
  "FRAME" | "COMPONENT" | "INSTANCE" | "TEXT" | "RECTANGLE" | "GROUP" | "VECTOR";

export interface FigmaNode {
  id: string;
  name: string;
  type: FigmaNodeType;
  children?: FigmaNode[];
  fills?: { type: string; color?: { r: number; g: number; b: number } }[];
  style?: Record<string, string | number>;
}
```

### [NEW] `studio/src/lib/figma-adapter/figma-node-mapper.ts`
두 가지 책임:
1. `normalizeLayerName(name: string): string` — `"Button/Primary/Large"` → `"Button.primary.large"`
2. `mapFigmaNode(node: FigmaNode): PaperTreeNode` — 재귀 변환, FIGMA 타입 → Paper component 문자열 매핑

### [NEW] `studio/src/lib/figma-adapter/adapt.ts`
```ts
export function adaptFigma(
  figmaNode: FigmaNode,
  catalog: CatalogMap,
  options?: InferOptions,
): InferResult
```
`mapFigmaNode` → `inferSpec` 순서 호출. InferResult 는 paper-inference 타입 그대로.

### [NEW] `studio/src/lib/figma-adapter/cli/figma-adapt.ts`
```
Usage: node figma-adapt.js <fixture.json> [--catalog=<path>]
stdout: spec.md 텍스트
stderr: JSON 리포트 { matched, lowConfidence, unmatched }
```
import.meta.url guard 적용 (spec-7-05 CLI 패턴).

### [NEW] `studio/src/lib/figma-adapter/__tests__/figma-node-mapper.test.ts`
단위 테스트:
- `normalizeLayerName` 슬래시→dot 변환 (대소문자, 엣지케이스)
- `mapFigmaNode` 타입 매핑 검증 (FRAME→Frame, TEXT→Text, 재귀)

### [NEW] `studio/src/lib/figma-adapter/__tests__/adapt.integration.test.ts`
통합 테스트:
- `fixtures/sample-page.json` 로드 → `adaptFigma` → `parse(text).ok === true`
- 리포트에 matched > 0 검증

### [NEW] `studio/src/lib/figma-adapter/fixtures/sample-page.json`
수동 작성 Figma 노드 픽스처:
- 최상위 `FRAME` "LoginPage"
- 자식: `INSTANCE` "Button/Primary", `FRAME` "Input/Default", `TEXT` "제목"

## 🧪 검증 계획

### 단위 테스트
```bash
cd studio && pnpm test src/lib/figma-adapter
```

### 통합 테스트
```bash
cd studio && pnpm test src/lib/figma-adapter/__tests__/adapt.integration.test.ts
```

### 수동 검증
1. `node dist/lib/figma-adapter/cli/figma-adapt.js fixtures/sample-page.json` — stdout 에 spec.md 출력 확인
2. 출력된 spec.md 를 Studio Spec Editor 에 붙여넣기 → 파싱 에러 없음 확인

## 🔁 Rollback Plan

- 신규 모듈 전용 — 기존 코드 미수정. 브랜치 삭제로 완전 롤백.
- paper-inference public API 미변경이므로 다른 기능 영향 없음.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
