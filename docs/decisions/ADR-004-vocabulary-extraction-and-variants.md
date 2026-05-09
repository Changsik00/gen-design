# ADR-004: shadcn-aware 어휘 카탈로그 추출 + 4 layer variant 시스템

> **상태**: 제안 (Proposed) — phase-7 alignment 승인 시 Accepted
> **날짜**: 2026-05-10
> **의사결정자**: Dennis
> **연관 문서**: `docs/vision.md`, `docs/benchmark.md`, `backlog/phase-7.md`
> **선행 ADR**: ADR-001 (phase 재구성, shadcn/Stitch/DTCG 채택), ADR-002 (token 명명), ADR-003 (Headless UI 선택)

## 컨텍스트

phase-7 의 spec-7-01 (vocabulary & formats) / spec-7-02 (spec.md grammar) 가 두 개의 *근본 결정* 을 요구한다:

1. **어휘를 어디서 가져오는가** — shadcn 컴포넌트의 variant/size/props 같은 정보. 4 축 어휘 정합 (vision §"4중 어휘 정합") 의 ground truth.
2. **variant 의 표현력은 어디까지인가** — `<Button variant="primary">` 같은 단일 명명 외에, 다축 / theme context / 인라인 토큰 override 등의 layer 들을 어디까지 spec.md grammar 에 허용할지.

