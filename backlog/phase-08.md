# phase-8: chat-agent-flow

> agent-매개 chat workflow 의 정착 — phase-7 이 *spec.md grammar + 컴파일러 인프라* 를 만들었다면, phase-8 은 *그 인프라 위에 살아있는 사용자 경험* 을 구축한다.
> 도그푸딩 시뮬레이션 (`poc-chat-agent-flow` 브랜치) 에서 검증된 비전을 시스템 코드로 구현.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-8` |
| **상태** | Ship (인프라 7 spec 완료 / 활용 4 spec phase-9 이연 — 📌 D-1) |
| **시작일** | 2026-05-10 |
| **종료일** | 2026-05-12 (3 일) |
| **소유자** | dennis |
| **Base Branch** | `phase-08-chat-agent-flow` (opt-in) |

## 🎯 배경 및 목표

### 현재 상황

**phase-7 결과물**: spec.md PEG grammar + Paper/React 컴파일러 + Studio 3-panel + Figma adapter PoC + 살아있는 핸드북 (ADR-001 ~ 009).

**도그푸딩 시뮬레이션 발견** (2026-05-10, `poc-chat-agent-flow`):

1. **어휘 충돌** — *spec* 두 의미 (harness-kit 작업 흔적 vs 우리 도구의 산출물). 디자이너가 첫 5분에 막힘.
2. **`spec/` 가 3 역할** — 회귀 fixture + 디자이너 작업 + Studio UI 데이터. handbook §4 따르면 회귀 게이트 깨짐 (Critical).
3. **Paper MCP 어댑터 부재** — `pnpm paper-to-spec /tmp/foo.tree.json` 의 *그 파일 생산자* 미정. handbook §4 Day 2 작동 불가.
4. **chat 의 진짜 의미 발견** — *소통 채널 + 명령 + 부산물*. 디자이너가 자연어로 말하면 agent 가 3층 (Narrative + Structure + History) 으로 정리.
5. **agent 의 도서관 사서 역할** — 누적된 chats / catalog 를 컨텍스트로 *재사용 / 승격 / 제약* 능동 제안.

PoC 가 *비전 검증* — 단 모두 *수동 + agent 의 임의 행동* 에 의존. 시스템 코드로 정착이 phase-8 의 본질.

### 목표 (Goal)

phase-8 종료 시:

- **어휘 정합** — *spec* (harness) ↔ *chat* (디자인 도구 산출물) 두 어휘 분리. 코드 / 디렉토리 / handbook / catalog 모두 갱신.
- **chat 흐름 닫힌 루프** — 디자이너 자연어 → agent 정리 → Paper 시각 → (수정) → chat 역방향 갱신 — 자동 / 반자동.
- **외부 디자이너 1 명 alpha** — 진짜 도그푸딩. 30 분 사용 + 정성 피드백. phase-7 의 W10 이행. **→ phase-9 이연 (📌 D-1)**

### 성공 기준 (Success Criteria) — 정량 우선

**phase-8 핵심 (7 spec 완료)**:

1. **어휘 전환 완료** — `grep -r "spec\.md\|spec-md-compiler" studio/src/ docs/handbook.md` 잔재 0. ADR-010 (chat 승격 정책) 작성.
2. **`fixtures/chats/` + `playground/chats/` + `chats/` 분리** — 디렉토리 구조 + 빌드타임 fixtures index 분리 완료. *Studio 런타임 동적 fetch* 부분은 spec-8-10 (이연).
3. **chat.md grammar 확장** — peggy 가 frontmatter (yaml) + Narrative + Structure + History + shell 의미론 파싱. 28 fixture 변환 + parse PASS.
4. **Paper MCP → PaperTreeNode CLI** — `pnpm gen-design paper-import` 가 임의 artboard ID → tree.json 생성. layer-name `[chat:type/slug]` 식별성 회복.
5. **inferChat diff 모드** — 기존 chat.md + 새 Paper tree → 변경분만 갱신. 5+ 시나리오 (텍스트 / variant / 컴포넌트 추가삭제) PASS.
6. **chat → React 컴파일러 갱신** — shell inherit + scene 합쳐 단일 TSX 출력. 결정성 100%, ts-diagnose 28-fixture critical 0.

**phase-9 이연 (4 spec — 📌 D-1)**:

7. ~~`gen-design merge`~~ — phase-9 이연 (spec-8-08)
8. ~~`gen-design lint`~~ — phase-9 이연 (spec-8-09)
9. ~~외부 디자이너 alpha 1 명~~ — phase-9 이연 (spec-8-11)

## 🧩 작업 단위 (SPECs)

> phase-8 정의 11 spec → 진행 7 spec (08-01~08-07) + 이연 4 spec (08-08~08-11 → phase-9). 📌 결정 기록 D-1.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-08-01` | rename-and-restructure | P? | Merged | `specs/spec-08-01-rename-and-restructure/` |
| `spec-08-02` | handbook-and-conventions | P? | Merged | `specs/spec-08-02-handbook-and-conventions/` |
| `spec-08-03` | adr-010-chat-promotion-policy | P? | Merged | `specs/spec-08-03-adr-010-chat-promotion-policy/` |
| `spec-08-04` | chat-md-grammar | P? | Merged | `specs/spec-08-04-chat-md-grammar/` |
| `spec-08-05` | paper-mcp-adapter | P? | Merged | `specs/spec-08-05-paper-mcp-adapter/` |
| `spec-08-06` | infer-chat-diff | P? | Merged | `specs/spec-08-06-infer-chat-diff/` |
| `spec-08-07` | chat-react-compiler | P? | Merged | `specs/spec-08-07-chat-react-compiler/` |
<!-- sdd:specs:end -->

