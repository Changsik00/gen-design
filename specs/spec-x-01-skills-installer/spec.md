# spec-x-01: gd-skills installer + README 개편

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-x-01` |
| **Phase** | 없음 (standalone) |
| **Branch** | `spec-x-01-skills-installer` |
| **상태** | Planning |
| **타입** | Feature + Docs |
| **작성일** | 2026-05-23 |

## 📋 배경 및 문제 정의

### 현재 상황

- 스킬(gd-chat, gd-start 등) 은 `create-gd-react` 프리셋 안에 번들 — 신규 프로젝트 생성 시에만 설치됨
- 기존 프로젝트에 스킬만 추가하는 방법 없음
- README.md 는 Phase 1-7 로드맵 기반의 옛 문서 — `gd react`, `order.md`, gd-chat 스킬 등 현재 핵심 기능이 전혀 반영되지 않음

### 해결 방안

1. **`packages/gd-skills/`** 신규 패키지 — `npx @gd/skills` 실행 시 현재 디렉토리의 `.claude/skills/` 에 4개 스킬 복사
2. **README.md 전면 개편** — "30초 시작" + 실제 워크플로우 중심

## 🎯 요구사항

### spec-x-01-A: `@gd/skills` 패키지

1. `npx @gd/skills` 실행 → `.claude/skills/{gd-chat,gd-start,gd-design,gd-token}.md` 복사
2. 이미 존재하는 파일은 `--force` 없으면 스킵 (안전)
3. 완료 후 사용법 출력: `/gd-start`, `/gd-chat` 호출 방법
4. `pnpm workspace` 내 `packages/gd-skills/` 로 구성

### spec-x-01-B: README.md 개편

1. 첫 화면: 한 줄 설명 + 30초 퀵스타트 (`npx create-gd-react` OR `npx @gd/skills`)
2. 워크플로우 설명: chat.md → `gd react` → TSX
3. 스킬 목록 + 각 역할 한 줄 요약
4. 기존 "프로젝트 동기/철학" 섹션은 접이식(details) 또는 별도 `docs/motivation.md` 로 이동

## 🚫 Out of Scope

- 스킬 파일 자체 내용 변경 (별도 spec)
- npm publish 자동화 / CI 파이프라인
- `~/.claude/skills/` 전역 설치 옵션 (v2)

## ✅ Definition of Done

- [ ] `npx @gd/skills` 실행 → `.claude/skills/` 에 4개 파일 생성 확인
- [ ] README.md 첫 화면에서 퀵스타트 30초 내 이해 가능
- [ ] `pnpm test` 전체 Pass
