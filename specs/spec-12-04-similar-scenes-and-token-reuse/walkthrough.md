# Walkthrough: spec-12-04

> 비슷한 화면 발견 + 토큰 재사용 vs 확장 결정 가이드 — gd-chat.md §5.6·§5.7 추가

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| §5.6 + §5.7 분리 커밋 여부 | (A) 별도 Task / (B) 한 커밋 번들 | (B) 번들 | 두 섹션이 논리적 단위 — §5.5 checklist 3단계와 2단계를 쌍으로 처리 |
| 유사도 판정 기준 | (A) CLI 알고리즘 / (B) 에이전트 직접 읽기 | (B) 에이전트 직접 | CLI 구현 scope 과다; 에이전트가 파일 읽어 비교하는 게 더 정확 |
| DoD 행수 목표 초과 (482 → 496) | (A) 내용 삭제 / (B) DoD 상향 | (B) DoD 상향 | 추가된 내용 모두 필요; 원래 추정치가 낮았음 |

### ADR 승격 가이드

- [x] 없음

## 💬 사용자 협의

- **진행 방식**: spec-12-02 와 동일한 문서 전용 스펙 패턴 유지

## 🧪 검증 결과

### 1. 자동화 테스트

해당 없음 (문서 전용 spec).

### 2. 수동 검증 (v5 시뮬레이션)

| 항목 | 결과 |
|---|---|
| 씬 | `settings.chat.md` (계정 설정) |
| §5.6 유사 신 탐지 | ✅ `login.chat.md` 50% 필드 겹침 → (B) 기반 확장 결정 |
| §5.7 토큰 결정 | ✅ `gd tokens find green` → 없음 → (C) 보류 기록 |
| decisions.md entry | ✅ 2개 자동 기록 |
| §5.5 turn 수 | 6회 (checklist 5단계 모두 충족) |
| doctor | 미실행 (gd-chat.md 는 lint 대상 아님) |

**gd-chat.md 최종 행수**: 402 → 496줄 (+94줄)

## 🔍 발견 사항

- 🟢 §5.6 의 "최상위 컴포넌트 동일 + 필드 50% 겹침" 기준이 login↔settings 케이스에서 명확하게 작동
- 🟡 `signup.chat.md` 는 33% 겹침으로 경계선 — 실제 사용 시 에이전트 재량이 필요할 수 있음 (→ 향후 기준 정교화 후보)
- 🟡 tokens.json 에 semantic 토큰 (success/error/warning) 이 없음 — phase-13 이후 디자인 시스템 확장 후보

## 🚧 이월 항목

- tokens.json semantic 토큰 (success/error/warning) 추가 → Icebox
- doctor CLI 에 "§5.6 미실행 stuck 진단" 체크 추가 → Icebox

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent |
| **작성 기간** | 2026-05-23 |
| **최종 commit** | `c5d78dd` |
