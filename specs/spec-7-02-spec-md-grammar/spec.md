# spec-7-02: spec.md grammar + parser

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-02` |
| **Phase** | `phase-7` |
| **Branch** | `spec-7-02-spec-md-grammar` |
| **상태** | Planning |
| **타입** | Feature (foundation — 후속 7-03/04 의 입력) |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-10 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-7-01 이 완료되어 본 프로젝트는 다음을 보유:
- 어휘 카탈로그 (catalog.json) — 28 컴포넌트 + 78 ARIA roles
- spec.md JSON Schema (spec-schema.json) — lint ground
- TOKEN.md / FRONT.md / DESIGN.md (Stitch superset)

ADR-005 에서 결정:
- **D-1**: spec.md grammar = JSX-like 자체 grammar (사용자 표현 보존)
- **D-2**: 컴파일러 IR = 자체 JSON tree (phase-7 React 단일 깊이)

그러나 *grammar 자체* + *parser* 가 아직 구현 안 됨. spec-7-03 (Paper compiler) / 7-04 (React compiler) 가 본 spec 의 결과물 (parser 가 산출하는 AST) 을 입력으로 사용한다.

### 문제점

1. **grammar 미정의**: ADR-005 D-1 이 *형식 채택* 만 결정. 정확한 문법 (지원 노드, 속성 형식, multi-line) 미정.
2. **parser 미구현**: AST 산출 함수 없음. spec-7-03/04 가 막혀있다.
3. **lint 통합 부재**: spec-7-01 의 spec-schema.json 이 *AST 객체* 검증용 schema 인데, parser 가 이걸 호출해 사용자에게 친화적 에러 보고하는 구조 없음.
4. **fixture 부재**: 26 컴포넌트 spec.md 예제 없음 — grammar 의 실 사용성 검증 불가.

### 해결 방안 (요약)

ADR-005 D-1, D-2 의 형식 채택 위에 *구체적 grammar 명세* + *parser 구현* + *lint 통합* + *fixture 26 컴포넌트 예제*. peg.js 채택 (간결성 우선) — spec-7-02 task 분해 시 chevrotain 과 비교 후 최종 결정.

## 🎯 요구사항

### Functional Requirements

#### FR-1. spec.md JSX-like grammar 명세

- 컴포넌트 태그: `<ComponentName attr="value" prop={value}>...</ComponentName>` 또는 self-closing `<ComponentName />`
- 속성 (attribute) 값:
  - 문자열 리터럴: `"text"` 또는 `'text'`
  - JSON literal: `{42}`, `{true}`, `{null}`
  - JSON object: `{ "a": "b" }`
  - JSON array: `["a", "b"]`
  - placeholder: `{{i18n.path}}`, `{{token.path}}`
- 텍스트 콘텐츠: 자식 텍스트 + placeholder 혼재 가능
- 공백 / 줄바꿈: HTML 와 유사한 collapse 정책
- 주석: `<!-- ... -->` (HTML 식)
- 마크다운 본문: spec.md 의 *컴포넌트 태그 외 영역* 은 일반 markdown 그대로 보존 (parser 가 *컴포넌트 트리* 만 추출, markdown 영역은 raw text)

#### FR-2. parser 구현 (peg.js 또는 chevrotain)

- 입력: spec.md 텍스트
- 출력: ComponentInstance[] (또는 root document AST)
- spec-7-01 의 spec-schema.json 에 따라 AST 검증 (ajv)
- 친화적 에러 메시지 (line, column, expected vs actual)

#### FR-3. lint 통합

- AST 검증 단계: parser 후 spec-schema.json 으로 ajv 검증
- 어휘 검증 단계: 각 ComponentInstance 의 name 이 catalog.json 에 등재되어 있는지 + axis 의 value 가 enum 에 있는지
- raw 색상 거부 (D-4 명시)
- 에러: `[line:col] <message>` 형식

#### FR-4. 26 컴포넌트 fixture spec.md 예제

- `spec/<component-name>.spec.md` 형식으로 26 컴포넌트 모두 spec.md 작성
- 각 fixture 는 grammar 회귀 셋
- 회귀 테스트: 모든 fixture parse → AST → schema 검증 → 모두 PASS

#### FR-5. CLI 진입점

- `pnpm --filter studio spec-lint <file>` 또는 `pnpm vocab` 의 일부로 통합
- spec.md 파일 받아 parse + lint, 에러/PASS 보고

### Non-Functional Requirements

1. parser 의 결정성 (deterministic) — 같은 입력 → 같은 AST
2. 단위 테스트 커버리지 — 각 grammar 규칙 별 happy + edge case
3. 에러 메시지의 사용자 친화도 — `<Buttn>` 오타 시 `<Button>` 추천 같은 fuzzy 제안 (선택, NFR)
4. parser 의 성능 — 26 fixture 모두 parsing 1 초 내

## 🚫 Out of Scope

- Paper compiler / React compiler (spec-7-03 / 7-04)
- AST → AST 변환 (transform pass) — spec-7-03 의 영역
- IDE syntax highlighting / language server — phase-8 후보
- Mitosis IR 변환 — phase-8+ 평가 (ADR-005 미해결)
- 마크다운 본문의 컴포넌트 태그 추출 외 처리 — *raw text* 보존만, 가공 X

## ✅ Definition of Done

- [ ] grammar 명세 문서 (spec-7-02 의 plan.md 또는 별도 grammar.md)
- [ ] peg.js 또는 chevrotain 채택 결정 + parser 구현
- [ ] AST validate 함수 (parser 출력 → spec-schema.json ajv 검증)
- [ ] CLI: `pnpm --filter studio spec-lint <file>`
- [ ] 26 컴포넌트 fixture spec.md (`spec/` 디렉토리 또는 fixtures/)
- [ ] 26 fixture 모두 parse + lint PASS — 회귀 테스트
- [ ] 단위 테스트 — grammar 규칙별 happy + edge case 30+ 개
- [ ] 친화적 에러 메시지 (line:col + expected/actual)
- [ ] studio 전체 단위 테스트 회귀 0
- [ ] walkthrough.md / pr_description.md ship + main PR (spec → phase-7-design-md)

## 🔗 관련 자료

- ADR-004: 어휘 추출 + 4 layer variant — spec-schema.json 의 출처
- ADR-005: grammar / IR 형식 결정 — 본 spec 의 *결정 ground*
- spec-7-01: vocabulary & formats — 본 spec 의 입력 (catalog.json + spec-schema.json)
- vision.md: user story (`<Login>{{i18n.ko.login-input}}</Login>` 표현)
- 외부: https://pegjs.org/ (peg.js)
- 외부: https://chevrotain.io/ (chevrotain)
