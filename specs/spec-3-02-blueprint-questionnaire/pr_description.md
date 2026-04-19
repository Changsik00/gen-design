# docs(spec-3-02): Blueprint 질의서 프로토콜 설계

## 📋 Summary

### 배경 및 목적

spec-3-01에서 페이지 카탈로그가 완성되었지만, 특정 앱에 맞는 페이지 조합을 선택하는 프로세스가 없었다. AI 에이전트가 사용자에게 체계적으로 질문하여 앱 요구사항을 도출하고, REQUIREMENTS.md로 자동 변환하는 프로토콜을 설계했다.

### 주요 변경 사항

- [x] 3단계 질의서 프로토콜 정의 (앱 유형 → 페이지 구성 → 커스터마이징)
- [x] 각 단계의 질문/선택지/기본값/처리 규칙 구조화
- [x] REQUIREMENTS.md 매핑 규칙 정의 (질의 데이터 → 문서 구조 변환)
- [x] Template 매핑 표 자동 생성 규칙 정의

### Phase 컨텍스트

- **Phase**: `phase-3` (App Blueprint)
- **본 SPEC의 역할**: page-catalog.md를 활용한 앱 기획 프로세스 정의. spec-3-003 템플릿의 입력 데이터 구조 확립

## 🎯 Key Review Points

1. **3단계 질의 흐름**: 질문이 과하지 않으면서 충분한 정보를 수집하는지
2. **REQUIREMENTS.md 출력 구조**: 실제 프로젝트에서 사용하기에 실용적인지

## 🧪 Verification

문서 전용 Spec — 코드 변경 없음.

### 수동 검증

1. ✅ 3단계 프로토콜 구조 완성
2. ✅ page-catalog.md ID 체계와 일관
3. ✅ REQUIREMENTS.md 매핑 규칙 + 출력 예시 포함

## 📦 Files Changed

- 🆕 `schema/blueprint-protocol.md`: Blueprint 질의서 프로토콜 (320 lines)

**Total**: 1 file changed

## ✅ Definition of Done

- [x] 질의서 프로토콜 문서 완성 (3단계 구조)
- [x] 각 단계의 질문/선택지/기본값 정의
- [x] REQUIREMENTS.md 매핑 규칙 정의
- [x] Template 매핑 표 생성 규칙 정의
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료

## 🔗 관련 자료

- Phase: `backlog/phase-3.md`
- Walkthrough: `specs/spec-3-02-blueprint-questionnaire/walkthrough.md`
- 참조: `schema/page-catalog.md`
