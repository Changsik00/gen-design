---
name: design-decisions
description: 디자인 결정의 history (왜 이 색 / 왜 이 레이아웃 / 왜 이 컴포넌트)
type: project
---

<!-- gd-* 스킬들이 결정 시점에 한 entry 씩 append. 최신이 위에 추가됩니다. -->

## 2026-05-23 DashboardScene StatCard 3 회 룰 후보 (v5 신 3)

- **결정**: Card x 3 통계 패턴 → Tier 3 `StatCard` composite *후보 등록*
- **이유**: 3 회 반복 — 신 4 에서 또 등장 시 *승격 확정*. 지금은 표준 Card 어휘 사용
- **영향**: chats/scenes/dashboard.chat.md / 신 4 의 같은 패턴 등장 시 승격
- **출처 스킬**: gd-chat (spec-12-02 §5.5 (iii))

## 2026-05-23 DashboardScene validation skip (v5 신 3)

- **결정**: Input/Form 없음 → validation skip ✓
- **이유**: 통계 표시만, 입력 없음
- **출처 스킬**: gd-chat (spec-12-02 §7.5 — skip 정당)

## 2026-05-23 DashboardScene 버튼 의도 (v5 신 3)

- **'전체 보기' 버튼**: (B) page navigation — /activity 페이지로 이동
- **이유**: 최근 활동 카드의 *더보기* CTA. 외부 X, modal X, form X
- **영향**: 향후 router 통합 시 onClick navigation 명시 필요 (spec-12-05 order.md 후속)
- **출처 스킬**: gd-chat (spec-12-02 §7.6)

## 2026-05-23 SignupScene 재사용 + 신규 (v5 신 2)

- **결정**: 신 1 의 form pattern (Card+Form+FormField+Input+Button) *재사용* + Checkbox 신규 어휘
- **이유**: 첫 *Tier 발견* 순간 — 신 2 만에 form pattern 재등장 (1 회차)
- **영향**: chats/scenes/signup.chat.md / 향후 input form 모두 이 패턴
- **출처 스킬**: gd-chat (spec-12-02 §5.5 (iii))

## 2026-05-23 SignupScene form validation (v5 신 2)

- **필드별 규칙**:
  - name: required + z.string().min(2)
  - email: required + z.string().email()
  - password: required + z.string().min(8)
  - terms: required (체크 안 하면 가입 X)
- **이유**: 4 필드 — agent 가 *각 필드별 안내* 후 디자이너가 *4 개 한번에 결정* (v4 대비 빠름)
- **영향**: chats/scenes/signup.chat.md 의 Input/Checkbox 4 개
- **출처 스킬**: gd-chat (spec-12-02 §7.5)

## 2026-05-23 SignupScene 버튼 의도 (v5 신 2)

- **가입하기 버튼**: (A) form submit — validation 통과 후 API 호출
- **이유**: 단일 버튼 신 (회원가입 form), 명확한 form submit
- **출처 스킬**: gd-chat (spec-12-02 §7.6)

## 2026-05-23 LoginScene 표준 form pattern (v5 신 1)

- **결정**: `Card + Form + FormField (x2) + Input + Button (x2)` 표준 로그인 form
- **이유**: 신 1 부터 *최소 어휘*. 신 2 (회원가입) 에서 재사용 예약
- **영향**: chats/scenes/login.chat.md, 신 2 의 signup.chat.md
- **출처 스킬**: gd-chat (spec-12-02 §5.5 (iii) 비슷한 화면 발견)

## 2026-05-23 LoginScene form validation 결정 (v5 신 1)

- **필드별 규칙**:
  - email: required + z.string().email()
  - password: required + z.string().min(8)
- **이유**: 8자 정도면 MVP 충분. zod schema 는 향후 spec-12-05 (order.md) 에서 자동 생성
- **영향**: chats/scenes/login.chat.md 의 Input 2 개
- **출처 스킬**: gd-chat (spec-12-02 §7.5)

## 2026-05-23 LoginScene 버튼 의도 (v5 신 1)

- **로그인 버튼**: (A) form submit — `<Button type="submit">` + validation 후 API
- **회원가입 link**: (B) page navigation — *현재* chat.md grammar 가 `<Link>...<Button asChild>` parse 실패 → 임시로 `<Button variant="link">` 만 두고 onClick navigation 은 향후 (spec-12-05) 자동 생성 예정
- **이유**: 로그인 = 폼 제출, 회원가입 = 라우터 이동
- **영향**: chats/scenes/login.chat.md
- **grammar limit**: spec-12-05 (order.md) 후속 — `<Link>` wrapper + asChild 패턴 표준화 필요
- **출처 스킬**: gd-chat (spec-12-02 §7.6)
