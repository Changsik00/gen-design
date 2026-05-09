# Walkthrough: spec-7-01

> phase-7 의 *foundation* spec — 4 축 어휘 정합 + 표준 형식 호환의 ground.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 어휘 ground truth 출처 | (a) 외부 fetch (registry/MCP) / (b) 로컬 .tsx AST | **(b)** | shadcn 철학 *files live in your repo* + portable + version drift 자동 감지 (ADR-004 D-1) |
| 추출기 plugin 설계 | (a) cva 전용 / (b) plugin 인터페이스 + cva-plugin / (c) 모든 패턴 한 번에 | **(b)** | NFR-1 + 향후 data-state / render-prop / slot 확장 가능. 본 spec 은 cva-plugin + manual-plugin 만 |
| composites/templates 처리 (cva 없음) | (a) extractor 가 빈 결과 / (b) manual-plugin fallback | **(b)** | Tier 3 컴포넌트도 카탈로그에 등재되어야 spec.md 어휘로 사용 가능 |
| TOKEN.md / FRONT.md 템플릿 라이브러리 | (a) handlebars / (b) 자체 join | **(b)** | 의존성 ↓, 26 컴포넌트 규모는 자체 템플릿으로 충분 |
| Stitch DESIGN.md 명칭 처리 | (a) superset / (b) export adapter / (c) 이름 변경 | **(a)** | 사용자 명시 결정 (인지도 가치 ↑). 본 프로젝트 = Stitch 9 섹션 + §10~12 확장 |
| tokens.json DTCG 정렬 | (a) 의미 변경 + 정렬 / (b) 형식만 정렬 + 의미 0 변경 | **(b)** | 기존 tokens.json 이 *이미 DTCG 1.0 strict 호환*. validator schema 의 root metadata 허용만 추가 |
| catalog/spec-schema/templates 의 git 보관 | (a) gitignore (build artifact) / (b) commit (회귀 lint ground) | **(b)** | committed 상태 ↔ live extraction 비교가 회귀 lint. CI 가 vocab:check 로 drift detect |
| CLI path 처리 | (a) 절대 경로 / (b) 상대 경로 (process.chdir + "src") | **(b)** | catalog.json 의 filePath 가 portable. 다른 머신에서도 회귀 lint PASS |

## 💬 사용자 협의

- **주제**: phase-7 spec 1 시작 직전 *어휘 출처* 질문 — "shadcn 어법을 어떻게 알아? 데이터 공개? MCP? 추출?"
  - **합의**: 4 path 모두 활용, 로컬 .tsx 우선 (P1) + 외부 검증 (P2/P3) + 정적 ARIA (P4). ADR-004 D-1 으로 명문화.
- **주제**: variant 의 4 layer (명명 / 다축 / theme / 인라인 토큰)
  - **사용자 표현**: "button primary-color 이런거 말야"
  - **합의**: 4 layer 모두 grammar 차원에서 허용 + raw 값 금지 lint. ADR-004 D-3, D-4.
- **주제**: phase-6 자산 폐기 vs 재해석
  - **사용자 의견**: "지금까지 한 걸 완전 폐기 하고 새로 해도 상관없어"
  - **합의**: 정직 평가 결과 *재해석 우선*. composites/templates/paper-normalizer/paper-sync 모두 phase-7 컴파일러의 building block. vision.md 명시.
- **주제**: Stitch DESIGN.md 명칭 충돌
  - **사용자 결정**: 명칭 유지 — "DESIGN.md 라고 하면 누구나 아~ 그건 그런거"
  - **합의**: superset 채택. ADR-004 D-1.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm --filter studio test`
- **결과**: ✅ Passed (56 files / 351 tests / 4.47s) — vocabulary 자체 73 case 추가
- **로그 요약**:
```text
RUN  v4.1.5 /Users/dennis/Project/Design/studio
Test Files  56 passed (56)
     Tests  351 passed (351)
```

#### 빌드
- **명령**: `pnpm --filter studio run build`
- **결과**: ✅ Passed — token CSS + tsc -b + vite production (183ms)

#### CLI 동작
- **명령**: `pnpm --filter studio vocab` / `vocab:check`
- **결과**: ✅ 6 산출물 생성 (catalog/spec-schema/FRONT/TOKEN/DESIGN/Stitch subset). check 모드 drift 0.

### 2. 수동 검증

1. **catalog.json 내용 검사** — Tier 1 (78 ARIA), Tier 2 (8 shadcn ui), Tier 3 (20 composites + 6 templates) 모두 정확. axes 추출 (Button 의 6 variant + 8 size 등) 정합.
2. **FRONT.md 사람-가독성** — 4 layer 설명, ARIA 카테고리별 표시, default 강조, Paper 컨벤션 명시 모두 OK.
3. **DESIGN.md Stitch 9 섹션** — Overview/Colors/Typography/Layout/Elevation/Shapes/Components/Dos-Donts/Iconography 모두 존재 + 본 프로젝트 §10~12 확장.
4. **Stitch subset export** — frontmatter `schema: stitch-design-md/0.1` + §10 이후 제거 확인.
5. **tokens.json DTCG 호환** — schema validator 통과, 의미 0 변경.

## 🔍 발견 사항

- **F1**: 기존 tokens.json 이 *이미 DTCG 1.0 strict 호환* — 형식 정렬 작업 거의 불필요. ADR-001 의 "DTCG 채택" 결정이 phase-1 시점부터 잘 지켜졌다는 증거.
- **F2**: composites/templates 가 cva 안 쓰는 것은 의도적 — primitives 의 단순 조합. manual-plugin 으로 카탈로그 등재 처리 (axes: []).
- **F3**: ariaRole 의 휴리스틱 매핑 정확도가 합리적 — Button → button, Slider → slider, LoginPage → main, Sidebar → navigation, ActivityTable → table 등 1 차 휴리스틱으로 충분. 향후 ARIA explicit 명시 옵션 추가 가능.
- **F4**: AJV 8 의 draft-07 메타 스키마 자동 등록 안 됨 — 명시적 `addMetaSchema` 필요. duplicate detect 로 안전하게 처리.
- **F5**: tsconfig 의 types 에 `node` 추가 필요 — vocabulary CLI 가 node:fs/path 사용. browser bundle 에는 영향 없음 (실행되는 코드는 vite tree-shaking).

## 🚧 이월 항목

- spec-7-02 (grammar) 가 generated `spec-schema.json` 을 lint ground 로 사용
- cva 외 plugin 구현 (data-state / render-prop / slot / tw-variants) — phase-7 후반 또는 phase-8
- shadcn MCP 비교기 — 별도 spec-x 후보
- Lucide 아이콘 정확 매핑 라이브러리 — DESIGN.md §9 Iconography 의 후속

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + Dennis |
| **작성 기간** | 2026-05-10 ~ 2026-05-10 |
| **최종 commit** | (Ship commit 직후 갱신) |
| **단위 테스트** | 73 vocabulary case + studio 전체 351/351 PASS |
| **CLI 산출물** | 6 파일 (catalog/spec-schema/FRONT/TOKEN/DESIGN/Stitch) |
