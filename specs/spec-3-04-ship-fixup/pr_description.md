# docs(spec-3-04): phase-3 ship fix-up — Critical 4건 정리 + dogfooding 실체화

## 📋 Summary

### 배경 및 목적

phase-3 독립 Opus 감사(`/hk-phase-review`) 결과, Phase PR #14 의 "7/7 ✅" 자가 채점이 실제로는 **3 PASS / 2 PARTIAL / 2 FAIL** 임이 드러남. 본 spec 은 그 중 Critical 4건 (C1~C4) 을 정리하여 phase-3 산출물을 **실제로 실행 가능한 상태** 로 만든다.

- **C1 (FAIL)**: `templates/DESIGN.md.template` 부재 — 성공 기준 #5 + README.md 약속 불일치
- **C2 (FAIL)**: `templates/assets/**` 빈 `.gitkeep` 만 존재, studio 는 여전히 구 경로 사용 — dogfooding 미이행
- **C3 (PARTIAL)**: Blueprint 템플릿의 Handlebars placeholder 를 **누가 처리하는지** 부재
- **C4 (PARTIAL)**: 질의서 출력 YAML 이 템플릿 placeholder 12개를 채울 수 없었음

### 주요 변경 사항

- [x] **C1**: `templates/DESIGN.md.template` 신설 (design-md-schema 14 섹션 + LoginPage 참고 예시)
- [x] **C2**: studio i18n/tokens 실파일을 `templates/assets/` 로 이주 + Vite alias `@assets` 단일 방식 채택 (symlink/빌드 복사 기각)
- [x] **C3**: blueprint-protocol 에 **Fill Executor** 섹션 추가 — AI-direct-fill 기본 + Handlebars CLI 보조 + placeholder 해석 규칙 3종 예시
- [x] **C4**: Blueprint Step 3 출력 YAML 을 meta/auth/i18n/theme/finalPages 통합 구조로 교체 + 3 템플릿 placeholder 를 nested 접근으로 정합
- [x] **부속**: `templates/assets/README.md` 3-옵션 나열 정리, `.gitignore` 에 `.harness-uninstall-backup-*/` 추가

### Phase 컨텍스트

