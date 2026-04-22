# phase-4: 협업 Flow 정의

> 디자이너↔프론트 워크플로우 프로토콜을 정의하고,
> Paper MCP와 Figma를 통한 양방향 동기화 PoC를 실행한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-4` |
| **상태** | Done |
| **시작일** | 2026-04-21 |
| **종료일** | 2026-04-22 |
| **소유자** | Dennis |
| **Base Branch** | `phase-4-collab-flow` |

## 🎯 배경 및 목표

### 현재 상황

Phase 1~3에서 Foundation, Page Template, Blueprint가 완성되어도, **"디자이너와 프론트가 실제로 어떻게 협업하는가"**에 대한 프로토콜이 없으면 도구만 있고 쓰는 방법이 없는 상태가 된다. 현재 Figma Dev Mode가 업계 표준이지만, AI 기반 워크플로우는 아직 없다.

### 목표 (Goal)

1. 디자이너↔프론트 협업 워크플로우 프로토콜을 문서화한다
2. Paper MCP를 통한 양방향 동기화(디자인→코드, 코드→디자인) PoC를 실행한다
3. Figma Variables ↔ 디자인 토큰 동기화 PoC를 실행한다

### 성공 기준 (Success Criteria) — 정량 우선

1. 협업 Flow 프로토콜 문서 완성 (역할별 단계, 입출력, 도구 명시)
2. Paper MCP: DESIGN.md → Paper 시안 생성 PoC 동작
3. Paper MCP: Paper 시안 → DESIGN.md 역추출 PoC 동작
4. ~~Figma: tokens.json → Figma Variables 동기화 PoC 동작~~ → **phase-7 (디자인 도구 연동 심화) 로 이월 (2026-04-22 결정)**. 사유: Figma Enterprise Variables API / Tokens Studio 접근 환경 준비 미완. Paper MCP 왕복 PoC (spec-4-02) 결과가 Phase 핵심 가설을 충분히 검증 (15/15 토큰 100%).

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-4-01` | collab-flow-protocol | P? | Merged | `specs/spec-4-01-collab-flow-protocol/` |
| `spec-4-02` | paper-mcp-roundtrip | P? | Merged | `specs/spec-4-02-paper-mcp-roundtrip/` |
| `spec-4-03` | paper-roundtrip-rigor | P? | Merged | `specs/spec-4-03-paper-roundtrip-rigor/` |
<!-- sdd:specs:end -->

### spec-4-001 — 협업 Flow 프로토콜

- **요점**: 디자이너↔프론트 워크플로우를 단계별로 정의
- **방향성**:
  ```
  디자이너                              프론트
     │                                   │
     ├─ Paper/Figma에서 시안 ──────────→ DESIGN.md 자동 추출
     │                                   │
     │                              Blueprint 질의서 실행
     │                                   │
     │                              Page Template 조합 + 코드 생성
     │                                   │
     ├─ Paper에서 결과 리뷰 ←─────────── 코드를 Paper에 렌더링
     │                                   │
     ├─ 수정사항 반영 ─────────────────→ DESIGN.md 업데이트 → 코드 재생성
     │                                   │
     └─ 최종 승인 ─────────────────────→ 머지
  ```
  각 단계의 입력/출력, 사용 도구, 역할 책임을 명확히 문서화
- **연관 모듈**: `docs/`

### spec-4-002 — Paper MCP 양방향 동기화 PoC

- **요점**: Paper MCP로 DESIGN.md → 시안, 시안 → DESIGN.md 양방향 동작 확인
- **방향성**: 정방향 — Phase 2의 LoginPage DESIGN.md로 Paper에 시안 생성. 역방향 — Paper의 get_computed_styles 등으로 토큰 역추출. 왕복(round-trip) 정확도 측정
- **참조**: [`docs/integrations/paper-mcp.md`](../../docs/integrations/paper-mcp.md)
- **연관 모듈**: Paper MCP

### ~~spec-4-003~~ — **phase-7 로 이월**

