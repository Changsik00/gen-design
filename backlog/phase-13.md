# phase-13: chat.md 수직 단면 + LLM-native React 파이프라인

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-13-{seq}-{slug}/spec.md` 에서 다룹니다.
>
> 본 문서는 "이번 phase 에서 무엇을 어떻게 할 것인가" 를 한 번에 보기 위한 *업무 지도* 입니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-13` |
| **상태** | Planning |
| **시작일** | 2026-05-29 |
| **목표 종료일** | 미정 |
| **소유자** | dennis |
| **Base Branch** | `phase-13-vertical-slice` |

## 🎯 배경 및 목표

### 현재 상황

phase-12까지 `chat.md → gd react → TSX` 결정론적 컴파일 파이프라인을 중심으로 시스템이 구성됐다. 그러나 다음 문제가 드러났다:

1. **컴파일러 불필요**: LLM은 shadcn, Tailwind, cva variant를 이미 알고 있다. 사전 컴파일된 TSX는 LLM에게 추가 가치를 주지 않는다. 진짜 필요한 건 토큰 이름 합의 + variant 바인딩 규칙의 컨텍스트 주입이다.

2. **intake 경로 없음**: 기존 DESIGN.md, TOKEN.md, 기획 문서를 가진 사용자의 진입 경로가 없다. `gd-start`는 완전 빈 슬레이트만 가정한다.

3. **chat.md가 UI 레이어에만 국한**: 화면에 보이는 데이터의 출처(API), 비즈니스 로직, 테스트 시나리오가 분리돼 있거나 아예 없다. 프론트엔드 개발 이후 백엔드 설계가 별도로 이루어지는 비효율 발생.

4. **e2e가 라우트 로딩만 검증**: 실제 파이프라인 가치("시나리오별 화면이 의도대로 동작하나")를 검증하지 못한다.

### 목표 (Goal)

`chat.md`를 **수직 단면 스펙**으로 재정의한다. 화면 하나에 대해 알아야 할 모든 것 — UI, data shape, 비즈니스 로직 힌트, API contract, MSW 시나리오 — 을 하나의 파일에 담는다. 이 파일에서 React(LLM 생성), MSW 핸들러, API spec, DB 스키마 초안이 모두 파생된다.

동시에 `gd react` 컴파일러를 제거하고, LLM이 DESIGN.md + TOKEN.md + chat.md를 컨텍스트로 직접 TSX를 생성하는 흐름으로 전환한다.

### 성공 기준 (Success Criteria)

1. `chat.md v2` 포맷 ADR 확정 + 레이어(UI / data / API / scenarios) 예시 파일 1개 이상
2. `gd-start`가 기존 DESIGN.md, TOKEN.md, 기획 문서를 입력으로 받아 우리 포맷으로 정규화 안내 가능
3. `gd extract <chat.md>` → MSW 핸들러 스텁 + API spec 파일 자동 생성
4. MSW 시나리오 기반 e2e 테스트 3개 이상 PASS (CI 통합)
5. `gd react` 명령 제거 완료 (gd-cli에서 삭제 또는 deprecated 처리)
6. **preset FRONT.md/AGENT.md 가 phase-13 방향(chat.md v2 + LLM 생성)으로 정합** — 폐기된 `gd react` 컴파일 워크플로 잔재 0
7. **FRONT.md 가 반응형을 강제** — 모바일 우선 규칙 + 안티패턴 명시. 실증: todo 앱 5화면이 375px 모바일에서 레이아웃 정상 (E2E 통과)

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-13-01` | chatmd-v2-format | P0 | Backlog | `specs/spec-13-01-chatmd-v2-format/` |
| `spec-13-02` | intake-existing-assets | P1 | Backlog | `specs/spec-13-02-intake-existing-assets/` |
| `spec-13-03` | gd-chat-v2 | P1 | Backlog | `specs/spec-13-03-gd-chat-v2/` |
| `spec-13-04` | gd-extract | P2 | Backlog | `specs/spec-13-04-gd-extract/` |
| `spec-13-05` | e2e-scenario-based | P2 | Backlog | `specs/spec-13-05-e2e-scenario-based/` |
| `spec-13-06` | gd-react-removal | P3 | Backlog | `specs/spec-13-06-gd-react-removal/` |
| `spec-13-07` | frontmd-realign-responsive | P0 | Backlog | `specs/spec-13-07-frontmd-realign-responsive/` |
<!-- sdd:specs:end -->

### spec-13-01 — chat.md v2 포맷 설계 (Research + ADR)

- **요점**: chat.md를 수직 단면 스펙으로 재정의하는 포맷 설계 + 컴파일러 폐기 근거 ADR 작성
- **방향성**: Research spec. 기존 chat.md와 새 레이어(data / API contract / scenarios) 비교 분석. 포맷 초안 작성 후 사용자 승인. ADR-011로 결정 기록.
  - `data:` 섹션 — 화면에 보여야 하는 데이터 shape (타입 + 출처)
  - `api:` 섹션 — 필요한 엔드포인트 목록 (method + path + response shape)
  - `scenarios:` 섹션 — MSW 시나리오 (loaded / loading / error + 각각의 mock data)
  - `db_hints:` 섹션 — DB 스키마 초안 (선택적)
- **참조**:
  - 현재 `packages/gd-cli/src/commands/react.ts` — 폐기 대상 파악
  - `packages/gd-skills/skills/gd-chat.md` — 기존 포맷 기준선
- **연관 모듈**: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`

