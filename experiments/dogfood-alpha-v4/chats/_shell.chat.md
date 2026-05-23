---
type: shell
name: AppShell
identity: chats/_shell
applies: scenes
created: 2026-05-22
---

# AppShell — 전역 외각

## 💬 Narrative

모든 신 (scene) 의 *공통 외각* 입니다. 헤더 / 풋터 / 글로벌 네비게이션이 들어갈 자리입니다.

새 신을 만들 때 이 외각이 *자동 inherit* 됩니다 (chat.md frontmatter `shell.inherit: true`).
특정 신에서 외각이 빠져야 한다면 `shell.exclude: [BrandHeader]` 같은 식으로 opt-out 하세요.

## 🧩 Structure

{{scene.content}}

## 📜 History

- 2026-05-22: scaffold 생성. 외각 비어있음 — 디자이너가 채워나갈 자리.
