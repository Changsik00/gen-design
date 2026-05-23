# phase-12: conversation-depth-and-orchestration

> phase-11 의 외부 alpha 깃발이 *진정* 되려면 부족한 6 영역이 있음 (사용자 v4 retro). 본 phase 는 *gd-chat 의 대화 깊이* + *gd tokens 명령* + *토큰 재사용/확장 결정 가이드* + *디자인 주문 명세* 까지 통합.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-12` |
| **상태** | Planning |
| **시작일** | 2026-05-23 |
| **목표 종료일** | 2026-06-15 |
| **소유자** | dennis |
| **Base Branch** | `phase-12-conversation-depth-and-orchestration` |

## 🎯 배경 및 목표

### 현재 상황

phase-11 의 4-페르소나 × 4-시나리오 × 1-다신-여정 통과로 *기본 깃발* 완성. 다만 사용자 v4 retro 에서 6 영역 부족 노출:

1. **form validation 가이드 없음** — react-hook-form / zod 가 들어가야 하는데 스킬이 안내 안 함
2. **token 조회 명령 부재** — 디자이너가 *현재 token 무엇* 모름
3. **gd-chat 성급 종료** — 충분한 대화 없이 곧장 컴파일
4. **비슷한 화면 발견 + 재사용 vs 확장 결정 부재** — Tier 분리 / 확장 의사결정 가이드 없음
5. **버튼 의도 (CTA / nav / submit) 안 물음** — 단순 어휘만 결정
6. **디자인 주문 명세 (반복 코드 방지) 부재** — React 측 정보 명세 누락
7. **일괄된 fetch + skeleton UI 패턴 부재** — 데이터 fetch 시 *프로젝트 표준 스켈레톤* 없어 신마다 달라짐

→ 이 7 영역 (+ 잔여 HIGH 1) 을 6 spec 으로 분할.

### 목표 (Goal)

phase-12 종료 시:
- gd-chat 이 *충분한 대화* (버튼 의도 / 토큰 후보 / 비슷한 화면 발견) 까지 안내
- `gd tokens` 명령으로 *현재 토큰 일람 + 검색* 가능
- decisions.md 에 *토큰 재사용 vs 확장* 결정 패턴 기록
- React TSX 가 *디자인 주문 명세* 를 받아 *반복 코드 0* 으로 컴파일
- `@gd/cli` 가 npm 분리되어 preset 의 `pnpm gd` 가 *실 동작*

### 성공 기준 (Success Criteria) — 정량 우선

1. **gd-chat 대화 단계 ≥ 5** (호출 / 의도 / 토큰 후보 / 비슷한 화면 / 컴파일 — 종료 전 명시적 확인)
2. **`gd tokens list/find/show` 명령** — 0 errors / 토큰 24+ 항목 출력
3. **decisions.md *재사용 vs 확장* entry 패턴** — 4 신 v4 환경에서 ≥ 1 entry 자동 생성
4. **반복 코드 정량** — 신 3/4 (StatCard 후보) 의 TSX bytes ≤ 1.3× (composite 적용 후 vs 적용 전)
5. **외부 npx 동작** — `pnpm gd react` 가 새 디렉토리에서 0 errors
6. **일괄 fetch + skeleton 패턴** — 모든 데이터 fetch 신에서 *동일 Skeleton wrapper* 자동 적용 / shadcn Skeleton 컴포넌트 + TanStack Query 표준

## 🧩 작업 단위 (SPECs)

> 본 표는 phase 의 *작업 지도*. SPEC 은 *요점 + 방향성 + 참조* 까지만.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-12-01` | gd-cli-npm-split | P? | Merged | `specs/spec-12-01-gd-cli-npm-split/` |
| spec-12-02 | gd-chat-depth-and-intent | 🟡 MID | Backlog | `specs/spec-12-02-gd-chat-depth-and-intent/` |
| spec-12-03 | gd-tokens-query | 🟡 MID | Backlog | `specs/spec-12-03-gd-tokens-query/` |
| spec-12-04 | similar-scenes-and-token-reuse | 🟡 MID | Backlog | `specs/spec-12-04-similar-scenes-and-token-reuse/` |
| spec-12-05 | design-order-spec | 🔴 LARGE | Backlog | `specs/spec-12-05-design-order-spec/` |
| spec-12-06 | unified-fetch-skeleton | 🟡 MID | Backlog | `specs/spec-12-06-unified-fetch-skeleton/` |
| spec-12-07 | tool-plugin-architecture | 🔴 LARGE | Backlog | `specs/spec-12-07-tool-plugin-architecture/` |
<!-- sdd:specs:end -->

