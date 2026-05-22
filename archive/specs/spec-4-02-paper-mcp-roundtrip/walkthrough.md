# Walkthrough: spec-4-02

> Paper MCP 왕복 PoC (Research spec). LoginPage 15 토큰 왕복 정확도 측정.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 대상 페이지 | A) LoginPage 1개 / B) 3개 (Login+Signup+Dashboard) | **A** | PoC 범위 관리. 결과가 Go 로 나오면 후속 spec 에서 확장 |
| 정확도 기준 | A) 단일 80% (phase-4.md 원안) / B) 계열별 차등 (색 90 / 타이포 85 / 간격 75 / 그림자 70) | **B** | 토큰 계열별 자동화 난이도 차이가 체계적 |
| 실행 주체 | A) AI Agent direct / B) CLI 스크립트 | **A** | spec-4-01 이 정의한 AI 1급 역할과 일관 |
| Paper 작업 위치 | 사용자와 협의 → 새 아트보드 격리 | `LoginPage — spec-4-02 PoC (2026-04-22)` | 기존 11 아트보드와 분리 |
| 폰트 매핑 | system-ui → ? | **Inter** | Paper 에 system-ui 미지원 (RQ5 발견). Inter 는 shadcn 생태 표준 |
| Task 4+5 통합 커밋 | A) 분리 / B) 통합 | **B** | diff 표는 역추출 해석의 직접 산물, 별 commit 과잉 |
| 프로토콜 피드백 | A) 조건부 패스 / B) 반영 | **B** | 실전 관측 2 항 (색공간 정규화 / 폰트 가용성) — 프로토콜에 녹여야 후속 spec 이 같은 실수 피함 |

## 💬 사용자 협의

- **주제**: 스코프 결정 (8 항 일괄)
  - **사용자 의견**: `좋아` (기본값 수용)
  - **합의**: LoginPage 1 개 / 계열별 차등 기준 / AI direct / report+experiment 2 파일 / Paper 격리

- **주제**: Paper 작업 위치
  - **사용자 의견**: "page 를 다른거 써 보는거로 하자 새로 만들어서 해보는걸 추천해"
  - **합의**: Paper MCP 에 page 생성 도구 부재 확인 후 → 새 아트보드 `LoginPage — spec-4-02 PoC (2026-04-22)` 로 격리

- **주제**: Plan Accept
  - **사용자 의견**: `1`
  - **합의**: Strict Loop 진입, Task 3 Paper 쓰기 직전에 1 회 재확인

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: 해당 없음 (Research spec)
- **대체**: Paper MCP 호출 결과 (`get_computed_styles`) 를 픽스처 값과 수치 비교
- **결과**: ✅ **15/15 = 100%** match

#### 통합 테스트 (Integration Test Required = yes)
- **phase-4 통합 시나리오 1 (Paper 왕복)**:
  - Given: LoginPage DESIGN.md 픽스처 (15 토큰)
  - When: 정방향 (create_artboard + write_html × 6) + 역방향 (get_tree_summary + get_computed_styles batch)
  - Then: 계열별 차등 기준 모두 통과 — 색상 100% (≥90) / 타이포 100% (≥85) / 간격+radius 100% (≥75) / 그림자 100% (≥70)
- **결과**: ✅ PASS

### 2. 수동 검증

1. **Action**: `get_basic_info` — Paper 환경 파악
   - **Result**: "Welcome to Paper" / Page 1 / 11 artboards / Inter·Geist·JetBrains Mono. 기존 `1AX-0` e2e 아트보드 건드리지 않음.

2. **Action**: `get_font_family_info(["Inter", "Geist"])`
   - **Result**: 둘 다 100-900 weight 지원. Inter 선택.

3. **Action**: `create_artboard` + `write_html` × 6 — 점진 빌드 (Paper guide "Write small, write often")
   - **Result**: 아트보드 `1BN-0`, 총 29 노드 생성. Review Checkpoint 2 회 (중간 + 최종) PASS.

4. **Action**: `get_computed_styles` (9 node batch)
   - **Result**: 1 회 호출에 15 토큰 대응 값 전체 추출.

5. **Action**: 15 토큰 × {원본 / Paper observed} 표 작성
   - **Result**: 값 drift 0, 표기 drift 4 종 (oklch↔hex / rgba↔8-hex / padding 확장 / fontFamily fallback).

6. **Action**: Go/No-Go 판정 근거 검증
   - **Result**: 정확도 / 도구 커버리지 / 자동화 경계 모두 실무 임계치 이상. Go.

## 🔍 발견 사항

- **Paper 의 자동 정규화** — oklch/rgba 를 내부 표현 시 단일 형식으로 통일. 장점: 왕복 exact match. 단점: 원본 색공간 정보 손실 (다대일 대응). 실무에선 "저장값 기준 align" 으로 해결 가능.
- **역방향이 정방향보다 효율적** — 호출 수 11 vs 2 (5×). 역방향 쪽이 Decisive API 라 그렇게 설계된 느낌.
- **Paper MCP guide 의 "Write small, write often"** — 점진 빌드 원칙이 실제로 디버깅 / Review Checkpoint 에 유용. 한 번에 큰 HTML 주입해도 작동하지만, 중간 피드백이 사라짐.
- **collaboration-flow 의 hook-paper-extract / hook-paper-render 가 spec-4-02 에 실제 값으로 연결됨** — 프로토콜 앵커 설계가 의도대로 작동 (사전 선언 → 사후 증거 링크).
- **e2e-demo-loginpage.md 와의 차이** — 그 문서는 정방향만. 본 PoC 는 역방향 + 정확도 측정 + RQ 체계 포함으로 한 단계 더 나감. 두 문서 역할 충돌 없음 (e2e 는 구체 사례 / 본 PoC 는 Research 증거).

## 🚧 이월 항목

- **LoginPage variant 확장 (modal / bottom-sheet)** → Phase 5 PoC 후보
- **DashboardPage 왕복 PoC** → Phase 5 PoC 후보 (데이터 집약 페이지 검증)
- **paper-normalizer 유틸리티** (oklch↔hex, rgba↔8-hex, padding 확장 등 정규화 함수 라이브러리) → Studio v1 (phase-6) 에서 실제 필요 시 승격. Icebox 등재 추천.
- **상호작용 state 왕복** (hover / focus / disabled) → 별 spec 필요 여부는 Phase 5 에서 실감 여부 판단

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7 1M) + Dennis |
| **작성 기간** | 2026-04-22 (당일 완료) |
| **최종 commit** | `01717b4` (protocol feedback) — ship commit 전 |
| **Paper 호출 총** | 14 |
| **토큰 match** | 15 / 15 (100%) |
| **RQ5 갭** | 5 개 (모두 낮음/중간 심각도) |
