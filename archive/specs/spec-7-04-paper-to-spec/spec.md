# spec-7-04: Paper → spec.md inference

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-04` |
| **Phase** | `phase-7` |
| **Branch** | `spec-7-04-paper-to-spec` |
| **상태** | Planning |
| **타입** | **Research / PoC** (accuracy 정량 평가 + Go/No-Go gate) |
| **Integration Test Required** | yes (accuracy ≥ 60% pre-MVP, 80% target) |
| **작성일** | 2026-05-10 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

- **ADR-006** (2026-05-10): canonical 흐름 = Paper → spec.md → React. *디자이너 워크플로의 시작점* 은 Paper, 본 spec 이 그 시작점 구현.
- **ADR-007** (2026-05-10): SSOT = 4 문서 + 2 디렉토리. FRONT.md §5 가 Paper Layer ↔ Component 매핑의 *규칙* 정의 위치 — 본 spec 에서 그 규칙을 *결정 + 구현*.
- **이전 spec 자산** 활용:
  - spec-7-01 의 catalog.json (28 컴포넌트 어휘)
  - spec-7-02 의 spec.md grammar / parser (역방향 emit 의 형식)
  - spec-7-03 의 compileToPaper (round-trip 검증의 *forward* 단계)

### 문제점

1. **canonical 시작점 부재**: 디자이너가 Paper 에서 작업해도 시스템이 그 결과를 *읽을* 도구 없음. ADR-006 이 정의한 메인 루프의 가장 큰 빈자리.
2. **레이어 명명 컨벤션 미결정**: ADR-007 §5 가 `Button:primary` vs `Button[variant=primary]` 두 옵션 제시. 본 spec 에서 *결정*.
3. **inference 정확도 검증 부재**: phase-5 retro 의 *관대한 측정* 함정 회피 — accuracy 정의를 spec 단계에서 명문화해야.
4. **Paper MCP 의 호출 책임**: studio runtime 은 Paper MCP 직접 호출 불가 (Claude Code 세션의 권한). → 본 spec 의 알고리즘은 *Paper tree JSON in → spec.md out* 의 순수 함수, MCP 호출은 agent / CLI 가 담당.

### 해결 방안 (요약)

`studio/src/lib/paper-inference/` 신규 라이브러리 — Paper tree JSON 입력 → spec.md AST + 신뢰도 점수 출력. 28 fixture 의 *Paper round-trip* 으로 accuracy 측정. **Go/No-Go 게이트**: ≥ 60% (pre-MVP 합격, 부분 자동화), ≥ 80% (target, 메인 루프 운영). 이하면 *spec.md 직접 편집* fallback 으로 회귀.

## 📊 개념도

```
[디자이너 워크플로]
  Paper canvas
   ├── Artboard "LoginPage"
   │    ├── BrandHeader            (layer name = catalog name)
   │    ├── LoginForm
   │    │    ├── Input.email       (variant via convention)
   │    │    ├── Input.password
   │    │    └── Button:primary    (variant via "Comp:value")
   │    └── SocialAuthBlock

         ↓ Paper MCP (get_tree_summary, get_node_info)
         ↓ JSON tree (agent 가 fetch)

[본 spec — paper-inference 알고리즘]
  inferSpec(tree, catalog, options)
   ├── matchComponent(layer.name)     — catalog 매칭
   ├── extractVariant(layer.name)     — 컨벤션 파싱
   ├── classifyImage(layer)            — 이미지 영역 → Image 컴포넌트
   ├── recurseChildren()               — 트리 보존
   └── score(node)                     — 신뢰도 [0..1]

         ↓ AST + per-node confidence

[Output]
  spec.md (text, spec-7-02 grammar 역방향 emit)
  + InferReport { confident: [], confirm: [], unknown: [] }
