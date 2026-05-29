# Walkthrough: spec-13-08

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 새 레이어명 | Actions / Interactions / Behavior | **`## ⚡ Actions`** | Scenarios(서버 mock)와 구분되는 클라이언트 동작 명세 |
| validation 위치 | 별도 레이어 / Actions.forms | **Actions.forms** | v1 `.order.md` 의 validation 흡수 — 한 곳에 동작 명세 집중 |
| Query 연결 명세 | Data 안 / Actions.queries | **Actions.queries** (Data.source 매핑) | FRONT.md TanStack Query 강제와 연결점 명시 |
| 실증 범위 | 5화면 전부 / todos 1화면 풀 | **todos 1화면 풀 (MSW+Query)** | 깊이 우선 — 동작 명세→코드 입증이 목표 |
| MSW 통합 | 생략(useState mock) / 정석 MSW | **정석 MSW** (worker + handlers) | FRONT.md "모든 서버상태 Query + MSW" 규칙 준수 실증 |

- [x] ADR-011 갱신 — v2 레이어에 Actions 추가

## 💬 사용자 협의

- **주제**: "chat.md 하면서 react 만들 때 필요한 정보들 잘 만들어졌니?"
  - **발견**: UI/Data는 충분하나 동작(interaction/state/flow) 명세 부재 → LLM 즉흥 + FRONT.md Query 규칙 위반(useState).
- **주제**: "action 레이어 갭 phase-13 안에서 메우자"
  - **합의**: spec-13-08 추가. chat.md v2에 Actions 레이어 신설, todos 풀 실증.

## 🧪 검증 결과

### 1. Action 레이어 → Query/Mutation 코드 (정적 검증)

```
todos.tsx — 서버데이터 useState: 0건 (✓ FRONT.md §5 준수)
todos.tsx — useQuery 4 / useMutation 8 / useQueryClient 2
```
chat.md Actions 의 `queries.todos.list` → `useQuery`, `interactions.*` → `useMutation`+invalidate 로 생성됨. useState 즉흥 사라짐.

### 2. 동작 e2e (MSW + Query 실증)

```
pnpm exec playwright test action.spec.ts
5 passed
```
- useQuery → MSW 시드 3건 로드 ✓
- todo-add → useMutation POST → invalidate → 목록 갱신 ✓
- toggle-todo → PATCH → 진행중 카운트 2→1 ✓
- delete-todo → DELETE → 항목 제거 ✓
- filter → client-state (서버 GET 재호출 0) ✓

### 3. 전체 회귀

```
pnpm exec playwright test
18 passed (기능 6 + 반응형 7 + Action 5)
```

## 🔍 발견 사항

- `gd extract` 는 현재 Scenarios 만 파싱 (Actions 미파싱). MSW mutation 핸들러는 수동 작성. → gd extract 가 Actions 의 interactions 를 읽어 mutation 핸들러까지 생성하면 완전 자동화 (후속 spec 후보).
- chat.md Actions 의 `effect: optimistic-*` 는 이번 실증에서 invalidate-refetch 로 구현 (낙관적 업데이트는 단순화). 명세는 optimistic 의도를 담음 — 후속 정교화 여지.

## 🚧 이월 항목

- gd extract 의 Actions → mutation 핸들러 자동 생성 → 후속 spec
- optimistic update 정교화 (onMutate/rollback) → 후속
- 토큰/DESIGN.md → React 강제 (별도 발견, 미해결) → 별도

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-29 ~ 2026-05-30 |
