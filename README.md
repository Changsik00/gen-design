# gen-design

디자이너가 자연어로 말하면 AI가 chat.md로 정리하고, Paper에서 시각화되고, React TSX로 결정론적 컴파일되는 **designer-publisher 페어 도구**.

[![npm](https://img.shields.io/npm/v/@gen-design/skills?label=%40gen-design%2Fskills)](https://www.npmjs.com/package/@gen-design/skills)
[![npm](https://img.shields.io/npm/v/create-gd-react?label=create-gd-react)](https://www.npmjs.com/package/create-gd-react)

---

## TL;DR

```bash
npm create gd-react@latest my-app   # 새 프로젝트
npx @gen-design/skills              # 기존 프로젝트에 스킬 추가
```

Claude Code에서:
```
/gd-start              → DESIGN.md + 컨텍스트 수집
/gd-chat               → AI와 대화로 화면 명세(chat.md) 작성
pnpm gd react <scene>  → React TSX 컴파일
```

---

## 왜 결정론적으로 컴파일되는가 — 4축 어휘 정합

이 프로젝트의 핵심 차별화는 **4개 레이어가 동일한 어휘(shadcn 이름)를 공유**한다는 점입니다.

```
[디자이너 작성]   chat.md 의 <Button variant="primary">
        ≡
[Paper 시각]      Paper 노드 이름 + layer-name 식별자
        ≡
[React 출력]      shadcn/ui Button 컴포넌트
        ≡
[LLM 학습]        shadcn 이름은 LLM 훈련 데이터에 풍부
```

디자이너가 `<LoginScene>`이라고 쓰면, Paper 레이어 이름도 `LoginScene`, React 컴포넌트도 `LoginScene`, LLM도 이미 알고 있는 이름입니다. 번역이 없으니 오차가 없습니다.

> 시장에서 4축이 같은 어휘로 통일된 도구는 현재 이 프로젝트가 유일합니다.

---

## AI는 단순 변환기가 아닙니다 — 도서관 사서

매 화면 작성 시 AI는 기존 `chats/`, `catalog.json`, `templates/`를 읽고 능동적으로 제안합니다:

```
디자이너: "대시보드. 통계 카드 4개 + 최근 활동."

AI: 잠깐, 비슷한 게 이미 있어요.
    mypage.chat.md — StatCard 3개 사용 중 (icon + value + label 패턴)
    토큰: bg-card, text-primary, border-border

    옵션:
      A) StatCard 재사용 — 토큰 동일, 4개 인스턴스만 추가 (권장)
      B) 새 컴포넌트 — 다른 패턴 필요 시

디자이너: A. 마감 임박은 빨강.
AI: destructive 토큰 활용 — 새 토큰 추가 없이 처리.
    decisions.md에 "StatCard 재사용 + variant=destructive" 기록.
```

AI가 능동적으로 제안하는 항목:
- **재사용 후보** — "EmptyState가 이미 catalog에 있어요"
- **글로벌 승격** — "BrandHeader가 3 scene에 공통 — shell로 승격할까요?"
- **제약 대화** — "login scene은 보통 헤더 없이, 어떻게?"
- **어휘 검증** — "LoginPage라는 이름은 catalog에 없어요. LoginScene 의도?"

재사용 / 확장만 결정하면 일관성은 AI가 자동 유지합니다.

---

## chat.md — 화면의 살아있는 명세

AI가 자연어 입력을 받아 정리하는 3층 구조입니다. 동결된 산출물이 아니라 **재편집 가능한 살아있는 소통 채널**입니다.

| 층 | 역할 | 예 |
|---|---|---|
| **Narrative** | 디자이너 의도 — 왜 / 무엇 / 어떤 결 | "mineral 톤. CTA 단일. 절제된 환영." |
| **Structure** | machine-readable 컴포넌트 트리 | `<LoginScene><Button variant="primary">` |
| **History** | 변경 이력 (언제 / 왜) | "2026-05-10 CTA copper → muted (절제 강화)" |

```markdown
---
type: scene
name: LoginScene
identity: chats/scenes/login
shell: { inherit: true, exclude: [header] }
---

## 💬 Narrative
사용자 첫 진입. 브랜드 감성 + 빠른 로그인.
mineral 톤 — 절제. CTA 단일. 소셜 슬롯 하단.

## 🧩 Structure
<LoginScene>
  <BrandHeader />
  <LoginForm>
    <Button variant="primary">{{i18n.ko.login.submit}}</Button>
    <Button variant="ghost">{{i18n.ko.login.signupHint}}</Button>
  </LoginForm>
  <SocialAuthBlock />
</LoginScene>

## 📜 History
- 2026-05-10 초안 — Paper artboard에서 추출
- 2026-05-12 SocialAuthBlock 추가 (요구사항 확대)
```

chat.md를 재편집하면 AI가 다시 정리하고, Paper와 React가 따라옵니다.

---

## 디자이너 워크플로 — Profile Scene 추가 시나리오

### Day 1 — Paper에서 시각 의도 표현

```
디자이너: "Profile Scene 만들 거야.
           Avatar + 정보 카드 + 통계 3개 + 편집/로그아웃 CTA."

AI: AvatarUpload가 catalog에 있어요. 사용 OK?
    StatCard도 발견 — 재사용 제안.

→ Paper artboard 생성 (layer-name: "ProfileScene [chat:scenes/profile]")
→ AvatarUpload / ProfileInfoCard / StatCard×3 / 버튼 배치
```

### Day 2 — AI가 자연어 의도를 chat.md로 정리

```
디자이너: "mineral 톤. 정보 + 통계 + 액션 균형으로 정리해줘."

AI: Paper 트리 읽기 → 3층 chat.md 작성
→ playground/chats/scenes/profile.chat.md 생성
```

### Day 3 — 양방향 수정

```
디자이너: "첫 번째 통계 카드 강조하고 싶어. variant=highlighted."

AI: chat.md Structure 갱신 + Paper 반영 + History 1줄 추가.
    (역방향) Paper 직접 수정 → "Paper 변경분 반영해줘" → chat.md 갱신.
```

### Day 4 — 글로벌 SSOT 직접 편집

신규 컴포넌트 / 토큰 / i18n 키가 추가됐다면 글로벌 파일을 직접 갱신합니다:

- `templates/DESIGN.md` — ProfileScene 섹션 추가
- `templates/assets/tokens/tokens.json` — 신규 토큰 (DTCG 형식)
- `templates/assets/i18n/ko.json` — 신규 키 (`profile.edit`, `profile.logout`)

### Day 5 — 컴파일 + 검증 + PR

```bash
pnpm gd react chats/scenes/profile.chat.md   # React TSX 컴파일
pnpm --filter studio test                    # 회귀 테스트
pnpm --filter studio build                   # 빌드 검증
```

---

## 컴포넌트 3티어

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

---

## 토큰 3티어

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
"primary": { "$value": "{primitive.indigo.600}" }   // 인디고 브랜드
"primary": { "$value": "{primitive.green.600}" }    // 그린 브랜드
```

CSS 변수로 자동 빌드 → Tailwind `bg-primary` → 즉시 반영.

```bash
pnpm gd tokens list           # 전체 토큰 (light/dark 비교)
pnpm gd tokens find blue      # 검색
pnpm gd tokens show primary   # 상세
```

---

## SSOT 4 문서

| 문서 | 위치 | 역할 |
|---|---|---|
| **DESIGN.md** | `templates/DESIGN.md` | 페이지 / 화면 구조 + 인터랙션 명세 |
| **TOKEN.md** | `templates/TOKEN.md` | 토큰 결정 근거 + `tokens.json` |
| **FRONT.md** | `templates/FRONT.md` | 컴파일 룰북 + 3-tier 어휘 카탈로그 |
| **chat.md** | `chats/{scenes,components}/` | 한 scene/component의 살아있는 명세 (3층) |

chat.md는 3개 등급으로 관리됩니다:

| 등급 | 위치 | 정책 |
|---|---|---|
| 회귀 (고정) | `fixtures/chats/` | 컴파일러 결정성 게이트 — 거의 안 변함 |
| 정식 산출물 | `chats/` | 사용자 의뢰로 누적되는 영구 chat.md |
| 도그푸딩 | `playground/chats/` | 자유 실험, 채택 시 chats/로 승격 |

---

## 패키지 및 도구

| | |
|---|---|
| [`create-gd-react`](https://www.npmjs.com/package/create-gd-react) | 신규 프로젝트 스캐폴드 |
| [`@gen-design/skills`](https://www.npmjs.com/package/@gen-design/skills) | Claude Code 스킬 설치 |
| `pnpm gd react <scene>` | chat.md → React TSX |
| `pnpm gd tokens` | 토큰 조회 (list / find / show) |
| `pnpm gd doctor` | 품질 점검 |

---

<details>
<summary>더 읽기</summary>

- [`docs/handbook.md`](docs/handbook.md) — 전체 아키텍처, 워크플로, 원칙, ADR 인덱스
- [`docs/motivation.md`](docs/motivation.md) — 프로젝트 배경과 핵심 아이디어
- [`backlog/queue.md`](backlog/queue.md) — 현재 진행 상황

**스택**: DESIGN.md (Stitch 기반) · W3C DTCG 토큰 · shadcn/ui + Radix · Tailwind CSS · React + Vite + TypeScript · TanStack Query v5 · react-hook-form + zod · Paper MCP

</details>

---

<sub>MIT Licensed</sub>
