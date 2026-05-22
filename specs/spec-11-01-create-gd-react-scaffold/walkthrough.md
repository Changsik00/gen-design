# Walkthrough: spec-11-01 — `create-gd-react` npm 패키지 + GitHub default preset

## 실행 증거

### 1. 단위 테스트 — 25 PASS

```
> create-gd-react@0.1.0 test
> vitest run

 Test Files  4 passed (4)
      Tests  25 passed (25)
   Duration  211ms
```

테스트 분포:
- `fallback.test.ts` — 5 (offline preset 복사)
- `postprocess.test.ts` — 7 (placeholder / memory / idempotent)
- `fetcher.test.ts` — 4 (sparse extract / prefix-strip / preset-404)
- `cli.test.ts` — 9 (offline / placeholder / memory / invalid / missing / force / help / version)

### 2. 통합 테스트 — 5/5 PASS

```
[1/5] CLI 빌드
  ✓ dist/cli.js 생성
[2/5] Scaffold (integration-test-app, --offline --no-install)
  ✓ 0초
[3/5] 핵심 파일 검증
  ✓ 41개 파일 모두 존재
[4/5] Placeholder 치환 검증
  ✓ package.json name = integration-test-app
  ✓ README.md placeholder 치환됨
  ✓ .gd/memory/MEMORY.md 인덱스 초기화
[5/5] pnpm install + typecheck
  ✓ pnpm install (4초)
  ✓ typecheck (1초)

✅ Integration Test PASSED
```

### 3. 회귀 — studio 998 PASS 유지

```
 Test Files  131 passed (131)
      Tests  998 passed (998)
   Duration  12.00s
```

기존 phase-10 결과와 동일 — workspace 추가로 인한 회귀 0.

### 4. 빌드 — 15.34 KB ESM

```
> tsup src/cli.ts --format esm --target node20 --clean --shims
ESM dist/cli.js 15.34 KB
ESM ⚡️ Build success in 36ms
```

---

## 산출물 (14 commits)

| # | Commit | 내용 |
|---|---|---|
| 1 | `cfa6d85` | chore: workspace + create-gd-react 초기 셋업 |
| 2 | `48127f2` | feat: messages.ts + types.ts (한국어 안내) |
| 3 | `4b028cd` | feat: fallback (recursive copy) — 5 tests |
| 4 | `091c17f` | feat: postprocess (placeholder + memory) — 7 tests |
| 5 | `87ad734` | feat: fetcher (GitHub tarball sparse extract) — 4 tests |
| 6 | `c73f338` | feat: cli.ts entry — parseArgs + 통합 흐름 — 9 tests, 15KB build |
| 7 | `d70055e` | feat: base React+Vite+TS preset (package.json / vite / tsconfig / tailwind / eslint / prettier / lefthook) |
| 8 | `9b3c6ad` | feat: src infrastructure (lib / api / config / i18n / styles) |
| 9 | `8bf6d3e` | feat: shadcn UI 5종 + welcome scene (`// @gd:` annotation) |
| 10 | `bce6976` | feat: chats + templates placeholder (DESIGN/TOKEN + DTCG tokens.json) |
| 11 | `6485f5a` | feat: FRONT.md agent stack guide (15 sections) |
| 12 | `1bbe95b` | feat: AGENT.md 명령형 행동 규칙 (❌금지 10건 + ✅필수 10건) |
| 13 | `33b63c9` | feat: .claude/skills/gd-* placeholder + .gd/memory/MEMORY.md |
| 14 | `46f4c59` | test: integration test script — 5/5 PASS |

---

## 핵심 아키텍처

### Hybrid: npm CLI + GitHub preset

```
npm: create-gd-react (~50KB CLI)
  ├── src/cli.ts        — parseArgs + 흐름
  ├── src/fetcher.ts    — GitHub tarball + tar.x sparse extract (strip=3)
  ├── src/fallback.ts   — --offline 시 presets-bundled/ 복사
  ├── src/postprocess.ts — placeholder + .gd/memory 초기화
  ├── src/messages.ts   — 한국어 안내
  └── presets-bundled/default/ (41 files)  ← --offline fallback

원격 (phase-12 후속): github.com/<owner>/gen-design-presets
                    → main.tar.gz fetch → sparse extract
```

