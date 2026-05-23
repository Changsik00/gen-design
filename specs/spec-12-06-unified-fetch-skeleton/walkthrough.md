# Walkthrough: spec-12-06 — 일관된 fetch + Skeleton UI 패턴

## 목표 달성 요약

디자이너가 채팅에서 "서버 데이터 필요해요"를 언급하면 → `.order.md data:` 섹션 추가 → `gd react` 실행 시 `useQuery` hook + `<Skeleton />` early return 자동 주입.

---

## 구현 흐름

### 1. Skeleton 컴포넌트 (Task 2)

**`packages/create-gd-react/presets-bundled/default/src/components/ui/skeleton.tsx`** 신규:

```tsx
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
export { Skeleton };
```

shadcn 표준 pulse 애니메이션. `component-registry-metadata.ts` + studio `COMPONENT_REGISTRY` + `catalog.json` 에도 등록 (29 components).

### 2. TDD: data 지원 (Task 3 → Task 4)

`order-runtime.test.ts` 에 5개 케이스 추가 → 4 Red → `generateOrderTsx` 확장 → 241 Green.

**핵심 로직 (`order.ts`)**:

```typescript
function queryKeyToCamel(queryKey: string): string {
  return queryKey.replace(/\./g, "_");  // tasks.list → tasks_list
}

function buildQueryHook(dataSpec: DataSpec): string {
  const camel = queryKeyToCamel(dataSpec.queryKey);
  const [, ...pathParts] = dataSpec.endpoint.split(" ");
  return [
    `const { data: ${camel}Data, isPending: ${camel}Pending } = useQuery({`,
    `  queryKey: ['${dataSpec.queryKey}'],`,
    `  queryFn: () => fetch('${pathParts.join(" ")}').then(r => r.json()),`,
    `});`,
  ].join("\n");
}
```

`generateOrderTsx` 에서 `data:` 항목이 있으면:
- `imports` → `@tanstack/react-query` + `@/components/ui/skeleton`
- `formInit` → `buildQueryHook()` 각 항목
- `onSubmit` → `if (${camel}Pending) return <Skeleton />;`

### 3. gd-chat.md §5.9 (Task 5)

**트리거**: 디자이너가 "서버에서 가져와요", "API 연결" 등 언급 시.

**에이전트 액션**:
1. `.order.md data:` 섹션 추가 제안
2. `queryKey` + `endpoint` 수집
3. `data:` YAML 블록 작성

§12 종료 조건에 §5.9 체크 항목 추가.

### 4. v5 시뮬레이션 (Task 6)

`dashboard.order.md` (data: 2개) + `gd react dashboard` 실행 결과:

```tsx
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardScene() {
  const { data: tasks_listData, isPending: tasks_listPending } = useQuery({ ... });
  const { data: stats_summaryData, isPending: stats_summaryPending } = useQuery({ ... });
  if (tasks_listPending) return <Skeleton />;
  if (stats_summaryPending) return <Skeleton />;
  return ( /* DashboardScene JSX */ );
}
```

---

## DoD 체크리스트

| 항목 | 결과 |
|---|---|
| Skeleton 컴포넌트 신규 + 카탈로그 등록 | ✅ |
| TDD Red → Green (5 data 케이스) | ✅ 241 tests |
| gd-chat §5.9 추가 | ✅ |
| v5 시뮬레이션 + transcript | ✅ |
| 전체 테스트 회귀 없음 | ✅ 875 + 241 + 28 Green |

---

## 영향 범위

- `packages/gd-cli` — `order.ts`, `order-runtime.test.ts`
- `packages/create-gd-react` — `skeleton.tsx`, `gd-chat.md`
- `studio` — `skeleton.tsx`, `component-registry.ts`, `catalog.json`, `component-import-paths.test.ts`
