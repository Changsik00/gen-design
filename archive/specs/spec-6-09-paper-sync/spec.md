# spec-6-09: Paper ↔ tokens 자동 동기화 PoC

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-6-09` |
| **Phase** | `phase-6` |
| **Branch** | `spec-6-09-paper-sync` |
| **상태** | Planning |
| **타입** | Research / PoC |
| **Integration Test Required** | no |
| **작성일** | 2026-05-09 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`studio/src/lib/paper-normalizer/` (spec-6-02) 는 Paper ↔ DESIGN.md 사이의 값 정규화 함수를 제공한다.
`templates/assets/tokens/tokens.json` 에 semantic 토큰이 `{primitive.xxx}` 참조 형식으로 정의되어 있다.
tokens.json 을 수정하면 CSS 변수가 자동 재생성(빌드)되지만, Paper 시안에는 수동 반영이 필요하다.

### 문제점

디자이너가 tokens.json 을 변경해도 Paper 시안의 색상/폰트/반경이 자동으로 업데이트되지 않는다. 현재는 직접 Paper 에서 값을 바꿔야 하며, 이는 DESIGN.md ↔ tokens.json ↔ Paper 삼자 동기화의 병목이다.

### 해결 방안 (PoC 목표)

`studio/src/lib/paper-sync/` 라이브러리를 구현하여:
1. **resolver**: `{primitive.xxx}` 참조를 실제 값으로 resolve
2. **converter**: resolve 된 토큰을 CSS 변수 레코드 + Paper `update_styles` 페이로드로 변환
3. **PoC 실행**: Paper MCP 도구로 실제 노드에 토큰 적용 테스트
4. **Go/No-Go 보고서**: 실현 가능성 평가 + phase-7 이월 여부 결정

## 🎯 요구사항

### Functional Requirements

1. `resolver.ts`: 재귀적 `{xxx.yyy}` 참조 해소 → `Record<string, string>` (CSS 변수명 → 실제 값)
2. `converter.ts`: 해소된 토큰 → `PaperStylePayload[]` (nodePattern + styles Record)
3. PoC 실행: Paper MCP 도구(`get_basic_info`, `update_styles`, `get_screenshot`)로 토큰 적용 검증
4. `poc-report.md`: 실행 결과, 한계점, Go/No-Go 결론 문서화

### Non-Functional Requirements

1. 단위 테스트: resolver + converter 핵심 로직 커버리지
2. 기존 `paper-normalizer` 와 독립 — import 하지 않음 (별도 라이브러리)

## 🚫 Out of Scope

- CI 자동화 파이프라인 (phase-7 이월 대상)
- 전체 Paper 파일의 모든 노드 자동 매핑
- Paper MCP 가 비활성 상태일 경우 PoC 실행 스킵 허용

## ✅ Definition of Done

- [ ] 단위 테스트 PASS (`pnpm --filter studio test`)
- [ ] `poc-report.md` 작성 (Go/No-Go 결론 포함)
- [ ] walkthrough.md 와 pr_description.md 작성 및 ship commit
- [ ] spec-6-09-paper-sync 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
