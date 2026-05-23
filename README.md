# gen-design

> **AI와 대화하면 React 앱이 나옵니다.**
> 디자인 토큰부터 컴포넌트, 페이지까지 — 사람과 AI가 함께 만드는 디자인 시스템 파이프라인.

[![npm](https://img.shields.io/npm/v/@gen-design/skills?label=%40gen-design%2Fskills)](https://www.npmjs.com/package/@gen-design/skills)
[![npm](https://img.shields.io/npm/v/create-gd-react?label=create-gd-react)](https://www.npmjs.com/package/create-gd-react)

---

## 30초 시작

```bash
# 새 프로젝트
npm create gd-react@latest my-app
cd my-app && pnpm install

# 기존 프로젝트에 스킬만 추가
npx @gen-design/skills
```

Claude Code 에서 `/gd-start` → `/gd-chat` → `pnpm gd react <scene>`.

---

## 사용 예시

```
> /gd-start
AI: 어떤 앱인가요?
> 태스크 관리 SaaS, 미니멀
AI: ✓ DESIGN.md 초안 작성 (primary=indigo, radius=base)

> /gd-chat
AI: 어떤 화면을 만들까요?
> 대시보드. 통계 카드 4개

AI: 비슷한 화면을 찾았어요 — mypage.tsx 의 StatCard 패턴.
    A) ♻️  재사용 (권장) — 토큰 동일
    B) 새 컴포넌트
> A. 단 "마감 임박"은 빨강 강조
AI: ✓ destructive 토큰 활용. 새 토큰 추가 없이 처리

> pnpm gd react dashboard
✓ src/scenes/dashboard.tsx 생성 (StatCard ×4, useQuery + Skeleton 자동)
```

> AI 가 *비슷한 패턴을 먼저 제안*. 재사용 / 확장만 결정하면 일관성 자동 유지.

---

## 컴포넌트 3티어

페이지 단위로 *통째 재사용* — shadcn/ui 보다 한 계층 위.

```
Tier 1 · ARIA          button, textbox, dialog ...        ← W3C 시맨틱 토대
                                ↑
Tier 2 · shadcn/ui     Button, Input, Card, Skeleton ...  ← Radix 기반 Primitive
                                ↑
Tier 3 · Project       LoginForm, StatCard   (Composite)
                       LoginScene, Dashboard (Scene)      ← 페이지 통째 재사용
```

```tsx
// 같은 Scene, 다른 브랜드
<LoginScene tokens={brandA.tokens} i18n={brandA.ko} />
<LoginScene tokens={brandB.tokens} i18n={brandB.en} />
```

---

## 토큰 3티어

W3C DTCG 표준. **Primitive → Semantic → Component** 단방향 참조로 *브랜딩 한 줄 교체*.

```
Tier 1 · Primitive     indigo.{50..700}, neutral.{0..950}  ← 원시 팔레트
                                ↑ {primitive.indigo.600}
Tier 2 · Semantic      primary, destructive, border ...    ← light/dark 분리
                                ↑ var(--primary)
Tier 3 · Component     <Button class="bg-primary">         ← Tailwind 소비
```

```bash
pnpm gd tokens list           # 전체 목록
pnpm gd tokens find blue      # 검색
pnpm gd tokens show primary   # 상세 (light/dark 비교)
```

---

## Claude Code 스킬

| 스킬 | 역할 |
|---|---|
| `/gd-start` | 첫 온보딩 — DESIGN.md + 컨텍스트 |
| `/gd-chat` | 화면 설계 대화 — chat.md + .order.md 작성 |
| `/gd-design` | DESIGN.md 토큰/컴포넌트 편집 |
| `/gd-token` | 디자인 토큰 조회 |

```bash
npx @gen-design/skills          # 설치
npx @gen-design/skills --force  # 덮어쓰기
```

---

## 패키지

| 패키지 | 역할 |
|---|---|
| [`create-gd-react`](https://www.npmjs.com/package/create-gd-react) | 신규 프로젝트 스캐폴드 |
| [`@gen-design/skills`](https://www.npmjs.com/package/@gen-design/skills) | Claude Code 스킬 인스톨러 |
| `@gd/cli` | `pnpm gd` 명령 (react / tokens / doctor) |
| `studio` | 컴파일러 + Paper 미리보기 |

---

<details>
<summary>프로젝트 구조</summary>

```
Design/
├── packages/
│   ├── create-gd-react/      ← 신규 프로젝트 스캐폴드
│   ├── gd-cli/               ← pnpm gd 명령
│   └── gd-skills/            ← npx 스킬 인스톨러
├── studio/                   ← 컴파일러 + Paper 미리보기
├── docs/
│   ├── handbook.md           ← 실무 진입점 (5분 통독)
│   ├── motivation.md         ← 프로젝트 배경/철학
│   └── decisions/            ← ADR
├── templates/                ← DESIGN.md / 토큰 템플릿
├── backlog/                  ← Phase별 백로그
└── specs/                    ← Spec 산출물
```

</details>

<details>
<summary>기술 스택</summary>

DESIGN.md (Stitch 기반) · W3C DTCG 토큰 · shadcn/ui + Radix UI · Tailwind CSS · React + Vite + TypeScript · TanStack Query v5 · react-hook-form + zod · Paper MCP (양방향 동기화)

</details>

<details>
<summary>더 읽기</summary>

- [`docs/handbook.md`](docs/handbook.md) — 실무 진입 (5분)
- [`docs/motivation.md`](docs/motivation.md) — 프로젝트 배경
- [`backlog/queue.md`](backlog/queue.md) — 현재 진행 + 다음 작업
- 영감: [Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) · [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) · [shadcn/ui](https://ui.shadcn.com/) · [W3C Design Tokens](https://www.designtokens.org/)

</details>

---

<sub>MIT Licensed</sub>