### spec-12-01 — gd-cli-npm-split

- **요점**: `@gd/cli` npm 패키지 분리. 현재 `studio/scripts/gen-design.ts` 가 *studio 내부* 라 preset 의 `pnpm gd` 가 실패
- **방향성**: monorepo 의 `packages/gd-cli/` 새 패키지. `gen-design` 명령 bin 등재. preset 의 devDep 으로 `@gd/cli`
- **참조**: dogfooding v1 #4
- **연관 모듈**: `packages/gd-cli/` (NEW), `studio/scripts/gen-design.ts` (mirror)

### spec-12-02 — gd-chat-depth-and-intent

- **요점**: gd-chat 대화 깊이 강화. (1) form validation 안내 (react-hook-form/zod), (3) 성급 종료 방지, (5) 버튼 의도 (CTA/nav/submit) 명시
- **방향성**: 스킬 본문 §재정의 + 대화 단계 ≥ 5 강제. *checklist* 패턴: 의도 / 토큰 / 비슷한 화면 / validation / 버튼 의도 모두 확인 후 compile
- **참조**: v4 retro 1+3+5
- **연관 모듈**: `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md`

### spec-12-03 — gd-tokens-query

- **요점**: `gd tokens list/find/show` 새 명령. 현재 24 표준 토큰 + 프로젝트 확장 토큰 조회
- **방향성**: tokens.json 파싱 → CLI 출력 (cli 색상 / value 표시 / 다크모드 비교). doctor 와 같은 한국어 친절
- **참조**: v4 retro 2
- **연관 모듈**: `packages/gd-cli/` (또는 studio/scripts/gen-design/tokens.ts), `tokens.json`

### spec-12-04 — similar-scenes-and-token-reuse

- **요점**: gd-chat 이 chat 작성 시 *비슷한 화면 발견* + *토큰 재사용 vs 확장 결정* 가이드. decisions.md 패턴
- **방향성**: scene corpus 인덱스 → 유사도 계산. 결정 시 두 옵션 (재사용 / 확장) 의 *장단점* 명시. doctor 가 미결정 stuck 진단
- **참조**: v4 retro 4
- **연관 모듈**: `packages/gd-cli/` 또는 `studio/scripts/gen-design/` (token-similarity.ts NEW), `.claude/skills/gd-chat.md`

### spec-12-05 — design-order-spec

- **요점**: 디자인 주문 명세 (designer-order.md) 도입 — chat.md *외* 에 기능 명세 / 정보 명세 / 라우팅 명세 / 상태 명세 명시. React 가 이를 받아 반복 코드 방지
- **방향성**: order.chat.md (or .order.md) 신규 grammar. gd react 가 이를 입력으로 받아 *변형 가능* TSX 출력. 컴포넌트 재사용 강제 (StatCard 같은 composite 의 자동 추출)
- **참조**: v4 retro 6 — *가장 큰 작업*
- **연관 모듈**: `studio/src/lib/chat-md-compiler/` (grammar 확장), `packages/gd-cli/` (react 명령 확장)

### spec-12-06 — unified-fetch-skeleton

- **요점**: 일관된 fetch 패턴 + skeleton UI — 모든 데이터 fetch 신에서 *동일 wrapper* 와 *Skeleton 컴포넌트* 자동 생성
- **방향성**: TanStack Query 표준 (`useQuery` + isPending → `<Skeleton/>`). shadcn Skeleton 컴포넌트 카탈로그 등재. chat.md 가 `<DataCard query="..." />` 같은 의도 표현 → gd react 가 *loading / error / data* 3 상태 모두 자동 생성. 신마다 다른 코드 X
- **참조**: v4 retro 추가 (사용자 후속)
- **연관 모듈**: `packages/create-gd-react/presets-bundled/default/src/components/ui/skeleton.tsx`, `packages/gd-cli/` (data wrapper 코드 생성), `.claude/skills/gd-chat.md` (fetch 의도 안내)

### spec-12-07 — tool-plugin-architecture (phase 마지막, *대규모*)

- **요점**: chat-md-compiler 의 react/paper 결합을 *완전 분해* 하여 플러그인 아키텍처 도입. 디자인 도구 연동 (Paper / Figma / 손작성 / 기타) 을 사용자가 선택 → 해당 plugin 만 자동 install
- **방향성**:
  - `@gd/chat-md-core` (parser + AST + 기본 vocab)
  - `@gd/chat-md-react` (React 컴파일러, plugin interface)
  - `@gd/chat-md-paper` (Paper plugin — paper-import + paper-only registry)
  - `@gd/chat-md-figma` (Figma plugin — figma-adapter)
  - `@gd/cli` orchestrator — installed plugin 자동 감지 + 로딩
  - gd-start 스킬에 *도구 선택 단계* 추가 → 선택에 따라 `@gd/chat-md-*` plugin 자동 add
