# feat(spec-7-01): vocabulary & formats — 4 축 어휘 정합 foundation

## 📋 Summary

### 배경 및 목적

phase-7 의 모든 spec (7-02 grammar / 7-03 Paper compiler / 7-04 React compiler / 7-05 Figma adapter / 7-06 Paper inference / 7-07 Studio reframe) 의 *foundation*. 4 축 어휘 정합 (spec.md = Paper = React = LLM) 과 표준 형식 호환 (Stitch superset / DTCG / shadcn registry) 의 ground truth 를 *자동 추출 파이프라인* 으로 구축.

### 주요 변경 사항
- [x] `studio/src/lib/vocabulary/` 신규 라이브러리 (extractor + catalog + render + validators)
- [x] cva AST 추출기 + manual fallback plugin (TypeScript compiler API)
- [x] 3-tier 카탈로그 자동 생성 (ARIA 78 + shadcn ui 8 + composites 20 + templates 6 = 28 components)
- [x] spec.md JSON Schema 자동 생성 (4 layer 어휘 + raw 값 금지 lint ground)
- [x] shadcn registry-item.json + DTCG 1.0 strict ajv 검증기
- [x] TOKEN.md / FRONT.md / DESIGN.md 자동 렌더러 + Stitch 0.1 subset export
- [x] CLI: `pnpm --filter studio vocab` / `vocab:check` (CI drift detect)
- [x] 회귀 lint (committed catalog ↔ live extraction 비교)

### Phase 컨텍스트
- **Phase**: `phase-7` (DESIGN.md 4 축 어휘 + 컴파일러)
- **본 SPEC 의 역할**: 모든 후속 spec 의 입력 — catalog.json + spec-schema.json + FRONT.md / TOKEN.md / DESIGN.md

## 🎯 Key Review Points

1. **ADR-004 의 모든 의사결정 (D-1 ~ D-6) 이 그대로 구현됨**:
   - D-1: 로컬 .tsx ground truth (cva AST) — `extractor/plugins/cva-plugin.ts`
   - D-2: 자동 추출 파이프라인 (수동 작성 0) — CLI + 회귀 lint
   - D-3: 4 layer variant — `catalog/spec-schema.ts` 의 oneOf + tokens prop
   - D-4: raw 값 금지 lint — schema 의 stringNoRawColor + tokens 참조 패턴
   - D-5 (a~d): theme nesting / axis enum / inline scope / 등재 마법사 (Studio 7-07)
   - D-6: 컴파일러 출력 = shadcn registry-item.json (validator 보유)
2. **자동 추출 파이프라인 entry-to-end 작동**:
   - `pnpm --filter studio vocab` → 6 산출물 일괄 생성
   - `pnpm --filter studio vocab:check` → CI 진입점 (drift exit 1)
3. **회귀 lint** — committed catalog/spec-schema 가 live extraction 과 *항상 일치* 강제. 코드 변경 시 vocab 재실행 필수.
4. **plugin 가능 설계** — cva 외 패턴 (data-state / render-prop / slot / tw-variants) 향후 plugin 추가만으로 흡수.
5. **Stitch DESIGN.md 명칭 + superset** — 사용자 결정 (인지도 가치) 그대로 구현. Stitch CLI 호환 subset export 별도 함수.
6. **tokens.json 은 *이미 DTCG 호환* 이었음** — 의미 변경 0, schema validator 의 root metadata 허용만 갱신.

## 🧪 Verification

### 자동 테스트
```bash
pnpm --filter studio test           # 351/351 PASS
pnpm --filter studio run build      # production 빌드 성공
pnpm --filter studio vocab          # 6 산출물 생성
pnpm --filter studio vocab:check    # drift 0 확인
```

**결과 요약**:
- ✅ vocabulary 자체 73 신규 case
- ✅ studio 전체 56 files / 351 tests PASS (회귀 0)
- ✅ vite production build 성공 (183ms, +5kb gzip 증가만)
- ✅ CLI 6 산출물 모두 deterministic

