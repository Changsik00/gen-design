# feat(spec-7-04): paper-to-spec 추론 엔진 (Paper tree → spec.md)

## 📋 Summary

### 배경 및 목적

Paper 디자인 툴의 레이어 트리 (JSON) 를 입력받아 spec.md 텍스트를 자동 추론하는 역방향 컴파일러입니다.
spec-7-03 (spec.md → Paper) 의 역방향으로, 디자이너가 Paper 에서 직접 작업한 결과를 spec.md 로 역추출할 수 있습니다.

알고리즘은 *휴리스틱 only* (Levenshtein fuzzy matching + dot-syntax 컨벤션)로 구현되었으며, 28 fixture 합성 round-trip 벤치마크에서 **99.1% accuracy** 를 기록했습니다 (Go/No-Go threshold: 60%).

### 주요 변경 사항

- [x] `studio/src/lib/paper-inference/` 라이브러리 신규 생성 (9개 모듈)
- [x] **레이어 명명 컨벤션 결정**: (D) dot syntax `Button.primary.lg` 채택
- [x] **28-fixture 벤치마크**: Go/No-Go gate PASS (99.1%)
- [x] **round-trip stable emit**: `Document → spec.md → parse → 동일 AST`
- [x] CLI `pnpm --filter studio paper-to-spec <tree.json>`

### Phase 컨텍스트

- **Phase**: `phase-7` (Design FRONT.md 시스템 — spec.md ↔ Paper ↔ React 양방향 파이프라인)
- **본 SPEC 의 역할**: spec-7-03 (spec→Paper) 의 역방향. 디자이너가 Paper 에서 직접 변경한 내용을 spec.md 로 피드백하는 루프 완성.

## 🎯 Key Review Points

1. **레이어 명명 컨벤션 (variant-extractor.ts)**: dot syntax 채택 — `Button.primary.lg` → `{ component: "Button", axes: { variant: "primary", size: "lg" } }`. 향후 spec-7-07 (Figma adapter) 와 공유 예정.

2. **Go/No-Go gate (benchmark.test.ts)**: 99.1% accuracy. 합성 round-trip 이므로 실 Paper 레이어 명과 격차가 있을 수 있음. Task 10 실 MCP 검증 생략 사유 walkthrough 에 명시.

3. **emit round-trip (emit.ts)**: ComponentInstance-only children → 블록형(들여쓰기), MarkdownText 혼합 → inline 전략. whitespace MarkdownText 노이즈 방지.

4. **CatalogMap 타입 (ast-builder.ts)**: `Map<string, CatalogAxisDef[]>` — axis 순서에 따라 dot syntax 파싱 결과가 달라짐. catalog 재생성 시 주의.

## 🧪 Verification

### 자동 테스트

```bash
# paper-inference 모듈 단위 테스트
pnpm --filter studio test src/lib/paper-inference/

# 28-fixture 벤치마크 (Go/No-Go)
pnpm --filter studio paper-inference:bench

# 전체 회귀
pnpm --filter studio test
```

**결과 요약**:
- ✅ `matcher.test.ts`: 6/6 통과 (exact + fuzzy + case + empty)
- ✅ `variant.test.ts`: 8/8 통과 (dot syntax 파싱)
- ✅ `image-classifier.test.ts + confidence.test.ts`: 10/10 통과
- ✅ `ast-builder.test.ts`: 5/5 통과
- ✅ `classify.test.ts`: 4/4 통과
- ✅ `emit.test.ts`: 9/9 통과 (round-trip 5개 포함)
- ✅ `infer.test.ts`: 4/4 통과 (end-to-end)
- ✅ `cli.test.ts`: 8/8 통과
- ✅ `benchmark.test.ts`: Go/No-Go PASS (99.1%)
- ✅ 전체 회귀: 534 tests PASS

### 수동 검증 시나리오

1. **synthetic tree → CLI**: `echo '{"id":"root","name":"Root","component":"Frame","children":[{"id":"n1","name":"Button.primary","component":"Frame"}]}' > /tmp/t.json && pnpm --filter studio paper-to-spec /tmp/t.json` → `<Button variant="primary" />`
2. **벤치마크 리포트**: `bench-report.md` — 28개 fixture 별 structural/vocabulary/variant score 확인

## 📦 Files Changed

### 🆕 New Files

- `studio/src/lib/paper-inference/tree-types.ts`: PaperTreeNode + PaperFill 타입
- `studio/src/lib/paper-inference/component-matcher.ts`: `matchByName()` — exact + Levenshtein fuzzy
- `studio/src/lib/paper-inference/variant-extractor.ts`: dot syntax 파싱 `Button.primary.lg` → `{ component, axes }`
- `studio/src/lib/paper-inference/image-classifier.ts`: image fill 노드 식별 + src 추출
- `studio/src/lib/paper-inference/confidence.ts`: per-node score [0, 1]
- `studio/src/lib/paper-inference/ast-builder.ts`: `buildAst(tree, CatalogMap)` → Document + NodeMetaMap
- `studio/src/lib/paper-inference/classify.ts`: confident / confirm / unknown 3분류
- `studio/src/lib/paper-inference/emit.ts`: Document → spec.md 텍스트 (round-trip stable)
- `studio/src/lib/paper-inference/infer.ts`: `inferSpec()` 공용 API
- `studio/src/lib/paper-inference/synthetic-tree.ts`: HTML → PaperTreeNode (벤치마크용)
- `studio/src/lib/paper-inference/cli/paper-to-spec.ts`: CLI entry
- `studio/src/lib/paper-inference/__tests__/*.test.ts`: 9개 테스트 파일
- `bench-report.md`: 28-fixture 벤치마크 결과

### 🛠 Modified Files

- `studio/package.json`: `paper-to-spec`, `paper-inference:bench` 스크립트 추가

**Total**: 14 new files, 1 modified

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (534 tests)
- [x] 28-fixture 벤치마크 Go/No-Go PASS (99.1% ≥ 60%)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 전체 회귀 테스트 PASS

## 🔗 관련 자료

- Phase: `backlog/phase-7.md`
- Walkthrough: `specs/spec-7-04-paper-to-spec/walkthrough.md`
- Benchmark: `bench-report.md`
- ADR-007: `docs/decisions/ADR-007-front-md-compilation-rulebook.md` (레이어 ↔ 컴포넌트 매핑 §5)
