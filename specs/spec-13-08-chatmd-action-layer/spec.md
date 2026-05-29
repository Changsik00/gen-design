# spec-13-08: chat.md v2 Action/Interaction 레이어

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-08` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-08-chatmd-action-layer` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

chat.md v2는 UI(Structure) + 데이터(Data) + API + 서버 시나리오(Scenarios)를 담는다. 그러나 **"버튼을 누르면 무슨 일이 일어나는가"(action/interaction)** 명세가 없다.

페르소나 재현 테스트(2026-05-29)에서 확인: todos 화면의 "추가/완료/삭제/필터", login의 "성공 시 이동", 폼 검증 로직을 chat.md가 명세하지 못해 **LLM이 전부 즉흥 구현**했고, FRONT.md가 강제하는 TanStack Query + MSW 대신 `useState`를 써서 **규칙을 위반**했다.

### 문제점

1. **Action 명세 구멍**: v1의 `.order.md`(validation + button action 4종)가 spec-13-06에서 제거됐으나 v2 레이어로 흡수되지 않음. Scenarios는 *서버 mock 데이터*지 *클라이언트 동작 명세*가 아님.
2. **LLM 즉흥 → 비결정성**: 같은 chat.md로 생성해도 동작 로직(낙관적 업데이트 여부, 성공 후 플로우, 검증 규칙)이 매번 다름.
3. **FRONT.md 규칙 미연결**: chat.md에 "이 데이터는 Query, 이 동작은 Mutation+invalidate"라는 연결이 없어 `useState` 즉흥으로 빠짐.

### 해결 방안 (요약)

chat.md v2에 **`## ⚡ Actions` 레이어**를 추가한다. 폼 검증, 버튼/인터랙션 동작(type + target + effect), 데이터-Query 연결을 YAML로 명세하여 LLM이 동작을 명세대로 생성하게 한다. todos 화면을 Action 명세 → MSW(gd extract) → TanStack Query 기반으로 풀 실증한다.

## 🎯 요구사항

### Functional Requirements

1. **Action 레이어 포맷 정의** (`docs/chatmd-v2-format.md`):
   - `forms`: 폼별 validation 규칙 + submit action (API + onSuccess/onError)
   - `interactions`: 인터랙션별 trigger + action(API) + effect(optimistic / invalidate / client-state)
   - `navigation`: 버튼/링크 → 라우트 매핑
   - `queries`: Data 레이어의 source → queryKey 매핑 (TanStack Query 연결)
2. **gd-chat 스킬에 Action 레이어 작성 가이드** 추가 (버튼 만나면 type 4종 질문 — §7.6 부활/확장)
3. **예시 파일** — `examples/dashboard.chat.md` 또는 todos에 Actions 레이어 추가
4. **ADR-011 갱신** — v2 레이어 목록에 Actions 추가
5. **실증** — todos 화면을 Action 명세 기반으로 재생성:
   - `gd extract` → MSW 핸들러 (Scenarios)
   - TanStack Query `useQuery`(목록) + `useMutation`(추가/토글/삭제 + invalidate)
   - Action 명세대로 동작하는 e2e PASS (FRONT.md Query 규칙 준수)

### Non-Functional Requirements

1. Action 레이어는 선택적 — 정적 화면은 생략 가능 (Scenarios처럼)
2. `gd extract`가 향후 Action 레이어를 읽어 Query/Mutation 훅 스텁 생성 가능한 구조 (이번엔 포맷만, 생성은 후속 가능)

## 🚫 Out of Scope

- 토큰/DESIGN.md → React 강제 (별도 발견, 별도 처리)
- gd extract의 Query/Mutation 훅 자동 생성 (이번엔 포맷 정의 + 수동 실증)
- todos 외 4화면 풀 Query 전환 (포맷 적용만, 실증은 todos 1개 집중)

## 📑 ADR 후보

- [x] ADR-011 갱신 — v2 레이어에 Actions 추가 (별도 ADR 아님, 기존 갱신)

## 🧪 통합 테스트

todos 화면: Action 명세 → MSW + TanStack Query → 추가/토글/삭제가 Mutation+invalidate로 동작 + 목록이 useQuery로 로드. e2e로 동작 검증.

## ✅ Definition of Done

- [ ] `docs/chatmd-v2-format.md` Action 레이어 섹션
- [ ] gd-chat 스킬 Action 작성 가이드
- [ ] ADR-011 갱신
- [ ] todos.chat.md Actions 레이어 + React(Query/Mutation) 재생성 + 동작 e2e PASS (실증)
- [ ] walkthrough / pr_description ship
- [ ] PR → `phase-13-vertical-slice`
