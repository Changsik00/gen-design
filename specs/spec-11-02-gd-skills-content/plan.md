# Plan: spec-11-02 — `.claude/skills/gd-*` 본문 작성 + `.gd/memory/` 디스크 캐시

## 📋 Branch Strategy

- 신규 브랜치: `spec-11-02-gd-skills-content`
- 시작 지점: `phase-11-designer-onboarding-skill`
- 첫 task = 브랜치 생성

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **스킬 본문의 *길이 / 깊이* 정책**: SKILL.md 한 파일에 *모든 동작* 을 담을지, *간결 + handbook.md 참조* 로 갈지. 본 spec 은 *각 200-400 줄, 자기 완결성 + 외부 참조 최소* 로 작성 (디자이너가 외부 문서 0).
> - [ ] **gd-token 의 토큰 이름 잠금 enforce 방법**: 스킬이 *기계적* 검증을 하는지 (gd doctor 호출), *행동 규칙으로* 명시하는지. 본 spec 은 *행동 규칙 + gd doctor 검증 안내* — 실 검증은 spec-11-03 의 doctor 책임.
> - [ ] **`.gd/memory/` entry 의 frontmatter 형식**: Claude 의 auto memory 와 같은 `name` / `description` / `type` 사용할지, 독자 형식 사용할지. 본 spec 은 *Claude auto-memory 형식과 호환* — agent 가 동일 패턴으로 읽고 쓰기 쉬움.

> [!WARNING]
> - [ ] 스킬 본문이 *너무 자세하면* Claude Code 가 매 호출마다 큰 컨텍스트 로드 — 비용 ↑
> - [ ] *너무 간결하면* 능동 동작 안 됨

## 🎯 핵심 전략

### 4 스킬 + 5 memory entry 구조

```
.claude/skills/
├── gd-start.md          # 진입점 — 모든 다른 스킬 호출의 시작
├── gd-chat.md           # chat.md 작성 (가장 빈번)
├── gd-token.md          # TOKEN.md / tokens.json (디자인 결정)
└── gd-design.md         # DESIGN.md (디자인 컨벤션)

.gd/memory/
├── MEMORY.md            # 인덱스 (Claude auto-memory 패턴)
├── designer.md          # type: user
├── project.md           # type: project
├── decisions.md         # type: project (history)
└── feedback.md          # type: feedback
```

### 능동 스킬의 4 요건 (ADR-012 후보)

1. **위치 인지** — scaffold 표준 경로 (`chats/scenes/*.chat.md`, `templates/DESIGN.md` 등) 를 *명시적으로 알기*
2. **포맷 템플릿 내장** — 신규 파일 생성 시 *비어있는 파일 X*, *예시 채워진 템플릿* 제공
3. **없으면 자동 생성** — 디렉토리 + 파일 missing 시 사용자 확인 후 자동 mkdir + 템플릿 쓰기
4. **컨텍스트 자동 로딩** — 호출 시 관련 파일 모두 읽기 (FRONT.md / DESIGN.md / TOKEN.md / .gd/memory/ / catalog)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|---|---|---|
| 스킬 포맷 | Claude Code 신형 SKILL.md (frontmatter `name` / `description` + 본문) | 자동 로딩 / agent 가 메타 파싱 가능 |
| 스킬 길이 | 각 200-400 줄 | 자기 완결성 (외부 문서 참조 최소) + Claude 컨텍스트 비용 균형 |
| 한국어 | agent 출력 모두 한국어 | 디자이너 페르소나 (vision.md) |
| memory entry 형식 | Claude auto-memory 패턴 (`name` / `description` / `type`) | agent 가 일관 패턴으로 처리 |
| 토큰 이름 enforce | 스킬 행동 규칙 + gd doctor (spec-11-03) | 본 spec 은 *문서 + 규칙*, 실 기계 검증은 doctor |

## 📂 Proposed Changes

### 1. 스킬 본문 4건

