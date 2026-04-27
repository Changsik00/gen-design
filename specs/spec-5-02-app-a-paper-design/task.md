# Task List: spec-5-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.
> 본 spec 은 코드 변경이 없는 디자인·문서 산출물 spec 이므로 TDD Red/Green 대신 *작성 → 검증* 사이클을 사용합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new app-a-paper-design`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-5.md SPEC 표 갱신 + Icebox 추가) — Task 1 (housekeeping) commit 으로 push 예정
- [x] 사용자 Plan Accept (2026-04-28)

---

## Task 1: Housekeeping — spec-5-01 잔재 정리 + 거버넌스 갱신

> 이미 working tree 에 있는 변경 (`.gitignore` / `task.md` / `phase-5.md` / `queue.md`) 을 첫 commit 으로 흡수.
> 브랜치는 PLANNING 단계에서 이미 생성됨 (`spec-5-02-app-a-paper-design`).

### 1-1. 변경 확인 + commit

- [x] `git status` — 미커밋 변경 확인 (`.gitignore` / `backlog/phase-5.md` / `backlog/queue.md` / `specs/spec-5-01-app-a-blueprint/task.md` / `specs/spec-5-02-app-a-paper-design/`)
- [x] `git add .gitignore backlog/phase-5.md backlog/queue.md specs/spec-5-01-app-a-blueprint/task.md specs/spec-5-02-app-a-paper-design/`
- [x] `.claude/settings.local.json` 은 stage 하지 않음 (사용자 로컬 설정)
- [x] Commit: `chore(spec-5-02): housekeeping — spec-5-01 ship 잔재 + phase-5 spec-5-02 정의 갱신`

---

## Task 2: DESIGN.md 에 Settings 페이지 정의 추가

> spec-5-01 산출물 `poc/app-a/DESIGN.md` 의 §10 (Page Map) / §11 (Page Specifications) / §12 (Composite Components) / §14 (i18n References) 에 Settings 페이지 추가. 시각 디자인 정확값 (`TODO(spec-5-02)`) 은 이 task 에서는 채우지 않음 (Task 6 에서 Paper 추출 후 일괄).

### 2-1. Settings 페이지 정의 작성

- [ ] §10 Page Map 에 행 추가: `| 설정 | /settings | 토글/선택/슬라이더 등 사용자 환경 설정 |`
- [ ] §11 Page Specifications 에 `### 설정 (settings-overview)` 섹션 추가:
  - Route: `/settings`, Variant: `page`, Layout: `shell (sidebar + main)`
  - Section / Block 표 (Toggle / Select / Slider / Section header / Group list 5 종 이상 컴포넌트 포함)
- [ ] §12 Composite Components 에 SettingsToggleRow / SettingsSelectRow / SettingsSliderRow / SettingsGroup 추가 (Element 표 포함)
- [ ] §14 i18n References 에 `settings.*` 키 추가 (제목 / 그룹 / 항목 라벨)
- [ ] §10 의 Page Map 에 본 행과 함께 기존 `nav.settings` 링크가 정상 라우팅 되도록 일관성 확인
- [ ] Commit: `docs(spec-5-02): add Settings page spec to DESIGN.md`

---

## Task 3: 4 페이지 AI 자동 생성 (Login / Signup / Dashboard / MyPage)

> Paper MCP 로 artboard 4 개 작성. 작성 직후 사용자 시각 검수 → 의도적 보정 최소화.

### 3-1. Paper MCP 사전 점검

- [ ] `get_basic_info` — 기존 artboard 와 폰트 / 토큰 환경 확인
- [ ] `get_font_family_info` — Inter / JetBrains Mono 사용 가능 여부
- [ ] (선택) `get_guide({ topic: "paper-mcp-instructions" })` — 세션 첫 사용 시

### 3-2. Login artboard 작성

