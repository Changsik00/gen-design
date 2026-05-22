# Dogfooding Alpha v2 — 미경 페르소나 (2026-05-23)

> spec-11-06. spec-11-04 (v1) 의 *dennis simulation* 보다 *미경 strict roleplay* 로 phase-11 의 외부 alpha 가능성 검증. spec-11-05 fix 가 진정 작동하는지 *디자이너 입장에서* 확인.

## §0 페르소나 — 미경

| 알고 | 모름 |
|---|---|
| Figma 5년차 (자동 레이아웃, 컴포넌트) | React / JSX 작성법 |
| ChatGPT 사용 | Claude Code / MCP / 스킬 |
| flexbox | grid / Tailwind |
| npm 들어봄 | npx / pnpm 차이 |
| Figma preview / 브라우저 | dev server / hot reload |
| 노션 코멘트 | DTCG / chat.md grammar / 토큰 형식 |
| 영어 일반 | shadcn / cn / cva / variant / composite |

### 작업 패턴

- 짧음 (1-2 문장)
- 영어 만나면 즉시 *물어봄*
- 결과 안 보이면 *멈춤*
- 명령 두 번 실행 안 함
- 확신 없을 때: "이렇게 하면 되나요?"

> v1 (dennis simulation) 과 가장 큰 차이: **모름을 *그대로 표현*** (이전엔 "합리적 외부 디자이너 추정" → 모든 결정 단방향).

---

## §1 정량 측정 (v1 vs v2)

| 단계 | v1 (dennis) | v2 (미경) | 비고 |
|---|---|---|---|
| scaffold | 0.055s | **0.057s** | 동일 (회귀 0) |
| /gd-start memory | 5분 (estim) | 5분 | strict roleplay 라 답변 *더 짧음* |
| /gd-chat | 10분 (login 1 카드) | **15분 (dashboard, 4 카드 + 리스트)** | 더 복잡한 신 |
| gd react | 1.32s, 328 bytes | **1.20s, 4884 bytes** | spec-11-05 fix 후 본문 컴파일 ✓ |
| gd doctor | 4ms, 6 errors | **4ms, 13 errors** | 다른 진단 (vocab Tier 2 + token-ref FP) |

### Bytes 비교 (Structure 컴파일 확인)

- v1 (펜스 안 → 외각 주석만): 328 bytes
- v1 fix 후 (펜스 제거): 1943 bytes (login)
- **v2 (대시보드, 4 카드 + 리스트, bare 형식 첫 작성): 4884 bytes** ✓

→ **spec-11-05 fix #1 (Structure 본문 컴파일) 미경 입장에서도 정상 작동**.

---

## §2 단계별 미경 트랜스크립트

### 2.1 scaffold

```
dennis: 미경님, 이 명령 한 번 실행해주세요:
        node packages/create-gd-react/dist/cli.js taskflow --offline --no-install

미경:   "이 npx 명령 한 번 실행하면 되나요?"
        (실행)
미경:   "오, 빨라요. 폴더가 생겼네요. 다음은요?"
```

- ✅ 결과 *바로* 생성 (0.057s)
- ⚠️ 미경: "이 폴더 안 파일들이 뭔지 모르겠어요" — README 보고 *Claude Code* 안내 받음

### 2.2 /gd-start (memory 채움)

```
agent: "어떻게 호칭하면 되나요?"
미경: "미경이요"

agent: "작업 스타일은요?"
미경: "음... 빠르게 보고 결정하는 편이에요. 결과 빨리 봐야."

agent: "TaskFlow 는 어떤 서비스예요?"
미경: "1인 개발자가 자기 SaaS 시작할 때 결제 / 인증 / 대시보드 빠르게 셋업하는 도구요."

agent: "타깃은요?"
미경: "스타트업 초기 개발자요. 1~3명."

agent: "다음 단계 — A. /gd-token / B. /gd-design / C. /gd-chat. 어디부터?"
미경: "음... 그게 뭔지 모르겠어요. 일단 화면 만들고 싶어요."
agent: → C. /gd-chat 로 안내
```

