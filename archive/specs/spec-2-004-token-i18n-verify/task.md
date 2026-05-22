# Task List: spec-2-004

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-2.md SPEC 표 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: tokens.json Paper 값 반영

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-2-004-token-i18n-verify`
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. tokens.json 업데이트 + 빌드
- [ ] `studio/tokens/tokens.json` — primitive에 indigo/slate 추가, semantic에서 Paper 값 참조
- [ ] `pnpm tokens` → CSS 변수 재생성 확인
- [ ] `pnpm build` → 빌드 성공 확인
- [ ] Commit: `feat(spec-2-004): update tokens to match Paper design`

---

## Task 2: 브랜드 B 토큰 + 빌드 확장

### 2-1. 브랜드 B 토큰 + 빌드 스크립트
- [ ] `studio/tokens/tokens-brand-b.json` 작성 — teal 계열 대체 토큰
- [ ] `studio/tokens/build.mjs` 수정 — brand-b CSS 추가 생성
- [ ] `pnpm tokens` → `_tokens-brand-b.css` 생성 확인
- [ ] Commit: `feat(spec-2-004): add brand-b token set for theme switching`

---

## Task 3: LoginPage split-screen 레이아웃

### 3-1. LoginPage 개선
- [ ] `studio/src/components/templates/LoginPage/index.tsx` — Paper "Login" 디자인의 split-screen 반영
- [ ] 테스트 수정/확인 → Pass
- [ ] Commit: `feat(spec-2-004): update LoginPage to split-screen layout`

---

## Task 4: App 전환 UI + 검증

### 4-1. 전환 UI
- [ ] `studio/src/App.tsx` — 브랜드 A↔B, ko↔en, variant(page↔modal) 전환 버튼
- [ ] `pnpm build` → 빌드 성공 확인
- [ ] 전체 테스트 → Pass 확인
- [ ] Commit: `feat(spec-2-004): add theme/locale/variant switcher to App`

---

## Task 5: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm build`
- [ ] 전체 테스트 실행 → 모두 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Archive Commit**: `docs(spec-2-004): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-2-004-token-i18n-verify`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 (4 작업 + 1 Ship) |
| **예상 commit 수** | 6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-15 |
