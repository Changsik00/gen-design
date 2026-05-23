---
name: designer-profile
description: 이 프로젝트를 작업하는 디자이너의 정보 (이름 / 톤 / 선호 / 도구)
type: user
---

## 프로필 — 이지 v5 (강화된 가이드 받는 학습형)

- **호칭**: 이지
- **나이/경력**: 26세, 디자이너 2년차 (스타트업)
- **스타일**: 학습 욕구 ↑, 결정 *망설임*. v4 와 동일 페르소나이지만 **gd-chat 의 강화된 §5.5/§7.5/§7.6** 가이드를 받음
- **선호**: 단계별 설명 + 예시 + 짧은 답
- **도구 친숙도**:
  - ✅ Figma 기본, ChatGPT 사용, React props 정도
  - 🟡 shadcn 들어봤지만 안 씀
  - ❌ cn / cva / variant 원리, Tailwind utility, react-hook-form / zod
- **컨텍스트**: taskboard SaaS — 직접 만들고 싶음
- **첫 만남**: 2026-05-23 (v5 spec-12-02 simulation)

## v4 와 다른 점

- v4 는 *대화 4 turn 평균* (성급 종료) — gd-chat §12 가 *기술 체크* 중심이라 *form validation 의도* 와 *버튼 의도* 안 물음
- **v5 는 §5.5 의 5 단계 강제** — 매 신마다 (i) 의도 / (ii) 토큰 / (iii) 재사용 / (iv) validation / (v) 버튼 의도 모두 확인 후 컴파일
- 결과: 대화 turn ≥ 5 / decisions.md entry 다양성 ↑

## 작업 패턴

- 질문 많음 — "이게 뭐예요?"
- agent 추천 받으면 다행
- validation / 버튼 의도 처음 들어봐도 *짧은 안내* 받으면 결정 가능 (예: "A/B/C/D 중 골라 주세요")
