# Walkthrough: spec-1-001

> 본 문서는 *증거 로그* 입니다. "무엇을 했고 어떻게 검증했는지" 를 미래의 자신과 리뷰어에게 남깁니다.

## 📋 실제 구현된 변경사항

- [x] 66개 awesome-design-md 레퍼런스 구조 분석 → `report.md` 작성
- [x] 기존 9섹션 구조 정리 + 확장 5섹션(10~14) 정의 → `schema/design-md-schema.md`
- [x] stripe.md를 확장 Schema로 변환한 검증 샘플 → `schema/examples/stripe-extended.md`

## 🧪 검증 결과

### 1. 자동화 테스트

- Research Spec이므로 자동화 테스트 해당 없음 (코드 변경 없음)

### 2. 수동 검증

1. **Action**: 66개 파일 H2 섹션 제목 추출 및 빈도 분석
   - **Result**: 섹션 1~4, 9는 66/66 출현 (필수). 섹션 7은 61/66 (선택 — 5개 파일이 다른 주제로 대체)

2. **Action**: 대표 파일 6개 정독 (stripe, linear, claude, vercel, airbnb, notion)
   - **Result**: 상세 파일(280줄+)에서 `Distinctive Components` 서브섹션이 암묵적 페이지 명세 역할을 함을 발견

3. **Action**: stripe.md를 확장 Schema로 변환
   - **Result**: 기존 9섹션(322줄) 100% 보존 + 확장 5섹션(167줄) 추가. 총 489줄. 정보 손실 없음

4. **Action**: 확장 섹션 비어있을 때 유효성 확인
   - **Result**: 기존 9섹션만 있는 DESIGN.md는 그대로 유효. 확장 섹션은 모두 선택이므로 하위 호환 유지

### 3. 증거 자료

- `specs/spec-1-001-design-md-schema/report.md` — 분석 보고서 (110줄)
- `schema/design-md-schema.md` — 확장 Schema 정의 (370줄)
- `schema/examples/stripe-extended.md` — 검증 샘플 (489줄)

## 🔍 발견 사항

- 기존 포맷의 `### Distinctive Components` 서브섹션이 확장 섹션 §11 (Page Specifications)과 §12 (Composite Components)의 시드 역할. 완전히 새로 만드는 게 아니라 기존 패턴을 공식화하는 것
- 간략 파일(89~130줄)은 AI 코드 생성 시 참고 가치가 낮음. 확장 Schema 적용 시 최소 상세도 기준 제시 필요
- 섹션 7(Do's/Don'ts)은 사실상 "특별 주제 슬롯"으로, 브랜드 특성에 따라 Interaction & Motion, Dark Mode, Accessibility 등으로 대체 가능

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-04-12 |
| **최종 commit** | `f043f9c` |
