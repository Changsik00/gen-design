# Implementation Plan: spec-5-05

## 📋 Branch Strategy

- 브랜치: `spec-5-05-pipeline-retro` (alignment 단계에서 이미 생성됨, §10.1 재발 방지)
- 시작 지점: `main` (fa2e129 — phase-5 backlog sync 완료 시점)
- phase-5 의 마지막 spec — 머지 후 `sdd phase done 5` 로 phase 종료

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **회고 문서 1 본 vs 분할** — `docs/poc-retro.md` 단일 파일 vs `docs/retro/{stage,catalog,phase6-todo,phase4-debt}.md` 4 파일 분할. **권장**: 단일 (회고는 한 호흡으로 읽혀야 가치 있음, spec 도 단일 산출물로 정의).
> - [ ] **phase-6 todo 의 우선순위 부여 권한** — 본 spec 에서 P1/P2/P3 라벨까지 매김 vs phase-6 시작 시 사용자가 매김. **권장**: 본 spec 에서 *제안* 까지만 (각 todo 별 추천 우선순위 + 근거 1 줄), 최종 확정은 phase-6 alignment 시.
> - [ ] **카탈로그 항목의 자동 검증** — 출처 인용을 grep 으로 검증할 것인가 (스크립트), 아니면 사람 눈 검토만. **권장**: grep 으로 spot-check 만. 회고 자체에는 자동화 부담 추가하지 않음.

> [!WARNING]
> - [ ] **phase-4 부채 W2 가 phase-5 에 흡수되었는가** 의 평결은 단순한 "yes/no" 가 아닐 수 있음. 6 단계 프로토콜 중 Stage 3/4 만 PoC 에 포함된 것이지 모두 측정된 것은 아님. 평결은 신중하게.
> - [ ] **`appName = "TaskFlow"` hardcode 처럼 명백한 fix 후보**도 본 spec 에서 즉시 수정하지 않음 — 회고 문서 정합성을 위해 phase-6 으로 미룸 (spec scope 보전).

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```mermaid
flowchart TB
  subgraph inputs[입력 (이미 존재하는 산출물)]
    s01w[spec-5-01/walkthrough.md]
    s02w[spec-5-02/walkthrough.md +<br/>drift-report.md +<br/>paper-normalizer-functions.md]
    s03w[spec-5-03/walkthrough.md +<br/>visual-comparison.md]
    s04w[spec-5-04/walkthrough.md +<br/>reuse-report.md]
    p4d[phase-4 부채<br/>W2/W4/C4/A4<br/>(backlog/queue.md icebox)]
  end
  subgraph process[작성 절차]
    read[Task 1<br/>입력 인용 인덱스 작성]
    stage[Task 2<br/>§1 단계별 회고 표]
    catalog[Task 3<br/>§2 발견사항 카탈로그]
    todo[Task 4<br/>§3 phase-6 todo + ROI]
    debt[Task 5<br/>§4 phase-4 부채 평결]
    ship[Task 6 Ship]
  end
  subgraph output[산출물]
    retro[docs/poc-retro.md]
  end
  inputs --> read --> stage --> catalog --> todo --> debt --> ship --> retro
```

### 주요 결정

| 결정 | 선택 | 이유 |
|:---|:---|:---|
| **산출물 구조** | 단일 `docs/poc-retro.md` | 회고는 흐름이 중요. 분할 시 cross-ref 부담. spec 정의도 단일 |
| **카탈로그 출처 인용** | 표 컬럼 1개 (출처) + 라인 번호 | grep 으로 사후 검증 가능, 사람 읽을 때도 거추장스럽지 않음 |
| **phase-6 todo 우선순위** | 본 spec 에서 *제안* (P1 권장 / P2 권장 / P3 권장 + 1 줄 근거) | 최종 확정은 phase-6 alignment. 본 spec 은 입력 제공자 |
| **새 측정 금지** | 모든 수치는 phase-5 산출물 인용 | spec 의 NF 요구사항. "회고는 측정의 정리이지 새 측정이 아님" |
| **phase-4 부채 4 항목 모두 평결** | yes/absorbed/transformed 3 라벨 + 근거 | spec 의 F 요구사항 §4 |
| **`docs/` 위치** | 기존 `docs/` 디렉토리 재사용 | 새 디렉토리 만들지 않음, README/index 도 갱신 안 함 (회고는 자체 완결) |

## 📂 Proposed Changes

### Documents

#### [NEW] `docs/poc-retro.md`

phase-5 회고. 4 섹션:

```text
# Phase-5 PoC 파이프라인 회고

## §0 메타 (작성일, 입력 spec 4 + phase-4 부채, 검증 방식)

## §1 단계별 회고 표
| 단계 | 잘된 점 | 깨진 점 | 다음 액션 |
|---|---|---|---|
| Foundation | ... | ... | ... |
| Token | ... | ... | ... |
| Page Template | ... | ... | ... |
| Blueprint | ... | ... | ... |
| 협업 Flow | ... | ... | ... |

## §2 발견사항 카탈로그
| # | 출처 | 분류 | 위치 | 영향 | 권장 액션 | 우선순위 |
|---|---|---|---|---|---|---|
| C-01 | spec-5-04/reuse-report.md §2 | hardcode | studio/.../MyPage:23 | "TaskFlow" 누수 | required prop | P1 |
| ... | ... | ... | ... | ... | ... | ... |

## §3 Phase-6 todo 리스트
### todo-01: studio API 정합화 (hardcode 제거 + drift 정리)
- 동기 / 산출물 / 예상 spec 수 / 의존성 / ROI 추정

## §4 Phase-4 회고 부채 재점검
| ID | 원본 부채 | phase-5 결과 | 평결 | 근거 |
|---|---|---|---|---|
| W2 | 6 단계 프로토콜 4 단계 미실측 | Stage 3/4 흡수 측정, Stage 5/6 미측정 | partial | spec-5-01/02/03 의 흐름은 측정 |
| W4 | One Task = One Commit 위반 | spec-5-01~04 모두 준수 | absorbed | git log 확인 |
| C4 | phase-ship.md 템플릿 부재 | 변동 없음 | open | harness-kit 0.6.2 도 미포함 |
| A4 | critique 미실행 | spec-5-01~04 모두 미실행 | open | walkthrough 들에 critique 결과 없음 |
```

### 카탈로그 (§2) 의 시드 항목 (실측 후 확정)

| 출처 | 분류 | 1 차 식별 |
|---|---|---|
| spec-5-04/reuse-report.md §2 | hardcode | studio MyPage / SettingsPage `appName = "TaskFlow"` |
| spec-5-04/reuse-report.md §1.4 | duplication | app-a/b 의 169 LOC 중복 (App.tsx, main.tsx, useTexts.ts, login/signup/error) |
| spec-5-03/visual-comparison.md (drift section) | drift | studio ActivityRowData 의 user/action/status/time vs DESIGN.md task/assignee/status/updated 명명 |
| spec-5-02/drift-report.md | drift | Paper 시안 ↔ DESIGN.md 차이 (이미 spec-5-02 에서 정리) |
| spec-5-02/paper-normalizer-functions.md | gap | paper-normalizer 함수 후보 미코드화 |
| (이번 spec 자체의 발견) | gap | Paper ↔ tokens 양방향 동기화 부재 |

> Task 3 에서 모든 spec 의 walkthrough 와 부속 문서를 grep 으로 훑어 카탈로그 확정. 시드는 누락 없는지 확인용.

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트

해당 없음 (코드 변경 0). 다음 정합성 검사로 대체:

```bash
# 1. 카탈로그 출처 인용이 실제로 존재하는지 grep
grep -l "appName = \"TaskFlow\"" studio/src/components/templates/MyPage/index.tsx
grep -l "appName = \"TaskFlow\"" studio/src/components/templates/SettingsPage/index.tsx

# 2. phase-4 부채 ID 가 실제로 존재하는지 (queue.md icebox)
grep -E "W2|W4|C4|A4" backlog/queue.md

# 3. 회고 본문 길이 NF 요구사항 (800~1500 줄)
wc -l docs/poc-retro.md
```

### 통합 테스트

해당 없음 (Integration Test Required = no).

### 수동 검증 시나리오

1. **카탈로그 spot-check (5 항목)** — 무작위로 5 행 골라 출처 파일 / 라인이 실재하는지 grep — 기대: 5/5 hit
2. **단계별 회고 균형 점검** — "잘된 점" 과 "깨진 점" 컬럼 행 수 비교 — 기대: 비슷한 수준 (한쪽 압도 시 편향)
3. **phase-6 todo 의 ROI 근거 1 줄** — 모든 todo 가 우선순위 근거를 가지는가 — 기대: 100%
4. **phase-4 부채 4 항목 모두 평결** — W2/W4/C4/A4 모두 포함되었는가 — 기대: 4/4

## 🔁 Rollback Plan

- 회고 문서 1 본만 추가 → 문제 시 `git revert` 1 commit 으로 즉시 복원
- 코드 / 기존 문서 변경 없음 → blast radius 0

## 📦 Deliverables 체크

- [x] spec.md 작성
- [x] plan.md 작성
- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
- [ ] phase-5 종료 처리 (`sdd phase done 5`)
