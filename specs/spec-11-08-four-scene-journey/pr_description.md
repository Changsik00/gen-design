spec-11-08: 4-scene journey — 이지 페르소나 누적 학습 검증

## Summary

spec-11-07 converge 이후 *연속 4 신* 환경에서 누적 학습 / composite 승격이 *진짜* 작동하는지 검증.

- 페르소나: **이지** (2년차 주니어 디자이너, 4 번째 페르소나)
- 시나리오: **로그인 → 회원가입 → 대시보드 → 마이페이지** (4 신 연속)
- 결과: **4 신 모두 0 errors / 페르소나 멈춤 0 / Tier 3 composite 1 승격 + 1 후보 자연 발견**

## 변경 사항

### 1. scaffold + 페르소나 (`experiments/dogfood-alpha-v4/`)
- `create-gd-react` 로 taskboard scaffold 53 파일
- `.gd/memory/designer.md` — 이지 페르소나 (2년차, Figma 기본, shadcn 들어봄, React props)
- `.gd/memory/project.md` — taskboard SaaS + 4 신 결정 기록
- `.gd/memory/decisions.md` — 4 entry 누적 (신 1/2/3/4 결정)
- shell `{{scene.content}}` placeholder 추가 (scaffold 빈 shell 보완)

### 2. 4 신 chat.md
| 신 | 어휘 (unique) | 재사용 | bytes |
|---|---|---|---|
| 신 1 로그인 | Card + Form + FormField + Input + Button (10) | 0 | 2056 |
| 신 2 회원가입 | + Checkbox (1) | 신 1 그대로 | 3045 |
| 신 3 대시보드 | (모두 신 1/2 어휘) | Card x 3 → 3 회 룰 | 2274 |
| 신 4 마이페이지 | + Tabs/Avatar/Switch (4) | F1 + S1 동시 | 5015 |
| **합계** | **고유 17** | **2 composite 후보** | **12,390** |

### 3. 종합 보고서 (`experiments/dogfooding-alpha-v4-journey-2026-05.md`)
- 단계별 대화 (turn-by-turn) — 신 1-4 각 4-8 turn
- 정량 / 누적 학습 매트릭스 / 페르소나 strict 점수
- phase-11 깃발 평가: **4 페르소나 × 4 시나리오 × 1 다신-여정 통과**
- phase-12 후보 갱신 (HIGH 1 + MID 2 NEW + OPT 4)

## Test Plan

- [x] `gd react login --chat-root .../v4/chats` → 2056 bytes
- [x] `gd react signup` → 3045 bytes
- [x] `gd react dashboard` → 2274 bytes
- [x] `gd react mypage` → 5015 bytes
- [x] `gd doctor` (6 files) → 0 errors / 0 warnings (3 ms)
- [x] decisions.md 4 entry 누적 확인
- [x] 페르소나 strict 점수 — 1회 미세 깨짐만, 대체로 일관

## Findings — 신규 막힘 *0건*

4 신 연속 진행 중 막힘 / 에러 / 진단 위반 모두 *0*. spec-11-07 의 converge 가 *다신* 환경에서도 유지됨.

## Next (phase-12 후보)

- 🔴 HIGH: `@gd/cli` npm 분리 (잔여)
- 🟡 MID **(NEW)**: StatCard composite 실제 구현 + 4 신 마이그레이션
- 🟡 MID **(NEW)**: FormBlock composite 후보 검증
- 🟢 OPT: 외부 디자이너 alpha, `gd api`, `gd doctor --fix`
