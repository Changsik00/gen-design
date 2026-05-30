# Task List: spec-13-09

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md / plan.md / task.md 작성
- [x] phase-13.md spec 표 + 성공기준 9 갱신
- [x] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [x] `git checkout -b spec-13-09-token-design-pipeline`
- Commit: 없음

---

## Task 2 — 토큰 빌드 스크립트 (preset)

- [x] `presets-bundled/default/tokens/build.mjs` (무의존, tokens.json → globals.css 마커 영역)
- [x] `presets-bundled/default/src/styles/globals.css` — `/* tokens:start/end */` 마커 + 생성 영역
- [x] `presets-bundled/default/package.json` — `tokens` script + build 선행
- [x] 로컬 검증: 빌드 실행 → globals.css 재현 (기존과 동일 출력)
- [x] Commit: `feat(spec-13-09): add token build pipeline to preset (tokens.json → globals.css)`

---

## Task 3 — FRONT.md 토큰 빌드 + DESIGN.md 연결

- [x] FRONT.md §11 — `pnpm tokens` 파이프라인 명시 (tokens.json = 소스, globals.css = 생성물)
- [x] FRONT.md — 생성 시 DESIGN.md 컨벤션 반영 규칙 (raw hex 금지와 연결)
- [x] Commit: `docs(spec-13-09): document token pipeline + DESIGN.md enforcement in FRONT.md`

---

## Task 4 — 실증: todo 앱 토큰 자동반영

- [x] todo-persona 에 `tokens/build.mjs` + `pnpm tokens` 셋업 (preset 동일)
- [x] globals.css 마커 적용
- [x] before 스크린샷 (primary=neutral)
- [x] `tokens.json` primary → 인디고 → `pnpm tokens` → globals.css 갱신
- [x] after 스크린샷 (버튼/강조 색 전환, React 코드 0 변경)
- [x] e2e: `--primary` CSS var 값 검증
- [x] Commit: `test(spec-13-09): token auto-reflection 실증 (primary 변경 → 색 전환, 코드 0)`
  - 참고: todo-persona 미추적 — 증거를 walkthrough 첨부

---

## Task 5 — Ship

- [ ] **walkthrough.md** (파이프라인 + before/after 증거)
- [ ] **pr_description.md**
- [ ] **Ship Commit**: `docs(spec-13-09): ship walkthrough and pr description`
- [ ] **Push** + **PR 생성** (`phase-13-vertical-slice` 타겟)
- [ ] 사용자 알림

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 |
| **예상 commit 수** | 4 |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-30 |
