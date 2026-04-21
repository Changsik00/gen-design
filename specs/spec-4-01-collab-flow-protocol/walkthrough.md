# Walkthrough: spec-4-01

> Designer · Frontend · AI Agent 3 역할 × 6 단계 협업 프로토콜 문서화.
> docs-only 스펙. 코드 변경 없음.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 문서 구조 | A) 단일 문서 / B) 역할별 분리 (`docs/roles/*`) | **A** | 선형 리딩이 Onboarding 에 유리. 분리 필요성은 Phase 5 PoC 이후 재검토 |
| 역할 수 | A) 3 역할 (Designer / Frontend / AI Agent) / B) 2 역할 (AI 는 도구) | **A** | AI 가 DESIGN.md 작성·Blueprint 실행·왕복 동기화의 1 차 수행자. 암묵적 처리 시 책임 경계 붕괴 위험 |
| 단계 분해 | A) 6 단계 (Ideate→Iterate) / B) 더 적은 / 더 많은 | **A (6)** | phase-4.md 의 원안 다이어그램과 1:1 매핑. hand-off gate 가 자연스럽게 6 개 지점에서 발생 |
| 도구 서술 | A) 중립 서술 + 부록 / B) Paper 중심 | **A** | NFR-3 확장성. Paper → Sketch / Builder.io 교체 시 본문 불변 보장 |
| PoC 훅 표기 | A) 앵커 링크 + 참조 표 / B) 단순 문단 언급 | **A** | spec-4-02 / 03 가 한 줄 인용 가능 (`collaboration-flow.md#hook-paper-extract`) |
| cross-link 방식 | A) `> [!NOTE]` admonition / B) 본문 추가 / C) 맨 아래 링크 | **A** | GitHub 렌더링에서 시각 구분 + 기존 본문 수정 최소화 |
| Pre-flight 커밋 분리 | A) 스캐폴드 전용 commit / B) Task 2 와 병합 | **A** | phase-3 선례 (`fe77826 docs(spec-3-04): add spec/plan/task artifacts`) 따름. 한 커밋에 관심사 혼합 방지 |

## 💬 사용자 협의

- **주제**: 스코프 결정 — 5 결정 (위치/역할/단계/도구/체크리스트) 일괄 확인
  - **사용자 의견**: 기본값 일괄 수용 (`1`)
  - **합의**: 단일 문서 `docs/guides/collaboration-flow.md`, 3 역할, 6 단계, 도구 중립, 단계별 Done 체크리스트 포함

- **주제**: phase base branch 준비
  - **사용자 의견**: phase 단위 커밋 구조 원함 — spec PR 이 phase 브랜치를 타겟팅하도록
  - **합의**: `phase-4-collab-flow` base branch 활성화 (state.json + phase-4.md + queue.md). 본 spec PR base = `phase-4-collab-flow`

- **주제**: Plan Accept
  - **사용자 의견**: `1`
  - **합의**: Strict Loop 진입. 자동 진행 (push 확인만 1회).

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: 해당 없음 (docs-only SPEC)
- **대체 검증**: 내부 상대 링크 유효성 grep
  ```bash
  grep -Eo "\]\([^)]+\.md[^)]*\)" docs/guides/collaboration-flow.md | sort -u
  ```
- **결과**: ✅ **9/9 링크 유효** — `schema/*.md` 4 개, `docs/integrations/*.md` 3 개, `docs/guides/*.md` 2 개 모두 실제 파일 존재 확인

#### 통합 테스트
- **명령**: 해당 없음 (Integration Test Required = no)

### 2. 수동 검증

