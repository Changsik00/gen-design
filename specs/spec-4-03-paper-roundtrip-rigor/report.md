# Research Report: spec-4-03 — Paper MCP 왕복 검증 재수행 (Rigor)

## 🏁 결론 (Reframed)

**Paper 의 저장 결정론은 강하게 증명됨. 그러나 "디자인 의도 왕복 보존" 은 여전히 Phase 5 PoC 의 증명 대상.**

spec-4-02 의 "15/15 토큰 100% 일치" 는 **(a) Paper 의 저장 충실도 + (b) shadcn 기본 토큰 세트의 표기 결정론** 을 증명했으나, **"원본 디자인 의도 → Paper 반영 → 재추출 → 의도 복원"** 의 완전 사이클은 증명하지 않았다. 본 spec 은 그 한계를 명시하고 증명 범위를 재정의.

---

## 1. spec-4-02 재해석

### 1-1 spec-4-02 가 증명한 것
- Paper 는 HTML + inline CSS 로 쓰인 값을 **손실 없이** 내부 구조로 저장
- 저장값은 `get_computed_styles` 로 **exact match** 되어 반환
- oklch → sRGB hex / rgba → 8-hex alpha / padding 단일 → Block+Inline 의 **표기 정규화는 결정론적**

### 1-2 spec-4-02 가 증명하지 않은 것
- **원본 의도의 보존** — 의도를 Paper 밖에서 가져오지 않았으므로 비교 기준 부재
- **부분 업데이트 안정성** — 전체를 한 번에 쓰고 한 번에 읽었을 뿐, 수정 시나리오 없음
- **다른 세션 재현성** — 단일 세션 내 write-read 루프만
- **Stage 6 Iterate 실동작** — 토큰 변경 → 반영 → 재추출 루프 미실측

### 1-3 본 spec (4-03) 이 추가로 증명한 것

| 축 | 실험 | 결과 |
|---|---|---|
| 부분 업데이트 안정성 | A Mutation | ✅ 의도 2 토큰 정확 반영, 불변 13 토큰 오염 0 |
| 다른 세션 재현성 | B Cross-artboard | ✅ 2 독립 세션의 14/15 공통 토큰 exact match |
| Stage 6 Paper 측 전제 3 건 | A + B 조합 | ✅ 부분 안정성 + 토큰 격리 + 다른 세션 결정론 |

### 1-4 여전히 증명 안 된 것
- **원본 디자인 의도 → 코드 → Paper → 디자인 의도 전체 왕복**
- **Designer 가 실제로 Paper UI 로 수정했을 때 AI 가 의도를 정확히 파싱**
- **코드 변경 ↔ Paper 변경 ↔ DESIGN.md 변경 의 3 축 동기화**
- Phase 5 PoC 에서 실제 앱 A / 앱 B 생성 과정이 필요

---

## 2. 연구 질문 답변

### RQ1. Mutation Fidelity
**PASS** — 부분 업데이트가 정확히 저장되고 주변 토큰은 오염되지 않는다. 실험 A 의 2/2 + 13/13.

### RQ2. Cross-session 재현성
**PASS (강한 형태)** — 2 주 간격 + 다른 구현자 의사결정의 2 개 아트보드에서 15 토큰 중 14 개 **exact match**. 차이 1 개 (fontFamily) 는 구현자 선택이지 Paper 문제 아님.

### RQ3. Tautology 해소
**부분 해소** — spec-4-02 는 self-echo tautology. 실험 A 가 "다른 값 쓰기/읽기" 로 단일 데이터 포인트 우연을 배제. 실험 B 가 "독립 세션 간 결정론" 을 증명. **그러나** "원본 의도 보존" 이 증명된 것은 아님 — 의도 기준을 Paper 밖에서 가져오지 않았음.

### RQ4. Stage 6 Iterate 증거
**부분 충족** — Paper 측 핵심 전제 3 건 (부분 안정성 / 토큰 격리 / 세션 결정론) 은 증명. 코드 + DESIGN.md 3 축 동기화는 Phase 5 로 이월.

---

## 3. phase-4 성공 기준 재평가

| 원 기준 | spec-4-02 만으로 | spec-4-03 추가 후 |
|---|---|---|
| 1. 협업 Flow 프로토콜 문서 완성 | ✅ 형식 완비 | ✅ + 6 단계 중 4 단계 미실측을 명시 |
| 2. Paper: DESIGN → 시안 PoC | ✅ "100%" 과장 | ⚠ **"표기 정규화 범위 내 안정 저장"** 으로 다운그레이드 필요 |
| 3. Paper: 시안 → DESIGN 역추출 | ✅ "100%" 과장 | ⚠ 동. 다른 세션의 재현성은 추가로 ✅ |
| 4. Figma 동기화 | ⏭ 이월 | ⏭ 이월 (변화 없음) |

**phase-4 의 실제 달성**:
- 프로토콜 **정의** 완료
- Paper 측 저장 결정론 **강하게 증명**
- 완전한 "왕복 충실도" (의도 보존) 는 **Phase 5 이월**

---

## 4. 하류 Phase 표현 완화 제안

### phase-5.md spec-5-001 (앱 A)
- **변경 전**: "왕복 100% 유지되는가"
- **변경 후**: "왕복 drift 측정 (토큰 외 요소 / 원본 의도 보존 포함)"

### phase-7.md spec-7-004 (Figma Variables)
- **변경 전**: "자동 정규화 패턴을 Figma 에도 동일하게 적용 가능한지 검증"
- **변경 후**: "Paper 에서 관찰된 표기 정규화 패턴 (값 보존 ≠ 의도 보존 단서 포함) 의 Figma 재적용성 검증"

### collaboration-flow.md hook 앵커
- **변경 전**: "spec-4-02 검증 완료 100% (15/15)"
- **변경 후**: "spec-4-02 + spec-4-03 검증 완료 — 표기 정규화 범위 내에서 안정. 의도 왕복은 Phase 5 PoC"

---

## 5. 거버넌스 부채 (Icebox 등재)

- **W4 One Task = One Commit 위반** (spec-4-02 `2242e89`) — 재발 방지 메모. 본 spec 은 9 commits 로 엄격 준수.
- **C4 phase-ship.md 템플릿 부재** (harness-kit 0.5.0) — upstream 기여 대상. 다음 Phase Ship 까지 임시 대안 기록.

---

## 6. Recommendation

- **spec-4-02 의 "Go" 판정 유지** — 단 "스코프 단서 포함" 으로 주장 약화
- **Phase 4 Ship (PR #18) 재오픈 가능** — 본 spec 머지 후 phase-4.md / 하류 표현 / collaboration-flow 가 일관된 단서 포함 상태
- **Phase 5 시작 시** 반드시 "원본 의도 보존 검증" 을 첫 번째 측정 대상으로 지정

---

## 7. 메타

| 항목 | 값 |
|---|---|
| 실행일 | 2026-04-22 |
| Paper 파일 | "Welcome to Paper" |
| 실험 대상 | 1BN-0 (spec-4-02), 1AX-0 (2026-04-12 e2e) |
| MCP 호출 총 | 8 (baseline + mutation + screenshot + re-extract + restore + restore verify + tree + cross-extract) |
| 결정론 증명 | 2 독립 세션에서 14/15 exact match |
| 수행자 | Agent (Opus 4.7 1M) + Dennis |
