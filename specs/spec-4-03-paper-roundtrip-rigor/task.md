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
- [x] `get_computed_styles` 6 노드 — baseline 값이 spec-4-02 와 일치 확인
- [x] 실험 로그 초기화 + baseline 표 기록

### 2-2. Mutation 적용
- [x] `update_styles` 배치 호출 — SubmitButton bg `#D01A3F`, 5 border `#999999` (6 노드 일괄)
- [x] `get_screenshot(1BO-0)` — SubmitButton 빨강 + border 진해짐 시각 확인
- [x] 실험 로그에 호출 기록

### 2-3. 재추출 + delta 검증
- [x] `get_computed_styles` 9 노드 재조회 (spec-4-02 와 동일 배치)
- [x] 대조 표 2 개 (mutation 2/2 PASS + 불변 13/13 PASS)
- [x] RQ1 PASS — 부분 업데이트가 주변 토큰 오염 0
- [x] Stage 6 Iterate 핵심 전제 조건 충족 (완전 증거는 아님)
- [x] Commit: `docs(spec-4-03): run mutation fidelity experiment`

---

## Task 3: `1BN-0` 원복

### 3-1. 원복 실행
- [x] `update_styles` 배치로 `#171717` + `#E5E5E5` 재적용 (6 노드 일괄)
- [x] `get_screenshot(1BO-0)` — 시각 복구 확인 (spec-4-02 최종과 동일)
- [x] `get_computed_styles(["1C1-0","1BV-0"])` — 2 노드 원본 값 복구 검증 ✓
- [x] 실험 로그 §A-5 에 기록
- [x] Commit: `docs(spec-4-03): restore 1BN-0 to baseline after mutation`

---

## Task 4: 실험 B — Cross-artboard 비교

### 4-1. 1AX-0 구조 + 스타일 추출
- [x] `get_tree_summary(1AX-0, depth=5)` — 구조 확인 (Card outer frame + CardHeader + Form + SubmitButton + Social 가로 3 + SignupPrompt)
- [x] 1AX-0 의 Card / Input / Button / Text 노드 식별 (1AY-0, 1B5-0, 1BB-0, 1BC-0, 1BE-0, 1B0-0, 1B1-0, 1B4-0)
- [x] `get_computed_styles` batch 8 노드
- [x] 실험 로그 §B-1 기록

### 4-2. 대조표
- [x] 15 토큰 subset 대조 — 14/15 exact match, 1 (fontFamily) 는 구현자 선택 차이
- [x] RQ2 PASS (강한 형태) — 2 독립 세션에서 의미→저장 결정론 확인
- [x] RQ3 최종 진단 표 (spec-4-02 / 실험 A / 실험 B 각각의 tautology 해소 기여)
- [x] RQ4 Stage 6 증거 평가 — Paper 측 핵심 전제 3 건 충족
- [x] Commit: `docs(spec-4-03): run cross-artboard comparison experiment`

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
