# docs(spec-4-02): Paper MCP 왕복 PoC

> Research spec. LoginPage 15 토큰 왕복 정확도 **100%** — Go/No-Go 판정 **Go**.

## 📋 Summary

### 배경 및 목적

spec-4-01 에서 협업 Flow 프로토콜의 Stage 2 Extract (`hook-paper-extract`) 와 Stage 5 Render (`hook-paper-render`) 훅을 선언했으나, **실제 동작 가능성과 정확도는 미검증** 이었다. 본 PoC 는 Phase 2 LoginPage 를 입력으로 Paper MCP 왕복 (정방향 + 역방향) 을 실행하고, 15 핵심 토큰에 대해 계열별 차등 기준 (색상 ≥90% / 타이포 ≥85% / 간격 ≥75% / 그림자 ≥70%) 을 적용해 자동화 경계를 정량 측정했다.

### 주요 변경 사항

- [x] **실제 Paper MCP 호출 14 회** 로 LoginPage 왕복 실행 (환경확인 2 + 렌더 9 + 역추출 2 + 마킹 1)
- [x] `specs/spec-4-02-paper-mcp-roundtrip/fixtures/LoginPage.DESIGN.md` — 14 섹션 구조 픽스처, 15 측정 토큰 명시
- [x] `docs/experiments/paper-roundtrip-2026-04-22.md` — 시간순 실행 로그 + diff 표 + RQ5 갭 기록
- [x] `specs/spec-4-02-paper-mcp-roundtrip/report.md` — Research 보고서 (결론 / Trade-off / RQ 답변 / 후속 spec 권장)
- [x] `docs/guides/collaboration-flow.md` Stage 2 / Stage 5 Done 기준 보완 + hook 앵커에 검증 결과 링크
- [x] 측정 결과: **15/15 = 100%** 토큰 일치, 전 계열 기준 PASS

### Phase 컨텍스트

- **Phase**: `phase-4` (협업 Flow 정의)
- **Base Branch**: `phase-4-collab-flow` — 본 PR 의 타겟
- **본 SPEC 의 역할**: spec-4-01 프로토콜의 실행 가능성을 실측으로 검증. phase-4.md 통합 시나리오 1 (Paper 왕복) 을 수행하고 Go/No-Go 로 마무리.

## 🎯 Key Review Points

1. **Go 판정의 타당성** — "LoginPage 스코프에서 Go" 로 좁게 판정. modal / bottom-sheet / 상호작용 / DashboardPage 는 후속 PoC 필요 (report §자동화 경계).
2. **계열별 차등 기준 채택** — 단일 80% 대비 계열별 (90/85/75/70) 은 더 엄격. phase-4.md 원안 수정은 본 spec 에서 하지 않음 — Phase Ship 시점 재검토.
3. **표기 drift 4 종 정규화 필요성** — oklch↔hex / rgba↔8-hex / padding 확장 / fontFamily fallback. report §6 의 `paper-normalizer` 권장이 Studio v1 (phase-6) 실제 필요 시 승격 대상.
4. **collaboration-flow 갱신 범위** — Stage 2/5 Done 에 2 항 추가만. 본문 구조는 불변 (NFR-3 확장성 유지). 승인 여부.
5. **Paper 아트보드 보존** — `1BN-0` 보존 처리 (finish_working_on_nodes). 물리적 삭제는 사용자 판단.
6. **e2e-demo-loginpage.md 와의 역할 구분** — e2e 는 구체 사례 / 본 PoC 는 Research 증거. 중복 없음.

## 🧪 Verification

### 자동 테스트 (Research 기준)

```bash
# 해당 없음 (docs-only + MCP 직접 호출)
# 재현: Paper MCP 환경에서 report.md §7 재현 가능성 참조
```

**결과 요약**:
- ✅ 색상 계열: 6/6 = 100% (≥90% 기준 PASS)
- ✅ 타이포 계열: 4/4 = 100% (≥85% 기준 PASS)
- ✅ 간격 + Radius 계열: 4/4 = 100% (≥75% 기준 PASS)
- ✅ 그림자 계열: 1/1 = 100% (≥70% 기준 PASS)
- ✅ **전체 15/15 = 100% — 전 계열 기준 PASS**

