# phase-10: 검증 자동화

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-10-{seq}-{slug}/spec.md` 에서 다룹니다.
>
> 본 문서는 "이번 phase 에서 무엇을 어디까지 할 것인가" 를 한 번에 보기 위한 *업무 지도* 입니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-10` |
| **상태** | Dropped |
| **시작일** | 2026-05-22 |
| **목표 종료일** | 2026-05-30 |
| **소유자** | dennis |
| **Base Branch** | `phase-10-verification-automation` |

## 🎯 배경 및 목표

### 현재 상황

phase-09 까지 gen-design CLI (5 명령) + Studio `#/chats` 뷰어 + `docs/handbook.md` 가 완성됐다. CI 는 GitHub Actions 에서 `pnpm test` (995 PASS) + `gen-design lint` 를 실행 중이다. 단, **E2E / a11y / 시각 회귀** 검증은 0 — 스튜디오 웹앱이 실제 브라우저에서 동작하는지, 접근성 기준을 충족하는지, 화면이 의도치 않게 바뀌었는지 자동으로 검사하는 수단이 없다.

### 목표 (Goal)

1. Playwright 기반 **E2E 스모크 테스트** — 스튜디오 6개 라우트가 실제 브라우저에서 로딩됨을 CI 에서 자동 확인
2. **a11y 자동 검증** — axe-core 스캔으로 각 라우트의 접근성 위반 0건 기준 CI 게이트
3. **gen-design 품질 게이트 강화** — spec-09-04 에서 발견한 보정 후보(StatCard variant + workspace lint alias) 해소 + dogfooding 정량 측정 스크립트

### 성공 기준 (Success Criteria)

1. `pnpm test:e2e` → 스튜디오 6개 라우트 모두 PASS (CI 통합 포함)
2. `pnpm test:a11y` → 각 라우트 axe 위반 0건
3. `pnpm gen-design lint` — workspace root 에서 실행 가능 (studio 디렉토리 이동 불필요)
4. StatCard 가 catalog 에 variant axis 보유 (handbook §4 예시와 일치)

## 🧩 작업 단위 (SPECs)

> 본 표는 phase 의 *작업 지도* 입니다. SPEC 은 *요점 + 방향성 + 참조* 까지만 적습니다.
> 자세한 spec/plan/task 는 `specs/spec-10-{seq}-{slug}/` 에서 작성합니다.
> sdd 가 `<!-- sdd:specs:start --> ~ <!-- sdd:specs:end -->` 사이를 자동 갱신하므로 마커는 그대로 두세요.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-10-01` | playwright-e2e-setup | P? | Active | `specs/spec-10-01-playwright-e2e-setup/` |
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`

### spec-10-01 — Playwright E2E 셋업 + 스모크 테스트

- **요점**: `@playwright/test` 설치 + 스튜디오 6개 라우트 로딩 smoke test + CI 통합
- **방향성**: `studio/e2e/` 디렉토리 신규. `playwright.config.ts` 로 로컬 dev server 기동 후 `#/spec`, `#/new`, `#/design`, `#/tokens`, `#/export`, `#/chats` 라우트 순서대로 로딩 확인. GitHub Actions `ci.yml` 에 `pnpm playwright test` step 추가.
- **참조**:
  - `vision.md` — phase-10 = 검증 자동화
  - `.github/workflows/ci.yml` — 기존 CI 에 E2E step 추가
- **연관 모듈**: `studio/e2e/`, `studio/playwright.config.ts`, `.github/workflows/ci.yml`

### spec-10-02 — a11y 자동 검증 (axe-playwright)

- **요점**: `@axe-core/playwright` 로 각 라우트 접근성 스캔 → 위반 0건 CI 게이트
- **방향성**: spec-10-01 의 Playwright 셋업 위에 axe 스캔 레이어 추가. `checkA11y()` 호출 → 위반이 있으면 Playwright 테스트 실패. CI `test:a11y` step 으로 분리 (E2E 와 병렬 실행 가능).
- **참조**:
  - `vision.md` — a11y 자동 검증
