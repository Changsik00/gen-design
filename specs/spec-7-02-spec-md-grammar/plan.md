# Implementation Plan: spec-7-02

## 📋 Branch Strategy

- 신규 브랜치: `spec-7-02-spec-md-grammar`
- 시작 지점: `phase-7-design-md` (phase base)

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **Foundation spec** — 후속 spec-7-03 / 7-04 가 본 spec 의 parser 출력을 입력으로 사용
> - [ ] ADR-005 D-1 (자체 grammar JSX-like) + D-2 (자체 JSON tree IR) 그대로 구현
> - [ ] peg.js 와 chevrotain 둘 중 *grammar 작성 단순성* 우선으로 peg.js 후보. chevrotain 은 type-safe + better error → 비교 후 결정 (Task 2)
> - [ ] grammar 의 *마크다운 본문* 처리: 컴포넌트 태그 외 영역은 raw text 보존 (parser 가 컴포넌트 트리만 추출)

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```
[입력] spec.md
  <Login>{{i18n.ko.login-input}}</Login>
  ...

[파싱 단계 — 본 spec]
  studio/src/lib/spec-md/grammar.pegjs (또는 chevrotain class)
    → parse(text) → SpecMdAst
  
  [SpecMdAst] (자체 JSON tree, ADR-005 D-2)
  {
    type: "Document",
    body: [
      { type: "Markdown", text: "..." },
      {
        type: "ComponentInstance",
        name: "Login",
        props: {},
        tokens: {},
        theme: undefined,
        children: [{ type: "Placeholder", kind: "i18n", path: "ko.login-input" }],
        location: { line: 3, col: 1 }
      },
      ...
    ]
  }

[lint 단계 — 본 spec]
  AST → ajv (spec-schema.json) → 컴포넌트 어휘 검증
  AST → catalog.json 매칭 → axis enum 검증
  → ParseResult { ok: boolean, ast?, errors: [{line, col, message}] }

[다음 spec — out of scope]
  AST → spec-7-03 (Paper compiler)
  AST → spec-7-04 (React compiler)
```

### grammar 의 EBNF 개요

```ebnf
Document        = ( ComponentTag | Placeholder | MarkdownText | Comment )*
ComponentTag    = "<" Identifier Attributes? ( "/>" | ">" Document "</" Identifier ">" )
Attributes      = ( Identifier "=" AttributeValue )*
AttributeValue  = StringLiteral | "{" JsonValue "}" | Placeholder
StringLiteral   = '"' [^"]* '"' | "'" [^']* "'"
JsonValue       = JSON 표준 (number / boolean / null / object / array / string)
Placeholder     = "{{" PlaceholderKind "." PathSegments "}}"
PlaceholderKind = "i18n" | "token"
PathSegments    = Identifier ( "." Identifier )*
Comment         = "<!--" .* "-->"
MarkdownText    = ~( ComponentTag | Placeholder | Comment ) .*  /* lookahead-bounded */
```

### 라이브러리 위치

```
studio/src/lib/spec-md/
├── grammar/
│   ├── spec-md.pegjs         — peg.js grammar (또는 chevrotain class)
│   └── compiled.ts            — peggy 빌드 산출물 (또는 chevrotain instance)
├── parser/
│   ├── index.ts               — public API (parse, parseFile)
│   └── ast-types.ts           — SpecMdAst 타입 정의
├── lint/
│   ├── index.ts               — public API (lintAst, lintFile)
│   ├── schema-validate.ts     — spec-schema.json ajv 통합
│   └── catalog-check.ts       — catalog.json 어휘 매칭 (axis enum)
├── cli/
│   └── spec-lint.ts           — CLI entry (pnpm spec-lint <file>)
└── __tests__/
    ├── parser/
    │   ├── grammar-rules.test.ts  — grammar 규칙별 happy + edge case
    │   ├── placeholder.test.ts
    │   ├── attributes.test.ts
    │   └── error-recovery.test.ts
    ├── lint/
    │   └── catalog-check.test.ts
    └── fixtures/
        ├── login.spec.md
        ├── dashboard.spec.md
        ...
        (26 컴포넌트 fixture)
```

### peg.js vs chevrotain 비교 (Task 2 에서 결정)

| 차원 | peg.js | chevrotain |
|---|---|---|
| 학습 곡선 | 낮음 | 중간 |
| Type-safety | 약함 (.pegjs 파일) | 강함 (TypeScript class) |
| 에러 메시지 | 기본 | 친화적 (built-in) |
| 빌드 | peggy CLI 또는 런타임 컴파일 | TypeScript 직접 |
| 의존성 크기 | 작음 | 중간 |
| 본 프로젝트 적합도 | 단순 grammar 라 충분 | type-safe AST 가 IR 와 자연 맵핑 |

**기본 채택**: chevrotain (type-safe + 더 좋은 에러). Task 2 에서 prototype 후 최종 결정.

### SpecMdAst 타입 (ADR-005 D-4 에서 약속한 *최소* 정의)

```typescript
interface Document {
  type: "Document";
  body: Block[];
}

type Block = ComponentInstance | Placeholder | MarkdownText | Comment;

interface ComponentInstance {
  type: "ComponentInstance";
  name: string;            // <Component>의 ComponentName
  props: Record<string, AttrValue>;
  tokens?: Record<string, string>;  // L4 인라인 토큰 override (token reference 만)
  theme?: string;          // L3 theme context
  children: Block[];
  location: SourceLocation;
}

interface Placeholder {
  type: "Placeholder";
  kind: "i18n" | "token";
  path: string;            // "ko.login-input" 등
  location: SourceLocation;
}

type AttrValue = string | number | boolean | null | object | Placeholder;

interface MarkdownText { type: "MarkdownText"; text: string; location: SourceLocation; }
interface Comment      { type: "Comment"; text: string; location: SourceLocation; }
interface SourceLocation { line: number; col: number; offset: number; length: number; }
```

### lint 의 4 단계

1. **Parse 성공** — grammar 매칭 실패 시 즉시 ERROR
2. **Schema validate** — ajv 로 spec-7-01 의 spec-schema.json 매칭
3. **Catalog check** — 각 ComponentInstance.name 이 catalog.json 에 있는지
4. **Axis enum check** — props 의 axis 별 value 가 cva enum 에 있는지

각 단계 별 친화적 에러 메시지 + line/col 정보.

## 📂 Proposed Changes

### [NEW] `studio/src/lib/spec-md/`
전체 라이브러리 — grammar/parser/lint/cli + tests/fixtures

### [NEW] `spec/` 디렉토리 (프로젝트 root)
26 컴포넌트 + 페이지 fixture spec.md 들. 향후 디자이너의 진짜 spec 위치도 됨.

### [MODIFIED] `studio/package.json`
peggy 또는 chevrotain 의존성 추가 + `spec-lint` 스크립트.

### [MODIFIED] `templates/FRONT.md` (가능성)
spec.md 의 grammar 예제 + placeholder 사용법 명시 — Task 11 의 일부로 자동 갱신.

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
- [ ] (실행 후) main PR (spec → phase-7-design-md)
