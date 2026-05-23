# spec-09-03: studio-runtime — 동적 chat 뷰어

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-09-03` |
| **Phase** | `phase-09` |
| **Branch** | `spec-09-03-studio-runtime` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

Studio UI(`#/spec`)는 `fixtures.generated.ts`(빌드타임 생성)에서 chat.md 콘텐츠를 읽는다. `pnpm dev` 실행 시 `fixtures:gen` 스크립트가 먼저 실행되어 `studio/src/features/preview/fixtures.generated.ts`를 생성한다. 현재 28개의 fixture가 하드코딩된 TS 파일로 번들에 포함된다.

`playground/chats/` 와 `chats/` 에 실제 작업 chat.md 파일이 있지만, UI에서 직접 볼 수 없다. 새 chat.md를 만들어도 `fixtures:gen`을 재실행해야 UI에 반영된다.

### 문제점

- 디자이너가 chat.md를 편집해도 UI에서 즉시 확인 불가 (dev 재시작 필요).
- `playground/chats/` + `chats/`의 실제 파일과 `fixtures/`의 테스트 픽스처가 다른 경로에 있어 혼란.
- chat.md의 3층 구조(Narrative / Structure / History)를 한눈에 보는 전용 뷰어가 없음.
- shell + scene 합성 결과(shell preview)를 확인하려면 CLI(`gen-design react`)를 써야 함.

### 해결 방안 (요약)

Vite dev server에 `/api/chats` 플러그인을 추가해 `chats/` + `playground/chats/`의 chat.md 파일을 런타임에 서빙한다. 새 라우트 `#/chats`에 ChatViewerPage를 추가: 왼쪽 파일 목록 + 오른쪽 3탭(Narrative/Structure/History) + 하단 Shell Preview. `fixtures.generated.ts`는 CI/테스트 전용으로 유지(dev에서는 사용 안 함).

## 🎯 요구사항

### Functional Requirements

1. Vite dev server 플러그인 `chatApiPlugin()` — `GET /api/chats` → `ChatEntry[]` (JSON). `chats/` + `playground/chats/` 아래의 `*.chat.md` 파일을 요청 시마다 스캔.
2. `useChats()` 훅 — `import.meta.env.DEV` 시 `/api/chats` fetch; prod 빌드 시 `FIXTURES` fallback.
3. `parseChatSections(text)` — chat.md 텍스트에서 Narrative / Structure / History 섹션 추출.
4. `#/chats` 라우트 → `ChatViewerPage` — 파일 목록(좌) + 탭 뷰어(우) 2-pane 레이아웃.
5. 파일 목록: scene / component / shell 타입별 그룹, 파일명 클릭 → 오른쪽 뷰어 갱신.
6. 탭 뷰어 3탭: **Narrative**(마크다운 원문) / **Structure**(AST 컴포넌트 목록) / **History**(history 섹션 원문).
7. Shell Preview — scene 선택 시 `_shell.chat.md` + scene 텍스트를 합산해 `compileToPaper`로 렌더링 → `<iframe srcDoc>` 표시. shell 없거나 scene 아닌 경우 "No shell preview" 표시.
8. dev 서버 재시작 없이 chat.md 파일 추가/수정 → 브라우저 새로고침으로 목록 갱신.
9. `pnpm dev` 스크립트에서 `fixtures:gen` 제거 (`pnpm build`에서는 유지 — CI/테스트 계속 사용).

### Non-Functional Requirements

1. 프로덕션 빌드에 `/api/chats` 엔드포인트 노출 없음 (`configureServer`는 dev-only).
2. 단위 테스트: `parseChatSections` (섹션 추출) + `chatApiPlugin` 핸들러 내부 로직.
3. 기존 `#/spec`, `#/new`, `#/design` 라우트 회귀 없음.
4. 기존 979 테스트 PASS 유지.

## 🚫 Out of Scope

- chat.md 인라인 편집 UI (read-only 뷰어만).
- 파일 생성 / 삭제 UI.
- WebSocket live-reload (수동 새로고침으로 충분).
- `fixtures/chats/` 디렉토리 구조 변경.
- `#/spec` SpecEditorPage 기능 수정.

## 📑 ADR 후보

- [x] 없음 (Vite dev-only 플러그인 패턴은 관행적 — ADR 불필요)

## ✅ Definition of Done

- [ ] 모든 단위 테스트 PASS (`cd studio && pnpm test`)
- [ ] Integration Test Required = no
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-09-03-studio-runtime` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
