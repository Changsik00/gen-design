# Plan: spec-11-04 — Dogfooding Alpha (zero → React 실증)

## 📋 Branch Strategy

- 신규 브랜치: `spec-11-04-dogfooding-alpha`
- 시작 지점: `phase-11-designer-onboarding-skill`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **진행 방식**: dennis 가 *직접 답변* 하는 interactive 모드 vs Claude 가 *합리적 디자이너 답변 simulation*. 본 spec 은 *후자 (simulation)* 로 진행하되, dennis 가 중간에 답변 조정 가능. 보고서에 "simulation 명시".
> - [ ] **scaffold 결과 보존 위치**: `experiments/dogfood-alpha/` — git 추적. node_modules / dist / .env.local 은 .gitignore (이미 scaffold 안 .gitignore 적용).
> - [ ] **`gd doctor` 실행 채널**: preset 의 `pnpm gd doctor` 는 phase-12 (npm package 분리) 까지 미동작. 본 spec 은 *studio 의 `gen-design doctor` 를 직접 호출* — 동일 결과 + 한계 명시.

> [!WARNING]
> - [ ] dennis 본인 dogfooding 은 *편향* — 외부 alpha 가 아님. 보고서에 *알고 있어서 우회한 경로* vs *진짜 막힘* 분리 기록.
> - [ ] preset 의 `pnpm gd` 명령 동작 안 함을 *발견 사항* 으로 기록 (phase-12 후보).

## 🎯 핵심 전략

### dogfooding 흐름 (시뮬레이션 + 실 명령)

```
1. scaffold (실)            → experiments/dogfood-alpha/ 생성 (--offline)
2. /gd-start (sim)          → memory entries 채우기 (designer / project)
3. /gd-chat   (sim)         → chats/scenes/login.chat.md 작성
4. gd react   (실)          → src/scenes/login.tsx 생성
5. gd doctor  (실)          → 진단 캡처
6. pnpm dev   (옵션)        → 시각 확인 (시간 허용 시)
7. 보고서 작성              → experiments/dogfooding-alpha-2026-05.md
```

→ 각 단계마다 *시간 측정* + *막힘 기록* + *명령 횟수* 카운트.

### 디자이너 페르소나 (simulation 입력 표준)

| 질문 | 답변 |
|---|---|
| 호칭 | dennis |
| 작업 스타일 | 빠른 결정, 명확한 답 선호 |
| 프로젝트 한 줄 | "1인 개발자를 위한 SaaS 시작 도구" |
| 타깃 | "백엔드 개발자가 프론트엔드까지 빠르게" |
| 핵심 가치 | "결제 / 인증 / 대시보드 30초 시작" |
| 도메인 | SaaS |
| 브랜드 톤 | "전문적이면서 친근 (formal-friendly)" |

→ 이 답변들은 *합리적 SaaS 디자이너* 답변의 표준. 보고서에 *simulation* 명시.

### 주요 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 진행 방식 | Simulation (합리적 답변) | dennis 답변을 매번 받는 것보다 빠른 검증 + 보고서에 명시하면 정직 |
| scaffold 위치 | `experiments/dogfood-alpha/` (git 추적) | 미래 alpha 재현 가능 |
| `gd doctor` 실행 채널 | studio 의 `gen-design doctor` 직접 호출 | preset packaging 은 phase-12 |
| 보고서 형식 | 한국어 markdown, 정량 + 정성 분리 | 추적 가능 + 분석 가능 |

## 📂 Proposed Changes

### 1. `experiments/dogfood-alpha/` — scaffold 결과

`npx create-gd-react dogfood-alpha --offline` 으로 생성된 **41 파일** 모두 git 추적.

단 *node_modules / dist / .env.local* 은 `experiments/dogfood-alpha/.gitignore` 의 규칙으로 자동 제외 (scaffold default 의 `.gitignore` 그대로).

### 2. dogfooding 작업 산출물

#### `experiments/dogfood-alpha/.gd/memory/`

`/gd-start` 시뮬레이션의 결과 — designer.md / project.md 의 본문 채워짐.

#### `experiments/dogfood-alpha/chats/scenes/login.chat.md`

`/gd-chat` 시뮬레이션의 결과 — Narrative + Structure (Card + Form + Input + Label + Button) + History 3층.

#### `experiments/dogfood-alpha/src/scenes/login.tsx`

`gd react` 출력 결과 — `// @gd:` annotation + 컴파일된 TSX.

### 3. `experiments/dogfooding-alpha-2026-05.md` — 핵심 보고서

```markdown
# Dogfooding Alpha — 2026-05-22

## 0. Disclaimer (편향 인지)

본 alpha 는 dennis (시스템 작성자) 의 simulation. 외부 디자이너 alpha 아님.
*알고 있어서 우회한 경로* vs *진짜 막힘* 명시 분리.

## 1. 정량 측정

| 단계 | 소요 시간 | 명령 횟수 | 에러 수 |
|---|---|---|---|
| ...

## 2. 단계별 정성 기록

### 2.1 scaffold (npx create-gd-react)
- 시간:
- 성공 여부:
- 막힘:
- handbook 누락:

### 2.2 /gd-start
...

### 2.3 /gd-chat (login.chat.md 작성)
...

### 2.4 gd react
...

### 2.5 gd doctor
...

## 3. 발견 사항

### 3.1 진짜 막힘 (외부 디자이너도 막혔을 것)
### 3.2 알고 있어서 우회 (외부 디자이너는 막혔을 것)
### 3.3 스킬 본문 부정확 / 모호
### 3.4 handbook / FRONT.md / AGENT.md 누락

## 4. phase-12 후보

| 우선순위 | 항목 | 출처 |
|---|---|---|
| ...

## 5. 결론
```

### 4. backlog/queue.md icebox 갱신 (선택)

phase-12 후보 항목 추가 (예: `@gd/cli` 분리, `gd api`, 실 외부 디자이너 alpha).

## 🧪 검증 계획

### 통합 시나리오 — 전 흐름 실제 실행

```bash
# 1. scaffold
mkdir -p /tmp/dogfood-test
cd /tmp/dogfood-test
node /Users/dennis/Project/Design/packages/create-gd-react/dist/cli.js dogfood-alpha --offline --no-install
cp -r dogfood-alpha experiments/  # workspace 로 복사

# 2-3. memory + chat.md (Claude / agent 가 작성)
# (직접 파일 편집 — 스킬 본문 시뮬레이션)

# 4. gd react (studio 의 CLI 호출 — preset 의 pnpm gd 는 미동작)
cd /path/to/Design
pnpm --filter studio exec tsx scripts/gen-design.ts react login \
  --chat-root experiments/dogfood-alpha/chats \
  --output experiments/dogfood-alpha/src/scenes/login.tsx

# 5. gd doctor
pnpm --filter studio exec tsx scripts/gen-design.ts doctor \
  --chat-root experiments/dogfood-alpha/chats \
  --templates-root experiments/dogfood-alpha/templates
```

### 회귀 검증

- `pnpm --filter studio test --run` — 1055 PASS 유지
- `pnpm --filter create-gd-react test --run` — 28 PASS 유지

## 🔁 Rollback Plan

- `experiments/dogfood-alpha/` 삭제
- `experiments/dogfooding-alpha-2026-05.md` 삭제
- backlog/queue.md icebox 변경 되돌리기

## 📦 Deliverables 체크

- [x] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
