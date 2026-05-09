# feat(spec-6-06): DESIGN.md 편집기 구현

## 요약

`studio/src/features/editor/` 에 DESIGN.md 9개 필수 섹션을 구조화된 폼으로 편집하는 `DesignEditor` 를 구현합니다.
실시간 마크다운 미리보기와 파일 다운로드 기능을 포함합니다.

## 변경 내용

### 신규 파일

| 파일 | 설명 |
|---|---|
| `features/editor/types.ts` | `DesignDocument` 인터페이스 + `ColorEntry` / `TypographyEntry` / `ElevationEntry` 서브타입 + `EMPTY_DOCUMENT` |
| `features/editor/generator.ts` | `generateDesignMd(doc)` — schema 9섹션 마크다운 출력 순수 함수 |
| `features/editor/__tests__/generator.test.ts` | 9개 단위 테스트 (섹션 헤딩, 색상/타이포/엘리베이션 포맷, Do/Don't, 빈 문서 안전성) |
| `features/editor/SectionNav.tsx` | 섹션 1~9 전환 내비게이션 |
| `features/editor/MarkdownPreview.tsx` | 실시간 `<pre>` 미리보기 + Blob 다운로드 버튼 |
| `features/editor/DesignEditor.tsx` | 3-열 레이아웃 오케스트레이터 (SectionNav / Form / Preview) |
| `features/editor/sections/Section1VisualTheme.tsx` | Textarea + Key Characteristics 동적 리스트 |
| `features/editor/sections/Section2Colors.tsx` | 색상 동적 테이블 (hex 칩 프리뷰) |
| `features/editor/sections/Section3Typography.tsx` | 폰트 입력 + 타이포 계층 동적 테이블 |
| `features/editor/sections/Section4Components.tsx` | Monospace Textarea |
| `features/editor/sections/Section5Layout.tsx` | Spacing Base / Grid Max Width 입력 + Textarea |
| `features/editor/sections/Section6Elevation.tsx` | 엘리베이션 동적 테이블 |
| `features/editor/sections/Section7DosDonts.tsx` | Do / Don't 리스트 쌍 |
| `features/editor/sections/Section8Responsive.tsx` | Textarea |
| `features/editor/sections/Section9AgentGuide.tsx` | Monospace Textarea |

### 수정 파일

| 파일 | 변경 |
|---|---|
| `features/editor/index.tsx` | stub Card → `<DesignEditor />` 교체 |
| `src/__tests__/app-smoke.test.tsx` | `#/editor` 테스트: stub 텍스트 → DesignEditor 기반 기대값 |

## 아키텍처

```
EditorPage
  └── DesignEditor
        ├── [상단] appName 입력 (파일명 + 마크다운 헤더)
        ├── [좌] SectionNav — 섹션 1~9 전환
        ├── [중] SectionForms — activeSection 기반 해당 폼 렌더
        └── [우] MarkdownPreview — generateDesignMd(doc) 실시간 + 다운로드
```

**상태**: `useState<DesignDocument>` 단일 루트 — Context/Zustand 없음
**미리보기**: `<pre>` raw markdown — 파서 의존성 없음
**다운로드**: `Blob + URL.createObjectURL` — 서버 없음

## 테스트

```
Test Files  40 passed (40)
Tests       232 passed (232)   ← 9 new generator tests
```

빌드: `✓ built in 180ms` (TypeScript 오류 0건)

## 스크린샷 시나리오

1. `#/editor` 진입 → 3-열 레이아웃 (SectionNav / Section 1 폼 / 미리보기 패널)
2. appName 입력 `"MyApp"` → 미리보기 헤더 `# MyApp — DESIGN.md` 실시간 갱신
3. Section 2 색상 추가 → hex 칩 + 불릿 미리보기 동시 표시
4. ⬇ 다운로드 → `DESIGN-MyApp.md` 파일 생성

## 체크리스트

- [x] 단위 테스트 PASS (232/232)
- [x] TypeScript 빌드 오류 없음
- [x] dogfooding: Card / Button / Input / Label 자체 컴포넌트 사용
- [x] walkthrough.md 작성
- [x] pr_description.md 작성
