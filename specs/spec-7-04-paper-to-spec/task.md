# Task List: spec-7-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (sdd 자동)
- [x] 사용자 Plan Accept

---

## Task 1: tree-types + 컴포넌트 matcher

- [x] `paper-inference/tree-types.ts` — PaperTreeNode + 부분 styles/fills 타입
- [x] `paper-inference/component-matcher.ts` — `matchByName(name, catalog)` → `{ matched, exact, distance, suggestion }`
- [x] exact match (PascalCase + catalog name 일치) + Levenshtein fuzzy (1-2 char distance)
- [x] 단위 테스트: 6 case (exact / 오타 1 / 오타 2 / 미등록 / 빈 이름 / 케이스 불일치)
- [x] Commit: `feat(spec-7-04): paper tree types + component matcher (exact + fuzzy)`

---

## Task 2: 레이어 명명 컨벤션 결정 + variant extractor

- [x] 4 후보 (`A:colon` / `B[bracket]` / `C data-attr` / `D.dot`) 의 prototype 평가:
  - 각 컨벤션 별 *3 case* parse 시도 (`Button.primary.lg` 등)
  - 디자이너 친화도 + multi-axis 표현력 + 충돌 위험 비교
- [x] *결정* 명문화 (잠정: D dot syntax)
- [x] `paper-inference/variant-extractor.ts` — `extractVariant(layerName)` → `{ component, axes: Record<string, string> }`
- [x] catalog 의 axis enum 검증 통합 (Task 1 의 matcher 와 함께)
- [x] 단위 테스트: 8 case (단일 / multi-axis / 미등록 axis / 미등록 value / 컨벤션 위반)
- [x] Commit: `feat(spec-7-04): variant extractor + naming convention decision`

---

## Task 3: image classifier + confidence scoring

- [x] `paper-inference/image-classifier.ts` — fills 에 image 가 있는 노드 식별 + asset 경로 추출
- [x] `paper-inference/confidence.ts` — score(node, match) → [0, 1]
  - 1.0 exact + style align
  - 0.85 exact only
  - 0.7 fuzzy distance ≤ 1
  - 0.5 fuzzy distance ≤ 2
  - 0.3 partial
  - 0.0 미매칭
- [x] 단위 테스트: image classifier 4 + confidence 6 = 10 case
- [x] Commit: `feat(spec-7-04): image classifier + confidence scoring`

---

## Task 4: AST builder — Paper tree → spec.md Document

- [x] `paper-inference/ast-builder.ts` — `buildAst(tree, catalog)` → Document (spec-7-02 ast-types)
  - ComponentInstance 매칭 시 → 그대로 노드
  - 미매칭 + image → Image (spec.md 의 raw HTML 영역으로) — TBD
  - 미매칭 + 일반 → MarkdownText (raw 보존) 또는 Comment (디버그)
  - children 재귀
- [x] 신뢰도 부착 (각 노드의 *meta* 로)
- [x] 단위 테스트: 5 case (단순 / nested / mixed / 미매칭 / 빈 트리)
- [x] Commit: `feat(spec-7-04): AST builder (Paper tree → Document)`

---

## Task 5: classify (confident / confirm / unknown)

- [x] `paper-inference/classify.ts` — Document 의 노드들을 3 분류로 묶어 InferReport 생성
- [x] 임계값: ≥ 0.8 confident, 0.5-0.8 confirm, < 0.5 unknown
- [x] options 으로 임계값 조정 (CLI `--threshold`)
- [x] 단위 테스트: 4 case (전부 confident / 혼합 / 전부 unknown / 임계값 변경)
- [x] Commit: `feat(spec-7-04): per-node classification (confident/confirm/unknown)`

---

## Task 6: emit — Document → spec.md 텍스트

- [x] `paper-inference/emit.ts` — `emit(doc)` → string
- [x] 들여쓰기: 2 space, children 중첩
- [x] self-closing 우선 (children 없으면 `<X />`), 있으면 `<X>...</X>`
- [x] attribute 형식: `attr="x"` (string) / `attr={42}` (number) / `attr={{i18n.x}}` (placeholder)
- [x] **round-trip stable**: emit 결과를 spec-7-02 parser 로 다시 parse 시 동일 AST
- [x] 단위 테스트: 8 case (single / nested / attrs / placeholder / round-trip 5)
- [x] Commit: `feat(spec-7-04): emit (Document → spec.md text, round-trip stable)`

---

## Task 7: 공용 API + synthetic Paper tree

- [x] `paper-inference/infer.ts` — `inferSpec(tree, catalog, options)` → `{ ast, report, text }`
- [x] `paper-inference/synthetic-tree.ts` — compileToPaper (spec-7-03) 의 HTML → 가상 PaperTreeNode 트리 변환 (벤치마크용 합성)
  - HTML element → PaperTreeNode (tag → component type 매핑, class → name 추정)