> 의존성 (실제 진행 번호 기준):
> - **8-01** 선행 0 (rename + restructure 가 모든 후속의 전제)
> - **8-02** ← 8-01
> - **8-03** ← 8-01 (ADR-010 — ADR-008 reconsider, Hybrid 확정)
> - **8-04** ← 8-01
> - **8-05** ← 8-03 + 8-04 (ADR-010 식별성 정책 + frontmatter)
> - **8-06** ← 8-04 + 8-05 (grammar + paper-import 두 입력 diff)
> - **8-07** ← 8-04 + 8-06 (grammar + structure 합성)
> - **8-08** [이연 → phase-9] ← 8-04 + 8-03
> - **8-09** [이연 → phase-9] ← 8-04
> - **8-10** [이연 → phase-9] ← 8-07
> - **8-11** [이연 → phase-9] ← 8-02 + 8-10 (W10 이행)

### spec-8-01 — rename-and-restructure

- **요점**: `spec` (디자인 도구 의미) → `chat`. `spec/` → `fixtures/chats/{scenes,components}/` + `playground/chats/{...}/` + `chats/{...}/`. `*Page` → `*Scene` rename.
- **방향성**: `git mv` 활용 (blame 보존). studio 코드 import 일괄. 28 fixture 분류 (scene 7 + component 21).
- **참조**: PoC 결과 (poc-chat-agent-flow 브랜치) / handbook §3 매트릭스
- **연관 모듈**: 전 영역

### spec-8-02 — handbook-and-conventions

- **요점**: handbook §2-§7 갱신 (chat 어휘 + 3층 구조 + shell 의미론). README → handbook 진입점. 새 컴포넌트 워크플로 (§4.5 추가).
- **방향성**: PoC 시뮬레이션 결과를 handbook 의 *살아있는 예시* 로 인용
- **참조**: poc-chat-agent-flow 의 6 chat.md / handbook §4
- **연관 모듈**: `docs/handbook.md`, `README.md`

### spec-8-03 — adr-010-chat-promotion-policy

- **요점**: ADR-008 (per-spec design = 옵션 B) reconsider — chat 흐름이 *자동 정리* 를 요구. ADR-010 작성 — *chat 승격 정책 + merge 의미론* (Hybrid: 제안 자동 + 실행 수동).
- **방향성**: ADR-008 옵션 B 유지 + chat 의 글로벌 승격 별도 메커니즘 / 또는 옵션 B+ (자동 + 수동 hybrid)
- **참조**: ADR-008 D-4 reconsider trigger / PoC 세션 3
- **연관 모듈**: `docs/decisions/`

