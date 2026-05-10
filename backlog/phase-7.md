# phase-7: DESIGN.md 4축 어휘 + 컴파일러

> *디자이너가 spec markdown 을 작성 → Paper 시각화 → React 결정적 컴파일* 의 핵심 어휘와 컴파일러 인프라를 구축한다.
> 본 프로젝트의 정체성을 결정하는 phase. 향후 모든 phase 의 토대.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-7` |
| **상태** | Planning |
| **시작일** | TBD (사용자 alignment 승인 후) |
| **목표 종료일** | 2026-08~10 (3~5 개월) |
| **소유자** | Dennis |
| **Base Branch** | `phase-7-design-md` (phase-6 부터 base branch 모드 회귀 정책 — 사용자 메모리 `feedback_phase_branch.md`) |

## 🎯 배경 및 목표

### 현재 상황

phase-6 에서 Studio v1 (composites/templates 카탈로그 + paper-normalizer + paper-sync + DESIGN.md/REQUIREMENTS.md/AGENT.md export) 을 완성. 그러나 phase-6 회고 (2026-05-09) 결과:
- **C1**: Paper ↔ React 시각 일치 검증 부재 (spec-6-10 으로 부분 해소)
- **C2**: paper-normalizer / paper-sync 가 production 코드에서 unused
- 사용자 핵심 우려: "Paper ↔ React 1:1 자동 반영 가능한가? 컴포넌트도 token 화 가능한가?"

벤치마킹 (2026-05-10, `docs/benchmark.md`) 결과:
- Google Labs 가 2026-03 `DESIGN.md` Apache 2.0 오픈 — 같은 사상 + 시장 권위
- DTCG 1.0 stable / shadcn registry / GitHub Spec Kit 등 표준 정착
- 본 프로젝트의 *진짜 차별화* = 4 축 어휘 정합 + 디자이너 직접 spec 작성 + i18n 1급 시민
- timing window: 6~18 개월 — *지금* 이 결정해야 할 시점

vision (2026-05-10, `docs/vision.md`) 에서 사용자가 user story 명료화:
- 디자이너-publisher 페르소나
- DESIGN.md / TOKEN.md / FRONT.md + assets 의 markdown SoT
- spec.md grammar 로 작성, Paper + React 양쪽 컴파일
- shadcn/ui + Tailwind + cn 그대로 + 테마만 변경

### 목표 (Goal)

본 프로젝트의 *4 축 어휘 정합* (spec.md ↔ Paper ↔ React ↔ LLM) 을 실현하는 **표준 채택 + 어휘 카탈로그 + 양방향 컴파일러** 를 구축한다. phase-6 자산은 *재해석* 으로 모두 살린다 (폐기 ❌).

### 성공 기준 (Success Criteria) — 정량 우선

#### 표준 호환 (즉시 채택)

1. **DESIGN.md = Stitch DESIGN.md 0.1 superset** — Stitch 9 섹션 모두 보존 + 본 프로젝트 확장. Stitch 호환 export 가능.
2. **TOKEN.md = DTCG 1.0 strict 호환** — `$value`/`$type`/`$description`. Style Dictionary v4+ / Tokens Studio / Stitch 모두와 호환.
3. **React 출력 = shadcn registry 형식** — `npx shadcn@latest add` 한 줄로 외부 codebase 에 install. registry.json 표준 + namespaced.

#### 어휘 정합

4. **3-tier 컴포넌트 어휘 카탈로그** — Tier 1 (ARIA roles) / Tier 2 (shadcn components) / Tier 3 (프로젝트 composites + templates). `FRONT.md` 가 카탈로그를 노출.
5. **Paper 노드명 컨벤션 = shadcn variant 문법 거울** — 4 축 어휘 정합의 시각적 증거. 정합률 90% 이상.

#### spec.md grammar + 컴파일러

6. **spec.md grammar 정의** — Markdoc 류 PEG + JSON Schema 검증. 컴포넌트 태그 + i18n placeholder + 토큰 참조 + Behavior + Variants.
7. **spec.md → Paper compiler** — paper-sync resolver / paper-normalizer 가 production 활용 (회고 C2 완전 해소). FrontendBench 류 회귀 셋 100 case 정합률 측정.
8. **spec.md → React compiler** — shadcn + Tailwind + cn + i18n + ## Behavior → state hook stub. spec.md 1 개당 React 컴파일 결정성 100%.

#### 외부 통합 + UI 재구성

9. **Figma → spec.md 어댑터 PoC** — 디자이너 진입 비용 ↓ (Figma 떠날 필요 없음). 파일 1 개 → spec.md 변환 PoC.
10. **Studio 재구성** — 4 feature → spec.md 편집기 + dual preview (Paper/React) + export. phase-6 자산 *모두* 재배치.

## 🧩 작업 단위 (SPECs)

> 본 phase 는 7 spec 으로 구성. 1~4 가 *핵심*, 5~7 이 *외부 통합 + UI 재구성*.
>
> **2026-05-10 방향 pivot** (ADR-006): 디자이너 워크플로의 canonical 흐름은
> Paper → spec.md → React. spec-7-06 (Paper → spec.md inference) 이 *긴급 다음 spec*
> 으로 승격. 기존 spec-7-04 (spec.md → React) 는 7-06 이후로 연기.
> spec-7-03 은 ship 완료 — 양방향 round-trip 의 *역방향 (spec.md → Paper)* 측면으로 reframe.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-7-01` | vocabulary-and-formats | P? | Merged | `specs/spec-7-01-vocabulary-and-formats/` |
| `spec-7-02` | spec-md-grammar | P? | Merged | `specs/spec-7-02-spec-md-grammar/` |
| `spec-7-03` | spec-to-paper | P? | Active | `specs/spec-7-03-spec-to-paper/` |
<!-- sdd:specs:end -->

