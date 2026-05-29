# Walkthrough: spec-13-05

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Chat Viewer 파일 소스 | `/api/chats` (DEV) / fixtures (prod) | **vite.config에서 `fixtures/chats/` 를 스캔** | 기존 `chats/` + `playground/chats/` 삭제로 DEV 모드에서 빈 목록. `fixtures/chats/`로 경로 교체 |
| a11y 검사 포함 여부 | 포함 / 제외 | **제외** | 별도 spec-x로 추진. 이번 spec은 시나리오 기반 동작 검증에 집중 |
| MSW 통합 | 포함 / 제외 | **제외** | Studio는 백엔드 API 없음. 생성 앱에서 MSW를 쓰는 패턴은 사용자 앱 수준 |
| fixtures.generated.ts 갱신 | 수동 / CI 자동 | **CI에서 `fixtures:gen` step 추가** | 파일 추가/삭제 시 자동 반영 |
| 탭 전환 검증 방식 | 활성 탭 CSS 클래스 확인 / 탭 버튼 가시성 | **탭 버튼 가시성 + 크래시 없음** | CSS 클래스는 구현 세부사항. 사용자 관점에서 "탭이 보이고 클릭 가능한가"가 핵심 |

- [ ] 없음 (ADR 승격 대상 없음)

## 💬 사용자 협의

- **주제**: 시나리오 기반 e2e 방향
  - **사용자 의견**: 새롭게 e2e를 시작하자. 기존 smoke/a11y는 도움이 안 됨.
  - **합의**: 라우트 로딩(smoke) + Chat Viewer 상태별 동작(시나리오) 두 레이어로 재설계. MSW/a11y는 후속 spec으로 분리.

## 🧪 검증 결과

### 1. E2E 테스트

```
pnpm --filter studio test:e2e
9 passed (2.5s)
```

- smoke: 6개 라우트 모두 PASS
- chats: 시나리오 A/B/C 모두 PASS

### 2. 발견 및 수정 사항

1. **vite.config 경로 수정**: `chatApiPlugin`이 삭제된 `../chats` + `../playground/chats`를 스캔하고 있었음 → `../fixtures/chats/`로 교체
2. **fixtures:gen 실패**: `fixtures/chats/components/` 삭제로 인해 generator가 crash → `loadCategory`에 try-catch 추가

## 🔍 발견 사항

- Studio DEV 모드에서 `/api/chats` → `fixtures/chats/` 경로. 앞으로 fixtures/chats/scenes에 파일 추가 시 자동 반영됨.
- Chat Viewer가 DEV에서 API, prod에서 fixtures 사용하는 이중 경로를 가짐 — 향후 통합 가능 (spec-x 후보).

## 🚧 이월 항목

- **a11y 자동 검사** → spec-x
- **MSW 통합 테스트** → phase-14 또는 spec-x
- **gen-design lint CI step 복원** → `fixtures/chats/`로 chat-root 업데이트 후 복원 필요

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-29 |
| **최종 commit** | `c4cf3e3` |
