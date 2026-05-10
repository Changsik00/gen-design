---
type: component
name: BrandHeader
identity: chats/components/brand-header
catalog:
  tier: 3
  family: composites
  status: existing      # studio/src/components/composites/BrandHeader.tsx 이미 존재 + catalog 등재
paper:
  artboard: null        # 후속 — 디자이너 시각 작업 시 생성
  layerNameAnchor: "[chat:components/brand-header]"
created: 2026-05-10
---

# BrandHeader

## 💬 Narrative

모든 신의 상단에 등장하는 *브랜드 영역*. 로고 + 네비.
*"여기 있다"* 의 신호 — 절제, 익숙, 기억 가능.

mineral 무드 (EmptyState 와 일관) — limestone 배경 위 slate 텍스트.

## 🧩 Structure (4축)

```jsx
<BrandHeader>
  <BrandHeader.Logo />
  <BrandHeader.Nav>
    {/* nav items — 신별로 다를 수 있음 */}
  </BrandHeader.Nav>
</BrandHeader>
```

기존 catalog 기반 — 본 chat 은 *signal of intent* + 재사용 진입점.

## 📜 History

- **2026-05-10** 글로벌 shell 승격 동시 등재. 기존 catalog 컴포넌트 (Tier 3 composite) 의 *chat 표현 신규*.
