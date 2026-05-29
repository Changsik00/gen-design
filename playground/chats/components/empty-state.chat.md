---
type: component
name: EmptyState
identity: chats/components/empty-state
catalog:
  tier: 3
  family: composites
  status: new            # 신규 — catalog.json 미등재. 채택 시 등재 필요.
paper:
  artboard: "EmptyState — mineral (dogfood spec-8 candidate)"
  layerNameAnchor: "[chat:components/empty-state]"
created: 2026-05-10
---

# EmptyState

## 💬 Narrative

디자인 툴의 *빈 상태* (목록 0건 / 신규 시작 등) 에서 사용자에게 안내하는 컴포넌트.
*"여기 비어있어요. 이렇게 시작하세요"* 의 절제된 환영.

**팔레트 의도** (mineral 무드):
- 배경 = limestone (`#EDEBE5`) — 따뜻한 회색, 차분
- 본문 = slate (`#3A3A40`) — 충분한 대비, 누름 없음
- CTA = oxidized copper (`#9B6B45`) — *유일한 채도 포인트*. 안내성, 선택 강요 없음
- 아이콘 stroke = muted bone (`#C9C5BB`) — *공기 같은 약함*

**구조 의도**:
- 60% 빈 공간 + 40% 콘텐츠 (영웅 호흡)
- 헤드라인 24px/700 + 본문 15px/400 + CTA 14px/600 (강한 스케일 대비)
- 단일 CTA — 선택지 1 개 (선택 부담 0)

## 🧩 Structure (4축 형식)

```jsx
<EmptyState variant="muted">
  <EmptyState.Icon name="upload-cloud" />
  <EmptyState.Headline>{{i18n.ko.emptyState.headline}}</EmptyState.Headline>
  <EmptyState.Body>{{i18n.ko.emptyState.body}}</EmptyState.Body>
  <Button variant="primary">{{i18n.ko.emptyState.cta}}</Button>
</EmptyState>
```

**Tokens 사용**:
- `{{token.semantic.color.surface.alt}}` ← limestone 배경
- `{{token.semantic.color.text.primary}}` ← slate
- `{{token.semantic.color.accent.warm}}` ← copper
- `{{token.semantic.color.icon.muted}}` ← bone
- `{{token.spacing.gap.md}}` ← 20px gap
- `{{token.spacing.padding.scene}}` ← 48px padding

**i18n 키**:
- `emptyState.headline` — *"아직 spec 이 없어요"*
- `emptyState.body` — *"Paper 에서 그림을 가져오거나, 빈 spec.md 를 직접 작성해 시작하세요."*
- `emptyState.cta` — *"새 spec 만들기"*

**Variants** (L1 — named):
- `muted` (현재) — 안내성, 채도 낮음
- (후보) `error` — 빨간 톤 + 재시도
- (후보) `success` — 초록 톤 + 다음 단계

**Behavior**:
- on CTA click: emit `requestNewSpec` event (외부 라우팅에서 처리)

## 📜 History

- **2026-05-10** 초안 — Paper artboard 21E-0 에서 추출. mineral 무드 결정 (first-instinct = editorial 회피, 재료감 우선). CTA 단일, 선택 부담 0 의도.
