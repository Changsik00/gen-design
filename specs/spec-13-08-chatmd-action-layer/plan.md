# Implementation Plan: spec-13-08

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-08-chatmd-action-layer`
- 시작 지점: `phase-13-vertical-slice`
- PR 타겟: `phase-13-vertical-slice`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **Action 레이어 포맷** — 아래 제안(forms/interactions/navigation/queries YAML)이 적절한지.
> - [ ] **실증 범위** — todos 1화면을 TanStack Query+MSW 풀 전환으로 실증 (나머지는 포맷 적용만). 동의?

## 🎯 핵심 전략

### Action 레이어 포맷 (제안)

```markdown
## ⚡ Actions

```yaml
# 폼 검증 + 제출
forms:
  todo-add:
    fields:
      title: [required, max:100]
    submit:
      action: POST /api/todos
      effect: optimistic-append
      invalidate: [todos.list]

# 인터랙션 (클릭/토글 등)
interactions:
  toggle-todo:
    trigger: checkbox change
    action: PATCH /api/todos/:id
    effect: optimistic-toggle
    invalidate: [todos.list, todos.stats]
  delete-todo:
    trigger: button[trash] click
    action: DELETE /api/todos/:id
    effect: optimistic-remove
  filter:
    trigger: badge click
    type: client-state    # 서버 호출 없음

# 데이터 → Query 연결 (Data 레이어의 source 와 매핑)
queries:
  todos.list:
    source: GET /api/todos
    staleTime: 30000
  todos.stats:
    source: GET /api/todos/stats

# 네비게이션
navigation:
  - { trigger: "button[mypage]", to: /mypage }
```
```

→ 이 레이어가 있으면 LLM 은:
- `queries` → `useQuery(todos.list, ...)` 생성
- `forms`/`interactions` → `useMutation` + `onSuccess: invalidate` 생성
- `navigation` → `<Link>` / `navigate()`
- → **useState 즉흥 금지, FRONT.md Query 규칙 준수**

### login Action 예시 (form + flow)

```yaml
forms:
  login:
    fields:
      email: [required, email]
      password: [required, min:8]
    submit:
      action: POST /api/auth/login
      onSuccess: { navigate: /todos, store: user }
      onError: { show: "이메일 또는 비밀번호가 올바르지 않아요." }
```

### 주요 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 새 섹션명 | `## ⚡ Actions` | Scenarios(서버 mock)와 구분 — 클라이언트 동작 |
| validation 위치 | Actions.forms 안 | v1 .order.md 의 validation 흡수 |
| Query 연결 | Actions.queries (Data.source 매핑) | FRONT.md TanStack Query 강제와 연결 |
| 실증 범위 | todos 1화면 풀 Query/MSW | 깊이 우선 — 동작 명세→코드 입증 |

## 📂 Proposed Changes

### [MODIFY] `docs/chatmd-v2-format.md`
- `## ⚡ Actions` 레이어 섹션 신규 (forms/interactions/navigation/queries)

### [MODIFY] `packages/gd-skills/skills/gd-chat.md`
- Action 레이어 작성 가이드 (버튼 type 4종 질문 §7.6 확장 → Actions 산출)

### [MODIFY] `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
- v2 레이어 목록에 Actions 추가

### [MODIFY] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md`
- Actions 레이어 예시 추가

### [검증] todo-persona (git 미추적)
- `chats/scenes/todos.chat.md` + `login.chat.md` 에 Actions 레이어 추가
- `gd extract` → MSW 핸들러
- `src/scenes/todos.tsx` 재생성 — TanStack Query useQuery/useMutation
- MSW + Query 통합 e2e

## 🧪 검증 계획

### 통합 테스트 (실증)
```bash
# todo-persona
pnpm exec playwright test   # 동작 e2e: 추가/토글/삭제가 Query 캐시 통해 반영
```

수동: todos 가 useState 아닌 useQuery/useMutation 사용 확인 (코드 grep).

## 🔁 Rollback Plan

문서 + 스킬 변경 위주. todo-persona 미추적. git revert 안전.

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough / pr_description ship
