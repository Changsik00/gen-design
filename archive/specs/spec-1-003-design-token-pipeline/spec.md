# spec-1-003: 디자인 토큰 파이프라인 구성

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-1-003` |
| **Phase** | `phase-1` |
| **Branch** | `spec-1-003-design-token-pipeline` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-04-12 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-1-002에서 `studio/` React 프로젝트가 셋업되었고, shadcn/ui가 CSS 변수 기반 테마(`--primary`, `--secondary` 등)를 생성했다. 그러나 이 CSS 변수 값은 shadcn/ui 기본값(oklch 무채색)이며, 프로젝트의 디자인 토큰과 연결되어 있지 않다.

### 문제점

1. **토큰 정의 없음**: `tokens.json` 같은 디자인 토큰 소스 파일이 없어서, 디자인 변경 시 CSS를 직접 수정해야 함
2. **shadcn/ui 변수 ↔ 토큰 매핑 없음**: DESIGN.md §13 (Token Mapping)에서 정의한 토큰이 실제 CSS 변수로 변환되는 파이프라인이 없음
3. **i18n 구조 없음**: 다국어 텍스트 리소스 JSON 구조가 정의되지 않음

### 해결 방안 (요약)

W3C DTCG 포맷의 `tokens.json`을 작성하고, Style Dictionary로 shadcn/ui CSS 변수를 자동 생성하는 파이프라인을 구축한다. i18n JSON 구조도 병행 정의한다.

## 📊 개념도

```
tokens.json (W3C DTCG)
    ↓ Style Dictionary
shadcn/ui CSS 변수 (--primary, --secondary, ...)
    ↓ Tailwind v4 @theme
bg-primary, text-primary, ...
    ↓ cva variant
<Button variant="primary" />
```

## 🎯 요구사항

### Functional Requirements

1. W3C DTCG 포맷의 `tokens.json` 작성 (color, typography, spacing, radius, shadow)
2. Style Dictionary 설치 및 설정 — `tokens.json` → CSS 변수 자동 생성
3. 생성된 CSS 변수가 shadcn/ui 테마 변수명과 매핑 (`--primary`, `--secondary`, `--destructive` 등)
4. `npm run tokens` 명령으로 토큰 빌드 실행 가능
5. 토큰 변경 → 빌드 → shadcn/ui 컴포넌트에 반영 확인
6. i18n 텍스트 리소스 JSON 구조 정의 + 한국어/영어 샘플 작성

### Non-Functional Requirements

1. W3C DTCG 포맷 준수 (`.tokens.json` 또는 `tokens.json`)
2. 기존 shadcn/ui CSS 변수 구조와 호환 — 변수명 변경 최소화
3. 빌드 시간 1초 이내

## 🚫 Out of Scope

- Figma Variables 동기화 (Phase 4)
- 다크 모드 토큰 (기본 라이트 모드만 — 다크 모드는 shadcn/ui 기본 유지)
- Page Template 구현 (Phase 2)
- i18n 라이브러리 선택 및 통합 (Phase 2 이후)

## ✅ Definition of Done

- [ ] `tokens.json` 존재 (DTCG 포맷, color/typography/spacing/radius 포함)
- [ ] `npm run tokens` 실행 → CSS 변수 파일 자동 생성
- [ ] 생성된 CSS 변수가 shadcn/ui 테마와 매핑되어 컴포넌트에 반영
- [ ] i18n JSON 샘플 (ko/en) 존재
- [ ] `npm run build` 성공
- [ ] `walkthrough.md`와 `pr_description.md` 작성 및 archive commit
- [ ] `spec-1-003-design-token-pipeline` 브랜치 push 완료