### 통합 테스트 (Integration Test Required = yes)

**phase-4.md 통합 시나리오 1 (Paper 왕복)**:
- Given: LoginPage DESIGN.md 픽스처
- When: 정방향 + 역방향 1 사이클 실행
- Then: 원본과 추출본 토큰 값이 80% 이상 일치

**결과**: ✅ **100%** (원안 80% 대비 여유)

### 수동 검증 시나리오

1. **Re-run 가능성**: walkthrough + experiment log 로 재실행 가능한지 → ✅ 명령/파라미터 전부 기록
2. **픽스처 정합성**: fixtures/LoginPage.DESIGN.md 값 vs Phase 2 studio/src/components/templates/LoginPage → ✅ shadcn 기본 토큰과 일치 (token-ground truth 는 Paper 저장값)
3. **자동화율 수치 검증**: diff 표 match 수 = 15, 전 계열 100% → ✅ 재검산 가능
4. **Go/No-Go 판정 근거**: report §1 → §3 RQ 답변 → §2 자동화 경계 흐름 일관 → ✅

## 📦 Files Changed

### 🆕 New Files

- `specs/spec-4-02-paper-mcp-roundtrip/spec.md` — Research spec, 5 RQ / 8 FR / 4 NFR
- `specs/spec-4-02-paper-mcp-roundtrip/plan.md` — 15 토큰 / 계열별 기준 / Paper 격리 계획
- `specs/spec-4-02-paper-mcp-roundtrip/task.md` — 7 tasks × 6 commits
- `specs/spec-4-02-paper-mcp-roundtrip/fixtures/LoginPage.DESIGN.md` — 픽스처 입력
- `specs/spec-4-02-paper-mcp-roundtrip/report.md` — Research 보고서 (8 섹션)
- `docs/experiments/paper-roundtrip-2026-04-22.md` — 시간순 실행 로그 + diff 표 + RQ5 갭

### 🛠 Modified Files

- `docs/guides/collaboration-flow.md` — Stage 2 / Stage 5 Done 기준 각 1 항 추가 + hook 앵커에 검증 결과 링크
- `backlog/phase-4.md` (sdd-auto) — spec 표에 spec-4-02 row
- `backlog/queue.md` (sdd-auto) — active phase spec 카운트

### 🌐 Paper 환경 변경 (코드 아님)

- 새 아트보드: `LoginPage — spec-4-02 PoC (2026-04-22)` (id `1BN-0`) 생성 + 보존
- 기존 아트보드 / 페이지 / 노드 무변경

**Total**: 6 신규 + 3 수정 (sdd-auto 포함) + Paper 아트보드 1 개

## ✅ Definition of Done (Research Spec)

- [x] **Trade-off 분석** 완료 (report §1)
- [x] **Prototype** 증거 존재 (아트보드 `1BN-0` + 실험 로그 + 15 토큰 diff 표)
- [x] **Recommendation** — **Go** (LoginPage 스코프, 단서 명시)
- [x] 계열별 정확도 기준 통과 (4/4 계열 모두 PASS)
- [x] 실험 로그 작성
- [x] collaboration-flow.md Done 기준 보완
- [x] walkthrough.md / pr_description.md ship commit

## 🔗 관련 자료

- Phase 정의: `backlog/phase-4.md`
- 프로토콜 정의: `docs/guides/collaboration-flow.md` (spec-4-01 산출)
- 실험 로그: `docs/experiments/paper-roundtrip-2026-04-22.md`
- Research 보고서: `specs/spec-4-02-paper-mcp-roundtrip/report.md`
- 픽스처: `specs/spec-4-02-paper-mcp-roundtrip/fixtures/LoginPage.DESIGN.md`
- 선행 spec: spec-4-01 (협업 Flow 프로토콜) — PR #16
- 후속 권장 spec: spec-4-03 Figma 동기화 / variant 확장 / Dashboard 왕복
