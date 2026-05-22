# feat(spec-10-02): a11y 자동 검증 — axe-playwright CI 게이트

## Summary

- `@axe-core/playwright` 를 추가하고 6개 스튜디오 라우트를 WCAG 2.1 AA 기준으로 axe 스캔
- `critical`/`serious` 위반은 CI 게이트 (실패), `moderate`/`minor`는 console.warn 경고만 출력
- 발견된 실제 위반 10건을 수정: 색상 대비 토큰 업그레이드 + aria-label + tabIndex + opacity 제거
- CI `a11y` job 추가 — `e2e` job 과 병렬 실행

## 변경 파일

| 구분 | 파일 |
|---|---|
| 신규 | `studio/e2e/a11y.spec.ts` |
| 수정 | `studio/package.json` (`test:a11y` 스크립트) |
| 수정 | `.github/workflows/ci.yml` (`a11y` job) |
| 수정 | `templates/assets/tokens/tokens.json` (primary/muted-fg/destructive 토큰) |
| 수정 | `studio/src/styles/_tokens-light.css` (재빌드) |
| 수정 | `studio/src/index.css` (`--color-destructive-foreground` @theme 매핑) |
| 수정 | `studio/src/features/*/` (aria-label, tabIndex, opacity 수정 6개) |

## 토큰 변경 (WCAG 2.1 AA 준수)

| 토큰 | 이전 | 이후 | 대비비 |
|---|---|---|---|
| `--primary` | #6366F1 (indigo.500) | #4F46E5 (indigo.600) | 4.46 → **5.8:1** ✓ |
| `--muted-foreground` | #64748B (neutral.500) | #475569 (neutral.600) | 4.31 → **8.7:1** ✓ |
| `--destructive` | #EF4444 (red.500) | #B91C1C (red.700) | 3.29 → **6.4:1** ✓ |

## Test plan

- [x] `pnpm --filter studio test:a11y` → 6 passed (Chromium headless)
- [x] `pnpm --filter studio test --run` → 995 passed (스냅샷 업데이트 포함)
- [x] `pnpm --filter studio test:e2e` → 6 passed (smoke 회귀 없음)
- [x] CI `a11y` job 구성 검증

🤖 Generated with [Claude Code](https://claude.com/claude-code)
