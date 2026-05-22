# docs(spec-11-06): Designer Persona Alpha v2 — 미경의 대시보드

## Summary

spec-11-05 fix 4건이 *진정 작동* 하는지 *미경 (가상 Figma 디자이너) strict roleplay* 로 검증. **모두 검증 ✅** + **v2 신규 발견 8건** (디자이너 친화도).

## spec-11-05 fix 검증 (모두 ✅)

| Fix | v2 검증 |
|---|---|
| #1 Structure 본문 컴파일 | 328 → **4884 bytes** (dashboard 4 카드 + 리스트) |
| #2 annotation 경로 | `chats/scenes/dashboard.chat.md` (project root 기준) |
| #3 HTML 주석 무시 | false positive **0건** |
| #5 dark destructive 대비 | contrast 진단 *사라짐* |

## v2 신규 발견 (미경 roleplay 로만 보임)

| # | 발견 | 우선순위 |
|---|---|---|
| 1 | doctor token-ref FP — `xs`/`sm`/`lg` Tailwind size 잘못 token 으로 | 🔴 HIGH |
| 2 | doctor 다중 진단 우선순위 미표시 — 미경 멈춤 | 🟠 MID |
| 3 | gd-start "A/B/C 다음 단계" — 디자이너 결정 못 함 | 🟠 MID |
| 4 | i18n placeholder 추상적 | 🟠 MID |
| 5 | Tailwind 유틸리티 *surface 외* 안내 부족 | 🟠 MID |
| 6 | `pnpm dev` 시각 확인 *필수화* (미경 코드 안 봄) | 🟢 OPT |
| 7 | frontmatter / identity 메타용어 | 🟠 MID |
| 8 | shadcn Tier 2 catalog 미등재 (v1 §3.1 #6 재확인) | 🔴 HIGH |

## agent simulation 한계

미경 roleplay 중 **2회 깨짐** — Figma 사고 답변 완전 흉내 못 냄. 외부 alpha 가 *진짜* 필요.

## 정량

| 단계 | v1 | v2 |
|---|---|---|
| scaffold | 0.055s | 0.057s |
| gd react | 1.32s, 328 bytes | **1.20s, 4884 bytes** (15배) |
| gd doctor | 4ms, 6 errors | 4ms, 13 errors |

## Test plan

- [x] `pnpm --filter studio test --run` → **1059 passed** (회귀 0)
- [x] `pnpm --filter create-gd-react test --run` → **28 passed** (회귀 0)
- [x] 재현 가능한 v2 dogfood artifacts (53 + 4 추가 파일)

## phase-12 첫 두 spec 권고

- **spec-12-01**: `@gd/cli` npm 분리 (v1 남음)
- **spec-12-02**: catalog Tier 2 등재 + doctor token-ref FP (v2 #1, #8)
- **spec-12-03**: 실 외부 디자이너 alpha (편향 해소)

## phase-11 영향

본 PR merge 후 phase-11 base branch 통합 → PR #68 자동 갱신.

**phase-11 외부 alpha 가능 깃발** = 기술 PASS ✓. 디자이너 친화도는 phase-12 개선.

## 산출물

- `experiments/dogfood-alpha-v2/` — 53 파일 + 4 추가 (미경 답변)
- `experiments/dogfooding-alpha-v2-2026-05.md` — 280줄 (5 섹션 + 부록)
