---
type: scene
name: ProfileScene
identity: chats/scenes/profile
shell:
  inherit: true
catalog:
  tier: 3
  family: templates
  status: new
paper:
  artboard: null       # Paper artboard 미생성 — 첫 날 디자이너: paper: null 허용 여부 handbook 에 명시 없음
  layerNameAnchor: "[chat:scenes/profile]"
created: 2026-05-22
references:
  - chats/components/avatar-upload.chat.md   # AvatarUpload (catalog 등재)
  - chats/components/profile-info-card.chat.md   # ProfileInfoCard (catalog 등재)
  - chats/components/stat-card.chat.md       # StatCard (catalog 등재)
---

# ProfileScene

## 💬 Narrative

사용자 본인 정보 + 활동 통계 + 액션 진입.
mineral 톤 — 정보 / 통계 / 액션 의 3 영역 호흡 균등.

**의도된 사용자 흐름**:
1. 앱 내 자신의 프로필 화면 진입
2. 아바타 + 기본 정보 확인 (이름 / 이메일 / 가입일)
3. 활동 통계 3 개 (최근 작업 수 / 총 디자인 수 / 협업 수) 파악
4. 편집 또는 로그아웃 액션 선택

**디자인 결정**:
- AvatarUpload / ProfileInfoCard / StatCard × 3 재사용 (모두 catalog 등재 확인)
- 첫 StatCard 는 `variant="highlighted"` 로 강조 (핵심 지표 부각)
- 편집 CTA = primary, 로그아웃 = ghost (위계 차별화)

## 🧩 Structure (4축)

```jsx
<ProfileScene>
  <AvatarUpload />
  <ProfileInfoCard />
  <StatCard variant="highlighted">{{i18n.ko.profile.stats.recent}}</StatCard>
  <StatCard variant="compact">{{i18n.ko.profile.stats.total}}</StatCard>
  <StatCard variant="compact">{{i18n.ko.profile.stats.collab}}</StatCard>
  <Button variant="default">{{i18n.ko.profile.edit}}</Button>
  <Button variant="ghost">{{i18n.ko.profile.logout}}</Button>
</ProfileScene>
```

> 참조: AvatarUpload / ProfileInfoCard / StatCard 의 내부 구조는 각 컴포넌트 chat.md 에 정의됨.
> StatCard `variant` 값 — catalog 에서 허용 axis 확인 필요 (handbook §4 Day 1 에서 catalog 매칭 후 variant 확정 단계 상세 미명시 → 차단점 #3).

**i18n 키**:
- `profile.edit` — 편집 버튼 레이블
- `profile.logout` — 로그아웃 버튼 레이블
- `profile.stats.recent` — 최근 작업 수
- `profile.stats.total` — 총 디자인 수
- `profile.stats.collab` — 협업 수

**Behavior**:
- on edit → route to "/profile/edit" (실 라우팅 외부)
- on logout → authStore.logout() → route to "/login"

## 📜 History

- **2026-05-22** 초안 — external-alpha 도그푸딩. handbook §4 워크플로 따라 agent 역할극으로 작성.
  AvatarUpload / ProfileInfoCard / StatCard × 3 / Button × 2 재사용 (모두 catalog Tier 3 등재 확인).
  StatCard `variant="highlighted"` (첫 카드 강조) / Paper artboard 미생성 (도그푸딩 범위 외).
