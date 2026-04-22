# Task List: spec-4-03

> One Task = One Commit 엄격 준수 (spec-4-02 의 W4 위반 재발 방지).

## Pre-flight

- [x] Spec ID 확정 (`spec-4-03`)
- [x] spec.md 작성 (Research + 보완)
- [x] plan.md 작성 (실험 A/B 상세)
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + 스캐폴드

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-4-03-paper-roundtrip-rigor phase-4-collab-flow`
- [x] Commit: 없음

### 1-2. 스캐폴드 커밋
- [ ] spec/plan/task + backlog 재활성화 (phase-4 재활성 + spec-4-03 row 추가 + queue.md 갱신)
- [ ] Commit: `docs(spec-4-03): scaffold spec/plan/task and reactivate phase-4`

---

## Task 2: 실험 A — Mutation Fidelity 실행

### 2-1. Baseline 확인
- [ ] `get_computed_styles(["1C1-0","1BV-0","1BZ-0","1C8-0","1CA-0","1CC-0"])` — mutation 대상 노드 현재 값 재확인
- [ ] 실험 로그 `docs/experiments/paper-roundtrip-rigor-2026-04-22.md` 초기화 + baseline 기록

### 2-2. Mutation 적용
- [ ] `update_styles([{nodeIds:["1C1-0"], styles:{backgroundColor:"#D01A3F"}}])` — SubmitButton bg → 빨강
- [ ] `update_styles([{nodeIds:["1BV-0","1BZ-0","1C8-0","1CA-0","1CC-0"], styles:{borderColor:"#999999"}}])` — 5 개 border → 중간 회색
- [ ] `get_screenshot(1BO-0)` — mutation 후 시각 증거
- [ ] 실험 로그에 각 호출 기록

### 2-3. 재추출 + delta 검증
- [ ] `get_computed_styles` 15 토큰 대응 9 노드 재조회 (spec-4-02 와 동일 배치)
- [ ] 대조 표: {노드, 속성, mutation 전, mutation 후, 기대, 판정}
- [ ] 변경 의도 2 토큰 — 새 값 일치 확인 (아니면 RQ1 FAIL)
- [ ] 불변 13 토큰 — 기존 값과 exact match 확인 (아니면 Stage 6 위험 발견)
- [ ] Commit: `docs(spec-4-03): run mutation fidelity experiment`

---

## Task 3: `1BN-0` 원복

### 3-1. 원복 실행
- [ ] `update_styles([{nodeIds:["1C1-0"], styles:{backgroundColor:"#171717"}}])`
- [ ] `update_styles([{nodeIds:["1BV-0","1BZ-0","1C8-0","1CA-0","1CC-0"], styles:{borderColor:"#E5E5E5"}}])`
- [ ] `get_screenshot(1BO-0)` — 원복 후 증거
- [ ] `get_computed_styles` 2 노드만 재확인 — 원본 복구 검증
- [ ] 실험 로그에 기록
- [ ] Commit: `docs(spec-4-03): restore 1BN-0 to baseline after mutation`

---

## Task 4: 실험 B — Cross-artboard 비교

### 4-1. 1AX-0 구조 + 스타일 추출
- [ ] `get_tree_summary(1AX-0, depth=3)`
- [ ] `1AX-0` 에서 Card / Input / Button / Text 노드 식별 (레이어명 힌트)
- [ ] `get_computed_styles` — 식별된 노드에서 동일 토큰 추출
- [ ] 실험 로그에 기록

### 4-2. 대조표
- [ ] 15 토큰 중 `1AX-0` 에 존재하는 subset 에 대해 `1BN-0` vs `1AX-0` 비교표
- [ ] 차이 항목 원인 추정 (다른 날 / 다른 의사결정 / MCP 동작 차이)
- [ ] Commit: `docs(spec-4-03): run cross-artboard comparison experiment`

---

## Task 5: Research 보고서

### 5-1. report.md 작성
- [ ] `specs/spec-4-03-paper-roundtrip-rigor/report.md` 신규
  - 결론 한 줄 — spec-4-02 결과 재해석
  - RQ1~RQ4 답변
  - tautology 진단 최종 결론
  - Stage 6 Iterate 증거 평가
  - phase-4.md 결론 재작성 초안
- [ ] Commit: `docs(spec-4-03): add research report reframing spec-4-02 findings`

---

## Task 6: 하류 Phase 표현 정리

### 6-1. phase-4.md §검증 결과 재작성
- [ ] "15/15 100% match" → "표기 정규화 범위 내에서 안정 저장 + spec-4-03 rigor 결과 반영"
- [ ] 실측/미실측 단계 표 명확화
- [ ] spec-4-03 결과 링크
- [ ] Commit: `docs(spec-4-03): rewrite phase-4 verification with caveats`

### 6-2. phase-5.md / phase-7.md / collaboration-flow.md 완화
- [ ] `phase-5.md` spec-5-001 — "왕복 100% 유지" → "왕복 drift 측정"
- [ ] `phase-7.md` spec-7-004 — "동일하게 적용 가능한지 검증" → "패턴의 Figma 재적용성 검증 (값 보존 ≠ 의도 보존 단서 포함)"
- [ ] `docs/guides/collaboration-flow.md` hook-paper-extract / hook-paper-render 앵커 — spec-4-03 링크 + 단서 포함
- [ ] Commit: `docs(spec-4-03): soften overclaim language in downstream phases`

### 6-3. Icebox 부채 등재
- [ ] `backlog/queue.md` Icebox 에 W4 (One Task = One Commit 위반) + C4 (phase-ship.md 템플릿 부재) 추가
- [ ] Commit: `docs(spec-4-03): register phase-4 retrospective debt to icebox`

---

## Task 7: Ship

### 7-1. 품질 점검
- [ ] `sdd ship --check` 통과
- [ ] 모든 수정 파일의 링크 유효성

### 7-2. Ship artifacts
- [ ] walkthrough.md — 결정 기록 / 사용자 협의 / 실험 결과 요약
- [ ] pr_description.md — Research 결과 + phase-4 재평가 맥락
- [ ] Commit: `docs(spec-4-03): ship walkthrough and pr description`

### 7-3. Push + PR
- [ ] `git push -u origin spec-4-03-paper-roundtrip-rigor`
- [ ] `gh pr create --base phase-4-collab-flow --head spec-4-03-paper-roundtrip-rigor ...`
- [ ] 사용자 알림 + Phase PR #18 재오픈 제안

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 (브랜치 / 실험 A / 원복 / 실험 B / 보고 / 하류 정리 / Ship) |
| **예상 commit 수** | 9 (스캐폴드+실험2+원복+실험+보고+재작성+완화+부채+ship) |
| **현재 단계** | Planning (Plan Accept 대기) |
| **마지막 업데이트** | 2026-04-22 |