- **Phase**: `phase-3` (App Blueprint)
- **본 SPEC 의 역할**: phase-3 Phase PR (#14) 머지 전에 Critical 미달 4건을 회수하여 **정직한 main 머지** 를 가능하게 함. 동시에 **phase-5 (PoC) 가 전제하는 dogfooding 구조를 phase-3 에서 앞당겨 설치** — 하류 phase-4/5/6/7 의 관련 spec 들(예: `spec-4-003` Figma 토큰 동기화, `spec-5-002` 재사용성 검증, `spec-6-005` Export 번들) 의 결정 부채 일괄 상환.

## 🎯 Key Review Points

1. **Vite alias 단일 결정 (symlink 기각)** — `templates/assets/README.md` 가 이전에 방법 1/2/3 나열로 보류했던 결정을 `@assets` alias 로 확정. 심볼릭 링크는 Windows/pnpm/HMR/Docker 호환성 문제로 기각. 이 결정은 phase-4~7 의 base assumption 이 됨.
2. **Blueprint Step 3 출력 schema 확장** — 기존에 `finalPages` 만 있던 내부 상태를 `meta`/`auth`/`i18n`/`theme`/`finalPages` 통합 구조로 교체. 3 템플릿의 모든 placeholder 가 이 schema 와 1:1 매칭되도록 `{{meta.appName}}`, `{{auth.method}}`, `{{theme.defaultTheme}}` 등 nested 접근으로 통일.
3. **Fill Executor 계약 명시** — `{{var}}`, `{{obj.field}}`, `{{#each list}}` 해석 규칙을 **실제 입출력 쌍** 으로 예시. 외부 주입 placeholder (`{{date}}`, `{{techStack}}`, `{{PageName}}` literal 등) 를 별도 표로 구분하여 AI 가 혼동 없이 변환 가능.
4. **DESIGN.md.template 의 소스 경계** — 상단 안내 블록에서 "Blueprint 유래 placeholder" 와 "디자인 도구 추출 placeholder" 를 명시적으로 분리. 디자인 도구 추출 섹션(1~9)은 Phase 4~7 파이프라인의 인풋이 됨을 선언.
5. **studio 회귀 없음** — `pnpm tokens` / `pnpm build` / `vitest run` 모두 PASS (12 파일 / 63 테스트).

## 🧪 Verification

### 자동 검증

```bash
pnpm --dir studio tokens                        # style-dictionary 3종 CSS 생성
pnpm --dir studio build                         # vite build
cd studio && pnpm -s exec vitest run            # 단위 테스트
```

**결과 요약**:
- ✅ `pnpm tokens`: PASS (`_tokens-light.css`, `_tokens-dark.css`, `_tokens-brand-b.css`)
- ✅ `pnpm build`: PASS (vite 149ms, 1906 modules, `dist/assets/index-*.js` 생성)
- ✅ `vitest run`: PASS — **12 files / 63 tests**

### placeholder 정합 검증 (grep)

`templates/REQUIREMENTS.md.template`, `AGENT.md.template`, `DESIGN.md.template` 의 모든 `{{...}}` 가 다음 중 하나에 속하는지 수작업 검증:
- Blueprint Step 3 출력 YAML 의 필드 (`meta.*`, `auth.*`, `i18n.*`, `theme.*`, `finalPages[].*`)
- 자동 주입 (`{{date}}`)
- 프로젝트 상수 (`{{techStack}}`, `{{packageManager}}`, `{{testCommand}}`, `{{specId}}`)
- 디자인 도구 추출 (DESIGN.md 1~9 섹션 필드)
- Literal (`{{PageName}}` — 디렉토리 트리 예시)

→ 누락/잉여 0건.

### 수동 검증 시나리오

1. `cat templates/DESIGN.md.template | head -20` → 14섹션 + assets 경로 안내 확인 ✅
2. `ls templates/assets/{i18n,tokens}/` → 실파일 4 개 (ko.json, en.json, tokens.json, tokens-brand-b.json) ✅
3. `grep -n "Fill Executor" schema/blueprint-protocol.md` → 섹션 존재 확인 ✅
4. `git status --ignored | grep harness-uninstall-backup` → `.gitignore` 패턴 적용 확인 ✅

## 📦 Files Changed

### 🆕 New Files
- `templates/DESIGN.md.template` — 14섹션 DESIGN.md 스켈레톤 (C1)
- `specs/spec-3-04-ship-fixup/{spec,plan,task,walkthrough,pr_description}.md`

### 🛠 Modified Files
- `schema/blueprint-protocol.md` (+211, -17) — Step 1.5 NFR 신설 + Fill Executor 섹션 + Step 3 통합 출력 + 매핑 규칙 표 확장
- `templates/REQUIREMENTS.md.template` (+29, -25) — placeholder nested 정합
- `templates/AGENT.md.template` (+14, -8) — 동일 정합 + assets 경로 안내
- `templates/assets/README.md` (+53, -28) — Vite alias 단일 결정으로 교체
- `studio/vite.config.ts`, `vitest.config.ts`, `tsconfig.app.json`, `tsconfig.json` — `@assets` alias/path 추가
- `studio/src/lib/i18n.ts` — import 경로 `@/i18n` → `@assets/i18n`
- `studio/tokens/build.mjs` — `readFileSync` 경로 `templates/assets/tokens/` 로 수정
- `.gitignore` — `.harness-uninstall-backup-*/` 패턴 추가
- `backlog/phase-3.md`, `backlog/queue.md` — sdd 자동 갱신 (spec 표)

### 📦 Moved Files (git rename)
- `studio/src/i18n/ko.json` → `templates/assets/i18n/ko.json`
- `studio/src/i18n/en.json` → `templates/assets/i18n/en.json`
- `studio/tokens/tokens.json` → `templates/assets/tokens/tokens.json`
- `studio/tokens/tokens-brand-b.json` → `templates/assets/tokens/tokens-brand-b.json`

### 🗑 Deleted Files
- `templates/assets/i18n/.gitkeep`, `templates/assets/tokens/.gitkeep` (실파일로 대체됨)

**Total**: 7 commits / 20+ files changed / 4 file renames

## ✅ Definition of Done

- [x] FR1 (C1 DESIGN.md.template 신설) 충족
- [x] FR2 (C2 studio → templates/assets via @assets alias) 충족, 회귀 테스트 PASS
- [x] FR3 (C3 Fill Executor 명시) 충족
- [x] FR4 (C4 schema ↔ placeholder 정합) 충족
- [x] FR5 (PR #14 body 정직 채점) — **spec-3-04 merge 후 phase PR 본문 갱신 예정** (Task 9 의 머지 후 단계)
- [x] FR6 (잔재 정리: `.gitignore` 패턴) 충족. 물리 삭제는 사용자 이월
- [x] `walkthrough.md` / `pr_description.md` ship commit
- [x] `spec-3-04-ship-fixup` 브랜치 push
- [x] studio 회귀 테스트 PASS (12 files / 63 tests)

## 🔗 관련 자료

- Spec: `specs/spec-3-04-ship-fixup/spec.md`
- Plan: `specs/spec-3-04-ship-fixup/plan.md`
- Walkthrough: `specs/spec-3-04-ship-fixup/walkthrough.md`
- Phase: `backlog/phase-3.md`
- Phase PR (머지 대기): https://github.com/Changsik00/gen-design/pull/14
- 회고 근거: `/hk-phase-review` 결과 (phase-3 비판적 감사)
