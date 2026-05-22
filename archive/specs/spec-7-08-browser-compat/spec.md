# spec-7-08: 브라우저 호환 수정 + catalog 연결

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-08` |
| **Phase** | `phase-7` |
| **Branch** | `spec-7-08-browser-compat` |
| **상태** | Planning |
| **타입** | Fix |
| **Integration Test Required** | no |
| **작성일** | 2026-05-10 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

Phase-7 독립 감사 (Opus) 가 두 가지 실용적 문제를 발견:

1. **[C6] PaperImportPanel EMPTY_CATALOG hardcode** — `catalog.json` 이 같은 repo 안에 존재하지만 import 되지 않아 컴포넌트 이름만 매칭되고 variant axis 추론 불가.

2. **[브라우저 에러] `node:fs` 브라우저 번들 포함** — `spec-md/parser/index.ts` 와 `spec-md-compiler/paper/compile.ts` 가 `readFileSync` 를 최상위 import → Vite 가 브라우저 번들에 포함 → Studio dev 서버 즉시 오류.

### 해결 방안

- `parseFile` 을 `parser/node.ts` 로 분리, `parser/index.ts` 에서 `node:fs` import 제거
- `compileToPaper` 의 `{ path: string }` 오버로드 제거 (CLI 에서 `readFileSync` 직접 처리)
- `PaperImportPanel` 이 `catalog.json` → `CatalogMap` 으로 변환 후 `inferSpec` 에 전달

## ✅ Definition of Done

- [ ] `pnpm dev` 브라우저 콘솔 `node:fs` 에러 없음
- [ ] PaperImportPanel 에서 Paper 트리 붙여넣기 시 컴포넌트 이름 + variant 가 spec.md 에 반영
- [ ] 전체 테스트 655 PASS
- [ ] ship commit + push + PR