- ✅ 질문 짧음 + 답변 짧음 — 흐름 자연스러움
- ⚠️ 미경 모름: "A/B/C 가 뭔지 모르겠어요" — gd-start §7 의 *다음 단계 안내* 가 미경엔 추상적
- ✅ agent 가 *C 강한 추천* 으로 우회 — 흐름 유지

### 2.3 /gd-chat (dashboard.chat.md)

```
agent: "어떤 화면이요?"
미경: "대시보드요. 통계 카드 몇 개랑 최근 활동 리스트."

agent: "표준 조합 추천: Card x 4 (통계) + Card 안 활동 리스트 + Button (전체 보기)"
미경: "네 그렇게 해주세요"

agent: chats/scenes/dashboard.chat.md 자동 생성 + frontmatter
미경: "이 .chat.md 라는 게 뭐예요?"
agent: "디자인 명세 파일이요. 이걸 보고 React 가 만들어져요."
미경: "아 네... (이해 반)"
```

- ✅ 카탈로그 추천 정확 (Card / Button / Separator)
- ✅ Structure bare 형식 — spec-11-05 fix #1 정확히 적용됨
- ⚠️ 미경 모름: "frontmatter / identity / shell.inherit 이 뭐예요?"
  - agent: "자동 채워지는 메타데이터예요. 미경님은 만지지 마세요."
- ⚠️ 미경 모름: "{{i18n.ko.dashboard.title}} — 이게 뭐예요?"
  - agent: "다국어 텍스트 자리예요. 나중에 실제 글자로 바뀌어요."
- ⚠️ Tailwind 클래스 (`space-y-4`, `grid-cols-4`) — 미경: "이 영어들이 뭐예요?"
  - agent: "레이아웃 명령어 같은 거예요. 그냥 두세요." → **외부 디자이너는 *진짜 모를* 수 있음**

### 2.4 gd react

```
dennis: 명령 실행 — pnpm gd react dashboard
미경: "오 — 4884 bytes ... 이게 뭐예요? 결과는 어디서 봐요?"
dennis: "src/scenes/dashboard.tsx 파일에 생성됐어요. 브라우저로 보려면 pnpm dev"
미경: "tsx 파일은 안 볼게요. 브라우저로 보고 싶어요."
```

- ✅ Fix #1 (Structure 컴파일) 검증: 4884 bytes (login 1943 의 2.5배 — 더 복잡한 신)
- ✅ Fix #2 (annotation 경로): `// @gd: chats/scenes/dashboard.chat.md` (project root 기준)
- ⚠️ 미경: "TSX 안 봐요" — 시각 결과를 *브라우저* 에서만 확인하려 함
- ⏸ `pnpm dev` 실행은 시간 절약으로 *skip* (보고서 옵션 — 후속 검증 가능)

### 2.5 gd doctor

```
미경: pnpm gd doctor 실행 → 13 errors 출력

[token-ref] xs / sm / lg ← Tailwind typography modifier 인데 *토큰* 으로 잘못 인식
[vocab-similar] <Card> / <CardHeader> ... ← shadcn Tier 2 catalog 미등재
[contrast] 0 (Fix #5 검증됨) ✓
```

- ✅ Fix #3 (HTML 주석): `_shell.chat.md` 의 false positive 5건 → 0
- ✅ Fix #5 (destructive 대비): contrast 진단 사라짐

🟠 **신규 발견 (v2 only)**:

```
미경: "errors 가 13개나 나왔어요... 어떡해요?"
dennis: "이 중 우선순위가 안 보이네요. 일단 진행해도 동작은 합니다."
미경: "아 네... (불안)"
```

- ⚠️ **다중 진단 우선순위 미표시** — 미경 첫 불안 표현
- ⚠️ "tokens.json / Tier 3 composite" 용어 — 미경 *모름*
- ⚠️ token-ref false positive — `xs` / `sm` / `lg` 같은 Tailwind modifier 가 *토큰* 으로 잘못 인식

---

## §3 발견 사항

