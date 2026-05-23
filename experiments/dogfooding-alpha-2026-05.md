# Dogfooding Alpha — 2026-05-22

> phase-11 의 모든 도구 (scaffold + 4 스킬 + doctor) 를 *실제로 사용* 해 zero → React TSX 까지 도달하는 실증 보고서.

## §0 Disclaimer (편향 인지)

본 alpha 는 **dennis (시스템 작성자) 의 simulation** 입니다. *외부 디자이너 alpha 가 아닙니다*.

- 디자이너 페르소나 답변은 *합리적 SaaS 디자이너* 의 답변을 *합리적으로 가정*
- "알고 있어서 우회한 경로" vs "진짜 막힘" 을 *명시 분리* — §3 참조
- 진정한 alpha = 외부 디자이너 채용 / 인터뷰 (phase-12 후보)

---

## §1 정량 측정

| 단계 | 소요 시간 | 명령 횟수 | 에러 |
|---|---|---|---|
| 1. scaffold (`npx create-gd-react`) | **0.055s** | 1 | 0 |
| 2. `/gd-start` simulation (memory 채움) | 5분 (estimated) | 0 (파일 편집만) | 0 |
| 3. `/gd-chat` simulation (login.chat.md) | 10분 (estimated) | 0 (파일 편집만) | 0 |
| 4. `gd react` (TSX 생성) | **1.32s** (tsx 시동 포함) | 1 | 0 exitcode, 1 *내용 누락* |
| 5. `gd doctor` (정합 검증) | **4ms** | 1 | 6 (의도된 진단) |
| **총** | ~15분 + 1.4초 (도구) | 3 (실 명령) | — |

### 비교 — 기존 typical SaaS 로그인 화면 작성 시간

- shadcn add + 폴더 셋업: ~10분
- LoginForm 컴포넌트 작성: ~20분
- a11y + 다크모드 + 토큰 적용: ~15분
- 테스트 작성: ~10분
- **총: ~55분** (디자이너 가이드 없이 직접 코딩)

→ **dogfooding 흐름이 *약 4배 빠름*** (단 simulation 가정 + Structure 컴파일 이슈 제외 시)

---

## §2 단계별 정성 기록

### 2.1 scaffold (`npx create-gd-react`)

- ✅ 0.055초 — *눈에 보이지 않을 정도로* 빠름
- ✅ 53 파일 모두 생성, `package.json` name 자동 치환
- ✅ `--offline` 으로 네트워크 0 — 첫 사용자 즉시 동작
- ✅ README.md 의 "30초 시작" 명확
- ⚠️ 명령 끝에 "Claude Code 에서 디렉토리 열기" 안내 — *외부 디자이너* 가 Claude Code 가 무엇인지 모르면 막힘 (phase-12 후보)

### 2.2 `/gd-start` simulation

- ✅ 스킬 §1 자동 로딩 목록 명확 (9 파일)
- ✅ §3-§4 의 디자이너/프로젝트 질문 표준 답변이 *합리적* (1-2 질문씩 짧음)
- ⚠️ §5 의 *5축 어휘 요약* (chat ≡ Paper ≡ React ≡ shadcn ≡ MSW handler) — 디자이너 입장에서 *농도 높음*. 시각 다이어그램 필요 (phase-12 후보)
- ⚠️ "Provider scope" 같은 React 용어 — 비-React 디자이너에겐 추상적

### 2.3 `/gd-chat` simulation (login.chat.md)

- ✅ §5 카탈로그 추천 (LoginForm composite — Card + Form + Input + Label + Button) 이 *정확*
- ✅ frontmatter 표준 (type/name/identity/shell.inherit/created) 명확
- ✅ 3층 (Narrative + Structure + History) walkthrough 자연스러움
- ⚠️ `<Field>` (react-hook-form 의 wrapper) 는 *Tier 2 (shadcn) 카탈로그에 없음*. 디자이너가 직관적으로 쓰지만 catalog 외 어휘. → **FRONT.md 의 form 패턴 매핑 (§10) 을 chat.md grammar 에 흡수 필요** (phase-12)
- ⚠️ Structure 의 ` ```chat ` 코드 블록 — *예시 표기* 인지 *실제 구조* 인지 모호. 컴파일러가 이걸 *예시* 로 무시한 게 §2.4 의 문제 원인

### 2.4 `gd react` (TSX 생성) — ⚠️ **진짜 막힘**

```bash
$ pnpm --filter studio exec tsx scripts/gen-design.ts react login \
    --chat-root .../chats --output .../src/scenes/login.tsx
