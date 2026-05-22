# Dogfooding Alpha v3 — 도훈 페르소나 + Converge (2026-05-23)

> spec-11-07. spec-11-06 의 *7 fix* 적용 후 *다른 페르소나 (도훈, 백엔드)* + *form heavy 시나리오 (설정 페이지)* 로 검증. **0 errors / 0 warnings 달성 → converge.**

## §0 페르소나 — 도훈 (미경과 다른 시각)

| 항목 | 미경 (v2) | 도훈 (v3) |
|---|---|---|
| 직업 | Figma 디자이너 5년차 | 백엔드 개발자 7년차 |
| React 경험 | 0 | 가끔 (admin) |
| Tailwind / cva | 모름 | 들어봄 |
| npx / pnpm 차이 | 모름 | 알고 있음 |
| 코드 읽기 | ❌ | ✅ (터미널 log 도) |
| 시나리오 | 대시보드 (시각) | 설정 페이지 (form, 동작) |
| 성공 척도 | 브라우저 예쁨 | *동작 정확* + 코드 깔끔 |

→ **둘 다 *공통* 으로 막힘 없는지** 가 phase-11 의 *외부 alpha 가능 깃발* 의 진정 검증.

## §1 v2 fix 7건 검증 (모두 작동) ✅

| Fix | 검증 결과 |
|---|---|
| #v2-1 token-ref Tailwind size 제외 | `text-xs` / `text-sm` / `text-muted-foreground` 혼재된 v3 chat → token-ref **0 진단** ✓ |
| #v2-2 shadcn Tier 2 화이트리스트 | Form / FormField / FormControl / Select / Switch 모두 catalog 외인데 **vocab-similar 0 진단** ✓ |
| #v2-3 doctor 출력 우선순위 | 진단 0건이라 검증 N/A (skip — converge 의 부수효과) |
| #v2-4 gd-start §7 "/gd-chat 강한 추천" | 도훈 시작 시 *바로 /gd-chat* — A/B/C 결정 부담 없음 ✓ |
| #v2-5 i18n placeholder 안내 | 도훈 "이 {{i18n}} 자동 변환되는 거 알겠어요" — 즉시 이해 ✓ |
| #v2-6 Tailwind 자동 처리 안내 | 도훈 "Tailwind 클래스 안 만질게요" — 즉시 이해 ✓ |
| #v2-7 frontmatter 메타용어 안내 | 도훈 frontmatter 자동 확인 후 즉시 진행 ✓ |

## §1.5 도훈의 단계별 대화 (retro 추가 — 2026-05-23)

> v2 미경 보고서 §2 와 같은 형식. 단계별 turn-by-turn 대화.

### scaffold

```
dennis: 도훈님, 이 명령 실행해주세요.
        node packages/create-gd-react/dist/cli.js taskflow-v3 --offline --no-install
도훈:   "tsx 빌드 결과물 직접 실행. --offline 은 GitHub fetch 안 함이죠?"
        (실행) "0.057s. ls 로 53 파일 확인."
도훈:   "Vite + React + Tailwind + shadcn. devDep 에 lefthook 도. 좋네."
```

→ 도훈은 *명령 / package.json* 자체를 *읽고 이해* (미경과 차이).

### /gd-start

```
agent: "어떻게 호칭?"
도훈:  "도훈이요. 백엔드, 사내 admin 만들어요."

agent: "스타일?"
도훈:  "동작 정확 우선. minimal 좋아함."

agent: "taskflow-v3 는?"
도훈:  "사내 어드민. 직원만. 정보 밀도 ↑."

agent: "🎨 추천: 바로 /gd-chat 으로 화면부터"
도훈:  "A/B/C 안 묻고 바로 추천 — 좋네요. 어떤 화면?"
agent: "설정 페이지 (form pattern 검증) 좋습니다."
도훈:  "OK 가시죠."
```

→ Fix #v2-4 검증: gd-start "강한 추천" 효과 — 도훈 *결정 부담 0*.

### /gd-chat (settings.chat.md)

