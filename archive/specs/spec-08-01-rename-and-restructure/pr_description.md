# refactor(spec-08-01): 어휘 / 디렉토리 / 코드 일괄 rename — `spec` → `chat`, `*Page` → `*Scene`

> phase-8 첫 spec. 모든 후속 spec 의 전제. **시맨틱 변경 0** — rename + git mv 만.

## 📋 Summary

### 배경 및 목적

phase-7 ship 직후 도그푸딩 시뮬레이션 (`poc-chat-agent-flow` 브랜치) 이 *어휘 충돌* 을 critical 차단점으로 식별:

| 어휘 | 의미 (이전) |
|---|---|
| harness-kit spec | SDD 작업 흔적 (`specs/spec-X-Y/`) |
| 우리 도구의 spec | 디자인 산출물 (`spec/login-page.spec.md`) |

신규 디자이너가 첫 5분에 *어떤 spec 인지* 헷갈림. handbook §4 의 가이드를 따르면 회귀 fixture + 작업물 + Studio UI 데이터가 같은 디렉토리에 섞임.

### 주요 변경 사항

- [x] **어휘**: 디자인 산출물 = `chat.md` (이전 `spec.md`). harness-kit 의 spec 어휘는 *유지* (작업 흔적 의미).
- [x] **컴포넌트 이름**: `*Page` (6 templates) → `*Scene`. `LoginPage` → `LoginScene` 등.
- [x] **디렉토리 분리**:
  - `fixtures/chats/{scenes 6, components 22}/` — 회귀 게이트 (28 fixture)
  - `playground/chats/{scenes 2, components 3}/` + `_shell.chat.md` — PoC 6 파일 채택
  - `chats/{scenes,components}/` — 빈 정식 산출물 위치
- [x] **코드 rename**:
  - `studio/src/lib/spec-md/` → `chat-md/`
  - `studio/src/lib/spec-md-compiler/` → `chat-md-compiler/`
  - `inferSpec` → `inferChat`
  - `SPEC_MD_GRAMMAR` → `CHAT_MD_GRAMMAR`
  - 6 templates 디렉토리 + 함수명 + 타입 일괄
- [x] **CLI rename** (package.json scripts):
  - `spec-react` → `chat-react`
  - `spec-paper` → `chat-paper`
  - `spec-lint` → `chat-lint`
  - `paper-to-spec` → `paper-to-chat`
- [x] **확장자**: `*.spec.md` → `*.chat.md` (28 fixture)
- [x] **catalog auto-extract** (`pnpm vocab`): `catalog.json` + `spec-schema.json` + `FRONT.md` + `DESIGN.md` + `DESIGN.stitch.md` 자동 갱신
- [x] **handbook + README + schema** 어휘 grep 갱신 (full 재작성은 spec-8-02)

### Phase 컨텍스트

- **Phase**: `phase-8` (chat-agent-flow)
- **본 SPEC 의 역할**: phase-8 의 *모든 후속 spec 의 전제*. 어휘 / 디렉토리 / 코드 정합 후 spec-8-02 ~ 11 진행 가능.

## 🎯 Key Review Points

1. **시맨틱 변경 0 약속**: rename + git mv + 디렉토리 분리만. 컴파일러 출력 / parser AST / grammar 의미 변경 0. 회귀 0 (725/725).
2. **harness-kit spec 어휘 보존**: `specs/spec-X-Y/spec.md` (작업 흔적) 은 그대로. 디자인 산출물만 chat.md.
3. **catalog auto-extract**: `pnpm vocab` 한 번으로 5 파일 자동 갱신. cva extractor 의 견고성 확인.
4. **PoC 6 파일 채택**: `poc-chat-agent-flow` 브랜치의 검증된 형식 cherry-pick. grammar 정착 (frontmatter / 섹션 강제) 은 spec-8-04.
5. **deriveComponentName 의 `.chat.md` 인식**: `.chat.md` + `.spec.md` + `.md` 모두 인식 (역호환). frontmatter `name:` 명시는 spec-8-04 후보.

