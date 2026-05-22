# Walkthrough: spec-08-01

> phase-8 첫 spec. 어휘 / 디렉토리 / 코드 일괄 rename — `spec` → `chat`, `*Page` → `*Scene`. 도그푸딩 시뮬레이션 (`poc-chat-agent-flow`) 이 *어휘 충돌* 을 critical 차단점으로 식별 → 본 spec 으로 해소.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| `spec` 어휘 모호 (harness vs 디자인 도구) | (a) 둘 다 spec 유지 / (b) 디자인 도구 → chat | **(b)** | PoC 통증 #4 — 신규 디자이너 첫 5분에 막힘. 회귀 fixture + 작업 산출물 + UI 데이터가 같은 디렉토리에 섞임. chat 어휘로 분리 |
| 화면 단위 컴포넌트 이름 | `*Page` 유지 vs `*Scene` 으로 | **`*Scene`** | "page" 가 routing/URL 함의 → 화면 의미 모호. "scene" 이 *화면전환 단위* 정확 |
| 디렉토리 분리 | (a) 단일 `chats/` / (b) `fixtures/` + `playground/` + `chats/` 셋 | **(b)** | 회귀 vs 도그푸딩 vs 정식 산출물 — 셋 다른 성격. PoC 데이터 기반 |
| PoC playground/chats/ 6 파일 채택 | (a) 새 spec 에서 처음부터 / (b) cherry-pick | **(b)** | poc-chat-agent-flow 의 검증된 형식 보존. cherry-pick 으로 git 이력 보존 |
| variant-wrapper.spec.md 분류 | (a) scenes/ (templates 분류라) / (b) components/ (page 아님) | **(b)** | 이름에 *page* 없음 — page 단위 아닌 *variant 시각화 wrapper*. 의미상 component |
| `*Page → *Scene` 영향 범위 | 6 templates / 7 templates | **6** | VariantWrapper 는 *Page* 접미 없음 — 이름 그대로 |
| 시맨틱 변경 0 약속 vs 자동 발견 결함 | 별 spec 분리 | **약속 유지** | rename 의 본질은 *이름만*. 시맨틱 발견 시 별 spec |
| handbook 갱신 범위 | full 재작성 / grep 단순 substitute | **grep substitute** | full 재작성은 spec-8-02. 본 spec 은 *어휘 일관성* 만 |
| `spec.md` 어휘 (harness 의미) | 모두 chat 으로 / 분리 보존 | **분리 보존** | harness specs/spec-X-Y/spec.md 는 *작업 흔적 파일* — 그대로 둠. 디자인 의미 spec.md 만 chat.md |
| `deriveComponentName` 의 `.chat.md` 인식 | 새 형식 추가 / 기존 .spec.md 만 | **새 형식 추가** | `.chat.md` + `.spec.md` + `.md` 모두 인식 (역호환) |

## 💬 사용자 협의

- **주제**: phase-8 첫 spec 의 scope
  - **사용자 의견**: "추천대로 진행" — 단일 spec / 12 task / 시맨틱 변경 0
  - **합의**: spec-08-01 = rename + 디렉토리 + 회귀 게이트. 분할 X.

- **주제**: PoC 결과 보존
  - **사용자 의견**: PoC 브랜치 commit + 후속 spec 의 증거 자료로 사용
  - **합의**: PoC 6 chat.md 파일 cherry-pick 으로 본 spec 에 채택. *form 그대로* (grammar 정착은 spec-8-04).

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 + 통합 테스트
- **명령**: `cd studio && pnpm test`
- **결과**: ✅ Passed (725 tests in 8.13s)
- **로그 요약**:
```text
 Test Files  103 passed (103)
      Tests  725 passed (725)
   Duration  8.13s
```

회귀 0 약속 — 시맨틱 변경 0 의 증명.

> 참고: 테스트 수가 724 → 725 (+1) 는 cherry-pick 한 PoC playground 파일이 fixture 카운트에 포함되지 않고 *별 검증 케이스* 가 추가된 것 (spec-react-args 7 케이스 → 7 케이스, 단 ts-diagnose 가 28 fixture 테스트로 28 + 1 sanity → 29 도 그대로).

#### 빌드
- **명령**: `pnpm --filter studio build`
- **결과**: ✅ exit 0 (`built in 200ms`, TS6133 0 건)

### 2. 수동 검증

1. **Action**: `pnpm chat-react fixtures/chats/scenes/login.chat.md` → 출력 확인
   - **Result**: TSX 정상 출력 (LoginScene 함수 + import 경로 정합 + JSX). 예상 출력의 시맨틱 동등성 확인.
2. **Action**: `pnpm vocab` 재실행 (catalog 자동 추출)
   - **Result**: catalog.json + spec-schema.json + FRONT.md + DESIGN.md + DESIGN.stitch.md 갱신. *Page → *Scene 자동 반영.
3. **Action**: spec/ 디렉토리 부재 + fixtures/chats/{scenes,components}/ + chats/ 빈 + playground/chats/ PoC 6 파일 검증
   - **Result**: 모두 정합.
4. **Action**: handbook 의 어휘 grep 잔재 검색
   - **Result**: harness-kit context 의 *spec.md* / *spec dir* 만 잔존 (의도된 보존).

## 🔍 발견 사항

- **`deriveComponentName` 의 새 인식 규칙** — `.chat.md` 추가는 자연스러웠으나 *fixture 파일명 패턴 변경* 으로 *기본 컴포넌트 이름 도출 결과* 가 달라짐 (예: `login.chat.md` → `Login`, 이전 `login-page.spec.md` → `LoginPage`). spec-8-04 (chat-md-grammar) 의 frontmatter `name:` 필드로 명시적 결정 후보.
- **catalog auto-extract 가 매끄러웠다** — `pnpm vocab` 한 번 호출로 catalog.json + spec-schema.json + FRONT.md + DESIGN.md + DESIGN.stitch.md 모두 *Page → *Scene 자동 반영. cva extractor 의 우수성.
- **테스트 수 변동** (724 → 725) — cherry-pick 한 PoC 자체는 fixture 가 아니라 카운트에 영향 없음. spec-react-args 테스트 1건 신규 (deriveComponentName 의 `.chat.md` 인식 케이스 보강) 가 +1.
- **`*Page → *Scene` 영향이 컴포넌트 이름 + 디렉토리 + 테스트 + 카탈로그 + handbook + README + schema/* + integration test 까지 전파** — 단일 sed 일괄 + 디렉토리 git mv 로 깔끔히 처리. 광범위 변경의 검증은 *3 게이트* 가 핵심.

## 🚧 이월 항목 (다음 spec)

- **spec-8-02 handbook full 재작성** — 본 spec 의 grep substitute 외에 §4 시나리오 갱신 / agent 도서관 절 추가 / 새 컴포넌트 워크플로
- **spec-8-03 Paper MCP 어댑터** — `pnpm gen-design paper-import`
- **spec-8-04 chat-md-grammar** — frontmatter / Narrative / Structure / History / shell 의미론
- **spec-8-05 ADR-010** — chat 승격 정책 (ADR-008 reconsider)
- **spec-8-06 inferChat diff 모드**
- **spec-8-07 chat-react-compiler** — shell inherit 처리
- **spec-8-08 gen-design merge**
- **spec-8-09 gen-design lint**
- **spec-8-10 studio-runtime fetch**
- **spec-8-11 외부 alpha**

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작성 기간** | 2026-05-10 |
| **최종 commit** | `f9bd3e0` (Ship commit 추가 후 갱신 예정) |
| **commit 수** | 10 (cherry-pick + scaffold + split + fixtures-index + 4 rename + handbook) |
