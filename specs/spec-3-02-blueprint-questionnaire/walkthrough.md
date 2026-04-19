# Walkthrough: spec-3-02

> Blueprint 질의서 프로토콜 설계 작업 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 질의 단계 수 | 2단계 vs 3단계 vs 5단계 | 3단계 | 과도한 질문 방지(2는 부족, 5는 과도) |
| Step 3 방식 | 페이지별 개별 질의 vs 일괄 확인 | 일괄 확인 기본 + 개별 조정 옵션 | 대부분 기본값으로 충분, 필요 시만 세부 조정 |
| Output 형식 | JSON vs YAML vs Markdown | REQUIREMENTS.md (Markdown) | 사람 가독성 + AI 파싱 모두 충족 |
| 프로토콜 위치 | `templates/` vs `schema/` | `schema/` | page-catalog.md와 동일 레벨, 앱 생성 참조점 |

## 💬 사용자 협의

- **주제**: Phase base branch 모드 전환
  - **사용자 의견**: phase 단위로 커밋하고 싶음
  - **합의**: `phase-3-app-blueprint` base branch 생성, spec PR은 phase 브랜치 대상

## 🧪 검증 결과

### 수동 검증

1. **3단계 구조**: Step 1 (앱 유형) → Step 2 (페이지 구성) → Step 3 (커스터마이징) ✅
2. **질문/선택지/기본값**: 모든 단계에 구조화된 형식으로 정의 ✅
3. **REQUIREMENTS.md 매핑 규칙**: 질의 데이터 → 문서 위치 매핑 표 정의 ✅
4. **Template 매핑 표 생성 규칙**: page-catalog.md 상태와 연동되는 규칙 정의 ✅
5. **page-catalog.md ID 체계 일관성**: 동일 ID 사용 확인 ✅

## 🔍 발견 사항

- Custom(직접 구성) 선택 시 빈 상태에서 시작하므로, 카탈로그 전체 목록 제시가 필요
- REQUIREMENTS.md 출력 구조가 spec-3-003의 템플릿 설계에 직접 입력으로 사용됨

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-04-17 |
| **최종 commit** | `ce0f230` |
