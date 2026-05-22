# Walkthrough: spec-6-08 — 산출물 내보내기

## 실행 로그

### Task 1: 브랜치 + TDD Red

`types.ts` — `ExportConfig` / `DEFAULT_CONFIG` / `APP_TYPES` (6종) / `PACKAGE_MANAGERS` (3종) / `FILE_TABS` (4종).

`generators.test.ts` — 14개 테스트 (Red):
- `generateDesignMdTemplate`: appName, 9개 섹션 헤딩
- `generateRequirementsMdTemplate`: appName, appType, techStack, NFR 섹션
- `generateAgentMd`: appName, techStack, packageManager, Layer 규칙
- `generateTokensJson`: 유효한 JSON, semantic.color, primitive 키

```
Test Files  1 failed (../generators 없음)
```

Commit: `test(spec-6-08): add failing generator tests`

---

### Task 2: Generators 구현 (TDD Green)

`generators.ts` — 4개 순수 함수:

| 함수 | 핵심 내용 |
|---|---|
| `generateDesignMdTemplate(config)` | schema 9섹션 skeleton, appName 헤더, TODO placeholder |
| `generateRequirementsMdTemplate(config)` | 메타 테이블, NFR 기본 테이블, 페이지 placeholder |
| `generateAgentMd(config)` | 프로젝트 개요 테이블, 3-Layer 아키텍처 규칙, 디렉토리 구조 |
| `generateTokensJson()` | `templates/assets/tokens/tokens.json` static import → JSON.stringify |

```
Test Files  42 passed (42)
Tests       258 passed (258)   ← 14 new generator tests
```

Commit: `feat(spec-6-08): implement export generators`

---

### Task 3: ExportPanel UI + stub 교체

`ExportConfigForm.tsx`:
- appName Input + appType Select + techStack Input + packageManager Select
- `@base-ui/react/select` composable 패턴: `Select > SelectTrigger > SelectValue + SelectPopup > SelectItem`

`FileTabList.tsx`:
- 4개 탭 버튼 (DESIGN.md / REQUIREMENTS.md / AGENT.md / tokens.json)
- 활성 탭 내용을 `<pre>` 블록으로 표시
- 개별 "⬇ {label}" 다운로드 버튼 (Blob + URL.createObjectURL)

`ExportPanel.tsx`:
- 2열 레이아웃: 좌(ExportConfigForm + 모두 다운로드) / 우(FileTabList)
- `generateXxx(config)` 4개 실시간 호출 → `contents` 레코드
- "⬇ 모두 다운로드" → 200ms 간격 순차 Blob 다운로드

`index.tsx` stub 교체 → `<ExportPanel />`

`app-smoke.test.tsx` 갱신:
- `#/export`: "Export" 텍스트 → `getByText("프로젝트 설정")` + `getByText("파일 미리보기")`

```
Tests  258 passed (258)
```

빌드 오류 수정: `Select` 컴포넌트에 `options` prop 없음 → composable `SelectTrigger / SelectPopup / SelectItem` 패턴으로 교체.

Commits:
- `feat(spec-6-08): wire up ExportPanel and replace stub`
- `fix(spec-6-08): fix Select composable API usage in ExportConfigForm`

---

## 빌드 검증

```
dist/assets/index-BJ-TMX-r.js  465.22 kB │ gzip: 148.33 kB
✓ built in 186ms  (TypeScript 오류 0건)
```

## 최종 테스트

```
Test Files  42 passed (42)
Tests       258 passed (258)
```

## 산출물 목록

| 파일 | 역할 |
|---|---|
| `features/export/types.ts` | ExportConfig + APP_TYPES + FILE_TABS |
| `features/export/generators.ts` | 4개 순수 생성 함수 |
| `features/export/__tests__/generators.test.ts` | 14개 단위 테스트 |
| `features/export/ExportConfigForm.tsx` | 프로젝트 설정 폼 |
| `features/export/FileTabList.tsx` | 4탭 파일 미리보기 + 개별 다운로드 |
| `features/export/ExportPanel.tsx` | 2열 레이아웃 오케스트레이터 + 모두 다운로드 |
| `features/export/index.tsx` | stub → ExportPanel export |
| `src/__tests__/app-smoke.test.tsx` | #/export 테스트 갱신 |
