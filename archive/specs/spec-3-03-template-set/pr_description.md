# docs(spec-3-03): 산출물 템플릿 세트 + 리소스 분리

## 📋 Summary

### 배경 및 목적

Blueprint 질의서(spec-3-02)의 출력을 받아 실제 프로젝트 파일을 생성할 템플릿이 필요했다. 또한 DESIGN.md 확장 섹션이 Page Template 코드에 어떻게 매핑되는지 명세가 없어 AI 에이전트가 DESIGN.md → 코드 변환을 체계적으로 수행할 수 없었다.

### 주요 변경 사항

- [x] `templates/REQUIREMENTS.md.template` — Blueprint 결과를 채우는 요구사항 템플릿
- [x] `templates/AGENT.md.template` — AI 에이전트 프로젝트별 지침 템플릿
- [x] `templates/assets/` — i18n/tokens/images 리소스 분리 구조 + README
- [x] `schema/design-component-mapping.md` — DESIGN.md §11~14 → 코드 매핑 명세

### Phase 컨텍스트

- **Phase**: `phase-3` (App Blueprint)
- **본 SPEC의 역할**: phase-3의 마지막 Spec. 카탈로그(3-01) + 질의서(3-02) + 템플릿(3-03)으로 App Blueprint 체계 완성

## 🎯 Key Review Points

1. **REQUIREMENTS.md 템플릿**: placeholder 형식이 Blueprint 프로토콜과 일관되는지
2. **매핑 명세**: AI가 DESIGN.md만 읽고 코드를 생성할 수 있을 만큼 구체적인지

## 📦 Files Changed

### 🆕 New Files
- `templates/REQUIREMENTS.md.template`: 프로젝트 요구사항 템플릿
- `templates/AGENT.md.template`: AI 에이전트 지침 템플릿
- `templates/assets/README.md`: assets 디렉토리 구조 + 참조 방식
- `templates/assets/{i18n,tokens,images}/.gitkeep`: 디렉토리 예약
- `schema/design-component-mapping.md`: DESIGN.md → 코드 매핑 명세

**Total**: 7 files changed

## ✅ Definition of Done

- [x] REQUIREMENTS.md 템플릿 완성
- [x] AGENT.md 템플릿 완성
- [x] DESIGN.md ↔ Component 매핑 명세 완성
- [x] `templates/assets/` 디렉토리 구조 정의
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료

## 🔗 관련 자료

- Phase: `backlog/phase-3.md`
- Walkthrough: `specs/spec-3-03-template-set/walkthrough.md`
- 참조: `schema/design-md-schema.md`, `schema/page-catalog.md`, `schema/blueprint-protocol.md`
