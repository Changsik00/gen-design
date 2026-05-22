# Research Report: spec-4-02 — Paper MCP 왕복 PoC

## 🏁 결론 (Go/No-Go)

**Go — LoginPage 스코프에서 Paper MCP 왕복은 자동화 가능.** 15 핵심 토큰 전 계열 100% 일치. 정규화 함수 1 벌 추가만으로 DESIGN.md ↔ Paper 양방향 동기화가 재현 가능하다.

> ⚠ **단서**: 본 결과는 Tailwind + shadcn/ui 기반의 정적 `page` variant 1 개에 국한. `modal` / `bottom-sheet` / 상호작용 있는 컴포넌트 / SignupPage / DashboardPage 확장은 후속 PoC 필요.

---

## 1. Trade-off 분석

### 정방향 (DESIGN → Paper)

| 항목 | 결과 |
|---|---|
| 필요 MCP 도구 | `create_artboard`, `write_html`, `update_styles`, `get_font_family_info`, `get_screenshot`, `finish_working_on_nodes` (6 종) |
| 호출 횟수 (LoginPage) | 11 회 (환경확인 2 + 아트보드 1 + write 6 + 스크린샷 2) |
| 자동화 난이도 | **낮음** (HTML + 인라인 스타일만으로 충분. Paper 가 CSS → 내부 표현 정상 변환) |
| 사람 개입 지점 | 폰트 선택 (system-ui → Inter 매핑), 작업 위치 승인 |
| 실패 모드 | grid/margin 사용 시 렌더 실패 (guide 명시) — 프로젝트가 이미 flex 기반이라 영향 없음 |

### 역방향 (Paper → DESIGN)

| 항목 | 결과 |
|---|---|
| 필요 MCP 도구 | `get_tree_summary`, `get_computed_styles`, `get_node_info` (3 종) |
| 호출 횟수 (LoginPage 15 토큰) | 2 회 (tree 1 + batch styles 1) |
| 자동화 난이도 | **매우 낮음** (batch 지원으로 1 회 호출에 9 노드 추출) |
| 사람 개입 지점 | 없음 — `get_computed_styles` 의 배치 추출이 결정적 |
| 실패 모드 | 노드 선택 기준 (어떤 노드가 Card / Button 인지) 을 휴리스틱에 의존 → 대규모 시 레이어명 / 트리 구조에 의존 |

### 비교 결론

| 축 | 정방향 | 역방향 | 코멘트 |
|---|:---:|:---:|---|
| 자동화 난이도 | 낮음 | 매우 낮음 | 역방향이 더 쉬움 (decisive API) |
| 호출 수 | 11 | 2 | 역방향이 5× 효율 |
| Drift 위험 | 낮음 (표기 정규화만) | 낮음 (값 동등) | 둘 다 양호 |
| MCP 도구 충분성 | 충분 | 충분 | 도구 커버리지 갭 없음 |
| 품질 리스크 | 수작업 HTML 구조 설계 | 없음 | 정방향의 리스크는 "시각 품질" (review checkpoint 필요) |

→ **정방향이 미세하게 더 어려움**. 역방향은 거의 기계적.

---

## 2. 자동화 경계 (Where automation ends)

### 자동화 가능 (본 PoC 검증됨)
- ✅ 정적 페이지 1 개의 전체 렌더링 (LoginPage page variant)
- ✅ Tailwind 기반 토큰 (색상 / 간격 / 타이포 / radius / shadow) 의 양방향 정확 매핑
- ✅ oklch / rgba / hex 색공간의 자동 정규화
- ✅ 폰트 가용성 확인 + weight 선택

### 수동 보정 필요 (본 PoC 관측)
- ⚠ **폰트 매핑**: `system-ui` 처럼 Paper 미지원 family → 실제 폰트명으로 명시 변환 필수 (1 회성, 픽스처 시점에서 가능)
- ⚠ **페이지 격리**: page 생성 도구 부재 → 아트보드 네이밍 관례 (`{page-id} — {spec-id} PoC`) 로 관리
- ⚠ **시각 품질 검토**: 정방향 렌더 후 review checkpoint (spacing / typography / contrast / alignment / clipping / repetition) 는 사람 또는 AI 시각 판단 필요

### 현재 PoC 로는 미결 (후속 필요)
- ? **상호작용 상태**: hover / focus / disabled variant 동기화 (본 PoC 는 default state 만)
- ? **복잡도 확장**: DashboardPage 같은 데이터 집약 페이지에서도 같은 정확도 유지?
- ? **배치 규모**: 페이지 N 개 동시 처리 시 호출 수 / 속도 이슈

---

## 3. 연구 질문 답변

### RQ1. 정방향 자동화율
**답**: 15/15 = 100% (LoginPage 핵심 토큰). 6 번의 `write_html` + 1 번의 `create_artboard` 로 전체 페이지 구성 완료. 수동 보정 없음 (폰트 매핑은 픽스처 시점 1 회성).

### RQ2. 역방향 자동화율
**답**: 15/15 = 100%. 1 번의 `get_tree_summary` + 1 번의 `get_computed_styles(batch)` 로 완전 추출. 사람 개입 0.