### spec-13-02 — intake 경로 확장 (gd-start)

- **요점**: 어떤 기존 자산이든 흡수하여 우리 포맷(DESIGN.md + TOKEN.md + chat.md)으로 수렴하는 intake 경로 추가
- **방향성**: `gd-start.md` 스킬에 분기 로직 추가.
  - 진입 타입 감지: 빈 슬레이트 / DESIGN.md 보유 / TOKEN.md 보유 / 기획 문서 보유 / 복합
  - 기존 파일 읽기 → 누락 섹션 파악 → 질문으로 채우기
  - 토큰 이름 합의: 사용자 토큰 → shadcn 24개 표준 매핑
- **참조**: `packages/gd-skills/skills/gd-start.md`, `spec-13-01` ADR
- **연관 모듈**: `packages/gd-skills/skills/gd-start.md`

### spec-13-03 — gd-chat v2 (수직 단면 작성 가이드)

- **요점**: chat.md를 수직 단면 포맷(spec-13-01 확정)으로 작성하도록 gd-chat 스킬 재작성
- **방향성**: 기존 3층(Narrative / Structure / History)에 data / api / scenarios 레이어 추가.
  - data 레이어: 화면에 보여야 할 값과 타입 파악 → 비즈니스 로직 힌트 기록
  - api 레이어: 필요한 엔드포인트 목록 + response shape
  - scenarios 레이어: loaded / loading / error 최소 3개 시나리오 + mock data
  - MSW 핸들러 생성 가능한 포맷 유지
- **참조**: `spec-13-01` 확정 포맷, `packages/gd-skills/skills/gd-chat.md`
- **연관 모듈**: `packages/gd-skills/skills/gd-chat.md`

### spec-13-04 — gd extract (chat.md → MSW + API spec)

- **요점**: chat.md의 `scenarios:` + `api:` 레이어를 파싱하여 MSW 핸들러 스텁 + API spec 파일을 자동 생성하는 CLI 명령
- **방향성**: `packages/gd-cli/src/commands/extract.ts` 신규.
  - `gd extract <chat-file>` → `chats/scenes/<slug>.msw.ts` (MSW 핸들러)
  - `gd extract <chat-file>` → `chats/scenes/<slug>.api-spec.md` (API contract 문서)
  - 시나리오별 mock data가 TypeScript 타입으로 추론 가능하게
  - 여러 파일 일괄 처리: `gd extract --all`
- **참조**: `spec-13-01` 포맷, `spec-13-03` 예시 chat.md
- **연관 모듈**: `packages/gd-cli/src/commands/extract.ts`

### spec-13-05 — 시나리오 기반 e2e 재설계

- **요점**: "라우트가 뜨냐"가 아닌 "시나리오별 화면이 의도대로 동작하나"를 검증하는 e2e 재작성
- **방향성**: `studio/e2e/` 신규 Playwright 테스트.
  - spec-13-04의 MSW 핸들러를 e2e에서 활용
  - 시나리오별 테스트 구조: loaded → 데이터 정상 표시 / error → 에러 상태 표시 / loading → 로딩 UI 표시
  - 최소 3개 화면 × 3개 시나리오 = 9개 테스트 PASS 목표
  - CI (GitHub Actions) 통합
- **참조**: `spec-13-04` MSW 핸들러, `studio/playwright.config.ts`
- **연관 모듈**: `studio/e2e/`, `.github/workflows/ci.yml`

### spec-13-06 — gd react 정리 (컴파일러 제거)

