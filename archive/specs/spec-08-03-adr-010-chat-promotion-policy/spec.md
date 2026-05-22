# spec-08-03: ADR-010 chat 승격 정책 (ADR-008 reconsider — Hybrid 채택)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-08-03` |
| **Phase** | `phase-8` (chat-agent-flow) |
| **Branch** | `spec-08-03-adr-010-chat-promotion-policy` |
| **상태** | Planning |
| **타입** | Docs |
| **Integration Test Required** | no (코드 변경 0) |
| **작성일** | 2026-05-10 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

ADR-008 (per-spec design files = 옵션 B, 글로벌 직접 편집) 이 phase-7 까지 매끄러움. 그러나:

- **PoC 세션 3 (shell 승격)**: agent 가 *2+ scene 공통 패턴* 감지 → 글로벌 shell 승격 *제안* → 디자이너 합의 → 4 파일 일관 갱신. 이는 ADR-008 옵션 B 의 *수동* 정신과 *부분 충돌* — *자동화 욕구* 가 발생.
- **사용자 비전**: "자유롭게 만들되 결국 정리된다" — *결국 정리* 가 자동인지 수동인지 결정 필요.
- **handbook §7**: gen-design `merge` 명령의 도입 여부가 ADR-010 결정에 의존.
- **ADR-009 D-4**: merge 명령은 "ADR-008 옵션 A 도입 시까지 보류 — 영구 보류 가능" 으로 미정의 상태.

### 문제점

- **ADR-008 옵션 B 의 가정** (디자이너가 글로벌 직접 편집) 이 chat-매개 흐름에서 *부분 깨짐* — agent 가 능동 제안하면서 *반자동* 흐름 자연 발생.
- **승격 (playground → chats, scene → shell)** 의 *책임자* 미정 — agent? 디자이너?
- **gen-design merge 명령** 이 *어떤 의미* 인지 미정 — 자동 mv? 제안? 검증?

### 해결 방안 (요약)

ADR-010 = **Hybrid (제안 자동 + 실행 수동)**:

- agent 는 *항상* 컨텍스트 읽고 능동 제안 (P6 원칙)
- 실제 파일 이동 (mv / mkdir / commit) 은 *디자이너 명시 합의* 후 실행 (안전)
- `gen-design merge` 명령 = *조력자* (휴리스틱 후보 제시 + 디자이너 confirm) — spec-08-08 에서 구현

## 🎯 요구사항

### Functional Requirements

1. **`docs/decisions/ADR-010-chat-promotion-policy.md` 신규**:
   - ADR-007 양식 준수 (상태/날짜/의사결정자/연관/컨텍스트/결정/대안/결과/회고)
   - 컨텍스트: ADR-008 옵션 B 의 가정 + chat-매개 흐름의 *부분 충돌* + PoC 세션 3 사례
   - 옵션 A (풀 자동) / B (옵션 B 유지 - 자동 0) / **C (Hybrid — 채택)** 비교
   - 결정 = C
   - 5 결정 항목:
     - D-1: chat 승격 (playground → chats) 정책
     - D-2: shell 승격 (component → shell) 정책
     - D-3: 글로벌 SSOT 자동 정리 (templates/) 정책
     - D-4: gen-design merge 명령의 의미 (조력자)
     - D-5: agent 의 *제안 / 실행* 책임 분리
   - Reconsider trigger
   - 후속 액션 (8-04, 8-08 의 영향)
2. **`docs/handbook.md` §8**:
   - ADR-010 자리 예약 행 → *작성 완료 (2026-05-10)* + 1줄 요약 갱신
   - 결정 history 타임라인 phase-8 행에 ADR-010 명시
3. **`docs/handbook.md` §7**:
   - gen-design `merge` 명령 행 갱신 — *조력자* 의미로 명시 (후보 제시 + confirm)
4. **`docs/handbook.md` §3**:
   - 디렉토리 결정 절에 ADR-010 의 *제안 자동 + 실행 수동* 명시

### Non-Functional Requirements

1. **회귀 0**: 코드 변경 0 → `pnpm test` 그대로 PASS
2. **ADR 양식 통일성**: ADR-001 ~ 009 와 동일 헤더 구조
3. **링크 정합성**: ADR-010 의 `연관 ADR` (006/007/008/009) 모두 실재 매칭
4. **분량**: ADR-010 약 100-130 줄 (ADR-008/009 와 비슷)

## 🚫 Out of Scope

- **gen-design merge 명령 *코드*** — spec-08-08
- **chat-md grammar frontmatter 형식** (shell.inherit / exclude 의 형식 강제) — spec-08-04 (단 ADR-010 결정을 *입력* 으로 받음)
- **휴리스틱 알고리즘 *구현*** — 8-08 의 일부
- **Studio runtime 의 승격 UI** — phase-9 후보

## ✅ Definition of Done

- [ ] `docs/decisions/ADR-010-chat-promotion-policy.md` 작성 (ADR-007 양식 준수)
- [ ] `docs/handbook.md` §3 / §7 / §8 ADR-010 결정 반영
- [ ] 9 ADR 링크 정합성 + ADR-010 자체 링크 검증
- [ ] `pnpm test` 회귀 0 (725/725)
- [ ] `pnpm --filter studio build` exit 0
- [ ] `walkthrough.md` + `pr_description.md` ship commit
- [ ] PR 생성 + 사용자 검토