#### [MODIFY] `presets-bundled/default/.claude/skills/gd-start.md`

구조 (약 350 줄):
- frontmatter (`name` / `description` / 자동 호출 조건)
- §1 사용자 환영 + 본 프로젝트 의도 (한 단락)
- §2 자동 로딩 컨텍스트 목록 (FRONT/AGENT/DESIGN/TOKEN + .gd/memory/)
- §3 디자이너 정보 1-2 질문 + designer.md append 동작
- §4 프로젝트 정보 1-2 질문 + project.md append 동작
- §5 4축 어휘 5분 요약 (chat ≡ Paper ≡ React ≡ shadcn ≡ MSW handler)
- §6 워크플로 다이어그램
- §7 다음 단계 — `/gd-token` → `/gd-design` → `/gd-chat` 순서 + 각 스킬 한 줄 설명
- §8 자주 묻는 질문 (FAQ) — "Paper 없어도 되나요?" 등

#### [MODIFY] `presets-bundled/default/.claude/skills/gd-chat.md`

구조 (약 350 줄):
- frontmatter
- §1 자동 로딩: FRONT.md (카탈로그) + DESIGN.md (어휘 매핑) + _shell.chat.md + 기존 scenes
- §2 "어떤 화면?" 질문 + memory/project.md 활용
- §3 카탈로그에서 후보 컴포넌트 추천 (LoginScene 예시)
- §4 파일 위치 자동 결정 + 디렉토리 없으면 생성
- §5 frontmatter 템플릿 (type/name/identity/shell/created)
- §6 Narrative (의도) walkthrough — 톤 / 타깃 / 목적
- §7 Structure (컴포넌트 어휘) walkthrough — 카탈로그 어휘만, i18n placeholder
- §8 History (이력) — 첫 작성은 한 줄
- §9 컴파일 명령 안내 + 결과 확인
- §10 안티 패턴 (카탈로그 외 어휘 / 직접 TSX 수정)

#### [MODIFY] `presets-bundled/default/.claude/skills/gd-token.md`

구조 (약 350 줄):
- frontmatter
- §1 자동 로딩: TOKEN.md + tokens.json + memory/project.md
- §2 **shadcn 표준 토큰 이름 잠금** — 이름 변경 요청 시 즉시 거부 + 이유 설명
- §3 light + dark 두 모드 함께 변경 유도 (한쪽만 변경 시 경고)
- §4 색 선택 시 즉시 WCAG 2.1 AA 검증 (8 페어)
  - foreground/background, primary/primary-foreground, destructive/destructive-foreground, muted-foreground/background, card-foreground/card, popover-foreground/popover, secondary-foreground/secondary, accent-foreground/accent
- §5 미달 시 가장 가까운 합격 OKLCH 제안 알고리즘
- §6 cva variant 매핑 (Button 6 variant 예시) — 토큰 변경 시 영향 받는 variant 안내
- §7 결정 후 memory/decisions.md append (왜 이 색)
- §8 안티 패턴 (이름 변경 / 한쪽 모드만 / 임의 hex 직접 사용)

#### [MODIFY] `presets-bundled/default/.claude/skills/gd-design.md`

구조 (약 350 줄):
- frontmatter
- §1 자동 로딩: DESIGN.md (현재) + FRONT.md Tier 3 카탈로그 + memory/project.md
- §2 빈 섹션 자동 감지 + 표시
- §3 Stitch 9 섹션 walkthrough — 각 섹션의 *질문 1-2개* + 작성 가이드
- §4 gen-design 확장 2 (i18n schema + Components 어휘 매핑)
- §5 §8 Components 섹션 — 디자이너가 *어휘 정의* + catalog 동기화 안내
- §6 작성 후 gd doctor 안내
- §7 안티 패턴 (DESIGN.md 에 픽셀값 / Tier 2 재정의 / 어휘 매핑 누락)

### 2. `.gd/memory/` 4 entry