- **연관 모듈**: `studio/e2e/a11y.spec.ts`, `studio/playwright.config.ts`

### spec-10-03 — gen-design 품질 게이트 강화

- **요점**: workspace root `pnpm gen-design lint` alias + StatCard variant 구현 + dogfooding 정량 측정 스크립트
- **방향성**:
  - (C-4) workspace `package.json` 에 `gen-design` / `gd` script alias 추가 → workspace root 에서 `pnpm gen-design lint` 직접 실행 가능
  - (C-3) `StatCard` 에 `variant: compact | highlighted | default` cva axis 추가 → `pnpm vocab` 으로 catalog 자동 갱신 → handbook §4 예시와 일치
  - (dogfooding) `studio/scripts/dogfooding-score.ts` — `.tsx` 파일 중 `@/components/ui` import 비율 계산 스크립트 + CI 리포트
- **참조**:
  - `docs/external-alpha-1.md` — C-3, C-4 보정 후보
  - `backlog/queue.md` icebox — dogfooding 정량 측정 방법론
- **연관 모듈**: `package.json`, `studio/src/components/composites/StatCard/index.tsx`, `studio/scripts/dogfooding-score.ts`

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Paper screenshot 비교 범위 | studio 웹앱 screenshot / Paper MCP 직접 비교 | studio 웹앱 screenshot 만 | Paper MCP 가 CI 환경에서 동작하지 않음 — 로컬 MCP 세션 의존. Phase-10 에서는 studio 웹앱 레이어만 자동화. Paper 시각 회귀는 Phase-11 후보 |
| visual regression 포함 여부 | Playwright screenshot diff / 제외 | 이번 phase 제외 (spec 별도 추가) | 기준선 이미지 관리 복잡성 대비 가치 판단 필요. E2E + a11y 로 1차 검증 후 다음 iteration 에서 추가 검토 |

## 🧪 통합 테스트 시나리오

### 시나리오 1: 스튜디오 전 라우트 로딩

- **Given**: `pnpm dev` 로 스튜디오 서버 기동
- **When**: Playwright 가 `#/spec`, `#/new`, `#/design`, `#/tokens`, `#/export`, `#/chats` 순서대로 접근
- **Then**: 각 라우트에서 HTTP 200 + 렌더링 완료 (JS 오류 없음)
- **연관 SPEC**: spec-10-01

### 시나리오 2: a11y 위반 0건

- **Given**: 각 라우트 로딩 완료
- **When**: `checkA11y()` 실행
- **Then**: WCAG 2.1 AA 기준 위반 0건
- **연관 SPEC**: spec-10-02

### 시나리오 3: gen-design lint workspace root 실행

- **Given**: workspace root 디렉토리
- **When**: `pnpm gen-design lint --chat-root playground/chats` 실행
- **Then**: studio 디렉토리 이동 없이 0 issues 또는 issue 목록 정상 출력
- **연관 SPEC**: spec-10-03

## 🔗 의존성

- **선행 phase**: phase-09 (gen-design lint + Studio `#/chats` 뷰어 완성)
- **외부 시스템**: Playwright (Chromium headless)
- **연관 ADR**: ADR-009 (gen-design CLI)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| CI Playwright headless 설치 시간 | CI 시간 증가 (+2~3분) | `--only-shell` / cache action 활용 |
| a11y 위반 기존 컴포넌트에서 다수 발견 | spec-10-02 범위 확대 | 위반 발견 시 severity 기준 분류 — `critical` / `serious` 만 게이트, 나머지는 TODO 이슈화 |
| StatCard cva 추가 시 기존 fixture 재생성 | 995 → N 변경 | `pnpm vocab` 후 `pnpm test` 확인, fixture drift 시 spec 내 갱신 |

## 🏁 Phase Done 조건

- [ ] spec-10-01 ~ spec-10-03 모두 Merged
- [ ] `pnpm test:e2e` CI PASS
- [ ] `pnpm test:a11y` CI PASS
- [ ] `pnpm gen-design lint` workspace root 실행 가능
- [ ] StatCard variant catalog 등재 확인
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 등을 여기 첨부 -->
