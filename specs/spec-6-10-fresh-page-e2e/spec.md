# spec-6-10: Fresh-page E2E — Paper ↔ React 26 컴포넌트 round-trip 검증

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-6-10` |
| **Phase** | `phase-6` |
| **Branch** | `spec-6-10-fresh-page-e2e` |
| **상태** | Planning |
| **타입** | Research / Verification |
| **Integration Test Required** | yes (수동 — 시각 비교) |
| **작성일** | 2026-05-09 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-6 9 spec 이 모두 머지되어 main PR #34 가 작성됨. 그러나 phase-review (Opus 서브에이전트) 결과:
- **C1**: 전체 phase-6 에서 *실 Paper 시안의 컴포넌트가 React 컴포넌트와 시각적으로 일치하는지* 검증한 spec 이 없음
- **C2**: paper-normalizer / paper-sync 라이브러리가 production 코드에서 unused — 단위 테스트만 통과
- 사용자 핵심 우려: "fresh page 에서 component + token 들 테스트해보는건 어때?"

원래 spec-6-10 (Playwright + Paper visual regression) 은 미착수 상태로 phase-6 종료될 뻔함. 본 spec 은 이를 Paper-MCP-driven 버전으로 리프레임.

### 문제점

- Studio v1 의 dogfooding 약속이 시각적으로 입증되지 못함
- paper-normalizer / paper-sync 라이브러리가 실 사용처 없이 dead code 위험
- phase-5 회고의 "5/6 ⚠️ 부분일치 PASS 처리" 객관성 결함이 phase-6 에서 재발 가능

### 해결 방안 (요약)

26 개 컴포넌트(20 composites + 6 templates) 를 fresh Paper 아트보드에 동일 tokens.json 으로 렌더하고 React dev 서버 결과물과 시각 비교. 발견된 drift 는 findings.md 로 정리하고, token-level 의 단순 drift 는 본 spec 에서 수정. component-level 또는 시스템적 이슈는 backlog 이월.

## 🎯 요구사항

### Functional Requirements

1. **Paper 산출물**: 새 아트보드 "Phase-6 E2E — Composites" + "Phase-6 E2E — Templates" 두 개 생성. 각 컴포넌트를 `mcp__paper__write_html` 로 렌더 (tokens.json light scheme 의 CSS 변수 인라인).
2. **React 산출물**: `pnpm --filter studio dev` 띄우고 각 컴포넌트의 playground/template 라우트 스크린샷 캡처.
3. **비교 보고서**: `findings.md` — 26 컴포넌트 각각에 대해 ✓ match / ⚠️ minor drift / ❌ mismatch 분류 + 스크린샷 또는 노드 ID 증거.
4. **단순 drift 수정**: token 변경으로 해결 가능한 drift 는 `templates/assets/tokens/tokens.json` 수정 후 재빌드. 변경분은 본 spec 의 commit.
5. **이월 항목**: component-level / 시스템적 drift 는 backlog/queue.md Icebox 에 등재.

### Non-Functional Requirements

1. Paper API 호출 횟수 합리화 — 26 write_html + 26 screenshot 정도. 가능하면 한 번에 묶음.
2. tokens.json 의 light scheme 만 검증 (dark 는 out of scope).
3. spec-6-09 의 paper-sync resolver 를 *실제로 호출* 하여 토큰 값을 dynamically 적용 — paper-sync 가 unused 가 아님을 입증.

## 🚫 Out of Scope

- Playwright / 자동 pixel-diff (별도 phase 또는 spec-x)
- dark scheme 검증
- 모든 컴포넌트 variant 검증 — 대표 1 variant 만
- 시스템적 redesign — 발견된 component-level 이슈는 backlog 이월

## ✅ Definition of Done

- [ ] Paper 아트보드 2 개 생성 + 26 컴포넌트 모두 렌더
- [ ] React dev 서버에서 26 컴포넌트 스크린샷 캡처
- [ ] `findings.md` 작성 (분류 + 증거)
- [ ] paper-sync resolver 가 본 spec 의 코드에서 실제로 import + 사용 (C2 해소)
- [ ] 발견된 token-level drift 가 있으면 tokens.json 수정 + 단위 테스트 PASS
- [ ] 발견 항목 backlog 이월 (필요 시)
- [ ] walkthrough.md + pr_description.md ship
- [ ] 사용자 검토 요청

## 🔗 관련 자료

- 회고 결과: 본 세션의 Opus phase-review 결과 (C1, C2 가 본 spec 의 직접 동기)
- 사용자 피드백: "Paper 와 React 결과물을 유관으로 봐야, fresh page 에서 component + token 들 테스트"
- spec-6-09: `studio/src/lib/paper-sync/` — 본 spec 에서 실 사용
- spec-6-02: `studio/src/lib/paper-normalizer/` — 보조 활용 (값 정규화 필요 시)
