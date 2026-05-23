---
name: gd-start
description: 첫 사용자 onboarding. handbook 5분 요약 + 디자이너/프로젝트 정보 수집 + .gd/memory 초기화 + 다음 단계 안내. 새 디렉토리에서 첫 호출 시, 또는 디자이너가 막힐 때 호출.
---

# gd-start — 첫 사용자 onboarding

> 본 스킬은 *능동 도구* 입니다. 단순히 문서를 보여주지 않습니다 — *질문 → 듣기 → 디스크에 기록 → 다음 단계 안내* 의 흐름을 실행하세요.

---

## §1 자동 로딩 컨텍스트 (호출 즉시)

본 스킬이 호출되면 *반드시* 다음을 *모두 읽어 컨텍스트로 보유*:

| 파일 | 역할 |
|---|---|
| `templates/FRONT.md` | React stack 결정 (어떤 코드가 나올지) |
| `templates/AGENT.md` | agent 행동 규칙 |
| `templates/DESIGN.md` | 디자인 명세 (디자이너 surface) |
| `templates/TOKEN.md` | 디자인 토큰 (디자이너 surface) |
| `templates/assets/tokens/tokens.json` | 토큰 값 (shadcn 표준) |
| `chats/_shell.chat.md` | 전역 외각 chat |
| `chats/scenes/*.chat.md` | 기존 신 |
| `.gd/memory/MEMORY.md` | 메모리 인덱스 |
| `.gd/memory/{designer,project,decisions,feedback}.md` | 4 memory entry |

→ 모두 비어있어도 OK — 채워나가는 게 본 스킬의 일.

---

## §2 환영 + 본 프로젝트 의도 (한 단락)

호출되면 사용자에게 *이렇게* 인사하세요 (한국어, 짧게):

```
안녕하세요. taskboard-v5 디자인 시작을 도와드리겠습니다.

이 프로젝트는 디자이너가 chat.md (화면 명세) + DESIGN.md (디자인 가이드) + TOKEN.md (토큰)
3가지만 만지면 React (shadcn + Tailwind) 코드가 결정적으로 컴파일되는 도구입니다.

먼저 짧은 질문 2개로 시작할게요.
```

→ 이미 `.gd/memory/designer.md` 가 채워져 있으면 *질문 생략하고 §5 (요약) 로 직행*.

---

## §3 디자이너 정보 수집 (1-2 질문 → designer.md append)

`.gd/memory/designer.md` 의 본문이 비어있으면 질문:

```
1. 어떻게 호칭하면 좋을까요? (이름 또는 별명)
2. 작업 스타일은? (예: 빠른 결정 / 신중한 검토)
```

받은 답변을 `.gd/memory/designer.md` 의 `<!-- ... -->` 아래에 append:

```markdown
## 프로필

- **호칭**: <받은 답변>
- **스타일**: <받은 답변>
- **첫 만남**: YYYY-MM-DD (오늘 날짜)
```

→ 이후 모든 스킬이 이 정보를 보고 톤 / 답변 길이 조정.

---

## §4 프로젝트 정보 수집 (1-2 질문 → project.md append)

`.gd/memory/project.md` 본문이 비어있으면 질문:

```
1. taskboard-v5 은 어떤 서비스인가요? (한 문장)
2. 누가 쓸 건가요? (타깃 사용자)
```

받은 답변을 `.gd/memory/project.md` 에 append:

```markdown
## 프로젝트 정의

- **한 줄**: <받은 답변>
- **타깃**: <받은 답변>
- **시작일**: YYYY-MM-DD
```

→ 브랜드 / 도메인 / 톤 등 *추가 정보* 는 이후 `/gd-design`, `/gd-token` 호출 시 부수적으로 수집.

---

## §5 4축 어휘 5분 요약 (handbook 핵심)

본 프로젝트의 *real & defensible* 차별화 — 디자이너가 *반드시* 알아야 할 모델:

```
[디자이너 작성]   chat.md 의 <Component variant="x">
        ≡
[Paper 시각]      Paper 노드 + layer-name anchor (optional)
        ≡
[React 출력]      shadcn/ui 컴포넌트 + composites
        ≡
[LLM 학습]        shadcn 이름 = LLM 훈련 데이터 풍부
        ≡
[API contract]    MSW handler + zod schema
```

**핵심 이해**:

- *같은 이름* 의 컴포넌트가 4 (또는 5) 곳에서 *같은 의미* 로 쓰입니다.
- 디자이너가 chat.md 에 `<Button variant="default">` 라고 적으면, *그대로* shadcn Button 의 default variant 가 컴파일됩니다.
- **임의로 새 이름 만들지 마세요** — 카탈로그 (FRONT.md / catalog.json) 에 있는 어휘만 사용.
- 새 어휘가 필요하면 *Tier 3 composite 으로 승격* — 3회 룰 (FRONT.md §9).

---

## §6 워크플로 다이어그램

