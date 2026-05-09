# Walkthrough: spec-7-02 — spec.md grammar + parser

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-02` |
| **Branch** | `spec-7-02-spec-md-grammar` |
| **Base** | `phase-7-design-md` |
| **상태** | Ready to ship |
| **소요 commit** | 10 (pre-flight + Task 1-9 + ship) |
| **누적 테스트** | 419 → 427 (+8) |

## 🎯 목표 vs 결과

| 목표 | 결과 |
|---|---|
| spec.md JSX-like grammar 명세 | ✅ peggy grammar (Document → Block → Component/Placeholder/MarkdownText/Comment) |
| parser 구현 | ✅ studio/src/lib/spec-md/parser/ — parse / parseFile + ParseResult envelope |
| 4-stage lint 통합 | ✅ parse → schema → catalog → axis 누적 검출 |
| 28 컴포넌트 fixture spec.md | ✅ spec/ 디렉토리 (당초 26 + 추가 2) |
| CLI spec-lint | ✅ pnpm --filter studio spec-lint <file...> |
| 친화적 에러 메시지 | ✅ peggy 채택 (Task 2 비교 결정) |
| 단위 테스트 30+ | ✅ 75 case (parser 32 + lint 10 + CLI 6 + AST 5 + fixtures 2 + parse-api 7 + prototype-비교에서 이전된 검증들 통합) |

## 🛠️ 결정 기록

### D-1: parser 도구 = peggy (chevrotain 대신)

**비교 (Task 2 prototype)**:

| 차원 | chevrotain | peggy | 우위 |
|---|---|---|---|
| Happy path 정확성 | 3/3 PASS | 3/3 PASS | tie |
| 에러 메시지 친화도 | `Expecting [I18n] [Token]` (내부 토큰명) | `Expected "i18n" or "token" but "x" found.` | **peggy** |
| AST 매핑 | CST → visitor 추가 필요 | grammar 안 직접 반환 | **peggy** |
| Type-safety | TS class | grammar 결과 캐스팅 | **chevrotain** |
| 빌드 단계 | zero (런타임) | peggy.generate 또는 prebuild | **chevrotain** |
| markdown lookahead | lexer mode 까다로움 | PEG lookahead 자연스러움 | **peggy** |
| 의존성 크기 | ~150KB | ~75KB | **peggy** |

**채택 근거**: 디자이너가 직접 spec.md 편집 → 친화적 에러 메시지가 핵심 가치 (FR-3 + NFR-3). markdown 본문 + 컴포넌트 태그 혼재 lookahead 도 PEG 가 자연스러움. type-safety 약화는 ast-types.ts 인터페이스 + grammar return 캐스팅으로 보강.

### D-2: 4 layer attribute 의 분리 저장

ADR-005 D-2 의 IR 매핑을 grammar 단계에서 직접 수행:
- L1/L2 (variant + axis) → `ComponentInstance.props`
- L3 (theme context) → `theme="brand-a"` → `ComponentInstance.theme`
- L4 (인라인 토큰 override) → `tokens={{...}}` → `ComponentInstance.tokens`

grammar 의 `buildComponentInstance` 헬퍼가 attribute 배열을 walk 하며 분배.

### D-3: lowercase HTML 은 markdown 으로 처리

`<div>...</div>` 같은 lowercase 태그는 markdown 영역으로 raw 보존. PascalCase 만 ComponentTag 로 매칭. 디자이너가 markdown 안에 raw HTML 을 섞어 쓰는 흔한 케이스 지원.

### D-4: catalog 검증을 schema 와 분리

spec-schema.json 도 oneOf 로 컴포넌트 어휘 검증을 한다 — 그러나 ajv 의 oneOf 실패 메시지는 친화적이지 않다 (`schema 1.0 does not match…`). catalog-check.ts 에서 *친화적* 에러 (`Unknown component <Buttn>` + suggestion `<Button>?`) 를 별도 단계로 추가. schema 단계는 raw 색상 거부 + 구조 무결성에 집중.

## 🐛 해결한 이슈

### Schema validator 캐시 버그

CLI 가 fresh JSON load 시 (`JSON.parse(readFileSync(...))` 매 호출 다른 object) ajv 가 `schema with key "$id" already exists` 던졌다.

**원인**: 캐시가 object identity (`cachedSchemaRef === options.schema`) 기반 — 두 번째 호출은 다른 object 라서 cache miss → 다시 compile → ajv 가 같은 `$id` 두 번 등록 거부.

**해결**: ajv 의 자체 캐싱을 활용 — `ajvInstance.getSchema($id)` 우선 조회 후 없을 때만 compile.

### TypeScript build error (`as { kind: string }`)

`AttrValue` 의 union 안에서 `Placeholder` 만 추출하는 type assertion 이 직접 캐스팅으로는 안 됨. `as unknown as { kind, path }` 2 단계로 회피.

## 📂 산출물 요약

```
studio/src/lib/spec-md/
├── grammar/
│   ├── spec-md.ts        — peggy grammar string (Document → Block → 4 노드 + Attributes + JSON)
│   └── index.ts          — runtime peggy.generate
├── parser/
│   ├── ast-types.ts      — Document / ComponentInstance / Placeholder / MarkdownText / Comment / ParseResult
│   ├── index.ts          — parse() / parseFile()
│   └── __tests__/        — placeholder / markdown-text / component-tag / attributes / parse-api (32 case)
├── lint/
│   ├── schema-validate.ts — ajv (allErrors) + AST strip + $id dedup
│   ├── catalog-check.ts   — Tier 2/3 어휘 + axis enum + tokens 형식 + suggestion
│   ├── index.ts           — lintText / lintFile / lintAst (4 stage)
│   └── __tests__/         — 10 case
├── cli/
│   ├── spec-lint.ts       — lintFiles + formatReport + main
│   └── __tests__/         — 6 case
└── __tests__/
    └── fixtures-regression.test.ts — 28 fixture parse + lint PASS

spec/                      — 28 fixture spec.md (Tier 2 Button + composites 20 + templates 7)
studio/package.json        — peggy devDependency + spec-lint script
specs/spec-7-02-.../plan.md — peggy 채택 결정 표 갱신
```

## ✅ Definition of Done 검증

- [x] grammar 명세 — plan.md 의 EBNF + studio/src/lib/spec-md/grammar/spec-md.ts
- [x] peggy 채택 + parser 구현
- [x] AST validate 함수 (lintAst → parser 출력 → ajv)
- [x] CLI: pnpm --filter studio spec-lint <file>
- [x] 28 컴포넌트 fixture spec.md (당초 26 + Button + VariantWrapper)
- [x] 28 fixture 모두 parse + lint PASS — 회귀 테스트
- [x] 단위 테스트 — grammar 규칙별 happy + edge case 30+ 개 (실제 75 case)
- [x] 친화적 에러 메시지 (line:col + suggestion)
- [x] studio 전체 단위 테스트 회귀 0 (419 → 427)
- [x] walkthrough.md / pr_description.md ship + main PR
