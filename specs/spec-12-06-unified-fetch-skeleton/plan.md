# Implementation Plan: spec-12-06

## 📋 Branch Strategy

- 신규 브랜치: `spec-12-06-unified-fetch-skeleton`
- 시작 지점: `phase-12-conversation-depth-and-orchestration` (phase base branch 모드)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [x] **Skeleton 위치**: preset `src/components/ui/skeleton.tsx` + 카탈로그 등록 — chat.md 에서 `<Skeleton>` 바로 사용 가능
> - [x] **TanStack Query API**: v5 `useQuery({ queryKey, queryFn })` 기준

> [!WARNING]
> - [x] `@tanstack/react-query` 가 preset devDependency 에 없으면 생성된 TSX 가 실행 불가 — 시뮬 환경(dogfood-v5)은 컴파일 검증만 (실행 환경 미설정)

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```
.order.md (data: 섹션)
  data:
    - queryKey: tasks.list
      endpoint: GET /tasks
         │
         │  generateOrderTsx() 확장
         ▼
  OrderTsxChunks.imports  += "import { useQuery } from '@tanstack/react-query';"
                           + "import { Skeleton } from '@/components/ui/skeleton';"
  OrderTsxChunks.formInit += "const { data: tasksListData, isPending: tasksListPending }"
                           + "  = useQuery({ queryKey: ['tasks.list'], ... })"
  OrderTsxChunks.onSubmit += "if (tasksListPending) return <Skeleton />;"
         │
         │  react.ts  (injectOrderChunks — 기존 로직 그대로)
         ▼
  DashboardScene.tsx  (useQuery + isPending guard 포함)
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **Skeleton 구현** | shadcn 표준 (`animate-pulse` div) | 프로젝트 기존 shadcn 컨벤션 일치 |
| **useQuery 위치** | `OrderTsxChunks.formInit` 재활용 | 기존 injectOrderChunks 파이프라인 그대로 — 신규 주입 포인트 불필요 |
| **isPending guard** | `OrderTsxChunks.onSubmit` 재활용 (함수 앞에 삽입) | 컴포넌트 본문 첫 줄에 early return 배치 |
| **복수 쿼리** | 각 data 항목마다 별도 `useQuery` | 단순·예측 가능, tanstack v5 권장 패턴 |

### 📑 ADR 후보

- [ ] 없음

## 📂 Proposed Changes

### 1. Skeleton 컴포넌트 (신규)

#### [NEW] `packages/create-gd-react/presets-bundled/default/src/components/ui/skeleton.tsx`

shadcn Skeleton 표준 구현:
```tsx
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
  );
}
export { Skeleton };
```

#### [MODIFY] `studio/src/lib/chat-md-compiler/paper/component-registry-metadata.ts`

```typescript
// Tier 2 (shadcn UI primitive) 에 추가:
Skeleton: "@/components/ui/skeleton",
```

### 2. `generateOrderTsx()` 확장

#### [MODIFY] `packages/gd-cli/src/commands/order.ts`

`data:` 엔트리 처리 추가:
```typescript
// data 항목 → useQuery hook 생성
function buildQueryHook(spec: DataSpec): string {
  const camelKey = spec.queryKey.replace(/\./g, "_");
  const [method, ...pathParts] = spec.endpoint.split(" ");
  const endpoint = pathParts.join(" ");
  return [
    `const { data: ${camelKey}Data, isPending: ${camelKey}Pending } = useQuery({`,
    `  queryKey: ['${spec.queryKey}'],`,
    `  queryFn: () => fetch('${endpoint}').then(r => r.json()),`,
    `});`,
  ].join("\n");
}
```

`generateOrderTsx()` 에서 data 있으면:
- imports 에 `@tanstack/react-query` + `@/components/ui/skeleton` 추가
- formInit 에 `useQuery` hook 추가
- onSubmit(early return 위치)에 `if (${camelKey}Pending) return <Skeleton />;` 추가

#### [MODIFY] `packages/gd-cli/src/commands/__tests__/order-runtime.test.ts`

data 관련 테스트 5개 추가:
- `useQuery` import 생성
- `Skeleton` import 생성
- `isPending → <Skeleton />` early return 생성
- queryKey camelCase 변환 (`tasks.list` → `tasks_listData`)
- `runReact` 통합: dashboard.order.md → TSX에 useQuery 포함

### 3. gd-chat.md §5.9 추가

#### [MODIFY] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md`

§5.8 다음에 §5.9 삽입:
- 트리거: 디자이너가 API/서버 데이터 언급 시
- 에이전트가 `.order.md` `data:` 섹션 추가 제안
- §12 종료 조건 업데이트

### 4. v5 시뮬레이션

#### [NEW] `experiments/dogfood-alpha-v5/chats/scenes/dashboard.order.md`

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

#### [NEW] `experiments/dogfood-alpha-v5/transcripts/scene-7-fetch.md`

시뮬 트랜스크립트: §5.9 flow + `gd react dashboard` → useQuery TSX 확인

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)
```bash
cd packages/gd-cli && pnpm test
```

`order-runtime.test.ts` 에 data 관련 케이스 5개 추가

### 통합 테스트
```bash
node packages/gd-cli/bin/gen-design.mjs react dashboard \
  --chat-root experiments/dogfood-alpha-v5/chats
# 기대: useQuery + Skeleton import 포함 TSX
```

### 수동 검증 시나리오
1. `<Skeleton>` 을 포함한 chat.md → `gd lint` 0 errors 확인
2. `dashboard.order.md` (data: 2개) → `gd react` → `useQuery` 2개 + `isPending guard` 2개 확인
3. `.order.md` 없는 씬 → 기존 TSX 동일 (하위 호환)

## 🔁 Rollback Plan

- `skeleton.tsx` 삭제 + `component-registry-metadata.ts` 항목 제거로 완전 롤백
- `generateOrderTsx` 의 data 처리는 `data` 배열 없으면 기존 동작 — breaking 없음

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