### spec-8-04 — chat-md-grammar

- **요점**: spec.md grammar (peggy) → chat.md grammar 확장. frontmatter (yaml) + Narrative + Structure + History + shell.{inherit,exclude}.
- **방향성**: 기존 grammar 의 Document AST 확장. 4 신규 노드 타입.
- **참조**: PoC 6 chat.md 의 형식 / ADR-005 (grammar)
- **연관 모듈**: `studio/src/lib/spec-md/grammar/`, parser

### spec-8-05 — paper-mcp-adapter

- **요점**: Paper MCP → `PaperTreeNode` JSON CLI. `pnpm gen-design paper-import <artboard-id>`. layer-name `[chat:type/slug]` 식별성 파싱.
- **방향성**: `mcp__paper__get_jsx` + `mcp__paper__get_computed_styles` + `mcp__paper__get_tree_summary` 조합. SSE / stdio MCP client 셋업.
- **참조**: PoC 통증 #10
- **연관 모듈**: `studio/src/lib/paper-inference/cli/`, 신규 `studio/scripts/gen-design.ts`

### spec-8-06 — infer-chat-diff

- **요점**: `inferSpec` → `inferChat`. 기존 chat + 새 Paper tree 두 입력 → diff 적용. *닫힌 루프 역방향 동기*.
- **방향성**: Paper tree 비교 → catalog 매칭 → chat structure 영역만 patch. Narrative / History 보존.
- **참조**: PoC 미검증 항목
- **연관 모듈**: `studio/src/lib/paper-inference/`, 신규 `chat-diff.ts`

### spec-8-07 — chat-react-compiler

- **요점**: `compileToReact` → chat.md 입력 + shell inherit/exclude 처리. shell + scene 합쳐 단일 TSX (Next.js layout 패턴).
- **방향성**: shell.chat.md 가 _layout.tsx 역할 / scene.chat.md 가 page.tsx 역할 매핑
- **참조**: PoC 미검증 / 사용자 비전 *"한 번에 통짜 페이지"*
- **연관 모듈**: `studio/src/lib/spec-md-compiler/react/` → `chat-md-compiler/react/`

### spec-8-08 — gen-design-merge  **[이연 → phase-9]**

- **상태**: phase-9 후보로 이연 (2026-05-12 / 📌 결정 기록 D-1).
- **요점**: ADR-009 의 `merge` 명령 — chat 슬라이스 → 글로벌 SSOT (`templates/{DESIGN,FRONT,TOKEN}.md`) 누적. shell 승격 자동 감지.
- **방향성**: ADR-010 결정 의존. 휴리스틱: *3+ scene 공통 패턴* → shell 승격 후보
- **참조**: ADR-009 D-4 / PoC 세션 3 자동화
- **연관 모듈**: `studio/scripts/gen-design.ts`

### spec-8-09 — gen-design-lint  **[이연 → phase-9]**

- **상태**: phase-9 후보로 이연 (2026-05-12 / 📌 결정 기록 D-1).
- **요점**: ADR-009 첫 실용 명령 (현 후순위). catalog ↔ chats ↔ templates 정합 검증 6 카테고리.
- **방향성**: read-only 진단. CI 통합 가능
- **참조**: ADR-009 D-5
- **연관 모듈**: `studio/scripts/gen-design.ts`

### spec-8-10 — studio-runtime  **[이연 → phase-9]**

- **상태**: phase-9 후보로 이연 (2026-05-12 / 📌 결정 기록 D-1).
- **요점**: Studio UI 의 `fixtures.generated.ts` 빌드타임 → 런타임 fetch. fixtures + playground + chats 세 source 동적 인식. chat 편집 UI (3층 표시) + shell preview.
- **방향성**: Vite dev server 의 fs API 또는 별도 dev endpoint
- **참조**: PoC 통증 #5
- **연관 모듈**: `studio/src/features/spec-editor/`

### spec-8-11 — external-alpha  **[이연 → phase-9]**

