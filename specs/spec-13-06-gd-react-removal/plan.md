# Implementation Plan: spec-13-06

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-06-gd-react-removal`
- 시작 지점: `phase-13-vertical-slice`
- PR 타겟: `phase-13-vertical-slice`

## 🎯 핵심 전략

### 삭제 대상 (7개 파일)

| 파일 | 이유 |
|---|---|
| `packages/gd-cli/src/commands/react.ts` | CLI 진입점 — `gen-design react` 명령 |
| `packages/gd-cli/src/commands/order.ts` | `react.ts`에서만 임포트. `.order.md` 파서 |
| `__tests__/react-annotation.test.ts` | react.ts 테스트 |
| `__tests__/react-args.test.ts` | react.ts 테스트 |
| `__tests__/react-runtime.test.ts` | react.ts + order.ts 통합 테스트 |
| `__tests__/order-args.test.ts` | order.ts 테스트 |
| `__tests__/order-runtime.test.ts` | order.ts + react.ts 통합 테스트 |

### 수정 대상 (1개 파일)

`packages/gd-cli/src/cli.ts`:
- `import { runReact } from "./commands/react"` 제거
- `COMMANDS`에서 `"react": runReact` 제거
- `COMMAND_DESCRIPTIONS`에서 `"react": "..."` 제거

### 유지 대상 (이유)

- `studio/src/lib/chat-md-compiler/react/` — `useCompileResult.ts`(Spec Editor)가 `compileToReact` 사용 중
- `studio/src/lib/chat-md-compiler/react/__tests__/shell-merge.test.ts` — 유효한 회귀 테스트
- `studio/src/lib/chat-md-compiler/react/__tests__/jsx-emitter.test.ts` — 유효한 회귀 테스트

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
