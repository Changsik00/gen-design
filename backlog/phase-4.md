# phase-4: 협업 Flow 정의

> 디자이너↔프론트 워크플로우 프로토콜을 정의하고,
> Paper MCP와 Figma를 통한 양방향 동기화 PoC를 실행한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-4` |
| **상태** | In Progress |
| **시작일** | 2026-04-21 |
| **목표 종료일** | TBD |
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
4. Figma: tokens.json → Figma Variables 동기화 PoC 동작

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
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

### spec-4-003 — Figma 토큰 동기화 PoC

- **요점**: Figma Variables ↔ tokens.json 동기화 프로토타입
- **방향성**: Figma REST API 또는 Tokens Studio 활용. tokens.json → Figma Variables 푸시, Figma Variables → tokens.json 풀. 왕복 정확도 측정
- **참조**: [`docs/integrations/figma-sync.md`](../../docs/integrations/figma-sync.md)
- **연관 모듈**: `templates/assets/tokens/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: Paper 왕복 (Round-trip)

- **Given**: LoginPage의 DESIGN.md로 Paper 시안 생성
- **When**: Paper 시안에서 DESIGN.md 역추출
- **Then**: 원본과 추출본의 토큰 값이 80% 이상 일치
- **연관 SPEC**: spec-4-002

### 시나리오 2: Figma 토큰 동기화

- **Given**: tokens.json 파일
- **When**: Figma Variables로 푸시 후 다시 풀
- **Then**: 원본과 풀된 결과가 동일
- **연관 SPEC**: spec-4-003

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

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
