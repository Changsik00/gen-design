# Paper MCP 왕복 Rigor 실험 — 2026-04-22

> spec-4-03 의 보완 실험. spec-4-02 의 tautology 논란과 Stage 6 미검증 문제를 해결.
> 대상 아트보드: `1BN-0 LoginPage — spec-4-02 PoC (2026-04-22)` (기존 spec-4-02 산출), `1AX-0 LoginPage — DESIGN.md E2E Test` (2026-04-12 e2e-demo-loginpage.md 산출).

## 실험 설계 요약

| 실험 | 목적 | 대상 | 수행 |
|---|---|---|---|
| A | Mutation Fidelity — 의도적 값 변경이 정확히 반영되고 주변 토큰 오염 없는지 | `1BN-0` Button `1C1-0` bg + 5 개 border 노드 | `update_styles` + `get_computed_styles` 재조회 |
| B | Cross-artboard 비교 — 독립 세션에서 저장된 값의 재현성 | `1AX-0` 의 Card/Input/Button/Text | `get_computed_styles` 만 (읽기) |

---

## 실험 A: Mutation Fidelity

### A-1 Baseline 확인

`get_computed_styles(["1C1-0","1BV-0","1BZ-0","1C8-0","1CA-0","1CC-0"])` 호출:

| 노드 | 속성 | Baseline 값 |
|---|---|---|
| 1C1-0 SubmitButton | backgroundColor | `#171717` |
| 1BV-0 Email Input | borderColor | `#E5E5E5` |
| 1BZ-0 Password Input | borderColor | `#E5E5E5` |
| 1C8-0 Google Button | borderColor | `#E5E5E5` |
| 1CA-0 Apple Button | borderColor | `#E5E5E5` |
| 1CC-0 Kakao Button | borderColor | `#E5E5E5` |

spec-4-02 Task 3 의 원본 값과 일치 ✓

### A-2 Mutation 적용

```
update_styles([
  {nodeIds: ["1C1-0"], styles: {backgroundColor: "#D01A3F"}},
  {nodeIds: ["1BV-0","1BZ-0","1C8-0","1CA-0","1CC-0"], styles: {borderColor: "#999999"}}
])
```

→ 6 개 노드 업데이트 성공 (MCP 응답: 각 nodeId 반환).
→ `get_screenshot(1BO-0)` — SubmitButton 빨강, 5 개 border 회색으로 시각 확인.

### A-3 재추출 + delta 검증

`get_computed_styles` 9 노드 (spec-4-02 batch 와 동일 스코프) 재조회.

#### Mutation 의도 토큰 — 2/2 PASS

| 노드 | 속성 | Before | After | 기대 | 판정 |
|---|---|---|---|---|:---:|
| 1C1-0 | backgroundColor | `#171717` | `#D01A3F` | `#D01A3F` | ✅ |
| 1BV-0 | borderColor | `#E5E5E5` | `#999999` | `#999999` | ✅ |
| 1C8-0 | borderColor | `#E5E5E5` | `#999999` | `#999999` | ✅ |
| (1BZ-0, 1CA-0, 1CC-0 는 15 토큰 외 범위 — 스크린샷에서 회색 확인으로 대체) | | | | | |

#### 불변 13 토큰 — 13/13 PASS (오염 0)

| # | 노드 | 속성 | Before (spec-4-02) | After (mutation 후) | 판정 |
|---|---|---|---|---|:---:|
| 1 | 1BO-0 | backgroundColor (card) | `#FFFFFF` | `#FFFFFF` | ✅ |
| 2 | 1BO-0 | borderColor (card) | `#E5E5E5` | `#E5E5E5` | ✅ (Input border 5 개만 변경, Card border 불변) |
| 3 | 1BO-0 | borderRadius | `8.75px` | `8.75px` | ✅ |
| 4 | 1BO-0 | paddingBlock/paddingInline | `32px` | `32px` | ✅ |
| 5 | 1BO-0 | gap | `24px` | `24px` | ✅ |
| 6 | 1BO-0 | boxShadow | `#0000001A 0px 1px 3px` | `#0000001A 0px 1px 3px` | ✅ |
| 7 | 1BQ-0 | color (title) | `#0A0A0A` | `#0A0A0A` | ✅ |
| 8 | 1BQ-0 | fontSize/fontWeight | `24px` / `600` | `24px` / `600` | ✅ |
| 9 | 1BR-0 | color (description) | `#737373` | `#737373` | ✅ |
| 10 | 1BS-0 | gap (form) | `16px` | `16px` | ✅ |
| 11 | 1BU-0 | color/fontWeight (label) | `#0A0A0A` / `500` | `#0A0A0A` / `500` | ✅ |
| 12 | 1C1-0 | height/borderRadius/width (button layout) | `40px` / `5px` / `100%` | `40px` / `5px` / `100%` | ✅ (bg 만 변경) |
| 13 | 1C2-0 | color/fontWeight (button text) | `#FAFAFA` / `500` | `#FAFAFA` / `500` | ✅ |

### A-4 결론 (RQ1)

**PASS** — Paper 는 부분 업데이트를 정확히 반영하면서 주변 토큰을 오염시키지 않는다.

**Tautology 관점**: spec-4-02 의 100% 는 "같은 값을 쓰고 같은 값을 읽음" 이었다. 본 실험은 **다른 값으로 덮어쓰고 다시 읽어 다름을 확인**. 이로써 "Paper 가 받은 값을 그대로 저장" 이라는 주장이 **여러 값에 대해 성립** 함을 증명 — "spec-4-02 가 단일 데이터 포인트의 우연한 성공이 아님" 을 입증. 다만 이는 여전히 **Paper 의 저장 충실도** 검증이지, "원본 의도 보존" 은 아니다 (의도 자체를 Paper 밖 기준에서 가져오지 않음).

**Stage 6 Iterate 증거 (RQ4 부분)**: 부분 업데이트 안정성 확인. 토큰 1 개 변경 → 주변 토큰 오염 0 은 실제 Stage 6 루프의 "DESIGN 일부 수정 → Paper 반영 → 코드 재생성" 흐름의 핵심 전제 조건. **본 실험이 Stage 6 의 완전 증거는 아니지만 핵심 조건을 충족**.

