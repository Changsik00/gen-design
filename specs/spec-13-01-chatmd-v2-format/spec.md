# spec-13-01: chat.md v2 포맷 설계

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-01` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-01-chatmd-v2-format` |
| **상태** | Planning |
| **타입** | Research |
| **Integration Test Required** | no |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gd-chat` 스킬이 안내하는 chat.md는 3층 구조(Narrative / Structure / History)로 이루어진 UI 명세 파일이다. `gd react` CLI가 Structure 섹션을 파싱하여 `src/scenes/*.tsx`를 결정론적으로 생성한다.

```
현재 흐름:
chat.md (UI 명세) → gd react 컴파일러 → src/scenes/*.tsx
```

### 문제점

1. **컴파일러가 불필요**: LLM은 shadcn, Tailwind, cva variant를 이미 알고 있다. 사전 컴파일된 TSX는 LLM에게 추가 컨텍스트를 제공하지 않는다. 필요한 건 "어떤 토큰 이름을 쓸 것인가"의 합의뿐이다.

2. **화면 레이어만 담음**: chat.md에는 UI 구조만 있다. 화면에 보여야 하는 데이터의 출처(API), 비즈니스 로직 힌트, 테스트 시나리오가 없다. 프론트엔드 이후 백엔드 설계가 별도로 이루어지는 비효율 발생.

3. **MSW 시나리오 연결 없음**: loaded / loading / error 같은 상태별 UI 검증을 위한 MSW 핸들러를 chat.md에서 도출할 수 없다. 테스트가 "라우트 로딩" 수준에 머문다.

4. **DB 설계와 단절**: 화면에 보이는 데이터 shape에서 DB 스키마 초안을 도출하는 경로가 없다.

### 해결 방안 (요약)

chat.md를 **수직 단면 스펙**으로 재정의한다. 기존 UI 레이어에 더해 data / API / scenarios / db_hints 레이어를 추가한다. 이 파일에서 LLM이 React를 생성하고, `gd extract`가 MSW 핸들러와 API spec을 추출하며, DB 스키마 초안 작성의 기초가 된다.

## 📊 개념도

```
chat.md v2 (수직 단면 스펙)
         │
         ├── UI 레이어          → LLM이 React 생성 (shadcn + 토큰)
         ├── Data 레이어        → 화면에 필요한 데이터 shape + 출처
         ├── API 레이어         → 필요한 엔드포인트 목록 + response shape
         ├── Scenarios 레이어   → MSW 핸들러 스텁 생성 소스
         └── DB Hints 레이어    → 스키마 초안 힌트 (선택)
```

## 🎯 요구사항

### Functional Requirements

1. **레이어 5개 정의**: UI / Data / API / Scenarios / DB Hints 각 레이어의 역할, 필수/선택 여부, 작성 규칙 문서화
2. **포맷 결정**: YAML fenced block vs Markdown 섹션 트레이드오프 분석 후 결정 — `gd extract` 파싱 용이성 + 사람 가독성 동시 충족
3. **토큰-variant 컨텍스트 주입 전략**: LLM이 생성 시 반드시 지켜야 할 규칙 ("색 직접 쓰지 말고 variant / 토큰 클래스만 사용") 을 어떻게 주입할지 명시
4. **예시 파일 1개**: 로그인 화면 또는 대시보드 화면 중 1개를 v2 포맷으로 작성 — 모든 레이어 포함
5. **ADR-011 작성**: 컴파일러 폐기 결정 근거 + v2 포맷 채택 이유

### Non-Functional Requirements

1. v2 포맷은 gd-chat 스킬에서 안내하기 쉬운 구조여야 함 (spec-13-03 의존)
2. Scenarios 레이어는 `gd extract`가 기계 파싱 가능한 구조여야 함 (spec-13-04 의존)
3. 기존 chat.md v1 파일과의 마이그레이션 경로 방향 메모 (실제 마이그레이션은 out of scope)

## 🚫 Out of Scope

- `gd extract` 명령 실제 구현 (spec-13-04)
- gd-chat 스킬 재작성 (spec-13-03)
- gd react 명령 제거 (spec-13-06)
- 기존 chat.md v1 파일 일괄 마이그레이션
- DB 스키마 자동 생성 도구

## 📑 ADR 후보

- [x] ADR 가치 있는 결정 있음 → `ADR-011-chatmd-v2-vertical-slice` (type: decision)
  - 컴파일러 폐기 + 수직 단면 포맷 채택 근거를 장기 기록으로 보관

## ✅ Definition of Done

- [ ] chat.md v2 포맷 레이어 5개 정의 문서 완성 (`docs/chatmd-v2-spec.md` 또는 ADR 내 포함)
- [ ] 예시 파일 1개 작성 (`specs/spec-13-01-chatmd-v2-format/examples/`)
- [ ] ADR-011 작성 완료 (`docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`)
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-13-01-chatmd-v2-format` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