## 🧪 Verification

### 자동 테스트
```bash
cd studio && pnpm test
```

**결과**: ✅ 103 test files / 725 tests passed (회귀 0 + 신규 테스트 +1).

### 빌드
```bash
pnpm --filter studio build
```

**결과**: ✅ exit 0 (`built in 200ms`, TS6133 0 건).

### 수동 검증 시나리오

1. `pnpm chat-react fixtures/chats/scenes/login.chat.md` → LoginScene 함수 정상 TSX 출력
2. `pnpm vocab` → catalog 자동 갱신 검증
3. spec/ 디렉토리 부재 / fixtures/chats/ 28 분류 / playground/chats/ PoC / chats/ 빈 — 디렉토리 정합

## 📦 Files Changed

### 🆕 New Directories

- `fixtures/chats/scenes/` (6 chat.md): dashboard / error / login / my / settings / signup
- `fixtures/chats/components/` (22 chat.md): button + 20 composites + variant-wrapper
- `playground/chats/` (PoC cherry-pick): _shell + scenes/{main,login} + components/{empty-state,brand-header,app-footer}
- `chats/{scenes,components}/.gitkeep` (빈 정식 산출물 위치)

### 🚚 Renamed Directories

- `studio/src/lib/spec-md/` → `chat-md/`
- `studio/src/lib/spec-md-compiler/` → `chat-md-compiler/`
- `studio/src/components/templates/{Login,Dashboard,My,Signup,Settings,Error}Page/` → `{...}Scene/`

### 🛠 Modified Files (sample)

- `studio/scripts/generate-fixtures-index.ts`: 입력 경로 `spec/` → `fixtures/chats/{scenes,components}/`
- `studio/src/lib/paper-inference/infer.ts`: `inferSpec` → `inferChat`
- `studio/package.json`: CLI scripts spec-* → chat-*
- `studio/src/lib/vocabulary/catalog/catalog.json`: cva auto-extract (Page → Scene)
- `templates/{DESIGN,FRONT,DESIGN.stitch}.md`: vocab auto-render
- `docs/handbook.md`: 어휘 grep 갱신 (full 재작성 X)
- `README.md` / `schema/design-component-mapping.md`: 어휘 grep
- 28 fixture 의 `<LoginPage>` → `<LoginScene>` 일괄

### 🗑 Deleted

- `spec/` 디렉토리 자체 제거 (28 파일 모두 fixtures/chats/ 로 이동)

**Total**: 162 files changed (+1,590 / -821).

## ✅ Definition of Done

- [x] 28 fixture `fixtures/chats/{scenes,components}/` 분류 완료
- [x] `playground/chats/` PoC 6 파일 채택
- [x] `chats/` 빈 디렉토리 (`.gitkeep`)
- [x] studio 코드 rename + import 일관 갱신
- [x] CLI script rename (`pnpm chat-react` 등)
- [x] handbook + README + schema 어휘 grep 갱신
- [x] `pnpm test` 725/725 PASS (회귀 0)
- [x] `pnpm build` exit 0
- [x] `walkthrough.md` + `pr_description.md` ship commit
- [ ] 사용자 검토 + 머지

## 🔗 관련 자료

- Phase: `backlog/phase-08.md`
- Walkthrough: `specs/spec-08-01-rename-and-restructure/walkthrough.md`
- PoC: `poc-chat-agent-flow` 브랜치 (commit ff20eed cherry-picked)
- 후속 spec: spec-08-02 (handbook full) / spec-08-03 (paper-mcp-adapter) / spec-08-04 (grammar) / spec-08-05 (ADR-010) / spec-08-06 (incremental infer) / spec-08-07 (compiler) / spec-08-08 (merge) / spec-08-09 (lint) / spec-08-10 (studio runtime) / spec-08-11 (external alpha)
