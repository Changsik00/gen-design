# Plan: spec-12-01 — `@gd/cli` npm 분리

## 🎯 접근

monorepo 안에 **1 새 패키지** 신설:
- `packages/gd-cli/` — `gen-design` CLI (react / doctor / diff / lint / merge / paper-import)

studio 는 `@gd/cli` 를 workspace dep 으로 추가 + `scripts/gen-design*` 제거. **`src/lib/chat-md-compiler/` 는 studio 에 그대로 유지** (Task 2 진행 중 ADR 재결정 — 아래 §).

## 📑 ADR-12-01-A — chat-md-compiler 위치 결정 (갱신 2026-05-23)

| 옵션 | 장점 | 단점 |
|---|---|---|
| (A) `packages/chat-md-compiler/` 분리 | gd-cli + studio 둘 다 깔끔 | **`chat-md` (parser) 도 같이 분리 필요 — 30+ import 영향, 작업 폭증** |
| (B) `packages/gd-cli/src/lib/` 안 | gd-cli 단일 패키지 | studio frontend 가 `@gd/cli/lib/...` import — 이름 불일치 |
| (C) studio 에 그대로 + workspace import | 작업 ↓ | 외부 publish 불가 (publish out of scope 이라 OK) |

**Task 2 진행 중 발견**:
- `chat-md-compiler` 는 `studio/src/lib/chat-md/parser` 를 광범위 import
- `chat-md/parser` 자체도 studio 의 paper-inference / figma-adapter / frontend features 등에서 15+ import 위치 사용 중
- → (A) 가면 chat-md 까지 4 패키지 분리 = spec scope 폭증

**갱신 결정**: **(C)** — 사용자 확인 후 결정. chat-md-compiler 는 studio 에 두고 gd-cli 만 분리. workspace 안에서 *상대 경로 import* (또는 path alias). 외부 publish 불가 — *publish 후속* 결정과 정합.

## 📦 디렉토리 구조 (갱신)

```
packages/
├── gd-cli/                    ← NEW (단일 신규 패키지)
│   ├── package.json           name: @gd/cli, bin: gen-design
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── src/
│   │   ├── cli.ts             entry (dispatcher)
│   │   └── commands/
│   │       ├── react.ts       (이전: studio/scripts/gen-design/react.ts)
│   │       ├── doctor/        (이전: studio/scripts/gen-design/doctor/)
│   │       ├── diff.ts
│   │       ├── lint.ts
│   │       ├── merge.ts
│   │       └── paper-import.ts
│   └── (tests src 옆 *.test.ts)
│
└── create-gd-react/           (기존, preset package.json 만 갱신)

studio/
├── package.json               devDep: @gd/cli (workspace:*)
├── src/lib/chat-md-compiler/  ← 그대로 유지 (45 파일)
├── src/lib/chat-md/           ← 그대로 유지
└── scripts/gen-design*        ← 삭제 (gd-cli 가 대체)
```

### gd-cli ↔ studio chat-md-compiler import 방식

`packages/gd-cli/src/commands/react.ts` 가 `studio/src/lib/chat-md-compiler/react/compile-scene` 를 import 해야 함. 옵션:

- **상대 경로**: `from "../../../studio/src/lib/chat-md-compiler/react/compile-scene"` — 단순하지만 못생김
- **path alias** (gd-cli tsconfig + tsup): `"@studio-compiler/*": "../studio/src/lib/chat-md-compiler/*"` → `from "@studio-compiler/react/compile-scene"` — 깔끔

→ **path alias 채택**.

## 🔧 작업 단위 (갱신)

### Task 1: pre-flight commit (spec/plan/task) — ✅ 완료

### Task 2: ADR 재결정 commit (plan/task 갱신)

진행 중 발견 (chat-md parser 광범위 사용) 반영하여 ADR (A) → (C). plan/task.md 갱신만.

**Commit**: `docs(spec-12-01): ADR-A revise to C — keep chat-md-compiler in studio`

### Task 3: `packages/gd-cli/` scaffold + 코드 이전

