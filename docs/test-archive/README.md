# Test Archive

phase-13 정리 (2026-05-29) 시점에 백업된 테스트 파일들.

## 백업 이유

아래 테스트들은 삭제된 외부 fixtures (`fixtures/chats/components`, `fixtures/paper-trees`)에 의존하거나,
spec-13-06에서 제거 예정인 `gd react` 컴파일러(`compileScene`)를 검증한다.

컴파일러 제거 시 참고하거나, 새 방식으로 재작성할 때 로직 참조용.

## 파일 목록

| 파일 | 원래 위치 | 의존 대상 |
|---|---|---|
| `chat-md-compiler-react/determinism.test.ts` | `studio/src/lib/chat-md-compiler/react/__tests__/` | fixtures/chats/components |
| `chat-md-compiler-react/ts-diagnose.test.ts` | 동일 | fixtures/chats/components |
| `chat-md-compiler-react/tsx-validity.test.ts` | 동일 | fixtures/chats/components |
| `chat-md-compiler-paper/compile-fixtures.test.ts` | `studio/src/lib/chat-md-compiler/paper/__tests__/` | fixtures/chats/components |
| `chat-md-compiler-paper/registry-and-i18n.test.ts` | 동일 | fixtures/chats/components |
| `paper-inference/benchmark.test.ts` | `studio/src/lib/paper-inference/__tests__/` | fixtures/chats/scenes+components (28개) |
| `paper-inference/round-trip.test.ts` | 동일 | fixtures/paper-trees |

## 복원 방법

```bash
git show <commit-hash>:studio/src/lib/chat-md-compiler/react/__tests__/determinism.test.ts
```

또는 이 archive 에서 원래 경로로 복사.
