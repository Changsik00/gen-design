# Task List: spec-7-06

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + 라우터 / NAV 갱신

- [x] `git checkout -b spec-7-06-studio-reorg` (base: `phase-7-design-md`)
- [ ] `studio/src/lib/router.ts` 갱신
  - `StudioRoute` 타입에 `spec`, `new`, `design` 추가
  - `ROUTE_PATHS` 갱신 (spec/new/design/tokens/export)
  - `parseHash` redirect 맵: `blueprint→new`, `editor→design`, `preview→spec`
  - fallback 기본 라우트: `spec`
- [ ] 단위 테스트 (`router.ts` 기존 테스트 통과 + 신규 3 case: redirect blueprint, redirect editor, new fallback)
- [ ] `studio/src/components/layout/StudioLayout.tsx` NAV_ITEMS 갱신
  - `[Spec Editor, New Spec, Design MD, Tokens, Export]`
- [ ] `studio/src/App.tsx` 라우트 연결 갱신
  - `spec → SpecEditorPage (placeholder)`, `new → BlueprintPage`, `design → EditorPage`
  - `preview` 라우트 제거 (redirect 처리)
- [ ] Commit: `feat(spec-7-06): router + nav 재구성 (spec/new/design 라우트)`

---

## Task 2: useCompileResult hook

- [ ] `studio/src/features/spec-editor/useCompileResult.ts`
  - `useCompileResult(text, debounceMs=300)` → `{ reactTree, paperHtml, tsxContent, errors }`
  - 300ms debounce → `parse` → `buildReactTree` + `compileToPaper` + `compileToReact`
  - 각 단계 에러 수집
- [ ] 단위 테스트 `__tests__/useCompileResult.test.ts` — 4 case:
  - 정상 spec.md → reactTree 비어있지 않음
  - 빈 입력 → 빈 결과 (에러 없음)
  - 파싱 에러 → errors 배열에 포함
  - debounce: 짧은 시간 내 여러 호출 → 마지막 결과만 반영
- [ ] Commit: `feat(spec-7-06): useCompileResult hook (debounce + compile pipeline)`

---

## Task 3: SpecEditorPage 레이아웃 + 기본 패널

- [ ] `studio/src/features/spec-editor/index.tsx` — SpecEditorPage
  - 3-panel 레이아웃: 좌(textarea) / 우상(React preview) / 우하(Paper iframe)
  - `useCompileResult` 연결
- [ ] `studio/src/features/spec-editor/SpecTextEditor.tsx` — textarea + 글자 수 표시
- [ ] `studio/src/features/spec-editor/ReactPreviewPanel.tsx` — `reactTree` React children 렌더
- [ ] `studio/src/features/spec-editor/PaperPreviewPanel.tsx` — `<iframe srcDoc={paperHtml}>`
- [ ] `studio/src/features/spec-editor/ErrorPanel.tsx` — errors 배열 → 에러 메시지 목록
- [ ] App.tsx 에서 `SpecEditorPage` 연결
- [ ] Commit: `feat(spec-7-06): SpecEditorPage — 3-panel 레이아웃 + dual preview`

---

## Task 4: Paper inference import 패널

- [ ] `studio/src/features/spec-editor/PaperImportPanel.tsx`
  - "Import from Paper" 버튼 → JSON textarea 슬라이드 오픈/닫기
  - "Infer" 버튼 → JSON parse → `inferSpec(tree, catalogMap)` → `text` 반환
  - 신뢰도 배지: `confident N / confirm N / unknown N`
  - 결과 text → `onResult(text)` 콜백으로 편집기에 전달
  - catalog.json 없으면 빈 CatalogMap fallback
- [ ] 단위 테스트 `__tests__/PaperImportPanel.test.ts` — 3 case:
  - 유효 JSON → spec.md 텍스트 반환
  - 잘못된 JSON → 에러 메시지 표시
  - 빈 트리 → 빈 spec.md 반환 (에러 없음)
- [ ] Commit: `feat(spec-7-06): PaperImportPanel — Paper tree JSON → spec.md 자동 생성`

---

## Task 5: "Download TSX" 버튼 + 회귀 테스트

- [x] SpecEditorPage 헤더에 "Download TSX" 버튼 추가
  - `compileToReact(text).tsx` → Blob 다운로드 (`<a download>`)
  - 에러 시 버튼 비활성화
- [ ] `pnpm --filter studio test` 전체 회귀 PASS 확인
- [ ] Commit: `feat(spec-7-06): Download TSX 버튼 + 회귀 테스트 통과`

---

## Task 6: Ship

- [ ] `pnpm --filter studio test` 전체 PASS
- [ ] **수동 통합 검증** (golden path):
  1. `pnpm dev` → `http://localhost:5173` → `#/spec` 기본 진입
  2. `<Button variant="primary" />` 입력 → React preview Button 렌더 확인
  3. Paper HTML iframe 에 Paper 스타일 Button 확인
  4. "Import from Paper" JSON paste → 편집기 삽입 확인
  5. `#/blueprint` → `#/new` redirect 확인
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit + Push + PR 생성** (spec → `phase-7-design-md`)
- [ ] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 |
| **예상 commit 수** | 6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |

## 위험 / 주의

- **React preview 범위 제한**: COMPONENT_REGISTRY 에 등록된 컴포넌트만 렌더. 미등록 컴포넌트는 `null` 또는 fallback 표시.
- **catalog.json 미존재**: spec-7-01 산출물이 아직 없을 수 있음. 빈 Map fallback 으로 degraded 동작.
- **UI 테스트 한계**: React 컴포넌트 렌더 검증은 vitest + jsdom 으로 가능하나, Paper HTML iframe 렌더는 수동 확인 필요.
