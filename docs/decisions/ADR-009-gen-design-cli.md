# ADR-009: gen-design CLI 명령군 — 단일 CLI (옵션 B), 5 명령 분리

> **상태**: 승인 (Accepted)
> **날짜**: 2026-05-10
> **의사결정자**: Dennis
> **연관 문서**: ADR-008 (per-spec design 정책 — `merge` 명령의 도입 조건), docs/handbook.md §7 (도구)
> **선행 ADR**: ADR-007 (SSOT 4 문서 + 2 디렉토리), ADR-008 (글로벌 직접 편집)

## 컨텍스트

ADR-007 가 SSOT 구조를 확정하고 ADR-008 가 *글로벌 직접 편집* 정책을 채택하면서, *글로벌 SSOT 와 코드 사이의 변환 / 검증 도구* 의 필요성이 점점 커짐. phase-7 진행 중 다음 후보 명령들이 자연스럽게 떠오름:

| 후보 명령 | 의도된 책임 | phase-7 안 진행도 |
|---|---|---|
| `merge` | spec.md 슬라이스 → 글로벌 SSOT 누적 | 0 (옵션 B 라 *수동 편집* 으로 대체) |
| `extract react` | catalog + 컴포넌트 → React 패키지 (shadcn registry) | 부분 (`registry-writer.ts` + `compileToReact` 가 *부분* 충족) |
| `extract paper` | spec.md → Paper tree | 부분 (`compileToPaper` 가 *부분* 충족, CLI 화 미완) |
| `diff` | 글로벌 SSOT vs studio 코드 비교 | 0 |
| `lint global` | catalog ↔ DESIGN.md ↔ FRONT.md ↔ spec.md 정합 검증 | 0 |

또한 *어디에 둘 것인가* 의 질문:

- **옵션 A**: 별도 `gen-design-kit/` 디렉토리 (harness-kit 형제) — *여러 프로젝트* 재사용 의도
- **옵션 B**: 본 프로젝트 안 `studio/scripts/gen-design.ts` 단일 CLI — *시작은 단순*, 검증 후 분리

### 현재 상태

- studio package 안에 *부분 CLI* 가 산발적: `pnpm spec-react`, `pnpm paper-to-spec`, `pnpm spec-paper` 가 각자 별도 진입점
- 통합 진입점 (`gen-design <subcommand>`) 0
- 5 명령 중 *통합 lint* 와 *글로벌 diff* 는 아직 코드 0

### 문제점

1. **CLI 분산 → 학습 곡선** — 외부 디자이너가 5+ 명령을 별도 학습. handbook §7 에서 *통합 진입점* 약속이 명령 표준화의 전제.
2. **코드 재사용성 미검증** — 두번째 프로젝트 (다른 디자인 시스템) 에서 동일 도구가 필요한지 *알 수 없는 상태*. 별도 kit 분리는 *premature*.
3. **명령별 도입 시점 미정** — phase-8 / phase-9 / 보류 — *우선순위 결정 부재* 시 명령군 전체가 모호.

## 결정

### D-1: 옵션 B (단일 CLI) 채택

- 모든 명령은 `studio/scripts/gen-design.ts` 의 subcommand 로 추가
- 진입점: `pnpm gen-design <subcommand> [args]` (또는 `pnpm gd <subcommand>`)
- 별도 `gen-design-kit/` 분리는 *명백한 재사용 가치* 가 두번째 프로젝트에서 확인되기 전까지 *유보*

### D-2: 옵션 비교

| 옵션 | 장점 | 단점 |
|---|---|---|
| **A. 별도 `gen-design-kit/`** (harness-kit 형제) | 다중 프로젝트 재사용 / 독립 버전 / 외부 기여 가능 | premature (재사용 가치 미검증) / 본 프로젝트와 *일관성 동기화* 부담 / 초기 셋업 부담 (npm 게시 / CI / 별도 README) |
| **B. 단일 CLI `studio/scripts/gen-design.ts`** | 시작 단순 / 본 프로젝트 의존성 그대로 사용 / 빠른 반복 | 다른 프로젝트 재사용 시 코드 발췌 필요 / harness-kit 같은 *외부 표준* 가 되지 못함 |

### D-3: 옵션 B 선택 이유

1. **YAGNI** — 두번째 프로젝트가 *동일* 도구를 필요로 하는 시점까지는 *재사용성* 검증이 불가능. 그 전 분리는 추측 기반.
2. **본 프로젝트 의존성 활용** — `studio/` 의 `peggy` parser, `typescript` API, `vocabulary/` extractor 등을 *그대로* 사용. 별도 kit 은 의존성 *복제* 부담.
3. **빠른 반복** — phase-8 의 첫 실용 명령 (`lint global`) 은 *바로* 작성 시작 가능. kit 분리 셋업 시간 0.

### D-4: 5 명령 — 책임 / 입출력 / 도입 시점

