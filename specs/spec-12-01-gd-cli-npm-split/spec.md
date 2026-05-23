# spec-12-01: `@gd/cli` npm 분리

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-12-01` |
| **Phase** | `phase-12` |
| **Branch** | `spec-12-01-gd-cli-npm-split` |
| **상태** | Planning |
| **타입** | Refactor + New Package |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

phase-11 의 dogfooding alpha (v1) 에서 발견한 잔여 HIGH:

- preset (`create-gd-react` scaffold) 의 `package.json` 에 `pnpm gd` 스크립트가 있지만 *실행 불가* — `gd` 명령 (또는 `gen-design`) 이 npm 에 없음
- 현재 `studio/scripts/gen-design.ts` 는 *studio 내부 스크립트* — 외부 디자이너 환경에 배포되지 않음
- 외부 alpha 채용이 막힘 — *진정* phase-11 깃발 미달

해결: `@gd/cli` npm 패키지로 분리. studio 도 *외부 패키지처럼* import 하여 *동일 코드 경로* 보장.

### 사용자 결정 (이번 spec 의 scope)

| 결정 | 값 |
|---|---|
| 패키지명 | `@gd/cli` (scoped) |
| bin 명령 | `gen-design` |
| studio 관계 | studio 가 `@gd/cli` 를 devDep 으로 import (완전 이전) |
| npm publish | **본 spec 은 workspace 동작까지만**. publish 는 후속 (외부 alpha 시점) |

## 🎯 요구사항

### Functional Requirements

1. **`packages/gd-cli/`** 새 패키지 생성
   - `package.json` (name: `@gd/cli`, bin: `gen-design`, tsup 빌드)
   - `src/cli.ts` entry — subcommand dispatcher (react / doctor / diff / lint / merge / paper-import)
   - `src/commands/` — 각 subcommand
2. **`studio/scripts/gen-design.ts` + `studio/scripts/gen-design/` 이전**
   - 모든 subcommand 코드를 `packages/gd-cli/src/commands/` 로 이동
   - `studio/scripts/gen-design.ts` 제거 (또는 `@gd/cli` 의 cli.ts 를 호출하는 *얇은 shim*)
   - studio `package.json` 의 `gd` 관련 scripts 가 `@gd/cli` 를 호출하도록 갱신
3. **chat-md-compiler 위치 (ADR-12-01-A)**
   - 현재 `studio/src/lib/chat-md-compiler/` 의 44 파일. gd-cli 의 react/doctor 가 이를 import
   - **plan 단계 결정** (옵션):
     - (A) chat-md-compiler 도 `packages/chat-md-compiler/` 로 분리 (정석, 큰 작업)
     - (B) chat-md-compiler 는 `packages/gd-cli/src/lib/` 로 통째 이전 (단일 패키지)
     - (C) chat-md-compiler 는 studio 에 두고 gd-cli 가 workspace import (외부 publish 불가, 임시)
4. **preset 의 `package.json`** — `@gd/cli` 를 devDep 으로 (workspace 의존성: `"workspace:*"`)
5. **`pnpm gd react <slug>`** 가 *외부 scaffold 디렉토리에서* 동작 (workspace 안)
6. **회귀 무**: studio 1064 tests / create-gd-react 28 tests / dogfood-alpha-v1~v4 의 `gd react` `gd doctor` 모두 동작

### Non-Functional Requirements

1. tsup 빌드 시간 5s 이내
2. `@gd/cli` 단위 테스트 ≥ studio 의 기존 gen-design 테스트 cover (동일 케이스 유지)
3. monorepo workspace 안에서 *재빌드 없이* `pnpm gd` 동작 (pnpm 의 workspace symlink)

## 🚫 Out of Scope

- npm publish (실 publish + 외부 npm install) → phase-12 후속 또는 외부 alpha 시점
- `@gd/cli` 의 새 명령 추가 (`gd tokens` 등) → spec-12-03
- 외부 디자이너 alpha 채용 → OPT

## 📑 ADR 후보

- [ ] **ADR-12-01-A** — chat-md-compiler 위치 (A/B/C 중 결정 사유)

## ✅ Definition of Done

- [ ] `packages/gd-cli/` 패키지 빌드 (`pnpm build` 통과)
- [ ] `studio/scripts/gen-design*` 코드 이전 완료 (또는 shim)
- [ ] studio `pnpm test` 1064 PASS
- [ ] dogfood-alpha-v4 환경에서 `pnpm gd react login` 동작 + 0 errors
- [ ] preset `package.json` 의 `gd` 명령이 *workspace 안에서* 동작 (npx create + cd + pnpm gd 시나리오)
- [ ] walkthrough.md + pr_description.md
