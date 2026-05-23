# gen-design

AI와 대화로 화면을 설계하고, 즉시 React 코드로 컴파일하는 디자인 시스템 파이프라인.

---

## 30초 시작

```bash
# 새 프로젝트 생성
npm create gd-react@latest my-app
cd my-app

# 또는 기존 프로젝트에 스킬만 설치
npx @gd/skills
```

Claude Code 에서:

```
/gd-start   ← 첫 온보딩 (프로젝트 컨텍스트 수집)
/gd-chat    ← 화면 설계 (AI와 대화 → chat.md 작성)
pnpm gd react login   ← React TSX 컴파일
```

---

## 워크플로

```
/gd-start               프로젝트 컨텍스트 + DESIGN.md 설정
    ↓
/gd-chat                화면 이름 입력 → AI가 5단계 대화로 chat.md 작성
    ↓                   (의도 → 토큰 → 버튼 역할 → validation → 비슷한 화면)
pnpm gd react <scene>   chat.md → React TSX 컴파일
    ↓
pnpm gd doctor          생성 코드 품질 점검
```

---

## Claude Code 스킬

| 스킬 | 설명 |
|---|---|
| `/gd-start` | 첫 온보딩 — DESIGN.md + 프로젝트 컨텍스트 수집 |
| `/gd-chat` | 화면 설계 대화 — chat.md + .order.md 작성 |
| `/gd-design` | DESIGN.md 토큰/컴포넌트 편집 |
| `/gd-token` | 디자인 토큰 조회 (list / find / show) |

### 스킬 설치

`create gd-react` 로 생성한 프로젝트는 스킬이 자동 포함됩니다.

기존 프로젝트에 추가:

```bash
npx @gd/skills          # 설치
npx @gd/skills --force  # 기존 파일 덮어쓰기
```

---

## CLI 명령

```bash
pnpm gd react <scene>   # chat.md → React TSX
pnpm gd tokens list     # 전체 토큰 목록
pnpm gd tokens find blue  # 토큰 검색
pnpm gd tokens show primary  # 토큰 상세 (light/dark)
pnpm gd doctor          # 품질 점검
```

---

<details>
<summary>프로젝트 구조</summary>

```
Design/
├── packages/
│   ├── create-gd-react/      ← npm create gd-react 스캐폴드
│   ├── gd-cli/               ← pnpm gd 명령 (react / tokens / doctor)
│   └── gd-skills/            ← npx @gd/skills 스킬 인스톨러
├── studio/                   ← 컴파일러 엔진 + Paper 미리보기
├── docs/
│   ├── handbook.md           ← 실무 진입점 (5분 통독)
│   ├── motivation.md         ← 프로젝트 배경/동기
│   └── decisions/            ← ADR (아키텍처 결정 기록)
├── backlog/                  ← Phase별 백로그
└── specs/                    ← Spec 산출물
```

</details>

<details>
<summary>기술 스택</summary>

| 영역 | 선택 |
|------|------|
| 디자인 명세 | DESIGN.md (Stitch 기반 + 자체 확장) |
| 디자인 토큰 | W3C DTCG + Style Dictionary |
| UI 컴포넌트 | shadcn/ui + Radix UI |
| 스타일링 | Tailwind CSS |
| 프레임워크 | React + Vite + TypeScript |
| 데이터 페칭 | TanStack Query v5 |
| 폼 | react-hook-form + zod |
| 디자인 도구 | Paper MCP (미리보기 렌더링) |

</details>

<details>
<summary>신규 진입자 — 더 읽기</summary>

처음 이 프로젝트를 만나신다면 **[`docs/handbook.md`](docs/handbook.md)** 부터 읽어주세요.

handbook 은 *지금 이 순간의 진실* 을 담은 살아있는 문서입니다.
§1 (한 줄 요약 + 시각) → §4 (디자이너 워크플로) 까지 *5분 안에* 통독 가능.

프로젝트 배경과 핵심 아이디어: [`docs/motivation.md`](docs/motivation.md)

</details>
