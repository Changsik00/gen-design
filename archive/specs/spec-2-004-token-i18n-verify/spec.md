# spec-2-004: 토큰/i18n 교체 검증 + Paper 디자인 매칭

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-2-004` |
| **Phase** | `phase-2` |
| **Branch** | `spec-2-004-token-i18n-verify` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-04-15 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-2-001~003에서 3계층 아키텍처 + LoginPage + SignupPage + DashboardPage를 구현했다. 구조는 Paper 디자인과 일치하지만, **스타일(컬러/사이즈/패딩)이 shadcn 기본값**이며 Paper 디자인에서 추출한 값이 아니다.

### 문제점

1. **tokens.json이 shadcn 기본값**: Paper 디자인의 primary color는 `#6366F1`(indigo)이지만, 현재 토큰은 neutral(흑백)
2. **사이즈/패딩 불일치**: shadcn 기본 h-8 버튼(32px) vs Paper CTA h-44(44px), 패딩/gap도 다름
3. **토큰 교체 검증 미완**: 토큰을 바꾸면 UI가 바뀌는지 실증이 없음
4. **i18n 교체 검증 미완**: ko→en 전환 시 레이아웃이 유지되는지 확인 안 됨

### 해결 방안 (요약)

Paper에서 추출한 토큰으로 `tokens.json`을 업데이트하고, 브랜드 B 토큰을 추가하여 교체 검증을 수행한다. i18n ko↔en 전환과 variant(page↔modal) 전환을 테스트한다.

## 📊 Paper에서 추출한 핵심 토큰

| 토큰 | Paper 값 | 현재 shadcn 기본값 |
|---|---|---|
| **primary** | `#6366F1` (indigo) | `oklch(0.205 0 0)` (검정) |
| **sidebar bg** | `#0F172A` (slate-900) | 흰색 |
| **sidebar text** | `#C7D2FE` (indigo-200) | — |
| **sidebar active bg** | `#6366F11F` (indigo/12%) | — |
| **card border** | `#E2E8F0` (slate-200) | — |
| **card radius** | `12px` | `0.75rem` |
| **CTA button height** | `44px` | `32px` (h-8) |
| **header padding** | `16px 32px` | — |
| **stat card padding** | `20px 24px` | — |
| **font** | Inter, 600/500/400 | Geist |
| **heading size** | `18px` / `36px` | `16px` |
| **login left bg** | 다크 그라데이션 | — |
| **logo bg** | `#6366F1` | — |

## 🎯 요구사항

### Functional Requirements

1. **tokens.json 업데이트**: Paper 디자인 값으로 primary, radius, spacing 등 반영
2. **브랜드 B 토큰 추가**: 토큰 교체로 UI가 바뀌는지 검증용 대체 토큰 셋
3. **App에 테마/언어 전환 UI**: 브랜드 A↔B, ko↔en 전환 버튼
4. **LoginPage 레이아웃 개선**: Paper "Login" 디자인의 split-screen 레이아웃 반영
5. **variant 전환 테스트**: page↔modal 전환 동작 확인

### Non-Functional Requirements

1. 토큰 교체 시 코드 변경 없이 CSS 변수만으로 테마가 바뀌어야 함
2. i18n 교체 시 레이아웃이 깨지지 않아야 함

## 🚫 Out of Scope

- Paper 디자인과의 픽셀 퍼펙트 매칭 (구조적 일치까지만)
- 실제 다크 모드 (현재 light/dark 토큰은 존재하지만 전체 다크 모드 UI는 별도)
- 라우팅

## ✅ Definition of Done

- [ ] Paper 토큰 반영된 tokens.json으로 빌드 성공
- [ ] 브랜드 A↔B 토큰 교체 시 UI 변경 확인 (테스트)
- [ ] ko↔en i18n 교체 시 텍스트 변경 + 레이아웃 유지 (테스트)
- [ ] variant(page↔modal) 전환 동작 확인 (테스트)
- [ ] `walkthrough.md`와 `pr_description.md` 작성 및 archive commit
- [ ] `spec-2-004-token-i18n-verify` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