### spec-7-01 — 어휘 + 표준 + 형식 (Vocabulary & Formats)

- **요점**: 4 축 어휘의 *정의 문서* + 표준 호환 매트릭스 작성. 향후 모든 spec 의 ground.
- **방향성**:
  - `DESIGN.md` Stitch 0.1 superset 정의 (9 섹션 + 본 프로젝트 확장)
  - `TOKEN.md` DTCG 1.0 strict 형식 (phase-6 의 tokens.json 정렬)
  - `FRONT.md` 정의 — 3-tier 어휘 카탈로그 + Paper 매핑 컨벤션 + shadcn registry 메타
  - 어휘 명세를 *machine-readable* schema (JSON Schema 또는 zod) 로 정의 — spec.md lint 의 토대
  - Studio export 가 위 3 문서 + assets 를 ZIP 으로 생성하도록 spec-6-08 (export) 갱신
- **연관 모듈**: `studio/src/lib/`, `studio/src/features/export/`, `templates/assets/tokens/`
- **종속**: vision.md / benchmark.md (이미 작성됨)
- **Integration Test Required**: yes (Stitch DESIGN.md export adapter 가 실제 작동)

### spec-7-02 — spec.md grammar + parser

- **요점**: 디자이너가 작성하는 spec.md 의 정식 문법 + AST parser.
- **방향성**:
  - Markdoc tag syntax 차용 — `<Component variant="x" attr={value}>` + `{% ... %}` 스타일 결정
  - i18n placeholder `{{i18n.path}}` 1급 시민
  - 토큰 참조 `{{token.spacing.section}}`
  - `## Behavior` (기능 명세), `## Variants` (변형 선언) 섹션
  - PEG grammar (peg.js 또는 chevrotain) 또는 Markdoc 직접 채택
  - JSON Schema lint — *어휘 카탈로그* (spec-7-01) 위반 시 에러
  - spec.md AST → 중간 IR (JSON tree) — Mitosis IR 류 참고
