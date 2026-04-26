# Task List: spec-5-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-5.md SPEC 표 갱신, queue.md active 마커)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 및 PoC 디렉토리 셋업

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-5-01-app-a-blueprint`
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. PoC 디렉토리 + .gitkeep
- [x] `mkdir -p poc/app-a` + `touch poc/app-a/.gitkeep`
- [x] Commit: `chore(spec-5-01): scaffold poc/app-a directory`

---

## Task 2: Blueprint 세션 기록 작성

### 2-1. blueprint-session.md 작성
- [x] `poc/app-a/blueprint-session.md` 작성
  - Step 1: 앱 유형 (SaaS) 선택 + 앱 이름 / slug / 브랜드 결정 근거
  - Step 1.5: NFR (auth / i18n / theme) 추가 — 프로토콜에 존재하나 spec.md 누락 → findings 등재 예정
  - Step 2: 추천 페이지 세트 확인 + LoginPage / SignupPage / DashboardPage / MyPage / NotFoundPage 구성
  - Step 3: 각 페이지 variant + 필수 / 선택 섹션 확정
  - 마지막: protocol 출력 형식 YAML 블록
- [x] Commit: `docs(spec-5-01): record blueprint session for app-a`

---

## Task 3: REQUIREMENTS.md 작성

### 3-1. REQUIREMENTS.md 치환
- [x] `templates/REQUIREMENTS.md.template` 을 base 로 `poc/app-a/REQUIREMENTS.md` 생성
- [x] 모든 placeholder (`{{...}}`) 를 blueprint-session.md 의 결정값으로 치환
- [x] 5 페이지 명세 (variant + 섹션 + Template 매핑) 작성
- [x] 검증: `grep -c '{{' poc/app-a/REQUIREMENTS.md` 가 0
- [x] Commit: `docs(spec-5-01): generate REQUIREMENTS.md for app-a`

---

## Task 4: DESIGN.md 작성

### 4-1. DESIGN.md 작성
- [x] `poc/app-a/DESIGN.md` 작성, `schema/design-md-schema.md` 구조 준수 (14 섹션)
  - 토큰: color (인디고 + 청록) / typography / spacing / radius — 정확 hex 는 spec-5-02 TODO
  - i18n: en 키 (45 항목, 5 페이지 화면 텍스트 커버)
  - Visual 정확값은 의도적으로 TODO(spec-5-02) — Phase 4 회고 W2 (Blueprint vs Compose 측정 분리) 반영
- [x] Commit: `docs(spec-5-01): write DESIGN.md tokens and i18n for app-a`

---

## Task 5: AGENT.md 작성

### 5-1. AGENT.md 치환
- [x] `templates/AGENT.md.template` 을 base 로 `poc/app-a/AGENT.md` 작성
- [x] 후속 spec-5-02 / 5-03 에서 AI 에이전트가 따를 운영 규약 명시 (§7 PoC 한정 규약)
- [x] Commit: `docs(spec-5-01): write AGENT.md for app-a`

---

## Task 6: Findings 기록

### 6-1. findings.md 작성
- [x] `poc/app-a/findings.md` 작성, 작성 중 발견한 결함 / 모호성 항목별 기록
- [x] 최소 3 항목 (실제 7 항목 등재), 분류 태그 (`gap` / `ambiguity` / `placeholder-mismatch`)
- [x] 각 항목: 발견 위치, 현상, 영향, 처리 제안
- [x] Commit: `docs(spec-5-01): record blueprint pipeline findings`

---

## Task 7: 자기검증 체크리스트

### 7-1. 산출물 일관성 점검
- [x] REQUIREMENTS.md placeholder 0 잔존 (`grep -c '{{' poc/app-a/REQUIREMENTS.md` = 0)
- [x] 4 종 산출물의 페이지 ID 가 `schema/page-catalog.md` 에 모두 존재 (auth-login / auth-signup / dash-overview / profile-mypage / common-error 5 종 + blueprint-session.md 의 제거 후보 5 종 모두 카탈로그 ID)
- [x] DESIGN.md i18n 키 47 개 — 5 페이지 + nav + app + auth 네임스페이스 커버
- [x] DESIGN.md 토큰 표기 — `--color-*` / `--font-size-*` / `--space-*` / `--radius-*` 35 회 참조, Phase 1 컨벤션 (`tokens.json → _tokens-*.css → Tailwind`) 와 일치 (정확 hex 는 의도적 TODO(spec-5-02))
- [x] findings.md 에 7 항목 등재 (최소 3 초과)
- [x] 검증 결과를 `walkthrough.md` 의 Verification 섹션에 기록 — Task 8 에서 처리
- [x] 본 task 자체에는 commit 없음 (검증만)

---

## Task 8: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] **walkthrough.md 작성** (증거 로그 — Task 7 자기검증 결과 + 산출물 요약)
- [x] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-5-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-5-01-app-a-blueprint`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **예상 commit 수** | 7 (Pre-flight scaffold + 1-2 chore + 2~6 docs + Ship docs) |
| **현재 단계** | Ship (push 직전) |
| **마지막 업데이트** | 2026-04-26 |
