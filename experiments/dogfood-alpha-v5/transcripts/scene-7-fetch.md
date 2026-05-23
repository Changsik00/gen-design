# Scene 7 — Dashboard fetch 시뮬레이션 (spec-12-06)

> **목적**: §5.9 fetch 의도 안내 플로우 검증 + `gd react dashboard` 실행 결과 확인

---

## 대화 시뮬레이션

**디자이너**: 대시보드에 할 일 목록이랑 통계 숫자가 필요해요. 서버에서 가져와야 해요.

**에이전트**: 서버 데이터 fetch 가 필요하시군요. `.order.md` 의 `data:` 섹션에 fetch 명세를 추가하겠습니다.

```yaml
data:
  - queryKey: tasks.list
    endpoint: GET /tasks
  - queryKey: stats.summary
    endpoint: GET /stats
```

`gd react` 실행 시 `useQuery` hook + `isPending → <Skeleton />` early return 이 자동 주입됩니다.

---

## 생성 파일

`experiments/dogfood-alpha-v5/chats/scenes/dashboard.order.md`

```yaml
---
scene: dashboard
data:
  - queryKey: tasks.list
    endpoint: GET /tasks
  - queryKey: stats.summary
    endpoint: GET /stats
---
```

---

## gd react dashboard 실행 결과

```tsx
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardScene() {
  const { data: tasks_listData, isPending: tasks_listPending } = useQuery({
    queryKey: ['tasks.list'],
    queryFn: () => fetch('/tasks').then(r => r.json()),
  });
  const { data: stats_summaryData, isPending: stats_summaryPending } = useQuery({
    queryKey: ['stats.summary'],
    queryFn: () => fetch('/stats').then(r => r.json()),
  });
  if (tasks_listPending) return <Skeleton />;
  if (stats_summaryPending) return <Skeleton />;
  return (
    // ...DashboardScene JSX...
  );
}
```

### 검증 항목

| 항목 | 결과 |
|---|---|
| `useQuery` 2개 생성 | ✅ tasks_listData, stats_summaryData |
| `isPending` guard 2개 | ✅ tasks_listPending, stats_summaryPending |
| `<Skeleton />` early return | ✅ 각 guard 마다 삽입 |
| import `@tanstack/react-query` | ✅ |
| import `@/components/ui/skeleton` | ✅ |
| 기존 DashboardScene JSX 보존 | ✅ |

---

## decisions.md 기록 예시

```markdown
## 2026-05-23 DashboardScene fetch 명세 추가 (§5.9)

- **추가 파일**: `chats/scenes/dashboard.order.md` (data: 섹션)
- **queryKey 수**: 2개 (tasks.list, stats.summary)
- **출처 스킬**: gd-chat (spec-12-06 §5.9)
```
