# docs(spec-4-03): Paper MCP 왕복 검증 재수행 (Rigor)

> Research spec. spec-4-02 의 tautology 논란 보완. Paper 저장 결정론은 강하게 증명, 원본 의도 보존은 Phase 5 이월로 재정의.

## 📋 Summary

### 배경 및 목적

2026-04-22 독립 Opus 회고에서 spec-4-02 Paper MCP 왕복 PoC 의 "15/15 토큰 100% 일치" 결과에 **Critical 2 건 + Warning 6 건** 이 지적됐다. 핵심은:

- **C1+C2**: 정방향에서 AI 가 쓴 값을 역방향에서 AI 가 다시 읽는 구조 → self-echo tautology. "Paper 가 자기가 받은 값을 잃지 않는다" 만 증명, "원본 의도 보존" 은 미증명.
- **W2**: 6 단계 프로토콜 중 Stage 2/5 만 실측, Stage 3/4/6 미검증인데 "프로토콜 완성" 선언.
- **W7**: 과대평가가 phase-5.md / phase-7.md / collaboration-flow.md 3 곳에 "100% 유지되는가" 전제로 선 반영됨 — **하류 Phase 의 출발점 오염**.

본 spec 은 Phase 4 PR #18 을 Draft 로 전환한 후, 2 개 독립 실험으로 tautology 를 깨고 Stage 6 Iterate 핵심 전제를 실측하며, 하류 표현을 단서 포함으로 교정한다.

### 주요 변경 사항

- [x] **실험 A Mutation Fidelity** (`1BN-0`) — `update_styles` 로 2 토큰 의도 변경 + 재추출. 의도 2/2 PASS + 불변 13/13 오염 0
- [x] **실험 B Cross-artboard 비교** — 2026-04-12 `1AX-0` 에서 공통 토큰 추출. 14/15 exact match (1 fontFamily 는 구현자 선택)
- [x] **원복** — `1BN-0` 를 spec-4-02 최종 상태로 복구. 시각 + 스타일 양쪽 검증
- [x] **`specs/spec-4-03-.../report.md` 신규** — Research 보고서 7 섹션 (결론 reframed / RQ 답변 / phase-4 재평가 / 하류 완화 제안 / Icebox 부채 / Recommendation / 메타)
- [x] **`docs/experiments/paper-roundtrip-rigor-2026-04-22.md` 신규** — 시간순 실행 로그 + 실험 A/B 대조표 + Tautology 진단 최종
- [x] **`backlog/phase-4.md §검증 결과 전면 재작성`** — "100% PASS" 를 "표기 정규화 범위 내 안정 저장" 으로 다운그레이드, "원본 의도 보존" 은 별 축으로 분리
- [x] **하류 표현 완화** — phase-5.md spec-5-001 에 "원본 의도 보존 검증" 최우선 측정 추가 / phase-7.md spec-7-004 에 self-echo 함정 경고 / collaboration-flow.md hook 앵커 단서 포함
- [x] **Icebox 거버넌스 부채 4 건 등재** — W4 (One Task 위반) / C4 (phase-ship 템플릿 부재) / W2 (미실측 단계) / A4 (critique 미실행)

### Phase 컨텍스트

- **Phase**: `phase-4` (재활성화 상태)
- **Base Branch**: `phase-4-collab-flow`
- **PR 타겟**: `phase-4-collab-flow`
- **영향**: 본 spec 머지 시 PR #18 (phase-4 ship) 자동 업데이트 → 재오픈 후 Ship 재시도

### One Task = One Commit 준수

spec-4-02 의 W4 (Task 4+5 통합 commit) 를 재발 방지하기 위해 본 spec 은 **9 commits 엄격 분리**:

1. `7b6a355` scaffold + 재활성화
2. `a66fde7` 실험 A mutation
3. `62e6a45` 원복
4. `664d26b` 실험 B cross-artboard
5. `3451876` report.md
6. `72abd01` phase-4 재작성
7. `913740f` 하류 완화
8. `ce5e4cd` Icebox 부채
9. (본) ship

## 🎯 Key Review Points

