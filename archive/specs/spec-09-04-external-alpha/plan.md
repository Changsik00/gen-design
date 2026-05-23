# Implementation Plan: spec-09-04

## 📋 Branch Strategy

- 신규 브랜치: `spec-09-04-external-alpha` (브랜치 이름 = spec 디렉토리 이름, `feature/` prefix 없음)
- 시작 지점: `phase-09-gen-design-live` (base branch)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] 역할극(role-play) 방식으로 진행 — 실제 외부인 없음. 보고서에 방법론 명시. 동의 여부 확인.
> - [ ] `playground/chats/scenes/profile.chat.md` 신규 생성 — playground 에 실험적 파일 추가됨.

## 🎯 핵심 전략 (Core Strategy)

### 진행 방식

```
1. agent 가 handbook 만 읽은 "첫날 디자이너" 역할 취함
2. ProfileScene 작성 시도 — handbook §4 워크플로 단계별 따르기
3. 각 단계에서 막히는 지점 · 소요 시간 · 불명확한 용어 기록
4. 시도 산출물: playground/chats/scenes/profile.chat.md
5. 보고서 작성: docs/external-alpha-1.md
6. 보정 적용: docs/handbook.md 최소 1 항목
```

### 주요 결정

| 항목 | 결정 | 이유 |
|:---:|:---|:---|
| **대상 scene** | ProfileScene | §4 워크플로가 ProfileScene 시나리오로 작성됨 — 동일 대상으로 재현성 확보 |
| **방법론** | agent 역할극 | 실제 외부인 없음. 투명성 위해 보고서에 명시 |
| **보고서 형식** | Markdown 표 (차단점 / 매끄러운 부분 / 보정 후보) | handbook 수정 시 참조하기 용이한 구조 |
| **handbook 보정** | 1 항목 이상 직접 수정 | 보고서만 쓰고 끝내는 것은 의미 없음 — 실제 개선 필수 |

### 📑 ADR 후보

- [x] 없음

## 📂 Proposed Changes

#### [NEW] `docs/external-alpha-1.md`

alpha 보고서:
- 방법론 (역할극 명시)
- 차단점 목록 (최소 3 건): 단계, 현상, 개선안
- 매끄러운 부분 (최소 2 건)
- handbook 보정 후보 (최소 3 건)

#### [NEW] `playground/chats/scenes/profile.chat.md`

alpha 세션 산출물. handbook §4 워크플로를 따라 실제 작성한 파일.

#### [MODIFY] `docs/handbook.md`

보고서에서 도출된 보정 후보 중 최소 1 항목 반영.
- §4, §4.5, §5, §6 중 가장 차단 효과 큰 항목 우선.

## 🧪 검증 계획

### 단위 테스트
없음 (Research spec — 코드 변경 없음).

### 수동 검증
1. `gen-design lint --chat-root playground/chats` → profile.chat.md 정합 확인
2. 보고서 항목 수 확인 (차단점 3+ / 보정 후보 3+)
3. handbook 수정 항목이 보고서 보정 후보 목록에 있는지 교차 확인

## 🔁 Rollback Plan

- `playground/chats/scenes/profile.chat.md` 삭제: playground 실험 파일 — 영향 없음
- `docs/handbook.md` 원복: `git checkout origin/phase-09-gen-design-live -- docs/handbook.md`

## 📦 Deliverables 체크

- [x] task.md 작성
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
