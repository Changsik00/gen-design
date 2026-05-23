# Walkthrough: spec-11-06 — Designer Persona Alpha v2

## 핵심 — 미경 strict roleplay 로 spec-11-05 fix 검증 + v2 신규 발견 8건

### spec-11-05 fix 4건 *모두 검증* ✅

| Fix | v1 (spec-11-04) | v2 (spec-11-06) |
|---|---|---|
| #1 Structure 본문 컴파일 | 328 bytes (외각만 — 펜스 안) | **4884 bytes** (4 카드 + 리스트 본문) ✓ |
| #2 annotation 경로 | `../experiments/...` | `chats/scenes/dashboard.chat.md` (project root 기준) ✓ |
| #3 HTML 주석 무시 | false positive 5건 | **0건** ✓ |
| #5 dark destructive 대비 | 2.75:1 (AA 미달) | contrast 진단 *사라짐* ✓ |

---

## 미경 페르소나 strict — 핵심 차이 (v1 vs v2)

| 항목 | v1 (dennis) | v2 (미경) |
|---|---|---|
| 페르소나 | dennis simulation | 가상 디자이너 strict |
| 어휘 지식 | shadcn / cn / cva 다 앎 | **모두 모름** |
| 답변 길이 | 합리적 추정 | 짧음 (1-2 문장) |
| 영어 만남 | 우회 | **즉시 질문** |
| 결과 확인 | TSX 파일 읽음 | **TSX 안 봄, 브라우저만** |
| 시나리오 | 로그인 (단순) | **대시보드 (Card x 4 + 리스트, 복합)** |

---

## v2 신규 발견 8건 (미경 roleplay 로만 보임)

| # | 발견 | 우선순위 |
|---|---|---|
| 1 | doctor token-ref false positive — `xs`/`sm`/`lg` (Tailwind size modifier) | 🔴 HIGH |
| 2 | doctor 다중 진단 우선순위 미표시 (13건 동시) | 🟠 MID |
| 3 | gd-start §7 "A/B/C 다음 단계" — 디자이너 결정 못 함 | 🟠 MID |
| 4 | i18n placeholder `{{i18n.ko.X}}` 추상적 | 🟠 MID |
| 5 | Tailwind 유틸리티 클래스 *surface 외* 명시 부족 | 🟠 MID |
| 6 | TSX 결과 검증 — 미경은 *코드 안 봄* → `pnpm dev` 필수화 | 🟢 OPT |
| 7 | frontmatter / identity / shell.inherit 메타용어 모름 | 🟠 MID |
| 8 | shadcn Tier 2 catalog 미등재 (v1 §3.1 #6 재확인) | 🔴 HIGH |

---

## agent (Claude) 의 미경 깨진 횟수: **2회**

페르소나 strict roleplay 평가:
- ✅ 답변 짧음 / 영어 모름 / 시각 확인 강조 유지
- ⚠️ 2회 깨짐: *Figma 사고* 답변 완전 흉내 못 냄

→ **외부 alpha 가 진짜 필요한 이유**.

---

## 정량 측정 (v1 vs v2)

| 단계 | v1 | v2 |
|---|---|---|
| scaffold | 0.055s | **0.057s** (회귀 0) |
| gd react | 1.32s, 328 bytes | **1.20s, 4884 bytes** (15배) |
| gd doctor | 4ms, 6 errors | **4ms, 13 errors** |

---

## 회귀

- studio 1059 PASS (변경 없음 — 본 spec 은 실험)
- create-gd-react 28 PASS

---

## phase-12 첫 두 spec 권고 (보고서 §5)

본 v2 결과로 phase-12 첫 두 spec 후보 갱신:

- **spec-12-01**: `@gd/cli` npm 분리 (v1 #4 남음)
- **spec-12-02**: catalog Tier 2 등재 + doctor token-ref FP (v2 §3.2 #7, #14)
- **spec-12-03**: 실 외부 디자이너 alpha 채용 / 인터뷰 (편향 해소)

→ phase-11 *외부 alpha 가능 깃발* 은 *기술 PASS*. **PR #68 머지 OK**.

---

## 산출물 (8 commits)

| Commit | 산출물 |
|---|---|
| pre-flight | spec / plan / task |
| scaffold | `experiments/dogfood-alpha-v2/` (53 파일) |
| memory | designer.md (미경) + project.md (TaskFlow) |
| chat | dashboard.chat.md (4 카드 + 리스트, bare 형식) |
| react | dashboard.tsx 4884 bytes (annotation OK) |
| doctor | empty commit (실행 결과만, 보고서로) |
| 보고서 | dogfooding-alpha-v2-2026-05.md (~280줄) |

---

## DoD 체크

- [x] experiments/dogfood-alpha-v2/ scaffold + git 추적
- [x] dashboard.chat.md 작성 + dashboard.tsx 컴파일
- [x] gd doctor 실행 결과 캡처 + 미경 입장 평가
- [x] (옵션) pnpm dev — *skip* (보고서 옵션, 미경 시각 우선 명시)
- [x] dogfooding-alpha-v2-2026-05.md (5 섹션 + 부록)
- [x] phase-12 후보 갱신 (12건)
- [x] walkthrough.md + pr_description.md ship
