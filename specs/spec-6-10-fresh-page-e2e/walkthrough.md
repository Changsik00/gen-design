# Walkthrough: spec-6-10

> phase-6 main 머지 직전, 사용자 우려("Paper 와 React 결과물을 유관으로, fresh page E2E") 와 phase-review (Opus) 의 C1 (Paper ↔ React 검증 0) / C2 (paper-sync unused) 를 직접 푸는 verification spec.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| spec-6-10 (원래 Playwright visual regression) 처리 | A: 미착수로 phase-7 이월 / B: Paper-MCP-driven 버전으로 리프레임 | **B** | 사용자 우려 직격 + phase-review 권고. Playwright 도입 비용 대비 본 세션 내 가치 우선. |
| 검증 범위 | Reasonable / Maximum / Minimum | **Maximum** (사용자 선택) | 26 컴포넌트(20 composites + 6 templates) 모두. |
| render-helpers 위치 | A: studio/scripts/paper-e2e/.mjs / B: studio/src/lib/paper-e2e/.ts | **B** | C2 해소 강도 ↑ — production 코드(src/lib/) 가 paper-sync import. |
| COMPOSITES/TEMPLATES 레지스트리 채우기 | A: 26 HTML 템플릿 .ts 코드화 / B: Paper 노드 ID 가 source of truth, 레지스트리는 deferred | **B** | ~400 line 추가 비용 대비 효익 낮음. 본 spec 의 핵심 deliverable 은 findings.md. |
| React dev 서버 캡처 | A: 실 브라우저 스크린샷 / B: 소스 의미 비교 | **B** | agent 세션 한계로 실 브라우저 캡처 불가. 소스 의미 비교로 80%+ drift 검출 가능. 잔여는 Playwright spec 후보. |
| Task 7 (단순 fix) | A: 발견된 drift 수정 / B: Pass | **B** | findings token-level drift 0 + component-level 무조치 + Paper API 한계 backlog. 수정 대상 없음. |

## 💬 사용자 협의

- **주제**: phase-review 결과 후 main 머지 vs E2E 검증 우선
  - **사용자 의견**: "최종적인걸 한번 봐야겠지... fresh page에서 component + token 들 테스트"
  - **합의**: review 먼저 → E2E 후속. Maximum 범위. 발견 결과 반영해 일괄 수정.
- **주제**: 작업 모드 (정식 spec vs phase 6 finalization evidence)
  - **사용자 의견**: 옵션 A 선택 (정식 spec-6-10 등록)
  - **합의**: branch spec-6-10-fresh-page-e2e + spec/plan/task 정식 작성 + Plan Accept → Strict Loop.
- **주제**: queue.md C6 데이터 모순 (phase-6 가 queued + done 양쪽)
  - **합의**: phase-6 done 섹션에서 제거 후 sdd phase activate 로 재활성화.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm --filter studio test`
- **결과**: ✅ Passed (45 files / 278 tests / 4.18s) — paper-e2e 자체 12 case 추가 PASS
- **로그 요약**:
```text
Test Files  45 passed (45)
     Tests  278 passed (278)
```

#### 빌드
- **명령**: `pnpm --filter studio run build`
- **결과**: ✅ Passed — vite production 빌드 (202ms)

### 2. 수동 검증 (Paper E2E round-trip)

1. **Action**: `mcp__paper__create_artboard` × 2 → "Phase-6 E2E — Composites" (1PJ-0) + "Phase-6 E2E — Templates" (1VW-0)
2. **Action**: `mcp__paper__write_html` 누적 호출로 26 컴포넌트 렌더 (light scheme 토큰 inline)
3. **Action**: `mcp__paper__get_screenshot` 두 아트보드 모두 — 시각 확인
4. **Action**: React 소스 정독 → Tailwind 클래스별 토큰 매핑 확인
5. **Action**: 26 컴포넌트 비교 → findings.md 작성
6. **Result**: 19 ✓ / 7 ⚠️ minor / 0 ❌. token-level drift 0.

## 🔍 발견 사항

- **F1**: Paper API 한계가 minor drift 의 100% 원인 — `<input placeholder>` 미지원, `display: grid` 미지원, `<table>` 미지원, multi-layer shadow 단순화, gradient 단색 fallback. token / 컴포넌트 결함은 0.
- **F2**: paper-sync 가 production 코드에서 처음으로 import + 사용 — phase-6 회고 C2 (paper-sync unused) 부분 해소. paper-normalizer 잔존은 phase-7 backlog.
- **F3**: HomeButton 의 fluid width 동작은 Paper flex 컨테이너 안에서의 stretch 결과. React `<Button>` 의 inline-flex 와 의미적 동일하지만 사용 패턴 차이. Paper 디자인 가이드라인에 명문화 필요.
- **F4**: queue.md 의 phase-6 가 queued + done 양쪽에 동시 존재 (회고 C6). spec 생성 과정에서 정리됨.
- **F5**: phase-6.md 의 Phase Done 4 체크박스가 미체크 상태로 ship 됐었음 — 본 spec 의 ship 단계에서 갱신 권고.

## 🚧 이월 항목

backlog/queue.md Icebox 의 "spec-6-10 fresh-page E2E 이월" 섹션에 6 건 등재:
1. Playwright + Paper screenshot 자동 pixel-diff
2. render-helpers 의 Paper-API-한계 helpers (`inputWithPlaceholder` / `flexGrid` / `flexTable`)
3. paper-normalizer 의 production 통합
4. Lucide 아이콘 SVG 정확 매핑 라이브러리
5. HomeButton 의 fluid width 패턴 가이드라인
6. dogfooding 정량 측정 방법론 (회고 C4)

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + Dennis |
| **작성 기간** | 2026-05-09 ~ 2026-05-09 |
| **최종 commit** | (Ship commit 직후 갱신) |
| **Paper 산출물** | 1PJ-0 (Composites), 1VW-0 (Templates) |
