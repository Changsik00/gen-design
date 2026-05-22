# docs(spec-1-001): DESIGN.md 확장 Schema 정의

> 66개 레퍼런스 분석을 기반으로 기존 9섹션 + 확장 5섹션 Schema를 정의한다.

## 📋 Summary

### 배경 및 목적

기존 DESIGN.md(Stitch/awesome-design-md) 포맷은 "브랜드의 비주얼이 어떻게 생겼는가"를 기술하지만, 페이지 구조 명세, 복합 컴포넌트 참조, 토큰↔코드 매핑, i18n 참조가 없다. 이 갭을 메우는 확장 섹션을 정의하여 디자인→코드 브릿지의 기반을 만든다.

### 주요 변경 사항

- [x] 66개 레퍼런스 분석 보고서 — 섹션 출현 빈도, 필수/선택 판별, 한계점 5가지 도출
- [x] 확장 Schema 정의 — 기존 9섹션 구조 정리 + 확장 5섹션(§10~§14) 상세 포맷·예시·규칙
- [x] 검증 샘플 — stripe.md를 확장 Schema로 변환 (기존 322줄 보존 + 확장 167줄)

### Phase 컨텍스트

- **Phase**: `phase-1` (Foundation)
- **본 SPEC의 역할**: 전체 시스템의 명세 기반. 이후 Token 파이프라인(spec-1-003), Page Template(Phase 2), Blueprint(Phase 3)이 이 Schema를 참조

## 🎯 Key Review Points

1. **확장 5섹션 범위**: §10 Naming Convention, §11 Page Specifications, §12 Composite Components, §13 Token Mapping, §14 i18n References — 과부족 없는지
2. **하위 호환**: 기존 9섹션 DESIGN.md가 그대로 유효한지. 확장 섹션은 모두 선택(optional)

## 🧪 Verification

### 수동 검증 시나리오

1. **하위 호환**: 기존 stripe.md(9섹션)가 확장 Schema 기준으로도 유효 → ✅ 확인
2. **정보 손실 없음**: stripe-extended.md가 기존 stripe.md의 모든 정보 포함 → ✅ 확인
3. **확장 섹션 비어있어도 유효**: 9섹션만 있는 파일이 Schema 위반 없음 → ✅ 확인

## 📦 Files Changed

### 🆕 New Files

- `specs/spec-1-001-design-md-schema/report.md`: 66개 레퍼런스 분석 보고서
- `schema/design-md-schema.md`: 확장 DESIGN.md Schema 정의
- `schema/examples/stripe-extended.md`: stripe.md 확장 변환 검증 샘플

**Total**: 3 files changed (new)

## ✅ Definition of Done

- [x] 66개 레퍼런스 분석 보고서 작성
- [x] 확장 Schema 문서 작성
- [x] 검증 샘플 존재 (stripe-extended.md)
- [x] `walkthrough.md` archive commit 완료
- [x] `pr_description.md` archive commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-1.md`
- Walkthrough: `specs/spec-1-001-design-md-schema/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-001-phase-restructure.md`