- **상태**: 본 phase 에서 착수하지 않음 (2026-04-22 결정). phase-7 (디자인 도구 연동 심화) 의 선두 spec 으로 재등장 예정.
- **사유**: Figma Enterprise Variables API / Tokens Studio 접근 환경 준비 미완. Paper MCP 왕복 PoC (spec-4-02) 결과가 Phase 핵심 가설 (양방향 자동화 가능성) 을 충분히 검증.
- **요점 (이월분)**: Figma Variables ↔ tokens.json 동기화 프로토타입
- **방향성 (이월분)**: Figma REST API 또는 Tokens Studio 활용. tokens.json → Figma Variables 푸시, Figma Variables → tokens.json 풀. 왕복 정확도 측정
- **참조**: [`docs/integrations/figma-sync.md`](../../docs/integrations/figma-sync.md)

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: Paper 왕복 (Round-trip)

- **Given**: LoginPage의 DESIGN.md로 Paper 시안 생성
- **When**: Paper 시안에서 DESIGN.md 역추출
- **Then**: 원본과 추출본의 토큰 값이 80% 이상 일치
- **연관 SPEC**: spec-4-002

### ~~시나리오 2: Figma 토큰 동기화~~ → phase-7 이월

- 본 phase 에서 실행하지 않음. phase-7 (디자인 도구 연동 심화) 에서 수행.

## 🔗 의존성

- **선행 phase**: phase-3 (App Blueprint — 전체 워크플로우에서 Blueprint 위치 확정)
- **외부 시스템**: Paper MCP, Figma API / Tokens Studio
- **연관 ADR**: 없음

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Paper MCP 역추출 정확도 한계 | 수동 보정 필요량 증가 | 자동화율 측정, 현실적 기대치 설정 |
| Figma API rate limit / Variables 접근 권한 | 동기화 불안정 | 배치 처리, 오프라인 폴백 |
| 협업 프로토콜이 실제 사용에서 번거로울 수 있음 | 채택률 저하 | PoC (Phase 5)에서 실제 협업 시뮬레이션으로 검증 |

## 🏁 Phase Done 조건

- [x] 모든 SPEC 이 merge (spec-4-01 · spec-4-02 — spec-4-003 은 phase-7 이월)
- [x] 통합 테스트 전 시나리오 PASS (시나리오 1 Paper 왕복 100%; 시나리오 2 Figma 는 phase-7 이월)
- [x] 성공 기준 정량 측정 결과 (하단 §검증 결과 참조)
- [x] 사용자 최종 승인 (2026-04-22 Phase Ship go)

## 📊 검증 결과 (2026-04-22, spec-4-03 rigor 반영)

> 본 섹션은 2026-04-22 독립 Opus 회고 및 spec-4-03 재검증 결과를 반영한 **최종 판정**.
> 이전 초안 (spec-4-02 단독) 의 "100%" 주장은 스코프 단서를 누락한 과대평가였으며, 본 내용으로 대체됨.

### 성공 기준 — 증명 범위 재정의

| # | 기준 | spec-4-02 주장 | spec-4-03 재평가 | 결과 |
|---|---|---|---|:---:|
| 1 | 협업 Flow 프로토콜 문서 완성 | ✅ | 문서 형식 완비. **6 단계 중 Stage 2/5 만 실측, Stage 1/3/4/6 은 Phase 5 이월** | ✅ (단서: 4 단계 미실측) |
| 2 | Paper: DESIGN → 시안 PoC | ✅ "100%" | **표기 정규화 범위 내 안정 저장** 확인. 원본 의도 보존은 미증명 | ⚠ 조건부 PASS |
| 3 | Paper: 시안 → DESIGN 역추출 PoC | ✅ "100%" | 실험 A (부분 업데이트 안정) + 실험 B (2 독립 세션 14/15 exact match) 로 **저장 결정론 강하게 증명**. 원본 의도 보존은 별도 증명 필요 | ⚠ 조건부 PASS |
| 4 | Figma 동기화 PoC | — | — | ⏭ 이월 → phase-7 spec-7-004 |

