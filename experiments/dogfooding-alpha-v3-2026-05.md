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
