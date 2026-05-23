# Plan: spec-12-01 — `@gd/cli` npm 분리

## 🎯 접근

monorepo 안에 **2 새 패키지** 신설:
1. `packages/chat-md-compiler/` — chat.md grammar + parser + compilers (paper / react / cli)
2. `packages/gd-cli/` — `gen-design` CLI (react / doctor / diff / lint / merge / paper-import)

studio 는 두 패키지를 *workspace dep* 으로 변경 (src/lib/chat-md-compiler 제거 + scripts/gen-design* 제거).

## 📑 ADR-12-01-A — chat-md-compiler 위치 결정

| 옵션 | 장점 | 단점 |
|---|---|---|
| (A) `packages/chat-md-compiler/` | studio frontend (preview/chat-viewer) + gd-cli 둘 다 깔끔. 의미적 정합. 향후 publish 가능 | 44 파일 이전 — 큰 작업 |
| (B) `packages/gd-cli/src/lib/` 안 | gd-cli 단일 패키지. 작업 ↓ | studio frontend 가 `@gd/cli/lib/...` import — `@gd/cli` 이름과 의미 불일치 |
| (C) studio 에 그대로 + workspace import | 가장 작음 | 외부 publish 불가. 사용자 결정 "완전 이전" 위배 |

**결정**: **(A)** — 사용자 결정 "완전 이전" 정합 + studio frontend (preview / chat-viewer) 도 chat-md-compiler 사용 중 → 별도 패키지가 의미상 자연.

## 📦 디렉토리 구조

```
packages/
├── chat-md-compiler/          ← NEW
│   ├── package.json           name: @gd/chat-md-compiler
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── src/
│   │   ├── index.ts           re-export public API
│   │   ├── cli/               (이전: studio/src/lib/chat-md-compiler/cli/)
│   │   ├── paper/             (이전: studio/src/lib/chat-md-compiler/paper/)
│   │   └── react/             (이전: studio/src/lib/chat-md-compiler/react/)
│   └── (tests src 옆 *.test.ts)
│
├── gd-cli/                    ← NEW
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
├── package.json               devDep: @gd/chat-md-compiler + @gd/cli (workspace:*)
├── src/lib/chat-md-compiler/  ← 삭제
├── src/features/.../          import: @/lib/... → @gd/chat-md-compiler
└── scripts/gen-design*        ← 삭제
```

## 🔧 작업 단위

### Task 1: pre-flight commit (spec/plan/task)

### Task 2: `packages/chat-md-compiler/` scaffold + 이전

1. 패키지 scaffold (package.json / tsconfig / tsup / vitest)
2. `studio/src/lib/chat-md-compiler/` → `packages/chat-md-compiler/src/` (`git mv`)
3. `src/index.ts` — public API re-export
4. studio frontend (preview / chat-viewer) 의 import 경로 갱신: `@/lib/chat-md-compiler/...` → `@gd/chat-md-compiler/...`
5. `studio/package.json` devDep + tsconfig paths 갱신
6. studio `pnpm test` PASS 확인
7. **Commit**: `refactor(spec-12-01): extract @gd/chat-md-compiler package`

### Task 3: `packages/gd-cli/` scaffold

1. 패키지 scaffold (package.json / bin: gen-design / tsup / vitest)
2. `src/cli.ts` — `studio/scripts/gen-design.ts` 의 dispatcher 이전
3. `src/commands/` — 각 subcommand 이전
   - `react.ts` (chat-md-compiler 의 compileScene import — `@gd/chat-md-compiler`)
   - `doctor/` 디렉토리 통째 이전
   - `diff.ts` / `lint.ts` / `merge.ts` / `paper-import.ts`
4. import 경로 갱신 — `../../src/lib/chat-md-compiler` → `@gd/chat-md-compiler`
5. **Commit**: `feat(spec-12-01): create @gd/cli package with all gen-design commands`

### Task 4: 테스트 이전 (gd-cli + chat-md-compiler)

1. `studio/scripts/__tests__/gen-design.test.ts` → `packages/gd-cli/`
2. `studio/scripts/gen-design/doctor/*.test.ts` → `packages/gd-cli/`
3. chat-md-compiler 관련 테스트 (studio 의 src/lib 내부 *.test.ts) → `packages/chat-md-compiler/`
4. vitest config 동기
5. 두 패키지 `pnpm test` PASS
6. **Commit**: `test(spec-12-01): migrate tests to new packages`

### Task 5: studio 정리

1. `studio/src/lib/chat-md-compiler/` 삭제
2. `studio/scripts/gen-design.ts` + `studio/scripts/gen-design/` 삭제
3. `studio/package.json` 의 `gd:*` scripts → `gen-design` (bin) 호출
4. studio `pnpm test` PASS (조정된 수치)
5. **Commit**: `chore(spec-12-01): remove studio inline gen-design + chat-md-compiler`

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
- [ ] `packages/chat-md-compiler/ pnpm test` PASS
- [ ] `packages/gd-cli/ pnpm test` PASS
- [ ] `create-gd-react pnpm test` PASS
- [ ] dogfood-alpha-v4 `pnpm gd react login` / `pnpm gd doctor` 0 errors
- [ ] studio preview 페이지 (vite dev) chat 컴파일 동작