1. **Action**: spec.md FR-1 ~ FR-6 / NFR-1 ~ NFR-4 각 항목이 실제 산출물에 반영되었는지 대조
   - **Result**: ✅ 9/10 모두 확인. 구성:
     - FR-1 프로토콜 문서 존재 ✅ (`docs/guides/collaboration-flow.md`)
     - FR-2 단계 기술 명세 ✅ (6 단계 × 5 필드)
     - FR-3 Phase 1~3 매핑 ✅ (§5 매핑 표, 10 항)
     - FR-4 도구 중립 서술 + 부록 ✅ (본문 중립 + 부록 A)
     - FR-5 PoC 훅 앵커 ✅ (`hook-paper-extract`, `hook-paper-render`, `hook-figma-token-sync`, `hook-extract-tool`, `hook-render-tool`, `hook-token-sync`, `hook-blueprint-protocol`)
     - FR-6 양방향 cross-link ✅ (paper-mcp / figma-sync / e2e-demo-loginpage 3 개 파일)
     - NFR-1 한국어 ✅
     - NFR-2 GFM 호환 ✅ (`> [!NOTE]` / mermaid / 표)
     - NFR-3 확장성 ✅ (본문 중립, 부록 A 에만 도구별 매핑)
     - NFR-4 링크 유효 ✅

2. **Action**: 본 문서만 읽고 "Onboarding 시나리오 (LoginPage 를 시작 → 배포)" 재현 가능 여부 자체 평가
   - **Result**: ✅ §4.1 ~ §4.6 각 단계 입/출력 + Done 기준 체크리스트가 있어 순서 재현 가능

3. **Action**: AI Agent 가 본 문서를 로드한 상태에서 "나는 지금 Stage 3 Blueprint 실행 중" 을 인식 가능한지
   - **Result**: ✅ §4.3 Stage 3 섹션이 입력 / 도구 / 수행 순서를 자기참조 형식으로 명시

4. **Action**: spec-4-02 (Paper MCP) 가 검증할 훅을 한 줄로 인용 가능한지
   - **Result**: ✅ 예: `docs/guides/collaboration-flow.md#hook-paper-extract` 또는 `#hook-paper-render`

5. **Action**: 사고 실험 — Paper MCP 를 다른 MCP 로 교체 시 본문 변경 범위
   - **Result**: ✅ 부록 A 테이블에 새 열 추가만으로 대응. 본문 §4.2 / §4.5 는 "시안 읽기 도구 / 시안 쓰기 도구" 중립 명칭으로 기술되어 불변

## 🔍 발견 사항

- **Stitch MCP 의 존재**: `docs/integrations/stitch-mcp.md` 가 이미 존재. 부록 B 에 포함시켰으며, Stage 2 Extract 의 **대체 경로** 로 기술. 향후 Stitch 활용 여부는 PoC 에서 결정.
- **phase-4.md 의 spec-4-002 / spec-4-003 방향성 문단**: 본 spec 은 수정하지 않음. 그러나 spec-4-02 / 03 을 작성할 때 `collaboration-flow.md#hook-*` 로 직접 인용하면 phase.md 중복 기술을 줄일 수 있음 (각 spec 진행 시 반영).
- **Figma REST Variables API 의 Enterprise 제약**: 부록 A.3 에 명시. Tokens Studio 경로가 실용적 대안이며, spec-4-03 PoC 범위에 포함될 가능성 높음.
- **e2e-demo-loginpage.md 와 collaboration-flow.md 의 역할 구분 성공**: 전자는 "구체 실험 기록 (LoginPage, 2026-04-12 진행)", 후자는 "일반 프로토콜 규칙" 으로 cross-link 노트에서 명확히 분리.

## 🚧 이월 항목

- **AI Agent 역할의 실사용 검증** — 3 역할 구분이 실제 협업에서 유효한지는 Phase 5 PoC 에서 실제 앱 생성 시 검증 대상 (현 시점 아이디어 단계)
- **역할별 심화 가이드** (`docs/roles/{designer,frontend,ai-agent}.md`) — 본 프로토콜 사용 후 필요성 확인되면 별도 spec 승격 — Icebox 에 추가 후보
- **Fill Executor direct-fill 정확도 벤치마크** — Stage 3 Blueprint 의 직접 치환 정확도 측정 — Phase 5 PoC 범위

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7 1M) + Dennis |
| **작성 기간** | 2026-04-21 (당일 완료) |
| **최종 commit** | `34018d6` (cross-link) — ship commit 전 시점 |
| **최종 doc line count** | 391 (`docs/guides/collaboration-flow.md`) |
| **links validated** | 9/9 |