```
디자이너 (당신)
   │
   ├─ /gd-token   → templates/TOKEN.md + tokens.json (색 / radius 결정)
   │                  └─ shadcn 24 토큰 (light + dark) 값 조정
   │
   ├─ /gd-design  → templates/DESIGN.md (디자인 컨벤션)
   │                  └─ Stitch 9 섹션 + i18n + 어휘 매핑
   │
   └─ /gd-chat    → chats/scenes/<name>.chat.md (화면 명세)
                      └─ Narrative + Structure + History 3층
                          ↓
              pnpm gd react chats/scenes/<name>.chat.md
                          ↓
                  src/scenes/<name>.tsx (자동 생성)
                          ↓
              pnpm gd doctor (정합 검증)
                          ↓
                  pnpm dev (시각 확인)
```

---

## §7 다음 단계 안내

위 §3-§4 정보 수집이 끝나면 *반드시* 다음을 안내:

```
좋습니다. 이제 첫 화면을 만들어볼게요.

🎨 **추천: 바로 화면부터 만들기** — `/gd-chat`
   → 결과가 *눈에 보여야* 진척감이 생깁니다.
   → 첫 화면 (예: 로그인 / 대시보드 / 환영) 한 개 먼저.

나중에 필요하면:
  • `/gd-token`  — 색 / 토큰 조정 (브랜드 색이 정해져 있으면)
  • `/gd-design` — 디자인 컨벤션 문서화 (3-5 화면 만든 후)
```

**왜 /gd-chat 부터?** (spec-11-07 fix #v2-4 — v2 dogfooding 의 *미경 멈춤* 회피)

- 디자이너는 *시각 결과* 가 최우선 — 토큰 / 디자인 컨벤션은 추상적이라 첫 만남에 부담
- 첫 화면이 *동작하면* 신뢰 ↑ → 후속 작업 (token / design) 동기 ↑
- token / design 결정은 *나중에 화면 보면서* 가 더 정확
- 본 스킬이 *전체 흐름 가이드* — 디자이너가 결정 부담 ↓

→ 사용자가 *동의* 하면 `/gd-chat` 호출. 거절 / 다른 의도 있으면 그 답변 따름.

---

## §8 자주 묻는 질문 (FAQ — 미리 답 준비)

| Q | A |
|---|---|
| **Paper MCP 없어도 되나요?** | 네. Paper 는 *시각 거울* 으로 옵션입니다. chat.md → React 만 사용해도 동작. |
| **shadcn / Tailwind 몰라도 되나요?** | 네. 모든 인프라는 scaffold 가 셋업 완료. 디자이너는 *chat.md / DESIGN.md / TOKEN.md* 만 만집니다. |
| **`src/scenes/X.tsx` 수정해도 되나요?** | ❌ 안 됩니다. `gd react` 가 chat.md → TSX 자동 생성하므로, 직접 수정하면 다음 컴파일에 덮어쓰여집니다. chat.md 만 수정. |
| **새 컴포넌트가 필요한데 카탈로그에 없어요** | 두 가지 — (1) 기존 어휘 조합으로 표현 (2) Tier 3 composite 으로 승격 (3회 반복 시 자동). 디자이너가 직접 작성하지 않습니다. |
| **다크 모드 지원하나요?** | 네, shadcn 표준 — `<html class="dark">` 토글 시 자동. `/gd-token` 으로 dark 값 조정. |
| **이 정보들 (memory) 어디 저장되나요?** | `.gd/memory/` 디렉토리. git 추적 가능 — 팀 공유 OK. session 압축에도 보존. |

---

## §9 안티 패턴 (스킬 본인 행동)

본 스킬을 호출했을 때 *agent (당신) 가 절대 하지 말 것*:

- ❌ 이미 채워진 memory entry 를 *덮어쓰기* — append 만
- ❌ *추측* 으로 memory entry 채우기 — 항상 사용자에게 *물어보고* 받은 답변만 기록
- ❌ shadcn / Tailwind / cn / cva 같은 기술 용어를 *설명 없이* 사용 — 디자이너가 모를 수 있음
- ❌ 영어로 답변 — 한국어 우선 (사용자가 영어로 묻지 않는 한)
- ❌ 다음 단계 안내 *건너뛰기* — 디자이너가 막힘
- ❌ "Paper MCP 필요" 라고 답변 — Paper 는 옵션, 본 preset 은 SSG-first

---

## §10 종료 조건

다음이 모두 충족되면 본 스킬 호출이 *완료* :

- [ ] `.gd/memory/designer.md` 의 `## 프로필` 섹션이 채워짐
- [ ] `.gd/memory/project.md` 의 `## 프로젝트 정의` 섹션이 채워짐
- [ ] 사용자가 §7 의 다음 단계 (A / B / C) 중 하나를 선택

→ 사용자가 다음 스킬 호출 (예: `/gd-chat`) 하면 자동으로 그 흐름 진입.
