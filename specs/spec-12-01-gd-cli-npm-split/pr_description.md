spec-12-01: `@gd/cli` npm 분리 + component-registry 분해 시작

## Summary

phase-11 v1 #4 잔여 HIGH 해소 — `gen-design` CLI 를 *studio 내부 스크립트* 에서 별도 패키지 `@gd/cli` 로 분리.

진행 중 발견 (ADR-12-01-A): chat-md-compiler 의 react ↔ paper ↔ studio frontend 강결합 — **component-registry 의 문자열 metadata 와 React 컴포넌트 instance 를 분해**.

## 변경 사항

### 신규 패키지 `packages/gd-cli/`
- `@gd/cli` + bin `gen-design`
- `bin/gen-design.mjs` (tsx wrapper)
- `src/cli.ts` + `src/commands/` (react / doctor / diff / lint / merge / paper-import)
- **186 tests PASS** (cli.test.ts 9 + 기존 177)

### component-registry 분해 (paper 결합 차단)
- `paper/component-registry-metadata.ts` (NEW) — 문자열 only
- `paper/component-registry.ts` — metadata re-export + React instance 유지
- `react/compile.ts` + `imports-builder.ts` — metadata 파일 import

→ CLI 가 `@/components/*` studio frontend 의존 끊김.

### studio 정리
- `scripts/gen-design.ts` + `scripts/gen-design/` 제거
- `package.json` `gen-design` script → bin 호출
- devDep `@gd/cli: workspace:*`

### preset 동기
- `presets-bundled/default/package.json` scripts `gd: gen-design`
- devDep `@gd/cli: workspace:*`

### phase-12 갱신
- spec-12-07 (tool-plugin-architecture) 추가 — phase 마지막 *대규모* spec, 비전: `@gd/chat-md-core/react/paper/figma` 플러그인 분리. 본 spec 의 component-registry 분해는 그 *첫 단계*

## ADR-12-01-A 결정

**(C) chat-md-compiler 는 studio 에 유지** — gd-cli 가 상대 경로 import.
이유: chat-md (parser) 가 paper-inference / figma-adapter / frontend 등 30+ import 위치에서 사용 → 분리 시 작업 폭증. publish 는 본 spec out of scope.

## Test Plan

- [x] `pnpm --filter @gd/cli test` — 186 PASS
- [x] `pnpm --filter studio test` — 875 PASS (3 fail = main 동일, **본 spec 회귀 X**)
- [x] `pnpm --filter create-gd-react test` — 28 PASS
- [x] dogfood-alpha-v4 `pnpm gd react login` → 2056 bytes
- [x] dogfood-alpha-v4 `pnpm gd doctor` → 0 errors
- [x] studio `pnpm gen-design --help` 동작

## 회귀 (기존 문제)

`studio/src/lib/chat-md-compiler/paper/__tests__/compile-fixtures.test.ts` 의 3 snapshot fail — main 에서도 동일 발생. 본 spec PR 의 책임 아님. 별도 fix.

## Out of Scope

- 외부 npm publish → phase-12 후속 또는 외부 alpha 시점
- chat-md-compiler 완전 분해 → spec-12-07 (plugin 아키텍처)
