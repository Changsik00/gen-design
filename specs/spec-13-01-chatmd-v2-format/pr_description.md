# docs(spec-13-01): chat.md v2 수직 단면 포맷 설계 + ADR-011

## 📋 Summary

### 배경 및 목적

phase-12까지의 `gd react` 컴파일러 기반 접근은 LLM-native 환경에서 불필요한 레이어였다. LLM은 shadcn과 Tailwind를 이미 알고 있고, 실제로 필요한 것은 "어떤 토큰 이름을 쓸 것인가"의 합의뿐이다. 동시에 chat.md가 UI 레이어에만 국한되어 데이터 출처, API 계약, 테스트 시나리오가 분리 관리되는 비효율이 있었다.

본 spec에서 chat.md를 **수직 단면 스펙**으로 재정의하고, 컴파일러 폐기 결정을 ADR-011로 기록한다.

### 주요 변경 사항

- [x] `docs/chatmd-v2-format.md` — chat.md v2 포맷 정의 (5개 레이어, YAML hybrid)
- [x] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md` — 대시보드 v2 예시 파일
- [x] `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md` — 컴파일러 폐기 + v2 채택 결정 기록

### Phase 컨텍스트

- **Phase**: `phase-13`
- **본 SPEC의 역할**: phase-13 전체의 기반. 이후 spec-13-02(intake), spec-13-03(gd-chat v2), spec-13-04(gd extract), spec-13-05(e2e), spec-13-06(컴파일러 제거) 모두 본 ADR과 포맷 정의를 전제로 한다.

## 🎯 Key Review Points

1. **chat.md v2 레이어 구조** (`docs/chatmd-v2-format.md`): Structure는 기존 bare Markdown 유지, Data/API/Scenarios/DB Hints는 YAML fenced block — YAML 선택이 `gd extract` 파싱 용이성과 사람 가독성을 동시에 충족하는지 검토.

2. **Scenarios 레이어 스키마** (예시 파일 `🎬 Scenarios`): `name / state / data / message` 구조가 MSW 핸들러 스텁 자동 생성(spec-13-04)에 충분한지 검토.

3. **ADR-011 결정 근거**: 컴파일러 폐기의 이유와 대안 3개 비교가 명확한지 확인.

## 🧪 Verification

### 자동 테스트

docs-only spec — 코드 변경 없음.

### 수동 검증 시나리오

1. **포맷 일관성**: `dashboard.chat.md`의 Data 레이어 키(`total_sales`)가 Structure의 `{{data.total_sales}}`와 Scenarios의 `loaded.data.total_sales`와 일치 → ✅ 확인
2. **YAML 파싱 가능성**: Scenarios YAML이 `js-yaml.load()` 호환 구조 → ✅ 확인 (중첩 객체 없이 flat 구조 유지)
3. **ADR 경로 참조 유효성**: ADR-011 Related 섹션의 경로들이 실제 파일 존재 → ✅ 확인

## 📦 Files Changed

### 🆕 New Files

- `docs/chatmd-v2-format.md`: chat.md v2 포맷 전체 명세 (레이어 정의, 작성 규칙, 토큰-variant 주입 전략, v1→v2 마이그레이션 방향)
- `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`: 컴파일러 폐기 + v2 채택 결정 ADR
- `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md`: v2 포맷 대시보드 예시 (모든 레이어 포함)
- `specs/spec-13-01-chatmd-v2-format/analysis-notes.md`: 기존 파서 분석 + gd extract 인터페이스 초안

**Total**: 4 files changed (모두 신규)

## ✅ Definition of Done

- [x] docs-only spec — 단위 테스트 해당 없음
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-13.md`
- Walkthrough: `specs/spec-13-01-chatmd-v2-format/walkthrough.md`
- ADR: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
- 다음 Spec: spec-13-02 (intake), spec-13-03 (gd-chat v2)
