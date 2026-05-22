# spec-4-03: Paper MCP 왕복 검증 재수행 (Rigor)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-4-03` |
| **Phase** | `phase-4` |
| **Branch** | `spec-4-03-paper-roundtrip-rigor` |
| **Base** | `phase-4-collab-flow` |
| **상태** | Planning |
| **타입** | **Research** (spec-4-02 의 논리적 결함 보완) |
| **Integration Test Required** | yes (phase-4.md 통합 시나리오 1 재수행) |
| **작성일** | 2026-04-22 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-4-02 Paper MCP 왕복 PoC 가 "15/15 토큰 100% 일치" 로 완료되고 PR #17 머지 + Phase Ship PR #18 까지 생성됐다. 그러나 2026-04-22 독립 Opus 회고에서 다음 결함이 드러났다:

- **Critical C1+C2**: 정방향에서 AI 가 쓴 값을 역방향에서 AI 가 다시 읽는 구조 → 본질적으로 **tautology**. "Paper 가 자기가 받은 값을 잃지 않는다" 만 증명됐을 뿐, "원본 의도 보존" 은 미증명.
- **Warning W2**: 6 단계 프로토콜 중 Stage 2/5 만 실측. Stage 6 Iterate (시스템 핵심 루프) 는 미검증.

이 오류가 이미 `phase-4.md §검증 결과`, `phase-5.md spec-5-001`, `phase-7.md spec-7-004` 3 곳에 "100% 유지되는가" 라는 전제 가정으로 선 반영됐다 (pre-reflect commit `0ad306d`) — **하류 Phase 의 출발점을 오염** 시킨 상태.

### 문제점

1. **증명의 논리적 공백**: 같은 세션에서 쓰고 읽는 것은 Paper 의 "저장 결정론" 만 증명. 다른 값을 받으면 다르게 저장되는지, 다른 시점의 저장값과 비교했을 때 불변인지 테스트되지 않음.
2. **Stage 6 Iterate 미검증**: 프로토콜의 핵심인 "수정 반영 → 재동기화" 루프가 실제 Paper MCP 로 돌아가는지 미확인.
3. **하류 오염**: phase-5 / phase-7 가 "100% 왕복" 을 전제로 설계 중. 이 전제가 Phase 5 에서 깨지면 Phase 4 결함이 Phase 5 지연으로 전가.
4. **거버넌스 감사 누락**: 회고에서 드러난 W4 (One Task = One Commit 위반, `2242e89`) / C4 (phase-ship.md 템플릿 부재) 는 별 조치 없이 Ship 됐음.

### 해결 방안 (요약)

두 가지 **독립된 실험** 으로 tautology 를 깨고 Stage 6 증거를 확보한다:

1. **실험 A (Mutation Fidelity)** — 기존 아트보드 `1BN-0` 의 2 개 토큰을 `update_styles` 로 **의도적 변경** → 재추출해서 (a) 변경된 필드 정확히 delta (b) 변경 안 한 13 개 토큰 불변 을 검증. Stage 6 Iterate 의 프로그래매틱 proxy.
2. **실험 B (Cross-artboard 비교)** — 2026-04-12 에 만든 별개 아트보드 `1AX-0 LoginPage — DESIGN.md E2E Test` 에서 같은 토큰 추출 → `1BN-0` 결과와 비교. 다른 세션에서 저장된 값의 재현성 검증.

결과를 바탕으로 phase-4.md / phase-5.md / phase-7.md 의 과대평가 표현을 **단서 포함 현실적 기술** 로 다운그레이드하고, collaboration-flow.md 의 훅 앵커 검증 결과 링크를 업데이트.

## 🔬 연구 질문 (Research Questions)