### RQ3. 왕복 drift
**답**: **값 drift 0 / 표기 drift 있음**. 모든 토큰이 수학적 동등. 표기 차이 4 종:
1. `oklch(...)` ↔ `#HEX` (색공간 변환)
2. `rgba(r,g,b,a)` ↔ `#RRGGBBAA` (shadow color 8-hex)
3. `padding: 32px` ↔ `paddingBlock/paddingInline: 32px` (CSS 확장 속성)
4. `"Inter, sans-serif"` → `"Inter", system-ui, sans-serif` (fallback 자동 부착)

모두 **정규화 함수 1 벌**로 대응 가능 — 자동화 비용 낮음.

### RQ4. Done 기준 현실성
**답**: `collaboration-flow.md` §4.2 (Stage 2 Extract) / §4.5 (Stage 5 Render) 의 Done 기준 모두 달성 가능. 다만 다음 2 항목은 명시 추가 제안:
- Stage 5 Done: "폰트 가용성 사전 확인 (get_font_family_info)" 을 명시적 체크로 추가
- Stage 2 Done: "색공간 정규화 (oklch→hex) 는 손실 없음, 단 역방향 복원은 다대일" 을 주석으로 추가

### RQ5. MCP 도구 커버리지 갭
**답**: 5 개 관측, 모두 실무 수준에 치명적 아님.

| # | 갭 | 심각도 | 대응 |
|---|---|:---:|---|
| R5-1 | page 생성/관리 도구 부재 | 낮음 | 아트보드 네이밍 관례로 대체 |
| R5-2 | system-ui 등 system font 미지원 | 중간 | 픽스처 시점에 매핑 |
| R5-3 | display: grid / margin 미지원 | 낮음 | flex 기반 작성 (프로젝트 관례 일치) |
| R5-4 | 색공간 / fallback / padding 자동 정규화 | 낮음 | 정규화 함수 |
| R5-5 | 대량 변환 배치 전략 부재 | 낮음 (본 PoC 미관찰) | 필요 시 duplicate_nodes + update_styles |

---

## 4. MCP 도구 사용 빈도

| 도구 | 사용 | 비고 |
|---|:---:|---|
| `get_basic_info` | 1 | 환경 확인 필수 |
| `get_font_family_info` | 1 | 폰트 매핑 전 필수 |
| `create_artboard` | 1 | 루트 아트보드 1 개 |
| `write_html` | 6 | 점진적 빌드 (Paper guide "Write small, write often") |
| `get_screenshot` | 2 | 중간 + 최종 Review Checkpoint |
| `finish_working_on_nodes` | 1 | 작업 마킹 해제 |
| `get_tree_summary` | 1 | 역추출 구조 파악 |
| `get_computed_styles` | 1 (batch) | 9 노드 배치 — 15 토큰 전체 커버 |
| `get_node_info` | 0 | 본 PoC 에선 get_computed_styles + tree summary 로 충분 |
| **합계** | **14** | — |

---

## 5. 후속 spec 권장사항

### 권장 (우선순위 순)

1. **spec-4-03 Figma 토큰 동기화 PoC** — 이미 Phase 4 로드맵. Paper 왕복이 100% 동작한 것과 비교 지점이 됨.
2. **spec-5-xx LoginPage variant 확장 PoC** (Phase 5 후보) — `modal` / `bottom-sheet` variant 의 왕복 정확도. 상호작용 state 포함.
3. **spec-5-yy DashboardPage 왕복 PoC** — 데이터 집약 페이지에서도 같은 정확도 유지 검증.
4. **spec-x-paper-normalizer** (Icebox) — oklch↔hex, rgba↔8-hex, padding 정규화 함수 라이브러리화. 실제로 Studio v1 (phase-6) 에서 필요할 때 승격.

### Non-권장 (본 PoC 결과로 불필요 판명)
- Paper 대체 도구 비교 spec — 커버리지 갭 5 개 모두 실무 수준에서 해결 가능
- MCP 도구 확장 요청 spec — 현재 24 도구로 충분

---

## 6. 프로토콜 피드백 (collaboration-flow.md 반영 제안)

Task 6-2 로 수행. 다음 2 항목을 Stage 2 / Stage 5 Done 기준에 추가 제안:

- **Stage 2 Extract Done 에 추가**: "색공간 정규화 표기는 sRGB hex 로 저장 — 역방향 oklch 복원은 다대일 (정보 손실 가능). 원본 oklch 필요 시 별도 메타 보관."
- **Stage 5 Render Done 에 추가**: "렌더 전 `get_font_family_info` 로 폰트 가용성 확인 — system-ui 등 abstract family 는 구체 family 로 매핑."

---

## 7. 재현 가능성

본 보고서 + [`docs/experiments/paper-roundtrip-2026-04-22.md`](../../docs/experiments/paper-roundtrip-2026-04-22.md) 로 다른 사람이 동일 MCP 환경에서 동일 결과 재현 가능. 픽스처 [`fixtures/LoginPage.DESIGN.md`](./fixtures/LoginPage.DESIGN.md) 는 불변 입력.

---

## 8. 메타

| 항목 | 값 |
|---|---|
| 실행일 | 2026-04-22 |
| Paper 파일 | "Welcome to Paper" |
| 아트보드 | `1BN-0` LoginPage — spec-4-02 PoC (2026-04-22) — 보존 |
| MCP 호출 총 | 14 |
| 측정 토큰 | 15 / 15 match (100%) |
| 수행자 | Agent (Opus 4.7 1M) + Dennis |
