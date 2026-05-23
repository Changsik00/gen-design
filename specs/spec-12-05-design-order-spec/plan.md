# Implementation Plan: spec-12-05

## 📋 Branch Strategy

- 신규 브랜치: `spec-12-05-design-order-spec`
- 시작 지점: `phase-12-conversation-depth-and-orchestration` (phase base branch 모드)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [x] **`.order.md` 위치**: 별도 파일 (`<slug>.order.md`) 선택 — chat.md grammar 변경 없음, 하위 호환 유지
> - [x] **주입 전략**: 기존 `compileToReact` 건드리지 않음 → `compileSceneWithOrder` 래퍼 신규 추가

> [!WARNING]
> - [x] `react-hook-form` + `@hookform/resolvers` + `zod` 를 preset devDependency 로 추가해야 TSX 가 실행 가능 — 이미 dogfood v5 에 포함되어 있어 breaking 없음

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```
.order.md (YAML frontmatter)
         │
         │ parseOrderFile()
         ▼
    OrderSpec (object)
    ├── validation: { field: ZodRule[] }
    ├── actions: { id: ActionSpec }
    └── data: DataSpec[]
         │
         │ generateOrderTsx()
         ▼
    OrderTsxChunks
    ├── imports: string          (zod, useForm, zodResolver)
    ├── schemaDecl: string       (const schema = z.object({...}))
    ├── formInit: string         (const form = useForm({...}))
    └── onSubmit: string         (async onSubmit(values) { fetch(...) })
         │
         ┌────────────────┘
         │ compileSceneWithOrder()
         │   1. compileScene() → TSX string
         │   2. inject OrderTsxChunks → augmented TSX
         ▼
    LoginScene.tsx (with zod + useForm)
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **파일 위치** | 별도 `<slug>.order.md` | chat.md grammar 변경 없음, 디자이너 / 개발자 역할 분리 |
| **주입 방법** | post-process TSX 문자열 | compileToReact 기존 시그니처 + 테스트 무손상 |
| **zod 규칙 문법** | 문자열 배열 (`[required, email, min(8)]`) | 선언적, YAML-safe, 파서 구현 단순 |
| **gd-chat §5.8** | 기존 §5.7 다음 삽입, checklist 미추가 | 대화 흐름 후반 자연 유도 (강제 X) |

### 📑 ADR 후보

- [x] ADR 가치 있는 결정 있음 → 후보: `adr-012-order-md-separate-file` (type: decision) — chat.md §Order 섹션 vs 별도 파일

## 📂 Proposed Changes

### 1. `.order.md` 파서 (신규)

#### [NEW] `packages/gd-cli/src/commands/order.ts`

목적: `.order.md` YAML frontmatter 파싱 + OrderSpec → TSX 코드 청크 생성.

```typescript
export interface ZodRule {
  kind: "required" | "email" | "min" | "max" | "url" | "oneOf";
  arg?: string | number;   // min(8) → arg: 8
}

export interface ActionSpec {
  type: "form-submit" | "nav" | "modal" | "mutation";
  target: string;          // "POST /auth/login" 또는 "/signup"
}

export interface DataSpec {
  queryKey: string;
  endpoint: string;        // "GET /tasks"
}

export interface OrderSpec {
  scene: string;
  validation?: Record<string, ZodRule[]>;
  actions?: Record<string, ActionSpec>;
  data?: DataSpec[];
}

export function parseOrderFile(path: string): OrderSpec | null
export function validateOrderSpec(spec: OrderSpec): string[]    // 오류 메시지 배열
export function generateOrderTsx(spec: OrderSpec): OrderTsxChunks
```

`.order.md` 포맷 예시:
```yaml
---
scene: login
validation:
  email:
    - required
    - email
  password:
    - required
    - min(8)
actions:
  submit:
    type: form-submit
    target: POST /auth/login
  signup-link:
    type: nav
    target: /signup
---
```

#### [NEW] `packages/gd-cli/src/commands/__tests__/order-args.test.ts`

parseOrderFile + validateOrderSpec 단위 테스트 (12 케이스):
- 유효한 .order.md 파싱
- validation 규칙 매핑 (required / email / min / max)
- actions 매핑 (form-submit / nav)
- data fetch 매핑
- 파일 없음 → null
- 오류 필드 감지 (validateOrderSpec)

#### [NEW] `packages/gd-cli/src/commands/__tests__/order-runtime.test.ts`

generateOrderTsx + compileSceneWithOrder 통합 테스트 (10 케이스):
- zod schema 생성 (`z.string().email()` 등)
- useForm binding 생성
- onSubmit fetch 생성 (POST endpoint)
- nav action → import React Router / next/link 미생성 (scope 외)
- `.order.md` 없는 씬 → 기존 TSX 동일

### 2. `gd react` 통합 (수정)

#### [MODIFY] `packages/gd-cli/src/commands/react.ts`

```typescript
// 기존: compileScene(slug, opts)
// 변경: compileSceneWithOrder(slug, opts) — order.ts 에서 import
```

- `compileSceneWithOrder()` — compileScene + parseOrderFile 결합 래퍼
  - `<chatRoot>/scenes/<slug>.order.md` 탐지
  - 있으면 OrderSpec 파싱 → generateOrderTsx → TSX 에 주입
  - 없으면 기존 compileScene 결과 그대로

### 3. `gd-chat.md` §5.8 추가 (수정)

#### [MODIFY] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md`

§5.7 (토큰 재사용 결정) 다음에 §5.8 삽입:
- 트리거: §5.5 checklist 완료 직후 (compile 직전)
- 내용: decisions.md 의 validation + button 의도를 `.order.md` draft 로 변환 제안
- 에이전트가 `<slug>.order.md` 파일 직접 작성 (사용자 확인 후)

### 4. v5 시뮬레이션 (신규)

#### [NEW] `experiments/dogfood-alpha-v5/chats/scenes/login.order.md`

기존 login.chat.md 에 대응하는 주문 명세:
- validation: email + password
- actions: submit (POST /auth/login), signup-link (nav /signup)

#### [NEW] `experiments/dogfood-alpha-v5/transcripts/scene-6-order.md`

시뮬레이션 트랜스크립트:
- §5.8 flow: conversation 끝 → agent 가 .order.md draft 제안 → 사용자 확인
- `gd react login` → zod schema + useForm binding 포함 TSX 출력 확인

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)
```bash
cd packages/gd-cli && pnpm test
```

대상: `order-args.test.ts` (12 케이스) + `order-runtime.test.ts` (10 케이스)

### 통합 테스트

```bash
# v5 dogfood 환경에서 실제 실행
cd /Users/dennis/Project/Design
node packages/gd-cli/dist/cli.js react login \
  --chat-root experiments/dogfood-alpha-v5/chats
# 기대: TSX 출력에 z.object / useForm / zodResolver 포함
```

### 수동 검증 시나리오
1. `login.order.md` 작성 → `gd react login` → TSX 에 zod schema 포함 확인
2. `.order.md` 없는 씬 (`dashboard`) → 기존 TSX 와 동일 확인 (하위 호환)
3. 잘못된 `.order.md` → 에러 메시지 한국어 출력 확인

## 🔁 Rollback Plan

- `compileSceneWithOrder` 는 래퍼이므로 재정의만 삭제하면 기존 `compileScene` 복귀
- `react.ts` 의 import 1줄 변경 취소로 완전 롤백 가능

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
