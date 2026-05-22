# spec-11-02: `.claude/skills/gd-*` 스킬 본문 작성 + `.gd/memory/` 디스크 캐시

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-11-02` |
| **Phase** | `phase-11` |
| **Branch** | `spec-11-02-gd-skills-content` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-11-01 에서 `npx create-gd-react` scaffold + 41 파일 default preset 이 완성됐다. 그러나 scaffold 안의 `.claude/skills/gd-{start,chat,token,design}.md` 는 *placeholder + 자동 로딩 명세* 만 있고 *실제 동작 본문* 이 없다.

또한 `.gd/memory/MEMORY.md` 인덱스는 있지만, 스킬이 *어떻게 읽고 쓰는지* (designer.md / project.md / decisions.md / feedback.md 의 실제 활용 패턴) 가 정의되지 않았다.

### 문제점

- 디자이너가 Claude Code 에서 `/gd-start` 호출해도 *placeholder 만 보임* — 능동 가이드 동작 X
- chat.md / DESIGN.md / TOKEN.md 작성 시 *어휘 추천 / 파일 위치 인지 / 포맷 템플릿 / 없으면 자동 생성* 같은 능동 동작 부재
- session 압축 시 디자이너 정보 (브랜드 / 톤 / 프로젝트 목적) 손실 — `.gd/memory/` 가 비어있음

### 해결 방안 (요약)

4개 `gd-*` 스킬의 *실제 본문* 작성 + `.gd/memory/` 의 *세부 entry* (designer / project / decisions / feedback) 초기 양식. 각 스킬은 *능동 행동* (위치 인지 / 포맷 템플릿 / 없으면 생성 / 컨텍스트 자동 로딩) 을 명시적으로 정의.

## 🎯 요구사항

### Functional Requirements

1. **gd-start** — 첫 실행 / `/gd-start` 호출 시:
   - `.gd/memory/MEMORY.md` + 4 entry (designer / project / decisions / feedback) 자동 로딩
   - 디자이너 정보 (이름 / 톤 / 선호) 1-2 질문 후 `.gd/memory/designer.md` append
   - 프로젝트 정보 (브랜드 / 타깃 / 도메인) 1-2 질문 후 `.gd/memory/project.md` append
   - handbook §1 (4축 어휘) + §4 (워크플로) 5분 요약 제공
   - 다음 단계 안내: `/gd-token` → `/gd-design` → `/gd-chat` 순서

2. **gd-chat** — 새 chat.md 작성 시:
   - 자동 로딩: `templates/FRONT.md` (Tier 2/3 카탈로그) + `templates/DESIGN.md` (도메인 어휘) + `chats/_shell.chat.md` (외각) + 기존 `chats/scenes/*.chat.md` (패턴)
   - "어떤 화면?" 질문 + `.gd/memory/project.md` 활용
   - 카탈로그에서 후보 컴포넌트 제안 (예: LoginScene → Card + Form + Input + Label + Button)
   - `chats/scenes/<name>.chat.md` 자동 생성 (디렉토리 없으면 함께)
   - frontmatter 템플릿 자동 삽입 (`type` / `name` / `identity` / `shell.inherit` / `created`)
   - 3층 (Narrative + Structure + History) 작성 walkthrough
   - 컴파일 명령 안내: `pnpm gd react chats/scenes/<name>.chat.md`

3. **gd-token** — TOKEN.md / tokens.json 작성 시:
   - 자동 로딩: `templates/TOKEN.md` + `templates/assets/tokens/tokens.json` + `.gd/memory/project.md` (브랜드 톤)
   - **shadcn 표준 토큰 이름은 잠금** — 값만 조정 (이름 변경 시도 시 거부)
   - 색 선택 시 즉시 WCAG 2.1 AA 대비 검증 (foreground/background, primary/primary-foreground 등)
   - 미달 시 가장 가까운 합격 OKLCH 제안
   - light + dark 두 모드 *함께* 정의 유도 (한쪽만 수정 시 경고)
   - 결정 후 `.gd/memory/decisions.md` 에 *왜 이 색* 한 줄 append

4. **gd-design** — DESIGN.md 작성 시:
   - 자동 로딩: `templates/DESIGN.md` 현재 상태 + `templates/FRONT.md` Tier 3 카탈로그 (Components 섹션) + `.gd/memory/project.md`
   - 빈 섹션 감지 → 디자이너에게 1-2 문장 채우도록 요청 (직접 짐작 금지)
   - Stitch 9 섹션 순서 walkthrough (Overview / Brand / Colors / Typography / Layout / Elevation / Shapes / Components / Iconography) + 확장 2 (i18n schema / Components 어휘 매핑)
   - 작성 후 `pnpm gd doctor` 안내

5. **`.gd/memory/` entry 초기 양식**:
   - `MEMORY.md` — 인덱스 (이미 있음, 보강)
   - `designer.md` — 디자이너 정보 (frontmatter + 빈 본문 + 작성 가이드)
   - `project.md` — 프로젝트 정보 (frontmatter + 빈 본문 + 작성 가이드)
   - `decisions.md` — 결정 history (frontmatter + 시간순 append 패턴)
   - `feedback.md` — 누적 피드백 (frontmatter + 카테고리별)

### Non-Functional Requirements

1. 각 스킬 본문은 *능동 동작 명세* — 단순 문서가 아니라 *행동 지시* (예: "이 파일이 없으면 자동 생성 + 사용자에게 알림")
2. 모든 스킬은 *한국어 우선* — agent 출력도 한국어
3. 스킬 파일은 Claude Code 신형 `SKILL.md` 포맷 (frontmatter `name` / `description` / 본문)
4. session 압축에도 안전 — `.gd/memory/` 가 디스크 캐시 역할 (Claude Code 의 auto memory 와 별개)
5. 토큰 이름 잠금 규칙은 *기계적으로 enforce* — gd-token 이 이름 변경 요청 시 즉시 거부 + 이유 설명

## 🚫 Out of Scope

- `gd doctor` CLI 구현 (spec-11-03)
- 스킬이 호출하는 명령의 *실제 동작* (예: `gd react` 컴파일 자체) — 이미 studio 에 구현됨
- agent role-play 가 아닌 *실 디자이너* alpha 테스트 (spec-11-04)
- 추가 스킬 (예: gd-doctor / gd-merge 등) — 본 spec 은 4개만
- `gd build-tokens` (tokens.json → globals.css) 자동화 — 후속 spec

## 📑 ADR 후보

- [x] ADR 가치 있는 결정 있음 → 후보: `ADR-012-gd-skills-active-pattern` (type: convention — *능동 스킬* 의 4 요건: 위치 인지 / 포맷 템플릿 / 자동 생성 / 컨텍스트 자동 로딩 + `.gd/memory/` 디스크 캐시 패턴)

## ✅ Definition of Done

- [ ] `presets-bundled/default/.claude/skills/gd-start.md` 본문 작성 (능동 동작 명세 + 워크플로 + handbook 요약)
- [ ] `presets-bundled/default/.claude/skills/gd-chat.md` 본문 작성 (카탈로그 추천 + frontmatter 템플릿 + 3층 walkthrough)
- [ ] `presets-bundled/default/.claude/skills/gd-token.md` 본문 작성 (shadcn 토큰 이름 잠금 + WCAG AA 자동 검증 + light/dark 동기 + decisions append)
- [ ] `presets-bundled/default/.claude/skills/gd-design.md` 본문 작성 (Stitch 9 + gen-design 확장 2 / 빈 섹션 감지)
- [ ] `presets-bundled/default/.gd/memory/` 4 entry (designer / project / decisions / feedback) 초기 양식
- [ ] `packages/create-gd-react/src/postprocess.ts` 가 새 entry 들 초기화 동작 갱신 (단위 테스트 포함)
- [ ] 통합 테스트: scaffold 후 4 스킬 파일 + 5 memory entry 존재 + content 검증
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-11-02-gd-skills-content` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
