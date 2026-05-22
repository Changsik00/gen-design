# Walkthrough: spec-7-06

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| React preview 렌더 방식 | compileToReact 출력 eval vs buildReactTree | **buildReactTree (기존)** | 정적 JSX 문자열을 브라우저에서 eval 하는 것은 보안·복잡도 위험. buildReactTree 로 React children 직접 렌더가 안전하고 이미 구현되어 있음 |
| catalog.json 로딩 | 동기 import vs 빈 Map fallback | **빈 Map fallback** | catalog.json (spec-7-01 산출물) 이 아직 없음. 빈 Map 으로도 컴포넌트 이름 매칭은 가능, axis 추론만 제한 |
| backward-compat | 새 라우트만 유지 vs redirect 맵 | **redirect 맵 (parseHash 내)** | #/blueprint, #/editor, #/preview 북마크 사용자 보호. router.ts 에 REDIRECTS 상수로 명시 |
| PaperImportPanel catalog | dynamic import vs 정적 import | **정적 import (inferSpec + EMPTY_CATALOG)** | dynamic import 는 비동기 처리 복잡도 증가. MVP 에서는 빈 catalog Map 으로 충분 |
| "Download TSX" 구현 위치 | 별도 패널 vs 헤더 버튼 | **헤더 버튼** | 단순. Blob + a.click() 패턴으로 브라우저 다운로드 |

## 💬 사용자 협의

- **주제**: spec-7-06 아키텍처 설명 및 Plan Accept
  - 라우트 재구성 (spec/new/design/tokens/export) 과 dual preview 방식 설명 후 Plan Accept

## 🧪 검증 결과

### 단위 테스트

| 파일 | 테스트 수 | 결과 |
|---|:---:|:---:|
| `router.test.ts` | 11 | ✅ PASS |
| `useCompileResult.test.ts` | 4 | ✅ PASS |
| `PaperImportPanel.test.tsx` | 3 | ✅ PASS |
| `app-smoke.test.tsx` | 10 | ✅ PASS |

### 전체 회귀

- **결과**: ✅ **630 tests PASS** (93 test files) — 신규 18개 포함

### 수동 통합 검증 (golden path)

1. `pnpm dev` → `http://localhost:5173` → `#/spec` 기본 진입 ✅
2. `<Button variant="primary" />` 입력 → React preview 에 Button 렌더 ✅
3. Paper HTML iframe 에 Paper 스타일 Button 렌더 ✅
4. "Import from Paper" → simple tree JSON paste → Infer → 편집기에 spec.md 삽입 ✅
5. `#/blueprint` → `#/new` redirect (BlueprintWizard 렌더) ✅

## 🔍 발견 사항

- **React preview 에서 미등록 컴포넌트 무시**: COMPONENT_REGISTRY 에 없는 컴포넌트는 buildReactTree 가 무시(null 반환). 에러 메시지 없이 조용히 빈 공간이 됨 — 향후 "unknown component" 경고 추가 고려.
- **PaperImportPanel 의 inferSpec 결과**: 빈 catalog Map 이면 variant axis 추론 불가. 컴포넌트 이름 매칭(Levenshtein)은 동작하므로 기본 spec.md 는 생성됨.

## 🚧 이월 항목

- **catalog.json 연동**: spec-7-01 산출물이 완성되면 PaperImportPanel 에 catalog Map 연결
- **React preview 미등록 컴포넌트 경고 UI**
- **spec.md 로컬 스토리지 퍼시스트**: 새로고침 시 편집 내용 유지

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (claude-sonnet-4-6) + dennis |
| **작성 기간** | 2026-05-10 |
| **전체 테스트** | ✅ 630 tests PASS |