- **RQ1 Mutation Fidelity** — 의도적 값 변경이 Paper 에 정확히 반영되고, 변경 안 한 다른 토큰은 불변인가? (Stage 6 의 "부분 업데이트 안정성")
- **RQ2 Cross-session 재현성** — 다른 세션에서 저장된 아트보드의 스타일 추출이 같은 의미 단위 (예: shadcn default card-border) 에 대해 동일한 hex 로 반환되는가?
- **RQ3 Tautology 해소** — A/B 두 실험의 결과가 **"spec-4-02 의 100% 는 tautology 이다"** 라는 가설을 반증하는가, 혹은 강화하는가?
- **RQ4 Stage 6 Iterate 실측 증거** — 본 실험이 Stage 6 의 Done 기준 (DESIGN · tokens · 코드 3 축 drift 0) 을 부분적으로라도 증명하는가?

## 🎯 요구사항

### Functional Requirements

1. **FR-1 Mutation 대상 확정**: `1BN-0` 내 2 개 토큰을 사전에 선정 (예: `--primary` #171717 → #D01A3F, `--border` #E5E5E5 → #999999). 대상과 기대 변경값을 실험 전에 문서화.
2. **FR-2 Mutation 실행**: `update_styles` 로 변경 적용, 즉시 `get_computed_styles` batch 재추출.
3. **FR-3 Delta 검증**: 변경된 2 토큰만 새 값, 나머지 13 토큰 불변 확인. 불변 위반 0 건이 통과 조건.
4. **FR-4 Cross-artboard 추출**: `1AX-0 LoginPage — DESIGN.md E2E Test` 의 Card / Button / Text 노드에서 동일 토큰 추출. `1BN-0` 결과와 field-by-field 비교.
5. **FR-5 Tautology 진단**: 두 실험 결과를 바탕으로 "왕복 100% 가 무엇을 증명했는지 / 무엇을 증명하지 않았는지" 명시적 서술.
6. **FR-6 Mutation 원복**: 실험 A 종료 후 `1BN-0` 를 원본 상태로 복구 (이후 아트보드가 포트폴리오로 남지 않도록).
7. **FR-7 하류 Phase 표현 정리**: phase-4.md §검증 결과 / phase-5.md spec-5-001 방향성 / phase-7.md spec-7-004 방향성 / collaboration-flow.md 훅 앵커 의 "100% 유지 / 100% 일치" 표현을 **스코프 단서 포함** 으로 수정.
8. **FR-8 거버넌스 부채 등재**: W4 / C4 를 Icebox 에 명시 (paper-normalizer 과 동일 수준 가시성).

### Non-Functional Requirements

1. **NFR-1 비파괴**: 다른 아트보드 (1AX-0 등) 에 쓰기 작업 0. `update_styles` 는 `1BN-0` 에만.
2. **NFR-2 재현성**: mutation 전/후 값 + 실행 명령을 실험 로그에 완전 기록.
3. **NFR-3 솔직한 결론**: 결과가 부분적이거나 실망스러우면 그대로 기술. "Go" 를 방어할 단서 삭제 금지.

## 🚫 Out of Scope

- **실험 C (사용자 조작)** — 사용자 결정으로 제외 (Standard 티어)
- **실험 D/E (Stage 3 Blueprint / Stage 4 Compose)** — 분리 spec 또는 Phase 5 PoC 로 이월
- **phase-ship.md 템플릿 harness-kit 에 추가** — upstream 기여 대상. 본 spec 은 Icebox 등재만
- **spec-4-02 의 `2242e89` commit rebase/split** — 이미 머지됨. 교훈만 기록

## ✅ Definition of Done (Research + Follow-up)

- [ ] 실험 A Mutation Fidelity — 대상 / 변경 / 재추출 / delta 판정 완료
- [ ] 실험 B Cross-artboard — `1AX-0` 추출 + `1BN-0` 대조 표 작성
- [ ] Tautology 진단 (RQ3) — 명시적 결론
- [ ] Stage 6 Iterate 증거 평가 (RQ4)
- [ ] `1BN-0` 원복 확인
- [ ] phase-4.md / phase-5.md / phase-7.md 과대평가 표현 수정
- [ ] collaboration-flow.md 훅 앵커 검증 링크 업데이트
- [ ] Icebox 에 W4 / C4 등재
- [ ] walkthrough.md / pr_description.md / `report.md` ship commit
- [ ] `spec-4-03-paper-roundtrip-rigor` 브랜치 push + PR 생성