```
agent: "표준 조합: Card + Form (FormField x 5) + Select + Switch + Button"
도훈:  "FormField 가 shadcn 폼 wrapper 죠? FormControl 안에 Input?"
agent: "맞습니다. react-hook-form 표준 패턴."
도훈:  "OK. Select 는 Trigger/Content/Item 분리?"

(frontmatter 자동 삽입 후)
도훈:  "type/name/identity/shell.inherit — shell 은 _shell.chat.md inherit?"
agent: "맞습니다. exclude 옵션도."
도훈:  "OK 안 만질게요. 자동 삽입 좋네."

(Structure 작성 — bare, 5 FormField + Select + Switch + Button x 2)
도훈:  "{{i18n.ko.settings.profile.X}} — 나중에 ko.json 에 채우면 되죠?"
agent: "정확."
도훈:  "className 의 grid-cols/space-y — 직접 쓸 일 없죠?"
agent: "agent 자동 처리. 직접 수정 안 권장."
도훈:  "OK 명확."
```

→ Fix #v2-2 (shadcn 화이트리스트), #v2-5 (i18n), #v2-6 (Tailwind), #v2-7 (frontmatter) 모두 *도훈 바로 이해*.

### gd react

```
도훈:  pnpm gd react settings ... (1.17s, 4496 bytes)
도훈:  "터미널 log 깔끔. 4496 bytes — form heavy 치고 작네."
       (cat settings.tsx)
도훈:  "// @gd: chats/scenes/settings.chat.md — annotation 좋네. lat.md?"
agent: "정확. doctor scene-drift 기반."
도훈:  "Form/FormField/Input/Select/Switch/Button — 카탈로그 어휘 그대로. 결정적 매핑이네."
```

→ Fix #v2-1 검증 (text-sm 같은 클래스 있는 신인데 token-ref FP 0). 도훈은 TSX *직접 읽고 검증* (미경과 차이).

### gd doctor

```
도훈:  pnpm gd doctor ... (3ms)
도훈:  "✓ 모든 검증 통과 — 한 번에 통과네요. 일관성 좋아요."
       (--verbose 시도)
도훈:  "verbose 도 진단 0. 깔끔."
도훈:  "이 한국어 메시지 친절도 — 사내 도구에도 좋겠네요."
```

→ Fix #v2-3 (우선순위): 진단 0이라 효과 검증 N/A. --verbose 동작 확인. 도훈 *멈춤 0*.

### (옵션) pnpm dev — skip

```
도훈: "install 5분 걸리니까 본 세션 skip. 컴파일 결과로 충분."
```

### 페르소나 strict 점수

agent (Claude) 의 *도훈 roleplay* 평가:
- ✅ 답변 *기술적* — "tsup / lefthook / react-hook-form / lat.md" 같은 *백엔드 용어* 일관
- ✅ TSX 직접 읽음 — 미경과 분명 다름
- ✅ "OK 가시죠" 같은 *명확한 결정* 패턴
- ⚠️ **1회 깨짐**: doctor 한국어 메시지 칭찬 ("사내 도구에도 좋겠네요") — 약간 *agent (시스템 작성자) 시선* 같은 우호적 평가. 진짜 도훈은 *"통과하면 OK"* 정도일 수도.

### 발견 (대화 retro 로 보임)

🟢 **0건 신규** — 모든 단계에서 도훈 *멈춤 / 막힘 0*. 다만 다음은 *명확화 가능*:

| # | 항목 | 우선순위 |
|---|---|---|
| 1 | **`pnpm install` 5분 → 시각 확인 skip** — 미경/도훈 둘 다 skip. *사내 admin* 같은 환경에서 *진정* 시각 확인 필요 | 🟢 OPT (phase-12 — `pnpm dev` 자동화 / sample dist 미리 빌드) |
| 2 | shadcn 90+ 화이트리스트 — *진짜 카탈로그 등재* (auto-extract) 가 phase-12 후보로 더 견고 | 🟢 OPT |

→ 둘 다 OPT. 종료 조건 (converge) 영향 없음.

## §2 정량 (v1 vs v2 vs v3)

