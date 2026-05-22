# Implementation Plan: spec-2-004

## 📋 Branch Strategy

- 신규 브랜치: `spec-2-004-token-i18n-verify`
- 시작 지점: `main`
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] tokens.json의 primary를 `#6366F1`(indigo)로 변경 — 전체 UI 색상이 바뀜
> - [ ] 폰트를 Geist → Inter로 변경 (Paper 디자인 기준)
> - [ ] 브랜드 B 토큰은 검증용 — teal 계열로 대비가 확실하게

> [!WARNING]
> - [ ] `_tokens-light.css`, `_tokens-dark.css`가 재생성됨 — 기존 스타일 전체 변경

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **토큰 업데이트** | tokens.json의 primitive에 indigo/slate 추가, semantic에서 참조 | Paper 디자인의 컬러 체계와 일치 |
| **브랜드 B** | `tokens-brand-b.json` 별도 파일 + 빌드 스크립트 확장 | 런타임에 CSS 클래스 전환으로 테마 교체 |
| **i18n 검증** | App.tsx에 ko↔en 전환 버튼 | 기존 i18n 헬퍼 활용 |
| **variant 검증** | App.tsx에 page↔modal 전환 버튼 | LoginPage의 VariantWrapper 활용 |

## 📂 Proposed Changes

### 토큰

#### [MODIFY] `studio/tokens/tokens.json`
- primitive에 `indigo`, `slate` 컬러 스케일 추가
- semantic light: primary → indigo, sidebar → slate-900 등 Paper 값 반영
- radius, font 업데이트

#### [NEW] `studio/tokens/tokens-brand-b.json`
- teal 계열 primary, 다른 sidebar 색상 — 교체 검증용

#### [MODIFY] `studio/tokens/build.mjs`
- brand-b 토큰도 빌드하여 `_tokens-brand-b.css` 생성

### App 전환 UI

#### [MODIFY] `studio/src/App.tsx`
- 브랜드 A↔B 전환 (CSS 클래스 토글)
- ko↔en 전환
- variant(page↔modal) 전환 (LoginPage만)

### LoginPage 개선

#### [MODIFY] `studio/src/components/templates/LoginPage/index.tsx`
- Paper "Login" 디자인의 split-screen 레이아웃: 좌측 다크 브랜딩 + 우측 폼

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)
```bash
cd studio && pnpm exec vitest run
```

- 토큰 빌드 후 기존 테스트 모두 PASS
- i18n 헬퍼 테스트 유지

### 수동 검증 시나리오
1. `pnpm tokens` → CSS 변수 재생성, indigo 컬러 반영 확인
2. `pnpm dev` → 브랜드 A(indigo) 확인
3. 브랜드 B 전환 → teal 컬러로 UI 변경 확인
4. ko↔en 전환 → 텍스트 변경, 레이아웃 유지 확인
5. page↔modal 전환 → LoginPage 레이아웃 변경 확인

## 🔁 Rollback Plan

- `tokens.json` git restore로 원복 → `pnpm tokens`로 CSS 재생성
- App.tsx 전환 UI 제거

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md archive
