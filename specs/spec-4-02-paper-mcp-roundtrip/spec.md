# spec-4-02: Paper MCP 왕복 PoC

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-4-02` |
| **Phase** | `phase-4` |
| **Branch** | `spec-4-02-paper-mcp-roundtrip` |
| **Base** | `phase-4-collab-flow` (phase base branch) |
| **상태** | Planning |
| **타입** | **Research** (→ agent.md §9) |
| **Integration Test Required** | yes — phase-4.md 통합 시나리오 1 |
| **작성일** | 2026-04-22 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-4-01 에서 협업 Flow 프로토콜이 정의되어, Stage 2 **Extract** (`hook-paper-extract`) 와 Stage 5 **Render** (`hook-paper-render`) 의 도구 인터페이스가 명시되었다. 그러나 이 훅들의 **실제 동작 가능성과 정확도는 미검증** — Paper MCP 24 개 도구가 실제 왕복 시나리오에서 얼마나 자동화 가능한지 정량 근거가 없다.

부분적인 선례로 [`docs/guides/e2e-demo-loginpage.md`](../../docs/guides/e2e-demo-loginpage.md) 가 2026-04-12 에 정방향 일부를 수행했으나, **역방향 (Paper → DESIGN.md) 은 미탐색** 이고 왕복 정확도는 측정되지 않았다.

### 문제점

1. **자동화 경계 불명**: 어디까지 AI 가 자동 처리 가능하고 어디부터 수동 보정이 필요한지 답이 없다. spec-4-01 프로토콜의 "Done 기준" 이 실무 기준으로 동작하려면 이 경계가 필수.
2. **역방향 (Extract) 미검증**: `get_computed_styles / get_node_info / get_font_family_info` 결과를 DESIGN.md 의 14 섹션 (특히 §2 Colors / §3 Typography / §5 Layout / §6 Depth) 으로 매핑하는 변환 규칙이 없음.
3. **정확도 지표 부재**: phase-4.md 원안은 "토큰 값 80% 이상 일치" 라는 단일 기준만 제시. 토큰 계열별 난이도가 다르므로 (색상은 쉬움, 그림자는 어려움) **계열별 차등 기준** 이 필요.
4. **후속 Phase 의 PoC 전제**: Phase 5 (PoC 검증) 가 실제 앱 생성으로 전체 플로우를 돌릴 때, Stage 2/5 가 얼마나 자동화되는지는 핵심 병목 — 본 spec 의 결과가 Phase 5 의 기대치를 설정한다.

### 해결 방안 (요약)

**Research Spec** 으로 수행한다. Phase 2 의 LoginPage 기준 DESIGN.md 픽스처를 입력으로 삼아:

1. **정방향**: DESIGN.md → Paper 아트보드 생성 (`create_artboard`, `write_html`, `update_styles`). 원본 대비 렌더링 정확도 측정.
2. **역방향**: 위에서 만든 Paper 아트보드 → `get_computed_styles` 로 역추출 → DESIGN.md' (prime) 생성. DESIGN.md vs DESIGN.md' diff 계산.
3. **정확도 측정**: 핵심 15 토큰에 대해 계열별 차등 기준 (색상 ≥90% / 타이포 ≥85% / 간격 ≥75% / 그림자 ≥70%) 으로 판정.
4. **결과 기록**: `docs/experiments/paper-roundtrip-2026-04-22.md` 에 증거 로그, `specs/spec-4-02-.../report.md` (또는 spec.md 업데이트) 에 Trade-off / Recommendation.

## 🔬 연구 질문 (Research Questions)

- **RQ1 정방향 자동화율**: `DESIGN.md → Paper 아트보드` 를 Paper MCP 만으로 얼마나 수동 개입 없이 생성 가능한가? (% of fields auto-filled)
- **RQ2 역방향 자동화율**: `Paper 아트보드 → DESIGN.md` 로 토큰/레이아웃을 얼마나 정확히 역추출하는가? (% match vs original)
- **RQ3 왕복 drift**: 정방향 → 역방향 1 사이클 후 원본 DESIGN.md 와의 field-by-field 차이는? (drift per 토큰 계열)
- **RQ4 Done 기준 현실성**: spec-4-01 Stage 2 / Stage 5 의 Done 체크리스트를 실제 도구로 만족 가능한가? 불가능 항목이 있다면 어떤 조건에서?
- **RQ5 MCP 도구 커버리지 갭**: 현재 Paper MCP 24 도구로 해결 불가한 시나리오는? (예: 시안 일부만 추출, 특정 variant 변환 등)

## 🎯 요구사항

### Functional Requirements

1. **FR-1 픽스처 준비**: `specs/spec-4-02-paper-mcp-roundtrip/fixtures/LoginPage.DESIGN.md` (기존 `e2e-demo-loginpage.md` 의 LoginPage 명세를 구조화한 픽스처) 생성.
2. **FR-2 정방향 실행**: 픽스처 → Paper 아트보드 생성 실행. 아트보드 ID 기록.
3. **FR-3 역방향 실행**: 동일 아트보드에서 `get_computed_styles` 등으로 DESIGN.md' 역추출.
4. **FR-4 Diff 측정**: 15 핵심 토큰에 대해 field-by-field 비교 표 작성.
5. **FR-5 계열별 판정**: 색상 / 타이포 / 간격 / 그림자 4 계열 각각의 자동화율 (%) 산출 + 기준 통과 여부.
6. **FR-6 실험 로그**: `docs/experiments/paper-roundtrip-2026-04-22.md` 에 실행 명령 / 입력 / 출력 / 관측 결과 시간순 기록.
7. **FR-7 Research 보고**: Trade-off 분석 + Prototype 증거 + Go/No-Go Recommendation 을 본 spec.md Update 또는 별도 report.md 에 기록.
8. **FR-8 프로토콜 훅 피드백**: `docs/guides/collaboration-flow.md` 의 Stage 2 / Stage 5 Done 기준에 실전 관측 근거를 기반으로 보완 (필요 시).

### Non-Functional Requirements

1. **NFR-1 재현성**: 본 spec 의 walkthrough 만으로 다른 사람이 동일 MCP 환경에서 Re-run 가능해야 한다. 명령 / 파라미터 전부 기록.
2. **NFR-2 비파괴**: PoC 실행으로 Paper 내 기존 기타 작업에 영향 0. 생성 아트보드는 격리된 영역 (사용자 승인 지정) 에 생성.
3. **NFR-3 검증 가능**: 측정한 자동화율은 수치로 재검산 가능해야 한다 (raw diff 로그 보존).
4. **NFR-4 익명성**: 측정 결과에 실제 Paper 파일의 식별자 (파일명, 사용자 ID 등) 가 유출되지 않도록 로그 익명화.

## 🚫 Out of Scope

- **Figma 왕복** → spec-4-03
- **SignupPage / DashboardPage 확장** → 본 spec Recommendation 에 따라 후속 spec 으로 분리
- **Paper MCP 도구 확장 / 신규 개발** → Paper 팀 로드맵 대상
- **자동화 스크립트 작성** (CLI / GitHub Action 등) → 본 spec 은 MCP direct 실행. 스크립트화는 Studio v1 (phase-6)
- **Figma Dev Mode 비교 벤치마크** → 별 spec 가능

## 🔍 Critique 결과

미실행 (선택적).

## ✅ Definition of Done (Research Spec)

- [ ] **Trade-off 분석** — 정방향 vs 역방향 자동화 난이도 / 도구 커버리지 / 에러 양식 정량 비교
- [ ] **Prototype** — 실제 Paper MCP 호출 증거 (아트보드 ID / 로그) + 15 토큰 diff 표 존재
- [ ] **Recommendation** — 명시적 Go / No-Go 판정 + 자동화 가능 범위 서술
- [ ] 계열별 정확도 기준 통과 여부 기록 (색상 ≥90% / 타이포 ≥85% / 간격 ≥75% / 그림자 ≥70%)
- [ ] `docs/experiments/paper-roundtrip-2026-04-22.md` 실험 로그 작성
- [ ] `collaboration-flow.md` Stage 2 / Stage 5 Done 기준에 피드백 반영 (필요 시)
- [ ] walkthrough.md / pr_description.md ship commit
- [ ] `spec-4-02-paper-mcp-roundtrip` 브랜치 push 완료 (base = `phase-4-collab-flow`)