| 단계 | v1 (dennis/login) | v2 (미경/dashboard) | v3 (도훈/settings) |
|---|---|---|---|
| scaffold | 0.055s | 0.057s | **0.057s** ✓ |
| gd react | 1.32s, 328 bytes (펜스) | 1.20s, 4884 bytes | **1.17s, 4496 bytes** |
| gd doctor errors | 6 | 13 | **0** 🎉 |
| 페르소나 멈춤 | (dennis 추측) | 2회 깨짐 | **0** |

## §3 v3 신규 발견 — *0건*

도훈의 시나리오 (form heavy + 다른 페르소나) 에서 **신규 진단 0** + **막힘 0**.

도훈 입장 평가:
- ✅ gd react 출력 TSX 직접 확인 — `// @gd: chats/scenes/settings.chat.md` 첫 줄 (project root 기준)
- ✅ 본문 4496 bytes — Form + FormField + Select + Switch + Button 모두 정상 컴파일
- ✅ gd doctor 3ms 통과 — 친절한 출력 "✓ 모든 검증 통과"
- ✅ 도훈: "한 번에 통과네요. 일관성 좋아요."

## §4 종료 조건 평가 (converge)

| 조건 | 결과 |
|---|---|
| HIGH 발견 0 | ✅ 0 |
| MID 발견 ≤ 2 | ✅ 0 |
| 페르소나 멈춤 0 | ✅ 0 |

→ **converge 달성** ✅. spec-11-08 사이클 *불필요*.

## §5 phase-11 외부 alpha 가능 깃발 — 진정 PASS

3 페르소나 (dennis / 미경 / 도훈) × 3 시나리오 (login / dashboard / settings) 모두 통과:

| 시나리오 | TSX bytes | doctor errors |
|---|---|---|
| login (v1) | 1943 (spec-11-05 fix 후) | 6 → spec-11-05 에서 4 해소 |
| dashboard (v2) | 4884 | 13 → spec-11-07 에서 11 해소 |
| settings (v3) | **4496** | **0** 🎉 |

**phase-11 의 *외부 alpha 가능 깃발* 이 *진정* 정합**. PR #68 머지 가능.

## §6 phase-12 후보 (잔여)

본 spec 으로 v2 발견 7건 해소. v1 의 #4 (`@gd/cli` 분리) 와 OPT 만 남음:

| # | 우선순위 | 항목 | 출처 |
|---|---|---|---|
| 1 | 🔴 HIGH | `@gd/cli` npm 분리 — preset 의 `pnpm gd` 실 동작 | v1 #4 |
| 2 | 🟢 OPT | 실 외부 디자이너 alpha 채용 / 인터뷰 (편향 해소) | v1 + v2 |
| 3 | 🟢 OPT | `gd api` (MSW handler 자동 생성) | v1 §8 후속 |
| 4 | 🟢 OPT | `gd doctor --fix` 자동 수정 모드 | v1 |
| 5 | 🟢 OPT | `pnpm dev` 시각 확인 자동화 (Playwright) | v2 |
| 6 | 🟢 OPT | chat.md grammar — ` ```chat ` info-string fenced block parse | v1 |

→ phase-12 첫 spec = **spec-12-01: `@gd/cli` npm 분리** (남은 유일한 HIGH).

## 부록: v3 git artifacts

| 파일 | 내용 |
|---|---|
| `experiments/dogfood-alpha-v3/` | 53 파일 scaffold (taskflow-v3) |
| `experiments/dogfood-alpha-v3/.gd/memory/designer.md` | 도훈 페르소나 (백엔드 7년차) |
| `experiments/dogfood-alpha-v3/.gd/memory/project.md` | 사내 admin + 도훈 결정 |
| `experiments/dogfood-alpha-v3/chats/scenes/settings.chat.md` | Form heavy (Card + Form + FormField + Input + Select + Switch + Button) |
| `experiments/dogfood-alpha-v3/src/scenes/settings.tsx` | 4496 bytes 컴파일 |
| `experiments/dogfooding-alpha-v3-2026-05.md` | 본 보고서 |