1. 패키지 scaffold (package.json / bin: gen-design / tsup / vitest)
2. tsconfig path alias: `"@studio-compiler/*": "../../studio/src/lib/chat-md-compiler/*"`
3. `src/cli.ts` — `studio/scripts/gen-design.ts` 의 dispatcher 이전
4. `src/commands/` — 각 subcommand 이전 (`react.ts`, `doctor/`, `diff.ts`, `lint.ts`, `merge.ts`, `paper-import.ts`)
5. import 경로 갱신 — `../../src/lib/chat-md-compiler` → `@studio-compiler`
6. tsup build 성공
7. **Commit**: `feat(spec-12-01): create @gd/cli package with gen-design commands`

### Task 4: 테스트 이전

1. `studio/scripts/__tests__/gen-design.test.ts` → `packages/gd-cli/src/`
2. `studio/scripts/gen-design/doctor/*.test.ts` → `packages/gd-cli/src/commands/doctor/`
3. vitest config 동기
4. `pnpm --filter @gd/cli test` PASS
5. **Commit**: `test(spec-12-01): migrate gen-design tests to @gd/cli`

### Task 5: studio 정리

1. `studio/scripts/gen-design.ts` + `studio/scripts/gen-design/` 삭제
2. `studio/package.json` 의 `gd:*` 또는 관련 scripts → `gen-design` (bin) 호출
3. studio devDep 에 `@gd/cli: workspace:*` 추가
4. studio `pnpm test` PASS (조정된 수치)
5. **Commit**: `chore(spec-12-01): remove studio inline gen-design — use @gd/cli`

### Task 6: preset (create-gd-react) 동기

1. `packages/create-gd-react/presets-bundled/default/package.json` 의 devDep 에 `@gd/cli: workspace:*`
2. `scripts.gd` 가 `gen-design` (bin) 호출
3. create-gd-react `pnpm test` PASS
4. **Commit**: `feat(spec-12-01): preset references @gd/cli via workspace`

### Task 7: 통합 테스트

1. `experiments/dogfood-alpha-v4/` 에서 `pnpm gd react login` 재실행 — 0 errors
2. `pnpm gd doctor` 재실행 — 0 errors
3. 새 임시 디렉토리에서 create-gd-react scaffold + `pnpm gd react` 통합 시나리오
4. studio 의 preview / chat-viewer 동작 (vite dev 옵션 — 빠른 확인)
5. **Commit**: `test(spec-12-01): integration — gd commands work from external dir`

### Task 8: Ship

1. walkthrough.md + pr_description.md
2. Ship Commit (sdd ship)
3. Push + PR (`--base phase-12-conversation-depth-and-orchestration`)

## ⚠️ 위험 + 완화

| 위험 | 영향 | 완화 |
|---|---|---|
| 44 파일 이전 시 *상대 경로 import* 깨짐 | 빌드 실패 | `git mv` + tsc/vitest 즉시 검증 |
| studio path alias (`@/lib/...`) 변경 누락 | 런타임 import 실패 | `grep -r "chat-md-compiler"` 검증, vite preview 수동 확인 |
| dogfood-alpha-v1~v4 의 기존 동작 회귀 | 환경 깨짐 | Task 7 에서 v4 환경 재실행 검증 |
| pnpm `workspace:*` 가 외부 npx 시 깨짐 | preset 동작 X | npx 외부 시 file: 경로 fallback 검토 (Task 6 옵션 명시) |
| chat-md-compiler 의 동시 빌드 필요 | dev 시 두 번 빌드 | tsup `--watch` (현재 안 도입, 후속 OPT) |

## 🧪 검증 체크리스트

- [ ] `pnpm -r build` 전체 성공
- [ ] studio `pnpm test` PASS
- [ ] `packages/gd-cli/ pnpm test` PASS
- [ ] `create-gd-react pnpm test` PASS
- [ ] dogfood-alpha-v4 `pnpm gd react login` / `pnpm gd doctor` 0 errors
- [ ] studio preview / chat-viewer 동작 (회귀 무 — chat-md-compiler 위치 그대로라 영향 최소)
