# spec-7-02: spec.md grammar + parser + lint + CLI

phase-7 의 foundation spec — 후속 7-03 (Paper compiler) / 7-04 (React compiler) 의 입력 형식 (AST) 정의.

## Summary

- ADR-005 D-1 (자체 JSX-like grammar) + D-2 (자체 JSON tree IR) 구현
- **peggy** 채택 (Task 2 chevrotain 비교 후 — 친화적 에러 메시지 + AST 직접 매핑 + PEG lookahead 가 markdown 처리에 자연스러움)
- 4-stage lint: parse → schema → catalog → axis, 친화적 에러 (line:col + 오타 suggestion)
- 28 컴포넌트 fixture (`spec/`) — 후속 spec-7-03/04 의 입력
- CLI: `pnpm --filter studio spec-lint <file...>`

## 결정 기록

### parser 도구: peggy (chevrotain 대신)

| 차원 | peggy | chevrotain | 결정 |
|---|---|---|---|
| 에러 메시지 | `Expected "i18n" or "token" but "x" found` | `[I18n] [Token] but found 'xxx'` (내부 토큰명) | **peggy** |
| AST 매핑 | grammar 안 직접 반환 | CST → visitor 추가 | **peggy** |
| 의존성 크기 | ~75KB | ~150KB | **peggy** |
| markdown lookahead | PEG 가 자연스러움 | lexer mode 까다로움 | **peggy** |
| Type-safety | 약함 (캐스팅) | TS class | chevrotain |

**채택 근거**: 디자이너 직접 편집 → 친화적 에러가 핵심 가치 (FR-3 + NFR-3).

### 4 layer 분리 저장

grammar 의 attribute 파싱이 ADR-005 D-2 의 IR 와 직접 매핑:
- L1/L2 → `ComponentInstance.props`
- L3 (theme context) → `ComponentInstance.theme`
- L4 (인라인 토큰 override) → `ComponentInstance.tokens`

## 산출물

```
studio/src/lib/spec-md/
├── grammar/    spec-md.ts (peggy grammar) + index.ts
├── parser/     ast-types.ts + index.ts (parse / parseFile)
├── lint/       schema-validate + catalog-check + index (4-stage)
├── cli/        spec-lint.ts (lintFiles + formatReport)
└── __tests__/  fixtures-regression (28 fixture)

spec/          28 fixture spec.md (Tier 2 Button + composites 20 + templates 7)
```

## 테스트 (75 case 신규)

| 영역 | case |
|---|---|
| AST 타입 컴파일 | 5 |
| Placeholder grammar | 6 |
| MarkdownText / Comment | 8 |
| ComponentTag (self-closing + paired + nested + mismatched) | 13 |
| Attributes (string / JSON / placeholder / theme / tokens) | 19 |
| Parser public API (envelope / 결정성 / SourceLocation) | 7 |
| Lint integration (4 stage) | 10 |
| CLI (lintFiles + formatReport) | 6 |
| 28 fixture 회귀 | 2 (PASS / 갯수) |

**누적**: 419 → 427 (+8 net, 신규 단일 파일들 통합 후).

## Test plan

- [x] `pnpm --filter studio test` — 65 files / 427 tests PASS
- [x] `pnpm --filter studio run build` — TypeScript + Vite 통과
- [x] `pnpm --filter studio spec-lint <fixture>` — 동작 확인 (login-page / dashboard-page / button)
- [x] 28 fixture 회귀 테스트 — 모두 parse + lint PASS

## 후속

- **spec-7-03**: Paper compiler — 본 spec 의 AST → Paper 노드
- **spec-7-04**: React compiler — 본 spec 의 AST → registry-item.json (shadcn)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
