# ADR-010: chat 승격 정책 — Hybrid (제안 자동 + 실행 수동)

> **상태**: 승인 (Accepted)
> **날짜**: 2026-05-10
> **의사결정자**: Dennis
> **연관 문서**: ADR-006 (Paper-first), ADR-007 (FRONT.md 룰북), ADR-008 (per-spec design = 옵션 B), ADR-009 (gen-design CLI), `docs/handbook.md` §3 / §7 / §8
> **선행 ADR**: ADR-008 (per-spec design files = 옵션 B). 본 ADR 은 *재해석* — 옵션 B 의 *글로벌 직접 편집* 정신 위에 chat-매개 흐름의 *agent 능동 제안* 을 더한 *부속 결정*. ADR-008 을 *대체* 하지 않음.

## 컨텍스트

### ADR-008 의 가정 (옵션 B)

ADR-008 (2026-05-10) 이 *per-spec design 파일 정책 = 옵션 B (글로벌 직접 편집)* 를 채택. 핵심 가정:

- 디자이너가 *글로벌 SSOT* (`templates/{DESIGN,FRONT,TOKEN}.md` + `chats/`) 를 *직접 편집*
- *변경 슬라이스* 의 시각화는 PR diff 가 담당
- *자동 mv / 자동 정리* 는 도입하지 않음 (옵션 A 의 도구 부담 회피)

phase-7 9 spec 동안 이 가정이 매끄러웠음 — 단일 디자이너 (사용자 본인) 흐름에서 충돌 0 회.

### chat-매개 흐름의 부분 충돌

phase-8 의 *agent 매개 chat 흐름* (PoC `poc-chat-agent-flow` 검증) 이 *자동 제안* 욕구를 자연 발생:

- **PoC 세션 3 (shell 승격)**: agent 가 *2+ scene 공통 패턴* (BrandHeader / AppFooter) 자동 감지 → *글로벌 shell 승격 제안* → 디자이너 합의 → 4 파일 일관 갱신.
- **사용자 비전**: *"자유롭게 만들되 결국 정리된다"* — *결국 정리* 의 *책임자* (agent? 디자이너?) 미정.
- **handbook §6 P6 (도서관 사서)**: agent 의 *능동 제안* 의무가 명문화 — 단 *실행 권한* 미정.

→ ADR-008 옵션 B 의 *수동 정신* 과 chat-매개 흐름의 *자동 제안 가치* 가 *부분 충돌*. *완전 자동* 도 *완전 수동* 도 아닌 중간 결정 필요.

### gen-design merge 명령의 미정 상태

ADR-009 D-4: `merge` 명령 = *"ADR-008 옵션 A 도입 시까지 보류 — 영구 보류 가능"*. 그러나 chat-매개 흐름이 *자동 정리* 를 요구 → merge 의 *의미* (자동 mv? 조력자? 검증?) 미정.

## 결정

### D-1: chat 승격 (playground → chats) = 수동 git mv + agent 조력 제안

- **agent**: 매 chat 갱신 시 컨텍스트 읽고 *"이 chat 은 정식 chats/ 로 승격할까요?"* 능동 제안 (P6 도서관 사서)
- **디자이너**: *합의* 후 직접 `git mv playground/chats/.../x.chat.md chats/.../x.chat.md`
- **이유**: 자동 mv 의 *잘못 승격 위험* (예: 미완 실험을 정식으로 잘못 승격) 회피. *명시 의도* 가 영구 git history 에 기록.

### D-2: shell 승격 (component → shell 글로벌) = agent 휴리스틱 + 디자이너 합의

- **agent 휴리스틱**: *3+ scene 에서 동일 component 패턴* 사용 시 → *"이 component (예: BrandHeader) 를 shell 로 승격할까요?"* 자동 제안
- **디자이너**: 합의 → agent 가 `_shell.chat.md` 생성 + 기존 scene 의 frontmatter 갱신 + 글로벌 SSOT 반영 *제안* → 디자이너 confirm 후 commit
- **이유**: PoC 세션 3 검증된 패턴. *agent 가 잘 발견* + *디자이너 가 잘 결정*. 자동 mv 는 옵션 X.

### D-3: 글로벌 SSOT (templates/) 자동 정리 = agent 제안 + confirm

- **agent**: chat 갱신 시 *"이 변경은 templates/DESIGN.md 의 §11 도 갱신해야 해요. 함께 할까요?"* 제안
- **디자이너**: confirm 후 agent 가 글로벌 SSOT 갱신 (단일 파일 / 영역만)
- **이유**: 글로벌 SSOT 는 *디자인 결정의 진실*. 자동 갱신은 *디자인 결정 자동화* 와 동치 — 위험. 합의 후 *agent 의 정확한 작업* 을 활용 (디자이너 손 편집 부담 ↓).

### D-4: gen-design merge 명령 = 조력자

- **의미**: *자동 mv 명령 X*. *조력자* 형태:
  1. 휴리스틱 후보 제시 (`merge` 실행 시 *"BrandHeader 가 3 scene 에 공통 — shell 승격 후보"* 등)
  2. 변경 *preview* (실 mv 전 어떤 파일이 어디로, 어떤 frontmatter 갱신 발생할지)
  3. 디자이너 *confirm* (`y/N`) → 실행
  4. *각 파일* commit (atomic) → revert 단순
