---
name: gd-chat
description: chat.md 작성 가이드. 3층 구조 (Narrative + Structure + History) + 카탈로그 어휘 추천 + frontmatter 템플릿 자동 삽입. 없으면 디렉토리 자동 생성.
---

# gd-chat — chat.md 작성 가이드

> 📌 본문은 spec-11-02 에서 작성됩니다. 현재 placeholder.

## 자동 로딩

- `templates/FRONT.md` — Tier 2/3 컴포넌트 카탈로그 (어휘 추천 원천)
- `chats/_shell.chat.md` — 외각 컨텍스트
- 기존 `chats/scenes/*.chat.md` — 기존 신 패턴 참조

## 동작 (예정)

1. "어떤 화면 만들고 싶나?" 질문 + `.gd/memory/` 의 프로젝트 정보 활용
2. 카탈로그에서 후보 컴포넌트 제안 (LoginScene → Card + Form + Input + Button)
3. `chats/scenes/<name>.chat.md` 파일 생성 (없으면 디렉토리도)
4. frontmatter 템플릿 자동 삽입 (`type` / `name` / `identity` / `shell.inherit` / `created`)
5. 3층 (Narrative + Structure + History) 작성 walkthrough
6. `pnpm gd react` 실행 안내