- **연관 모듈**: `studio/src/lib/spec-md/` (신규)
- **종속**: spec-7-01 (어휘 카탈로그 schema)
- **Integration Test Required**: yes (26 컴포넌트의 spec.md 작성 + 모두 valid 파싱)

### spec-7-03 — spec.md → Paper compiler

- **요점**: spec.md AST → Paper write_html 페이로드. *디자이너가 spec.md 작성 → Paper 시각화* 의 메인 루프 구현.
- **방향성**:
  - spec.md AST + tokens.json → Paper HTML 생성 (paper-sync `resolveSemanticColors` + `tokensToPaperPayloads` *production* 활용)
  - paper-normalizer 의 5 함수가 *값 정규화* 단계에서 production 활용 (회고 C2 완전 해소)
  - spec-6-10 의 `paper-e2e/render-helpers` 가 컴파일러로 진화
  - Studio 의 *Paper preview* 기능
  - 회귀 테스트: 26 컴포넌트 spec.md → Paper render 의 시각 정합 측정 (FrontendBench 류 metric)
- **연관 모듈**: `studio/src/lib/spec-md-compiler/`, `studio/src/lib/paper-sync/`, `studio/src/lib/paper-normalizer/`, `studio/src/lib/paper-e2e/`
- **종속**: spec-7-02 (parser)
- **Integration Test Required**: yes

### spec-7-04 — spec.md → React compiler

- **요점**: spec.md AST → React 컴포넌트 인스턴스 코드 (shadcn + Tailwind + cn). *spec.md → 동작하는 React* 의 메인 루프.
- **방향성**:
  - spec.md AST → JSX (shadcn 컴포넌트 인스턴스화)
  - i18n placeholder → t() 호출 (i18next 또는 자체)
  - `## Behavior` 섹션 → state hook + handler stub (단순 case 자동, 복잡 case stub)
  - `## Variants` → conditional rendering 또는 별도 컴포넌트
  - 출력 = shadcn registry 형식 — `npx shadcn add` 가능
  - Studio 의 *React preview* 기능 (in-browser sandbox)
  - 회귀 테스트: 26 컴포넌트 + 6 페이지 spec.md → React render 결정성 100%
- **연관 모듈**: `studio/src/lib/spec-md-compiler/react/`, `studio/src/components/ui/` (그대로 사용)
- **종속**: spec-7-02 (parser)
- **Integration Test Required**: yes

### spec-7-05 — Figma → spec.md 어댑터 (Distribution 전략)

- **요점**: 디자이너가 *Figma 를 떠나지 않고* 본 프로젝트와 병용 가능한 어댑터. 디자이너 reach 0 시장 진입.
- **방향성**:
  - Figma file 또는 Code Connect 매핑 → spec.md 변환 PoC
  - Figma MCP server (2025-10 stable) 의 get_design_context 활용
  - 단일 페이지 변환 → 디자이너 review → 갱신 루프
  - 정확도 평가 + 한계 보고
- **연관 모듈**: `studio/src/lib/figma-adapter/` (신규)
- **종속**: spec-7-02, spec-7-04
- **Integration Test Required**: yes (PoC 1 개 페이지 변환 성공)

### spec-7-06 — Paper → spec.md inference (**ADR-006 이후 메인 루프**)

> ⚡ **ADR-006 (2026-05-10) 이후 spec-7-04 보다 우선** — 디자이너 워크플로의 *canonical 시작점*. 기존 *보조 루프* 표현은 outdated.

- **요점**: Paper 레이어 트리 → spec.md 자동 추출. 디자이너가 Paper 에서 작업하면 시스템이 spec.md 를 만들어주는 핵심 흐름.
- **방향성**:
  - Paper 노드 트리 → 어휘 카탈로그 매칭 + 신뢰도 점수
  - LLM vision 또는 스타일 휴리스틱 (또는 하이브리드)
  - Confirmation UI: "AI 가 이렇게 인식했어요. 맞나요?"
  - 80%↑ 자동 채택 / 60-80% confirm / 60%↓ raw 보존 정책
  - accuracy 벤치마크 (26 컴포넌트 ground-truth set)
  - phase-5 retro 의 *관대한 측정* 함정 회피 — accuracy 정의 spec 단계에서 명문화
