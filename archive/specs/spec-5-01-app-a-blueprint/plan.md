# Implementation Plan: spec-5-01

## 📋 Branch Strategy

- 신규 브랜치: `spec-5-01-app-a-blueprint`
- 시작 지점: `main`
- 첫 task 가 브랜치 생성을 수행

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **앱 A 컨셉 확정**: spec.md "앱 A 컨셉" 표 (TaskFlow / SaaS / 인디고+청록) 그대로 진행할지, 다른 도메인·이름·브랜드를 원하는지 확정.
> - [ ] **페이지 구성**: LoginPage / SignupPage / DashboardPage / MyPage / NotFoundPage 5 종 + 추가 페이지 (예: SettingsPage) 필요 여부.
> - [ ] **Findings 처리 정책**: 작성 중 발견한 템플릿·스키마 결함을 본 spec 에서 *수정* 하지 않고 `findings.md` 에 기록만 한다는 정책에 동의.

> [!WARNING]
> - [ ] 산출물 4 종이 후속 spec-5-02 / 5-03 의 입력이 됩니다 — 사후 변경은 후속 spec 의 재작업을 유발할 수 있습니다.

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```mermaid
flowchart TB
    subgraph Inputs[입력 (기존 자산)]
        BP[schema/blueprint-protocol.md]
        PC[schema/page-catalog.md]
        DS[schema/design-md-schema.md]
        TPL[templates/*.template]
    end
    subgraph Tasks[Task 단위]
        T1[1. 브랜치 + poc 디렉토리]
        T2[2. blueprint-session.md]
        T3[3. REQUIREMENTS.md]
        T4[4. DESIGN.md]
        T5[5. AGENT.md]
        T6[6. findings.md]
        T7[7. 자기검증 + Ship]
    end
    Inputs --> T2 --> T3 --> T4 --> T5 --> T6 --> T7
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **TDD 적용** | 산출물 자체에 단위 테스트 부재 — 대신 **자기검증 체크리스트** 를 마지막 task 로 둠 | 본 spec 은 코드가 아닌 문서 산출물 PoC |
| **앱 A 컨셉** | TaskFlow (SaaS 협업 도구) 1 안 제안 | spec.md 표 참고. 확정은 Plan Accept 단계에서 |
| **페이지 수** | 5 종 (Login / Signup / Dashboard / MyPage / NotFound) | spec-4-02 가 LoginPage 1 종이라 변별력 부족했음 → 다양성 확보 |
| **i18n 언어** | en 만 작성 | 앱 B (spec-5-04) 에서 ko 로 교체 → 재사용성 검증 |
| **Findings 정책** | 결함 발견 시 수정하지 않고 기록만 | 본 spec 범위 보호. 수정은 phase-5 회고 또는 phase-6 에서 |

## 📂 Proposed Changes

### [디렉토리 구조]

#### [NEW] `poc/app-a/`

PoC 산출물 루트 디렉토리. 후속 spec-5-02 / 5-03 / 5-04 도 이 디렉토리에 추가 산출물을 생성한다.

### [Blueprint 응답]

#### [NEW] `poc/app-a/blueprint-session.md`

- Step 1 / 2 / 3 의 질문 + 응답 + 결정 근거 기록
- 마지막에 protocol 출력 형식 YAML 블록 (REQUIREMENTS.md 생성 입력) 포함

### [정의 산출물]

#### [NEW] `poc/app-a/REQUIREMENTS.md`

- `templates/REQUIREMENTS.md.template` placeholder 치환
- 페이지 5 종 명세 (variant + 섹션 + Template 매핑)

#### [NEW] `poc/app-a/DESIGN.md`

- `schema/design-md-schema.md` 구조 준수
- 토큰 (color / typography / spacing / radius)
- i18n (en) 키
- 페이지별 state (default / hover / focus / disabled / error)

#### [NEW] `poc/app-a/AGENT.md`

- `templates/AGENT.md.template` 활용
- 후속 spec 에서 AI 에이전트가 참조할 운영 규약

### [회고 자료]

#### [NEW] `poc/app-a/findings.md`

- 최소 3 항목, 분류 태그 (`gap` / `ambiguity` / `over-spec` / `placeholder-mismatch`)
- 각 항목: 발견 위치, 현상, 영향, 처리 제안

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)

본 spec 은 코드 산출물 부재 — 단위 테스트 없음. 대신 **자기검증 체크리스트** 를 마지막 task 에서 수동 수행:

- [ ] `poc/app-a/REQUIREMENTS.md` placeholder 0 잔존 (`grep -c '{{' poc/app-a/REQUIREMENTS.md` = 0)
- [ ] REQUIREMENTS.md / DESIGN.md / AGENT.md 의 페이지 ID 가 모두 `schema/page-catalog.md` 에 존재
- [ ] DESIGN.md 의 i18n 키가 REQUIREMENTS.md 가 요구하는 화면 텍스트를 모두 커버
- [ ] DESIGN.md 토큰 표기 (oklch / hex / rem) 가 Phase 1 token 파이프라인 컨벤션과 일치
- [ ] findings.md 에 최소 3 항목 등재

### 통합 테스트 (Integration Test Required = no)

본 spec 단독 통합 테스트 없음. Phase 통합 테스트 시나리오 1 (앱 A End-to-End) 의 첫 단계로서 후속 spec 에서 누적 검증.

### 수동 검증 시나리오

1. **산출물 일관성 점검**: 4 종 산출물에서 동일 페이지·토큰·i18n 키가 동일하게 표기되는지 시각 검토 — 기대 결과: 표기 drift 0.
2. **후속 spec 시뮬레이션**: spec-5-02 (Paper 시안) 가 본 산출물만으로 진행 가능한지 점검 — 기대 결과: 누락 정보 발생 시 findings 에 기록 후 본 spec 에 보강 또는 spec-5-02 범위로 이관.

## 🔁 Rollback Plan

- 본 spec 은 신규 디렉토리 (`poc/app-a/`) 만 추가하고 기존 코드 / 스키마 / 템플릿을 수정하지 않음 → 롤백 비용 0.
- 산출물 품질 미흡 시 PR 단위로 폐기 후 재작성 가능.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
