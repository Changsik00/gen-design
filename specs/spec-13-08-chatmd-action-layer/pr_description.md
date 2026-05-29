# feat(spec-13-08): chat.md v2 Action/Interaction 레이어

## 📋 Summary

### 배경 및 목적

페르소나 재현 테스트에서 발견: chat.md v2가 UI/데이터는 담지만 **동작(버튼/폼/인터랙션) 명세가 없어** LLM이 동작 로직을 즉흥 구현하고 FRONT.md의 TanStack Query 규칙 대신 `useState`를 썼다. v1 `.order.md`(validation+action)가 spec-13-06에서 제거된 뒤 v2로 흡수되지 않은 구멍이다.

chat.md v2에 **`## ⚡ Actions` 레이어**를 추가해 동작을 명세하고, todos 화면을 MSW + TanStack Query 기반으로 풀 실증한다.

### 주요 변경 사항

- [x] `docs/chatmd-v2-format.md` — `## ⚡ Actions` 섹션 (forms / interactions / queries / navigation)
- [x] `gd-chat` 스킬 — Actions 작성 가이드 §5.10.5 + §5.5 체크리스트 8단계 + §7.6 연결
- [x] ADR-011 — v2 레이어에 Actions 추가
- [x] dashboard 예시 + 실증(todos)

### Phase 컨텍스트

- **Phase**: `phase-13` (성공기준 8 충족)
- **역할**: chat.md v2 포맷의 동작 명세 완성. "UI만 명세 → LLM 즉흥"에서 "동작까지 명세 → 결정적 Query/Mutation 생성"으로.

## 🎯 Key Review Points

1. **Actions 4블록** (`docs/chatmd-v2-format.md`): forms(검증+제출) / interactions(클릭·토글→API+effect) / queries(Data.source→queryKey) / navigation. → LLM이 useQuery/useMutation/zod/Link로 결정적 생성.

2. **FRONT.md Query 규칙 강제 실증**: todos.tsx 서버데이터 useState **0건**, useQuery 4 + useMutation 8. 동작 e2e로 add/toggle/delete가 mutation+invalidate, filter가 client-state임을 검증.

3. **MSW 정석 통합**: in-memory CRUD 핸들러 + worker. useQuery가 MSW 응답 받음.

## 🧪 Verification

```
pnpm exec playwright test            # 18 passed (기능 6 + 반응형 7 + Action 5)
pnpm exec playwright test action     # 5 passed (Query+MSW 동작)
grep useState<Todo todos.tsx         # 0 (서버데이터 useState 없음)
```

## 📦 Files Changed

### 🛠 Modified Files
- `docs/chatmd-v2-format.md` (+85): Actions 레이어 정의
- `packages/gd-skills/skills/gd-chat.md` (+61): Actions 작성 가이드
- `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`: 레이어 목록 갱신
- `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md`: Actions 예시
- `backlog/phase-13.md`: 성공기준 8 + spec-13-08 등재

**Total**: 5 tracked files (+ todo-persona Actions 실증 — git 미추적, walkthrough 첨부)

## ✅ Definition of Done

- [x] Actions 레이어 포맷 정의
- [x] gd-chat 가이드 + ADR-011 갱신
- [x] todos Action 명세 → MSW + Query 재생성 + 동작 e2e 5 PASS
- [x] 전체 회귀 18 PASS
- [x] walkthrough / pr_description ship

## 🔗 관련 자료

- ADR: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
- 포맷: `docs/chatmd-v2-format.md` §Actions
- Walkthrough: `specs/spec-13-08-chatmd-action-layer/walkthrough.md`
