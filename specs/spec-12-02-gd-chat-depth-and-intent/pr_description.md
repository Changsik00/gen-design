spec-12-02: gd-chat 대화 깊이 + 버튼 의도 + form validation

## Summary

phase-11 dogfooding v4 retro 의 3 영역 통합 해소 (#1 form validation 안내 / #3 성급 종료 / #5 버튼 의도). gd-chat 스킬 본문 강화 + 이지 v5 시뮬레이션 4 신 검증.

## 변경

### gd-chat.md (308 → 402 줄)
- §5.5 (NEW) — 대화 깊이 checklist (5 단계)
- §7.5 (NEW) — Input/Form 만나면 validation 의도 묻기
- §7.6 (NEW) — Button 만나면 버튼 의도 묻기 (A/B/C/D)
- §11 (강화) — 안티 패턴 2 항목 추가
- §12 (강화) — 종료 조건 5 단계 checkbox

### ADR 결정
- **ADR-12-02-A**: form validation = react-hook-form + zod (preset 의 기존 dep)
- **ADR-12-02-B**: 버튼 의도 4 옵션 (A submit / B nav / C external / D modal)

### 이지 v5 시뮬레이션 (`experiments/dogfood-alpha-v5/`)
- scaffold + designer.md (이지 v5) + project.md
- 4 신 transcripts (5-7 turn each)
- 4 chat.md + 4 TSX (0 errors)
- decisions.md 12 entry (v4 의 3 배)

### 종합 보고서
`experiments/dogfooding-alpha-v5-depth-2026-05.md` (134 줄) — v4 vs v5 비교 + 페르소나 평가 + 발견.

## Test Plan

- [x] `studio pnpm test` — 875 PASS / 3 skipped (기존 snapshot, spec-12-01 처리)
- [x] `@gd/cli pnpm test` — 186 PASS
- [x] `create-gd-react pnpm test` — 28 PASS
- [x] v5 4 신 컴파일 → 2223+3059+2274+5029 bytes
- [x] v5 4 신 doctor → 0/0/0/0
- [x] 대화 turn ≥ 5 평균 (5.5)
- [x] decisions.md validation + 버튼 의도 entry ≥ 1 (각 3)
- [x] gd-chat.md 본문 ≤ 400 줄 (402 — plan limit 거의 부합)

## 발견 (후속)

- 🟡 chat.md grammar `<Link><Button asChild>` parse 실패 — spec-12-05 (order.md) 표준화 예정
- 🟢 버튼 의도 추가 옵션 (AI 호출 / 데이터 refresh) — spec-12-05 또는 후속

## Out of Scope

- 비슷한 화면 자동 발견 (corpus 유사도) → spec-12-04
- `gd tokens` 조회 → spec-12-03
- design-order-spec → spec-12-05
- 외부 디자이너 실 alpha → OPT
