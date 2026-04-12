# phase-7: 디자인 도구 연동 심화

> Paper, Stitch, Figma와의 양방향 연동 파이프라인 안정화.
> Phase 4 PoC를 프로덕션 수준으로 격상한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-7` |
| **상태** | Planning |
| **시작일** | TBD |
| **목표 종료일** | TBD |
| **소유자** | Dennis |
| **Base Branch** | 없음 |

## 🎯 배경 및 목표

### 현재 상황

Phase 4에서 Paper MCP와 Figma 동기화 PoC를 수행했다. Phase 5 PoC에서 실제 앱에 적용하며 피드백을 받았다. 이제 PoC 수준의 연동을 안정적인 파이프라인으로 격상해야 한다.

### 목표 (Goal)

Paper, Stitch, Figma와의 양방향 연동을 안정화하고, 디자인 도구 ↔ DESIGN.md ↔ React 코드 삼각 동기화를 실현한다.

### 성공 기준 (Success Criteria) — 정량 우선

1. Paper: DESIGN.md → Paper 시안 자동 생성 파이프라인 안정 동작
2. Paper: Paper 시안 → DESIGN.md 역추출 정확도 90%+
3. Stitch: 연동 가능성 보고서 또는 프로토타입
4. Figma: Variables ↔ 토큰 동기화 안정 동작
5. Figma: 컴포넌트 → DESIGN.md 변환 프로토타입

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
<!-- sdd:specs:end -->

### spec-7-001 — Paper 정방향 파이프라인 안정화

- **요점**: DESIGN.md → Paper MCP 시안 자동 생성을 프로덕션 수준으로
- **방향성**: Phase 4 PoC 기반. 토큰 매핑 정확도 향상, 컴포넌트 생성 자동화, 에러 핸들링
- **연관 모듈**: Paper MCP

### spec-7-002 — Paper 역방향 추출 안정화

- **요점**: Paper 시안에서 DESIGN.md 역추출 정확도 향상
- **방향성**: get_computed_styles, get_screenshot 등 MCP 도구 활용. 색상·타이포·레이아웃 정보를 토큰으로 정확히 추출
- **연관 모듈**: Paper MCP

### spec-7-003 — Stitch 연동 탐색

- **요점**: Stitch와 DESIGN.md 연동 가능성 리서치
- **방향성**: Stitch MCP 서버/SDK 탐색, DESIGN.md ↔ Stitch 프로젝트 매핑 방법 조사. 리서치 Spec
- **연관 모듈**: 없음 (리서치)

### spec-7-004 — Figma Variables 동기화 안정화

- **요점**: Figma Variables ↔ tokens.json 양방향 동기화를 안정적으로
- **방향성**: Phase 4 PoC 기반. Figma REST API 또는 Tokens Studio. 배치 처리, 충돌 해결
- **연관 모듈**: `templates/assets/tokens/`

### spec-7-005 — Figma 컴포넌트 변환

- **요점**: Figma 컴포넌트 → DESIGN.md 컴포넌트 섹션 변환
- **방향성**: Figma API로 컴포넌트 트리 읽기 → Schema의 컴포넌트 섹션으로 매핑
- **연관 모듈**: `schema/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: Paper 왕복 (Round-trip)

- **Given**: DESIGN.md로 Paper 시안 생성
- **When**: Paper 시안에서 DESIGN.md 역추출
- **Then**: 원본과 추출본의 토큰 값이 90% 이상 일치
- **연관 SPEC**: spec-7-001, spec-7-002

### 시나리오 2: Figma 토큰 동기화

- **Given**: tokens.json 파일
- **When**: Figma Variables로 푸시 후 다시 풀
- **Then**: 원본과 풀된 결과가 동일
- **연관 SPEC**: spec-7-004

## 🔗 의존성

- **선행 phase**: phase-6 (Studio v1 — 연동 대상 앱)
- **외부 시스템**: Paper MCP, Stitch, Figma API
- **연관 ADR**: 없음

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Figma API rate limit / Variables 접근 권한 | 동기화 불안정 | 배치 처리, 캐싱, 오프라인 폴백 |
| Stitch API 비공개 또는 불안정 | 연동 불가 | 리서치 Spec으로 선행 탐색, 불가 시 스코프 제외 |
| Paper 역추출 90% 목표 미달 | 수동 보정 부담 | 자동화율 단계적 향상, 80%부터 출시 허용 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
