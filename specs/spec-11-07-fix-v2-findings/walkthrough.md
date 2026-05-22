# Walkthrough: spec-11-07 — Fix v2 findings + v3 converge

## 7 Fix 적용 + v3 dogfooding **converge 달성**

### Fix 결과 표

| # | Fix | 검증 |
|---|---|---|
| 🔴 #v2-1 token-ref Tailwind size | `text-xs`/`sm`/`lg` 무시 — v3 chat 에서 token-ref 0 진단 ✓ |
| 🔴 #v2-2 shadcn Tier 2 whitelist | Form/FormField/Select/Switch 90+ 어휘 — v3 vocab-similar 0 진단 ✓ |
| 🟠 #v2-3 doctor 우선순위 출력 | severity → category 정렬 + 카테고리당 top 3 + `--verbose` 옵션 |
| 🟠 #v2-4 gd-start §7 안내 | "🎨 /gd-chat 강한 추천" + 4 줄 근거 (시각 우선) |
| 🟠 #v2-5 i18n placeholder 안내 | "다국어 텍스트 자리 (한국어 자동 변환)" 명시 |
| 🟠 #v2-6 Tailwind 자동 안내 | "className 자동 처리 — 직접 수정 X" 명시 |
| 🟠 #v2-7 frontmatter 메타용어 안내 | "💡 디자이너는 안 만지셔도 OK" 명시 |

### v3 도훈 (백엔드) — 다른 시각 검증

| 항목 | 결과 |
|---|---|
| 시나리오 | 설정 페이지 (form heavy — Card + Form + FormField + Input + Select + Switch + Button) |
| scaffold | 0.057s |
| gd react | 1.17s, **4496 bytes** (form heavy 정상 컴파일) |
| **gd doctor** | **3ms, 0 errors 🎉** |
| 페르소나 멈춤 | 0 |

---

## 종료 조건 (converge) — 모두 충족 ✅

| 조건 | 결과 |
|---|---|
| HIGH 발견 0 | ✅ 0 |
| MID 발견 ≤ 2 | ✅ 0 |
| 페르소나 멈춤 0 | ✅ 0 |

→ **converge 달성**. spec-11-08 사이클 *불필요*. PR #68 머지 가능.

---

## phase-11 외부 alpha 가능 깃발 — *진정 PASS*

3 페르소나 × 3 시나리오 모두 통과:

| Persona | 시나리오 | TSX bytes | doctor errors |
|---|---|---|---|
| dennis (v1) | login | 1943 (spec-11-05 후) | 6 → 0 |
| 미경 (v2) | dashboard | 4884 | 13 → 0 |
| **도훈 (v3)** | **settings** | **4496** | **0** 🎉 |

---

## 회귀

- studio **1064 PASS** (1059 → +5)
- create-gd-react 28 PASS

---

## 산출물 (9 commits)

| Commit | 산출물 |
|---|---|
| pre-flight | spec / plan / task |
| Fix #v2-1 | check-token-ref.ts + token-ref.test.ts (+2) |
| Fix #v2-2 | check-vocab-similar.ts (SHADCN_KNOWN 90+) + vocab-similar.test.ts (+3) |
| Fix #v2-3 | doctor/index.ts formatDiagsGrouped (top 3 + N more + --verbose) |
| Fix #v2-4~7 | gd-start.md §7 + gd-chat.md §4 §7 (디자이너 친화 안내 3) |
| v3 scaffold | experiments/dogfood-alpha-v3/ (53 파일) |
| v3 dogfooding | designer.md 도훈 + project.md 사내 admin + settings.chat.md + settings.tsx |
| 보고서 | dogfooding-alpha-v3-2026-05.md (140 줄, §0-§6 + 부록) |

---

## phase-12 잔여 (보고서 §6)

본 spec 으로 phase-11 fix scope 완전 해소. phase-12 첫 spec 권고:

- **spec-12-01**: `@gd/cli` npm 분리 (남은 유일한 HIGH)
- OPT: 외부 alpha 채용 / `gd api` / `gd doctor --fix` / `pnpm dev` 자동 / grammar 확장
