# Walkthrough: spec-7-08

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| `parseFile` 위치 | index.ts 유지 vs node.ts 분리 | node.ts 분리 | Vite 브라우저 번들에서 node:fs 격리; lint 는 Node-only 사용처 |
| `CompileInput { path }` | CLI 레이어로 이동 vs 동적 import | CLI 에서 readFileSync 직접 처리 | 브라우저 노출 0, 변경 최소화 |
| catalog.json → CatalogMap | 별도 util 함수 vs inline | `buildCatalogMap()` module-level | 테스트 가능성 + 타입 안전 |

## 🧪 검증 결과

### 단위 테스트
- **결과**: ✅ 96 files, 655 tests PASS

### 수동 검증
1. `pnpm dev` → 브라우저 콘솔 `node:fs` 에러 없음 (수정 전: 즉시 크래시)
2. PaperImportPanel 에 `{"id":"1","name":"Button.primary","component":"Frame","children":[]}` 입력 → `<Button variant="primary" />` 생성 (수정 전: `<!-- unmatched: Button.primary -->`)

## 🔍 발견 사항

- catalog.json 의 tier1Aria 에는 `components` 키가 없음 → `tier.components ?? []` 처리로 안전하게 스킵
- `buildCatalogMap()` 이 module-level 에서 실행되어 앱 시작 시 한 번만 파싱됨

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-05-10 |
| **최종 commit** | `d953780` |