### scaffold 파일 구조 (41 files)

🔒 **고정 surface** (디자이너 무수정):
- Stack: package.json (Vite 7 + React 19 + 모든 deps), vite.config.ts, tsconfig*, tailwind, components.json, eslint.config.js, .prettierrc.json, lefthook.yml, index.html, postcss.config.js, .gitignore
- src/: main.tsx, router.tsx, components/ui/{button,card,input,label,separator}, lib/{utils,sentry,logger}, api/client.ts, config/env.ts, i18n/{index,locales/{ko,en}}, styles/globals.css, test-setup.ts, scenes/welcome.tsx (`// @gd:` annotation)
- templates/FRONT.md (Agent Stack Guide 15 sections), templates/AGENT.md (행동 규칙)

✏️ **디자이너 surface**:
- chats/_shell.chat.md, chats/scenes/welcome.chat.md
- templates/DESIGN.md, templates/TOKEN.md, templates/assets/tokens/tokens.json (DTCG)

🤖 **Auto/Memory**:
- .claude/skills/gd-{start,chat,token,design}.md (placeholder, spec-11-02 본문)
- .gd/memory/MEMORY.md (인덱스, 디스크 캐시)

---

## 디자인 결정 적용 (phase-11.md 결정 14건 모두 반영)

| 결정 | 본 spec 의 구현 |
|---|---|
| 1. npx scaffold | `create-gd-react` bin entry |
| 2. onboarding + 첫 React | scaffold + welcome sample |
| 3. Paper optional | Paper MCP 의존 X — chat → React 만 |
| 4. 고정 vs 디자이너 surface 분리 | 위 파일 구조 |
| 5. `@gd/cli` 별도 패키지 | 본 spec 은 placeholder — phase-12 후보 |
| 6. SKILL.md 신형 | `.claude/skills/gd-*.md` frontmatter (name/description) |
| 7. `gd-` prefix 일괄 | npx/CLI/skill 모두 `gd` |
| 8. 스킬 능동성 | 파일 위치 / 포맷 / "없으면 생성" — placeholder + spec-11-02 |
| 9. `.gd/memory/` 디스크 캐시 | MEMORY.md 인덱스 + 4개 entry |
| 10. lat.md 개념 차용 | scenes/welcome.tsx 의 `// @gd: chats/scenes/welcome.chat.md` |
| 11. preset GitHub + offline fallback | fetcher.ts (HTTP) + fallback.ts (bundled) |
| 12. README single entry point | scaffold README.md (30초 / cheatsheet / `/gd-start` 안내) |
| 13. FRONT.md = stack guide | 15 sections (Stack/State/HTTP/Env/Sentry/Logger/Pre-check/i18n/Form/Date/E2E/a11y/DRY/폴더/Performance/보안) |
| 14. React stack 일괄 고정 | package.json 의 deps 전체 박힘 |

---

## DoD 체크

- [x] `packages/create-gd-react/` npm 패키지 코드 작성 + 단위 테스트 25 PASS
- [x] `presets-bundled/default/` 전체 콘텐츠 (41 files)
- [x] 로컬 `node dist/cli.js my-test --offline` 동작 검증
- [x] 통합 테스트 5/5 PASS — install + typecheck 통과
- [x] `--offline` fallback 동작 확인
- [x] 친절한 한국어 오류 메시지 + 종료 코드 매핑
- [ ] (phase-11 끝) GitHub preset repo 생성 + 실 fetch 검증 — *후속*
- [ ] (phase-11 끝) npm publish — *후속*
- [x] walkthrough.md + pr_description.md ship 완료

---

## 후속 작업 (이 spec 의 out of scope)

| 항목 | spec |
|---|---|
| `.claude/skills/gd-*.md` 본문 작성 | spec-11-02 |
| `gd doctor` 구현 + drift 감지 | spec-11-03 |
| dogfooding alpha 실증 | spec-11-04 |
| GitHub preset repo 생성 + 실 fetch | phase-11 끝 / phase-12 |
| `@gd/cli` 분리 + npm publish | phase-12 |
