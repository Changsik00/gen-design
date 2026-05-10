# fix(spec-7-08): 브라우저 호환 수정 + catalog 연결

## 📋 Summary

### 배경 및 목적

Phase-7 Opus 독립 감사에서 발견한 두 가지 실용적 버그를 수정한다:
1. Studio dev 서버 즉시 크래시 (`node:fs` 브라우저 번들 포함)
2. PaperImportPanel 이 빈 catalog 로 동작 (컴포넌트 이름만 매칭, variant axis 추론 불가)

### 주요 변경 사항

- [x] `spec-md/parser/index.ts` — `readFileSync` import + `parseFile` 제거
- [x] `spec-md/parser/node.ts` 신규 — Node 전용 `parseFile`
- [x] `spec-md/lint/index.ts` — `parseFile` import 경로 수정
- [x] `spec-md-compiler/paper/compile.ts` — `{ path }` 오버로드 제거, `readFileSync` 제거
- [x] `spec-md-compiler/cli/spec-paper.ts` — CLI 에서 `readFileSync` 직접 처리
- [x] `PaperImportPanel.tsx` — `EMPTY_CATALOG` → `buildCatalogMap()` (catalog.json 실 연결)

### Phase 컨텍스트

- **Phase**: `phase-7`
- **본 SPEC 의 역할**: E2E 테스트 가능하게 만드는 선결 fix. spec-7-09 의 토대.

## 🎯 Key Review Points

1. **`parser/node.ts` 분리**: `parseFile` 은 Node 전용 — 브라우저 entry 에서 절대 import 안 되도록 파일 분리
2. **`buildCatalogMap()`**: catalog.json 의 tiers 구조를 순회하며 `CatalogMap` 생성 — tier1Aria 의 `components` 없음 케이스 안전 처리

## 🧪 Verification

```bash
cd studio && pnpm test  # 655 PASS
pnpm dev                # 브라우저 에러 없음
```

## 📦 Files Changed

### 🆕 New Files
- `studio/src/lib/spec-md/parser/node.ts`: Node 전용 parseFile

### 🛠 Modified Files
- `studio/src/lib/spec-md/parser/index.ts`: node:fs 제거
- `studio/src/lib/spec-md/lint/index.ts`: import 경로 수정
- `studio/src/lib/spec-md-compiler/paper/compile.ts`: path 오버로드 제거
- `studio/src/lib/spec-md-compiler/cli/spec-paper.ts`: readFileSync 직접 처리
- `studio/src/features/spec-editor/PaperImportPanel.tsx`: catalog.json 연결
- 테스트 3개: `{ path }` → `readFileSync + string` 패턴

**Total**: 9 files changed

## ✅ Definition of Done

- [x] node:fs 브라우저 번들 에러 없음
- [x] PaperImportPanel Button.primary → `<Button variant="primary" />` 생성
- [x] 655 tests PASS