### 수동 검증 시나리오
1. **CLI 동작**: `pnpm vocab` → catalog.json (28 components + 78 ARIA roles) + spec-schema.json + 4 .md 파일 생성
2. **Drift 감지**: button.tsx 수정 → vocab:check 실패 → vocab 재실행 → check PASS 회복
3. **Stitch subset export 검증**: DESIGN.stitch.md 의 frontmatter `schema: stitch-design-md/0.1`, §10 이후 제거 확인
4. **DTCG validator**: 기존 tokens.json 검증 PASS (참조 해소 + schema 둘 다)
5. **shadcn registry validator**: 가짜 registry-item.json fixture 8 case 정확 PASS/FAIL

## 📦 Files Changed

### 🆕 New Files
**라이브러리 코어**:
- `studio/src/lib/vocabulary/index.ts` (re-export)
- `studio/src/lib/vocabulary/validators/{shadcn-registry,dtcg}.ts` + schemas/
- `studio/src/lib/vocabulary/extractor/index.ts` + plugins/{types,cva-plugin,manual-plugin}.ts
- `studio/src/lib/vocabulary/catalog/{index,tier1-aria,spec-schema}.ts`
- `studio/src/lib/vocabulary/render/{token-md,front-md,design-md,stitch-export}.ts`

**CLI + 정적 데이터**:
- `studio/scripts/extract-vocabulary.ts`
- `data/aria-roles.json` (78 ARIA 1.3 roles)

**자동 생성 산출물 (수동 편집 금지)**:
- `studio/src/lib/vocabulary/catalog/catalog.json`
- `studio/src/lib/vocabulary/catalog/spec-schema.json`
- `templates/FRONT.md`, `templates/TOKEN.md`, `templates/DESIGN.md`, `templates/DESIGN.stitch.md`

**Spec 산출물**:
- `specs/spec-7-01-vocabulary-and-formats/{spec,plan,task,walkthrough,pr_description}.md`

**테스트 (73 신규 case)**:
- `studio/src/lib/vocabulary/{validators,catalog,extractor,render}/__tests__/*.test.ts`
- `studio/src/lib/vocabulary/__tests__/{tokens-dtcg-compliance,regression}.test.ts`

### 🛠 Modified Files
- `studio/package.json`: `vocab`/`vocab:check` 스크립트 + ajv/ajv-formats/tsx/@types/node 의존성
- `studio/tsconfig.app.json`: `types` 에 `"node"` 추가 (vocab CLI 의 node:fs/path)
- `backlog/phase-7.md`: spec 표 spec-7-01 등재 (sdd 자동)
- `backlog/queue.md`: active spec 갱신 (sdd 자동)
- `pnpm-lock.yaml`

**Total**: 30+ files changed (대부분 신규 — vocabulary lib + CLI + 자동 생성 산출물)

## ✅ Definition of Done

- [x] vocab-extract 추출기 동작 + 단위 테스트 73/73 PASS
- [x] 3-tier 카탈로그 JSON 생성 (ARIA + shadcn + composites/templates 28 components)
- [x] FRONT.md / TOKEN.md / DESIGN.md 자동 렌더 + 사람-검수 통과
- [x] DESIGN.md 의 Stitch subset export 함수 + 단위 테스트 (Stitch CLI 환경 부재로 schema 정합 manual)
- [x] tokens.json 이 DTCG 1.0 strict 호환 (validator PASS)
- [x] shadcn registry-item.json validator + 단위 테스트
- [x] 카탈로그 ↔ 실 코드 회귀 lint (vocab:check + vitest regression test)
- [x] 기존 studio 단위 테스트 351/351 PASS (회귀 0)
- [x] walkthrough.md / pr_description.md ship + main PR (spec → phase-7-design-md)

## 🔗 관련 자료

- ADR-004: 어휘 추출 + 4 layer variant — 본 spec 의 *결정 ground*
- vision.md: 4 축 어휘 정합 + 6 결정
- benchmark.md: shadcn registry / DTCG / Stitch DESIGN.md / Markdoc 등 시장 분석
- phase-7.md: 7 spec 구조 — 본 spec 은 spec-7-02~07 의 ground

## 🎬 다음 spec

- **spec-7-02** (grammar): 본 spec 의 `spec-schema.json` 을 lint ground 로 사용. PEG / Markdoc 채택 결정 후 진행.
