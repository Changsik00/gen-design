# Walkthrough: spec-7-07

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Figma MCP 실제 연결 없이 테스트 | 실 MCP 연결 vs 수동 픽스처 | 수동 픽스처 | CI에서 Figma 계정 불필요, API 형식 변경 시 타입만 수정 |
| `Document.kind` vs `Document.type` | 두 필드 중 어느 것이 SSOT | `.type` | ast-types.ts 실제 정의 확인 결과 `type: "Document"` |
| 빈 카탈로그에서 text 비어있는지 | 빈 것도 정상 vs 에러 | 빈 것 정상 | buildAst 는 root.children 처리 — 자식이 없으면 body 빈 배열 → 의도된 동작 |
| INSTANCE/COMPONENT → Paper 타입 | `"Component"` vs `"Frame"` | `"Frame"` | paper-inference tree-types.ts 가 Frame 을 generic container 로 사용 |

## 💬 사용자 협의

- **주제**: PoC 범위
  - **사용자 의견**: Figma 를 떠나지 않고 본 시스템 활용 가능하도록 어댑터 PoC 구현
  - **합의**: CLI + 단위/통합 테스트로 충분. UI 연동은 후속 spec.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm test src/lib/figma-adapter`
- **결과**: ✅ 16 + 4 = 20 passed (figma-node-mapper + adapt)

```text
Test Files  2 passed (2)
     Tests  20 passed (20)
  Duration  ~540ms
```

#### 통합 테스트
- **명령**: `pnpm test src/lib/figma-adapter/__tests__/adapt.integration.test.ts`
- **결과**: ✅ 5 passed

```text
Test Files  1 passed (1)
     Tests  5 passed (5)
  Duration  ~574ms
```

#### 전체 테스트 스위트
- **명령**: `pnpm test`
- **결과**: ✅ 96 files, 655 tests passed

### 2. 수동 검증

1. **Action**: `pnpm exec tsx src/lib/figma-adapter/cli/figma-adapt.ts fixtures/sample-page.json`
   - **stdout**:
     ```
     <!-- unmatched: Button.primary -->
     <!-- unmatched: Input.default -->
     <!-- unmatched: 제목 -->
     ```
   - **stderr** (JSON 리포트):
     ```json
     {
       "total": 3,
       "matched": 0,
       "lowConfidence": [],
       "unmatched": ["100:2", "100:3", "100:5"]
     }
     ```
   - 빈 카탈로그이므로 전부 unmatched — 예상 동작.

2. **Action**: 실제 카탈로그 시뮬레이션 (Button 포함)
   - 통합 테스트 마지막 케이스로 검증:
     `catalog = new Map([["Button", [{name:"variant", values:["primary"]}]]])`
   - 결과: confident + confirm > 0 → PASS

## 🔍 발견 사항

- Figma 의 `INSTANCE` 노드는 Paper 의 레이어 컨벤션과 동일하게 `Component/Variant` 슬래시 형식을 씀 — 슬래시→dot 정규화로 paper-inference 재사용이 자연스럽게 맞음.
- 실 Figma MCP `get_design_context` 응답 형식은 공개 문서 기반 추정. 실 연결 시 `figma-types.ts` 만 수정하면 나머지 파이프라인 그대로 동작.
- 카탈로그 없이도 미매칭 Comment 로 spec.md 는 항상 valid parse → 디자이너가 수작업으로 수정하는 출발점으로 활용 가능.

## 🚧 이월 항목

- Figma MCP 실 연결 + 실 파일 변환 검증 → 후속 spec (UI 연동과 함께)
- Studio UI 에서 Figma JSON 붙여넣기 → 변환 버튼 흐름 → 후속 spec

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-05-10 |
| **최종 commit** | `58c5f72` |