- [ ] `create_artboard` (또는 `write_html`) — DESIGN.md §11 의 auth-login 정의 그대로
- [ ] `get_screenshot` 으로 검수
- [ ] `finish_working_on_nodes`
- [ ] artboard URL 메모

### 3-3. Signup artboard 작성

- [ ] DESIGN.md §11 의 auth-signup 정의 그대로
- [ ] 검수 + URL 메모

### 3-4. Dashboard artboard 작성

- [ ] DESIGN.md §11 의 dash-overview 정의 그대로
- [ ] 검수 + URL 메모

### 3-5. MyPage artboard 작성

- [ ] DESIGN.md §11 의 profile-mypage 정의 그대로
- [ ] 검수 + URL 메모

### 3-6. Commit

- [ ] Commit: `docs(spec-5-02): create 4 paper artboards (login/signup/dashboard/mypage) via AI`
  - artboard 자체는 Paper 클라우드에 저장되므로 commit 본문에 URL 4 개 명시.

---

## Task 4: Settings 원본 의도 메모 + Designer 직접 그림

> 본 task 는 사용자 (Dennis) 의 직접 작업이 필요. 에이전트는 의도 메모 작성 → 사용자 작업 대기 → 완료 신호 받기까지.

### 4-1. 원본 의도 메모 작성

- [ ] `poc/app-a/intent-preservation.md` 신규 작성
- [ ] §1 "Settings 원본 의도" — Designer 가 그릴 항목 사전 선언:
  - 컴포넌트 5 종 이상 (Toggle / Select / Slider / Section header / Group list)
  - 토큰 자극 의도 (예: `--space-md` 그룹 간격 / `--radius-md` 각 row / state color 4 종 toggle on/off)
  - i18n 키 후보 ≥ 5 개
- [ ] §2 "추출 결과 비교" — 빈 표 (의도 항목 / AI 추출 / 일치 여부)
- [ ] Commit: `docs(spec-5-02): write Settings intent memo before manual paper drawing`

### 4-2. 사용자 직접 그림 STOP

- [ ] 사용자에게 "Paper 에서 Settings artboard 직접 그려주세요" 알림
- [ ] 사용자 완료 신호 ("그렸어" / artboard URL 전달) 수신 → 다음 task 로
- [ ] Commit: 없음 (인적 작업 단계)

---

## Task 5: 5 페이지 AI 추출 → design-extract/

### 5-1. Login 추출

- [ ] `get_jsx` / `get_computed_styles` / `get_fill_image` 등 활용
- [ ] `poc/app-a/design-extract/auth-login.md` 작성 (schema 14 섹션 준수)

### 5-2. Signup 추출

- [ ] `poc/app-a/design-extract/auth-signup.md`

### 5-3. Dashboard 추출

- [ ] `poc/app-a/design-extract/dash-overview.md`

### 5-4. MyPage 추출

- [ ] `poc/app-a/design-extract/profile-mypage.md`

### 5-5. Settings 추출

- [ ] `poc/app-a/design-extract/settings-overview.md`

### 5-6. Commit

- [ ] schema 정합성 검사: `for f in poc/app-a/design-extract/*.md; do echo "$f:"; grep -c "^## " "$f"; done` — 각 파일 ≥ 14
- [ ] Commit: `docs(spec-5-02): extract 5 paper artboards into design-extract/`

---

## Task 6: DESIGN.md 의 TODO(spec-5-02) 채우기

> 5 페이지 추출 결과를 비교해 합의된 값만 채움. 페이지 간 모순값은 finding 으로 기록 (Task 8).

### 6-1. 토큰 합의값 추출

- [ ] §2 Color Palette: Primary / Primary-hover / Primary-active / Accent / Status 4 종 hex 채움
- [ ] §3 Typography: Display / H1~3 / Body / Caption / Mono 의 정확 px / line-height / letter-spacing 채움
- [ ] §4 Component Stylings: Button / Input / Card / Modal 의 정확 padding / radius / 그림자값 채움
- [ ] §6 Depth & Elevation: elevation-card / elevation-modal 의 정확 box-shadow 값 채움
- [ ] §13 Token Mapping: Color Tokens 표 의 hex 컬럼 채움

