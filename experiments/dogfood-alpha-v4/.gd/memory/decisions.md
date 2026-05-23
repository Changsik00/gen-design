---
name: design-decisions
description: 디자인 결정의 history (왜 이 색 / 왜 이 레이아웃 / 왜 이 컴포넌트)
type: project
---

<!-- gd-* 스킬들이 결정 시점에 한 entry 씩 append. 최신이 위에 추가됩니다. -->

## 2026-05-23 신 2 (회원가입) — form pattern 첫 재사용 + Checkbox 신규

- **결정**: 신 1 의 *표준 form pattern* 을 그대로 재사용. Checkbox 만 신규 어휘로 추가
- **이유**: 이지의 첫 *Tier 발견* 순간 — "신 1 이랑 거의 똑같네요?" 인지. shadcn 카탈로그의 Form pattern 이 *2 신* 에 등장 → 어휘 일관성
- **영향**: 향후 input form 은 모두 이 패턴. 3 신 이상 등장하면 *Tier 3 composite* 승격 후보 (FormBlock)
- **출처 스킬**: gd-chat (이지 재사용 발견)
- **TSX bytes**: 3045 / doctor: 0 errors

## 2026-05-23 신 1 (로그인) — 표준 form pattern 결정

- **결정**: `Card + Form + FormField (x2) + Input + Button` 조합을 *표준 로그인 form pattern* 으로 채택
- **이유**: 이지가 첫 신부터 *최소 어휘* 로 시작. Card 는 컨테이너, Form 은 shadcn 표준, FormField 는 react-hook-form wrapper
- **영향**: 신 2 (회원가입) 이 *같은 패턴 재사용* 예정. 향후 input form 모두 이 기반
- **출처 스킬**: gd-chat (이지 + agent 협업)
- **TSX bytes**: 2056 / doctor: 0 errors
