---
type: scene
name: WelcomeScene
identity: chats/scenes/welcome
shell:
  inherit: true
created: 2026-05-22
---

# WelcomeScene — 환영 신

## 💬 Narrative

> *왜* 이 신이 필요한가? — 사용자 관점의 의도와 가치.

이 신은 *처음 진입한 사용자* 를 환영하고, 다음 단계로 안내합니다.

- **타깃**: 첫 방문자
- **목적**: 프로젝트의 1차 가치 제안 전달 + CTA 클릭으로 시작 유도
- **톤**: 친근 / 간결 / 시각적 안정감

## 🧩 Structure

> *어떻게* 그릴 것인가? — 컴포넌트 어휘로 표현된 화면 구조.

```chat
<Card>
  <CardHeader>
    <CardTitle>{{i18n.ko.welcome.title}}</CardTitle>
    <CardDescription>{{i18n.ko.welcome.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent>
    <Button>{{i18n.ko.welcome.cta}}</Button>
  </CardContent>
</Card>
```

## 📜 History

- 2026-05-22: scaffold 생성. 환영 신 sample.

---

> 💡 이 chat.md 를 수정한 후 `pnpm gd react chats/scenes/welcome.chat.md` 실행하면 `src/scenes/welcome.tsx` 가 재생성됩니다.
> 💡 Claude Code 에서 `/gd-chat` 호출하면 새 신 작성을 가이드받을 수 있습니다.