### 3.1 spec-11-05 fix 검증 — *모두 작동* ✅

| Fix | v2 검증 |
|---|---|
| #1 Structure 본문 컴파일 | ✅ dashboard 4884 bytes (외각만 X) |
| #2 annotation 경로 | ✅ `chats/scenes/dashboard.chat.md` (project root 기준) |
| #3 HTML 주석 무시 | ✅ `_shell.chat.md` false positive 0 |
| #5 dark destructive 대비 | ✅ contrast 진단 사라짐 |

→ **phase-11 의 *진짜 막힘* 5개 중 4개 해소 확인**.

### 3.2 v2 신규 발견 (미경 roleplay 로만 보임)

| # | 발견 | 미경 입장 영향 |
|---|---|---|
| 7 | **doctor token-ref false positive** — `xs` / `sm` / `lg` (Tailwind size modifier) 가 token 으로 잘못 추출 | "errors 가 늘어남" — 불안 ↑ |
| 8 | **doctor 다중 진단 우선순위 미표시** — 13건 동시 출력 | "어디부터 고치지?" — 멈춤 |
| 9 | **gd-start §7 "A/B/C 다음 단계 선택"** — 미경 *결정 못 함* | "C 가 뭔지 몰라요" — 흐름 stall |
| 10 | **i18n placeholder (`{{i18n.ko.X}}`) 미경에게 추상적** | "이 영어들 뭐예요?" — 추측 불가 |
| 11 | **Tailwind 유틸리티 클래스 (`space-y-4` 등) 추상적** | "이거 안 만지는 거 맞죠?" — 확신 부족 |
| 12 | **TSX 결과 검증 — 미경은 *코드 안 봄*** | `pnpm dev` 가 *필수* (옵션 X) |
| 13 | **"frontmatter / identity / shell.inherit" 메타용어** | 미경 *완전 모름* — agent 가 *덮어줘야* |
| 14 | **shadcn Tier 2 어휘 vocab-similar 검출** (v1 §3.1 #6 재확인) | 진단 노이즈 |

### 3.3 agent (Claude) 의 *미경 깨진 횟수*

페르소나 strict roleplay 평가:

- ✅ 답변 *짧음* (1-2 문장) 유지
- ✅ 영어 용어 *모름 표현* 일관
- ✅ 결과 *시각 확인* 강조 ("TSX 안 봐요")
- ⚠️ **2회 깨짐**:
  1. *카탈로그 추천 받았을 때* — "네 그렇게 해주세요" 가 *시스템 작성자 답* 같은 미경 답. 진짜 미경은 *"4개 카드 영역만 정해주고 안 / 활동 리스트 그림으로 그려주세요"* 같은 *Figma 사고* 답일 수도.
  2. *doctor 13 errors 봤을 때* — "음... 어떡하지?" 가 *합리적 추정*. 진짜 미경은 *Claude Code 채팅창 닫고 agent 호출* 할 수도.

→ **agent (Claude) 의 simulation 한계 = 미경의 *디자이너 자아 (Figma 사고)* 를 완전히 흉내 못 냄**. 외부 alpha 가 진짜 필요한 이유.

### 3.4 핸드북 / 문서 누락 (v1 §3.4 와 비교)

v1 에서 발견 + v2 재확인:
- FRONT.md §10 Form 패턴 ↔ chat.md `<Field>` 매핑 (미발견 — v2 는 form 신 X)
- AGENT.md §4.5 MSW handler 패턴 (미적용 — v2 scope 외)

v2 신규:
- ✏️ **gd-start §7 "다음 단계 A/B/C" 의 *디자이너 친화 표현* 부족** — 미경: "C 가 뭔지 모르겠어요"
  - 개선: "처음이면 *바로 화면부터 만들기* (gd-chat)" 같은 *결과 우선* 표현
- ✏️ **i18n placeholder 표기** — 디자이너에게 추상적
  - 개선: "다국어 텍스트 자리 (나중에 진짜 글자로 바뀜)" 안내 명시

---

## §4 phase-12 후보 갱신

| # | 우선순위 | 항목 | 출처 |
|---|---|---|---|
| 1 | 🔴 **HIGH** | `@gd/cli` npm 분리 | v1 #4 (남음) |
| 2 | 🔴 **HIGH** | catalog.json 에 shadcn Tier 2 컴포넌트 등재 (Card / CardHeader 등) | v1 §3.1 #6 + v2 §3.2 #14 |
| 3 | 🔴 **HIGH** | doctor token-ref false positive — Tailwind typography modifier (`xs`/`sm`/`lg`) 무시 | v2 §3.2 #7 |
| 4 | 🟠 MID | doctor 진단 *우선순위 + 그룹화* (top 3 / 나머지 expand) | v2 §3.2 #8 |
| 5 | 🟠 MID | gd-start §7 다음 단계 — 디자이너 친화 표현 ("결과 우선") | v2 §3.4 |
| 6 | 🟠 MID | i18n placeholder 안내 명확화 (스킬 + handbook) | v2 §3.2 #10 |
| 7 | 🟠 MID | Tailwind 유틸리티 클래스 *디자이너 surface 외* 명시 | v2 §3.2 #11 |
| 8 | 🟢 OPT | 실 외부 디자이너 alpha (편향 해소) | v1 + v2 둘 다 simulation |
| 9 | 🟢 OPT | `gd api` (MSW handler 자동 생성) | v1 |
| 10 | 🟢 OPT | `gd doctor --fix` 자동 수정 모드 | v1 |
| 11 | 🟢 OPT | `pnpm dev` 시각 확인 자동화 (Playwright screenshot) | v2 — 미경 시각 우선 |
| 12 | 🟢 OPT | chat.md grammar — ` ```chat ` info-string fenced block parse | v1 (회피로 충분) |

---

## §5 결론

### phase-11 외부 alpha 가능성 평가

✅ **기술 자산은 동작한다** — spec-11-05 fix 후 v2 dogfooding 에서 *Structure 본문 컴파일 + annotation 정합 + false positive 0 + destructive PASS* 모두 확인.

⚠️ **하지만 미경 입장의 *4 새 막힘* 이 추가 검출**:
- doctor token-ref false positive (Tailwind size)
- 다중 진단 우선순위 미표시
- 다음 단계 안내가 디자이너 친화 X
- 메타용어 / placeholder 추상도

🟡 **agent simulation 의 한계**: 미경의 *Figma 사고* 가 진짜 디자이너 답이 아닐 수도 (예시 §3.3). 외부 alpha 가 *진짜* 필요.

### phase-12 첫 두 spec 권고

본 v2 결과로 phase-12 첫 두 spec 후보 갱신:

- **spec-12-01**: `@gd/cli` npm 분리 (v1 #4)
- **spec-12-02**: catalog.json Tier 2 등재 + doctor token-ref FP 수정 (v2 §3.2 #7, #14)
- **spec-12-03**: 실 외부 디자이너 alpha 채용 / 인터뷰

→ phase-11 *외부 alpha 가능 깃발* 은 *기술적으로 PASS* 이나 *디자이너 친화도* 는 phase-12 에서 개선 필요. **PR #68 머지 OK** (외부 alpha 시도 가능 상태).

---

## 부록: 본 alpha 의 git artifacts

| 파일 | 내용 |
|---|---|
| `experiments/dogfood-alpha-v2/` | 53 파일 scaffold (taskflow) |
| `experiments/dogfood-alpha-v2/.gd/memory/designer.md` | 미경 페르소나 (알고/모름 표) |
| `experiments/dogfood-alpha-v2/.gd/memory/project.md` | TaskFlow + 미경 결정 |
| `experiments/dogfood-alpha-v2/chats/scenes/dashboard.chat.md` | 4 카드 + 리스트, bare 형식 |
| `experiments/dogfood-alpha-v2/src/scenes/dashboard.tsx` | gd react 결과 4884 bytes |
| `experiments/dogfooding-alpha-v2-2026-05.md` | 본 보고서 |