- **요점**: chat.md → TSX 직접 컴파일 파이프라인 제거
- **방향성**: `packages/gd-cli/src/commands/react.ts` 삭제 또는 deprecated 처리.
  - 관련 타입, 파서, 테스트 정리
  - `pnpm gd react` 명령 제거 후 안내 메시지 ("LLM에게 직접 요청하세요") 로 대체
  - gd-skills 스킬 파일에서 `pnpm gd react` 참조 제거
  - `packages/gd-cli/src/__tests__/` 관련 테스트 정리
- **참조**: `spec-13-01` ADR, `packages/gd-cli/src/commands/react.ts`
- **연관 모듈**: `packages/gd-cli/src/commands/react.ts`, `packages/gd-skills/skills/`

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| gd react 완전 삭제 vs deprecated | 삭제 / deprecated 유지 | 미정 (spec-13-01 ADR에서 확정) | 외부 사용자가 있을 경우 breaking change 영향 검토 필요 |
| chat.md v2 포맷 — YAML vs Markdown 섹션 | YAML front-matter / Markdown 헤딩 섹션 | 미정 (spec-13-01에서 결정) | 가독성 vs 파싱 용이성 트레이드오프 |
| phase-10 폐기 | 폐기 / 재정의 | **폐기** (2026-05-29) | 기존 접근(라우트 스모크 + a11y)이 새 방향에 흡수됨. spec-10-03의 gen-design lint alias는 icebox 보관 |

## 🧪 통합 테스트 시나리오

### 시나리오 1: 기존 DESIGN.md 보유 사용자 intake

- **Given**: 사용자가 자체 형식의 DESIGN.md 파일 보유
- **When**: `/gd-start` 호출 → 파일 분석 → 누락 섹션 질문
- **Then**: 우리 포맷의 DESIGN.md + TOKEN.md로 수렴 완료
- **연관 SPEC**: spec-13-02

### 시나리오 2: chat.md → MSW 핸들러 자동 추출

- **Given**: `scenarios:` 레이어가 작성된 chat.md 파일 1개
- **When**: `gd extract chats/scenes/login.chat.md` 실행
- **Then**: `login.msw.ts` + `login.api-spec.md` 생성, MSW 핸들러가 시나리오별 mock data 반환
- **연관 SPEC**: spec-13-04

### 시나리오 3: loaded 시나리오 — 데이터 정상 표시

- **Given**: MSW가 `{ total_sales: 12450, active_users: 234 }` 반환하도록 설정
- **When**: 대시보드 화면 접속
- **Then**: StatCard가 "12,450"과 "234" 표시
- **연관 SPEC**: spec-13-05

### 시나리오 4: error 시나리오 — 에러 상태 표시

- **Given**: MSW가 500 에러 반환하도록 설정
- **When**: 대시보드 화면 접속
- **Then**: 에러 메시지 UI 표시 (빈 화면 아님)
- **연관 SPEC**: spec-13-05

### 통합 테스트 실행

```bash
pnpm --filter studio test:e2e
```

## 🔗 의존성

- **선행 phase**: phase-12 (conversation-depth-and-orchestration — gd-chat 기존 스킬 기준선)
- **폐기 phase**: phase-10 (검증 자동화 — 접근 방식 superseded, 2026-05-29 폐기)
- **외부 시스템**: Playwright (Chromium headless), MSW v2
- **연관 ADR**:
  - `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md` (spec-13-01에서 작성)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| chat.md v2 포맷 설계가 사용성 검증 없이 확정 | 스킬 재작성 후 실사용에서 어색함 발견 | spec-13-01을 Research spec으로 진행, 예시 파일 작성 + 사용자 승인 후 확정 |
| gd react 제거 시 외부 사용자 breaking change | npm 패키지 사용자 영향 | spec-13-06에서 버전 범프 + CHANGELOG 명시, deprecated 경고 한 버전 유지 검토 |
| MSW 핸들러 파싱 복잡도 | extract 구현 범위 확대 | spec-13-04는 스텁 생성(boilerplate)에만 집중 — 완전한 mock data 자동 생성은 scope-out |

## 🏁 Phase Done 조건

- [ ] spec-13-01 ~ spec-13-06 모두 Merged
- [ ] 통합 테스트 4개 시나리오 PASS
- [ ] `gd react` 명령 제거 또는 deprecated 처리 완료
- [ ] `gd extract` 명령 정상 동작 확인
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 등을 여기 첨부 -->