### 통합 시나리오 — 재평가

| 시나리오 | 원 기준 | 실제 증명 범위 | 결과 |
|---|---|---|:---:|
| 1. Paper 왕복 (토큰 값 80% 이상 일치) | 단일 사이클 일치율 | spec-4-02: 같은 세션 write-read 15/15 (tautology) · spec-4-03 A: 부분 업데이트 정확 반영 · spec-4-03 B: 2 독립 세션 14/15 | ✅ **저장 결정론** PASS |
| (암묵) 원본 디자인 의도 보존 | 명시 안 됨 | **미증명** — 의도 기준을 Paper 밖에서 가져오지 않음 | ⚠ Phase 5 PoC 이월 |
| 2. Figma 토큰 동기화 | — | — | ⏭ 이월 |

### Spec 현황

| ID | 상태 | PR |
|---|---|---|
| spec-4-01 collab-flow-protocol | Merged | #16 |
| spec-4-02 paper-mcp-roundtrip | Merged | #17 |
| spec-4-03 paper-roundtrip-rigor | Merged | #19 |
| ~~spec-4-03 figma-token-sync~~ (원안) | 이월 → phase-7 spec-7-004 | — |

### 실측 / 미실측 프로토콜 단계

| 단계 | 실측 여부 | 증거 |
|---|:---:|---|
| Stage 1 Ideate | ✗ 자동화 대상 아님 | — (선언) |
| Stage 2 Extract | ○ 부분 | spec-4-02 역방향 + spec-4-03 A/B |
| Stage 3 Blueprint | ✗ 미실측 | Phase 3 산출 참조만 |
| Stage 4 Compose | ✗ 미실측 | Phase 2 산출 참조만 |
| Stage 5 Render | ○ 부분 | spec-4-02 정방향 |
| Stage 6 Iterate | ○ **부분** | spec-4-03 A (부분 업데이트 안정) — 완전 3 축 동기화는 Phase 5 |

### 후속 조치 (선 반영 완료)

- **phase-7.md** spec-7-004 — Figma 이월 컨텍스트 + spec-4-02 선행 증거 링크 (2026-04-22 선 반영)
- **phase-5.md** spec-5-001 — LoginPage variant / Dashboard 왕복 / 상호작용 state + **원본 의도 보존 검증** 을 첫 번째 측정 대상으로 추가 (spec-4-03 Task 6-2 완화)
- **backlog/queue.md Icebox** — paper-normalizer / 대량 변환 배치 / harness-kit follow-up + W4/C4 거버넌스 부채 등재
- **docs/guides/collaboration-flow.md** hook 앵커 — spec-4-02 + spec-4-03 결과 링크 + 단서 포함 서술

### Phase 의 핵심 가설 재평가

> "AI 에이전트가 디자인 도구와 코드 사이 **왕복 자동화** 가능한가?"

- **증명됨 (강한 형태)**: Paper MCP 는 임의 값을 손실 없이 저장하고, 부분 업데이트 시 주변 토큰을 오염시키지 않으며, 2 독립 세션에서 의미→저장표기 매핑이 결정론적이다. 이는 **자동화의 하드웨어적 가능성** 에 해당.
- **미증명**: 원본 디자인 의도 → Paper → 재추출 → 의도 복원 의 **완전 왕복**. Designer 가 Paper UI 로 직접 수정했을 때 AI 가 의도를 정확히 파싱하는지. 코드 ↔ Paper ↔ DESIGN.md 3 축 동기화.
- **Phase 5 PoC 로 이월된 증명 과제**: 실제 앱 A 생성 과정에서 원본 의도 보존 측정을 첫 번째 검증 대상으로 지정.

### Phase Done 판정

Phase 4 는 **"프로토콜 정의 + Paper 측 저장 결정론 증명"** 으로 완료. "완전 왕복 자동화 증명" 은 Phase 5 PoC 의 과제로 명시 이월.
