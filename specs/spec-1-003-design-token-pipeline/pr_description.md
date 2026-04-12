# feat(spec-1-003): 디자인 토큰 파이프라인 (Style Dictionary + i18n)

## 📋 Summary

### 배경 및 목적

Phase 1 (Foundation)의 마지막 스펙. tokens.json → Style Dictionary → shadcn/ui CSS 변수 자동 생성 파이프라인을 구축하여, 토큰 하나 바꾸면 전체 UI 테마가 변경되는 구조를 만든다.

### 주요 변경 사항

- [x] W3C DTCG 토큰 JSON — primitive(neutral/red/blue) + semantic(light/dark 32변수 + radius + font) 2계층
- [x] Style Dictionary v5 빌드 스크립트 — 커스텀 포맷(shadcn-light/dark) + name/shadcn 변환
- [x] `npm run tokens` → `_tokens-light.css`, `_tokens-dark.css` 자동 생성
- [x] index.css 하드코딩 제거 → 토큰 출력 import로 교체
- [x] i18n JSON 구조 (ko/en) — Schema §14 네임스페이스 규약 준수

### Phase 컨텍스트

- **Phase**: `phase-1` (Foundation) — 이 스펙으로 Phase 1 완료
- **본 SPEC의 역할**: Phase 2 (Page Template)에서 토큰 교체로 브랜딩 변경, i18n 교체로 언어 변경의 기반

## 🎯 Key Review Points

1. **토큰 → shadcn/ui 매핑**: tokens.json의 시맨틱 토큰이 shadcn/ui CSS 변수명과 1:1 매핑되는지
2. **2계층 구조**: primitive(oklch 값) → semantic(참조) 분리가 적절한지
3. **i18n 네임스페이스**: `{page}.{section}.{element}.{property}` 패턴이 Phase 2 컴포넌트에서 사용 가능한지

## 🧪 Verification

### 빌드 검증
```bash
cd studio && npm run build
```

**결과**: ✅ tokens → tsc → vite 전체 파이프라인 성공 (130ms)

## 📦 Files Changed

### 🆕 New Files

- `studio/tokens/tokens.json`: W3C DTCG 디자인 토큰 소스
- `studio/tokens/build.mjs`: Style Dictionary v5 빌드 스크립트
- `studio/src/styles/_tokens-light.css`: 자동 생성 light 테마 CSS 변수
- `studio/src/styles/_tokens-dark.css`: 자동 생성 dark 테마 CSS 변수
- `studio/src/i18n/ko.json`: 한국어 텍스트 리소스
- `studio/src/i18n/en.json`: 영어 텍스트 리소스

### 🛠 Modified Files

- `studio/src/index.css`: 하드코딩 CSS 변수 → 토큰 import로 교체
- `studio/package.json`: tokens 스크립트 + style-dictionary devDep 추가

**Total**: 8 files changed

## ✅ Definition of Done

- [x] tokens.json 존재 (DTCG 포맷, shadcn/ui 전체 변수 커버)
- [x] `npm run tokens` → CSS 변수 자동 생성
- [x] shadcn/ui 테마 연결 + `npm run build` 성공
- [x] i18n JSON 샘플 (ko/en) 존재
- [x] `walkthrough.md` archive commit 완료
- [x] `pr_description.md` archive commit 완료

## 🔗 관련 자료

- Phase: `backlog/phase-1.md`
- Schema Token Mapping: `schema/design-md-schema.md` §13
- ADR: `docs/decisions/ADR-001-phase-restructure.md`