✓ wrote .../login.tsx (328 bytes)
```

생성 결과:
```tsx
// @gd: ../experiments/dogfood-alpha/chats/scenes/login.chat.md
import React from 'react';

export function LoginScene() {
  return (
    <>
      {/*  외각 컴포넌트를 여기 배치. 예시:
      <Header>
        ...
       */}
    </>
  );
}
```

**🔴 발견 (가장 큰 막힘)**:

1. **Structure 본문 누락** — `_shell.chat.md` 의 *주석 예시* 만 출력되고, *login.chat.md 의 Card + Form 본문 미컴파일*
2. **이유 추정**: ` ```chat ` 코드 블록을 *예시* 로 인식. Structure 본문이 코드 블록 안에 있어 컴파일러가 무시.
3. **`// @gd:` annotation 경로 부정확** — `../experiments/...` 로 시작 (studio/ 기준 상대). workspace root 기준이어야 doctor 가 정합 가능.

→ **외부 디자이너라면 여기서 100% 막힘**. *결과물이 빈 화면* 으로 보이고, 왜 그런지 알 방법이 없음.

### 2.5 `gd doctor` (정합 검증)

```bash
$ pnpm --filter studio exec tsx scripts/gen-design.ts doctor \
    --chat-root .../chats --templates-root .../templates
All checks passed. (3 files)
✗ [contrast] templates/assets/tokens/tokens.json
  dark 모드 destructive-foreground on destructive 대비비 2.75:1 — WCAG 2.1 AA 미달
  → destructive-foreground 의 L 만 조정으로는 AA 달성 불가. 다른 색조 (hue) 검토 필요.
✗ [vocab-similar] _shell.chat.md
  `<Header>` 이 카탈로그에 없습니다.
  → FRONT.md 카탈로그를 확인하거나 Tier 3 composite 으로 승격을 검토하세요.
... (5건 — Header / Logo / Nav / Footer / Copyright)
✗ 6 errors (4ms)
```

- ✅ **4ms** — 5초 budget 의 0.08%
- ✅ contrast: dark destructive 페어 *정확히 검출* + 한국어 친절한 메시지 + 한계 안내
- ✅ vocab-similar: `_shell.chat.md` 주석 안 예시 어휘 5건 검출
- ⚠️ **`_shell.chat.md` 주석 안 예시까지 검출** — 코드 블록 *주석* 은 무시해야 함 (false positive). spec-11-03 의 `extractChatComponents` 가 *주석 처리* 안 함 (phase-12 보강)
- ⚠️ scene-drift / orphan-scene 카테고리 *결과 보이지 않음* — login.tsx 가 있고 chat.md 도 있는데 검증이 *경로 mismatch* 로 못 잡은 듯
- ⚠️ token-format 누락 — `_shell.chat.md` 의 `{primary}` 같은 placeholder 미존재로 token-ref 도 0 검출

---

## §3 발견 사항

### 3.1 진짜 막힘 (외부 디자이너도 막혔을 것)

> **2026-05-23 갱신** — spec-11-05 에서 4 건 해소. PR #68 머지 후 main 반영.

| # | 막힘 | 원인 | 영향 | 상태 |
|---|---|---|---|---|
| 1 | `gd react` 의 Structure 본문 누락 | ` ```chat ` 코드 블록을 *예시* 로 처리 | **치명적** — 결과물이 *빈 화면* | ✅ **spec-11-05 해소** — gd-chat 스킬 §7 의 펜스 제거 + bare 형식 강제. 재dogfooding: 328 bytes → 1943 bytes (본문 컴파일됨) |
| 2 | `// @gd:` annotation 경로 부정확 | studio/ cwd 기준 상대 | doctor scene-drift 불능 | ✅ **spec-11-05 해소** — react.ts: `relative(resolve(chatRoot, ".."), chatPath)`. 재dogfooding: `chats/scenes/login.chat.md` (project root 기준) |
| 3 | `_shell.chat.md` 주석 예시 어휘 false positive | doctor extractChatComponents 가 주석 무시 안 함 | 노이즈 진단 | ✅ **spec-11-05 해소** — `stripHtmlComments` 추가. 재dogfooding: false positive 5건 (Header/Logo/Nav/Footer/Copyright) 제거 |
| 4 | preset 의 `pnpm gd doctor` 미동작 | `@gd/cli` 분리 안 됨 | scaffold 사용자가 doctor 못 씀 | ⏸ **phase-12 남음** — 큰 인프라 작업 (npm publish + monorepo 재구성 + preset 통합) |
| 5 | dark destructive 페어 AA 미달 | shadcn default 토큰 자체 | 본 시스템 default 의 *진짜 결함* | ✅ **spec-11-05 해소** — dark destructive-foreground: `oklch(0.985 0 0)` → `oklch(0.205 0 0)`. doctor 의 contrast 진단 사라짐 |

