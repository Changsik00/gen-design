# Phase Ship: phase-6 — Studio v1

> Phase base branch (`phase-6-studio-v1`) → `main` 최종 PR.

## 📋 Overview

Blueprint 질의서, DESIGN.md 편집, 디자인 토큰 편집, 산출물 내보내기를 제공하는 React 웹앱 **Studio** 를 구축. 동시에 phase-5 회고에서 식별된 P1 정합 과제(API 일관성, paper-normalizer, blueprint protocol gap, paper sync 평가)를 일괄 해소. 자체 컴포넌트 라이브러리로 dogfooding.

## 📦 Scope: 계획 vs 실제

| 구분 | 항목 | 비고 |
|:---:|---|---|
| ✅ 완료 | spec-6-01: studio API 정합화 — hardcode 제거 + 토큰 매핑 (PR #25) | |
| ✅ 완료 | spec-6-02: paper-normalizer 5 카테고리 정규화 (PR #26) | |
| ✅ 완료 | spec-6-03: blueprint protocol 7 gap 일괄 해소 (PR #27) | |
| ✅ 완료 | spec-6-04: Studio 앱 셋업 (router + layout + DESIGN.md base) (PR #28) | |
| ✅ 완료 | spec-6-05: Blueprint 질의서 위저드 UI (PR #29) | |
| ✅ 완료 | spec-6-06: DESIGN.md 편집기 (sections + preview) (PR #30) | |
| ✅ 완료 | spec-6-07: 토큰 편집기 + 미리보기 (PR #31) | |
| ✅ 완료 | spec-6-08: 산출물 내보내기 (DESIGN.md/REQUIREMENTS.md/AGENT.md/assets 번들) (PR #32) | |
| ✅ 완료 | spec-6-09: Paper ↔ tokens 자동 동기화 PoC + Go/No-Go (PR #33) | Core Go, 자동화는 phase-7 이월 |
| ⏭ 이연 | spec-6-10: Playwright + Paper visual regression | 미착수 — phase-7 또는 별도 spec-x 로 이월 |

## 📊 Spec Summary

| PR | Spec | 핵심 변경 |
|---|---|---|
| #25 | spec-6-01-studio-api-alignment | hardcode default 4 건 제거, Sidebar/body bg 토큰 매핑 |
| #26 | spec-6-02-paper-normalizer | parse/serialize 5 페어 (color/padding/line-height/font/border) |
| #27 | spec-6-03-blueprint-protocol | NFR 누락 / placeholder mismatch / route default / status 어휘 등 7 gap |
| #28 | spec-6-04-studio-app-setup | router + layout + DESIGN.md base + token CSS 빌드 |
| #29 | spec-6-05-blueprint-questionnaire-ui | step별 질의 → 응답 → REQUIREMENTS.md 미리보기 |
| #30 | spec-6-06-editor | DESIGN.md section 편집기 9 섹션 + 마크다운 preview |
| #31 | spec-6-07-tokens | color/typography/radius/spacing 편집기 + 실시간 preview |
| #32 | spec-6-08-export | DESIGN.md / REQUIREMENTS.md / AGENT.md / assets 번들 export |
| #33 | spec-6-09-paper-sync | resolver/converter 라이브러리 + Paper PoC + Go/No-Go 보고서 |

## ✅ Success Criteria Checklist

| # | 기준 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | Blueprint 질의서 UI | ✅ PASS | `studio/src/features/blueprint/` + generator.test PASS |
| 2 | DESIGN.md 편집 UI | ✅ PASS | `studio/src/features/editor/` + generator.test PASS |
| 3 | 디자인 토큰 편집기 | ✅ PASS | `studio/src/features/tokens/` + utils.test PASS |
| 4 | Studio dogfooding 90%+ | ✅ PASS | feature `.tsx` 25 개가 `@/components/ui` 사용 (button/card/dialog/input/label/select/slider/switch) |
| 5 | 산출물 내보내기 | ✅ PASS | `studio/src/features/export/` + generators.test PASS |
| 6 | Studio API 정합화 | ✅ PASS | spec-6-01 — production 코드의 hardcode default 제거 확인 |
| 7 | paper-normalizer 라이브러리 | ✅ PASS | spec-6-02 — `studio/src/lib/paper-normalizer/` 5 카테고리 + 모든 단위 테스트 PASS |
| 8 | Blueprint protocol 정합화 | ✅ PASS | spec-6-03 PR #27 머지 |
| 9 | Paper ↔ tokens 평가 | ✅ PASS (조건부) | spec-6-09 — Core toolchain Go, 자동화 파이프라인은 phase-7 이월 (poc-report.md 참조) |
| 10 | Playwright + Paper visual regression | ❌ FAIL (이연) | 미구현, phase-7 또는 spec-x 이관 필요 |

**종합**: 9/10 PASS, 1 이연. 핵심 목표(Studio 본체 + phase-5 P1 정합) 100% 달성.

## 🧪 Integration Test Results

| # | 시나리오 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | Blueprint → 내보내기 E2E (단위 레벨) | ✅ PASS | 4 feature 별 generator/utils 테스트 PASS |
| 1' | Blueprint → 내보내기 E2E (브라우저) | ⚠️ N/A | 자동화 미구현 (Track C 미착수). 사용자 수동 검증으로 갈음 |

**자동 테스트**: 44 files / 266 tests PASS, `pnpm --filter studio run build` 성공 (vite production 빌드 198ms).

## 🏗 Architecture Decisions

- **Studio 컴포넌트 라이브러리 dogfooding**: shadcn 변형 + base-ui 기반 자체 ui 폴더로 구성. 외부 UI 라이브러리 의존을 최소화하고 디자인 시스템과 일관성을 확보.
- **paper-sync 와 paper-normalizer 분리**: 정규화(값 형변환) 와 토큰 해소(참조 풀이) 는 책임이 다르다고 판단해 별도 라이브러리. 미래 확장 시 결합 부담 ↓.
- **Phase base branch 회귀**: phase-6 부터 base branch 모드로 운영 (phase-5 는 main 직 머지). spec PR 들이 phase-6-studio-v1 에 누적 후 일괄 main 으로 ship.
- **paper-sync end-to-end 자동화 보류**: PoC 결과 노드-토큰 매핑 컨벤션 부재 + style key 분기 필요 발견. 본 phase 에서는 라이브러리 + 보고서까지만, 실 자동화는 phase-7 선결 과제 정리 후 진행.

## ⚠️ Known Issues / Technical Debt

- **시각 회귀 자동화 부재 (Track C, 기준 #10)**: Playwright + Paper screenshot 기반 visual regression 미구현. phase-5 의 시각 일치도 측정 객관화 미해결. → phase-7 후보.
- **paper-sync 자동화 미완료 (spec-6-09 F2/F3/F4)**: converter style key 분기, 노드-토큰 매핑 컨벤션, tokens.json watch trigger — 모두 phase-7 선결 과제로 정리.
- **E2E 브라우저 자동화 부재**: 시나리오 1 의 풀 E2E 가 단위 테스트로만 갈음됨. Playwright 도입 시 자동화 가능.

## 📝 Follow-up Work

- Playwright + Paper visual regression → 새 phase 또는 spec-x 후보
- paper-sync 자동화 (F2/F3/F4) → phase-7 후보
- phase-6.md 의 spec 표는 sdd 자동 갱신 마커 사이에 있으나 6-05~6-08 가 누락된 상태로 유지되었음 — 본 PR 에서 9 spec 모두 등재로 보정. sdd 측 워크플로우 점검 필요.

## 📊 Stats

- **Files changed**: 138 (+10,377 / -188) — `git diff main...phase-6-studio-v1`
- **Test suites**: 44 files, 266 tests, all PASS
- **Specs**: 9 완료, 1 이연 (spec-6-10)
- **PR 수**: 9 (PR #25 ~ PR #33)
