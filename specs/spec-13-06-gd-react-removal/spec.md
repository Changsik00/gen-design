# spec-13-06: gd react 컴파일러 CLI 제거

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-06` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-06-gd-react-removal` |
| **상태** | Planning |
| **타입** | Refactor |
| **Integration Test Required** | no |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gen-design react <slug>` 명령이 chat.md → TSX를 결정론적으로 컴파일한다. ADR-011에서 이 방식을 폐기하기로 결정했고, spec-13-03에서 gd-chat 스킬에서 이미 참조를 제거했다.

그러나 `packages/gd-cli/src/commands/react.ts`와 `order.ts`가 여전히 존재하며, `cli.ts`에 `react` 명령이 등록되어 있다.

### 문제점

1. **사용자 혼란**: `gen-design react` 명령이 아직 동작하므로 v1 방식으로 사용하는 것이 가능
2. **유지보수 부채**: 사용하지 않는 코드가 남아있음
3. **ADR-011 미완**: 컴파일러 폐기 결정이 CLI에 반영되지 않음

### 해결 방안 (요약)

`react.ts`와 `order.ts` CLI 명령 파일을 삭제하고, `cli.ts`에서 등록을 제거한다.

**주의**: `studio/src/lib/chat-md-compiler/react/` 라이브러리는 Studio Spec Editor의 라이브 프리뷰(`useCompileResult.ts`)가 사용하므로 유지한다.

## 🚫 Out of Scope

- `studio/src/lib/chat-md-compiler/react/` 라이브러리 삭제 (Spec Editor가 사용 중)
- `merge.ts`, `diff.ts`, `paper-import.ts` 등 다른 CLI 명령 변경
- Studio Spec Editor 기능 변경

## 📑 ADR 후보

- [ ] 없음 (ADR-011이 이미 이 결정을 기록함)

## ✅ Definition of Done

- [ ] `packages/gd-cli/src/commands/react.ts` 삭제
- [ ] `packages/gd-cli/src/commands/order.ts` 삭제
- [ ] `packages/gd-cli/src/commands/__tests__/react-*.test.ts` 3개 삭제
- [ ] `packages/gd-cli/src/commands/__tests__/order-*.test.ts` 2개 삭제
- [ ] `packages/gd-cli/src/cli.ts`에서 `react` 명령 제거
- [ ] `pnpm --filter @gd/cli test` PASS
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] PR → `phase-13-vertical-slice` 타겟