- **연관 모듈**: `studio/src/lib/paper-inference/` (신규)
- **종속**: spec-7-01, spec-7-02
- **Integration Test Required**: yes (accuracy ≥ 80% 달성)

### spec-7-07 — Studio 재구성

- **요점**: phase-6 의 4 feature (blueprint/editor/tokens/export) 를 spec.md 편집기 + dual preview + export 워크플로우로 재배치. *코드 자산은 모두 유지*, UI 라우팅만 재구성.
- **방향성**:
  - 메인 라우트: spec.md 편집기 (좌) + Paper preview (우상) + React preview (우하)
  - 보조 라우트: DESIGN.md 편집기 / TOKEN.md 편집기 (DTCG-aware) / FRONT.md viewer / export
  - phase-6 의 blueprint wizard → "신규 페이지 spec.md 생성" 마법사로 재배치
  - Studio export = DESIGN.md + TOKEN.md + FRONT.md + spec/ + assets/ + src/ ZIP
- **연관 모듈**: `studio/src/App.tsx`, `studio/src/lib/router.ts`, `studio/src/features/*`
- **종속**: spec-7-03, spec-7-04 (compiler 가 작동해야 preview 가능)
- **Integration Test Required**: yes (golden path: spec.md 편집 → Paper render → React preview → export)

## 🧪 통합 테스트 시나리오

### 시나리오 1: spec.md → Paper 정합

- **Given**: 26 컴포넌트의 spec.md (어휘 카탈로그 위반 0)
- **When**: spec.md → spec-md-compiler/paper → Paper write_html
- **Then**: 시각 정합률 ≥ 90% (Paper screenshot vs React baseline 비교, FrontendBench 류 metric)
- **연관 SPEC**: spec-7-02, spec-7-03

### 시나리오 2: spec.md → React 결정성

- **Given**: 같은 spec.md
- **When**: spec-md-compiler/react 두 번 실행
- **Then**: 두 결과가 *완전히 동일* (commit hash 일치)
- **연관 SPEC**: spec-7-02, spec-7-04

### 시나리오 3: Stitch DESIGN.md export 호환

- **Given**: 본 프로젝트 DESIGN.md (superset)
- **When**: `studio export --format=stitch`
- **Then**: Stitch DESIGN.md 0.1 검증기 PASS
- **연관 SPEC**: spec-7-01

### 시나리오 4: shadcn registry install

- **Given**: 본 프로젝트 export ZIP 의 src/registry.json
- **When**: 외부 신규 Next.js 프로젝트에서 `npx shadcn@latest add @designmd/login-page`
- **Then**: 컴포넌트 정상 install + 동작
- **연관 SPEC**: spec-7-01, spec-7-04

### 시나리오 5: Figma → spec.md 어댑터

- **Given**: 임의 Figma 파일 (spec-6-10 의 Token Test 같은 단순 페이지)
- **When**: figma-adapter 변환
- **Then**: 디자이너 review 후 acceptable spec.md 산출 (정성 평가)
- **연관 SPEC**: spec-7-05

## 🔗 의존성

