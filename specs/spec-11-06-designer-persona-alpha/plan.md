# Plan: spec-11-06 — Designer Persona Alpha (미경의 대시보드)

## 📋 Branch Strategy

- 신규 브랜치: `spec-11-06-designer-persona-alpha`
- 시작 지점: `phase-11-designer-onboarding-skill` (spec-11-05 fix 포함)

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **agent 의 *미경 roleplay strict*** — Claude 가 *시스템 작성자 지식 X*. shadcn / cn / cva / Tailwind 모름 표현. dennis 가 *agent role* 로 가이드.
> - [ ] **답변 패턴**: 미경 = 짧음 / 시각 우선 / 모르면 *물어봄* (추측 X) / 영어 거부감 / 명령 두 번 실행 안 함
> - [ ] **시각 결과 검증** — `pnpm dev` 가능 시 실 실행. 불가 시 *컴파일된 TSX* 확인 (단, 미경은 *TSX 안 봄*).

> [!WARNING]
> - [ ] agent 가 *미경 깨고 dennis 모드* 로 돌아가면 보고서에 명시 — *깨진 횟수* 도 발견 사항.

## 🎯 핵심 전략

### 미경 페르소나 *알고 / 모름* 표

| 분야 | 알고 | 모름 |
|---|---|---|
| Figma | ✅ 5년차, 자동 레이아웃 능숙 | — |
| CSS | flexbox 알고 있음, 직접 안 씀 | grid, Tailwind |
| React | 들어봤음 | 컴포넌트 / JSX 작성법 |
| 디자인 시스템 | Figma 컴포넌트 | shadcn 의 *코드 복사 소유* 모델 |
| 도구 | npm 들어봤음 | npx / pnpm 차이, monorepo |
| 디자인 명세 | 노션 / Figma 코멘트 | DTCG / chat.md / 토큰 형식 |
| AI | ChatGPT 사용 | Claude Code / MCP / 스킬 |
| 시각 확인 | Figma preview / 브라우저 | dev server / hot reload |

### 미경의 *답변 패턴*

- 짧음 (1-2 문장)
- "음... " / "어떻게 시작하는 거예요?"
- 시각 결과 안 보이면 *바로* 물어봄 ("결과는 어디서 봐요?")
- 영어 용어 만나면 *바로* "그게 뭐예요?"
- 자기 답이 맞는지 *확신 부족* → "이렇게 하면 되나요?"

### 흐름 (각 단계의 *미경 답변 표준*)

```
1. scaffold (dennis 가 명령 안내)
   미경: "이 npx 명령 한 번 실행하면 되나요?"
   결과: experiments/dogfood-alpha-v2/

2. /gd-start (agent = 미경 roleplay)
   질문: 호칭 → "미경이요"
   질문: 작업 스타일 → "음... 빠르게 보고 결정하는 편이에요"
   질문: 프로젝트 → "TaskFlow 라는 SaaS 만들고 싶어요. 1인 개발자용."
   질문: 타깃 → "스타트업 초기 개발자요"

3. /gd-chat (미경 답변)
   "대시보드 화면 먼저 만들고 싶어요. 통계 카드 몇 개랑 최근 활동 리스트."
   카탈로그 추천 받으면 → "네 그렇게 해주세요" (구체 어휘 모름)
   chat.md frontmatter → dennis 가 보여주고 미경은 *읽기만*
   Structure → dennis 가 *bare 형식* 으로 작성. 미경 검토만.

4. gd react
   명령 실행 → 미경: "결과는 어디서 봐요?"
   dennis: "src/scenes/dashboard.tsx 생성됐어요. 또는 pnpm dev 로 브라우저에서"
   pnpm dev 시도 (가능 시)

5. gd doctor
   미경 직접 명령 실행 → 한국어 메시지 보고 *어떻게 해석* 하는지 기록
   진단 보면 "이 토큰이 뭐예요?" 같은 질문

6. 보고서 작성
```

### 주요 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 페르소나 strict | dennis 가 agent role, Claude 가 미경 답변 | 일관 roleplay 가능 |
| 디렉토리 | `experiments/dogfood-alpha-v2/` 새로 | v1 보존 (비교 가능) |
| 시각 확인 | `pnpm dev` 시도 — 불가 시 TSX 검사 만 | 미경은 TSX 안 봄, 단 검증용으론 OK |
| 보고서 분리 | `dogfooding-alpha-v2-2026-05.md` | v1 과 명확히 분리 |
| `pnpm install` | scaffold 후 *실제* 설치 → 시각 결과 가능 | (단 시간 5분+, 옵션) |

## 📂 Proposed Changes

### 1. scaffold — `experiments/dogfood-alpha-v2/`
`node packages/create-gd-react/dist/cli.js taskflow --offline --no-install` → 결과를 `experiments/dogfood-alpha-v2/` 로 복사. (spec-11-05 fix 모두 반영된 상태)

### 2. memory entries 채움 — 미경의 답변
- `designer.md`: 미경 / 빠른 결정 / 시각 우선 / Figma 능숙 / React 0
- `project.md`: TaskFlow / 1인 개발자 SaaS / 스타트업 초기 / formal-friendly

### 3. `chats/scenes/dashboard.chat.md`
- Narrative: 미경의 *왜* (간단히 — "사용자가 들어왔을 때 첫 화면, 통계 + 최근 활동")
- Structure: bare 형식 — Card (Stats) × 3 + List
- 카탈로그 외 어휘 만나면 *Tier 3 composite 후보* 표시 (예: StatCard 가 catalog 에 있는지 확인)

### 4. `gd react` 실행
- `src/scenes/dashboard.tsx` 생성
- 결과 확인 (annotation + 본문 컴파일)

### 5. `gd doctor` 실행
- 진단 캡처
- 한국어 메시지 / 해결 안내 미경의 *해석 가능성* 평가

### 6. (가능 시) `pnpm install + pnpm dev`
- node_modules 설치 (시간 측정)
- Vite dev server 기동 (시각 확인)
- 결과 — *Card 가 보이는지* / Tailwind 작동하는지

### 7. 보고서 작성
- v1 과 비교표 (정량 + 정성)
- 미경의 *모름 트래킹* — 25+ 항목 예상

## 🧪 검증 계획

### 통합 시나리오 — 전 흐름 미경 페르소나
```
1. scaffold 시간 측정
2. gd-start memory 채움 → designer.md / project.md 보존
3. dashboard.chat.md 작성 (Structure 풀 본문)
4. gd react → dashboard.tsx 1500+ bytes 확인
5. gd doctor → 진단 결과 정합
6. (옵션) pnpm install + dev
```

### 회귀
- `pnpm --filter studio test --run` → 1059 PASS
- `pnpm --filter create-gd-react test --run` → 28 PASS

## 🔁 Rollback Plan
- `experiments/dogfood-alpha-v2/` 삭제
- 보고서 삭제

## 📦 Deliverables 체크
- [x] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) ship + PR
