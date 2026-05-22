# Task List: spec-09-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-09.md SPEC 표 자동 갱신 by sdd)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [x] `git checkout -b spec-09-03-studio-runtime`
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: parseChatSections 단위 테스트 작성 (TDD Red)

- [x] `studio/src/features/chat-viewer/__tests__/parseChatSections.test.ts` 작성
  - 정상 3섹션 추출 / 섹션 없음 → 빈 문자열 / 이모지 헤더 변형 / Structure 만 있음 / 단독 History
- [x] `cd studio && pnpm test src/features/chat-viewer/__tests__/parseChatSections` → Fail 확인
- [x] Commit: `test(spec-09-03): add failing parseChatSections tests`

---

## Task 3: parseChatSections 구현 (TDD Green)

- [x] `studio/src/features/chat-viewer/parseChatSections.ts` 구현
- [x] `cd studio && pnpm test src/features/chat-viewer/__tests__/parseChatSections` → 10/10 PASS
- [x] Commit: `feat(spec-09-03): implement parseChatSections`

---

## Task 4: chatApiPlugin 단위 테스트 + Vite 플러그인 구현

- [x] `studio/src/features/chat-viewer/__tests__/chatApiHandler.test.ts` 작성 (tmpdir 패턴, ~6 케이스)
  - `scanChats`: scenes + components + shell 수집 / 빈 루트 / 복수 루트 병합
- [x] `studio/src/features/chat-viewer/chatApiPlugin.ts` 구현
  - `scanChats(roots: string[]): ChatEntry[]`
  - `chatApiPlugin(): Plugin`
- [x] `cd studio && pnpm test src/features/chat-viewer/__tests__/chatApiHandler` → 6/6 PASS
- [x] Commit: `feat(spec-09-03): implement chatApiPlugin and scanChats`

---

## Task 5: useChats 훅 + ChatViewerPage UI

- [x] `studio/src/features/chat-viewer/useChats.ts` 구현
  - DEV: `fetch('/api/chats')` / PROD: FIXTURES fallback
- [x] `studio/src/features/chat-viewer/ChatViewerPage.tsx` 구현
  - 파일 목록 사이드바 (scene/component/shell 그룹)
  - 3탭 뷰어 (Narrative / Structure / History)
  - Shell Preview (`compileToPaper` → `<iframe srcDoc>`)
- [x] `cd studio && pnpm test` → 995/995 PASS
- [x] Commit: `feat(spec-09-03): add ChatViewerPage with 3-tab viewer and shell preview`

---

## Task 6: 라우터 등록 + dev 스크립트 정리

- [x] `studio/src/lib/router.ts` — `"chats"` 라우트 추가
- [x] `studio/src/App.tsx` — `<ChatViewerPage />` 연결 + 내비게이션 링크 추가
- [x] `studio/vite.config.ts` — `chatApiPlugin()` 추가
- [x] `studio/package.json` — `"dev"` 스크립트에서 `fixtures:gen &&` 제거
- [x] `cd studio && pnpm test` → 995/995 PASS
- [x] Commit: `feat(spec-09-03): register chats route and remove fixtures:gen from dev script`

---

## Task 7: Ship

> `/hk-ship` 절차를 따릅니다.

- [ ] `cd studio && pnpm build` → exit 0 확인
- [ ] 전체 테스트 `cd studio && pnpm test` → PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-09-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-09-03-studio-runtime`
- [ ] **PR 생성**: `phase-09-gen-design-live` 브랜치 대상
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (+ Ship) |
| **예상 commit 수** | 6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |
