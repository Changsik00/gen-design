# Walkthrough — spec-12-01: `@gd/cli` npm 분리

> phase-11 v1 #4 잔여 HIGH 해소. workspace 안 동작 + 외부 publish 준비 (publish 자체는 후속).

## 1. ADR-12-01-A — chat-md-compiler 위치

| 후보 | 결정 |
|---|---|
| (A) `packages/chat-md-compiler/` 분리 | ❌ — chat-md parser 가 paper-inference / figma-adapter / frontend 등 30+ import 위치에서 사용 → spec scope 폭증 |
| (B) `packages/gd-cli/src/lib/` 안 | ❌ — studio frontend 가 `@gd/cli/lib/...` import 어색 |
| **(C) studio 에 유지 + gd-cli 가 상대 경로 import** | ✅ — 작업 ↓, 외부 publish 는 후속 |

## 2. 핵심 변경

### 새 패키지 `packages/gd-cli/`
- `package.json` (`@gd/cli`, bin `gen-design`, tsx runtime)
- `bin/gen-design.mjs` — node wrapper (tsx CLI spawn — TS 직접 실행)
- `src/cli.ts` — dispatcher (이전: studio/scripts/gen-design.ts)
- `src/commands/` — react / doctor / diff / lint / merge / paper-import
- `src/cli.test.ts` + `src/commands/__tests__/` — **186 tests PASS**

### component-registry 분해 (작은 분리)
진행 중 발견: `chat-md-compiler/react/compile.ts` 가 `paper/component-registry.ts` 의 `registeredNames()` + `lookupImportPath()` 만 import. 둘 다 *문자열 metadata*. 

- 새 파일 `paper/component-registry-metadata.ts` — 문자열 only
- 기존 `paper/component-registry.ts` — metadata re-export + React 컴포넌트 instance 유지
- `react/compile.ts` + `imports-builder.ts` — import 를 metadata 파일로 변경

→ CLI 가 `@/components/*` studio frontend 의존 *끊김*. 외부 publish 가능성의 첫 단계 분해.

### studio 정리
- `studio/scripts/gen-design.ts` + `studio/scripts/gen-design/` 제거 (packages 로 이전)
- `studio/package.json` scripts `gen-design`: tsx → `gen-design` (bin)
- studio devDep `@gd/cli: workspace:*`

### preset 동기
- `presets-bundled/default/package.json` scripts `gd: gen-design` + devDep `@gd/cli: workspace:*`

## 3. 검증

| 항목 | 결과 |
|---|---|
| `@gd/cli` 빌드 (workspace) | ✅ |
| `@gd/cli pnpm test` | **186 PASS** (177 + 9 신규 cli.test.ts) |
| `studio pnpm test` | 875 PASS / 3 fail (compile-fixtures — **main 동일, 기존 문제**) |
| `create-gd-react pnpm test` | 28 PASS |
| dogfood-alpha-v4 `pnpm gd react login` | 2056 bytes ✓ |
| dogfood-alpha-v4 `pnpm gd doctor` | 0 errors ✓ |
| studio `pnpm gen-design --help` | OK |

## 4. spec-12-07 (NEW) — phase 마지막

진행 중 사용자 후속 발견 (모든 디자이너 = "기타 (손작성)" — paper 의존 *자체* 가 결합 문제):
- phase-12.md 에 **spec-12-07: tool-plugin-architecture** 추가 (phase 마지막)
- 비전: `@gd/chat-md-core` + `@gd/chat-md-react` + `@gd/chat-md-paper` (plugin) + `@gd/chat-md-figma` (plugin) 분리
- 본 spec 의 component-registry 분해는 *그 비전의 첫 분해 단계*

## 5. Out of Scope (후속)

- 외부 npm publish — phase-12 또는 외부 alpha 시점
- chat-md-compiler 의 *완전 분리* — spec-12-07 의 plugin 아키텍처 작업

## 6. 다음

- spec-12-02 (gd-chat 대화 깊이 + 버튼 의도 + form validation) 또는
- spec-12-03 (gd tokens 명령) 진행 가능
