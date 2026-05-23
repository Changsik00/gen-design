# Plan: spec-x-01 — gd-skills installer + README 개편

## A. `packages/gd-skills/` 패키지

### 구조

```
packages/gd-skills/
├── package.json          (name: "@gd/skills", bin: "gd-skills")
├── src/
│   └── cli.ts            (메인 installer 로직)
└── skills/               (복사할 스킬 파일들 — create-gd-react 에서 심링크 or 복사)
    ├── gd-chat.md
    ├── gd-start.md
    ├── gd-design.md
    └── gd-token.md
```

### cli.ts 핵심 로직

```typescript
// 1. .claude/skills/ 디렉토리 생성 (없으면)
// 2. skills/ 의 각 파일 → .claude/skills/ 복사
//    이미 존재하면 스킵 (--force 로 덮어쓰기)
// 3. 완료 메시지 출력
```

### 출력 예시

```
✅ gd skills installed!

   .claude/skills/gd-chat.md
   .claude/skills/gd-start.md
   .claude/skills/gd-design.md
   .claude/skills/gd-token.md

🚀 다음 단계:
   Claude Code 에서 /gd-start 실행 → 프로젝트 온보딩
   화면 작업 시   /gd-chat  실행 → chat.md 작성 가이드
```

### 스킬 파일 관리 전략

`create-gd-react` 프리셋의 스킬 파일이 **원본**. `gd-skills` 패키지는 빌드 시 복사.

`package.json` scripts:
```json
"prebuild": "cp ../create-gd-react/presets-bundled/default/.claude/skills/*.md skills/"
```

또는 workspace 심링크 (`pnpm` 지원).

## B. README.md 개편

### 구조

```markdown
# gen-design

> AI와 대화로 화면을 설계하고, 명령 한 줄로 React 컴포넌트를 생성합니다.

## 30초 시작

### 신규 프로젝트
npx create-gd-react

### 기존 프로젝트에 스킬만 추가
npx @gd/skills

## 워크플로우

1. `/gd-start` — 프로젝트 온보딩
2. `/gd-chat` — AI와 대화로 chat.md 작성
3. `gd react login` — TSX 자동 생성

## 스킬

| 스킬 | 역할 |
|---|---|
| /gd-start | 첫 온보딩, 프로젝트 컨텍스트 수집 |
| /gd-chat  | 화면 설계 대화, chat.md + order.md 생성 |
| /gd-design | DESIGN.md 토큰/컴포넌트 편집 |
| /gd-token | 토큰 쿼리 |

## CLI 커맨드

| 커맨드 | 역할 |
|---|---|
| gd react <scene> | chat.md → TSX |
| gd lint | 어휘 검증 |
| gd tokens | 토큰 쿼리 |

<details>
<summary>프로젝트 동기 및 배경</summary>
... (기존 README 내용)
</details>
```

## 예상 commit 수

4 (브랜치 + gd-skills 패키지 + README + ship)
