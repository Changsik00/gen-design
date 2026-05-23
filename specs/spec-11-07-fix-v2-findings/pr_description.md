# fix(spec-11-07): v2 dogfooding 7 finding fix + v3 converge 달성 🎉

## Summary

spec-11-06 (v2 미경 dogfooding) 발견 7건 **모두 fix** + v3 (도훈 페르소나 / 설정 페이지) 재dogfooding 에서 **0 errors / 0 warnings 달성 — converge**. phase-11 외부 alpha 가능 깃발이 *진정 PASS*.

## 7 Fix

| # | Fix | 영향 |
|---|---|---|
| 🔴 #v2-1 | doctor token-ref Tailwind size 제외 (xs/sm/lg/2xl 등) | text-xs 가 토큰 FP 안 함 |
| 🔴 #v2-2 | doctor shadcn Tier 2 화이트리스트 (90+) | Form/FormField/Select/Switch 등 FP 0 |
| 🟠 #v2-3 | doctor 우선순위 출력 (severity → category, top 3 + N more, --verbose) | 미경 멈춤 회피 |
| 🟠 #v2-4 | gd-start §7 "/gd-chat 강한 추천" | 디자이너 결정 부담 ↓ |
| 🟠 #v2-5 | gd-chat §7 i18n placeholder 안내 | 추상도 ↓ |
| 🟠 #v2-6 | gd-chat §7 Tailwind 자동 안내 | "안 만지셔도 OK" 명시 |
| 🟠 #v2-7 | gd-chat §4 frontmatter 메타용어 안내 | 디자이너 부담 ↓ |

## v3 — 도훈 페르소나로 검증

미경과 *다른 시각* (백엔드 7년차 + form heavy 시나리오) 에서도 검증:

| 항목 | v3 결과 |
|---|---|
| scaffold | 0.057s |
| gd react (settings) | 1.17s, **4496 bytes** |
| gd doctor | 3ms, **0 errors** 🎉 |
| 페르소나 멈춤 | 0 |

## 종료 조건 (converge) — 모두 충족 ✅

- HIGH 0 ✓
- MID ≤ 2 (실제 0) ✓
- 페르소나 멈춤 0 ✓

→ **spec-11-08 사이클 불필요**. PR #68 머지 가능.

## phase-11 외부 alpha 가능 깃발 — *진정 PASS*

3 페르소나 (dennis / 미경 / 도훈) × 3 시나리오 (login / dashboard / settings) 모두 통과.

## Test plan

- [x] `pnpm --filter studio test --run` → **1064 passed** (1059 → +5)
- [x] `pnpm --filter create-gd-react test --run` → 28 passed (회귀 0)
- [x] v3 dogfooding 전체 흐름 — 0 errors

## phase-12 잔여

- HIGH 1: **spec-12-01: `@gd/cli` npm 분리** (preset 의 `pnpm gd` 실 동작)
- OPT 5: 외부 alpha / `gd api` / `gd doctor --fix` / `pnpm dev` 자동 / grammar 확장

## 산출물

- `studio/scripts/gen-design/doctor/`: token-ref Tailwind size 제외 + vocab SHADCN_KNOWN + index 우선순위 출력
- `presets-bundled/default/.claude/skills/gd-start.md` + `gd-chat.md` — 디자이너 친화 안내
- `experiments/dogfood-alpha-v3/` — 도훈 페르소나, settings 신
- `experiments/dogfooding-alpha-v3-2026-05.md` — converge 보고서
