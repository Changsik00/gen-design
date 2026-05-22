# docs(spec-4-01): 협업 Flow 프로토콜

> Designer · Frontend · AI Agent 3 역할 × 6 단계 (Ideate → Iterate) 협업 규칙을 단일 문서로 정의.
> docs-only. 코드 변경 없음.

## 📋 Summary

### 배경 및 목적

Phase 1~3 에서 Foundation (tokens) / Page Template (LoginPage 등) / App Blueprint (카탈로그 + 질의 프로토콜 + 템플릿 세트) 가 완성됐지만, 이를 **누가 · 언제 · 어떤 순서로** 사용하는지에 대한 협업 프로토콜은 공백 상태였다. Figma Dev Mode 가 업계 표준이지만 "디자인 → 코드" 단방향만 고려 — AI 에이전트가 피드백 루프에 참여하는 프로토콜은 선례가 없다.

본 PR 은 `docs/guides/collaboration-flow.md` 를 **단일 진입점 문서** 로 도입해 이 공백을 메우고, 후속 PoC spec (`spec-4-02` Paper MCP / `spec-4-03` Figma 동기화) 이 검증할 **훅 앵커** 를 사전에 노출한다.

### 주요 변경 사항

- [x] `docs/guides/collaboration-flow.md` 신규 (391 lines) — 6 단계 × 3 역할 × 5 필드 (입력 / 출력 / 역할 / 도구 / Done) 프로토콜
- [x] Phase 1~3 산출물 매핑 표 (10 항) 포함
- [x] 부록 A 도구 매핑 (시안 읽기 / 쓰기 / 토큰 동기화 — Paper / Figma / Tokens Studio)
- [x] 부록 B 관련 문서 9 개 cross-link
- [x] PoC 훅 앵커 7 개 (`hook-paper-extract`, `hook-paper-render`, `hook-figma-token-sync` 등)
- [x] 양방향 cross-link: `docs/integrations/{paper-mcp,figma-sync}.md` / `docs/guides/e2e-demo-loginpage.md` 상단에 `> [!NOTE]` admonition 추가
- [x] 내부 상대 링크 9/9 유효 (grep 기반 수동 검증)

### Phase 컨텍스트

- **Phase**: `phase-4` (협업 Flow 정의)
- **Base Branch**: `phase-4-collab-flow` — 본 PR 의 타겟
- **본 SPEC 의 역할**: Phase 4 의 첫 번째 spec. 후속 `spec-4-02` (Paper MCP PoC) / `spec-4-03` (Figma 동기화 PoC) 가 참조할 **프로토콜 앵커** 를 확립. Phase 4 의 1~3번 목표 중 1번 ("협업 Flow 프로토콜 문서화") 에 직접 대응.

## 🎯 Key Review Points

1. **3 역할 중 AI Agent 를 1 급 역할로 명시** (§2.3) — 업계 표준 대비 선도적 선택. Phase 5 PoC 에서 이 구분의 실효성을 검증해야 함.
2. **6 단계 명칭 확정** — `Ideate / Extract / Blueprint / Compose / Render / Iterate`. 이 이름들이 후속 spec / PR / 코드 주석에서 일관되게 쓰일 것이므로 이름 변경 비용이 시간에 따라 증가.
3. **도구 중립 서술 + 부록 분리 구조** (§4 vs 부록 A) — 새 도구 추가 시 본문 불변 보장. Paper MCP / Figma 중 어느 하나에 본문이 얽히지 않았는지 점검 요청.
4. **PoC 훅 앵커** (§4.2 / §4.5 / §4.6) — `hook-paper-extract`, `hook-paper-render`, `hook-figma-token-sync`. spec-4-02 / 03 에서 한 줄 인용할 수 있도록 설계. 네이밍이 직관적인지 의견 환영.
5. **Phase 1~3 매핑 표** (§5) — 10 항 모두 실제 산출물에 대응. 누락된 산출물이 있는지 교차 확인 부탁.
6. **cross-link admonition 위치** — `> [!NOTE]` 을 각 문서 h1 타이틀 바로 아래에 배치. GitHub 렌더링에서 시각 구분 양호.

## 🧪 Verification

### 자동 테스트

```bash
# docs-only — 전통적 단위 테스트 해당 없음
# 대신 내부 링크 유효성 grep
grep -Eo "\]\([^)]+\.md[^)]*\)" docs/guides/collaboration-flow.md | sort -u
```

**결과 요약**:
- ✅ `collaboration-flow.md` 내부 링크 9/9 실재 파일 확인
- ✅ cross-link 3 개 파일 (`paper-mcp.md`, `figma-sync.md`, `e2e-demo-loginpage.md`) 상단 admonition 추가 확인

### 통합 테스트

- 해당 없음 (Integration Test Required = no)

### 수동 검증 시나리오

1. **Onboarding 시나리오** — 본 문서만 읽고 신규 팀원이 LoginPage 로 "시안 → 배포" 순서를 재현 설명 가능 → ✅
2. **AI Agent 자기참조 시나리오** — §4.3 를 로드 시 "나는 Stage 3 Blueprint 실행 중" 인식 가능 → ✅
3. **PoC 참조 시나리오** — spec-4-02 spec.md 가 `collaboration-flow.md#hook-paper-extract` 로 한 줄 인용 가능 → ✅
4. **도구 교체 사고 실험** — Paper → 다른 MCP 교체 시 본문 불변, 부록 A 에만 열 추가로 대응 → ✅

## 📦 Files Changed

### 🆕 New Files

- `docs/guides/collaboration-flow.md` (+391): 협업 Flow 프로토콜 본문
- `specs/spec-4-01-collab-flow-protocol/{spec,plan,task,walkthrough,pr_description}.md`: SDD 산출물

### 🛠 Modified Files

- `docs/integrations/paper-mcp.md` (+3, -0): 상단 `> [!NOTE]` 추가 (Stage 2 / 5 훅 인용)
- `docs/integrations/figma-sync.md` (+3, -0): 상단 `> [!NOTE]` 추가 (Stage 2 / 6 훅 인용)
- `docs/guides/e2e-demo-loginpage.md` (+3, -0): 상단 `> [!NOTE]` 추가 (E2E 구현 사례 명시)
- `backlog/phase-4.md` (+2, -2): 메타 `Base Branch: phase-4-collab-flow`, 상태 `In Progress`, 시작일 `2026-04-21`; spec 표 spec-4-01 row
- `backlog/queue.md`: active phase 마커 phase-4, queued 표에서 phase-3 Done / phase-4 Active

### 🗑 Deleted Files

없음

**Total**: 6 파일 수정 + 6 파일 신규 (spec 디렉토리 포함)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (해당 없음 / 링크 유효성 grep 9/9 PASS 로 대체)
- [x] 통합 테스트 통과 (해당 없음)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] lint / type check 통과 (해당 없음 — docs-only)
- [x] 사용자 검토 요청 알림 완료 (본 PR 생성 시점)

## 🔗 관련 자료

- Phase 정의: `backlog/phase-4.md`
- Walkthrough: `specs/spec-4-01-collab-flow-protocol/walkthrough.md`
- 본 SPEC 이 참조하는 Phase 1~3 산출물:
  - `schema/design-md-schema.md` (14 섹션)
  - `schema/blueprint-protocol.md`
  - `schema/page-catalog.md`
  - `schema/design-component-mapping.md`
  - `templates/{DESIGN,REQUIREMENTS,AGENT}.md.template`
- 후속 spec (참조 훅 소비): `spec-4-02` Paper MCP PoC, `spec-4-03` Figma 동기화 PoC
