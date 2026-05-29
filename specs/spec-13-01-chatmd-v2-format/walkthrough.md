# Walkthrough: spec-13-01

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 구조화 레이어 포맷 | YAML fenced block / Markdown 섹션 자유 기술 / 전체 YAML | **YAML fenced block (hybrid)** | `gd extract` 기계 파싱 용이 + 기존 Narrative/Structure bare Markdown 유지로 사람 가독성 보존 |
| 예시 화면 선택 | 로그인(form 중심) / 대시보드(data 중심) | **대시보드** | Data / API / Scenarios / DB Hints 레이어 모두 검증 가능한 화면. 로그인은 form 위주라 레이어 일부 검증 불가 |
| DB Hints 레이어 필수 여부 | 필수 / 선택 | **선택** | 프론트엔드 개발 단계에서 DB가 미확정인 경우가 많음. 강제 시 작성 부담 증가 |
| v1 chat.md 마이그레이션 | 일괄 자동 변환 / 점진 수동 | **점진 수동** | 일괄 변환 도구 구현은 scope-out. 신규는 v2, 기존은 수정 시 업그레이드 |
| gd react 제거 방식 | 즉시 삭제 / deprecated 한 버전 유지 | **미정** (spec-13-06으로 이관) | 외부 npm 사용자 breaking change 영향 검토 필요. 이 spec 범위 아님 |

- [x] ADR 승격 대상 있음 → `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md` 작성 완료

## 💬 사용자 협의

- **주제**: 기존 chat.md + gd react 컴파일러 접근 방식 재검토
  - **사용자 의견**: LLM이 shadcn, Tailwind를 이미 알고 있으므로 컴파일러가 불필요. 공통 모듈(토큰, variant)만 알려주면 알아서 만든다. chat.md는 기획 가이드 + 맥락 파악 용도로 남을 수 있다.
  - **합의**: gd react 컴파일러 폐기. chat.md는 수직 단면 스펙으로 재정의하여 UI + data + API + scenarios를 담는다.

- **주제**: chat.md에 데이터/API/시나리오 레이어 추가
  - **사용자 의견**: 화면에 보이는 숫자가 비즈니스 로직이면 API/연산이 있을 것. chat.md에서 미리 추출해두면 나중에 DB 스키마 설계와 API 만들 때 유용하다. React는 MSW 시나리오가 도움이 될 것.
  - **합의**: Data / API / Scenarios / DB Hints 4개 레이어 추가. MSW 핸들러 자동 생성을 `gd extract` 명령으로 구현 (spec-13-04).

## 🧪 검증 결과

### 1. 자동화 테스트

docs-only spec — 코드 변경 없음. 타입 체크 대상 없음.

### 2. 수동 검증

1. **Action**: `docs/chatmd-v2-format.md` 레이어 정의 검토
   - **Result**: 5개 레이어(UI/Data/API/Scenarios/DB Hints) 역할, 필수/선택 여부, 작성 규칙 문서화 완료

2. **Action**: `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md` 작성
   - **Result**: 모든 레이어 포함한 대시보드 예시 완성. YAML fenced block 파싱 가능성 확인 (js-yaml 호환 구조).

3. **Action**: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md` 작성
   - **Result**: 컴파일러 폐기 근거 + v2 포맷 채택 이유 + 대안 3개 비교 기록 완료.

4. **Action**: analysis-notes.md에서 `gd extract` 파싱 인터페이스 사전 설계
   - **Result**: Scenario 인터페이스 초안 작성. spec-13-04에서 바로 사용 가능.

## 🔍 발견 사항

- `gd doctor`의 `@gd:` annotation 기반 drift 감지가 gd react 제거 시 함께 무효화됨. spec-13-06에서 doctor 역할 재정의 필요 ("v2 포맷 유효성 검증"으로 전환 검토).
- `packages/gd-cli/src/commands/order.ts`가 react.ts와 결합되어 있음. gd react 제거 시 order.ts 처리 방향도 spec-13-06에서 결정 필요.

## 🚧 이월 항목

- **gd react 제거 방식 (deprecated vs 즉시 삭제)** → spec-13-06에서 결정
- **gd doctor 역할 재정의** → spec-13-06에서 함께 검토
- **v1 chat.md 일괄 마이그레이션 도구** → Icebox (현재 scope-out)

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-29 |
| **최종 commit** | `4c8de25` |
