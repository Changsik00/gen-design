# Task List: spec-12-06

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 백로그 업데이트 (phase-12.md SPEC 표 갱신 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-12-06-unified-fetch-skeleton` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: Skeleton 컴포넌트 추가 + 카탈로그 등록

- [ ] `packages/create-gd-react/presets-bundled/default/src/components/ui/skeleton.tsx` 신규 작성
- [ ] `studio/src/lib/chat-md-compiler/paper/component-registry-metadata.ts` 에 `Skeleton` 등록
- [ ] `pnpm test` → 기존 테스트 회귀 없음 확인
- [ ] Commit: `feat(spec-12-06): add Skeleton component and register in catalog`

---

## Task 3: generateOrderTsx data 확장 — TDD Red

- [ ] `packages/gd-cli/src/commands/__tests__/order-runtime.test.ts` 에 data 케이스 5개 추가:
  - `useQuery` + `Skeleton` import 생성
  - `isPending → <Skeleton />` early return 생성
  - queryKey camelCase 변환 (`tasks.list` → `tasks_list`)
  - 복수 쿼리 (2개 data 항목) 처리
  - `.order.md` 없는 씬 → 기존 TSX 동일 (회귀)
- [ ] 테스트 실행 → data 케이스 Red 확인
- [ ] Commit: `test(spec-12-06): order-runtime data red — useQuery and Skeleton injection`

---

## Task 4: generateOrderTsx data 확장 — Green

- [ ] `packages/gd-cli/src/commands/order.ts` 수정:
  - `data:` 엔트리 → `buildQueryHook()` 생성
  - `generateOrderTsx()` — data 있으면 import + formInit + onSubmit 에 주입
- [ ] `pnpm test` → 전체 Green, 기존 테스트 회귀 없음
- [ ] Commit: `feat(spec-12-06): generateOrderTsx data — useQuery and Skeleton injection`

---

## Task 5: gd-chat.md §5.9 추가

- [ ] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` 수정:
  - §5.8 다음에 §5.9 삽입 — fetch 의도 안내 + `.order.md data:` 추가 유도
  - §12 종료 조건 업데이트
- [ ] Commit: `feat(spec-12-06): add §5.9 fetch-intent guide to gd-chat`

---

## Task 6: v5 시뮬레이션 검증

- [ ] `experiments/dogfood-alpha-v5/chats/scenes/dashboard.order.md` 작성 (data: 2개)
- [ ] `gd react dashboard` 실행 → `useQuery` + `<Skeleton>` 포함 TSX 확인
- [ ] `experiments/dogfood-alpha-v5/transcripts/scene-7-fetch.md` 작성
- [ ] Commit: `docs(spec-12-06): v5 fetch-skeleton simulation transcript`

---

## Task 7: Ship

- [ ] 최종 검토: DoD 체크 / 테스트 전체 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-12-06): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-12-06-unified-fetch-skeleton`
- [ ] **PR 생성**: `gh pr create` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 (브랜치 + Skeleton + TDD Red + Green + 스킬 + 시뮬 + Ship) |
| **예상 commit 수** | 6 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-23 |
