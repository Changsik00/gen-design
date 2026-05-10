# ADR-005: spec.md grammar 형식 + 컴파일러 IR 형식

> **상태**: 승인 (Accepted)
> **날짜**: 2026-05-10
> **의사결정자**: Dennis
> **연관 문서**: ADR-004 (어휘 추출 + 4 layer variant), `docs/vision.md`, `backlog/phase-7.md`
> **선행 ADR**: ADR-004 (미해결 사항 #1, #2 의 결정 명문화)

## 컨텍스트

ADR-004 의 미해결 사항 5 개 중 spec-7-02 (spec.md grammar + parser) 진입 *전* 결정해야 할 2 가지:

1. **spec.md grammar 형식** — 사용자가 작성하는 spec.md 의 문법 정의
2. **컴파일러 IR 형식** — spec.md → Paper / React 변환의 중간 표현

이 결정은 phase-7 의 *모든 후속 spec* (7-02 grammar / 7-03 Paper compiler / 7-04 React compiler) 에 영향. 한 번 채택 후 변경 비용 ↑.

## 리서치 결과

### 1. spec.md grammar 후보

vision.md 에서 사용자가 표현한 형태:

```markdown
<Login>{{i18n.ko.login-input}}</Login>

<Page>
  <Section variant="form-panel">
    <LoginForm
      emailLabel={{i18n.ko.email-label}}
      submitLabel={{i18n.ko.login-submit}}
    />
  </Section>
</Page>
```

JSX-like 태그 + 이중 브레이스 placeholder. 디자이너 가독성 우선.

#### 옵션 A — Markdoc (Stripe) 직접 채택
- PEG grammar 검증된 도구. `{% Component prop="value" %}{% /Component %}` 또는 `{% callout type="x" %}` 형식.
- schema 검증 내장.
- 단점: 사용자 표현 (`<Component>`) 과 미세 어긋남. 디자이너에게 익숙하지 않을 수 있음.

#### 옵션 B — 자체 grammar (peg.js / chevrotain)
- `<Component>` JSX-like 그대로 보존.
- 사용자 표현 100% 매칭.
- 단점: 직접 작성 부담. 엣지 케이스 점진적 갱신.

#### 옵션 C — 하이브리드
- Markdoc 기반 + 자체 plugin 으로 JSX-like 추가.
- 복잡도 ↑↑.

### 2. 컴파일러 IR 후보

#### 옵션 A — 자체 JSON tree
- 본 프로젝트 어휘에 정확 fit.
- 단순, 조작 쉬움.
- 단점: 외부 framework 호환 X.

#### 옵션 B — Mitosis IR (Builder.io OSS)
- 다중 framework (React/Vue/Svelte/Solid/Qwik) 컴파일 무료.
- Builder.io 가 production 검증.
- 단점: phase-7 는 React 단일. overkill. 의존성 부담. 본 프로젝트 어휘 (i18n placeholder, theme context, tokens override) 가 Mitosis 의 표현력 안에서 자연스러운지 미증명.

#### 옵션 C — 자체 + Mitosis adapter
- 두 IR 모두 유지 + 변환 adapter.
- 복잡도 ↑↑.

## 의사결정

### D-1. spec.md grammar = **자체 grammar (옵션 B)**

- 사용자 표현 (`<Component variant="x">{{i18n.xxx}}</Component>`) 보존 우선
- peg.js 또는 chevrotain 으로 PEG grammar 정의
- 디자이너 친화 + LLM 친화 (JSX-like 는 LLM 학습 데이터 풍부)

**선택 이유**:
- vision.md 의 사용자 user story 표현이 *그 자체로* 어휘 친화도 ↑ 의 결정적 증거
- Markdoc 의 `{% %}` 는 docs 친화이지 *디자이너 spec 작성* 친화는 아님
- 4 축 어휘 정합 (vision §"4 중 어휘 정합") 의 통일성 — JSX 가 React 출력과도 표현 일치

### D-2. 컴파일러 IR = **자체 JSON tree (옵션 A)**

- phase-7 는 React + shadcn 단일 깊이
- IR 구조는 어휘 카탈로그 (catalog.json) 의 ExtractedComponent + spec.md AST 노드 와 직접 매핑
- 다중 framework 확장은 phase-8 이후 *필요 시* Mitosis adapter 추가

**선택 이유**:
- 다중 framework 너비 추구는 시장 함정 (벤치마킹 §함정 #8 — Builder/TeleportHQ 너비 추구하다 깊이 잃음)
- 본 프로젝트 차별화 = React + shadcn 깊이
- 자체 IR 가 본 프로젝트 어휘 (i18n placeholder / theme context / tokens override) 를 그대로 1:1 표현 가능
- Mitosis 채택은 v1 외부 디자이너 alpha 사용 후 *진짜 필요할 때* 결정

### D-3. 자체 grammar 의 구체적 문법 (spec-7-02 에서 명세)

본 ADR 은 *형식 채택* 결정만. 정확한 문법 (지원 노드 종류, 속성 형식, placeholder syntax) 은 spec-7-02 의 spec.md / plan.md 에서 명세.

다만 본 ADR 의 *최소 약속*:
- 컴포넌트 태그: `<ComponentName attr="value" prop={...}>...</ComponentName>` JSX-like
- self-closing 허용: `<ComponentName />`
- Placeholder: `{{i18n.<path>}}`, `{{token.<path>}}`
- 텍스트 콘텐츠: 자식 텍스트 그대로 (마크다운 마크다운 본문은 grammar 외 영역으로 보존)
- attribute 값: 문자열 (`"x"`), 숫자 (`{42}`), JSON object (`{...}`), placeholder (`{{i18n.x}}`)

### D-4. 자체 IR 의 구체적 schema (spec-7-02/03 에서 명세)

본 ADR 은 *형식 채택* 결정만. 정확한 schema (노드 종류, 속성, 부모-자식 관계) 는 spec-7-02 (parser → AST) 와 spec-7-03/04 (Paper / React 컴파일) 에서 명세.

다만 본 ADR 의 *최소 약속*:
- AST 의 모든 ComponentInstance 노드는 catalog.json 의 어휘 ground 위에 검증 가능
- spec-schema.json (catalog/spec-schema.ts) 가 본 IR 의 root validator
- 4 layer (named variant / 다축 / theme / inline tokens) 모두 IR 의 명시적 필드 (`name`, `props`, `theme`, `tokens`, `children`)

## 결과 / 영향

### 긍정

- **사용자 친화도 ↑** — vision.md 의 표현 그대로 spec.md 에 작성 가능
- **결정성 ↑** — 자체 grammar 는 우리가 100% 통제. Markdoc 의존성 갱신 추적 부담 ↓
- **단일 깊이 집중** — 다중 framework 너비 함정 회피
- **외부 IR 표준 미정착 시점에 결정 보류 가능** — Mitosis IR 도 아직 안정 표준 아님

### 부정 (정직한 단점)

- **PEG 학습 곡선** — peg.js 또는 chevrotain 직접 작성. 단 26 컴포넌트 규모는 단순 grammar 로 충분
- **다중 framework 확장이 미래에 필요해질 때** Mitosis adapter 작성 비용 — phase-8+ 평가
- **Markdoc 생태계 도구 (lint, IDE 지원) 활용 불가** — 자체 도구 개발 필요

## 위험 / 완화

| 위험 | 완화 |
|---|---|
| 자체 grammar 의 엣지 케이스 발견 → 갱신 부담 | spec-7-02 의 task 분해에 fixture 26 컴포넌트 spec.md 작성 + 모두 valid 파싱 회귀 포함. 새 케이스 발견 시 fixture 추가 + grammar 갱신 |
| Mitosis 표준 정착 시 호환성 후회 | 자체 IR 의 schema 가 ExtractedComponent + Mitosis JSXLightNode 와 *유사* 한 형태로 설계 → adapter 작성 시 변환 비용 ↓ |
| LLM 의 자체 grammar 학습 데이터 부재 | grammar 자체를 *JSX-like* 로 채택 — LLM 이 JSX 를 강하게 학습. spec.md 의 형태가 JSX 와 유사하면 자동 친화 |
| peg.js / chevrotain 둘 중 선택 | spec-7-02 에서 비교 후 결정. 단 *간단한 grammar* 라 둘 다 가능. peg.js 가 가벼움, chevrotain 이 type-safe |

## 본 ADR 이 *대답한* 질문

- ✅ spec.md 의 문법 표현은? → JSX-like 자체 grammar (사용자 표현 보존)
- ✅ 컴파일러 IR 은? → 자체 JSON tree (단일 깊이, 본 프로젝트 어휘 정확 매핑)
- ✅ Markdoc 채택 안 하는 이유? → docs 친화 ≠ 디자이너 spec 친화
- ✅ Mitosis IR 채택 안 하는 이유? → 다중 framework 너비 추구 함정 회피, phase-7 단일 깊이

## 본 ADR 이 *남긴* 질문 (spec-7-02 에서 결정)

- peg.js vs chevrotain 둘 중 어떤 PEG 도구 채택?
- attribute 값의 정확한 형식 (예: object literal `{...}` 의 JS-eval vs JSON-only)
- multi-line 텍스트 / 마크다운 본문의 grammar 처리 (raw markdown 영역 보존?)
- 에러 메시지의 사용자 친화도 (PEG 의 *어디가 잘못됐는지* 명확히)

## 변경 이력

| 일자 | 변경 | 사유 |
|---|---|---|
| 2026-05-10 | 초안 작성 + 사용자 결정 | spec-7-02 진입 직전 grammar/IR 형식 명문화 |