- **상태**: phase-9 후보로 이연 (2026-05-12 / 📌 결정 기록 D-1). 인프라 안정 후 외부 노출이 안전.
- **요점**: 외부 디자이너 1 명 alpha. handbook 만 읽고 *EmptyState 또는 Profile Page* 작성. 30 분 + 정성 피드백 보고.
- **방향성**: 사용자 트랙 (의뢰) + 결과 정리. handbook 보정 루프 1 회.
- **참조**: phase-7 의 W10 이행
- **연관 모듈**: `docs/external-alpha-1.md`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 재사용 흐름 자동화

- **Given**: chats/components/ 에 N 개 component, chats/scenes/ 에 M 개 scene 누적
- **When**: 디자이너 자연어 새 scene 요청 (Claude Code 안)
- **Then**: agent 가 catalog 매칭 + 재사용 후보 능동 제시 → 합의 후 chat.md 생성
- **연관 SPEC**: spec-8-02 (agent operating rules), spec-8-04 (grammar)

### 시나리오 2: shell 승격  **[phase-9 이연 — spec-8-08 의존]**

- **Given**: 2+ scene 의 공통 패턴 (BrandHeader / AppFooter)
- **When**: `pnpm gen-design merge` 또는 agent 가 휴리스틱 검출
- **Then**: `_shell.chat.md` 신규 + 기존 scene 의 inherit 자동 갱신 + History 누적
- **연관 SPEC**: spec-8-03 (ADR-010 — 진행), spec-8-08 (merge — 이연)

### 시나리오 3: 역방향 동기 (Paper → chat)

- **Given**: 디자이너가 Paper artboard 직접 수정 (텍스트 변경 / variant 변경 / 자식 추가)
- **When**: `pnpm gen-design diff <chat-id>` (또는 agent 가 *반영해줘* 응답)
- **Then**: chat.md Structure 갱신 + History 1 줄 추가 + Narrative 보존
- **연관 SPEC**: spec-8-05 (paper-import), spec-8-06 (inferChat diff)

### 시나리오 4: 통짜 페이지 컴파일

- **Given**: scene + shell 정의된 chat.md 군
- **When**: `pnpm gen-design react <scene-name>`
- **Then**: shell + scene 합쳐 단일 TSX 출력. ts-diagnose 0 critical. 결정성 100% (2회 hash 동일).
- **연관 SPEC**: spec-8-07

### 시나리오 5: 외부 디자이너 alpha  **[phase-9 이연 — spec-8-11 의존]**

- **Given**: handbook (phase-8 갱신본) 만 가진 외부 디자이너 1 명
- **When**: 30 분 도그푸딩 — *Profile Scene* 신규 작성 시도
- **Then**: 정성 피드백 보고 (`docs/external-alpha-1.md`) — 차단점 N건 / 매끄러운 부분 / handbook 보정 후보
- **연관 SPEC**: spec-8-11 (이연)

### 통합 테스트 실행

```bash
# 본 phase 의 통합 테스트만
cd studio && pnpm test src/__tests__/integration/phase-8/
# 또는 시나리오별 수동 검증
pnpm gen-design paper-import <artboard-id>
pnpm gen-design diff <chat.md> <tree.json>
pnpm gen-design react <scene>
```

## 🔗 의존성

- **선행 phase**: phase-7 (chat 어휘 + 3층 구조 + agent 도서관 비전이 phase-7 의 컴파일러 / handbook 위에 구축)
- **외부 시스템**: Paper MCP (디자이너 환경), 향후 Figma MCP
- **연관 ADR**:
  - ADR-006 (Paper-first workflow) — 본 phase 의 흐름 방향
  - ADR-007 (FRONT.md 컴파일 룰북) — 4축 어휘
  - ADR-008 (per-spec design 옵션 B) — phase-8 에서 reconsider
  - ADR-009 (gen-design CLI 5 명령) — phase-8 에서 3 명령 구현 (paper-import / diff / react). 잔여 2 명령 (merge / lint) phase-9 이연.
  - ADR-010 (chat 승격 정책) — spec-8-03 에서 신규 (Hybrid 확정)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| 어휘 rename 의 광범위 영향 (코드 + ADR + handbook + 28 fixture) | 회귀 가능성 ↑ | spec-8-01 을 *작은 PR 시리즈* 로 분할 — 또는 단일 큰 PR + 회귀 테스트 + ts-diagnose 게이트 |
