# spec-12-06: 일관된 fetch + skeleton UI 패턴

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-12-06` |
| **Phase** | `phase-12` |
| **Branch** | `spec-12-06-unified-fetch-skeleton` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gd react` 는 chat.md 어휘 트리 + `.order.md` 검증/액션 명세로 TSX 를 컴파일한다.
spec-12-05 에서 `.order.md` 에 `data:` 섹션(queryKey + endpoint)이 이미 정의됐지만, 컴파일러가 이를 읽지 않는다.
`Skeleton` 컴포넌트가 preset UI 에 없고 카탈로그에도 등록되어 있지 않다.

### 문제점

1. **반복 fetch 코드**: 에이전트가 데이터 fetch 신마다 다른 패턴(`axios`, `fetch`, `SWR`, `useQuery`)을 사용 — 프로젝트 표준 없음.
2. **로딩 UI 불일치**: isPending 처리가 신마다 달라 UX 일관성 없음 (`<div>로딩중</div>` vs `null` vs `<Spinner>`).
3. **`Skeleton` 미등록**: chat.md 에 `<Skeleton>` 을 써도 lint 에러 — 카탈로그 어휘 외.

### 해결 방안 (요약)

① `Skeleton` 컴포넌트를 preset에 추가하고 카탈로그에 등록한다. ② `.order.md` 의 `data:` 엔트리를 `generateOrderTsx()` 가 읽어 **TanStack Query `useQuery` + `isPending → <Skeleton>`** 표준 패턴을 자동 주입한다. ③ `gd-chat.md §5.9` 에 fetch 의도 안내를 추가해 대화 중 data 명세를 `.order.md` 에 기록하도록 유도한다.

## 📊 개념도

```
dashboard.order.md
───────────────────
data:
  - queryKey: tasks.list
    endpoint: GET /tasks
         │
         │ generateOrderTsx()  (확장)
         ▼
┌─────────────────────────────────────────┐
│  import { useQuery } from '@tanstack/   │
│    react-query';                        │
│  import { Skeleton } from '@/components │
│    /ui/skeleton';                       │
│                                         │
│  const { data, isPending } =            │
│    useQuery({                           │
│      queryKey: ['tasks.list'],          │
│      queryFn: () =>                     │
│        fetch('/tasks').then(r=>r.json())│
│    });                                  │
│                                         │
│  if (isPending) return <Skeleton />;    │
└─────────────────────────────────────────┘
```

## 🎯 요구사항

### Functional Requirements

1. **`Skeleton` 컴포넌트 추가** — `packages/create-gd-react/presets-bundled/default/src/components/ui/skeleton.tsx` (shadcn 표준 구현)

2. **카탈로그 등록** — `studio/src/lib/chat-md-compiler/paper/component-registry-metadata.ts` 에 `Skeleton: "@/components/ui/skeleton"` 추가 → `gd lint` / `gd react` 가 `<Skeleton>` 인식

3. **`generateOrderTsx()` 확장** — `packages/gd-cli/src/commands/order.ts`:
   - `data:` 엔트리 → `useQuery` hook + `isPending → <Skeleton />` 생성
   - import: `@tanstack/react-query` + `@/components/ui/skeleton`
   - 복수 쿼리 지원 (queryKey 배열)

4. **`gd-chat.md §5.9` 추가** — fetch 의도 안내:
   - 트리거: 디자이너가 "서버에서 데이터 가져와요" / "API 연결" 표현 시
   - 에이전트가 `.order.md` `data:` 섹션 추가 제안
   - decisions.md 에 "fetch 패턴 확정" 기록

5. **v5 시뮬레이션** — `dashboard.order.md` 작성 + `gd react dashboard` → `useQuery` + `<Skeleton>` 포함 TSX 확인

### Non-Functional Requirements

1. **하위 호환**: `data:` 없는 기존 `.order.md` / `.order.md` 없는 씬 — 영향 없음
2. **TDD**: `Skeleton` 카탈로그 등록 + `generateOrderTsx` data 확장 모두 테스트 PASS 후 구현
3. **TanStack Query 버전**: `@tanstack/react-query` v5 (`useQuery` API 기준)

## 🚫 Out of Scope

- `QueryClient` / `QueryClientProvider` 설정 (preset 전역 setup — phase-13 이후)
- `useMutation` 패턴 (POST/PUT/DELETE — fetch 읽기 전용 이번 scope)
- Suspense 모드 / `useSuspenseQuery` (phase-13 이후)
- Skeleton 애니메이션 커스터마이징
- 에러 상태 UI (`isError → <ErrorMessage>`) — 이월 항목으로 추적

## 📑 ADR 후보

- [ ] 없음 (spec-12-05 의 `.order.md data:` 섹션 설계가 이미 확정된 상태)

## ✅ Definition of Done

- [ ] `skeleton.tsx` preset 추가 + `component-registry-metadata.ts` 등록
- [ ] `gd lint` 에서 `<Skeleton>` 인식 (0 errors)
- [ ] `generateOrderTsx()` — `data:` 엔트리 → `useQuery` + `<Skeleton>` 코드 생성
- [ ] 관련 단위 테스트 PASS (order-runtime.test.ts 확장)
- [ ] `gd-chat.md §5.9` 추가
- [ ] v5 시뮬 — `dashboard.order.md` + `gd react dashboard` → `useQuery` + `<Skeleton>` 포함 TSX
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-12-06-unified-fetch-skeleton` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
