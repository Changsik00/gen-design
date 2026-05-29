# Walkthrough: spec-13-03

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Scenarios 강제 여부 | 항상 강제 / 서버 데이터 있을 때만 | **서버 데이터 있을 때 강제, 정적 화면은 skip 가능** | 순수 정적 화면(아이콘, 배너 등)에 MSW 시나리오 강요는 오버헤드. decisions.md에 "정적 화면, Scenarios 없음" 기록 |
| v1 → v2 업그레이드 | 항상 강제 / 선택 제안 | **선택 제안 (Y/N)** | 기존 v1 파일 다수 존재 — 일괄 강제는 마찰. 사용자가 선택 |
| .order.md 처리 | 유지 / 제거 | **제거 (Scenarios로 대체)** | .order.md는 v1 컴파일러 전용. v2에서는 Scenarios YAML이 validation + action 의도 모두 담음 |
| DB Hints 필수 여부 | 필수 / 선택 | **선택** | 프론트엔드 개발 단계에서 DB 미확정인 경우 많음. 강제 시 불필요한 진행 차단 |
| `pnpm gd react` 참조 | 유지 / 제거 | **제거, LLM 직접 요청으로 대체** | 컴파일러 폐기 예정(spec-13-06). 이미 LLM이 더 나은 결과 제공 |

- [ ] 없음 (ADR 승격 대상 없음)

## 💬 사용자 협의

- **주제**: chat.md v2 레이어 추가 방향
  - **사용자 의견**: 화면에 보이는 숫자가 비즈니스 로직이면 API/연산이 있을 것. chat.md에서 미리 추출해두면 나중에 DB 스키마 설계와 API 만들 때 유용. React는 MSW 시나리오가 도움이 될 것 같다.
  - **합의**: Data / API / Scenarios / DB Hints 4개 레이어 추가. Scenarios는 서버 데이터 있을 때 최소 3개(loaded/loading/error) 강제.

- **주제**: 컴파일러 대체 방식
  - **사용자 의견**: LLM이 shadcn 알아서 찾고 Tailwind 알아서 쓰는데, variant 적용하려면 token에 있는걸 알아서 써야 함.
  - **합의**: §9에서 "LLM에게 직접 요청" 안내. DESIGN.md + TOKEN.md를 컨텍스트로 주는 방식 명시.

## 🧪 검증 결과

### 1. 자동화 테스트

docs-only spec — 코드 변경 없음.

### 2. 수동 검증

1. **Action**: gd-chat §5.5 체크리스트 7단계 검토
   - **Result**: 기존 5단계에 Data 확인(vi), Scenarios 확인(vii) 추가. 순서: 의도→토큰→유사화면→form→버튼→데이터→시나리오

2. **Action**: §5.8~§5.11 신규 섹션 검토
   - **Result**: Data → API → Scenarios → DB Hints 순서로 자연스럽게 연결. 각 섹션이 이전 섹션의 결과를 입력으로 받는 구조.

3. **Action**: §9 LLM 생성 안내 검토
   - **Result**: `pnpm gd react` 제거. 방법 1(LLM 직접), 방법 2(gd extract), 방법 3(pnpm dev) 3단계로 명시.

4. **Action**: §11 안티 패턴에 신규 항목 추가 검토
   - **Result**: "서버 데이터 있는데 Scenarios 건너뛰기", "Data 없이 Scenarios 작성", "pnpm gd react 안내" 3개 추가.

5. **Action**: v1 → v2 업그레이드 경로 (§3.1) 검토
   - **Result**: 기존 파일 발견 시 Y/N 제안. 강제 아님.

## 🔍 발견 사항

- `.order.md` 섹션(§5.8, §5.9)이 v1에서 form validation + API binding을 담당했는데, v2의 Scenarios YAML이 이 역할을 완전히 대체함. spec-13-06에서 order.ts 명령도 함께 정리 필요.
- DB Hints가 선택임에도 §5.5 checklist(7단계)에 포함되지 않음 — skip 허용이지만 "결정" 자체는 decisions.md에 기록하도록 §5.11에 명시.

## 🚧 이월 항목

- **`.order.md` 명령 정리** → spec-13-06 (gd react 제거 시 함께)
- **gd extract 구현** → spec-13-04
- **v1 파일 일괄 업그레이드 도구** → Icebox

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-29 |
| **최종 commit** | `4d46364` |
