---
name: gd-start
description: First-run onboarding skill. Reads handbook §1 (4축 어휘) + §4 (워크플로) summary and walks designer through their first chat.md → React. Auto-loads .gd/memory/ context.
---

# gd-start — 첫 사용자 onboarding

> 📌 본 스킬의 본문은 spec-11-02 (`.claude/skills/` 번들) 에서 작성됩니다.
> 현재는 placeholder — `create-gd-react` scaffold 검증용.

## 자동 로딩 컨텍스트

- `templates/FRONT.md` — React stack 결정 (Vite + React 19 + ...)
- `templates/AGENT.md` — agent 행동 규칙
- `templates/DESIGN.md` — 디자인 명세 (디자이너 편집 surface)
- `templates/TOKEN.md` — 디자인 토큰
- `.gd/memory/MEMORY.md` — 누적 컨텍스트

## 동작 (spec-11-02 에서 구현 예정)

1. `.gd/memory/MEMORY.md` 읽고 디자이너 / 프로젝트 정보 회상
2. 미정 시 1-2 질문으로 핵심 정보 수집 → `.gd/memory/` 에 append
3. handbook §1 (4축 어휘) + §4 (워크플로) 의 5분 통독 요약 제공
4. 첫 chat.md (welcome 신) 작성 walkthrough
5. `pnpm gd react chats/scenes/welcome.chat.md` 실행 안내
6. 결과 (TSX) 확인 + 다음 단계 제안
