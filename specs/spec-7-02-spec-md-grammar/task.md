# Task List: spec-7-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + 의존성 + AST 타입

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-7-02-spec-md-grammar`

### 1-2. 의존성 + AST 타입 정의
- [x] `pnpm --filter studio add chevrotain` — *주의*: Task 1 시점에는 plan baseline 채택. Task 2 prototype 비교 결과 peggy 로 교체됨 (chevrotain 제거 + peggy devDep 추가).
- [x] `studio/src/lib/spec-md/parser/ast-types.ts` — Document / ComponentInstance / Placeholder / MarkdownText / Comment / SourceLocation / ParseResult / ParseError / AttrValue
- [x] 단위 테스트 5 case PASS — 타입 컴파일 + 4 layer shape 검증
- [x] Commit: `chore(spec-7-02): add chevrotain dependency + AST types`

---

## Task 2: peg.js vs chevrotain 비교 prototype

- [x] 가장 단순 grammar 부분 (placeholder 만) 으로 양쪽 prototype 작성 — `studio/src/lib/spec-md/__prototype__/{chevrotain,peggy}-placeholder.ts`
- [x] error 메시지 / type-safety / 빌드 단계 비교 — peggy 에러 메시지 친화도 압승, 의존성 크기도 peggy 가 절반
- [x] *결정* 명문화: plan.md 의 비교 표 갱신 + walkthrough.md 의 결정 기록 추가 (Task 10 ship 시)
- [x] 채택 도구로 prototype 정리 (peggy 만 유지), chevrotain prototype 제거 + dependency 제거
- [x] Commit: `feat(spec-7-02): pick peggy as parser tool`

---

## Task 3: Placeholder + MarkdownText grammar

- [x] grammar 의 Placeholder 규칙 (`{{i18n.path}}` / `{{token.path}}`) 정의 + 단위 테스트 — 6 case
- [x] MarkdownText 처리 (컴포넌트 태그 외 영역) 정의 + 단위 테스트 — 4 case
- [x] Comment (`<!-- -->`) 처리 — 3 case (single + multi-line + 혼재)
- [x] Commit: `feat(spec-7-02): grammar placeholder + markdown text + comment`

---

## Task 4: ComponentTag grammar (self-closing + paired)

- [x] `<ComponentName />` self-closing — 4 case (with/without space, multi-word PascalCase, sibling)
- [x] `<ComponentName>...</ComponentName>` paired — 6 case (empty, text, placeholder, mixed)
- [x] 잘못된 닫는 태그 (예: `<A>...</B>`) 에 대한 친화적 에러 — `Mismatched closing tag: expected </A> but got </B>`
- [x] 중첩 (children) 재귀 — 3 단계 중첩 PASS
- [x] lowercase HTML (e.g. `<div>`) 는 markdown 으로 처리 (component 어휘는 PascalCase 만)
- [x] Commit: `feat(spec-7-02): grammar component tag (self-closing + paired)`

---

## Task 5: Attributes grammar (string / JSON / placeholder 값)

- [x] string literal: `attr="value"` 또는 `attr='value'` — escape 포함 5 case
- [x] JSON literal: `attr={42}`, `attr={true}`, `attr={null}` — number/bool/null 4 case
- [x] JSON object: `attr={{ "a": "b" }}` — nested 포함 3 case
- [x] JSON array: `attr={["a"]}` — 1 case
- [x] placeholder: `attr={{i18n.x}}` — i18n / token 2 case
- [x] theme / tokens 분리 저장 (L3 / L4) — `theme="brand-a"` → `c.theme`, `tokens={...}` → `c.tokens` 2 case
- [x] 4 layer 동시 + paired tag with attrs + multi-line 3 case
- [x] Commit: `feat(spec-7-02): grammar attributes (string + JSON + placeholder values)`

---

## Task 6: parser public API + SourceLocation

- [x] `studio/src/lib/spec-md/parser/index.ts` — `parse(text)`, `parseFile(path)`
- [x] 각 AST 노드에 SourceLocation (line/col/offset/length) 부착 — grammar 의 `loc()` 헬퍼
- [x] error 시 `ParseError` 클래스 — line/col + stage:"parse"
- [x] 단위 테스트: 결정성 + location 정확도 + error message 친화도 (7 case)
- [x] prototype 디렉토리 제거 (peggy 채택 + 본 API 가 대체)
- [x] Commit: `feat(spec-7-02): parser public API + source locations`

---

## Task 7: Lint 통합 — schema validate + catalog check

- [x] `studio/src/lib/spec-md/lint/schema-validate.ts` — spec-7-01 의 spec-schema.json + ajv (allErrors)
- [x] `studio/src/lib/spec-md/lint/catalog-check.ts` — catalog.json 어휘 매칭 + axis enum + tokens 형식
- [x] `studio/src/lib/spec-md/lint/index.ts` — `lintText`, `lintFile`, `lintAst` (4 단계 통합)
- [x] 단위 테스트: 유효 / 미등록 컴포넌트 + 오타 suggestion / 미등록 axis value / raw 색상 토큰 거부 / parse 실패 처리 (10 case)
- [x] Commit: `feat(spec-7-02): lint integration (schema + catalog + axis enum)`

---

## Task 8: 26 컴포넌트 fixture spec.md

- [ ] `spec/` 디렉토리 생성
- [ ] 26 컴포넌트 (composites 20 + templates 6) 의 spec.md 작성
- [ ] 각 fixture 는 *대표 variant* 포함 — vision.md 의 LoginPage 예시 같은 형식
- [ ] *주의*: fixture 가 *향후 spec-7-03/04 의 입력* — 너무 간단해도 안 되지만 너무 복잡해도 안 됨. 적정 균형 유지
- [ ] 회귀 테스트: 26 fixture 모두 parse + lint PASS
- [ ] Commit: `feat(spec-7-02): add 26-component fixture spec.md set`

---

## Task 9: CLI spec-lint

- [ ] `studio/src/lib/spec-md/cli/spec-lint.ts` — CLI entry
- [ ] `pnpm --filter studio spec-lint <file>` 스크립트
- [ ] 출력 형식: `[line:col] <severity> <message>` + 요약 (errors / warnings count)
- [ ] 단위 테스트 — child_process 로 실행하지 않고 함수 직접 호출 (스냅샷)
- [ ] Commit: `feat(spec-7-02): CLI spec-lint entry`

---

## Task 10: Ship

- [ ] `pnpm --filter studio run build` 성공
- [ ] `pnpm --filter studio test` 전체 PASS
- [ ] `pnpm --filter studio spec-lint spec/login.spec.md` (대표 fixture) 동작 확인
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit + Push + PR 생성** (spec → `phase-7-design-md`)
- [ ] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 10 |
| **예상 commit 수** | 10 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-10 |

## 위험 / 주의

- Task 2 (peg.js vs chevrotain) 결정이 빠른 prototype 으로 1~2 시간 안에 끝나야 함. 결정 후 다른 prototype 즉시 정리.
- Task 4 (ComponentTag) 의 nested 재귀 + multi-line + child markdown 혼재 grammar 의 정확도가 가장 까다로움
- Task 8 (fixture 26 개) 의 분량 — 각 fixture 5~10 분 작성 = 2~4 시간 소요. 작은 spec 부터 (ErrorIcon, HomeButton) 시작 후 큰 page (DashboardPage) 로
- markdown 본문과 컴포넌트 태그의 경계가 모호한 케이스 — *컴포넌트 태그 우선* 정책 명시 + edge case 테스트
- AST 의 `location` 필드 정확도 — 사용자 친화적 에러의 핵심. peggy/chevrotain 둘 다 location tracking 지원하지만 정확도 검증 필요
