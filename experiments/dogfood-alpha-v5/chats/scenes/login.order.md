---
scene: login
validation:
  email:
    - required
    - email
  password:
    - required
    - min(8)
actions:
  submit:
    type: form-submit
    target: POST /auth/login
  signup-link:
    type: nav
    target: /signup
---

<!-- spec-12-05 §5.8 — gd-chat 대화에서 자동 생성된 주문 명세 -->
<!-- decisions.md: LoginScene form validation (email/password) + 버튼 의도 (submit/nav) -->
