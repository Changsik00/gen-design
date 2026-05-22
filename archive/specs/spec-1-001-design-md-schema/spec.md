# spec-1-001: DESIGN.md 포맷 분석 및 확장 정의

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-1-001` |
| **Phase** | `phase-1` |
| **Branch** | `spec-1-001-design-md-schema` |
| **상태** | Planning |
| **타입** | Research |
| **Integration Test Required** | no |
| **작성일** | 2026-04-12 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

Google Stitch와 VoltAgent/awesome-design-md가 DESIGN.md 포맷을 사실상 표준으로 확립했다. 66개 브랜드 파일이 동일한 9섹션 구조를 따르고 있으며, `design-md-collection/`에 이미 수집되어 있다.

9섹션 구조:
1. Visual Theme & Atmosphere
2. Color Palette & Roles
3. Typography Rules
4. Component Stylings
5. Layout Principles
6. Depth & Elevation
7. Do's and Don'ts
8. Responsive Behavior
9. Agent Prompt Guide

### 문제점

기존 DESIGN.md 포맷은 **"이 브랜드의 비주얼이 어떻게 생겼는가"**를 기술하지만, 우리 프로젝트가 필요로 하는 다음 정보가 없다:

1. **중간 언어 계층**: 페이지 내부 구조를 `Page > Section > Block > Element`로 명명하는 규약이 없음
2. **페이지 명세**: 어떤 페이지가 있고, 각 페이지에 어떤 섹션/블록이 들어가는지 기술 불가
3. **복합 컴포넌트 참조**: LoginForm, SignupPage 같은 재사용 단위를 DESIGN.md에서 참조하는 방법이 없음
4. **디자인 토큰 ↔ Tailwind 매핑**: 색상/타이포 값이 있지만, Tailwind 클래스나 CSS 변수로의 매핑이 명시적이지 않음
5. **i18n 텍스트 리소스 참조**: 다국어 텍스트 키를 어디에 어떻게 기술할지 정해져 있지 않음

### 해결 방안 (요약)

기존 9섹션 구조를 그대로 유지하면서, 위 5가지 갭을 메우는 **확장 섹션**을 정의한다. 기존 DESIGN.md 파일과 100% 하위 호환을 유지한다.

## 🎯 요구사항

### Functional Requirements

1. 66개 레퍼런스에서 섹션별 공통 패턴을 분석하고 분석 보고서를 작성한다
2. 기존 9섹션의 구조를 정리하고 필수/선택 섹션을 판별한다
3. 다음 확장 섹션을 정의한다:
   - **10. Naming Convention** — 중간 언어 계층 (Page > Section > Block > Element)
   - **11. Page Specifications** — 페이지 목록, 각 페이지의 섹션/블록 구성
   - **12. Composite Components** — 재사용 복합 컴포넌트 참조 및 variant 정의
   - **13. Token Mapping** — 디자인 토큰 ↔ CSS 변수 ↔ Tailwind 매핑 규약
   - **14. i18n References** — 다국어 텍스트 키 네임스페이스 및 참조 방식
4. 확장 Schema를 `schema/design-md-schema.md`에 문서화한다
5. 기존 레퍼런스 1개(예: stripe.md)를 확장 Schema로 변환하여 검증한다

### Non-Functional Requirements

1. 기존 9섹션 구조와 100% 하위 호환 — 확장 섹션은 기존 섹션 뒤에 추가
2. 확장 섹션은 모두 선택(optional) — 기존 DESIGN.md만으로도 유효
3. 사람이 읽고 AI가 파싱 가능한 마크다운 구조 유지

## 🚫 Out of Scope

- 디자인 토큰 JSON 파일 실제 생성 (spec-1-003에서 다룸)
- React 프로젝트 셋업 (spec-1-002에서 다룸)
- Style Dictionary 파이프라인 구성 (spec-1-003에서 다룸)
- 페이지 카탈로그 상세 정의 (Phase 3에서 다룸)

## ✅ Definition of Done

- [ ] 66개 레퍼런스 분석 보고서 작성 (`specs/spec-1-001-design-md-schema/report.md`)
- [ ] 확장 Schema 문서 작성 (`schema/design-md-schema.md`)
- [ ] 기존 레퍼런스 1개를 확장 Schema로 변환한 샘플 존재
- [ ] `walkthrough.md`와 `pr_description.md` 작성 및 archive commit
- [ ] `spec-1-001-design-md-schema` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
