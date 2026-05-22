feat(spec-09-02): gen-design lint — chat.md 정합 검증 + GitHub Actions CI

## Summary

- `studio/scripts/gen-design/lint.ts` 신규 구현 — `gen-design lint` 서브명령 (ADR-009 D-5 마지막 미구현 명령)
- 6 카테고리 검증: frontmatter / grammar / catalog-ref / shell-inherit / naming / compile
- `.github/workflows/ci.yml` 신규 생성 — 프로젝트 첫 CI 파일 (`pnpm test` + `gen-design lint --no-compile`)
- `gen-design.ts` 라우터에 `lint` 등록 (이제 ADR-009 전 5 명령 완성)

## 변경 파일

| 파일 | 변경 유형 |
|---|---|
| `studio/scripts/gen-design/lint.ts` | NEW — lint 서브명령 전체 구현 |
| `studio/scripts/gen-design/__tests__/lint-args.test.ts` | NEW — parseLintArgs 단위 테스트 (12 케이스) |
| `studio/scripts/gen-design/__tests__/lint-runtime.test.ts` | NEW — 카테고리 함수 단위 테스트 (17 케이스) |
| `studio/scripts/gen-design.ts` | MODIFY — lint 라우터 등록 |
| `.github/workflows/ci.yml` | NEW — GitHub Actions CI |

## Test plan

- [x] `cd studio && pnpm test scripts/gen-design/__tests__/lint-args` → 12/12 PASS
- [x] `cd studio && pnpm test scripts/gen-design/__tests__/lint-runtime` → 17/17 PASS
- [x] `cd studio && pnpm test` → 979/979 PASS (전체 회귀 없음)
- [x] `pnpm gen-design lint --chat-root playground/chats --no-compile` → 0 errors

🤖 Generated with [Claude Code](https://claude.com/claude-code)
