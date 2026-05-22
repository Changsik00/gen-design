# feat(spec-10-03): gen-design 품질 게이트 강화

## Summary

- workspace root 에서 `pnpm gen-design lint` 직접 실행 가능 (alias 추가)
- StatCard 에 `variant: compact | highlighted | default` cva axis 구현 + catalog 자동 갱신
- `dogfooding-score.ts` 스크립트 추가 — `@/components/ui` import 비율 측정 (현재 40.9%)
- CI `test` job 에 dogfooding score 리포트 step 추가

## 변경 파일

| 구분 | 파일 |
|---|---|
| 수정 | `package.json` (root, gen-design alias) |
| 수정 | `studio/src/components/composites/StatCard/index.tsx` (cva variant) |
| 수정 | `studio/src/components/composites/StatCard/StatCard.test.tsx` (variant 테스트 3건) |
| 수정 | `studio/src/components/templates/types.ts` (StatCardData.variant 추가) |
| 자동생성 | `studio/src/lib/vocabulary/catalog/catalog.json` (pnpm vocab 재생성) |
| 자동생성 | `templates/FRONT.md`, `DESIGN.md`, `TOKEN.md`, `DESIGN.stitch.md` |
| 신규 | `studio/scripts/dogfooding-score.ts` |
| 수정 | `studio/package.json` (dogfooding 스크립트) |
| 수정 | `.github/workflows/ci.yml` (Dogfooding score step) |

## StatCard variant 설계

| variant | 스타일 |
|---|---|
| `default` | 기존 Card 스타일 (변경 없음) |
| `compact` | class `compact`, `pt-2`, 값 텍스트 `text-xl` |
| `highlighted` | `border-2 border-primary` |

## Test plan

- [x] `pnpm gen-design lint --chat-root playground/chats` (workspace root) → exit 0
- [x] `pnpm --filter studio test --run` → 998 passed (StatCard variant 3건 포함)
- [x] `pnpm --filter studio vocab` → catalog.json StatCard axes 에 variant 등재
- [x] `pnpm --filter studio dogfooding` → 표 출력 (40.9%)
- [x] `pnpm --filter studio lint` → 0 errors

🤖 Generated with [Claude Code](https://claude.com/claude-code)