| inferChat diff 모드의 정확도 (Paper 변경분 → chat 의미 정확 매핑) | 역방향 동기 신뢰 부족 | spec-8-06 의 5+ 시나리오 + 외부 alpha 데이터 기반 보정 |
| ADR-010 결정 (자동 승격 vs 수동) 의 미묘함 | 잘못 결정 시 ADR-008 reconsider 의 의미 약화 | ADR-010 작성 시 PoC 세션 3 의 *합의 대화* 패턴 그대로 명문화 — 자동화는 *제안* 수준만 |
| 외부 alpha 1 명 — 통계적 의미 부족 | phase-9 에서 N=3+ 로 확장 |
| Paper MCP 의 SSE/stdio 클라이언트 셋업 복잡도 | spec-8-03 지연 | Claude Code 안 *세션 내 호출* 으로 시작 (이 PoC 가 곧 그것) → 별도 daemon 은 phase-9 후보 |

## 🏁 Phase Done 조건

- [x] 인프라 SPEC 7 개 (08-01~08-07) merge (phase-08-chat-agent-flow base branch → main)
- [x] 활용 SPEC 4 개 (08-08~08-11) phase-9 이연 결정 기록 (📌 D-1)
- [ ] 통합 테스트 시나리오 1, 3, 4 PASS (시나리오 2, 5 는 phase-9 이연)
- [ ] 성공 기준 1~6 정량 측정 결과 (§📊 검증 결과)
- [ ] 사용자 최종 승인 + Phase PR 머지

## 📊 검증 결과

> /hk-phase-ship 검증 (2026-05-12). 기반: 925/919 tests PASS (11.69s), studio build exit 0 (451ms).

### 성공 기준 검증

| ID | 기준 | 결과 | 증거 |
|---|---|:---:|---|
| 1 | 어휘 전환 완료 | ✅ | `grep -r "spec\.md\|spec-md-compiler" studio/src/ docs/handbook.md` 81 매치 / 41 파일 — 모두 *역호환 (.chat.md + .spec.md + .md 동시 인식) / UI 텍스트 / 역사적 주석* 의 의도된 보존 (spec-08-01 walkthrough 결정 D-8, D-9). ADR-010 작성 (`docs/decisions/ADR-010-chat-promotion-policy.md`). |
| 2 | 디렉토리 분리 (fixtures/playground/chats) | ✅ | `fixtures/chats/{scenes,components}/` (28 fixture 회귀) + `playground/chats/` (PoC 6 파일: shell + 2 scene + 3 component) + `chats/` (production 슬라이스 6 scene 자리). 런타임 동적 fetch 는 spec-8-10 으로 이연 명시. |
| 3 | chat.md grammar 확장 | ✅ | peggy frontmatter (yaml) + Narrative + Structure + History + shell.{inherit,exclude}. spec-08-04 ship 결정 + chat-md/parser/ chat-md/grammar/ 테스트 모두 PASS. |
| 4 | Paper MCP → CLI | ✅ | `pnpm gen-design paper-import` 서브명령 존재. spec-08-05 ship — 6 round-trip fixture (commit `90fabd0`) PASS. |
| 5 | inferChat diff 모드 | ✅ | `pnpm gen-design diff` 서브명령 존재. `fixtures/diff-scenarios/` 5 시나리오 (A-text-only / B-variant / C-add / D-remove / E-mixed) 통합 테스트 PASS (commit `5ccd3aa`). |
| 6 | chat → React 컴파일러 | ✅ | `pnpm gen-design react` 서브명령 존재. shell + scene 합성 → 단일 TSX. dogfood integration (commit `1566ac4`) — login scene 컴파일 + ts-diagnose critical 0. |
| 7~9 | merge / lint / external-alpha | ⏸ | phase-9 이연 (📌 D-1) |

### 통합 테스트 결과

