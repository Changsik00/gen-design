# spec-x-01 — skills-installer

## 메타

| 항목 | 값 |
|---|---|
| **ID** | `spec-x-01` |
| **슬러그** | `skills-installer` |
| **Branch** | `spec-x-01-skills-installer` |
| **상태** | In Progress |
| **소유자** | dennis |

## 요점

기존 프로젝트에 gd-skills 를 설치할 수 있는 두 가지 개선:

- **A** — `@gd/skills` npm 패키지: `npx @gd/skills` 로 `.claude/skills/` 에 스킬 4종 설치
- **B** — `README.md` 개편: 30s 퀵스타트 + 워크플로 + 스킬/CLI 테이블

## 범위 (Out-of-scope)

- 글로벌 npm install (`npm install -g`)
- npm CI / publish 자동화
- 스킬 내용 변경 (gd-chat.md 등)

## 연관 모듈

- `packages/gd-skills/` (NEW)
- `README.md` (overhaul)
