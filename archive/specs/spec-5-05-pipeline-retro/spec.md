# spec-5-05: PoC 파이프라인 회고 및 phase-6 입력 보고서

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-5-05` |
| **Phase** | `phase-5` |
| **Branch** | `spec-5-05-pipeline-retro` |
| **상태** | Planning |
| **타입** | Research / Doc |
| **Integration Test Required** | no |
| **작성일** | 2026-05-05 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

- **phase-5 의 4 spec (Merged)**: spec-5-01 (Blueprint), spec-5-02 (Paper 시안 + Settings 신설), spec-5-03 (React 구현), spec-5-04 (앱 B 재사용성 검증).
- **Success Criteria 검증 완료**:
  1. 앱 A: Blueprint → DESIGN.md → Paper → React 전 과정 완주 ✅
  2. 앱 B: 토큰/i18n 만 교체로 부팅 ✅
  3. 앱 A↔B 공유 코드 비율 87.1% (코드) / 79.8% (데이터 포함) ✅ 80%+ 충족
  4. 디자인 시안 ↔ React 시각 일치도: spec-5-03 의 visual-comparison.md 토큰 미적용 0 건 ✅
- **누적된 발견사항**: hardcode 2 건 (spec-5-04), drift 1 건 (spec-5-03 ActivityRowData), 단방향 동기화 (Paper ↔ tokens), 169 LOC 중복 (app-a/b 구조), Phase 4 회고 부채 (W2/W4/C4/A4 — phase-4.md 명시), paper-normalizer 함수 후보 (spec-5-02 식별, 코드화 미룸).

### 문제점

1. **phase-5 의 발견사항이 흩어져 있음**: 각 spec 의 walkthrough / report 에 분산. phase-6 Studio v1 설계 입력이 되려면 한 곳에 정리되어 우선순위가 매겨져야 함.
2. **개선 후보의 ROI 미평가**: 예 — 169 LOC 중복을 추출할 가치가 있는지, paper-normalizer 코드화가 즉시 우선인지, hardcode 수정이 다음 spec 인지 phase-6 의 일부인지 등 판단 기준 없음.
3. **Paper ↔ tokens 단방향성** 의 비용 — 디자이너가 새 브랜드 시안을 그릴 때 토큰 변경이 자동 반영 안 됨. 실용적 영향 미측정.
4. **Phase 4 회고 부채 (W2 / W4 / C4 / A4)** — phase-4.md 의 회고 항목이 spec-5-02 일부에 흡수됐으나 W4/C4/A4 는 미점검.

### 해결 방안 (요약)

`docs/poc-retro.md` 1 문서에 phase-5 회고를 정리한다. (1) 단계별 무엇이 잘 됐고 무엇이 깨졌는가 (Foundation/Token/Page Template/Blueprint/협업 Flow 5 단계 표), (2) 누적된 hardcode/drift/gap 카탈로그 (spec 별 출처 + 위치 + 영향 + 권장), (3) phase-6 todo 리스트 (P1/P2/P3 우선순위 매김), (4) Phase 4 회고 부채 재점검 결과. 코드 변경 / 도구 추가는 본 spec 의 범위 아님 — **문서 산출물만**.

## 📊 개념도

```mermaid
flowchart TB
  subgraph in[Phase-5 입력 (이미 존재)]
    s01[spec-5-01<br/>walkthrough]
    s02[spec-5-02<br/>walkthrough +<br/>drift-report +<br/>paper-normalizer-functions]
    s03[spec-5-03<br/>walkthrough +<br/>visual-comparison]
    s04[spec-5-04<br/>walkthrough +<br/>reuse-report]
    p4[phase-4 회고 부채<br/>W2/W4/C4/A4]
  end
  subgraph out[Phase-5 회고 (본 spec 산출물)]
    retro[docs/poc-retro.md]
    retro --> stage[1. 단계별 회고 표]
    retro --> cat[2. 발견사항 카탈로그]
    retro --> p6[3. phase-6 todo<br/>(우선순위 매김)]
    retro --> p4r[4. phase-4 부채 재점검]
  end
  s01 & s02 & s03 & s04 & p4 --> retro
  retro -.-> next[phase-6 Studio v1<br/>입력 제공]
