# Walkthrough: spec-13-06

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| `studio/src/lib/chat-md-compiler/react/` 삭제 여부 | 삭제 / 유지 | **유지** | `useCompileResult.ts`(Spec Editor 라이브 프리뷰)가 `compileToReact`를 임포트. 삭제 시 Studio 기능 손상 |
| `lint.ts`의 `compile` 카테고리 처리 | 빈 함수 유지 / 제거 | **완전 제거** | `runReact` 의존이므로 함께 제거. `--no-compile` 플래그도 함께 제거 |
| `--no-compile` 하위 호환 | deprecated 경고 / 즉시 error | **즉시 error** (unknown flag) | 이미 CI에서 `--no-compile`을 쓰던 step이 주석 처리됨. 하위 호환 불필요 |
| `cli.test.ts` react 라우팅 테스트 | 삭제 / 수정 | **수정** ("Unknown command: react" 검증으로 교체) | react 명령이 제거된 것을 명시적으로 검증 |

- [x] ADR 승격 → ADR-011이 이미 이 결정을 기록함. 추가 불필요.

## 💬 사용자 협의

- **주제**: 컴파일러 CLI 제거 범위
  - **합의**: `react.ts`, `order.ts` CLI 명령 삭제. `studio/src/lib/chat-md-compiler/react/` 라이브러리는 Spec Editor가 사용 중이므로 유지. ADR-011의 "컴파일러 폐기" 결정이 CLI 레이어에서 완료됨.

## 🧪 검증 결과

### 1. gd-cli 단위 테스트

```
pnpm --filter @gd/cli test --run
Test Files  18 passed (18)
Tests  225 passed (225)
```

### 2. 삭제 확인

```bash
gen-design react --help
# → "Unknown command: react"
# → exitCode 2
```

## 🔍 발견 사항

- `lint.ts`가 `react.ts`를 임포트하고 있었음 (compile 카테고리용). 예상치 못한 추가 수정 필요였으나 깔끔하게 정리됨.
- `studio/src/lib/chat-md-compiler/react/` 는 아직 Studio Spec Editor가 사용 중 — phase-14 또는 별도 spec에서 리팩토링 가능.
- `@gd/cli` 패키지 description이 아직 "chat.md → React TSX deterministic compilation"로 되어있음 — `package.json` 업데이트는 scope-out (spec-x 후보).

## 🚧 이월 항목

- `packages/gd-cli/package.json` description 업데이트 → spec-x
- `studio/src/lib/chat-md-compiler/react/` 라이브러리 정리 → phase-14 또는 spec-x

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-29 |
| **최종 commit** | `25721be` |
