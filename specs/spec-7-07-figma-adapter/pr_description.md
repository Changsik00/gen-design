# feat(spec-7-07): Figma → spec.md 어댑터 PoC

## 📋 Summary

### 배경 및 목적

spec-7-04 (Paper → spec.md) 와 동일한 어휘 매칭 파이프라인을 재사용해, Figma 노드 트리를 spec.md 로 변환하는 어댑터 레이어를 추가한다. 디자이너가 Figma 를 떠나지 않고 본 시스템과 병용 가능하도록 하는 Distribution 전략의 PoC.

### 주요 변경 사항

- [x] `figma-types.ts` — Figma MCP `get_design_context` 응답 형식의 타입 정의
- [x] `figma-node-mapper.ts` — `"Button/Primary/Large"` → `"Button.primary.large"` 슬래시→dot 정규화 + `FigmaNode → PaperTreeNode` 재귀 변환
- [x] `adapt.ts` — `adaptFigma(figmaNode, catalog)` 공용 진입점 (paper-inference `inferSpec` 재사용)
- [x] `cli/figma-adapt.ts` — `figma-adapt <fixture.json>` CLI (stdout: spec.md, stderr: 리포트 JSON)
- [x] `fixtures/sample-page.json` — CI용 수동 픽스처 (Figma MCP 연결 없이 동작)
- [x] 단위 테스트 20개 + 통합 테스트 5개 — 전체 PASS

### Phase 컨텍스트

- **Phase**: `phase-7`
- **본 SPEC 의 역할**: phase-7 마지막 SPEC. spec-7-04 의 paper-inference 파이프라인을 Figma 쪽으로 연장해 4축 어휘 정합의 *외부 진입점* 을 완성.

## 🎯 Key Review Points

1. **재사용 경계 (`adapt.ts`)**: `figma-adapter` 는 `paper-inference` 의 내부 구현을 복사하지 않고 `inferSpec` 만 import. 매칭/분류/emit 로직 일원화.
2. **슬래시→dot 정규화 (`figma-node-mapper.ts`)**: Figma 의 `Component/Variant/Size` 컨벤션을 Paper dot syntax (`Component.variant.size`) 로 변환하는 규칙. 첫 세그먼트 PascalCase 보존, 이후 소문자.
3. **픽스처 기반 통합 테스트**: 실 Figma MCP 없이 CI 가능. `figma-types.ts` 만 수정하면 실 API 형식 변경에 대응.

## 🧪 Verification

### 자동 테스트

```bash
cd studio && pnpm test src/lib/figma-adapter
```

**결과 요약**:
- ✅ `figma-node-mapper.test.ts`: 16 passed (normalizeLayerName + mapFigmaNode)
- ✅ `adapt.test.ts`: 4 passed
- ✅ `adapt.integration.test.ts`: 5 passed (픽스처 → parse → PASS)
- ✅ 전체 스위트: 655 passed (96 files)

### CLI 수동 검증

```bash
pnpm exec tsx src/lib/figma-adapter/cli/figma-adapt.ts \
  src/lib/figma-adapter/fixtures/sample-page.json
```

출력:
```
<!-- unmatched: Button.primary -->
<!-- unmatched: Input.default -->
<!-- unmatched: 제목 -->
```

stderr 리포트:
```json
{"total": 3, "matched": 0, "lowConfidence": [], "unmatched": ["100:2","100:3","100:5"]}
```

## 📦 Files Changed

### 🆕 New Files

- `studio/src/lib/figma-adapter/figma-types.ts`: Figma 노드 타입 정의
- `studio/src/lib/figma-adapter/figma-node-mapper.ts`: 슬래시→dot 정규화 + PaperTreeNode 변환
- `studio/src/lib/figma-adapter/adapt.ts`: adaptFigma 공용 진입점
- `studio/src/lib/figma-adapter/cli/figma-adapt.ts`: CLI
- `studio/src/lib/figma-adapter/fixtures/sample-page.json`: PoC 픽스처
- `studio/src/lib/figma-adapter/__tests__/figma-node-mapper.test.ts`: 단위 테스트 (16)
- `studio/src/lib/figma-adapter/__tests__/adapt.test.ts`: 단위 테스트 (4)
- `studio/src/lib/figma-adapter/__tests__/adapt.integration.test.ts`: 통합 테스트 (5)
- `specs/spec-7-07-figma-adapter/spec.md`, `plan.md`, `task.md`, `walkthrough.md`, `pr_description.md`

**Total**: 9 신규 코드 파일 + 5 spec 산출물

## ✅ Definition of Done

- [x] 단위 테스트 20개 PASS
- [x] 통합 테스트 5개 PASS (PoC 1 페이지 변환 → `parse().ok === true`)
- [x] CLI 수동 검증 PASS
- [x] 전체 스위트 655 tests PASS
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-7.md`
- Walkthrough: `specs/spec-7-07-figma-adapter/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-006-paper-first-workflow.md`