```

## 🎯 요구사항

### Functional Requirements

1. **`docs/poc-retro.md` 단일 산출물** — 한국어 작성, 다음 4 섹션 포함:
   - **§1 단계별 회고 표** — Foundation / Token / Page Template / Blueprint / 협업 Flow 5 단계. 각 단계별 "잘된 점 / 깨진 점 / 다음 액션" 컬럼.
   - **§2 발견사항 카탈로그** — phase-5 4 spec 에서 누적된 모든 hardcode / drift / gap 을 표로. 각 행: 출처 spec, 분류 (hardcode/drift/gap/duplication), 위치 (파일:라인 또는 영역), 영향 (사용자 영향 / 시스템 위험), 권장 액션, 우선순위 (P1/P2/P3).
   - **§3 phase-6 todo 리스트** — §2 의 권장 액션을 phase-6 단위 작업으로 묶어 순서 매김 + ROI 추정. 각 todo: 제목, 동기, 예상 산출물, 예상 spec 수, 의존성.
   - **§4 phase-4 회고 부채 재점검** — phase-4.md 의 W2/W4/C4/A4 각 항목을 phase-5 결과로 점검: "여전히 부채인가 / 흡수됐는가 / 새 부채로 변형됐는가". 각 항목 ID 별 1 줄 평결 + 근거.
2. **모든 카탈로그 항목은 phase-5 spec 의 실제 산출물에서 출처 확인 가능해야 함** — 추측 / 일반론 금지. 출처 컬럼은 `walkthrough.md` 또는 `reuse-report.md` 등 실제 파일을 가리킴.
3. **phase-6 todo 는 ROI 우선순위 매김이 명시적이어야 함** — 단순 P1/P2/P3 라벨 외에 "왜 그 우선순위인가" 1 줄 근거.
4. **Paper ↔ tokens 단방향성** 분석 — §1 또는 §2 에 포함. "현재 자동화 경계 / 수동 비용 / phase-6 자동화 후보" 의 형태로.

### Non-Functional Requirements

1. **재현 가능성** — 모든 LOC / 측정 수치는 phase-5 spec 의 산출물에서 인용. 새로 측정하지 않음 (spec-5-04 의 reuse-report.md 등).
2. **분량** — `docs/poc-retro.md` 단일 파일, 800 ~ 1500 줄 추정. 분할 금지.
3. **언어** — 한국어. 코드 / 경로 / 식별자만 영어.
4. **편향 없음** — "잘된 점" 과 "깨진 점" 모두 균형 있게. 자축 / 변명 양쪽 회피.

## 🚫 Out of Scope

- **코드 변경 / 도구 추가** — 회고 문서만. hardcode 수정, paper-normalizer 코드화, 169 LOC 중복 제거 등은 모두 phase-6 todo 로 기록만.
- **새로운 측정** — phase-5 산출물에 이미 있는 수치만 인용. 새 LOC 측정 / 새 빌드 시간 측정 등 금지.
- **phase-6 spec 작성** — todo 리스트 항목까지. 실제 phase-6 spec 은 phase-6 시작 시.
- **Phase 1~3 회고** — phase-5 회고에 한정. phase-1/2/3 은 그 자체가 이미 mature.
- **자동 visual regression 도구 도입 평가** — 후보로만 기록, 평가는 phase-6.

## 🔍 Critique 결과

미실행. 본 spec 은 단일 문서 산출물이고 입력이 명확 (4 spec 의 walkthrough + phase-4.md 부채). 외부 critique 가 추가하는 가치보다 즉시 실행이 더 가치있다고 판단.

## ✅ Definition of Done

- [ ] `docs/poc-retro.md` 작성 완료 (4 섹션 모두)
- [ ] 카탈로그 항목 모두 출처 인용 (실제 파일 / 라인 검증)
- [ ] phase-6 todo 우선순위 근거 명시
- [ ] Phase 4 부채 4 항목 (W2/W4/C4/A4) 모두 평결
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-5-05-pipeline-retro` 브랜치 push 완료
- [ ] phase-5 종료 처리 (`sdd phase done 5`)
