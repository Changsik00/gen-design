# feat(spec-12-04): gd-chat §5.6 비슷한 화면 발견 + §5.7 토큰 재사용 가이드

## 📋 Summary

### 배경 및 목적

`gd-chat.md` §5.5 checklist 3단계("비슷한 화면 발견")가 선언만 있고 상세 가이드가 없었음 (v4 retro #4). 에이전트 재량에 의존한 탐지·결정이 세션마다 달라지는 문제를 해소한다.

### 주요 변경 사항

- [x] `§5.6` 신규 추가 — 비슷한 화면 탐지 기준(최상위 컴포넌트 + 필드 50%) + 4-옵션 결정 가이드 + decisions.md 템플릿
- [x] `§5.7` 신규 추가 — 토큰 없을 때 `gd tokens find` 연동 + 3-옵션 결정 + decisions.md 템플릿
- [x] `§5.5` checklist 항목 3 → §5.6 참조로 업데이트
- [x] `§11` 안티 패턴 2개 추가 (유사 씬 미비교 / 토큰 바로 신규 정의)
- [x] `§12` 종료 조건 항목 강화

### Phase 컨텍스트

- **Phase**: `phase-12`
- **본 SPEC 의 역할**: `gd-chat` 대화 깊이 3단계(비슷한 화면 발견)를 실행 가능한 가이드로 구체화 + spec-12-03 `gd tokens` 명령을 대화 flow 에 통합

## 🎯 Key Review Points

1. **§5.6 유사도 기준** — "최상위 컴포넌트 동일 + 폼 필드 ≥50% 겹침" → 에이전트가 직접 파일 읽어 비교 (CLI 알고리즘 아님)
2. **§5.7 gd tokens find 연동** — spec-12-03 에서 추가한 명령을 gd-chat flow 에 명시적으로 통합

## 🧪 Verification

### v5 시뮬레이션

```
실행: settings.chat.md 신규 작성 (계정 설정 씬)
```

| 항목 | 결과 |
|---|---|
| §5.6 유사 신 발견 | ✅ login.chat.md (50% 겹침) → (B) 기반 확장 |
| §5.7 토큰 결정 | ✅ gd tokens find green → 없음 → (C) 보류 |
| decisions.md entry | ✅ 2개 자동 기록 |
| §5.5 turn 수 | 6회 |

## 📦 Files Changed

### 🛠 Modified Files

- `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` (+94, -4): §5.6/§5.7 추가, §5.5·§11·§12 보강

### 🆕 New Files

- `experiments/dogfood-alpha-v5/chats/scenes/settings.chat.md`: v5 시뮬 씬
- `experiments/dogfood-alpha-v5/transcripts/scene-5-settings.md`: 시뮬 트랜스크립트
- `experiments/dogfood-alpha-v5/.gd/memory/decisions.md`: §5.6·§5.7 결정 2개 추가

**Total**: 4 files changed

## ✅ Definition of Done

- [x] §5.6 / §5.7 추가 및 §5.5·§11·§12 업데이트
- [x] v5 시뮬 — §5.6 유사 신 발견 flow 동작 확인
- [x] v5 시뮬 — decisions.md 재사용 vs 확장 entry ≥1 자동 기록
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-12.md`
- Walkthrough: `specs/spec-12-04-similar-scenes-and-token-reuse/walkthrough.md`
- 연관 spec: spec-12-02 (gd-chat 대화 깊이), spec-12-03 (gd tokens 명령)
