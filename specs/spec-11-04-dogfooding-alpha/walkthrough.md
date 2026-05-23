# Walkthrough: spec-11-04 — Dogfooding Alpha

## 실증 흐름 — zero → React TSX

### 1. Scaffold (0.055s)

```
$ node packages/create-gd-react/dist/cli.js dogfood-alpha --offline --no-install
✓ 완료!  dogfood-alpha 생성됨 — /private/tmp/dogfood-alpha
```

53 파일 / 0 errors / package.json name 자동 치환.
→ `experiments/dogfood-alpha/` 로 git 추적 보존.

### 2. `/gd-start` simulation

- `.gd/memory/designer.md` — dennis (편향 명시 — 시스템 작성자)
- `.gd/memory/project.md` — "1인 개발자 SaaS 시작 도구" / formal-friendly / Stripe+Clerk

### 3. `/gd-chat` simulation — login.chat.md

```yaml
type: scene / name: LoginScene / shell.inherit: true
```
+ Narrative (재방문 백엔드 개발자 + formal-friendly)
+ Structure (Card + CardHeader + Input + Label + Button + Separator + Button link)
+ History (소셜 로그인 후속 결정)

### 4. `gd react` (1.32s)

```
$ pnpm --filter studio exec tsx scripts/gen-design.ts react login \
    --chat-root .../experiments/dogfood-alpha/chats \
    --output .../src/scenes/login.tsx
✓ wrote login.tsx (328 bytes)
```

⚠️ **진짜 막힘 발견**: Structure 본문 누락 — 셸 주석만 출력. `gd react` 가 ` ```chat ` 코드 블록을 *예시* 로 처리 (보고서 §2.4 / §3.1 #1).

### 5. `gd doctor` (4ms)

```
✗ 6 errors (4ms)
  - contrast: dark destructive-foreground on destructive 2.75:1 (AA 미달)
  - vocab-similar: <Header>/<Logo>/<Nav>/<Footer>/<Copyright> (_shell.chat.md 주석 안 예시)
```

→ 한국어 친절한 메시지 + 한계 안내 동작 확인.
→ 5초 budget 의 0.08% 사용.

---

## 보고서 핵심 (`experiments/dogfooding-alpha-2026-05.md` 209 줄)

### 발견 사항 분류

| 분류 | 건수 |
|---|---|
| 진짜 막힘 (외부 디자이너도 막힘) | **5** |
| 알고 있어서 우회 (외부 디자이너는 막힐 것) | **4** |
| 스킬 본문 부정확 / 모호 | **6** |
| handbook / FRONT.md / AGENT.md 누락 | **4** |
| **phase-12 후보** | **12** (HIGH 2 + MID 4 + LOW 3 + OPT 3) |

### 두 가장 큰 HIGH 발견

| # | 발견 | phase-12 후보 |
|---|---|---|
| 🔴 | `gd react` Structure 본문 컴파일 결함 — 결과 빈 화면 | spec-12-01 |
| 🔴 | preset 의 `pnpm gd doctor` 미동작 (`@gd/cli` 분리 안 됨) | spec-12-02 |

---

## 정량 비교

| 지표 | dogfooding 흐름 | 기존 typical |
|---|---|---|
| LoginScene 작성 시간 (simulation) | ~15분 + 1.4초 (도구) | ~55분 (직접 코딩) |
| 명령 횟수 | 3 (실 명령) | 10+ (`pnpm add`, `shadcn add` 여러번) |
| 학습 곡선 | scaffold + 4 스킬 가이드 | shadcn / Tailwind / cva / React 패턴 |

→ **이론적 4배 속도**. 단 *§2.4 의 Structure 컴파일 이슈 해결 후* 실측 가능.

---

## 회귀

- `pnpm --filter studio test --run` → **1055 PASS** (회귀 0)
- `pnpm --filter create-gd-react test --run` → **28 PASS** (회귀 0)

---

## 산출물 (7 commits)

| Commit | 산출물 |
|---|---|
| pre-flight | spec / plan / task |
| scaffold | `experiments/dogfood-alpha/` (53 파일) |
| memory | designer.md / project.md simulation 채움 |
| login.chat.md | 3층 (Narrative + Structure + History) |
| login.tsx | gd react 결과 (이슈 명시 포함) |
| 보고서 | `experiments/dogfooding-alpha-2026-05.md` 209 줄 |

---

## DoD 체크

- [x] `experiments/dogfood-alpha/` 53 파일 git 추적
- [x] login.chat.md 작성 + login.tsx 생성 (이슈 명시)
- [x] gd doctor 실행 결과 캡처 (6 errors / 4ms)
- [x] 보고서 작성 (정량 + 정성 + 발견 + phase-12 후보 12)
- [x] 회귀 0 (1055 + 28 PASS)
- [x] walkthrough + pr_description ship