```

## 🎯 요구사항

### Functional Requirements

#### FR-1. paper-inference 알고리즘 — 순수 함수

- 입력: Paper tree JSON (get_tree_summary 형식 가정 + get_node_info 의 부분)
- 입력: VocabularyCatalog (catalog.json)
- 출력: `{ ast: Document; report: InferReport }` (Document = spec-7-02 의 ast-types)
- 부수효과 없음 (Paper MCP 호출 X — agent / CLI 책임)

#### FR-2. 레이어 명명 컨벤션 결정 + 구현

본 spec 에서 *결정* 후 FRONT.md §5 (TBD) 에 명문화:

- **컴포넌트**: 레이어 이름 = catalog 의 PascalCase 이름 (`LoginForm`, `Button`)
- **variant 표현**: 후보 평가 후 1 개 채택 (Task 2)
  - (A) `Button:primary` (콜론) — 짧음
  - (B) `Button[variant=primary]` (대괄호) — 명시적
  - (C) Paper layer attribute (data-* 같은) — Paper UI 의존
  - (D) PostCSS-like `Button.primary` (점) — CSS class 친화
  - 둘 이상 동시 지원 X (디자이너 혼란 방지)
- **Tier 1 (ARIA)**: 레이어 이름 == ARIA role 명 → `<role-button>` 같은 하위레벨 요소로 처리 (또는 무시)
- **이미지 영역**: 이미지 fill 이 있는 사각형 → `<Image src="..." />`. asset 경로 추출 (paper-asset:// 또는 local 경로)
- **자식 트리**: 디자이너의 레이어 nesting 그대로 spec.md 의 children 으로

#### FR-3. 신뢰도 점수 (per-node)

- `1.0`: 정확히 catalog 매칭 (이름 + 시각 속성도 일치)
- `0.6 ~ 0.9`: catalog 매칭이지만 일부 시각 차이 또는 variant 모호
- `0.3 ~ 0.6`: 부분 매칭 (이름 유사 / fuzzy)
- `< 0.3`: 매칭 없음 → raw layer 보존 (HTML span 으로 fallback)

#### FR-4. 분류 — Confident / Confirm / Unknown

`InferReport` 에 3 분류:
- **confident** (≥ 0.8): 자동 채택, spec.md 에 그대로
- **confirm** (0.5 ~ 0.8): 디자이너 / 사용자 확인 필요 — Studio UI 또는 CLI prompt
- **unknown** (< 0.5): raw 보존 (markdown 안에 layer dump 형식)

#### FR-5. spec.md emit (AST → text)

- spec-7-02 의 grammar 역방향 — Document AST → spec.md 텍스트
- 형식 정합: emit 결과를 다시 parse 하면 동일 AST (round-trip stability)
- 들여쓰기 / 공백은 *디자이너 친화* 형식 (2 space, children 들여쓰기)

#### FR-6. 28 fixture round-trip accuracy 벤치마크

- ground truth: `spec/*.spec.md` 28 개 (사람이 작성)
- 측정 절차:
  1. 각 fixture 의 hand-crafted spec.md → compileToPaper(spec-7-03) → HTML
  2. (수동 또는 자동) HTML 을 Paper 로 송신 → Paper layer tree
  3. paper-inference → 새 spec.md
  4. 새 spec.md vs 원본 비교 (구조 + 컴포넌트 이름 + variant)
- accuracy 정의 (정량 — 모호 회피):
  - **structural accuracy**: 컴포넌트 트리의 위상 일치율 (노드 수 일치 + 부모-자식 관계 일치)
  - **vocabulary accuracy**: 컴포넌트 이름 매칭률
  - **variant accuracy**: 컴포넌트별 variant 일치율
- 종합 score = 가중 평균 (structural 0.4 + vocabulary 0.4 + variant 0.2)

#### FR-7. CLI: paper-to-spec

- `pnpm --filter studio paper-to-spec <tree.json>` — Paper tree JSON 파일 → stdout 에 spec.md
- `--report` — InferReport JSON 도 출력
- `--threshold 0.8` — confidence 임계값 조정

#### FR-8. (선택) Studio confirmation UI

- spec-7-06 (Studio reframe) 으로 연기 가능
- 본 spec 은 *알고리즘 + CLI* 까지가 MVP

### Non-Functional Requirements

1. **결정성**: 같은 입력 → 같은 출력 (휴리스틱이 deterministic)
2. **알고리즘 분리**: Paper MCP 호출은 알고리즘 외부 (테스트 가능)
3. **Go/No-Go gate**: accuracy ≥ 60% 미달 시 *알고리즘 폐기* + spec.md 직접 편집 fallback. 결과를 walkthrough 에 정직 보고.
4. **변형 (LLM vision) 평가**: Task 후반에 LLM vision (Claude / GPT) 통합 평가. 본 spec 의 결과가 *휴리스틱 only* / *LLM only* / *하이브리드* 중 어느 것이 가장 정확한지.

## 🚫 Out of Scope

- **Studio confirmation UI 의 *완전한 통합*** — spec-7-06 으로 연기
- **multi-user / 동시 편집** — 단일 디자이너 가정
- **Figma adapter** — spec-7-07
- **incremental update** — Paper 트리 일부 변경 시 spec.md diff. 본 spec 은 *전체 변환* 만
- **bidirectional sync** — Paper ↔ spec.md 양방향 실시간. 본 spec 은 Paper → spec.md 단방향

## ✅ Definition of Done

- [ ] `studio/src/lib/paper-inference/` 라이브러리 — `inferSpec(tree, catalog, options)` 공용 API
- [ ] 레이어 명명 컨벤션 1 개 채택 + 핸드북 / FRONT.md §5 placeholder 에 결정 기록
- [ ] 신뢰도 점수 + Confident/Confirm/Unknown 분류
- [ ] spec.md emit (AST → text) — round-trip stable
- [ ] 28 fixture round-trip accuracy 벤치마크 결과 보고 (PASS/FAIL — Go/No-Go)
- [ ] CLI `pnpm --filter studio paper-to-spec`
- [ ] 단위 테스트 — 각 매핑 룰 + 신뢰도 + emit + round-trip 30+ case
- [ ] Paper MCP 실 송신 round-trip 1 회 검증 (LoginPage 또는 단순 fixture)
- [ ] studio 전체 단위 테스트 회귀 0
- [ ] walkthrough.md / pr_description.md ship + main PR

## 🔗 관련 자료

- ADR-004 (어휘 + 4 layer variant), ADR-005 (grammar + IR), **ADR-006 (Paper-first workflow)**, **ADR-007 (FRONT.md = 컴파일 룰북)**
- spec-7-01 (catalog), spec-7-02 (parser), spec-7-03 (compileToPaper)
- vision.md (디자이너 워크플로)
- phase-5 retro: *관대한 측정* 함정 회피 (본 spec 의 accuracy 정의 ground)
- 외부: Paper MCP get_tree_summary / get_node_info / get_computed_styles