#### [MODIFY] `presets-bundled/default/.gd/memory/MEMORY.md`

(기존 인덱스 보강 — 4 entry 설명 추가)

#### [NEW] `presets-bundled/default/.gd/memory/designer.md`

```markdown
---
name: designer-profile
description: 이 프로젝트를 작업하는 디자이너의 정보 (이름 / 톤 / 선호 / 도구)
type: user
---

<!-- gd-start 스킬이 채워나갑니다. 디자이너가 직접 편집해도 무방. -->
```

#### [NEW] `presets-bundled/default/.gd/memory/project.md`

(spec-11-01 의 postprocess 가 이미 생성 — 보강만)

#### [NEW] `presets-bundled/default/.gd/memory/decisions.md`

```markdown
---
name: design-decisions
description: 디자인 결정의 history (왜 이 색 / 왜 이 레이아웃)
type: project
---

<!-- gd-* 스킬들이 결정 시점에 한 줄씩 append. 최신이 위. -->

## YYYY-MM-DD <결정 요약>

- **결정**: <한 줄>
- **이유**: <왜>
- **영향**: <어떤 cva variant / chat / scene 에 영향>
```

#### [NEW] `presets-bundled/default/.gd/memory/feedback.md`

```markdown
---
name: feedback
description: 누적된 피드백 (디자이너가 거절한 제안 / 반복된 요청 등)
type: feedback
---

<!-- agent 가 발견할 때마다 append. 향후 세션에서 동일 제안 회피. -->
```

### 3. CLI postprocess 갱신

#### [MODIFY] `packages/create-gd-react/src/postprocess.ts`

`initMemoryIfPresent` 함수에 4 entry 모두 초기화 추가:
```ts
// 기존 — MEMORY.md + project.md
// 추가 — designer.md, decisions.md, feedback.md

const MEMORY_ENTRIES = [
  { name: "designer.md", template: DESIGNER_PLACEHOLDER },
  { name: "project.md",  template: PROJECT_PLACEHOLDER },
  { name: "decisions.md",template: DECISIONS_PLACEHOLDER },
  { name: "feedback.md", template: FEEDBACK_PLACEHOLDER },
];

for (const { name, template } of MEMORY_ENTRIES) {
  const path = join(memoryDir, name);
  if (!await stat(path).catch(() => null)) {
    await writeFile(path, template, "utf-8");
  }
}
```

#### [MODIFY] `packages/create-gd-react/__tests__/postprocess.test.ts`

각 entry 가 생성되는지 단위 테스트 추가 (idempotent 검증 포함).

### 4. 통합 테스트 갱신

#### [MODIFY] `packages/create-gd-react/scripts/test-integration.sh`

`EXPECTED_FILES` 에 추가:
- `.gd/memory/designer.md`
- `.gd/memory/decisions.md`
- `.gd/memory/feedback.md`
- 4 스킬 파일은 *본문 길이* 검증 (`wc -l` ≥ 100)

## 🧪 검증 계획

### 단위 테스트
```bash
pnpm --filter create-gd-react test --run
```

### 통합 테스트
```bash
bash packages/create-gd-react/scripts/test-integration.sh
```

### 수동 검증 시나리오

1. `npx <local-tarball> /tmp/test-skill --offline` 후 4 스킬 파일 + 5 memory entry 존재
2. 각 스킬 파일을 Claude Code 에서 *읽기 (수동 검토)* — frontmatter 유효 + 본문 구조 확인
3. `.gd/memory/MEMORY.md` 인덱스가 4 entry 모두 링크하는지
4. `.gd/memory/designer.md` / `project.md` 등 frontmatter 형식 일관성

## 🔁 Rollback Plan

- 스킬 4 파일 / memory 4 entry 통째 삭제
- postprocess.ts 의 `initMemoryIfPresent` 되돌리기
- npm publish 안 한 상태이므로 외부 영향 0

## 📦 Deliverables 체크

- [x] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
