# feat(spec-11-03): `gd doctor` — DESIGN/TOKEN/chat 정합 + drift + WCAG AA

## Summary

- **`gd doctor` subcommand 신규** — 12 검증 카테고리 (기존 lint 6 + 신규 6) 통합
- **shadcn 표준 24 토큰 잠금** 검증 (token-format)
- **WCAG 2.1 AA 자동 측정** — 8 페어 × 2 mode = 16, 미달 시 가장 가까운 합격 OKLCH 제안 (L 만 조정)
- **chat.md ↔ TSX drift 감지** — `// @gd:` annotation + mtime 비교 (lat.md 차용)
- **"Did you mean?"** — Levenshtein + segment 약어 매칭 (vocab-similar / token-ref)
- **친절한 한국어 메시지** + `--json` (기계 처리)
- **`gen-design react`** 출력 TSX 에 `// @gd: <chat-path>` annotation 자동 삽입 (idempotent)

## 12 검증 카테고리

| 카테고리 | 출처 | 검증 |
|---|---|---|
| frontmatter / grammar / catalog-ref / shell-inherit / naming / compile | 기존 `lint` | 흡수 |
| **token-format** | 신규 | DTCG 1.0 strict + shadcn 24 토큰 + light/dark 동기 |
| **token-ref** | 신규 | DESIGN/chat 의 토큰 참조 ↔ tokens.json 정의 |
| **contrast** | 신규 | WCAG 2.1 AA 8 페어 + 합격 OKLCH 제안 |
| **scene-drift** | 신규 (lat.md) | chat/TSX mtime 비교 |
| **orphan-scene** | 신규 | annotation 가리키는 chat 부재 / annotation 없음 |
| **vocab-similar** | 신규 | 카탈로그 외 어휘 + Levenshtein 제안 |

## 산출물

- `studio/scripts/gen-design/doctor/` 신규 (8 파일):
  - types.ts / messages.ts (한국어 템플릿)
  - check-token-format.ts (SHADCN_REQUIRED_TOKENS 24)
  - check-token-ref.ts
  - check-contrast.ts (culori)
  - check-scene-drift.ts (checkSceneDrift + checkOrphanScene)
  - check-vocab-similar.ts
  - levenshtein.ts (segment 약어 매칭)
  - index.ts (runDoctor + parseDoctorArgs)
- `scripts/gen-design.ts` router 에 `doctor` 등록
- `scripts/gen-design/react.ts` 에 annotation prepend (idempotent)
- 단위 테스트 7 files / 57 tests (998 → 1055)

## Test plan

- [x] `pnpm --filter studio test --run` → **1055 passed** (+57)
- [x] `pnpm --filter studio lint` → 0 errors
- [x] 실 fixture 실행: `gd doctor --chat-root playground/chats --templates-root templates` → **4ms** (5초 budget 의 0.08%)
- [x] 회귀: gen-design 162 tests PASS 유지

## 후속 작업

| 항목 | spec |
|---|---|
| dogfooding alpha (dennis 가 디자이너 모드로 zero → React) | spec-11-04 |
| `@gd/cli` 별도 npm 분리 + scaffold preset 실 동작 | phase-12 |
| `gd doctor --fix` 자동 수정 모드 | phase-12 |
| `gd api` (MSW handler 자동 생성) | phase-12 |