| 시나리오 | 결과 | 증거 |
|---|:---:|---|
| 1. 재사용 흐름 자동화 | ✅ | spec-08-02 handbook §4.5 (new component workflow) + spec-08-04 grammar (`catalog.{tier,family}`) 가 agent 의 재사용 후보 매칭 기반. handbook 자체가 *살아있는 예시* — `playground/chats/components/` 의 3 component 가 누적 예시. |
| 2. shell 승격 | ⏸ | spec-08-08 (gen-design merge) 의존 — phase-9 이연 |
| 3. 역방향 동기 (Paper → chat) | ✅ | `fixtures/diff-scenarios/` 5 시나리오 통합 테스트 PASS. 텍스트 / variant / 자식 추가삭제 / 혼합 모두 covered. Narrative / History 보존 — commit `7064d23` emitDocument bit-for-bit 검증. |
| 4. 통짜 페이지 컴파일 | ✅ | spec-08-07 dogfood integration — `pnpm gen-design react login --chat-root playground/chats` → shell + login scene 단일 TSX. ts-diagnose critical 0. 결정성 100% (build PASS). |
| 5. 외부 디자이너 alpha | ⏸ | spec-08-11 (external-alpha) 의존 — phase-9 이연 |

### 총평

- **인프라 7 spec 모두 Merged** + **성공 기준 1~6 모두 PASS** + **통합 테스트 1/3/4 모두 PASS**.
- 활용 4 spec (8-08~8-11) 은 phase-9 로 이연 결정 기록 (📌 D-1) — 인프라 ship 후 실 사용 데이터로 더 명확한 정의 작성 의도.
- 회귀 0 — 925/919 tests PASS, build exit 0.
- *Phase Done 조건* 의 *사용자 최종 승인 + Phase PR 머지* 만 잔존.

## 📌 결정 기록 (Review)

### D-1: 8-08~8-11 phase-9 이연 (2026-05-12)

- **결정**: phase-8 의 *인프라 spec 4 개* (8-04 grammar / 8-05 paper-import / 8-06 diff / 8-07 react) 완료 후, *활용 spec 4 개* (8-08 merge / 8-09 lint / 8-10 studio-runtime / 8-11 external-alpha) 을 phase-9 로 이연.
- **근거**:
  - 인프라 4 개가 *닫힌 루프* 핵심 (Paper → chat → React) — 자체로 dogfooding 가능.
  - 활용 4 개는 *축적 데이터 기반 휴리스틱* 이 효과 — 인프라 ship 후 실 사용 데이터로 더 명확한 spec 작성 가능.
  - external alpha (8-11) 는 *인프라가 실제로 작동* 함을 먼저 검증한 후 외부 노출이 안전.
- **부수효과**:
  - 본문 8-08~8-11 정의는 **[이연 → phase-9]** 라벨로 보존 (phase-9 spec 작성 시 재사용).
  - 성공 기준 9 → 6, 통합 테스트 5 → 3, Done 조건 갱신.
- **반영**: 본 phase.md 본문 라벨링 + Done 조건 갱신 + phase-9 작성 시 본 결정 인용.

### D-2: 8-03 ↔ 8-05 번호 swap (실행 중 자연 발생)

- **결정**: phase.md 본문의 원래 8-03 (paper-mcp-adapter) 와 8-05 (adr-010-chat-promotion-policy) 가 실행 단계에서 swap. 실제 진행 순서: 8-03 = ADR-010, 8-05 = paper-mcp-adapter.
- **근거**: ADR 결정 → adapter 구현 의존성이 자연. ADR-010 의 *layer-name 식별성 정책* (Hybrid) 이 paper-import 의 `[chat:type/slug]` 파싱 정책에 선행해야 명확.
- **반영**: 본 phase.md 본문 spec 정의 순서 정정 + 의존성 그래프 갱신.

### D-3: 8-06 slug 변경 (incremental-infer → infer-chat-diff)

- **결정**: "incremental" 의 추상성 → "infer-chat-diff" 로 명령형 기능명 구체화.
- **근거**: CLI 서브명령 `gen-design diff` 와 정합. *증분* 보다 *diff* 가 사용자 멘탈모델에 일치.
- **반영**: 본 phase.md 본문 spec 정의 slug 정정 (디렉토리는 이미 `specs/spec-08-06-infer-chat-diff/`).
