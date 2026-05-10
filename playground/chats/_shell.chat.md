---
type: shell
name: AppShell
identity: chats/_shell
created: 2026-05-10
applies: scenes
---

# AppShell — 글로벌 외각

## 💬 Narrative

*모든 scene 의 기본 외각*. BrandHeader 상단 + AppFooter 하단.
신마다 명시 안 해도 자동 포함. 빠질 신은 frontmatter `shell.exclude` 로 opt-out.

**승격 사유** (2026-05-10):
- main / login 두 신이 모두 헤더 + 풋터 공통 사용 의도.
- agent 가 "공통 패턴" 감지 → shell 승격 제안 → 디자이너 합의.
- 향후 신 추가 시에도 자동 inherit 로 마찰 ↓.

## 🧩 Structure

```jsx
<AppShell>
  <BrandHeader slot="top" />
  {/* {{scene.content}} */}
  <AppFooter slot="bottom" />
</AppShell>
```

각 scene 의 Structure 는 `{{scene.content}}` 자리에 삽입됨.

## 📜 History

- **2026-05-10** 승격 — main + login 신의 공통 패턴 감지로 신규. BrandHeader (catalog 기존) + AppFooter (chat 신규) 조합.