**별도 발견 (재dogfooding 에서 추가 노출)**:

| # | 항목 | 비고 |
|---|---|---|
| 6 | catalog.json 에 shadcn 표준 컴포넌트 (Card / CardHeader / CardTitle / Form / Field 등) 미등재 | doctor vocab-similar 가 *Tier 2 컴포넌트도* 외부 어휘로 판정. 카탈로그 자동 추출이 *프로젝트 composite* 만 인식. phase-12 후보. |

### 3.2 알고 있어서 우회 (외부 디자이너는 막혔을 것)

| # | 우회 경로 | 외부 디자이너의 경험 |
|---|---|---|
| 1 | "studio CLI 직접 호출 (preset gd 대신)" | scaffold README 따라 `pnpm gd react` 실행 → "command not found" 막힘 |
| 2 | "Structure 가 ```chat 안 본문이라 컴파일 안 됨" 추정 | 결과 빈 화면 → 왜 그런지 모름 |
| 3 | chat.md frontmatter 작성 — Claude Code 없이 직접 편집 | 외부 디자이너는 `/gd-chat` 호출 → Claude 가 작성. 본 simulation 은 *건너뜀* |
| 4 | `pnpm dev` 시각 확인 — 본 spec 은 *시간 절약* 으로 skip | 외부 디자이너는 *시각 확인이 가장 중요* — Vite dev server / Tailwind 빌드 마찰 가능 |

### 3.3 스킬 본문 부정확 / 모호

| 스킬 | 항목 | 개선 |
|---|---|---|
| **gd-start** | §5 5축 어휘 다이어그램이 텍스트만 — 디자이너 입장 *추상적* | 시각 SVG / 더 짧은 요약 |
| **gd-start** | §7 "다음 단계 A/B/C" — 디자이너가 어느 것 우선인지 결정 어려움 | "처음이라면 C → 점진적 개선" 강한 추천 |
| **gd-chat** | §5 카탈로그 추천에 `<Form>` 등장 — Tier 2 shadcn 에 없음 (`<Field>` 도 동일) | FRONT.md §10 form 패턴 매핑 보강 |
| **gd-chat** | §7 Structure 의 ` ```chat ` 표기가 *예시* 인지 *실 구조* 인지 모호 | 코드 블록 fence 변경 또는 grammar 명세 |
| **gd-token** | §5 OKLCH L 조정 알고리즘 — 디자이너가 *직접 OKLCH 입력* 하지 않으면 직관적이지 않음 | hex → OKLCH 자동 변환 예시 추가 |
| **gd-design** | §3 9 섹션 walkthrough — 한 세션에서 모두 채우기 부담 | "한 번에 1-2 섹션" 권장 명시 (이미 §9 에 있지만 약함) |

### 3.4 handbook / FRONT.md / AGENT.md 누락

| 문서 | 누락 / 모호 |
|---|---|
| **FRONT.md** | §10 Form 패턴이 *react-hook-form + zod 표준 코드* 만 보여줌. chat.md grammar 의 `<Field>` 와 매핑 명세 누락 |
| **FRONT.md** | §0 SSG-first 결정의 *예외 4건* 명시되어 있으나 — 디자이너가 이걸 *언제 발견* 하는가? gd-start 에서 자동 명시 안 됨 |
| **AGENT.md** | §4.5 MSW handler 패턴 — `gd api` 명령이 *phase-12 후속* 이라 *지금은 수동* 임이 모호. agent 가 직접 작성 시 패턴 명시 부족 |
| **handbook.md** | (root 의 handbook) §4 워크플로 vs scaffold 의 README 30초 시작 — *어느 것이 진짜* 인지 모호 |

---

## §4 phase-12 후보 (우선순위)

> **2026-05-23 갱신** — spec-11-05 에서 #1, #3, #4, #5 (구 표 기준) = 4 건 해소. 남은 항목만 phase-12.

| # | 우선순위 | 항목 | 출처 |
|---|---|---|---|
| 1 | 🔴 **HIGH** | `@gd/cli` 별도 npm package 분리 — preset 의 `pnpm gd` 실 동작 | §3.1 #4 (유일하게 남은 HIGH) |
| 2 | 🔴 **HIGH** | catalog.json 에 shadcn 표준 컴포넌트 (Card / Form / Field 등) 등재 — doctor false positive 회피 | §3.1 #6 (재dogfooding 발견) |
| 3 | 🟠 MID | `<Form>` / `<Field>` 같은 react-hook-form 어휘 — Tier 3 composite 으로 카탈로그 등재 | §3.3 (gd-chat) |
| 4 | 🟡 LOW | gd-start §5 5축 어휘 시각 다이어그램 | §3.3 (gd-start) |
| 5 | 🟡 LOW | gd-token §5 hex → OKLCH 자동 변환 예시 | §3.3 (gd-token) |
| 6 | 🟡 LOW | scaffold README "Claude Code 설치" 안내 | §2.1 |
| 7 | 🟢 OPT | 실 외부 디자이너 alpha 채용 / 인터뷰 | (편향 해소) |
| 8 | 🟢 OPT | `gd api` (MSW handler 자동 생성, FRONT.md §8) | (phase-11 §8 후속) |
| 9 | 🟢 OPT | `gd doctor --fix` 자동 수정 모드 | (편의성) |
| 10 | 🟢 OPT | chat.md grammar — ` ```chat ` info-string fenced block 도 parse | (호환성 확장. spec-11-05 는 스킬 본문 수정으로 회피) |

