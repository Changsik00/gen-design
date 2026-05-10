---
type: scene
name: LoginScene
identity: chats/scenes/login
shell:
  inherit: true
  exclude: [BrandHeader]   # 디자이너 명시: "풋터만 나오면 될 것 같아"
catalog:
  tier: 3
  family: templates
  status: existing         # 기존 catalog 의 LoginScene 가 곧 LoginScene 으로 reframe
paper:
  artboard: null
  layerNameAnchor: "[chat:scenes/login]"
created: 2026-05-10
references:
  - chats/components/login-form.chat.md   # 후속 작성 후보
---

# LoginScene

## 💬 Narrative

로그인 진입점. *집중* 의도 — 헤더 chrome 제거, 본문 (LoginForm) 만 부각.
shell 의 BrandHeader 는 의도적 제외 (사용자 *"풋터만 나오면 될 것 같아"* 합의).
AppFooter 는 inherit (저작권 + 정책 링크는 로그인에서도 필수).

**디자인 결정** (2026-05-10):
- 헤더 부재 = *몰입* — 사용자가 다른 곳으로 이탈 X
- 풋터 잔류 = *법적 의무* (정책 링크) + *조용한 안심*

## 🧩 Structure (4축)

```jsx
<LoginScene>
  <LoginForm />
  {/* AppFooter 는 shell 자동 포함 */}
</LoginScene>
```

shell exclude 로 BrandHeader 자동 미포함. AppFooter 만 자동 inherit.

## 📜 History

- **2026-05-10** 초안 — 디자이너 자연어 *"로그인 신 만들어줘"* + agent shell 제약 대화 (*"login 은 보통 헤더 없이 풋터만, 어떻게?"*) → 디자이너 *"2번. 풋터만 나오면 될 것 같아"* → shell.exclude=[BrandHeader] 합의.