| 명령 | 책임 | 입력 → 출력 | 도입 시점 | 우선순위 |
|---|---|---|---|---|
| `gen-design lint` (or `lint global`) | catalog ↔ `templates/DESIGN.md` ↔ `templates/FRONT.md` ↔ `spec/*.spec.md` 정합. 신규 어휘 / 누락 매핑 / 이름 불일치 검출 | `templates/*` + `spec/*.spec.md` + `studio/src/lib/vocabulary/catalog/catalog.json` → 0 issue 또는 issue 리포트 | **phase-8 첫 실용 명령** | ⭐ 1 |
| `gen-design diff` | 글로벌 SSOT 가 *현재 코드* 와 일치하는지 비교 (예: catalog 의 Tier 2 가 `studio/src/components/ui/` 와 1:1) | `templates/*` + `studio/src/components/` → 차이 보고 (markdown) | phase-8 후보 | ⭐ 2 |
| `gen-design paper` (or `extract paper`) | spec.md → Paper tree (Paper MCP `write_html` 입력 형태) | `spec/<x>.spec.md` → JSON tree | phase-8 (현 `compileToPaper` 의 CLI 진입점 일관화) | ⭐ 3 |
| `gen-design react` (or `extract react`) | catalog + 컴포넌트 → React 패키지 (shadcn registry 형식) | `studio/src/components/` + `catalog.json` → `dist/registry/{name}.json` | phase-9 (외부 shadcn 설치 검증) | ⭐ 4 |
| `gen-design merge` | spec.md 슬라이스 → 글로벌 SSOT 누적 | `specs/spec-X-Y/{DESIGN,FRONT,TOKEN}.md` → `templates/*` (옵션 A 의존) | **ADR-008 옵션 A 도입 시까지 보류** — 현재 옵션 B 면 수동 글로벌 편집으로 충분 | (보류) |

### D-5: 첫 실용 명령 = `lint global`

`gen-design lint` 가 phase-8 첫 실용 명령으로 결정. 이유:

1. **즉시 가치** — phase-7 의 W5 (catalog Tier 2 = 1, 미등재 컴포넌트) / W11 (Figma adapter 의 어휘 정합 룰) 이 lint 으로 *측정 가능* 한 결함.
2. **순수 read-only** — 글로벌 / 코드를 변경하지 않음. CI 통합 안전.
3. **외부 alpha 의 안전망** — 디자이너가 새 spec.md 작성 시 lint 가 즉시 어휘 위반 / 매핑 누락 검출.

`lint` 의 검증 카테고리 (phase-8 spec 에서 구체화):

- **C1**: catalog 의 모든 컴포넌트가 `studio/src/components/{ui,composites,templates}/` 안 import 가능
- **C2**: `templates/DESIGN.md` 의 §11 (페이지 트리) 의 컴포넌트 이름이 catalog 에 등재
- **C3**: `templates/FRONT.md` 의 §2 어휘 카탈로그 narrative 가 catalog 와 1:1
- **C4**: 모든 `spec/<x>.spec.md` 의 `<Component>` 이름이 catalog 에 등재
- **C5**: `templates/TOKEN.md` 의 토큰 narrative 가 `templates/assets/tokens/tokens.json` 과 일치
- **C6**: 모든 catalog 항목이 *최소 한 spec.md 에서 사용* — 미사용 어휘 검출

### D-6: 후속 액션

1. `docs/handbook.md` §7 (도구) 에 본 ADR 의 D-4 표 인용 + 첫 실용 명령 = `lint global` 명시.
2. phase-8 의 첫 spec 후보 = `spec-8-01-gen-design-lint` (책임 / 인터페이스 / 검증 카테고리 6 개 의 구체화).
3. `studio/scripts/gen-design.ts` 의 entry point 도 phase-8 첫 spec 안에서 도입 — 본 ADR 자체는 *결정 + 인터페이스 정의* 만, 코드 0.

## 결과

### 즉시 영향

- handbook §7 (도구) 의 *5 명령 표* 가 본 ADR 의 D-4 인용으로 단일 진실 형성.
- phase-8 의 *첫 우선순위 spec* 자동 결정 (`spec-8-01-gen-design-lint`) — 회의 / 재논의 부담 0.

### 장기 영향

- *살아있는 핸드북* 의 §7 갱신은 본 ADR 의 D-4 표 갱신 = 한 번 결정 = 두 곳 동기화. 단일 진실 패턴.
- 두번째 프로젝트 (가설) 가 동일 도구 필요 시 ADR-009-revised 작성 → 옵션 A 로 전환. 현 단일 CLI 의 *코드 발췌* 가 마이그레이션의 단순성 보장.
- `merge` 명령의 *영구 보류 가능성* — ADR-008 의 옵션 A 가 영구히 채택 안 되면 `merge` 도 영구 보류. 그건 *비용* 이 아닌 *과적 회피*.

### Out of scope (본 ADR)

- `lint global` 의 검증 카테고리 (C1-C6) 의 *구현* — phase-8 의 spec.
- `diff` / `paper` / `react` 명령의 구체 인터페이스 — phase-8 / phase-9 의 spec.
- gen-design 의 진입점 (`pnpm gen-design` vs `pnpm gd`) 의 alias 결정 — phase-8 첫 spec 에서.

## 회고

- 5 명령 중 *4 개* 가 phase-8 / 9 후보, *1 개* (`merge`) 가 ADR-008 결정에 따라 영구 보류 가능 — *결정의 cascading* 이 ADR 들 사이에서 작동하는 모범 사례.
- 옵션 A (별도 kit) 의 *언젠가 가치* 는 인정하나, *지금* 의 비용이 가치를 초과. *trigger 기반* 재논의가 항상 옳음.
- `lint global` 의 첫 실용성 결정은 *외부 alpha 안전망* 측면에서 가장 강함. phase-7 ship 의 W5 / W11 같은 잠재 결함을 *디자이너 본인* 이 발견할 수 있음.