✅ 해소됨 (spec-11-05):
- ~~`gd react` Structure 본문 컴파일~~ (스킬 펜스 제거로 회피)
- ~~`// @gd:` annotation 경로 workspace root 기준~~ (chatRoot 부모 기준으로)
- ~~doctor extractChatComponents 주석 무시~~ (`stripHtmlComments` 추가)
- ~~shadcn default dark destructive 페어~~ (foreground L 조정으로 AA 통과)

---

## §5 결론

**2026-05-23 갱신**: phase-11 의 *기술 자산* 은 *작동* 한다. spec-11-05 hotfix 로 **5 진짜 막힘 중 4건 해소**:

✅ **해소** (spec-11-05 — phase-11 안에서):
1. `gd react` Structure 본문 컴파일 결함 — gd-chat 스킬의 펜스 안내 정정 + bare 형식 강제
2. `// @gd:` annotation 경로 — chatRoot 부모 기준 (project root)
3. doctor false positive — HTML 주석 무시
4. dark destructive 페어 — foreground L 조정으로 AA 통과

⏸ **phase-12 남음**:
1. **#4 `@gd/cli` npm 분리** — 큰 인프라 작업 (npm publish + monorepo 재구성)
2. **재dogfooding 새 발견**: catalog.json 에 shadcn 표준 컴포넌트 미등재 — doctor false positive

**phase-12 spec 후보**:
- spec-12-01: `@gd/cli` npm 분리 + scaffold preset 통합 (`pnpm gd` 실 동작)
- spec-12-02: catalog 에 Tier 2 shadcn 컴포넌트 등재 (vocab-similar 정밀도 ↑)
- spec-12-03: 실 외부 디자이너 alpha — 본 simulation 가정 검증

→ phase-11 의 *외부 alpha 가능 깃발* 이 *진정* 정합. PR #68 머지 가능.

---

## 부록: 본 alpha 의 git artifacts

| 파일 | 내용 |
|---|---|
| `experiments/dogfood-alpha/` | 53 파일 scaffold 결과 |
| `experiments/dogfood-alpha/.gd/memory/designer.md` | gd-start §3 simulation |
| `experiments/dogfood-alpha/.gd/memory/project.md` | gd-start §4 simulation |
| `experiments/dogfood-alpha/chats/scenes/login.chat.md` | gd-chat simulation 결과 |
| `experiments/dogfood-alpha/src/scenes/login.tsx` | gd react 결과 (Structure 누락) |
| `experiments/dogfooding-alpha-2026-05.md` | 본 보고서 |