- **도입 시점**: phase-8 (`spec-08-08`) — ADR-009 의 ⭐ 5 (보류) → *Hybrid 결정 후 도입 확정*
- **이유**: 자동 mv 는 *위험*. 조력자가 ADR-010 결정과 일치. 디자이너의 *반복 작업* 부담을 줄이되 *결정 권한* 은 보존.

### D-5: agent 의 책임 분리 — 제안 (자동) + 실행 (수동)

- **agent 의 의무 (자동)**:
  - 매 chat 갱신 시 컨텍스트 읽기 (chats/ + catalog + templates/)
  - 재사용 / 승격 / 정리 *후보 제시*
  - 변경 *preview* 작성
- **agent 의 권한 X (디자이너 합의 필수)**:
  - 파일 mv (playground → chats, scene → shell)
  - 글로벌 SSOT (templates/) 직접 갱신
  - git commit (디자이너 의도 영구 기록)

→ P6 (도서관 사서) 의 *제안* 과 *실행* 의 분리. 사서가 *책 위치* 를 *제안* 하지만 *책을 옮기는 것* 은 사서가 아님 (도서관 비유의 한계 — 우리는 *agent 가 *제안만* 책임* 으로 정의).

## 대안

### 옵션 A: 풀 자동 (자동 mv + 자동 글로벌 갱신)

- **장점**: 디자이너 부담 0. 모든 정리 agent 가 즉시.
- **단점**:
  - *잘못 승격 위험* — 미완 실험 / 잘못된 휴리스틱 → 정식 chats/ 오염
  - *디자인 결정의 자동화* — 글로벌 SSOT 갱신은 디자인 시스템 결정 — 합의 부재 시 폭주
  - *git history 복잡화* — agent 자동 commit 의 의도 추적 어려움
- **거부**.

### 옵션 B 유지 (자동 0)

- **장점**: ADR-008 그대로. 단순.
- **단점**:
  - chat-매개 흐름의 *자동 제안 가치* 약화 — agent 가 *말만* 하고 *실행 부담* 디자이너 100%
  - PoC 세션 3 검증된 *agent 의 휴리스틱 발견* 활용 X
  - 사용자 비전 *"결국 정리"* 의 *결국* 이 명료하지 않음
- **거부**.

### 옵션 C: Hybrid (채택)

- *제안 자동 + 실행 수동*. 두 옵션의 장점 결합.

## 결과

### 즉시 영향

- **handbook §3 / §7 / §8**: ADR-010 결정 반영 갱신 (본 spec 안)
- **handbook §6 P6 (도서관 사서)**: 의무 명확화 — *제안만*, *실행은 디자이너*
- **gen-design merge 명령** (`spec-08-08`): *조력자* 의미로 구현 — 휴리스틱 + preview + confirm

### 장기 영향

- **chat-md grammar (`spec-08-04`)**: frontmatter 의 `shell.{inherit, exclude}` 형식 정착 — *수동 편집* + agent 조력 갱신 둘 다 지원
- **inferChat diff 모드 (`spec-08-06`)**: Paper 변경 → chat 갱신 *제안* (자동) + 디자이너 confirm (수동) 패턴 채용
- **외부 alpha (`spec-08-11`)**: alpha 디자이너의 *수동 mv 부담* 측정 — Reconsider trigger 의 데이터

### Out of scope (본 ADR)

- 휴리스틱 알고리즘 *구현* — `spec-08-08` (gen-design merge)
- chat-md frontmatter *형식 강제* — `spec-08-04`
- Studio runtime 의 승격 UI — phase-9 후보
- agent 의 *제안 형식 표준화* — handbook §5 P6 의 *후속* (별 spec 후보)

## Reconsider trigger

다음 중 *하나* 이상 발생 시 ADR-010-revised 를 작성하여 옵션 A (풀 자동) 또는 ADR-008 옵션 B 회귀 검토:

1. **디자이너 이동 부담 누적**: 주 1회 이상 *동일 패턴 반복 mv* 발생 → *자동* (옵션 A) 시그널
2. **외부 alpha 마찰 보고**: alpha 디자이너 3+ 명이 *수동 mv 가 부담* 보고 → *조력자* 의 confirm UX 개선 또는 옵션 A 검토
3. **자동 mv 안전성 데이터**: agent 의 *잘못 mv* 0 사례 5+ 회 누적 → 자동 mv 권한 부여 검토

위 trigger 의 측정은 phase 회고 + 외부 alpha 보고를 통해.

## 회고

- ADR-008 의 *글로벌 직접 편집* 정신은 *디자이너 결정 권한 보호* 가 본질. ADR-010 가 그 정신을 *유지* 하면서 chat-매개 흐름의 *자동 제안 가치* 를 더함.
- *제안* 과 *실행* 의 분리가 *agent 의 능력* 과 *디자이너의 권한* 사이 자연 균형. 도서관 사서 비유의 한계 (사서는 책도 옮김) 를 넘어 *agent 는 제안만* 으로 명확화.
- Reconsider trigger 가 *측정 가능 데이터* 기반 (ADR-008 D-4 패턴 차용) — *기분이 아닌 데이터* 로 미래 결정 재논의.
- gen-design merge 명령의 *조력자* 의미가 ADR-009 D-4 의 *영구 보류* 가능성을 해소 — 이제 phase-8 안에서 *명확한 의미* 로 도입 가능 (`spec-08-08`).
