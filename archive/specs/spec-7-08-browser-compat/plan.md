# plan: spec-7-08 — 브라우저 호환 수정 + catalog 연결

## 📋 Branch Strategy

- 신규 브랜치: `spec-7-08-browser-compat`
- 시작 지점: `phase-7-design-md`

## 🎯 핵심 전략

두 독립적 버그 수정. 변경 범위 최소화.

### Fix A: node:fs 브라우저 번들 제거

| 파일 | 변경 |
|---|---|
| `spec-md/parser/index.ts` | `readFileSync` import + `parseFile` 제거 |
| `spec-md/parser/node.ts` | `parseFile` 신규 (Node 전용) |
| `spec-md/lint/index.ts` | `parseFile` import 경로 → `./node` |
| `spec-md-compiler/paper/compile.ts` | `readFileSync` import + `{ path }` 오버로드 제거 |
| `spec-md-compiler/cli/spec-paper.ts` | `readFileSync` 직접 처리 |
| 영향받는 테스트 4개 | `{ path }` → `readFileSync` + string |

### Fix B: PaperImportPanel → catalog.json 연결

`catalog.json` 형식 확인 후 `CatalogMap` 으로 변환하는 헬퍼 작성.

## 📂 Proposed Changes

### [MODIFY] `studio/src/lib/spec-md/parser/index.ts`
`readFileSync` 최상위 import 와 `parseFile` 함수 제거.

### [NEW] `studio/src/lib/spec-md/parser/node.ts`
Node 전용 `parseFile(path): ParseResult`.

### [MODIFY] `studio/src/lib/spec-md/lint/index.ts`
`parseFile` import 경로를 `../parser/node` 로 변경.

### [MODIFY] `studio/src/lib/spec-md-compiler/paper/compile.ts`
`CompileInput = string | Document` (path 오버로드 제거), `readFileSync` import 제거.

### [MODIFY] `studio/src/lib/spec-md-compiler/cli/spec-paper.ts`
`readFileSync` 직접 import, 파일 읽기 후 string 으로 `compileToPaper` 호출.

### [MODIFY] 테스트 4개
`{ path: join(...) }` → `readFileSync(...) + compileToPaper(text)` 패턴으로 교체.

### [MODIFY] `studio/src/features/spec-editor/PaperImportPanel.tsx`
```ts
import catalogJson from "@/lib/vocabulary/catalog/catalog.json";
// catalogJson → CatalogMap 변환
const CATALOG: CatalogMap = buildCatalogMap(catalogJson);
```

## 🧪 검증 계획

```bash
cd studio && pnpm test   # 655 PASS
pnpm dev                 # 브라우저 콘솔 에러 없음
```

## 📦 Deliverables

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
