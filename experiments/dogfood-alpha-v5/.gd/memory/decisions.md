---
name: design-decisions
description: 디자인 결정의 history (왜 이 색 / 왜 이 레이아웃 / 왜 이 컴포넌트)
type: project
---

<!-- gd-* 스킬들이 결정 시점에 한 entry 씩 append. 최신이 위에 추가됩니다. -->

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