1. **실험 B 의 "exact match" 해석** — 2 개 독립 아트보드의 14/15 토큰 일치가 "Paper 저장 결정론" 증명으로 충분한지, 혹은 "shadcn 이 토큰 standardization 이 잘 된 것" 일 뿐인지 판단 필요. 보고서는 전자로 해석.
2. **원본 의도 보존 이월** — Phase 5 PoC 로 확실히 이월됐고 phase-5.md spec-5-001 최우선 측정 대상으로 등재됨. 이게 Phase 5 시작 시 잊히지 않을 구조인지 확인.
3. **phase-4.md §검증 결과 다운그레이드의 정당성** — 이전 초안 ("100% PASS") 과 현 초안 ("조건부 PASS + 이월") 의 차이가 과민 반응인지 적절한 정정인지. 보고서 §1 의 "spec-4-02 가 증명한 것 vs 증명 안 한 것" 이 판정 근거.
4. **Icebox 부채 등재의 가시성** — W4/C4/W2/A4 가 free-text Icebox 에 들어감 — 향후 trigger 가 실제로 작동할지. (이 역시 A4 의 "자기참조" 문제와 비슷한 구조)
5. **Mutation 값 선정 (#D01A3F 빨강 / #999999 회색)** — 시각 분별력 우선으로 선정. 다른 mutation 시나리오 (더 미세한 차이, 예: `#E5E5E5` → `#E6E6E6`) 에서도 같은 정확도 유지될지 미확인 — 추후 spec 후보.
6. **fontFamily 차이의 해석** — 1AX-0 Geist vs 1BN-0 Inter. 이게 "자연스러운 구현자 선택" 이라는 해석이 타당한가, 혹은 "shadcn 이 Inter 로 표준화 못 함" 이라는 시스템 문제인가.

## 🧪 Verification

### 자동 테스트 (Research)

```bash
# 해당 없음 (docs + MCP 직접 호출)
# 재현: docs/experiments/paper-roundtrip-rigor-2026-04-22.md §실험설계 요약 참조
```

### 통합 테스트 (Integration Test Required = yes)

**phase-4.md 통합 시나리오 1 재평가**: spec-4-02 단독으로는 "왕복 100%" tautology. 본 spec 추가 후 "저장 결정론 강하게 증명 + 원본 의도 보존은 Phase 5 이월" 로 재정의. 원 시나리오 기준 (토큰 80% 이상) 은 충족 (14/15 = 93%), 의도 보존 기준은 추후 Phase 5 에서 측정.

### 수동 검증 시나리오

1. **Mutation 시각 변경 확인** — SubmitButton 빨강 / border 회색 육안 확인 ✓
2. **원복 후 spec-4-02 최종과 일치** ✓
3. **실험 B 표 재계산** — 14 match + 1 차이 ✓
4. **하류 수정본 읽기 테스트** — "단서 없는 100%" 모두 제거 ✓

## 📦 Files Changed

### 🆕 New Files

- `docs/experiments/paper-roundtrip-rigor-2026-04-22.md` — 시간순 실행 로그, 실험 A/B 대조표, tautology 진단 최종
- `specs/spec-4-03-paper-roundtrip-rigor/` — spec / plan / task / walkthrough / pr_description / report

### 🛠 Modified Files

- `backlog/phase-4.md` — §검증 결과 전면 재작성 ("100%" → 조건부 PASS + 이월)
- `backlog/phase-5.md` — spec-5-001 에 "원본 의도 보존 검증" 최우선 측정 추가
- `backlog/phase-7.md` — spec-7-004 에 self-echo 함정 경고 + spec-4-03 참조
- `backlog/queue.md` — Icebox 에 신규 섹션 "거버넌스 부채" (W4/C4/W2/A4 4 건)
- `docs/guides/collaboration-flow.md` — hook-paper-extract / hook-paper-render 앵커 단서 포함

### 🌐 Paper 환경 (코드 아님)

- `1BN-0` 임시 변경 후 원복 (spec-4-02 최종 상태 복구)
- `1AX-0` 읽기만 (변경 0)

## ✅ Definition of Done

- [x] 실험 A Mutation Fidelity — PASS
- [x] 실험 B Cross-artboard — PASS (강한 형태)
- [x] Tautology 진단 (RQ3) — 부분 해소
- [x] Stage 6 Iterate 핵심 전제 평가 (RQ4) — Paper 측 3/3 충족
- [x] 1BN-0 원복
- [x] phase-4.md §검증 결과 재작성
- [x] phase-5 / phase-7 / collaboration-flow 표현 완화
- [x] Icebox 부채 4 건 등재
- [x] walkthrough + pr_description ship commit
- [ ] Push + PR (다음 단계)

## 🔗 관련 자료

- PR #18 (Draft): https://github.com/Changsik00/gen-design/pull/18 — 본 spec 머지 후 재오픈
- 선행 spec: spec-4-01 (#16) / spec-4-02 (#17)
- 독립 회고: 2026-04-22 Opus subagent (메모리 내)
- Research 보고서: `specs/spec-4-03-paper-roundtrip-rigor/report.md`
- 실험 로그: `docs/experiments/paper-roundtrip-rigor-2026-04-22.md`
- 이월: Phase 5 spec-5-001 (원본 의도 보존 검증) / phase-7 spec-7-004 (Figma)
