# refactor(spec-13-06): gd react 컴파일러 CLI 제거

## 📋 Summary

### 배경 및 목적

ADR-011에서 결정한 "gd react 컴파일러 폐기"를 CLI 레이어에서 완료한다. `gen-design react` 명령과 관련 코드(`order.ts`, 5개 테스트 파일, lint `compile` 카테고리)를 삭제한다.

### 주요 변경 사항

- [x] `packages/gd-cli/src/commands/react.ts` 삭제
- [x] `packages/gd-cli/src/commands/order.ts` 삭제 (react.ts 전용 의존)
- [x] 관련 테스트 5개 삭제 (`react-annotation`, `react-args`, `react-runtime`, `order-args`, `order-runtime`)
- [x] `cli.ts` — react import + COMMANDS + DESCRIPTIONS 제거
- [x] `lint.ts` — compile 카테고리 제거 (runReact 의존), `--no-compile` 플래그 제거
- [x] `lint-args.test.ts` — `--no-compile` 테스트 → "unknown flag" 검증으로 교체
- [x] `cli.test.ts` — react 라우팅 테스트 → "Unknown command" 검증으로 교체

### Phase 컨텍스트

- **Phase**: `phase-13` — 마지막 spec
- **ADR**: ADR-011 (chat.md v2 수직 단면 + 컴파일러 폐기) 완전 이행

## 🎯 Key Review Points

1. **`studio/src/lib/chat-md-compiler/react/` 유지**: `useCompileResult.ts`(Spec Editor 라이브 프리뷰)가 `compileToReact`를 사용 중이므로 CLI 레이어만 제거. 라이브러리 자체는 유지.

2. **`--no-compile` 즉시 에러**: CI에서 이미 주석 처리됨. 하위 호환 불필요.

## 🧪 Verification

```bash
pnpm --filter @gd/cli test --run
# Test Files  18 passed | Tests  225 passed

gen-design react --help
# → Unknown command: react (exitCode 2)
```

## 📦 Files Changed

### 🗑 Deleted Files (7개)
- `packages/gd-cli/src/commands/react.ts`
- `packages/gd-cli/src/commands/order.ts`
- `packages/gd-cli/src/commands/__tests__/react-annotation.test.ts`
- `packages/gd-cli/src/commands/__tests__/react-args.test.ts`
- `packages/gd-cli/src/commands/__tests__/react-runtime.test.ts`
- `packages/gd-cli/src/commands/__tests__/order-args.test.ts`
- `packages/gd-cli/src/commands/__tests__/order-runtime.test.ts`

### 🛠 Modified Files (4개)
- `packages/gd-cli/src/cli.ts`: react 명령 제거
- `packages/gd-cli/src/cli.test.ts`: react → unknown command 테스트
- `packages/gd-cli/src/commands/lint.ts`: compile 카테고리 + --no-compile 제거
- `packages/gd-cli/src/commands/__tests__/lint-args.test.ts`: noCompile 테스트 업데이트

**Total**: 11 files changed

## ✅ Definition of Done

- [x] 단위 테스트 225개 PASS
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-13.md`
- ADR: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
- Walkthrough: `specs/spec-13-06-gd-react-removal/walkthrough.md`
