# docs(spec-08-02): handbook full 재작성 + README 진입점 + §4.5 새 컴포넌트 워크플로

> phase-8 의 *agent 매개 chat 흐름* 비전을 *살아있는 핸드북* 으로 명문화. 코드 변경 0.

## 📋 Summary

### 배경 및 목적

spec-08-01 이 어휘 (`spec` → `chat`) grep substitute 까지 완료했으나, *PoC 검증된 새 비전* 의 시스템적 명문화는 미달:

- PoC 통증 #1: README 진입점 부재 → 신규 디자이너 진입 막힘
- PoC 통증 #2: handbook §4 의 *Studio Paper preview 패널* 모호 → 사용자 재프레임 후 명확화 필요
- PoC 통증 #6: 새 컴포넌트 추가 워크플로 부재
- 사용자 비전 (3 세션 시뮬레이션 검증): chat = 자연어 input + 3층 정리 + agent 도서관 사서 — handbook 부재
- playground/chats/ 6 PoC 파일 = *살아있는 예시* 자료 미활용

### 주요 변경 사항

- [x] **README 진입점**: 첫 단락 직후 *"신규 진입자 → docs/handbook.md"* 섹션. §1-§4 5분 통독 약속.
- [x] **handbook §1 시각 갱신**: mermaid 재구성 — 디자이너 자연어 → MCP agent → 컨텍스트 read → 제안 → 합의 → chat.md + Paper visual 양방향 sync. 4 축 어휘 정합 박스 갱신 (Paper layer-name 식별자 추가).
- [x] **handbook §2 Glossary 대폭 확장**: SSOT 4 문서 + 3 디렉토리 (chats/playground/fixtures 분리) / chat 3층 구조 (Narrative + Structure + History) / scene/component/shell / agent 도서관 사서 / Paper layer-name 컨벤션. 기존 Tier 1-3 / L1-L4 / Canonical 유지.
- [x] **handbook §3 매트릭스 갱신**: 정보 종류 × 위치 표에 chat.md 행 3 분리 + shell 행 + 변동 빈도 컬럼. 가변성 등급 3 정도 (🪨 고정 / 🌊 변동 / 💨 가변) 시각화.
- [x] **handbook §4 워크플로 재작성**: ProfilePage → ProfileScene. agent 매개 흐름 mermaid 신규. 5 일 시나리오 (Day 1 Paper MCP 직접 / Day 2 agent 자연어 정리 / Day 3 양방향 sync / Day 4 글로벌 SSOT / Day 5 검증). 각 Day 마지막에 playground 살아있는 예시 링크.
- [x] **handbook §4.5 신규**: 새 컴포넌트 추가 워크플로 (EmptyState 사례 5 단계 — chat.md → 코드 → catalog 자동 → status 갱신 → 재사용).
- [x] **handbook §5 신규 원칙**: P6 (agent 는 도서관 사서) + P7 (chat 은 살아있다).
- [x] **handbook §6 신규 룰**: R7 (Paper layer-name 식별성 컨벤션 — `[chat:type/slug]` 포맷).
- [x] **handbook §7 도구 갱신**: gen-design `paper-import` (⭐ 0 — phase-8 도그푸딩 첫 게이트) 행 추가. `merge` 행 갱신 (ADR-010 결정 후).
- [x] **handbook §8 ADR 인덱스**: ADR-010 자리 예약 행 추가 (작성 예정 — `spec-08-05`). 결정 history 타임라인에 phase-8 행.

### Phase 컨텍스트

- **Phase**: `phase-8` (chat-agent-flow)
- **본 SPEC 의 역할**: PoC 검증된 비전을 시스템 코드 (8-03 ~ 8-11) 작성 *전* 에 핸드북으로 안착. 모든 후속 spec 의 *근거 자료*.

## 🎯 Key Review Points

1. **agent 도서관 사서 (P6) 명문화**: agent.md (harness-kit operating rules) 와 별도로 *디자인 도구의 agent 약속* 으로 분리. agent 가 *단순 변환기* 가 아니라 *컨텍스트 읽고 능동 제안* 하는 약속.
2. **chat 의 살아있음 (P7)**: harness-kit spec (작업 흔적, 동결) 과 본질적 차이. 같은 chat.md 를 *재 편집* 가능. 사용자 비전의 핵심.
3. **§4.5 EmptyState 사례**: 추상 가이드보다 *진짜 PoC chat.md 인용* — 외부 alpha 진입 시 *바로 따라할* 모범.
4. **§3 가변성 등급 3 정도**: fixtures (🪨 고정) / chats (🌊 변동) / playground (💨 가변) — 디자이너 자유 + 시스템 안정 동시 확보.
5. **§7 gen-design paper-import (⭐ 0)**: phase-8 도그푸딩 첫 게이트 — 본 명령 없이는 chat 흐름 시작 불가.

## 🧪 Verification

### 자동 테스트
```bash
cd studio && pnpm test
```
**결과**: ✅ 103 test files / 725 tests passed (회귀 0 — 코드 변경 0).

### 빌드
```bash
pnpm --filter studio build
```
**결과**: ✅ exit 0 (`built in 211ms`).

### 분량
- **Before**: 320 줄
- **After**: 664 줄 (plan 700-900 하단)

### 링크 정합성
- 9 ADR (ADR-001 ~ 009) 모두 실재 + ADR-010 placeholder
- playground/chats/ markdown 링크 3건 (empty-state / login / main) 모두 OK
- profile.chat.md 는 §4 시나리오의 가상 예시 (코드 블록 안) — 링크 X (의도)

### Reading test
1. README 진입점 발견 (5초)
2. §1 통독 (5초) — 한 줄 정의 + mermaid + 4축
3. §2 통독 (1분) — chat 3층 + scene/component/shell + agent + 식별 + Tier/Variant/Canonical
4. §4 Profile Scene 5 일 시나리오 (5분)
5. §4.5 EmptyState 5 단계 (3분)

→ 5분 안에 §1-§4 통독 가능 약속 유지.

## 📦 Files Changed

### 🛠 Modified Files

- `README.md` (+8): 진입점 섹션 신규
- `docs/handbook.md` (+345/-85): 8 섹션 + §4.5 신규 = 664 줄

### 🆕 New Files

- `specs/spec-08-02-handbook-and-conventions/spec.md` / `plan.md` / `task.md` / `walkthrough.md` / `pr_description.md`

**Total**: docs only. 코드 변경 0.

## ✅ Definition of Done

- [x] README 진입점 추가
- [x] handbook 8 섹션 + §4.5 모두 갱신
- [x] PoC playground 6 파일 *살아있는 예시* 링크 3건 (empty-state / login / main)
- [x] ADR 9 + ADR-010 자리 예약 검증
- [x] 분량 664 줄 (plan 의 700-900 하단)
- [x] `pnpm test` 725/725 PASS — 회귀 0
- [x] `pnpm --filter studio build` exit 0
- [x] walkthrough.md ship commit
- [x] pr_description.md ship commit
- [ ] 사용자 검토 + 머지

## 🔗 관련 자료

- Phase: `backlog/phase-08.md`
- Walkthrough: `specs/spec-08-02-handbook-and-conventions/walkthrough.md`
- PoC 출처: `poc-chat-agent-flow` 브랜치 + `playground/chats/` 6 파일
- 후속 spec: 8-03 (paper-mcp-adapter) / 8-04 (chat-md-grammar) / 8-05 (ADR-010) / 8-06 (incremental infer) / 8-07 (compiler) / 8-08 (merge) / 8-09 (lint) / 8-10 (studio runtime) / 8-11 (external alpha)
