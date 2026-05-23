# Scene 6 — LoginScene 주문 명세 시뮬레이션 (spec-12-05 §5.8 검증)

> v5 alpha 시뮬레이션 — §5.8 `.order.md` draft 생성 flow + `gd react` 통합 검증.

## 시뮬레이션 결과

| 단계 | 결과 |
|---|---|
| 씬 이름 | `login.chat.md` + `login.order.md` |
| §5.8 트리거 | ✅ §5.5 checklist 완료 후, Form + Button 확인 |
| `.order.md` 생성 | ✅ `chats/scenes/login.order.md` |
| `gd react login` | ✅ zod schema + useForm + onSubmit 포함 TSX |
| 하위 호환 | ✅ `.order.md` 없는 씬 (dashboard) 기존 TSX 동일 |

## 대화 흐름 요약

**Turn (§5.8 진입)** — §5.5 checklist 완료 직후
> 에이전트: "decisions.md 에 기록된 내용을 바탕으로 `.order.md` 를 만들어 볼까요?
> 이걸 만들면 `gd react` 가 zod schema 와 useForm binding 을 자동 생성해요."
> 디자이너: "네, 만들어주세요."

**에이전트 행동**:
1. decisions.md 에서 LoginScene validation + 버튼 의도 추출
   - email: required + email format
   - password: required + min(8)
   - submit 버튼: form-submit → POST /auth/login
   - signup-link: nav → /signup
2. `chats/scenes/login.order.md` 작성

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

> 디자이너: "좋아요."

## gd react 실행 결과

```bash
$ gd react login --chat-root chats
```

```tsx
// @gd: chats/scenes/login.chat.md
import React from 'react';
import { Button } from '@/components/ui/button';
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
    await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
  }
  return (
    <Card className="w-full max-w-sm mx-auto">
      ...
    </Card>
  );
}
```

## 검증 결과

- ✅ §5.8 트리거: Form + Button 있는 신에서 자동 진입
- ✅ `login.order.md` 생성: decisions.md validation + 버튼 의도 → YAML frontmatter
- ✅ `gd react login`: zod schema + useForm binding + onSubmit(fetch) 포함 TSX
- ✅ 하위 호환: `.order.md` 없는 씬 (dashboard.chat.md) → 기존 TSX 그대로 (회귀 없음)
- ✅ phase-12 성공 기준 4번 "반복 코드 정량" 방향성 달성 (zod schema 자동 생성)

## 이월 항목

- `useForm` 의 register() 연결 — `<Input>` 에 `{...form.register("email")}` 자동 주입 → Icebox
- form 의 `onSubmit` 을 `<Form onSubmit={form.handleSubmit(onSubmit)}>` 로 자동 바인딩 → Icebox
- routing target (`/signup`) 으로부터 `next/link` 또는 `react-router` import 자동 추가 → Icebox