이 둘이 *수동 작성* 으로 흘러가면 시장 함정 (Figma Code Connect 의 매뉴얼 매핑 비용 폭증, vision §시장 함정 #6) 을 그대로 답습한다. 한편 *너무 자유* 로 가면 4 축 어휘 정합이 깨지고 LLM 환각 표면적이 다시 늘어난다 (vision §3 차별화). 시장에 *동시 해결* 한 사례가 거의 없으므로 우리가 결정 + 구현해야 한다.

## 리서치 결과

### 1. 어휘 정보의 4 가지 path

| Path | 출처 | 정확도 | 갱신 비용 | 용도 |
|---|---|---|---|---|
| **P1** — 로컬 `.tsx` AST 추출 | `studio/src/components/ui/*.tsx` 의 `cva()` 콜 + `VariantProps<>` 타입 | ★★★ (현재 설치 버전 그대로) | 자동 (코드 변경 시 즉시 갱신) | **Tier 2** (shadcn primitives) + **Tier 3** (composites) 의 SoT |
| **P2** — shadcn registry schema (공개 API) | `https://ui.shadcn.com/schema/registry-item.json` + `https://ui.shadcn.com/r/styles/{style}/{name}.json` | ★★★ (공식 스키마) | 갱신 시 명시적 fetch | **D3 출력 형식** (registry.json 형식) 검증 |
| **P3** — shadcn MCP server | `npx shadcn@latest registry mcp` (CLI 3.0+, 2025-08 official) | ★★★ (LLM 친화) | MCP 호출 단위 | upstream 변경 detect, 외부 도구 호환 검증 |
| **P4** — ARIA 1.3 spec (정적) | W3C ARIA spec — 약 80 개 role + state | ★★★★ (표준) | 거의 없음 (spec 갱신 시) | **Tier 1** (a11y 최저층) |

**핵심 통찰**:
- shadcn 의 철학 *"files live in your repo, no forced updates"* (ADR-001 참조) 때문에 **로컬 .tsx 가 진짜 SoT**. 외부 fetch 는 *검증* 용 — 진실 공급 ❌
- `cva()` 의 `variants` 객체 키 = JS 리터럴이라 AST 추출이 *결정적*
- `VariantProps<typeof xxxVariants>` 타입은 TypeScript compiler API 로 *명시적* 추출 가능

### 2. variant 의 4 layer

cva 자체가 *다축 variant* 를 지원하므로 spec.md grammar 도 4 layer 자연 매핑 가능:

#### Layer 1 — 명명된 단일 variant
```jsx
<Button variant="primary">
```
- shadcn 의 디폴트 패턴
- 어휘 카탈로그에 등록된 이름만 허용 (lint)

#### Layer 2 — 다축 sub-variant
```jsx
<Button variant="primary" size="lg" tone="muted">
//                        ↑ shadcn axis    ↑ 우리가 추가한 axis
```
- shadcn Button 은 이미 `variant + size` 2 축
- 추가 axis (tone, emphasis 등) 는 cva.variants 에 등록만 하면 자동 카탈로그화

#### Layer 3 — theme context
```jsx
<Section theme="brand-b">
  <Button variant="primary">  {/* primary 가 brand-b 의 primary */}
</Section>
```
- phase-6 의 brand-b token 파일 + `.brand-b` CSS 클래스와 동일 메커니즘
- *Section / Page 단위* CSS variables 일괄 전환

#### Layer 4 — 인라인 토큰 override
```jsx
<Button variant="primary" tokens={{ "--primary": "{{token.semantic.brand-2}}" }}>
```
- 개별 인스턴스의 색만 override
- *raw 색상값 금지* — token 참조만 허용 (lint)
- 주석 lint: "이 패턴이 반복되면 새 variant 등록 권고"

### 3. "primary-color 가 X 인 button" 같은 사용자 표현의 매핑

자유 표현 → 4 layer 어디로 매핑할지:

| 케이스 | 권장 path | 이유 |
|---|---|---|
| 디자인 시스템에 *반복 사용* 되는 색 변형 | Layer 1 — 새 variant 등록 (`brand-cta`) | 한 번 등록 → 어휘 풍부, 재사용 |
| *섹션 / 페이지* 단위 팔레트 전환 (multi-brand) | Layer 3 — theme context | 일관성 ↑, 부모-자식 전부 자동 |
| 같은 컴포넌트의 *체계적 변형* 축 추가 | Layer 2 — sub-variant axis | cva 의 자연 매핑 |
| *예외적 1 회성* 색 변경 | Layer 4 — 인라인 override (lint 경고) | 허용은 하되 권장 X |

추천: **Layer 1 + Layer 3 조합이 디폴트**. Layer 4 는 *허용 + 경고* (변환 권고). Layer 2 는 *cva 다축이 자연스러울 때*.

## 의사결정

### D-1. 어휘 카탈로그의 ground truth = **로컬 .tsx (P1)**

- shadcn 채택 시 코드가 codebase 에 들어옴 → *codebase 자체* 가 SoT
- 외부 fetch (P2/P3) 는 *검증 + 외부 호환* 용
- 정적 enum (P4) 은 ARIA 만

### D-2. 추출 파이프라인 (자동, 수동 0)

```
[입력]
  studio/src/components/ui/*.tsx
  studio/src/components/composites/*.tsx
  studio/src/components/templates/*.tsx
  ARIA 1.3 spec JSON (정적)

[추출기]
  1) TypeScript compiler API 로 .tsx 의 AST 파싱
  2) cva() 콜 recognize → variants 객체의 모든 axis + value 추출
  3) component props interface 추출 (VariantProps + 추가 props)
  4) ARIA spec → 정적 JSON 그대로 사용
  ─→ Tier 1/2/3 카탈로그 JSON 생성 (자동)

[렌더]
  5) 카탈로그 JSON → FRONT.md 자동 생성 (handlebars 템플릿)
  6) 카탈로그 JSON → JSON Schema 생성 (spec.md lint 의 ground)

[검증]
  7) shadcn MCP query → upstream 변경 detect → diff 알림
  8) 카탈로그 ↔ 실 코드 회귀 lint (CI)
```

수동 작성: **0**. 모든 변경이 *코드 → 카탈로그 → FRONT.md → spec.md lint* 단방향 자동 흐름.

### D-3. spec.md grammar 의 variant 표현 = **4 layer 모두 지원**

| Layer | 허용? | lint 동작 |
|---|---|---|
| L1 — 명명된 variant | ✅ | 등록 외 이름 → ERROR |
| L2 — 다축 sub-variant | ✅ | cva 등록 외 axis/value → ERROR |
| L3 — theme context | ✅ | 등록 외 theme 이름 → ERROR. nesting 정책 명시 (D-5) |
| L4 — 인라인 토큰 override | ✅ (raw 값 금지) | raw hex/rgb 사용 → ERROR. 토큰 참조 외 → ERROR. 반복 사용 시 WARN ("새 variant 등록 권고") |

### D-4. spec.md 안 *raw 값 금지* lint

- ❌ `<Button color="#FF0000">` (hex)
- ❌ `<Button color="rgb(255,0,0)">` (rgb)
- ❌ `<Button className="bg-red-500">` (Tailwind 직접 — 어휘 우회)
- ❌ `<Button style={{color: "red"}}>` (인라인 CSS)
- ✅ `<Button variant="destructive">` (등록된 variant)
- ✅ `<Button tokens={{"--primary": "{{token.semantic.brand-2}}"}}>` (토큰 참조 override)

이게 *4 축 어휘 정합* 약속을 grammar 차원에서 강제.

### D-5. 미해결 정책 — 본 ADR 안에서 *지금* 결정

다음 4 가지는 본 ADR 의 부록으로 결정 명시:

#### D-5-a. theme nesting
- **결정**: 단일 level 만 허용. nested theme override 금지
- **이유**: 결정성 ↑, 디자이너 mental model 단순. 필요 시 추후 갱신 ADR
- **lint**: `<Section theme="A"><Section theme="B">` → ERROR

#### D-5-b. multi-axis combinatorial 폭증
- **결정**: 카탈로그는 *축 + 값 enum* 만 등재. *조합* 까지 enum 하지 않음
- **이유**: 폭증 회피, cva 의 자연스러운 cross-product 맡김
- **lint**: 각 axis 의 value 가 등록된 enum 안에 있는지만 검증

#### D-5-c. 인라인 토큰 override 의 scope
- **결정**: 해당 컴포넌트 인스턴스만 (자식까지 ❌). CSS scoped data-attribute + style attr 패턴
- **이유**: 부모 theme context (Layer 3) 와 의미 분리, debugging ↑
- **구현**: 컴파일러가 `data-token-override` attr + scoped CSS 생성

#### D-5-d. 새 variant 등재의 friction
- **결정**: Studio UI 안에 *카탈로그 등록 마법사*
  - 디자이너가 "새 variant 추가" 클릭 → 이름 + base variant 선택 + 토큰 차이 입력 → cva.variants 자동 갱신 PR
- **이유**: 디자이너 자유도 보존 + 카탈로그 일관성 보장
- **구현**: phase-7 spec-7-07 (Studio reframe) 에 흡수

### D-6. shadcn registry 출력과의 정합 (D3 결정)

본 프로젝트의 컴파일러 출력 (spec-7-04 React compiler) 은 *shadcn registry-item.json 형식 그대로*. 따라서:
- 우리 composites/templates 가 그대로 외부에 install 가능
- v0/Cursor/21st.dev/Claude Code 모두 호환
- registry 의 `dependencies` / `registryDependencies` 자동 계산 (composite 가 어떤 ui primitive 의존하는지 AST 분석)

## 구현 계획 (high-level)

phase-7 의 spec-7-01 (vocabulary & formats) 의 task 분해:

```
[T1] shadcn registry-item.json 검증기 추가 (ajv + 공개 schema)
[T2] cva AST 추출기 작성 (TypeScript compiler API)
     - cva() 콜 식별 + variants 객체 walk
     - VariantProps<typeof xxx> 타입 추출
[T3] ARIA 1.3 정적 JSON 추가 (Tier 1)
[T4] ui/ 자동 스캔 → Tier 2 카탈로그 JSON 생성
[T5] composites/ + templates/ 스캔 → Tier 3 카탈로그 JSON 생성
[T6] 카탈로그 → FRONT.md 자동 렌더
[T7] 카탈로그 → JSON Schema 생성 (spec.md lint 의 ground)
[T8] 회귀 테스트 — 카탈로그 ↔ 실 코드 일치 lint (CI)
[T9] (선택) shadcn MCP 비교기 — upstream 변경 알림
```

phase-7 spec-7-02 (grammar) 의 task 분해:

```
[T1] PEG grammar 또는 Markdoc 채택 결정
[T2] 4 layer 표현 grammar 정의
[T3] raw 값 금지 lint (D-4)
[T4] theme nesting / inline override scope 검증 (D-5-a, D-5-c)
[T5] axis enum 검증 (D-5-b)
[T6] 26 컴포넌트 spec.md fixture 작성 + 모두 valid 파싱 회귀
```

phase-7 spec-7-04 (React compiler) 영향:

```
- spec.md AST → shadcn registry-item.json 형식 출력 (D-6)
- Layer 4 인라인 override → scoped CSS data-attribute 패턴 (D-5-c)
- registry dependencies 자동 계산
```

phase-7 spec-7-07 (Studio reframe) 영향:

```
- 카탈로그 등록 마법사 UI (D-5-d)
- 디자이너 친화 friction-free 흐름
```

## 결과 / 영향

### 긍정 (vision 의 *real & defensible* 차별화 강화)

- **수동 매핑 비용 0** — Figma Code Connect 함정 (vision §시장 함정 #6) 회피
- **버전 drift 자동 감지** — shadcn upstream 새 variant 추가 시 detect
- **codebase 가 SoT** — 외부 fetch 의존 ❌, vendor lock-in 회피
- **4 축 어휘 정합 강제** — grammar lint 가 raw 값 + 미등록 어휘 차단 → LLM 환각 표면적 ↓ (vision §차별화 #5 의 핵심 가설 진짜로 검증 가능)
- **시장 표준 호환** — shadcn registry-item.json 출력으로 v0/Cursor/21st.dev 직접 호환
- **phase-6 자산 살아남** — paper-normalizer / paper-sync / paper-e2e 모두 컴파일러의 building block (회고 C2 완전 해소)

### 부정 (정직한 단점)

- **cva 외 패턴 지원 어려움** — `data-state` attribute, render prop, slot pattern 등 일부 shadcn 컴포넌트 패턴은 cva AST 만으로 추출 불가. 추출기에 plugin 메커니즘 필요할 수 있음
- **shadcn 변경 추종 부담** — shadcn v4 → v5 전환 시 cva 패턴이 바뀌면 추출기 갱신
- **TypeScript compiler API 학습 비용** — 추출기 구현이 단순 regex 가 아닌 *real AST* 다루기. 디버깅 난이도 ↑

## 위험 / 완화

| 위험 | 완화 |
|---|---|
| cva AST 추출이 일부 컴포넌트 (예: 동적으로 variants 합성) 에서 실패 | 추출기에 *fallback* — 추출 실패 시 *수동 등재 trigger*. 수동 등재 비율을 회귀 metric 으로 측정 (목표 < 5%) |
| shadcn 가 cva 외 새 패턴 (예: tw-variants, tailwind-variants) 으로 전환 | 추출기 *plugin 가능* 설계. shadcn 새 패턴 채택 시 plugin 추가만으로 흡수 |
| 다축 variant 의 cross-product 폭증 — UI 상 표현 한계 | FRONT.md 의 *축 만* 표시 + 조합은 example 페이지 별도 |
| 인라인 토큰 override 가 *과사용* 됨 | lint 경고 + Studio 가 frequency 추적 → 자주 등장하는 패턴은 *마법사로 등재 권고* |
| theme nesting 금지가 multi-brand 조합 시 답답 | 단일 level 의 *theme switch* 자체는 자유 — 페이지 / 섹션 단위 다른 theme 가능. 진짜 nested 가 필요한 시점에 갱신 ADR |

## 미해결 사항 (phase-7 진행 중 결정)

| # | 사항 | 결정 시점 |
|:--:|---|---|
| 1 | spec.md grammar 의 *PEG 자체 작성* vs *Markdoc 직접 채택* | spec-7-02 시작 시 |
| 2 | 컴파일러 IR 형식 — *자체 JSON tree* vs *Mitosis IR (Builder OSS)* 채택 | spec-7-02 / 7-03 결정 시 |
| 3 | 추출기의 cva 외 plugin 인터페이스 설계 (slot/render-prop 패턴) | spec-7-01 후반부 (실 코드에서 한계 발견 시) |
| 4 | shadcn MCP 비교기를 spec-7-01 안에 포함 vs phase-8 spec-x | spec-7-01 task 우선순위 평가 시 |
| 5 | 카탈로그 등재 마법사의 UX 상세 (어떤 metadata 까지 입력) | spec-7-07 (Studio reframe) 설계 시 |

## 본 ADR 이 *대답한* 질문 (미래 검증용)

- ✅ shadcn variant 정보를 어디서 가져오나? → 로컬 .tsx 의 cva AST + VariantProps 타입. 외부 fetch 는 검증용
- ✅ 어떻게 자동화하나? → TypeScript compiler API 로 AST 파싱 + 정적 ARIA + JSON Schema 자동 생성
- ✅ variant 표현력은? → 4 layer (명명 / 다축 / theme / 인라인 토큰 override) 모두 허용 + raw 값 금지 lint
- ✅ "primary-color 가 X 인 button" 같은 자유 표현은? → 반복 → 새 variant 등록 / 섹션 단위 → theme / 1 회성 → 인라인 토큰 override
- ✅ shadcn registry 와의 정합? → 컴파일러 출력 = registry-item.json 형식 그대로
- ✅ Tier 1 (ARIA) 가 필요한 이유? → a11y 자동 정합 + 컴포넌트 어휘의 의미 ground

## 변경 이력

| 일자 | 변경 | 사유 |
|---|---|---|
| 2026-05-10 | 초안 작성 | phase-7 alignment 직전 — vision.md / benchmark.md / phase-7.md 의 어휘/grammar 결정 명문화 |
