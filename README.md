# gen-design

디자이너의 자연어를 chat.md로 정리하고, Figma · Stitch · Paper 같은 디자인 툴과 React TSX를 같은 언어로 연결하는 **designer-publisher 페어 도구**.

[![npm](https://img.shields.io/npm/v/create-gd-react?label=create-gd-react)](https://www.npmjs.com/package/create-gd-react)
[![npm](https://img.shields.io/npm/v/@gen-design/skills?label=%40gen-design%2Fskills)](https://www.npmjs.com/package/@gen-design/skills)

---

## TL;DR

```bash
npm create gd-react@latest my-app   # 새 프로젝트 (토큰 + 스킬 자동 포함)
npx @gen-design/skills              # 기존 프로젝트에 스킬만 추가
```

Claude Code에서:
```
/gd-start              → DESIGN.md + 컨텍스트 수집
/gd-chat               → AI와 대화로 화면 명세(chat.md) 작성
pnpm gd react <scene>  → React TSX 컴파일
```

---

## 디자이너의 고민

Figma나 Stitch에서 화면을 완성해도, 개발자에게 전달하는 순간 의도가 흐려집니다. 컴포넌트 이름이 달라지고, 비슷한 패턴이 중복으로 생기고, 재사용할 수 있었던 것들이 매번 처음부터 만들어집니다.

gen-design은 이 문제를 **4축 어휘 정합**으로 해결합니다. 디자이너가 쓰는 이름, 디자인 툴의 레이어 이름, React 컴포넌트 이름, LLM이 아는 이름이 모두 같아야 번역 없이 연결됩니다.

---

## 아키텍처

### 4축 어휘 정합

```
[디자이너 작성]   chat.md 의 <Button variant="primary">
        ≡
[디자인 툴 시각]  Figma / Stitch layer-name 식별자
        ≡
[React 출력]      shadcn/ui Button 컴포넌트
        ≡
[LLM 학습]        shadcn 이름은 LLM 훈련 데이터에 풍부
```

`<LoginScene>`이라고 쓰면 디자인 툴 레이어 이름, React 컴포넌트, LLM이 아는 이름 모두 `LoginScene`입니다. 번역이 없으니 오차가 없습니다.

> 4축이 동일한 어휘로 통일된 도구는 현재 이 도구가 유일합니다.

### 컴포넌트 3티어

```
Tier 1 · ARIA          button, textbox, dialog ...            W3C 시맨틱 토대 (93개)
                ↑
Tier 2 · shadcn/ui     Button, Input, Card, Skeleton ...      Radix 기반 Primitive
                ↑
Tier 3 · Project       LoginForm, StatCard    (Composite)
                       LoginScene, Dashboard  (Scene)         페이지 통째 재사용
```

Scene 단위로 재사용하므로 새 앱에서 **토큰 / i18n만 교체**하면 됩니다:

```tsx
<LoginScene tokens={brandA.tokens} i18n={brandA.ko} />  // 한국어 + 인디고
<LoginScene tokens={brandB.tokens} i18n={brandB.en} />  // 영어 + 그린
```

### 토큰 3티어

W3C DTCG 표준. Primitive → Semantic → Component 단방향 참조로 브랜딩 한 줄 교체가 가능합니다.

```
Tier 1 · Primitive     indigo.{50..700}, neutral.{0..950}, red.{400..700}
                ↑ {primitive.indigo.600}
Tier 2 · Semantic      primary, background, destructive, border, ring
                       light / dark 분리. 모드 전환은 여기서.
                ↑ var(--primary)
Tier 3 · Component     <Button class="bg-primary text-primary-foreground">
                       Tailwind 유틸리티로 의미 토큰 소비.
```

```json
// tokens.json — semantic만 바꾸면 전체 앱이 변함
"primary": { "$value": "{primitive.indigo.600}" }
"primary": { "$value": "{primitive.green.600}" }
```

CSS 변수로 자동 빌드 → Tailwind `bg-primary` → 즉시 반영.

---

## gd-skills — 내 디자인 도서관 사서

gd-skills은 단순한 AI 변환기가 아닙니다. 기존 화면과 컴포넌트를 기억하고, 새 화면을 만들 때마다 재사용 후보를 먼저 찾아 제안합니다.

```
디자이너: "대시보드. 통계 카드 4개 + 최근 활동."

AI: 잠깐, 비슷한 게 이미 있어요.
    welcome.chat.md — StatCard 사용 중 (icon + value + label 패턴)
    토큰: bg-card, text-primary, border-border

    옵션:
      A) StatCard 재사용 — 토큰 동일, 4개 인스턴스만 추가 (권장)
      B) 새 컴포넌트 — 다른 패턴 필요 시

디자이너: A. 마감 임박은 빨강.
AI: destructive 토큰 활용 — 새 토큰 없이 처리됩니다.
```

재사용할지 / 확장할지만 결정하면, 일관성은 AI가 유지합니다:

- **재사용 후보** — "EmptyState가 이미 카탈로그에 있어요"
- **글로벌 승격** — "BrandHeader가 3개 화면에 공통 — shell로 승격할까요?"
- **제약 대화** — "login 화면은 보통 헤더 없이 — 어떻게 할까요?"
- **어휘 검증** — "LoginPage는 카탈로그에 없어요. LoginScene 의도인가요?"

---

## chat.md — gd 채팅 가이드

자연어로 대화해서 화면 명세를 만들고 수정하는 채널입니다. 동결된 산출물이 아니라 **편집하면 디자인 툴과 React가 따라오는 살아있는 문서**입니다.

| 층 | 역할 | 예 |
|---|---|---|
| **Narrative** | 디자이너 의도 — 왜 / 무엇 / 어떤 결 | "mineral 톤. CTA 단일. 절제된 환영." |
| **Structure** | machine-readable 컴포넌트 트리 | `<LoginScene><Button variant="primary">` |
| **History** | 변경 이력 (언제 / 왜) | "CTA copper → muted (절제 강화)" |

```markdown
---
type: scene
name: LoginScene
identity: chats/scenes/login
---

## 💬 Narrative
사용자 첫 진입. 브랜드 감성 + 빠른 로그인.
mineral 톤 — 절제. CTA 단일. 소셜 슬롯 하단.

## 🧩 Structure
<LoginScene>
  <BrandHeader />
  <LoginForm>
    <Button variant="primary">로그인</Button>
    <Button variant="ghost">회원가입</Button>
  </LoginForm>
  <SocialAuthBlock />
</LoginScene>

## 📜 History
- 초안 작성
- SocialAuthBlock 추가 (소셜 로그인 요구사항)
```

---

## 사용 흐름

### Step 1. 화면 설계

```
디자이너: "로그인 화면 만들어줘. 브랜드 감성 + 빠른 입력. 소셜 로그인 슬롯 하단에."

AI: 새 화면이네요.
    → 브랜드 감성 = mineral 톤 (절제)
    → CTA 1개, 소셜 슬롯 하단 배치
    chats/scenes/login.chat.md 생성할게요.

디자이너: "맞아. CTA는 진하게."
AI: variant="primary" 적용. 업데이트됩니다.
```

### Step 2. 재사용 제안

```
디자이너: "이제 대시보드. 통계 카드 4개 + 최근 활동."

AI: welcome.chat.md에서 StatCard 발견 — 재사용할까요?

디자이너: "응. 마감 임박 카드만 빨갛게."
AI: variant="destructive" — 새 토큰 없이 처리됩니다.
    chats/scenes/dashboard.chat.md 생성.
```

### Step 3. React 컴파일

```bash
pnpm gd react chats/scenes/login.chat.md
pnpm gd react chats/scenes/dashboard.chat.md
```

chat.md를 수정하고 다시 컴파일하면 됩니다. 중간 번역 레이어가 없어 오차가 생기지 않습니다.

---

## 새 프로젝트 시작

```bash
npm create gd-react@latest my-app
cd my-app && pnpm install
```

스캐폴드에 모든 것이 포함되어 있습니다:

```
my-app/
├── templates/
│   ├── FRONT.md          ← 스킬 룰북 (컴포넌트 카탈로그 + 컴파일 규칙)
│   ├── TOKEN.md          ← 토큰 설계 narrative
│   ├── DESIGN.md         ← 화면 구조 + 인터랙션 명세
│   └── assets/tokens/
│       └── tokens.json   ← 24개 시맨틱 토큰 (light/dark, DTCG 형식)
├── chats/                ← chat.md 누적 위치
│   ├── scenes/
│   └── components/
├── .claude/skills/       ← Claude Code 스킬 4종 자동 설치
│   ├── gd-start.md
│   ├── gd-chat.md
│   ├── gd-design.md
│   └── gd-token.md
├── .gd/memory/           ← AI 프로젝트 메모리 (결정 이력 + 디자이너 컨텍스트)
└── src/                  ← React + Tailwind + shadcn/ui 기본 구성
```

Claude Code에서 `/gd-start`를 호출하면 AI가 이 파일들을 읽고 컨텍스트를 잡습니다.
이후 `/gd-chat`으로 화면을 작성하면 `FRONT.md`의 카탈로그에 따라 코드가 결정됩니다.

---

## 스킬 4종

| 스킬 | 역할 |
|---|---|
| `/gd-start` | DESIGN.md 읽기 + 프로젝트 컨텍스트 수집. 새 프로젝트 첫 시작 시 1회 |
| `/gd-chat` | 자연어 → chat.md 3층 구조 작성. 화면마다 호출 |
| `/gd-design` | DESIGN.md 빈 섹션 채우기. 화면 명세 정교화 |
| `/gd-token` | 토큰 추가 / 수정. WCAG AA 검증 + light/dark 동기화 포함 |

---

## 패키지 및 도구

| | |
|---|---|
| [`create-gd-react`](https://www.npmjs.com/package/create-gd-react) | 신규 프로젝트 스캐폴드 — 템플릿 + 토큰 + 스킬 4종 자동 포함 |
| [`@gen-design/skills`](https://www.npmjs.com/package/@gen-design/skills) | 기존 프로젝트에 스킬만 추가 (`npx @gen-design/skills`) |
| `pnpm gd react <scene>` | chat.md → React TSX (FRONT.md 룰 적용) |
| `pnpm gd tokens` | 토큰 조회 (list / find / show) |
| `pnpm gd doctor` | 품질 점검 |

---

<details>
<summary>더 읽기</summary>

- [`docs/handbook.md`](docs/handbook.md) — 전체 아키텍처, 워크플로, 원칙, ADR 인덱스
- [`docs/motivation.md`](docs/motivation.md) — 프로젝트 배경과 핵심 아이디어

**스택**: DESIGN.md (Stitch 기반) · W3C DTCG 토큰 · shadcn/ui + Radix · Tailwind CSS · React + Vite + TypeScript · TanStack Query v5 · react-hook-form + zod · Paper MCP

</details>

---

<sub>MIT Licensed</sub>
