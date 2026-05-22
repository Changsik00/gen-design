# feat(spec-7-06): Studio 재구성 — spec.md 편집기 + dual preview

## 📋 Summary

### 배경 및 목적

phase-7 의 컴파일러 3종 (spec-7-03/04/05) 이 완성되었으나 Studio UI 에서 이를 활용하는 경로가 없었습니다. 본 spec 은 라우트를 재구성하고 **spec.md 편집기 + dual preview** (React 좌 / Paper HTML 우) 를 메인 라우트에 배치합니다.

### 주요 변경 사항

- [x] **라우트 재구성**: `#/spec` (메인), `#/new`, `#/design`, `#/tokens`, `#/export`
- [x] **backward-compat redirect**: `#/blueprint→#/new`, `#/editor→#/design`, `#/preview→#/spec`
- [x] **SpecEditorPage**: spec.md textarea + React preview + Paper HTML iframe + Error panel
- [x] **PaperImportPanel**: Paper tree JSON → `inferSpec` → spec.md 자동 생성
- [x] **Download TSX**: `compileToReact` 결과를 파일로 다운로드

### 워크플로

```
Paper tree JSON  →  PaperImportPanel  →  spec.md 편집기
                                              ↓ (300ms debounce)
                                    React preview  |  Paper HTML preview
                                              ↓
                                    Download TSX (선택)
```

## 🎯 Key Review Points

1. **React preview 렌더 방식**: `buildReactTree` (기존 paper/react-builder) 사용. `compileToReact` 출력(정적 문자열)은 파일 다운로드 전용 — eval 없음.

2. **PaperImportPanel catalog**: 현재 빈 `CatalogMap` fallback. spec-7-01 산출물(catalog.json) 완성 후 연결 예정. 빈 Map 으로도 컴포넌트 이름 매칭(Levenshtein)은 동작.

3. **router.ts redirect**: `REDIRECTS` 상수로 명시 — `parseHash` 가 구 경로를 새 경로로 자동 redirect.

## 🧪 Verification

```bash
pnpm --filter studio test
# → 630 tests PASS (93 files)
```

**수동 golden path**:
1. `pnpm dev` → `#/spec` 기본 진입
2. `<Button variant="primary" />` → React + Paper 양쪽 렌더 확인
3. "Import from Paper" → JSON paste → Infer → 편집기 삽입
4. `#/blueprint` → `#/new` redirect 확인

## 📦 Files Changed

### 🛠 Modified

- `studio/src/lib/router.ts` — `spec/new/design` 라우트 + redirect 맵
- `studio/src/components/layout/StudioLayout.tsx` — NAV_ITEMS 갱신
- `studio/src/App.tsx` — 라우트 연결 갱신
- `studio/src/__tests__/app-smoke.test.tsx` — 새 라우트 기준 갱신

### 🆕 New

- `studio/src/features/spec-editor/SpecEditorPage.tsx`
- `studio/src/features/spec-editor/SpecTextEditor.tsx`
- `studio/src/features/spec-editor/ReactPreviewPanel.tsx`
- `studio/src/features/spec-editor/PaperPreviewPanel.tsx`
- `studio/src/features/spec-editor/ErrorPanel.tsx`
- `studio/src/features/spec-editor/PaperImportPanel.tsx`
- `studio/src/features/spec-editor/useCompileResult.ts`
- `studio/src/features/spec-editor/index.tsx`
- `studio/src/features/spec-editor/__tests__/useCompileResult.test.ts`
- `studio/src/features/spec-editor/__tests__/PaperImportPanel.test.tsx`

**Total**: 4 modified, 10 new files

## ✅ Definition of Done

- [x] `#/spec` 라우트 — textarea + React preview + Paper iframe 동작
- [x] Paper inference import 패널 동작
- [x] backward-compat redirect 동작
- [x] 630 tests PASS
- [x] walkthrough.md / pr_description.md ship

## 🔗 관련 자료

- Phase: `backlog/phase-7.md`
- Walkthrough: `specs/spec-7-06-studio-reorg/walkthrough.md`
- 컴파일러: spec-7-03 (spec→Paper), spec-7-04 (Paper→spec), spec-7-05 (spec→React)