### 6-2. 검증 + commit

- [ ] `grep -c "TODO(spec-5-02)" poc/app-a/DESIGN.md` → 0
- [ ] Commit: `docs(spec-5-02): fill DESIGN.md TODO markers with paper-extracted values`

---

## Task 7: drift 측정 + 의도 보존 비교

### 7-1. drift-report.md 작성

- [ ] `poc/app-a/drift-report.md` 신규 작성
- [ ] §1 "5 페이지 × N 항목 drift 표" — Section / Block / 컴포넌트 / 토큰 / i18n 키 단위
- [ ] §2 "표기 정규화 전후 비교" — oklch ↔ hex / rgba ↔ 8-hex / padding 단일 ↔ block-inline / fontFamily fallback
- [ ] §3 "페이지별 drift 점수 + 패턴 요약"
- [ ] §4 "결론" — 본질적 drift 와 표기 차이의 분리

### 7-2. intent-preservation.md 의 §2 채우기

- [ ] Settings 의도 메모(§1) vs `design-extract/settings-overview.md` 항목별 비교
- [ ] 일치 / 부분 일치 / 불일치 분류
- [ ] 손실 패턴 요약 (예: Slider state 누락 / Toggle on/off 색 표기 차이 등)

### 7-3. Commit

- [ ] Commit: `docs(spec-5-02): write drift report and intent preservation comparison`

---

## Task 8: findings.md 갱신 (phase-6 입력)

### 8-1. paper-normalizer 함수 후보 추가

- [ ] `poc/app-a/findings.md` 의 "phase-6 입력" 섹션 (없으면 신규 생성) 에 추가:
  - drift / 정규화 작업 중 발견된 반복 패턴 → 함수 후보 ≥ 1 개
  - 예: `normalizeOklchToHex(oklch: string): string` / `normalizePadding(padding: string | object): { block, inline }`
- [ ] Commit: `docs(spec-5-02): record paper-normalizer function candidates for phase-6`

---

## Task 9: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

### 9-1. 사전 점검

- [ ] schema 정합성 검사: `grep -c "^## " poc/app-a/DESIGN.md` (≥ 14) + `for f in poc/app-a/design-extract/*.md; do grep -c "^## " "$f"; done`
- [ ] 통합 테스트:
  - `grep -c "TODO(spec-5-02)" poc/app-a/DESIGN.md` → 0
  - `wc -l poc/app-a/drift-report.md poc/app-a/intent-preservation.md` → 모두 > 0
  - `ls poc/app-a/design-extract/*.md | wc -l` → 5
- [ ] task.md 의 모든 체크박스 `[x]` 또는 `[-]` 확인 (Pending `[ ]` 0 개)

### 9-2. walkthrough.md / pr_description.md 작성

- [ ] `.harness-kit/agent/templates/walkthrough.md` 읽고 작성
- [ ] `.harness-kit/agent/templates/pr_description.md` 읽고 작성
- [ ] 한국어 + 템플릿 준수

### 9-3. Ship commit + push + PR

- [ ] Commit: `docs(spec-5-02): ship walkthrough and pr description`
- [ ] Push: `git push -u origin spec-5-02-app-a-paper-design`
- [ ] PR 생성: `gh pr create` (또는 `/hk-pr-gh`) — base `main`
- [ ] 사용자 알림: 푸시 완료 + PR URL 보고 → 머지 대기

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 (Housekeeping / Settings 정의 / AI 4 페이지 / 의도 메모 + 사용자 작업 / AI 5 추출 / DESIGN TODO 채우기 / drift+의도 보고 / findings 갱신 / Ship) |
| **예상 commit 수** | 9 (Task 4-2 는 인적 작업 단계로 commit 없음, 따라서 8 commit. Ship 1 commit 포함 시 9 commit) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-27 |
