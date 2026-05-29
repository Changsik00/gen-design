# Implementation Plan: spec-13-01

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-01-chatmd-v2-format`
- 시작 지점: `main`
- Phase base branch(`phase-13-vertical-slice`)는 첫 번째 spec ship 시 생성 (just-in-time)
- PR 타겟: `phase-13-vertical-slice` (첫 ship 시 생성)

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **포맷 방향 확정**: structured 레이어를 YAML fenced block으로 가져갈지, Markdown 헤딩 섹션으로 가져갈지. 본 plan은 "hybrid" (UI = Markdown bare, 나머지 = YAML fenced)를 제안하나 사용자 결정 필요.
> - [ ] **예시 화면 선택**: 로그인(단순 form + API 1개) vs 대시보드(복수 API + 계산 로직). 본 plan은 대시보드를 제안 — 더 많은 레이어를 한 번에 검증 가능.

## 🎯 핵심 전략

### chat.md v2 레이어 구조 (제안)

```markdown
---
type: scene | component
name: DashboardScene
identity: chats/scenes/dashboard
---

## 💬 Narrative
(기존과 동일 — 화면 의도)

## 🧩 Structure
(기존과 동일 — UI 컴포넌트 bare 형식)

## 📦 Data
```yaml
total_sales:
  type: number
  source: GET /api/stats
  label: "총 매출"
  format: currency   # LLM 힌트: $12,450 형태로 표시
active_users:
  type: number
  source: GET /api/stats
  label: "활성 사용자"
recent_orders:
  type: "Order[]"
  source: GET /api/orders?limit=10
```

## 🔌 API
```yaml
- method: GET
  path: /api/stats
  response:
    total_sales: number
    active_users: number
- method: GET
  path: /api/orders
  params:
    limit: number
  response:
    items: "Order[]"
    total: number
```

## 🎬 Scenarios
```yaml
- name: loaded
  description: "데이터 정상 로드"
  data:
    total_sales: 12450
    active_users: 234
    recent_orders: [{id: 1, amount: 120, status: "completed"}, ...]
- name: loading
  description: "로딩 중"
  state: pending
- name: error
  description: "API 오류"
  state: error
  message: "통계를 불러오지 못했어요"
```

## 🗄️ DB Hints
```yaml
- table: orders
  columns: [id, amount, status, created_at, user_id]
- table: users
  columns: [id, email, last_login_at]
```

## 📜 History
(기존과 동일)
```

### 포맷 결정 근거

| 항목 | YAML fenced | Markdown 섹션 |
|---|---|---|
| `gd extract` 파싱 | ✓ 기계 파싱 용이 | △ 자연어 파싱 필요 |
| 사람 가독성 | △ YAML 문법 필요 | ✓ 자연스러움 |
| LLM 작성 | ✓ 구조 강제 가능 | △ 자유도 높아 일관성↓ |
| 기존 호환 | ✓ 기존 Narrative/Structure 유지 | ✓ 동일 |

→ **Hybrid 제안**: UI(Structure)는 기존 bare Markdown 유지, 나머지 구조화 레이어는 YAML fenced block

### ADR-011 핵심 내용 (초안)

| 결정 | 내용 | type |
|---|---|---|
| 컴파일러 폐기 | LLM이 직접 TSX 생성, gd react 제거 | decision |
| 수직 단면 포맷 | 5개 레이어를 단일 파일에 | decision |
| YAML fenced hybrid | 구조화 레이어는 YAML, UI 레이어는 bare Markdown | tradeoff |

## 📂 Proposed Changes

### [신규] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md`
- 대시보드 화면을 v2 포맷으로 작성한 예시 파일
- 5개 레이어 모두 포함

### [신규] `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
- 컴파일러 폐기 + 수직 단면 포맷 채택 근거
- type: decision + tradeoff

### [참조용 읽기] `packages/gd-cli/src/commands/react.ts`
- 기존 파서 구조 파악 (폐기 대상, 구현 변경 없음)

### [참조용 읽기] `packages/gd-skills/skills/gd-chat.md`
- 기존 포맷 기준선 파악 (spec-13-03에서 변경, 이 spec에서는 변경 없음)

## 🧪 검증 계획

### 수동 검증 (docs-only spec)
1. 예시 dashboard.chat.md를 LLM에게 주고 TSX 생성 요청 → 토큰/variant 일관성 확인
2. 예시 파일의 Scenarios 섹션을 `gd extract` 예상 입력으로 상정, 파싱 가능 여부 사전 점검
3. ADR-011 내용이 phase-13.md 결정 기록과 일치하는지 확인

## 🔁 Rollback Plan

- 문서 변경만이므로 git revert로 즉시 원복 가능
- 다른 spec에 영향 없음 (spec-13-02~06은 이 spec의 결과물에 의존하나, 아직 시작 전)

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
