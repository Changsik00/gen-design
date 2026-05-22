# Walkthrough: spec-3-03

> 산출물 템플릿 세트 + 리소스 분리 작업 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 템플릿 위치 | `schema/` vs `templates/` | `templates/` 신규 | schema는 규격 정의, templates는 프로젝트 생성용으로 역할 분리 |
| 리소스 이동 시점 | 지금 vs 향후 Phase | 향후 Phase | studio import 경로 변경이 필요하므로 코드 변경과 함께 진행 |
| studio 참조 방식 | 심볼릭 링크 vs 빌드 복사 vs Vite alias | Phase 5에서 결정 | 각 방식의 trade-off를 PoC에서 검증 필요 |
| AGENT.md 내용 | 프로젝트 공통 vs 앱별 | 앱별 (template) | 앱 유형/스택에 따라 규칙이 달라짐 |

## 💬 사용자 협의

- **주제**: Phase base branch 모드로 진행
  - **합의**: spec PR은 `phase-3-app-blueprint` 대상, phase 완료 시 main PR 1개

## 🧪 검증 결과

### 수동 검증

1. **REQUIREMENTS.md 템플릿**: blueprint-protocol.md 출력 구조와 일치 ✅
2. **AGENT.md 템플릿**: DESIGN.md + REQUIREMENTS.md 참조 구조 ✅
3. **매핑 명세**: ARCHITECTURE.md 3계층 + 슬롯 시스템과 일관 ✅
4. **assets 구조**: i18n/, tokens/, images/ 디렉토리 생성 + README 완비 ✅
5. **기존 파일 참조**: design-md-schema.md, page-catalog.md, types.ts 정합 ✅

## 🔍 발견 사항

- DESIGN.md 섹션 12(Composite Components)의 Element Type → shadcn/ui 매핑이 많아질 경우 별도 레지스트리 고려 가능
- studio 참조 방식 3가지 중 Vite alias가 가장 깔끔하지만, monorepo 구조에서 빌드 순서 이슈 가능

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-04-19 |
| **최종 commit** | `9819cbe` |
