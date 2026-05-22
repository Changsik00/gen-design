# feat(spec-6-08): 산출물 내보내기 구현

## 요약

`studio/src/features/export/` 에 4종 파일 템플릿 생성 + 탭 미리보기 + 다운로드 UI 를 구현합니다.
프로젝트 기본 정보(앱 이름/유형/기술 스택)를 입력하면 DESIGN.md · REQUIREMENTS.md · AGENT.md · tokens.json 템플릿이 실시간으로 생성되고, 개별 또는 일괄 다운로드할 수 있습니다.

## 변경 내용

### 신규 파일

| 파일 | 설명 |
|---|---|
| `features/export/types.ts` | `ExportConfig` / `APP_TYPES` / `FILE_TABS` + 관련 상수 |
| `features/export/generators.ts` | `generateDesignMdTemplate` / `generateRequirementsMdTemplate` / `generateAgentMd` / `generateTokensJson` 4개 순수 함수 |
| `features/export/__tests__/generators.test.ts` | 14개 단위 테스트 |
| `features/export/ExportConfigForm.tsx` | appName / appType / techStack / packageManager 폼 |
| `features/export/FileTabList.tsx` | 4탭 파일 미리보기 + 개별 Blob 다운로드 |
| `features/export/ExportPanel.tsx` | 2열 레이아웃 오케스트레이터 + 모두 다운로드 |

### 수정 파일

| 파일 | 변경 |
|---|---|
| `features/export/index.tsx` | stub → `<ExportPanel />` 교체 |
| `src/__tests__/app-smoke.test.tsx` | `#/export` 테스트 갱신 |

## 아키텍처

```
ExportPage
  └── ExportPanel
        ├── [좌] ExportConfigForm + "모두 다운로드"
        └── [우] FileTabList
              ├── DESIGN.md 탭  → generateDesignMdTemplate(config)
              ├── REQUIREMENTS.md 탭 → generateRequirementsMdTemplate(config)
              ├── AGENT.md 탭  → generateAgentMd(config)
              └── tokens.json 탭 → generateTokensJson()
```

**다운로드**: Blob + URL.createObjectURL (ZIP 라이브러리 없음). "모두 다운로드"는 200ms 간격 순차 트리거.

## 테스트

```
Test Files  42 passed (42)
Tests       258 passed (258)   ← 14 new export generator tests
```

빌드: `✓ built in 186ms` (TypeScript 오류 0건)

## 체크리스트

- [x] 단위 테스트 PASS (258/258)
- [x] TypeScript 빌드 오류 없음
- [x] dogfooding: Card / Button / Input / Label / Select 자체 컴포넌트 사용
- [x] walkthrough.md 작성
- [x] pr_description.md 작성
