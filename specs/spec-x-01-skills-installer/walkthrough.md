# spec-x-01 Walkthrough

## 개요

기존 프로젝트에 gd-skills 를 배포할 수 있는 두 가지 개선을 완료했다:
(A) `@gd/skills` npm 설치 패키지, (B) README 퀵스타트 중심 개편.

## 변경 요약

### A — @gd/skills 패키지 (`packages/gd-skills/`)

`npx @gd/skills` 한 줄로 `.claude/skills/` 에 스킬 4종을 설치한다.

- `src/cli.ts` — Node.js ESM CLI. `skills/*.md` → `cwd/.claude/skills/` 복사
- `--force` 플래그로 기존 파일 덮어쓰기, 없으면 스킵
- `prebuild` 에서 `sync-skills` 가 `create-gd-react` 프리셋에서 최신 스킬을 동기화
- `tsup` 빌드 → `dist/cli.js` (esm, node20)

```
설치 흐름:
npx @gd/skills
  → .claude/skills/gd-chat.md    ✅
  → .claude/skills/gd-design.md  ✅
  → .claude/skills/gd-start.md   ✅
  → .claude/skills/gd-token.md   ✅
```

### B — README.md 개편

| 이전 | 이후 |
|---|---|
| 동기/배경 중심 (긴 텍스트) | 30s 퀵스타트 → 워크플로 → 테이블 |
| 스킬/CLI 안내 없음 | 스킬 4종 + CLI 명령 테이블 |
| 구조 설명 혼재 | `<details>` 아코디언으로 접어두기 |

기존 내용은 `docs/motivation.md` 로 분리 — 프로젝트 배경이 필요한 독자는 그쪽 참조.

## 검증

```bash
# 설치 테스트 (빈 디렉토리)
node packages/gd-skills/dist/cli.js
# → .claude/skills/ 4종 설치 확인

# 스킵 테스트 (재실행)
node packages/gd-skills/dist/cli.js
# → "이미 존재 (스킵)" 출력 확인

# --force 테스트
node packages/gd-skills/dist/cli.js --force
# → 덮어쓰기 후 설치 완료 출력 확인
```

세 경로 모두 통과.

## 커밋 목록

1. `feat(spec-x-01): add @gd/skills installer package`
2. `docs(spec-x-01): overhaul README with quickstart and skills guide`
