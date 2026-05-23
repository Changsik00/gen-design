# feat(spec-12-05): 디자인 주문 명세 — `.order.md` + gd react 통합

## 📋 Summary

### 배경 및 목적

`gd react` 는 `chat.md` 어휘 트리를 TSX 로 컴파일하지만, form validation 규칙 / button API endpoint 같은 **실행 명세** 는 포함하지 않았음 (v4 retro #6). 에이전트가 매 씬마다 zod schema 를 반복 작성 → 반복 코드 + 일관성 결여.

### 주요 변경 사항

- [x] `packages/gd-cli/src/commands/order.ts` 신규 — `parseOrderFile` + `validateOrderSpec` + `generateOrderTsx`
- [x] `packages/gd-cli/src/commands/react.ts` 수정 — `<slug>.order.md` 자동 탐지 + TSX 주입
- [x] `gd-chat.md` §5.8 신규 — `.order.md` draft 생성 가이드 (§5.5 완료 후 자동 유도)
- [x] `experiments/dogfood-alpha-v5/chats/scenes/login.order.md` 신규 — v5 시뮬 주문 명세
- [x] `experiments/dogfood-alpha-v5/transcripts/scene-6-order.md` 신규 — 시뮬 트랜스크립트

### Phase 컨텍스트

- **Phase**: `phase-12`
- **본 SPEC 의 역할**: v4 retro #6 "반복 코드 방지" — chat.md 어휘 + `.order.md` 실행 명세 쌍으로 반복 boilerplate 자동 생성

## 🎯 Key Review Points

1. **`.order.md` 포맷** — YAML frontmatter 전용 (마크다운 본문 선택). chat.md grammar 변경 없음
2. **하위 호환** — `.order.md` 없는 기존 씬은 영향 없음 (22 파일 회귀 테스트 PASS)
3. **주입 전략** — TSX 문자열 post-process (compileToReact 무손상)

### `.order.md` 포맷 예시

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

### 생성되는 TSX

```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1).min(8),
});

export function LoginScene() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  async function onSubmit(values: z.infer<typeof schema>) {
    await fetch('/auth/login', { method: 'POST', ... });
  }
  return <Card>...</Card>;
}
```

## 🧪 Verification

### 단위 테스트

| 파일 | 케이스 | 결과 |
|---|---|---|
| `order-args.test.ts` | 12 | ✅ Green |
| `order-runtime.test.ts` | 10 | ✅ Green |
| 전체 회귀 | 214 (기존) | ✅ Green |

### v5 시뮬레이션

```
실행: login.order.md → gd react login
```

| 항목 | 결과 |
|---|---|
| zod schema 생성 | ✅ z.object(email, password) |
| useForm binding | ✅ zodResolver 포함 |
| onSubmit fetch | ✅ POST /auth/login |
| 하위 호환 (order.md 없음) | ✅ dashboard 씬 기존 TSX 동일 |

## 📦 Files Changed

### 🛠 Modified Files

- `packages/gd-cli/src/commands/react.ts` (+14, -2): `.order.md` 탐지 + `injectOrderChunks`
- `packages/gd-cli/package.json` (+2): `js-yaml` + `@types/js-yaml` 의존성 추가
- `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` (+57, -1): §5.8 추가 + §12 업데이트

### 🆕 New Files

- `packages/gd-cli/src/commands/order.ts` (274줄): parseOrderFile / validateOrderSpec / generateOrderTsx
- `packages/gd-cli/src/commands/__tests__/order-args.test.ts` (205줄): 파서 단위 테스트
- `packages/gd-cli/src/commands/__tests__/order-runtime.test.ts` (168줄): 런타임 + 통합 테스트
- `experiments/dogfood-alpha-v5/chats/scenes/login.order.md`: v5 시뮬 주문 명세
- `experiments/dogfood-alpha-v5/transcripts/scene-6-order.md`: 시뮬 트랜스크립트

**Total**: 8 files changed

## ✅ Definition of Done

- [x] `order.ts` — parseOrderFile + validateOrderSpec + generateOrderTsx 구현
- [x] `order-args.test.ts` + `order-runtime.test.ts` 22 files PASS (236 tests)
- [x] `gd react` 가 `.order.md` 자동 탐지 + zod schema / useForm 주입 동작
- [x] `gd-chat.md` §5.8 추가 (`.order.md` draft 생성 가이드)
- [x] v5 시뮬 — `login.order.md` + `gd react login` → zod + useForm + onSubmit 포함 TSX 확인
- [x] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-12.md`
- Walkthrough: `specs/spec-12-05-design-order-spec/walkthrough.md`
- 연관 spec: spec-12-02 (gd-chat 대화 깊이), spec-12-03 (gd tokens), spec-12-04 (토큰 재사용)
