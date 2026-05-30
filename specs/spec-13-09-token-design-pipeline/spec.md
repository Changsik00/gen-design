# spec-13-09: 토큰 빌드 파이프라인 + DESIGN.md 강제

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-09` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-09-token-design-pipeline` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-30 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

페르소나 테스트에서 발견: gen-design의 핵심 차별화 = "디자이너가 정한 토큰/디자인 시스템이 React에 일관 강제"인데, preset에서 이게 작동하지 않는다.

**진단 결과 (근본 원인):**
- preset `tokens.json`의 `$description`에 *"pnpm gd build-tokens 가 본 파일 → globals.css 자동 생성"* 이라 명시돼 있으나, **그 빌드 스크립트가 preset에 없다.**
- studio(본 레포)엔 `pnpm tokens`(tokens.json → globals.css)가 있지만 preset에는 누락.
- 결과: preset 프로젝트는 `tokens.json`을 바꿔도 `globals.css`가 안 바뀜 → React 색 안 바뀜. "토큰 합의 → 자동 반영"이 깨짐.
- DESIGN.md는 빈 템플릿이고, LLM 생성 시 실제로 반영되는지 강제 메커니즘이 약함.

### 문제점

1. **토큰 자동반영 파이프라인 부재**: tokens.json(소스) → globals.css(출력) 연결이 끊겨 토큰이 "문서로만" 존재.
2. **토큰 시스템의 가치 미작동**: 브랜드 색을 바꿔도 React에 안 흐름 = shadcn 기본 neutral에 갇힘.
3. **DESIGN.md 강제 부재**: 디자인 컨벤션이 코드 생성에 연결 안 됨.

### 해결 방안 (요약)

preset에 **토큰 빌드 스크립트**(`tokens.json` → `globals.css`의 `:root`/`.dark` 자동 생성)를 추가한다. 경량 무의존 Node 스크립트 + `pnpm tokens`. DESIGN.md는 FRONT.md가 생성 규칙으로 연결한다. todo 앱에서 primary 값만 바꿔 전체 색이 코드 변경 0으로 전환됨을 실증한다.

## 🎯 요구사항

### Functional Requirements

1. **토큰 빌드 스크립트** (`tokens/build.mjs`, 경량 무의존):
   - `templates/assets/tokens/tokens.json`의 `color.<name>.$value.{light,dark}` + radius 등 파싱
   - `src/styles/globals.css`의 토큰 영역(`:root` / `.dark`)을 마커 기반 자동 생성
2. **package.json** — `"tokens"` script + `build` 시 선행 실행
3. **globals.css 마커** — `/* tokens:start */ … /* tokens:end */` (수동 편집 금지 영역 명시)
4. **FRONT.md §11 갱신** — 토큰 빌드 파이프라인 명시 (`pnpm tokens` 워크플로) + DESIGN.md 컨벤션 연결 규칙
5. **실증** — todo 앱:
   - `tokens.json`의 `primary` 값을 인디고(예: `oklch(0.51 0.23 277)`)로 변경
   - `pnpm tokens` 실행 → `globals.css` 갱신
   - **React 코드 0 변경**으로 모든 `bg-primary`(버튼/강조) 색 전환 — before/after 스크린샷 + e2e

### Non-Functional Requirements

1. 빌드 스크립트는 무의존(Node 내장만) — preset 경량 유지 (FRONT.md "keep it boring")
2. light/dark 동기 — 양쪽 모두 생성

## 🚫 Out of Scope

- WCAG 대비 자동 검증 (gd-token 스킬 영역, 별건)
- DESIGN.md 자동 → 코드 변환 (LLM 컨텍스트 + lint 강제 수준까지만)
- studio의 style-dictionary 기반 빌드로 통일 (preset은 경량 무의존 채택)

## 📑 ADR 후보

- [ ] 없음 (구현 — ADR-002 토큰 전략, ADR-011로 충분)

## 🧪 통합 테스트

todo 앱: tokens.json primary 변경 → `pnpm tokens` → globals.css 갱신 → dev에서 버튼 색 전환 (React 코드 unchanged). e2e로 `--primary` CSS var 값 변경 확인.

## ✅ Definition of Done

- [ ] `tokens/build.mjs` (preset) + `pnpm tokens` script
- [ ] globals.css 마커 기반 생성 영역
- [ ] FRONT.md §11 토큰 빌드 + DESIGN.md 연결
- [ ] todo 앱 primary 변경 → 자동반영 실증 (스크린샷 + e2e)
- [ ] walkthrough / pr_description ship
- [ ] PR → `phase-13-vertical-slice`
