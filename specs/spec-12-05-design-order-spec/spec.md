# spec-12-05: 디자인 주문 명세 (design-order-spec)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-12-05` |
| **Phase** | `phase-12` |
| **Branch** | `spec-12-05-design-order-spec` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gd react <slug>` 는 `chat.md`(Narrative + Structure + History) 를 읽어 React TSX 를 컴파일한다.
Structure 섹션은 *어휘(컴포넌트 트리)* 만 기술하고, **실행에 필요한 구현 명세** — form validation 규칙, button 동작 타깃, 데이터 fetch endpoint — 는 포함하지 않는다.

현재 이 정보는 `decisions.md` 에 자연어로 흩어져 있고, `gd react` 는 이를 읽지 않는다. 결과: 에이전트가 매 씬마다 같은 zod schema / API 호출 코드를 반복 작성 → **반복 코드** + **일관성 결여**.

### 문제점

1. **반복 코드**: `z.object({email: z.string().email(), password: z.string().min(8)})` 이 login / settings 에 각각 손으로 작성됨.
2. **일관성 결여**: 에이전트 재량으로 API endpoint 명명 방식이 씬마다 달라짐.
3. **재사용 결정 미반영**: §5.6/§5.7 결정(decisions.md)이 컴파일 단계에서 무시됨 — chat.md Structure 가 "login 기반 확장"이라고 해도 TSX 는 그걸 반영하지 않음.

### 해결 방안 (요약)

씬마다 `<slug>.order.md` 파일(디자인 주문 명세)을 도입한다. YAML frontmatter 에 validation 규칙·button 액션·데이터 fetch 를 기술하면, `gd react` 가 이를 읽어 **zod schema + react-hook-form binding + API 호출 boilerplate** 를 자동 생성한다. chat.md grammar 는 건드리지 않고 `.order.md` 파서만 신규 추가한다.

## 📊 개념도

```
┌─────────────────┐   ┌──────────────────┐
│  login.chat.md  │   │ login.order.md   │
│  (어휘 트리)     │   │ (구현 명세)       │
│                 │   │ validation:      │
│ <Card>          │   │   email: [req,   │
│   <Form>        │   │     email()]     │
│     <Input      │   │   password: [    │
│      type=email │   │     req, min(8)] │
│     />          │   │ actions:         │
│   </Form>       │   │   submit:        │
│ </Card>         │   │     POST /auth   │
└────────┬────────┘   └───────┬──────────┘
         │                   │
         └─────────┬─────────┘
                   │ gd react login
         ┌─────────▼─────────┐
         │  LoginScene.tsx   │
         │                   │
         │ const schema = z  │
         │   .object({...})  │
         │ const form = use  │
         │   Form({schema})  │
         │ async onSubmit()  │
         │   fetch(POST /auth│
         │ return <Card>...  │
         └───────────────────┘
```

## 🎯 요구사항

### Functional Requirements

1. **`.order.md` 포맷 정의** — YAML frontmatter + 선택적 markdown 섹션으로 구성:
   - `validation`: 필드별 zod 규칙 (`required`, `email()`, `min(N)`, `oneOf(field)`)
   - `actions`: 버튼별 액션 (`form-submit: "METHOD /endpoint"` 또는 `nav: "/route"`)
   - `data`: 데이터 fetch (`useQuery: "key → GET /endpoint"`)
   - `composites`: 재사용 composite 지정 (`- StatCard` 등)

2. **`order.md` 파서** — `packages/gd-cli/src/commands/order.ts`:
   - `parseOrderFile(path): OrderSpec | null` — 파일 없으면 null (optional)
   - `validateOrderSpec(spec): ValidationError[]` — 필드 타입 검증

3. **`gd react` 통합** — `gd react <slug>` 가 `<chatRoot>/scenes/<slug>.order.md` 자동 탐지:
   - `.order.md` 없으면 기존 동작 (변경 없음, 하위 호환)
   - `.order.md` 있으면 컴파일 결과에 **zod schema + useForm binding** 주입

4. **TSX 생성 내용** (`.order.md` 있을 때):
   - `import { z } from "zod"` + `import { useForm } from "react-hook-form"` + `import { zodResolver } from "@hookform/resolvers/zod"`
   - `const schema = z.object({...})` (validation 필드 매핑)
   - `const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })`
   - Form 의 `onSubmit` → `fetch("METHOD /endpoint", {...})` (actions.submit 매핑)

5. **gd-chat.md §5.8 추가** — conversation 마지막에 `.order.md` 자동 생성 가이드:
   - §5.5 checklist 모두 완료 후 에이전트가 `.order.md` draft 제안
   - decisions.md 의 validation + button 의도 결정을 `.order.md` 로 옮김

6. **v5 시뮬레이션** — `experiments/dogfood-alpha-v5` 에서:
   - `login.order.md` 작성 → `gd react login` → zod schema 포함 TSX 확인

### Non-Functional Requirements

1. **하위 호환**: `.order.md` 없는 기존 씬은 영향 없음 (`gd react` 기존 동작 유지)
2. **TDD**: 파서 + 컴파일러 주입 모두 단위 테스트 PASS 후 구현
3. **한국어 에러 메시지**: 파서 오류는 기존 doctor/tokens 스타일과 동일한 한국어

## 🚫 Out of Scope

- routing 자동 주입 (`react-router` / `next/link` — spec-12-06 이후)
- composite 자동 추출 (StatCard → phase-13 이후)
- `.order.md` → decisions.md 자동 역방향 동기화
- order spec 으로부터 API 타입 생성 (TypeScript interface)
- Figma / Paper annotation 과 연동

## 📑 ADR 후보 (Architecture Decision Records)

> 본 SPEC 의 결정 중 *장기 자산* 으로 박을 가치 있는 것이 있는가?

- [x] ADR 가치 있는 결정 있음 → 후보: `adr-order-md-separate-file` (type: decision) — chat.md §Order 섹션 vs 별도 `.order.md` 파일 선택 근거

## ✅ Definition of Done

- [ ] `packages/gd-cli/src/commands/order.ts` — parseOrderFile + validateOrderSpec 구현
- [ ] `order-args.test.ts` + `order-runtime.test.ts` PASS
- [ ] `gd react` 가 `.order.md` 자동 탐지 + zod schema / useForm 주입 동작
- [ ] `gd-chat.md` §5.8 추가 (`.order.md` draft 생성 가이드)
- [ ] v5 시뮬 — `login.order.md` + `gd react login` → zod schema 포함 TSX 확인
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-12-05-design-order-spec` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
