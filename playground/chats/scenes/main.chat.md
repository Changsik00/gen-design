---
type: scene
name: MainScene
identity: chats/scenes/main
shell:
  inherit: true        # _shell.chat.md (BrandHeader + AppFooter) 자동 포함
catalog:
  tier: 3
  family: templates
  status: new
paper:
  artboard: null       # 아직 Paper 에 미생성 — agent 가 다음 단계 제안
  layerNameAnchor: "[chat:scenes/main]"
created: 2026-05-10
references:
  - chats/components/empty-state.chat.md
---

# MainScene

## 💬 Narrative

사용자가 로그인 후 도착하는 *첫 화면*. 빈 상태 + 시작 안내.
*"환영합니다. 여기서 시작하세요"* 의 톤.

**의도된 사용자 흐름**:
1. 로그인 직후 도착
2. 데이터 없음 (신규 또는 비활성 사용자)
3. EmptyState 안내 → CTA → 신 spec 작성 흐름 진입

**디자인 결정**:
- 신 단독 = EmptyState 재사용 (chats/components/empty-state)
- 추가 chrome (헤더 / 풋터) 는 *후속 신 누적 후* 글로벌 승격 결정 — 지금 신 단독으로 채택

## 🧩 Structure (4축)

```jsx
<MainScene>
  <EmptyState variant="muted" />
</MainScene>
```

> 참조: EmptyState 의 *내부 구조* (icon / headline / body / CTA) 는 `chats/components/empty-state.chat.md` 의 Structure 섹션에 정의됨. 본 신은 *재사용 선언* 만.

**i18n / tokens**: EmptyState 가 자체 키 보유 (`emptyState.*`). MainScene 차원의 추가 키 0.

**Behavior**:
- on EmptyState CTA → route to "/specs/new" (실 라우팅은 외부)

## 📜 History

- **2026-05-10** 초안 — 디자이너 자연어 입력 *"메인 신 만들어줘. 로그인 후 도착. 빈 상태 시작 안내."* / Agent 가 chats/components 읽기 → EmptyState 발견 → 재사용 제안 → 합의 / shell 승격은 데이터 부족으로 *유보*.
- **2026-05-10** shell inherit 적용 — login 신 추가 시점에 *모든 신 공통 헤더/풋터* 의도 합의 → 글로벌 shell 승격 → main 신도 inherit 로 전환. Structure 변경 0 (shell 자동 포함).