- **참조**: spec-12-01 진행 중 발견 (chat-md-compiler 의 react ↔ paper ↔ studio frontend 강결합). 현재 외부 디자이너는 모두 "기타 (손작성)" — paper 의존이 *완전 불필요* 한데도 끌어옴
- **연관 모듈**: `studio/src/lib/chat-md-compiler/` (분해), `packages/gd-*` (4-5 신규 패키지), `.claude/skills/gd-start.md` (도구 선택 onboarding)
- **선행 조건**: spec-12-01 ~ 12-06 모두 머지 후. 외부 alpha 채용 전 마지막 깃발
- **의도된 결과**: 손작성 사용자가 npm install 시 *paper 의존 0* — lean 외부 publish 가능

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| spec-12-05 *order.md* 위치 | (A) chat.md 안에 ## Order 섹션 / (B) 별도 `.order.md` 파일 | (TBD spec-12-05 plan 단계) | grammar 영향 검토 |
| spec-12-01 패키지명 | `@gd/cli` / `gen-design` / `create-gd-react` 와 같은 prefix | TBD | npm 등록 가능성 + 일관성 |

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 디자이너 v5 alpha (이지 + spec-12-02/03/04 적용)

- **Given**: 신규 디자이너 (v4 페르소나 이지 재사용) + 최신 phase-12 스킬
- **When**: 4 신 (login / signup / dashboard / mypage) 다시 작성 — *대화 단계 ≥ 5 강제* + *gd tokens* 활용 + *비슷한 화면 자동 발견*
- **Then**: 4 신 모두 0 errors / dialog turn ≥ 5 평균 / decisions.md 의 *재사용 vs 확장* entry ≥ 1
- **연관 SPEC**: spec-12-02, spec-12-03, spec-12-04

### 시나리오 2: order.md → React 변형 (spec-12-05)

- **Given**: chat.md (정적 본문) + order.md (라우팅 / 상태 / 데이터 명세) 한 쌍
- **When**: `gd react <slug>` — 두 입력을 받아 컴파일
- **Then**: TSX 가 *주문 명세 그대로* 실행 가능 (라우터 link, react-hook-form validation, 데이터 fetching hook) — 반복 코드 0
- **연관 SPEC**: spec-12-05

### 시나리오 3: 외부 npx (spec-12-01)

- **Given**: 빈 디렉토리에서 `npm create gd-react taskflow-pro` (또는 `pnpm create`)
- **When**: scaffold + `pnpm gd react login` (preset 의 chat.md)
- **Then**: 0 errors + TSX 생성 (`@gd/cli` 가 *실 동작*)
- **연관 SPEC**: spec-12-01

### 시나리오 4: 일관된 fetch + skeleton (spec-12-06)

- **Given**: chat.md 에 `<DataCard query="tasks.list" />` 같은 fetch 의도 표현이 2 신 이상 존재
- **When**: `gd react` 컴파일
- **Then**: 두 신 모두 *동일 Skeleton wrapper* 사용 / useQuery hook 자동 / isPending → `<Skeleton />` 자동 / 신마다 다른 fetch 코드 X
- **연관 SPEC**: spec-12-06

## 🔗 의존성

- **선행 phase**: phase-11 (designer-onboarding-skill — completed)
- **외부 시스템**: npm registry (spec-12-01 publish), react-hook-form / zod (spec-12-02 안내)
- **연관 ADR**: (TBD spec-12-05 — order grammar)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| spec-12-05 *order.md* grammar 확장이 *grammar 한계* 누적 | chat.md 와 충돌 | spec 의 plan 단계에서 grammar 분리 결정 (A/B 명시) |
| spec-12-01 npm publish 권한 / 패키지명 충돌 | block | dry-run + 사전 검증, fallback: `@dennis/gd-cli` 같은 scoped |
| 5 spec 의 시간 ↑ — phase 너무 큼 | 지연 | spec-12-05 만 LARGE, 분리 출시 가능 (1-4 머지 후 5 진행 OK) |

## 🏁 Phase Done 조건

- [ ] 7 spec 모두 merge (base branch 모드: `phase-12-...` → main)
- [ ] 통합 테스트 4 시나리오 PASS
- [ ] 성공 기준 6 항목 정량 측정 (본 문서 하단 "검증 결과" 섹션)
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 -->
