# Implementation Plan: spec-7-06

## 📋 Branch Strategy

- 신규 브랜치: `spec-7-06-studio-reorg`
- 시작 지점: `phase-7-design-md` (phase base branch — spec-7-05 머지 완료)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **`#/spec` 가 기본 라우트**: 기존 `#/blueprint` 가 fallback 이었으나 `#/spec` 으로 변경. 북마크한 URL 이 있으면 `#/blueprint` → `#/new` redirect 로 호환 유지.
> - [ ] **React preview 렌더 방식**: `compileToReact` 출력(정적 문자열)을 브라우저에서 직접 실행하지 않음. 대신 기존 `buildReactTree` 로 React children 렌더 — COMPONENT_REGISTRY 에 등록된 컴포넌트만 미리보기 가능.

> [!WARNING]
> - [ ] **catalog.json 로딩 경로**: `inferSpec` 에 필요한 CatalogMap 구성을 위해 `catalog.json` (spec-7-01 산출물) 이 필요. 파일이 없으면 빈 Map 으로 fallback — 컴포넌트 이름 매칭은 되지만 variant axis 추론 불가.

## 🎯 핵심 전략

### 주요 결정

| 결정 사항 | 선택 | 이유 |
|---|---|---|
| **기존 feature 파일** | 유지 (삭제 없음) | `BlueprintWizard`, `DesignEditor` 등 코드 자산 그대로. App.tsx 연결만 변경 |
| **React preview** | `buildReactTree` (기존) | `compileToReact` 출력은 정적 파일용. 브라우저 live preview 는 React children 직접 렌더가 안전 |
| **Paper inference import** | JSON textarea → `inferSpec` | 실 MCP 대신 JSON paste. 사용자가 Paper MCP 에서 직접 tree JSON 복사 후 붙여넣는 방식 |
| **debounce** | 300ms | 매 keystroke 컴파일 방지 |
| **backward-compat** | `parseHash` redirect 맵 | `#/blueprint` → `#/new`, `#/editor` → `#/design`, `#/preview` → `#/spec` |

## 📂 Proposed Changes

### [MODIFY] `studio/src/lib/router.ts`

- `StudioRoute` 타입에 `spec`, `new`, `design` 추가
- `ROUTE_PATHS` 갱신
- `parseHash` redirect 맵 추가 (`blueprint` → `new`, `editor` → `design`, `preview` → `spec`)
- fallback 기본 라우트: `blueprint` → `spec`

### [MODIFY] `studio/src/components/layout/StudioLayout.tsx`

- `NAV_ITEMS`: `blueprint/editor/tokens/export/preview` → `spec/new/design/tokens/export`
- 라벨: `Spec Editor / New Spec / Design MD / Tokens / Export`

### [MODIFY] `studio/src/App.tsx`

- 새 라우트 연결: `spec` → `SpecEditorPage`, `new` → `BlueprintPage`, `design` → `EditorPage`
- 기존 `preview` route 제거 (redirect 로 처리)

### [NEW] `studio/src/features/spec-editor/`

```
spec-editor/
  index.tsx              — SpecEditorPage (메인 레이아웃)
  SpecTextEditor.tsx     — textarea + debounce hook
  ReactPreviewPanel.tsx  — buildReactTree → React children
  PaperPreviewPanel.tsx  — compileToPaper → <iframe srcDoc>
  PaperImportPanel.tsx   — JSON paste → inferSpec → 편집기 삽입
  ErrorPanel.tsx         — 파싱/컴파일 에러 목록
  __tests__/
    useCompileResult.test.ts  — debounce + compile hook 단위 테스트
    PaperImportPanel.test.ts  — inferSpec 연동 단위 테스트
```

#### `useCompileResult` hook

```ts
function useCompileResult(text: string, debounceMs = 300): {
  reactTree: ReactNode[]
  paperHtml: string
  tsxContent: string
  errors: string[]
}
```

- `text` 변경 → 300ms 후 `parse` → `buildReactTree` + `compileToPaper` + `compileToReact`
- 에러는 각 단계에서 수집

#### `PaperImportPanel`

```ts
// JSON string → CatalogMap 빌드 → inferSpec → text 반환
function inferFromJson(json: string): { text: string; report: InferReport } | { error: string }
```

## 🧪 검증 계획

### 단위 테스트

```bash
pnpm --filter studio test src/features/spec-editor/
```

### 전체 회귀

```bash
pnpm --filter studio test
```

### 통합 테스트 (수동) — golden path

1. `pnpm dev` 실행 → `http://localhost:5173` 오픈
2. `#/spec` 기본 진입 확인
3. `<Button variant="primary" />` 입력 → React preview 에 Button 렌더 확인
4. Paper HTML preview 에 Paper 스타일 Button 확인
5. "Import from Paper" → LoginPage fixture 의 synthetic tree JSON 붙여넣기 → Infer → 편집기에 spec.md 삽입 확인
6. `#/blueprint` 접근 → `#/new` redirect 확인

## 🔁 Rollback Plan

- App.tsx, router.ts, StudioLayout.tsx 의 변경만 되돌리면 기존 라우팅 복구
- `features/spec-editor/` 디렉토리 삭제로 신규 기능 제거
- 기존 feature 파일은 손대지 않으므로 완전 롤백 가능

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
