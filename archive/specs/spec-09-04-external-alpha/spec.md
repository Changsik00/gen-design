# spec-09-04: external-alpha — handbook 도그푸딩 + 보정

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-09-04` |
| **Phase** | `phase-09` |
| **Branch** | `spec-09-04-external-alpha` |
| **상태** | Planning |
| **타입** | Research |
| **Integration Test Required** | no |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-7 W10 에서 외부 디자이너 도그푸딩이 예정됐으나 미이행으로 이연됐다. phase-9 로 재배치되어 spec-09-03 (Studio runtime) 완성 후 실행하기로 결정됐다. 현재 인프라: gen-design 5 명령 완성 + Studio `#/chats` 뷰어 + `docs/handbook.md` 전체 작성 완료.

### 문제점

- handbook 을 처음 보는 사람이 30 분 안에 새 scene chat.md 를 작성할 수 있는지 검증된 적 없음.
- 차단점이 어디인지 모르면 handbook 을 개선하기 어려움.
- 실제 외부 디자이너 없을 경우 역할극(role-play)으로 대체 — 방법론 투명하게 명시.

### 해결 방안 (요약)

agent 가 handbook 만 읽고 ProfileScene chat.md 를 처음 작성하는 디자이너 역할을 수행한다. 막히는 지점·소요 단계·이해 어려운 항목을 기록하고 `docs/external-alpha-1.md` 보고서를 작성한다. 보고서에서 도출된 개선안 중 최소 1 항목을 `docs/handbook.md`에 반영한다.

## 🎯 요구사항

### Functional Requirements

1. agent 가 `docs/handbook.md` 를 처음 보는 디자이너 관점으로 통독.
2. handbook §4 워크플로를 따라 `playground/chats/scenes/profile.chat.md` 작성 시도 (30 분 제한 시뮬레이션).
3. 작성 중 차단점 · 모호한 부분 · 추가 설명이 필요한 항목을 실시간 기록.
4. `docs/external-alpha-1.md` 작성 — 차단점 목록 / 매끄러운 부분 / handbook 보정 후보 3 항목 이상.
5. handbook 보정 후보 중 최소 1 항목을 `docs/handbook.md` 에 직접 반영.
6. 역할극 방식임을 `external-alpha-1.md` 에 명시 (방법론 투명성).

### Non-Functional Requirements

1. 단위 테스트 없음 (Research 타입 spec — 코드 변경 없음).
2. 기존 테스트 995 PASS 유지 (handbook/docs 수정만이므로 영향 없음).

## 🚫 Out of Scope

- 실제 외부인 섭외 (단일 dev 환경, 이번 phase 에서는 역할극으로 대체).
- handbook 전면 재작성 (1 항목 이상 보정만).
- playground/chats 에 추가된 profile.chat.md 의 gen-design lint / react 검증 (다음 iteration 으로).

## 📑 ADR 후보

- [x] 없음 (역할극 도그푸딩은 프로세스 관행 — 코드 결정 아님)

## ✅ Definition of Done

- [ ] `docs/external-alpha-1.md` 작성 완료 (차단점 3 건 이상 + 보정 후보 3 건 이상)
- [ ] `playground/chats/scenes/profile.chat.md` 신규 작성 (alpha 산출물)
- [ ] `docs/handbook.md` 보정 최소 1 항목 반영
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-09-04-external-alpha` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
