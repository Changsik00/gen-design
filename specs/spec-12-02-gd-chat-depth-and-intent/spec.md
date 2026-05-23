# spec-12-02: gd-chat 대화 깊이 + 버튼 의도 + form validation

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-12-02` |
| **Phase** | `phase-12` |
| **Branch** | `spec-12-02-gd-chat-depth-and-intent` |
| **상태** | Planning |
| **타입** | Skill 강화 + 통합 검증 |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

phase-11 dogfooding v4 (이지 페르소나, 4-신 여정) retro 에서 발견된 3 영역:

1. **form validation 가이드 없음** (v4 retro #1) — Input 만나면 react-hook-form / zod 의 *validation 의도* 안 물음
2. **gd-chat 성급 종료** (v4 retro #3) — 충분한 대화 없이 곧장 컴파일. §12 종료 조건이 *기술 체크* 중심 (frontmatter / 어휘 / 명령 안내) — *의도 깊이 검증* 부족
3. **버튼 의도 (CTA / nav / submit)** (v4 retro #5) — Button 만나면 *어떤 버튼인지* (제출 / 페이지 이동 / 외부 link 등) 안 물음

세 영역은 모두 **gd-chat 스킬 본문** 의 *대화 단계 강화* 로 해결 — 본 spec 의 단일 모듈.

## 🎯 요구사항

### Functional Requirements

1. **§5.5 (NEW) — 대화 깊이 checklist**: gd-chat 종료 전 *5 단계* 명시적 확인
   - (i) 의도 / 목적 (Narrative 작성됐는지)
   - (ii) 토큰 후보 (radius / color / spacing — 현 24 standard 와 매칭)
   - (iii) 비슷한 화면 발견 (corpus 안 동일 패턴 — 재사용 vs 신규)
   - (iv) form validation 의도 (Input/Form 있을 시)
   - (v) 버튼 의도 (Button 있을 시 — CTA / nav / submit / external)
2. **§7.x (NEW) Input 만나면 validation 의도 묻기**:
   - react-hook-form + zod 표준 패턴 안내 (preset 의 dep 사용)
   - 결정: required / format / 최소-최대 길이 등을 decisions.md append
3. **§7.y (NEW) Button 만나면 버튼 의도 묻기**:
   - 4 옵션: (A) form submit / (B) page navigation / (C) external link / (D) modal open
   - 결정에 따라 chat.md 의 Button props 안내 (`type="submit"` / `<Link to=...>` wrap 등)
4. **§12 종료 조건 강화**: 위 5 단계 checkbox 추가. 미충족 시 *계속 대화* 안내
5. **§11 안티 패턴 추가**:
   - "Input 만났는데 validation 안 묻고 컴파일" — 금지
   - "Button 만났는데 의도 안 묻고 컴파일" — 금지
6. **통합 시나리오 검증**: 이지 페르소나 v5 시뮬레이션 — 4 신 (login/signup/dashboard/mypage) 재현 시 *대화 turn ≥ 5 평균* + decisions.md 에 *validation* + *버튼 의도* entry ≥ 1

### Non-Functional Requirements

1. 스킬 본문 길이 제한: ≤ 400 줄 (현 308 → +90 정도)
2. 한국어 일관성
3. 기존 §1-§12 구조 유지 — 추가는 §5.5 + §7.x/y + §12 강화

## 🚫 Out of Scope

- 비슷한 화면 자동 발견 (corpus 유사도) → spec-12-04
- `gd tokens` 명령 → spec-12-03
- order.md 디자인 주문 명세 → spec-12-05
- skeleton UI 자동 생성 → spec-12-06
- plugin 아키텍처 → spec-12-07
- 이지 페르소나 실제 외부 검증 (인터뷰) → OPT

## 📑 ADR 후보

- [ ] **ADR-12-02-A** — form validation 표준: react-hook-form + zod (preset 의 dep 사용)
- [ ] **ADR-12-02-B** — 버튼 의도 4 옵션 (A/B/C/D) — 추가 옵션 (예: AI 호출) 후속 결정

## ✅ Definition of Done

- [ ] gd-chat.md §5.5 (대화 깊이 checklist) + §7.x (validation) + §7.y (버튼 의도) + §11 안티 + §12 종료 강화
- [ ] 시뮬레이션 시나리오 1 — 이지 v5 의 신 1 (로그인) 재현 시 대화 turn 기록 → decisions.md *validation* + *버튼 의도* entry 생성
- [ ] 시뮬레이션 시나리오 2 — 4 신 모두 0 errors / 평균 turn ≥ 5
- [ ] 보고서: `experiments/dogfooding-alpha-v5-depth-2026-05.md`
- [ ] studio + @gd/cli + create-gd-react 테스트 회귀 무
- [ ] walkthrough.md + pr_description.md
