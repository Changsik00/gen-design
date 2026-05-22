# Plan: spec-11-07 — Fix v2 findings + v3 재검증

## 📋 Branch Strategy

- 신규 브랜치: `spec-11-07-fix-v2-findings` (phase-11 base 에서, spec-11-06 의 미머지 commits 포함)

## 🎯 핵심 전략 — 7 fix + v3 사이클 (converge 까지)

### 작업 순서 (작은 fix → 검증 → 큰 fix)

```
1. Fix #v2-1 (token-ref FP, 단위 테스트로 검증)
2. Fix #v2-2 (catalog Tier 2 등재 — json 수동 또는 doctor 화이트리스트)
3. Fix #v2-3 (doctor 출력 우선순위)
4. Fix #v2-4 (gd-start §7 표현)
5. Fix #v2-5 (i18n placeholder 안내)
6. Fix #v2-6 (Tailwind surface 외 안내)
7. Fix #v2-7 (메타용어 안내)
8. v3 dogfooding 재실행
9. 종료 조건 평가 → PR 또는 spec-11-08
```

### 주요 결정

| 항목 | 결정 |
|---|---|
| Fix #v2-1 채널 | `extractChatMdTokenClasses` 에 *Tailwind size scale exclude list* 추가 |
| Fix #v2-2 채널 | doctor 가 *shadcn 표준 화이트리스트* (Card / CardHeader 등) 보유 — catalog.json 변경 X, 코드만 |
| Fix #v2-3 채널 | doctor 출력: error severity 별 그룹 + 카테고리별 정렬 + (필요 시) collapse |
| Fix #v2-4~7 채널 | preset 의 `.claude/skills/gd-{start,chat}.md` 본문 정정 |
| v3 페르소나 | 도훈 (백엔드 개발자) — *다른 시각* 으로 검증 |
| v3 시나리오 | 동일 대시보드 또는 *설정 페이지* (form heavy) — 두 시도 |

### 종료 조건 평가 자동화

```
v3 doctor 결과:
  - error 카테고리 수 ≤ 5
  - 새 HIGH 발견 0
  - 미경/도훈 *시뮬레이션* 멈춤 = 0
→ PASS → PR

else → spec-11-08
```

## 📂 Proposed Changes

### Fix #v2-1 — extractChatMdTokenClasses size 제외
- `studio/scripts/gen-design/doctor/check-token-ref.ts`:
  - `TAILWIND_SIZE_KEYWORDS` set: `["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"]`
  - extractChatMdTokenClasses 가 size 키워드 제외
- 단위 테스트 추가

### Fix #v2-2 — doctor shadcn 화이트리스트
- `studio/scripts/gen-design/doctor/check-vocab-similar.ts`:
  - SHADCN_KNOWN: 표준 shadcn 컴포넌트 50+ 화이트리스트 (Card / CardHeader / CardTitle / CardDescription / CardContent / CardFooter / Form / FormField / FormItem / FormLabel / FormControl / FormMessage / Field / Input / Label / Button / Separator / Dialog / Popover / DropdownMenu / Tooltip / Tabs / Switch / Checkbox / Select / Toast / Sheet 등)
  - catalog 에 없어도 화이트리스트에 있으면 *PASS*
- 단위 테스트 추가

### Fix #v2-3 — doctor 우선순위 출력
- `studio/scripts/gen-design/doctor/index.ts`:
  - 출력 정렬: error → warn → info / 카테고리별
  - `--verbose` 없으면 같은 카테고리 *3건만* 표시 + 요약 ("vocab-similar 외 N건 추가")

### Fix #v2-4~7 — 스킬 본문 정정
- `presets-bundled/default/.claude/skills/gd-start.md` §7 — "처음이면 /gd-chat 강한 추천" + 시각 결과 우선
- `presets-bundled/default/.claude/skills/gd-chat.md`:
  - §4 frontmatter 안내 추가
  - §7 "Tailwind 자동" 명시
  - §7 i18n placeholder 안내

### v3 dogfooding
- `experiments/dogfood-alpha-v3/` scaffold
- 페르소나 *도훈* 또는 *미경 재방문* (개념 명확화 시도)
- 보고서: `experiments/dogfooding-alpha-v3-2026-05.md`

## 🧪 검증 계획

```bash
pnpm --filter studio test --run    # 1059+ PASS (단위 테스트 추가)
# v3 dogfooding 통합 — 도구 흐름 정상
```

## 🔁 Rollback Plan

각 fix 가 독립 commit — 개별 revert 가능. v3 dogfooding 결과는 git history.

## 📦 Deliverables 체크

- [x] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] 7 fix 적용
- [ ] v3 dogfooding 재실행
- [ ] 종료 조건 평가 → PR / spec-11-08