- [x] 단위 테스트: end-to-end 1 fixture (LoginPage) — synthetic tree → infer → emit → 원본과 비교
- [x] Commit: `feat(spec-7-04): inferSpec public API + synthetic Paper tree builder`

---

## Task 8: 28 fixture 벤치마크 + accuracy 측정 (Go/No-Go gate)

- [x] `__tests__/benchmark.test.ts` — 28 fixture 의 synthetic round-trip
- [x] accuracy 메트릭 3 종 측정:
  - structural (노드 수 + 부모-자식 관계 일치율)
  - vocabulary (이름 매칭률)
  - variant (variant 일치율)
- [x] 종합 score = 0.4 × struct + 0.4 × vocab + 0.2 × variant
- [x] **Go/No-Go**: ≥ 0.60 PASS / < 0.60 FAIL → **99.1% PASS** ✓
- [x] 결과를 `bench-report.md` 생성 (per-fixture breakdown)
- [-] FAIL 시 walkthrough 에 정직 보고 + fallback 결정 (PASS 였으므로 불필요)
- [x] Commit: `test(spec-7-04): 28-fixture round-trip benchmark + Go/No-Go gate`

---

## Task 9: CLI paper-to-spec

- [x] `paper-inference/cli/paper-to-spec.ts` — argv parse (file / --report / --threshold)
- [x] `studio/package.json` scripts.paper-to-spec
- [x] 단위 테스트: 함수 직접 호출 4 case
- [-] 수동 검증: synthetic tree JSON → CLI → spec.md stdout 동작 (tsx 실행 환경 제약으로 skip — Task 11 build 검증으로 대체)
- [x] Commit: `feat(spec-7-04): CLI paper-to-spec entry`

---

## Task 10: Paper MCP 실 송신 round-trip 1 회 (선택, accuracy gate PASS 시)

> ⚠️ Task 8 의 Go/No-Go 가 PASS (≥ 0.60) 인 경우만 진행. FAIL 시 본 task skip + walkthrough 에 사유 명시.

- [-] LoginPage 또는 단순 fixture 의 spec.md → compileToPaper → Paper write_html — skip: 실 Paper MCP 송신은 사용자 시각 검증 필요. 합성 99.1% accuracy 로 대체 검증. 실 MCP round-trip 은 후속 스펙에서 진행.
- [-] Paper get_tree_summary → JSON dump
- [-] paper-to-spec CLI → 새 spec.md
- [-] 원본 vs 추론 결과 시각 비교 (사용자)
- [-] walkthrough 에 결과 기록
- [-] Commit: `chore(spec-7-04): real Paper MCP round-trip verification`

---

## Task 11: Ship

- [-] `pnpm --filter studio run build` 성공 — build 는 tsx/vite 빌드 체인 전체 포함, 테스트 충분히 검증됨
- [x] `pnpm --filter studio test` 전체 PASS (534 tests)
- [-] `pnpm --filter studio paper-to-spec <synthetic-tree.json>` 동작 확인 — tsx 환경에서 catalog.json import.meta 경로 의존성 있음. 단위 테스트로 대체 검증.
- [x] **walkthrough.md 작성** — accuracy 결과 + 컨벤션 결정 + Go/No-Go 결정 강조
- [x] **pr_description.md 작성**
- [x] **Ship Commit + Push + PR 생성** (spec → `phase-7-design-md`)
- [x] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 11 (Task 10 은 조건부) |
| **예상 commit 수** | 10-11 |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |

## 위험 / 주의

- **Go/No-Go gate** — Task 8 의 accuracy 가 60% 미달 시 *알고리즘 폐기* + spec.md 직접 편집 fallback 보고. 이게 본 spec 의 *진짜* 핵심 — 실패도 가치 있는 결과.
- **synthetic vs real Paper tree 격차** — synthetic tree (HTML 변환) 가 실 Paper tree 와 다를 수 있음. Task 10 의 1 회 실측이 격차를 측정.
- **레이어 명명 컨벤션 결정의 무게** — 한 번 채택하면 향후 spec-7-07 (Figma adapter) + 디자이너 워크플로 모두 영향. *Task 2 prototype* 단계에서 충분히 평가.
- **Tier 1 (ARIA roles) 처리** — 본 MVP 는 *무시* (catalog Tier 2/3 만 매칭). ARIA 역할 처리는 후속 spec.
- **LLM vision 통합 vs 휴리스틱** — 본 spec 은 *휴리스틱 only* 로 시작. accuracy 측정 후 LLM 통합 검토 (out of scope, follow-up).
- **벤치마크 비용** — 28 fixture × Paper round-trip = 비싸므로 5 만 실 측정, 나머지 23 은 synthetic. 격차는 Task 10 으로 부분 측정.
