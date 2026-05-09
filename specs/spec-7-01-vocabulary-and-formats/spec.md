# spec-7-01: 어휘 카탈로그 + 표준 형식 (Vocabulary & Formats)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-01` |
| **Phase** | `phase-7` |
| **Branch** | `spec-7-01-vocabulary-and-formats` |
| **상태** | Planning |
| **타입** | Feature (foundation) |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-10 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-6 까지 작업으로 다음을 보유:
- shadcn-style ui primitives (`studio/src/components/ui/`) — Button/Card/Dialog/Input/Label/Select/Slider/Switch
- 프로젝트 composites (`studio/src/components/composites/`) — 20 개
- 페이지 templates (`studio/src/components/templates/`) — 6 개
- tokens.json (`templates/assets/tokens/`) — 색/타이포/spacing/font 토큰

그러나 *어휘 카탈로그* 와 *표준 형식 호환* 은 미정. 4 축 어휘 정합 (vision §"4 중 어휘 정합") 의 ground truth 가 *machine-readable* 형태로 존재하지 않아, spec.md grammar (spec-7-02) / Paper compiler (7-03) / React compiler (7-04) 가 모두 막혀있다.

### 문제점

1. **수동 매핑 함정**: shadcn 컴포넌트의 variant/size 정보를 *수동 작성* 하면 Figma Code Connect 의 매뉴얼 매핑 비용 폭증 함정 (벤치마킹 §시장 함정 #6) 답습
2. **표준 미채택**: DTCG 1.0 stable / Stitch DESIGN.md / shadcn registry 가 이미 표준인데 *호환 형식* 미정 시 NIH 비판 (벤치마킹 §시장 함정 #9)
3. **어휘 ground truth 부재**: spec.md 작성자(디자이너) / Paper compiler / React compiler / lint 가 모두 *같은 카탈로그* 를 참조해야 하는데 아직 정의 안 됨
4. **회고 C2 잔존**: paper-normalizer / paper-sync 가 production 코드에서 *unused* — 본 spec 의 어휘 추출기에 통합 필요

### 해결 방안 (요약)

ADR-004 의 의사결정 (D-1 ~ D-6) 을 그대로 구현. **로컬 .tsx 의 cva AST 자동 추출** + **Stitch DESIGN.md superset** + **DTCG 1.0 strict TOKEN.md** + **shadcn registry-item.json 출력 형식**. 어휘 카탈로그 + FRONT.md 자동 생성. spec.md grammar 의 ground 가 되는 JSON Schema 도 자동 산출.

## 🎯 요구사항

### Functional Requirements

#### FR-1. cva AST 추출기 (`vocab-extract`)

- 입력: `studio/src/components/ui/`, `composites/`, `templates/` 의 `.tsx` 파일
- TypeScript compiler API 로 AST 파싱
- `cva()` 콜 인식 + `variants` 객체의 모든 axis + value 추출
- `VariantProps<typeof xxx>` 타입 추출
- 컴포넌트 props interface 추출 (cva 외 추가 props 포함)
- 출력: 각 컴포넌트의 *어휘 메타데이터* JSON

#### FR-2. 3-tier 카탈로그 자동 생성

- **Tier 1** (ARIA): W3C ARIA 1.3 spec 의 80+ role + state 정적 JSON
- **Tier 2** (shadcn primitives): ui/ AST 추출 결과
- **Tier 3** (프로젝트 composites + templates): composites/ + templates/ AST 추출 결과
- 통합 카탈로그 JSON: `studio/src/lib/vocabulary/catalog.json`

#### FR-3. FRONT.md 자동 렌더

- 카탈로그 JSON → FRONT.md (handlebars 또는 자체 템플릿)
- 3 tier 별 컴포넌트 + axis + value 표
- Paper 노드명 컨벤션 명시
- shadcn registry 메타 (registry.json 형식 호환 안내) 포함
- 출력 위치: `templates/FRONT.md` (Studio export 시 ZIP 에 포함)

#### FR-4. spec.md JSON Schema 생성

- 카탈로그 JSON → JSON Schema (spec.md lint 의 ground)
- 어휘 enum (등록된 컴포넌트 / variant / theme 만 허용)
- raw 색상값 금지 패턴 (`^#[0-9a-fA-F]{3,8}$` 등 거부)
- spec-7-02 (grammar) 가 이 schema 사용

#### FR-5. DTCG 1.0 strict 호환 TOKEN.md

- `templates/assets/tokens/tokens.json` 을 DTCG 형식 (`$value` / `$type` / `$description`) 으로 정렬
- TOKEN.md 마크다운 자동 렌더 (사람-가독)
- Style Dictionary v4+ / Tokens Studio / Stitch DESIGN.md export 호환 검증

#### FR-6. Stitch DESIGN.md superset 정의

- Stitch DESIGN.md 0.1 의 9 섹션 (Overview / Colors / Typography / Layout / Elevation / Shapes / Components / Do's-Don'ts / Iconography) 모두 보존
- 본 프로젝트 확장: i18n schema / 컴포넌트 인스턴스 어휘 / Paper 매핑 / FRONT.md 참조
- DESIGN.md 마크다운 자동 렌더
- Stitch CLI 검증기 PASS 가능한 *subset export* 함수 포함

#### FR-7. shadcn registry-item.json 출력 형식 검증

- 본 프로젝트의 composites/templates 가 그대로 외부에 install 가능한 형식
- 공개 schema (https://ui.shadcn.com/schema/registry-item.json) 와 ajv 검증
- `dependencies` / `registryDependencies` 자동 계산 (composite 의 ui primitive 의존 분석)
- spec-7-04 (React compiler) 가 이 형식으로 출력

#### FR-8. 회귀 lint (CI)

- 카탈로그 JSON ↔ 실 코드 일치 검증
- 코드 변경 후 카탈로그 미갱신 시 ERROR
- shadcn upstream 비교 (선택 — MCP query) 는 phase-7-08 또는 별도 spec-x

### Non-Functional Requirements

1. 추출기는 *plugin 가능* 설계 — cva 외 새 패턴 (tw-variants, slot, render-prop) 추가 지원 가능하도록
2. 추출 시간 ≤ 5 초 (26 컴포넌트 + ARIA spec)
3. 카탈로그 JSON 의 안정성 — *코드 무변경 시 동일 출력* (deterministic)
4. 자동 생성 산출물 (FRONT.md / TOKEN.md / DESIGN.md / catalog.json / schema) 은 *수동 편집 금지* 표시 (HTML comment)

## 🚫 Out of Scope

- spec.md grammar 자체 (spec-7-02 영역)
- Paper compiler / React compiler (spec-7-03 / 7-04)
- shadcn MCP 비교기 (별도 후보 — 본 spec 에서는 옵션)
- 카탈로그 등재 마법사 UI (spec-7-07 Studio reframe)
- cva 외 패턴 (data-state attribute, render prop, slot pattern) — 본 spec 은 cva + VariantProps 만. 다른 패턴은 plugin 인터페이스로 *확장 가능* 하게 설계만.

## ✅ Definition of Done

- [ ] `vocab-extract` 추출기 동작 + 단위 테스트 PASS
- [ ] 3 tier 카탈로그 JSON 생성 (ARIA + shadcn + composites/templates)
- [ ] FRONT.md / TOKEN.md / DESIGN.md 자동 렌더 + 사람-검수 통과
- [ ] DESIGN.md 의 Stitch subset export 가 Stitch CLI 검증기 PASS (또는 환경 미준비 시 schema 정합 manual 검증)
- [ ] tokens.json 이 DTCG 1.0 strict 형식 (ajv 검증 PASS)
- [ ] shadcn registry-item.json 형식 검증기 (ajv) 추가 + 단위 테스트 PASS
- [ ] 카탈로그 JSON ↔ 실 코드 회귀 lint (CI) 추가
- [ ] 기존 studio 단위 테스트 전체 PASS (회귀 0)
- [ ] walkthrough.md / pr_description.md ship + main PR (spec branch → phase-7-design-md)

## 🔗 관련 자료

- ADR-004: 어휘 추출 + 4 layer variant — 본 spec 의 *결정 ground*
- vision.md: 4 축 어휘 정합 + 6 결정 (D1~D6)
- benchmark.md: 시장 함정 + 차용 패턴 (Markdoc / shadcn registry / DTCG 등)
- phase-7.md: 7 spec 구조 + 성공 기준
- 외부: https://ui.shadcn.com/schema/registry-item.json (검증)
- 외부: https://www.designtokens.org/tr/drafts/format/ (DTCG 1.0)
- 외부: https://github.com/google-labs-code/design.md (Stitch superset)
