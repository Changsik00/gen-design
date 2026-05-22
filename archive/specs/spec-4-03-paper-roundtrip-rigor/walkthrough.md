# Walkthrough: spec-4-03

> spec-4-02 의 tautology 논란 + Stage 6 미검증을 독립 Opus 회고 결과를 바탕으로 보완.
> 실험 A Mutation + 실험 B Cross-artboard 로 저장 결정론은 강하게 증명, 원본 의도 보존은 Phase 5 이월 명시.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 보완 티어 | Minimal(A) / Standard(A+B) / Full(A+B+C) | **Standard (A+B)** | 사용자 선택 (2번). Tautology 는 깨지만 사용자 조작 없이 자동 수행 |
| Mutation 대상 | primary(bg) + border | 2 토큰 | 시각 분별력 + 여러 노드에서 참조 (불변 검증 풍부) |
| Mutation 값 | 빨강 #D01A3F + 회색 #999999 | 채택 | 원본과 명확히 구별, 육안 검증 용이 |
| 원복 방식 | snapshot/restore 부재 → 수동 원복 | update_styles 재호출 | Paper MCP 에 revert API 없음 |
| Cross-artboard 대상 | 1AX-0 (2026-04-12 e2e) | 채택 | 2 주 간격 + 다른 구현자 / 다른 폰트 / 다른 레이아웃 — 진짜 독립 세션 |
| Commit 분리 | One Task = One Commit 엄격 | 9 commit | spec-4-02 W4 재발 방지 |
| 하류 Phase 표현 완화 범위 | 언어만 vs 구조까지 | **언어 + 새 측정 대상 추가** | phase-5 spec-5-001 에 "원본 의도 보존" 을 최우선 측정 대상으로 추가 (단순 언어 교체 이상) |
| phase-4.md 재작성 톤 | "100% PASS" 철회 vs 단서 추가 | **재평가** — 기준 자체를 "표기 정규화 범위 내 안정" 으로 다운그레이드 + "원본 의도 보존" 은 별 축으로 분리 | 과대평가가 하류에 이미 퍼져 있어서 단순 단서 추가로는 불충분 |

## 💬 사용자 협의

- **주제**: 머지 진행 여부
  - **사용자 의견**: "이걸 위힘하는게 맞을까? 처리가 안되었는데 다음단계로 가는게 맞아? 그리고 증명도 안되었자나"
  - **합의**: Phase 4 PR #18 Draft 전환, spec-4-03 로 검증 재수행. Option A 채택.

- **주제**: 보완 티어 선택
  - **사용자 의견**: "2번으로" (Standard — A+B, 사용자 개입 0)
  - **합의**: Mutation + Cross-artboard 실측. 실험 C (사용자 조작) 는 Phase 5 PoC 의 실제 Designer 참여로 대체 가능.

- **주제**: Plan Accept
  - **사용자 의견**: `1`
  - **합의**: Strict Loop 진입.

## 🧪 검증 결과

### 1. Paper MCP 호출 총

| # | 호출 | 목적 |
|---|---|---|
| 1 | `get_computed_styles(6 nodes)` | A-1 Baseline |
| 2 | `update_styles(2 batches)` | A-2 Mutation 적용 |
| 3 | `get_screenshot(1BO-0)` | A-2 시각 증거 |
| 4 | `get_computed_styles(9 nodes)` | A-3 재추출 |
| 5 | `update_styles(2 batches)` | A-5 원복 |
| 6 | `get_screenshot(1BO-0)` | A-5 원복 증거 |
| 7 | `get_computed_styles(2 nodes)` | A-5 원복 검증 |
| 8 | `get_tree_summary(1AX-0)` | B-1 구조 |
| 9 | `get_computed_styles(8 nodes)` | B-2 cross-extract |
| 총 | 9 호출 | |

### 2. 실험 결과 요약

- **실험 A (Mutation Fidelity)**: PASS — 의도 2 토큰 정확 반영, 불변 13 토큰 오염 0
- **실험 B (Cross-artboard)**: PASS 강한 형태 — 2 독립 세션 14/15 공통 토큰 exact match
- **RQ1**: PASS / **RQ2**: PASS (강함) / **RQ3**: 부분 해소 / **RQ4**: Paper 측 전제 3/3 충족

### 3. 수동 검증 시나리오

1. **Mutation 후 스크린샷 시각 변경 확인** — SubmitButton 빨강, border 진해짐 육안 확인 ✓
2. **원복 후 스크린샷이 spec-4-02 최종과 일치** — 시각적 동일 확인 ✓
3. **실험 B 결과 표 field-by-field 재계산** — 14 exact match + 1 fontFamily 차이 (구현자 선택) 확인 ✓
4. **phase-4/5/7 + collaboration-flow 수정본 읽기 테스트** — "단서 없는 100% 주장" 모두 제거 확인 ✓

## 🔍 발견 사항

- **실험 B 가 가장 강한 증거** — 2 개 독립 세션의 토큰 exact match 가 본 spec 의 핵심 발견. Paper 의 "의미→저장표기" 매핑이 결정론적임을 증명. 단 여전히 Paper 밖 기준 (의도) 과의 대조는 아니다.
- **Paper 부분 업데이트가 주변 토큰을 오염시키지 않음** — 13/13 exact match. Stage 6 Iterate 설계 시 "전체 재렌더 vs 부분 업데이트" 갈림길에서 부분 업데이트가 안전한 선택임을 확인.
- **1AX-0 가 Inter 대신 Geist 를 사용** — 2026-04-12 세션에서 구현자가 다른 폰트를 선택. Paper 는 이를 그대로 저장. shadcn 생태의 "허용된 선택지" 범위 내라 품질 문제 없음.
- **spec-4-02 의 walkthrough §발견 사항 "역방향이 5× 효율" 재해석 필요** — 효율 주장이 여전히 유효하지만, 역방향이 "단순 readback" 이라는 점이 tautology 의 근본 원인이었다는 것을 이제 이해. Phase 5 에서 독립 source 비교 시 효율과 의미가 분리됨을 주의.

## 🚧 이월 항목

- **원본 의도 보존 완전 왕복 증명** — Phase 5 PoC 에서 Designer 직접 작성 시안 기준 측정
- **Stage 3 Blueprint / Stage 4 Compose 실측** — Phase 5 앱 A 생성 과정에서 흡수
- **Stage 6 Iterate 완전 3 축 동기화** — Phase 5 에서 tokens.json ↔ Paper ↔ 코드 왕복 측정
- **paper-normalizer 유틸리티 구현** — Phase 6 Studio v1 에서 실제 필요 시
- **C4 phase-ship.md 템플릿** — harness-kit upstream 기여

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7 1M) + Dennis |
| **작성 기간** | 2026-04-22 (당일 완료) |
| **Commit 수** | 9 (Pre-ship) + 1 (Ship) |
| **One Task = One Commit** | **엄격 준수** (W4 재발 방지) |
| **최종 commit** | `ce5e4cd` (Icebox 부채) — ship commit 전 |
| **MCP 호출** | 9 |
| **토큰 match (실험 B)** | 14 / 15 (fontFamily 는 구현자 선택 차이) |
