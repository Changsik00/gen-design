---
id: ADR-011
type: decision
date: 2026-05-29
status: accepted
---

# ADR-011: chat.md v2 수직 단면 포맷 채택 + gd react 컴파일러 폐기

## 📚 Context

phase-12까지 시스템은 `chat.md → gd react 컴파일러 → src/scenes/*.tsx` 구조로 동작했다. 이 구조는 "LLM 없이도 TSX를 결정론적으로 생성한다"는 전통적 빌드 도구 방식을 따른다.

그러나 실제 사용 환경에서 다음이 확인됐다:

1. **LLM이 이미 알고 있다**: Claude Code 같은 LLM은 shadcn/ui, Tailwind CSS, cva variant를 별도 학습 없이 정확하게 사용한다. 사전 컴파일된 TSX가 LLM에게 주는 추가 정보는 없다.
2. **진짜 필요한 것은 토큰 합의**: LLM이 `bg-blue-500` 대신 `bg-primary`를 쓰게 하려면 TSX 파일이 아니라 "이 프로젝트의 primary 토큰이 무엇인지"와 "variant를 쓰라"는 규칙이 필요하다.
3. **chat.md가 UI 레이어에만 국한**: 화면에 보이는 데이터 출처(API), 테스트 시나리오, DB 스키마 힌트가 없어 프론트-백엔드 설계가 단절됐다.

## 🎯 Decision

1. **chat.md v2 포맷 채택**: 기존 3층(Narrative / Structure / History)에 Data / API / Actions / Scenarios / DB Hints 레이어를 추가한 수직 단면 스펙으로 재정의한다. 구조화 레이어(Data, API, Actions, Scenarios, DB Hints)는 YAML fenced block으로 작성한다.
   - **Actions 레이어** (spec-13-08 추가): 폼 검증 / 인터랙션(클릭·토글·삭제) / Query 연결 / 네비게이션을 명세. 없으면 LLM이 동작을 즉흥 구현하고 FRONT.md의 TanStack Query 규칙을 어기므로, 동작 결정성을 위해 사실상 필수다.

2. **gd react 컴파일러 폐기**: `packages/gd-cli/src/commands/react.ts` 와 `studio/src/lib/chat-md-compiler/` 를 제거한다. TSX 생성은 LLM이 chat.md + DESIGN.md + TOKEN.md를 컨텍스트로 직접 수행한다.

3. **토큰-variant 규칙 컨텍스트 주입**: `AGENT.md`와 `gd-start` 스킬에 "토큰 클래스만 사용, shadcn 표준 variant만 사용" 규칙을 명시하여 LLM이 모든 생성 요청에서 일관성을 유지하게 한다.

## 📊 Consequences

- **긍정**: chat.md 하나에서 React / MSW 핸들러 / API spec / DB 스키마 초안이 모두 파생됨. 프론트-백엔드 단절 해소.
- **긍정**: 컴파일러 유지보수 부담 제거. `studio/src/lib/chat-md-compiler/` 코드베이스 단순화.
- **긍정**: `gd extract` CLI가 Scenarios 레이어를 파싱하여 MSW 핸들러 스텁 자동 생성 가능.
- **부정**: 기존 v1 chat.md는 `gd react` 없이는 컴파일 불가. 점진 마이그레이션 필요.
- **부정**: LLM 생성 TSX는 결정론적이지 않음. 동일 chat.md로 재생성 시 미세 차이 발생 가능.
- **중립**: `gd doctor`의 drift 감지 방식 변경 필요 — `@gd:` annotation 기반 mtime 비교에서 "chat.md v2 포맷 유효성 검증"으로 역할 재정의.

## 🔀 Alternatives

- **컴파일러 유지 + 레이어 추가**: 기존 `gd react` 유지하면서 Data/API/Scenarios 레이어를 chat.md에 추가하는 안 — 비채택 이유: 컴파일된 TSX와 LLM 재생성 TSX 간 drift 관리 복잡도 증가. 컴파일러의 실질적 가치가 없음이 확인된 이상 유지 명분 없음.

- **chat.md 대신 자연어 + LLM 직접 생성**: chat.md 포맷 없이 자연어 서술만으로 LLM이 TSX 생성 — 비채택 이유: 기획 문서 가이드, 의도 기록, MSW 시나리오 소스로서의 chat.md 가치는 유효함. 포맷이 있어야 `gd extract` 같은 도구 활용 가능.

- **YAML 전체 포맷 (Structure도 YAML)**: UI Structure 섹션도 YAML로 통일 — 비채택 이유: bare Markdown 형식이 LLM이 UI를 자연스럽게 서술하기 더 적합. YAML 강제는 디자이너/기획자의 작성 부담 증가.

## 📌 Status

Accepted (2026-05-29, spec-13-01 머지 시점).
v2 포맷 적용 대상: 신규 chat.md 전부. 기존 v1은 수정 시 점진 업그레이드.

## 🔗 Related

- `docs/chatmd-v2-format.md` — v2 포맷 상세 스펙
- `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md` — v2 예시 파일
- spec-13-03: gd-chat v2 스킬 재작성 (이 ADR 기반)
- spec-13-04: gd extract 구현 (Scenarios 레이어 파싱)
- spec-13-06: gd react 컴파일러 제거
- ADR-009: gen-design CLI 구조 (gd react 포함 — spec-13-06에서 부분 supersede 예정)
