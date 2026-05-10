---
type: component
name: AppFooter
identity: chats/components/app-footer
catalog:
  tier: 3
  family: composites
  status: new            # 신규 — catalog 미등재. shell 승격 시 함께 등재 후보.
paper:
  artboard: null
  layerNameAnchor: "[chat:components/app-footer]"
created: 2026-05-10
---

# AppFooter

## 💬 Narrative

모든 신의 하단 *고정 영역*. 저작권 + 정책 링크 + 작은 도움말.
"여기까지 입니다" 의 *부드러운 마침*.

mineral 무드 — 헤더보다 더 약한 톤 (한 단계 fade). bone 텍스트 + 1px slate 분리선.

## 🧩 Structure (4축)

```jsx
<AppFooter>
  <AppFooter.Copy>{{i18n.ko.footer.copyright}}</AppFooter.Copy>
  <AppFooter.Links>
    <a href="/privacy">{{i18n.ko.footer.privacy}}</a>
    <a href="/terms">{{i18n.ko.footer.terms}}</a>
  </AppFooter.Links>
</AppFooter>
```

## 📜 History

- **2026-05-10** 글로벌 shell 승격 동시 등재. 신규 component — phase-8 catalog 등재 + studio 컴포넌트 코드 후보.