- **선행 phase**: phase-6 (Studio v1 — composites / templates / paper lib / tokens 자산)
- **외부 시스템**: Paper MCP, Figma MCP (선택), shadcn registry standard, DTCG 1.0
- **연관 ADR**: ADR-004 (어휘 추출 + 4 layer variant). phase-7 진행 중 추가 ADR 작성 가능.
- **참고 문서**: `docs/vision.md`, `docs/benchmark.md`, `docs/decisions/ADR-004-vocabulary-extraction-and-variants.md`, `.harness-kit/agent/constitution.md`

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Stitch DESIGN.md 1.0 stable 시 0.1 alpha 와 호환 깨짐 | superset 재정의 | 0.1 alpha 호환 우선, 1.0 stable 발표 시 갱신 spec |
| spec.md grammar 의 sweet spot 못 찾음 | 디자이너 답답 또는 LLM 환각 | spec-7-02 의 PoC 단계에서 디자이너 사용성 테스트 (사용자 본인) + LLM 환각률 측정 |
| Paper → spec.md inference 정확도 80% 미달 | 보조 루프 무력 | spec-7-06 을 Research/PoC 로 명시. Go/No-Go 분기 |
| Figma 어댑터의 Figma API rate / Variables 권한 | Distribution 전략 약화 | PoC 단계에서 환경 확인. 한계 정직 보고 |
| 4 축 어휘 정합이 시장에서 *진짜로* 작동 안 함 (가설 미증명) | 본 프로젝트 핵심 가치 무력 | phase-7 후반에 외부 디자이너 1~2 명 alpha 사용 + 정성 피드백 |
| Anthropic Frontend Design plugin 등 외부 흡수 위협 | 차별화 portion 소실 | timing 가속 (3 ~ 5 개월 안에 MVP). Stitch superset + shadcn 채택으로 *호환 superset* 포지션 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 5 시나리오 모두 PASS (또는 Go/No-Go 명시 분기)
- [ ] 성공 기준 10 항목 정량 측정 결과 (PASS / FAIL 명시)
- [ ] 외부 디자이너 1~2 명 alpha 사용 + 정성 피드백 수집
- [ ] `docs/vision.md` 와 phase-7 결과의 정합 확인 (vision 이 살아있는가)
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

(phase-7 ship 시점에 채워짐)

## 🔄 phase-6 자산 재해석 (정직한 평가)

phase-6 까지의 작업은 *대부분 살아남는다*. *폐기는 권장 ❌, 재해석 ✅*.

| phase-6 자산 | phase-7 이후 새 역할 |
|---|---|
| `studio/src/components/ui/` (shadcn-style) | Tier 2 어휘 (그대로 사용) |
| `studio/src/components/composites/` (20 개) | Tier 3 어휘 (도메인 카탈로그) |
| `studio/src/components/templates/` (6 개) | 페이지 매크로 어휘 |
| `studio/src/lib/paper-normalizer/` | spec-7-03 컴파일러의 값 정규화 단계 (production) |
| `studio/src/lib/paper-sync/` | spec-7-03 컴파일러의 토큰 해소 단계 (production) |
| `studio/src/lib/paper-e2e/` (spec-6-10) | spec-7-03 의 render-helpers 첫 instance — 컴파일러로 진화 |
| `templates/assets/tokens/tokens.json` | spec-7-01 의 TOKEN.md (DTCG 정렬 후) |
| `studio/src/features/{blueprint,editor,tokens,export}` | spec-7-07 에서 재배치 (UI 라우팅만 변경, 코드 보존) |

**폐기 대상**: 거의 없음. *Studio UI 의 4 feature 라우팅 구조* 만 재배치. 코드 자산 자체는 모두 유지.

## 🎬 phase-7 이후 큰 그림

```
[phase-6] Studio v1 — 도구 부품
   ↓ (재해석)
[phase-7] DESIGN.md 4 축 어휘 + 컴파일러 ← 본 phase
   ↓
[phase-8] Studio v2 — spec.md 편집기 + dual preview + export 통합 워크플로우
   ↓
[phase-9] 외부 도구 통합 — shadcn registry 게시 / 21st.dev / Figma 어댑터 확장
   ↓
[phase-10] 검증 자동화 — Playwright + Paper screenshot + visual regression + a11y
   ↓
[v1.0] Open beta — 디자이너 페르소나 채택 단계
```
