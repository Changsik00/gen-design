# Walkthrough: spec-6-06 — DESIGN.md 편집기

## 실행 로그

### Task 1: 브랜치 생성 + TDD Red

```
git checkout -b spec-6-06-editor
# (phase-6-studio-v1 베이스)
```

`types.ts` 작성 — `DesignDocument` 인터페이스 (9섹션 대응):
- `ColorEntry` / `TypographyEntry` / `ElevationEntry` 서브타입
- `EMPTY_DOCUMENT` 초기값 상수

`generator.test.ts` 작성 — 9개 테스트 (Red):
- 섹션 헤딩 9개 포함 / appName 헤더 / 색상 불릿 / 타이포 테이블 / 엘리베이션 테이블 / Do+Don't / Key Characteristics / 빈 문서 안전성

```
Test Files  1 failed (generator.test.ts — ../generator 없음)
```

Commit: `test(spec-6-06): add failing generator tests`

---

### Task 2: Generator 구현 (TDD Green)

`generator.ts` — `generateDesignMd(doc: DesignDocument): string` 순수 함수:
- Section 1: atmosphere 텍스트 + Key Characteristics 불릿
- Section 2: 색상 불릿 (`**Name** (\`hex\`): \`--var\`. usage`)
- Section 3: 폰트 패밀리 + 타이포 계층 테이블
- Section 4~5: Textarea 내용 + 레이아웃 입력
- Section 6: 엘리베이션 `| Level | Treatment | Use |` 테이블
- Section 7: Do / Don't 리스트
- Section 8~9: Textarea 내용
- 빈 섹션에는 placeholder 삽입 (오류 없음)

```
Test Files  40 passed (40)  ← 9 new + 223 existing = 232 tests
Tests       232 passed (232)
```

Commit: `feat(spec-6-06): implement generateDesignMd generator`

---

### Task 3: Section 폼 컴포넌트 1~5

| 파일 | 핵심 UX |
|---|---|
| `Section1VisualTheme.tsx` | Textarea (분위기) + Key Characteristics 동적 리스트 |
| `Section2Colors.tsx` | ColorRow: hex 칩 프리뷰 + name/cssVar/usage 입력 |
| `Section3Typography.tsx` | Primary/Mono 폰트 입력 + 계층 테이블 행 추가/삭제 |
| `Section4Components.tsx` | Monospace Textarea (자유 마크다운) |
| `Section5Layout.tsx` | Spacing Base + Grid Max Width 입력 + Textarea |

모든 컴포넌트 dogfooding: `Card` / `Button` / `Input` / `Label` 자체 컴포넌트 사용.

```
Test Files  40 passed (40)
Tests       232 passed (232)
```

Commit: `feat(spec-6-06): implement section forms 1-5`

---

### Task 4: Section 폼 컴포넌트 6~9

| 파일 | 핵심 UX |
|---|---|
| `Section6Elevation.tsx` | ElevationRow: level/treatment/use 동적 테이블 |
| `Section7DosDonts.tsx` | Do 리스트 + Don't 리스트 (각 추가/삭제 독립) |
| `Section8Responsive.tsx` | Textarea (브레이크포인트 등 자유 기술) |
| `Section9AgentGuide.tsx` | Monospace Textarea (AI 프롬프트 레퍼런스) |

```
Test Files  40 passed (40)
Tests       232 passed (232)
```

Commit: `feat(spec-6-06): implement section forms 6-9`

---

### Task 5: DesignEditor 통합 + index.tsx 교체

`SectionNav.tsx`:
- 섹션 1~9 목록. 활성 섹션 `secondary` 배리언트 버튼.
- 필수 섹션에 ✅ 표시.

`MarkdownPreview.tsx`:
- `generateDesignMd(doc)` 실시간 호출 → `<pre>` 렌더링
- "⬇ 다운로드" 버튼 → `Blob + URL.createObjectURL` → `DESIGN-{appName}.md`

`DesignEditor.tsx`:
- 상단 `appName` 입력 (파일명 + 마크다운 헤더)
- 3-열 레이아웃: SectionNav (좌) / SectionForm 현재 섹션 (중) / MarkdownPreview (우)
- `useState<DesignDocument>(EMPTY_DOCUMENT)` — 모든 상태 소유
- `SectionForm` 스위치: `activeSection` 기반 해당 Section 컴포넌트 렌더

`index.tsx` stub 교체:
- 이전: "DESIGN.md Editor" 텍스트만 있는 Card
- 이후: `<DesignEditor />` 전체 화면

`app-smoke.test.tsx` 갱신:
- `#/editor` 테스트: `getByText("DESIGN.md Editor")` → `getByText("앱 이름")` + `getByText("DESIGN.md 미리보기")`

```
Test Files  40 passed (40)
Tests       232 passed (232)
```

Commit: `feat(spec-6-06): wire up DesignEditor and replace stub`

---

## 빌드 검증

```
pnpm --filter studio run build

vite v8.0.10 building client environment for production...
✓ 2050 modules transformed.
dist/assets/index-DdM2zjdk.css    52.34 kB │ gzip:  9.71 kB
dist/assets/index-C4ecHYX2.js   355.85 kB │ gzip: 111.21 kB
✓ built in 180ms
```

TypeScript 오류 0건.

## 최종 테스트

```
Test Files  40 passed (40)
Tests       232 passed (232)
```

## 산출물 목록

| 파일 | 역할 |
|---|---|
| `features/editor/types.ts` | DesignDocument 타입 + EMPTY_DOCUMENT |
| `features/editor/generator.ts` | generateDesignMd 순수 함수 |
| `features/editor/__tests__/generator.test.ts` | 9개 단위 테스트 |
| `features/editor/SectionNav.tsx` | 섹션 1~9 내비게이션 |
| `features/editor/MarkdownPreview.tsx` | 실시간 미리보기 + 다운로드 |
| `features/editor/DesignEditor.tsx` | 메인 오케스트레이터 |
| `features/editor/sections/Section1~9.tsx` | 9개 섹션 폼 컴포넌트 |
| `features/editor/index.tsx` | stub → DesignEditor export |
| `src/__tests__/app-smoke.test.tsx` | #/editor 테스트 갱신 |
