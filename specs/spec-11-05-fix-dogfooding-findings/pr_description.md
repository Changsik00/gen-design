# fix(spec-11-05): Fix dogfooding-alpha findings — 4/5 진짜 막힘 해소

## Summary

spec-11-04 dogfooding alpha 에서 발견된 *5 진짜 막힘* 중 **4 건 해소** (남은 1 건 = `@gd/cli` npm 분리는 phase-12). PR #68 (phase-11 → main) 머지 전 *깨진 깃발* 회피.

## 4 Fix

| # | Fix | 결과 |
|---|---|---|
| **🔴 #1** | gd-chat 스킬 §7 의 ` ```chat ` 펜스 제거 + bare 형식 강제 | gd react 결과: **328 bytes → 1943 bytes** (본문 컴파일됨) |
| **🟠 #2** | react.ts annotation 경로 — chatRoot 부모 기준 | `// @gd: chats/scenes/login.chat.md` (project root 기준) |
| **🟠 #3** | doctor extractors 의 `stripHtmlComments` 추가 | `_shell.chat.md` false positive 5건 *제거* |
| **🟠 #5** | dark destructive-foreground = `oklch(0.205 0 0)` | doctor contrast 진단 *사라짐* — WCAG AA PASS |

## 분리 (phase-12 후보)

| # | 항목 |
|---|---|
| 🔴 #4 | `@gd/cli` npm 분리 — preset 의 `pnpm gd` 실 동작 (큰 인프라) |
| 🔴 신규 | catalog.json 에 shadcn 표준 컴포넌트 등재 (재dogfooding 노출) |

## 재dogfooding 검증

`experiments/dogfood-alpha/` 에서 4 fix 적용 후 재실행:
- ✅ `gd react`: Card + CardHeader + Form + Input + Button 본문 *컴파일됨*
- ✅ `gd doctor`: contrast 진단 *제거* + false positive *5건 → 0건*
- ✅ annotation: `chats/scenes/login.chat.md` (project root 기준)

## Test plan

- [x] `pnpm --filter studio test --run` → **1059 passed** (1055 → +4)
- [x] `pnpm --filter create-gd-react test --run` → 28 passed (회귀 0)
- [x] 재dogfooding 전체 흐름 통과
- [x] 보고서 §3.1 / §4 / §5 갱신

## phase-11 영향

본 PR merge 후 phase-11 base branch 에 통합 → PR #68 (phase-11 → main) 가 자동 갱신 → 머지 가능.

**phase-11 Success Criteria #2** "zero → React TSX 도달" 이 *진짜 PASS* (이전 부분).

## 산출물

- `studio/scripts/gen-design/react.ts` 1줄 변경 + 단위 테스트
- `studio/scripts/gen-design/doctor/check-vocab-similar.ts` + `check-token-ref.ts` `stripHtmlComments` 추가
- `presets-bundled/default/.claude/skills/gd-chat.md` §7 / §11 정정
- `presets-bundled/default/templates/assets/tokens/tokens.json` + `src/styles/globals.css` dark destructive-foreground
- `experiments/dogfood-alpha/` 재컴파일 결과 (chat.md + tokens.json + globals.css + login.tsx)
- `experiments/dogfooding-alpha-2026-05.md` 갱신
