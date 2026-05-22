# Walkthrough: spec-09-03 — studio-runtime

## 커밋 순서

| 커밋 | 설명 |
|---|---|
| `bdcf106` | test(spec-09-03): add failing parseChatSections tests |
| `658128c` | feat(spec-09-03): implement parseChatSections |
| `e9c0c07` | test(spec-09-03): add failing chatApiHandler tests |
| `637f757` | feat(spec-09-03): implement chatApiPlugin and scanChats |
| `8ae7a34` | feat(spec-09-03): add ChatViewerPage with 3-tab viewer and shell preview |
| `7788c62` | feat(spec-09-03): register chats route and remove fixtures:gen from dev script |

## 주요 결정 로그

### 1. 섹션 헤더 — 🧩 Structure (🏗 이 아님)

plan.md에서 `## 🏗 Structure`로 예상했으나 실제 playground/chats 파일들은 `## 🧩 Structure`를 사용한다. 테스트 작성 전 실제 파일을 확인하여 올바른 이모지를 사용했다. suffix(예: `(4축)`)도 허용하는 정규식으로 처리.

### 2. chatApiPlugin — vite.config.ts 에서 직접 import

`chatApiPlugin`을 `src/features/chat-viewer/chatApiPlugin.ts`에서 직접 import하여 vite.config.ts에 추가. Vite 플러그인이 Node.js fs API를 사용하므로 브라우저 번들과 분리 필요 — `configureServer`가 dev-only이므로 자동으로 prod 빌드에서 미노출.

### 3. useChats prod fallback — dynamic require

`import.meta.env.DEV` false일 때 `FIXTURES`를 `require`로 동적 로드. 빌드타임에 tree-shaking되어 dev path가 prod 번들에 포함되지 않음.

### 4. StudioLayout NAV_ITEMS 타입 수정 없음

`StudioLayout.tsx`의 `NavItem.route` 타입이 `Exclude<StudioRoute, "playground" | "blueprint" | "editor" | "preview">`이므로 `"chats"` 추가 시 `StudioRoute`에 `"chats"`가 있으면 자동으로 허용됨. 별도 타입 수정 불필요.

### 5. pnpm dev 스크립트 — fixtures:gen 제거

`"dev": "vite"`로 단순화. dev 서버 시작 전 fixtures 생성 불필요. 브라우저에서 `/api/chats`로 실시간 스캔. `pnpm build`는 그대로 유지.

## 테스트 결과

| 테스트 | 결과 |
|---|---|
| `parseChatSections.test.ts` | 10/10 PASS |
| `chatApiHandler.test.ts` | 6/6 PASS |
| 전체 회귀 (`pnpm test`) | **995/995 PASS** |
