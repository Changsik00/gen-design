# PR: spec-12-06 — 일관된 fetch + Skeleton UI 패턴

## 요약

`.order.md data:` 섹션을 선언하면 `gd react` 가 TanStack Query v5 `useQuery` hook + `<Skeleton />` early return 을 자동 주입하는 파이프라인 구현.

## 변경 내역

### feat: Skeleton 컴포넌트 추가 + 카탈로그 등록
- `packages/create-gd-react/.../skeleton.tsx` 신규 (shadcn 표준, animate-pulse)
- `studio/src/components/ui/skeleton.tsx` 신규 (studio preview 용)
- `component-registry-metadata.ts`, `COMPONENT_REGISTRY`, `catalog.json` 등록 (29 components)

### feat: generateOrderTsx data 지원 (TDD)
- `order-runtime.test.ts` data 케이스 5개 (Red → Green)
- `order.ts` — `buildQueryHook()` + `queryKeyToCamel()` + `generateOrderTsx` data 분기
- `queryKey: tasks.list` → `tasks_listData / tasks_listPending` camelCase 변환
- `isPending → <Skeleton />` early return 자동 삽입

### feat: gd-chat §5.9 fetch 의도 안내
- 트리거: "서버에서 가져와요", "API 연결" 등 언급 시
- 에이전트가 `.order.md data:` 섹션 작성 가이드
- §12 종료 조건에 §5.9 체크 항목 추가

### docs: v5 시뮬레이션
- `dashboard.order.md` (data: 2개) + `gd react` 실행 결과 검증
- `scene-7-fetch.md` transcript

## 테스트

- gd-cli: **241 tests** Green (22 files)
- studio: **875 tests** Green (120 files)
- create-gd-react: **28 tests** Green (4 files)
- 회귀 없음

## 관련 Spec

- spec-12-05 — `.order.md` 포맷 기반 (validation/actions)
- spec-12-06 — 본 PR (data fetch 확장)
