# Task List: spec-1-003

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-1.md SPEC 표 갱신 — sdd 자동)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-1-003-design-token-pipeline`
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 2: 토큰 소스 및 Style Dictionary 파이프라인

### 2-1. Style Dictionary 설치
- [x] `npm install -D style-dictionary`

### 2-2. 토큰 JSON 작성
- [x] `studio/tokens/tokens.json` — W3C DTCG 포맷
  - Color: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1~5, sidebar(7종)
  - Color dark: .dark 모드 전체 오버라이드
  - Radius: base + 파생 (sm~4xl)
  - Font: sans, heading
- [x] 2계층: 원시 토큰(oklch) → 시맨틱 토큰 참조

### 2-3. 빌드 스크립트 작성
- [x] `studio/tokens/build.mjs` — Style Dictionary v5 설정
- [x] `package.json`에 `"tokens"` 스크립트 추가

### 2-4. 빌드 실행 및 확인
- [x] `npm run tokens` → `src/styles/_tokens-light.css`, `_tokens-dark.css` 생성 확인
- [x] Commit: `feat(spec-1-003): add design token pipeline with style dictionary`

---

## Task 3: shadcn/ui 테마 연결

### 3-1. index.css 수정
- [x] `_tokens-light.css`, `_tokens-dark.css` import 추가
- [x] 하드코딩된 `:root`/`.dark` CSS 변수 제거 → 토큰 출력으로 교체

### 3-2. 빌드 검증
- [x] `npm run build` 성공 확인 (tokens → tsc → vite 전체 파이프라인)
- [x] Commit: `feat(spec-1-003): connect tokens to shadcn/ui theme variables`

---

## Task 4: i18n 텍스트 리소스 구조

### 4-1. i18n JSON 작성
- [x] `studio/src/i18n/ko.json` — 한국어 샘플 (common, login, signup, dashboard)
- [x] `studio/src/i18n/en.json` — 영어 샘플
- [x] Schema §14 네임스페이스 규약 준수 확인
- [x] Commit: `feat(spec-1-003): add i18n resource structure with ko/en samples`

---

## Task 5: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] `npm run tokens` + `npm run build` 최종 확인
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Archive Commit**: `docs(spec-1-003): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-1-003-design-token-pipeline`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 (브랜치 + 파이프라인 + 테마연결 + i18n + Ship) |
| **예상 commit 수** | 4 (파이프라인 1 + 테마 1 + i18n 1 + archive 1) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-04-12 |
