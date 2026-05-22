feat(spec-09-03): studio-runtime — 동적 chat 뷰어 + fixtures:gen dev 의존 제거

## Summary

- Vite dev server에 `chatApiPlugin` 추가 — `GET /api/chats`로 `chats/` + `playground/chats/` 실시간 스캔
- `pnpm dev` 스크립트에서 `fixtures:gen` 제거 — dev 서버 시작이 즉각적으로
- `#/chats` 신규 라우트 + `ChatViewerPage` — 파일 목록(좌) + 3탭 뷰어(우) + Shell Preview
- `parseChatSections` 유틸 — Narrative / Structure / History 섹션 추출

## 변경 파일

| 파일 | 변경 유형 |
|---|---|
| `studio/src/features/chat-viewer/parseChatSections.ts` | NEW — 섹션 파서 |
| `studio/src/features/chat-viewer/chatApiPlugin.ts` | NEW — Vite 플러그인 + scanChats |
| `studio/src/features/chat-viewer/useChats.ts` | NEW — DEV fetch / PROD fixtures 훅 |
| `studio/src/features/chat-viewer/ChatViewerPage.tsx` | NEW — 3탭 뷰어 + Shell Preview |
| `studio/src/lib/router.ts` | MODIFY — `"chats"` 라우트 추가 |
| `studio/src/App.tsx` | MODIFY — ChatViewerPage 연결 |
| `studio/src/components/layout/StudioLayout.tsx` | MODIFY — "Chats" 내비 항목 추가 |
| `studio/vite.config.ts` | MODIFY — chatApiPlugin 등록 |
| `studio/package.json` | MODIFY — dev 스크립트 fixtures:gen 제거 |

## Test plan

- [x] `parseChatSections.test.ts` → 10/10 PASS
- [x] `chatApiHandler.test.ts` → 6/6 PASS
- [x] `cd studio && pnpm test` → 995/995 PASS (전체 회귀 없음)
- [x] `pnpm dev` fixtures:gen 없이 정상 시작 확인

🤖 Generated with [Claude Code](https://claude.com/claude-code)
