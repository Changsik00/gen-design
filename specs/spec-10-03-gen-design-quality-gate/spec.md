# spec-10-03: gen-design 품질 게이트 강화

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-10-03` |
| **Phase** | `phase-10` |
| **Branch** | `spec-10-03-gen-design-quality-gate` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-10 목표 세 번째 항목 (spec-10-03) 은 다음 세 가지를 완료해야 phase-10 Done 조건을 채운다:

1. workspace root 에서 `pnpm gen-design lint` 직접 실행 불가 — `pnpm --filter studio exec tsx scripts/gen-design.ts lint ...` 또는 `cd studio` 필요 (external-alpha-1 C-4 보정 후보)
2. StatCard 컴포넌트에 `variant` axis 없음 — catalog.json 의 StatCard `axes: []`, handbook §4 예시가 `variant="compact"` / `variant="highlighted"` 를 쓰지만 실제 컴포넌트·타입 불일치 (C-3 보정 후보)
3. 스튜디오 컴포넌트 dogfooding 정량 측정 수단 없음 — `@/components/ui` 실사용률 지표 부재

### 문제점

- `gen-design lint` alias 미설정 → handbook 예시 실행 경로 불일치, Day-1 DX 마찰
- StatCard variant 미구현 → catalog 와 예시 불일치, `variant="compact"` 전달 시 TypeScript 오류 또는 무시
- dogfooding 비율 측정 스크립트 없음 → 컴포넌트 재사용 추세 수치화 불가

### 해결 방안 (요약)

workspace `package.json` 에 `gen-design` script alias 추가. StatCard 에 cva `variant` axis (compact / highlighted / default) 구현 후 `pnpm vocab` 로 catalog 재생성. `studio/scripts/dogfooding-score.ts` 작성으로 `@/components/ui` import 비율 측정 + CI stdout 리포트.

## 🎯 요구사항

### Functional Requirements

1. workspace root 에서 `pnpm gen-design lint --chat-root playground/chats` 실행 → 0 issues (혹은 정상 issue 목록 출력) — `cd studio` 불필요
2. StatCard 가 `variant: "compact" | "highlighted" | "default"` prop 을 받아 UI 에 반영 (compact: 소형, highlighted: 강조 border, default: 기본)
3. `pnpm --filter studio vocab` 실행 시 catalog.json 의 StatCard `axes` 에 `variant` axis 가 등록됨
4. `studio/scripts/dogfooding-score.ts` 실행 시 `src/**/*.tsx` 파일 중 `@/components/ui` import 가 있는 비율 계산 + stdout 표 출력
5. CI `ci.yml` 에 dogfooding score 를 stdout 으로 출력하는 step 추가 (게이트 아님 — 리포트용)

### Non-Functional Requirements

1. StatCard variant 추가 후 기존 단위 테스트 995 PASS 유지
2. `pnpm gen-design lint` alias 는 `pnpm --filter studio gen-design lint` 와 동일한 exit code / stdout 을 냄

## 🚫 Out of Scope

- StatCard 의 dark mode / token 연동 (별도 phase)
- dogfooding score 의 fail gate 화 (이번은 리포트만)
- handbook.md 수정 (별도 docs spec)
- workspace root 에서 모든 studio CLI 명령 통일 (gen-design 하나만)

## 📑 ADR 후보

- [ ] 없음

## ✅ Definition of Done

- [ ] `pnpm gen-design lint --chat-root playground/chats` (workspace root) → 정상 실행
- [ ] StatCard variant prop 구현 + 기존 테스트 995 PASS
- [ ] catalog.json StatCard axes 에 variant 등재 (`pnpm vocab` 후 확인)
- [ ] `studio/scripts/dogfooding-score.ts` 실행 → 비율 표 출력
- [ ] CI dogfooding step 추가
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-10-03-gen-design-quality-gate` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
