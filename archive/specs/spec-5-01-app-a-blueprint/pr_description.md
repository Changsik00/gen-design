# docs(spec-5-01): app-a blueprint artifacts (TaskFlow)

## 📋 Summary

### 배경 및 목적

Phase 1~3 으로 Foundation / Page Template / Blueprint 질의서·카탈로그·템플릿 세트가 갖추어졌고 Phase 4 에서 협업 Flow 프로토콜 + Paper MCP 왕복 실험이 마무리되었다. 그러나 **빈 상태에서 실제 앱을 정의해 본 적이 없었다**. 본 spec 은 샘플 SaaS 앱 (TaskFlow) 1 개를 정해 Blueprint 질의서를 실제로 가동하고, REQUIREMENTS / DESIGN / AGENT 3 종 산출물을 작성하여 파이프라인의 한계를 측정한다.

후속 spec-5-02 (Paper 시안), spec-5-03 (React 구현), spec-5-04 (앱 B 재사용성), spec-5-05 (회고) 의 입력이 된다.

### 주요 변경 사항

- [x] **phase-5 재구성**: 원안 3 spec → 5 spec 으로 분할 (Blueprint / Paper / React / 앱 B / 회고). constitution §5.1 "One Spec = One PR" 준수.
- [x] **TaskFlow 정의 산출물 4 종**:
  - `poc/app-a/blueprint-session.md` — Step 1 / 1.5 / 2 / 3 질의 + 출력 YAML
  - `poc/app-a/REQUIREMENTS.md` — 5 페이지 명세 + Template 매핑 표 + NFR (placeholder 0)
  - `poc/app-a/DESIGN.md` — 14 섹션 초안, i18n 47 키, 토큰 35 참조, 시각 정확값은 의도적 TODO(spec-5-02)
  - `poc/app-a/AGENT.md` — 3-Layer 아키텍처 + 코드 생성 규칙 + PoC 한정 운영 규약
- [x] **회고 자료**: `poc/app-a/findings.md` — 7 항목 (gap 3 / placeholder-mismatch 2 / ambiguity 2). spec-5-05 입력
- [x] **거버넌스 갱신**: `backlog/queue.md` phase-4 Done / phase-5 Active, `backlog/phase-5.md` spec 표 5 종

### Phase 컨텍스트

- **Phase**: `phase-5` (PoC 검증 — End-to-End)
- **본 SPEC 의 역할**: phase-5 통합 시나리오 1 (앱 A End-to-End) 의 첫 단계. spec-5-02 / 5-03 가 본 산출물을 입력으로 사용

## 🎯 Key Review Points

1. **앱 A 컨셉의 적정성**: TaskFlow / SaaS / 인디고+청록 / 5 페이지가 PoC 가설 검증에 충분한 다양성을 제공하는가. 부족하면 spec-5-02 / 5-03 단계에서 페이지 / variant 추가 가능
2. **DESIGN.md 의 의도적 미완 (TODO)**: 정확 hex / shadow / size 를 spec-5-02 로 분리한 결정. Phase 4 회고 W2 (Blueprint vs Compose 측정 분리) 부채 반영. 즉시 채울지 분리 유지할지 사용자 판단
3. **findings.md 7 항목**: 본 PoC 의 가장 가치있는 산출물. spec-5-05 회고 입력으로 활용. 항목 누락 / 분류 오류 / 추가 발견이 있는지 확인
4. **phase-5 spec 재구성**: 5 spec 분할이 충분한지, 더 잘게 / 굵게 나눠야 하는지

## 🧪 Verification

### 자동 테스트

본 spec 은 코드 산출물이 없는 문서 PoC 로 단위 테스트 부재. 대신 자기검증 체크리스트 (Task 7) 수행.

### 자기검증 결과 (수동)

```bash
# 1. Placeholder 잔존 0
grep -c '{{' poc/app-a/{REQUIREMENTS,DESIGN,AGENT,blueprint-session}.md
# → 모두 0

# 2. Page ID 카탈로그 일치
grep -oE 'auth-login|auth-signup|dash-overview|profile-mypage|common-error' poc/app-a/*.md | sort -u
# → 5 종 모두 schema/page-catalog.md 등재

# 3. i18n 키 커버리지
grep -cE '^\| `(login|signup|dashboard|mypage|error|nav|app|auth)\.' poc/app-a/DESIGN.md
# → 47

# 4. 토큰 표기 규약
grep -cE '\-\-(color|font|space|radius)' poc/app-a/DESIGN.md
# → 35
```

**결과 요약**:
- ✅ Placeholder 0 잔존 (모든 산출물)
- ✅ Page ID 카탈로그 일치 (5 / 5)
- ✅ i18n 키 47 (5 페이지 + nav + app + auth 네임스페이스)
- ✅ 토큰 35 회 참조 (Phase 1 컨벤션 일치)
- ✅ findings 7 항목 등재 (최소 3 초과)

## 📦 Files Changed

### 🆕 New Files

- `specs/spec-5-01-app-a-blueprint/spec.md`: 본 spec 정의 (요구사항 / DoD / Out of Scope)
- `specs/spec-5-01-app-a-blueprint/plan.md`: 8 task 실행 계획 + 자기검증 항목
- `specs/spec-5-01-app-a-blueprint/task.md`: 7 commit + 1 ship 작업 분해
- `specs/spec-5-01-app-a-blueprint/walkthrough.md`: 작업 기록 (본 PR 의 페어)
- `specs/spec-5-01-app-a-blueprint/pr_description.md`: 본 문서
- `poc/app-a/.gitkeep`: PoC 디렉토리
- `poc/app-a/blueprint-session.md`: Blueprint Step 1 / 1.5 / 2 / 3 + 통합 YAML
- `poc/app-a/REQUIREMENTS.md`: TaskFlow 기능 요구사항 (5 페이지)
- `poc/app-a/DESIGN.md`: TaskFlow 디자인 시스템 (14 섹션, 시각 상세는 TODO)
- `poc/app-a/AGENT.md`: AI 에이전트 운영 규약
- `poc/app-a/findings.md`: 7 항목 회고

### 🛠 Modified Files

- `backlog/phase-5.md`: 5 spec 재구성 + sdd:specs 표 + 시퀀스 번호 정리 (`spec-5-001` → `spec-5-01`)
- `backlog/queue.md`: phase-4 Done 마킹, phase-5 Active 마커, queued 표 갱신

**Total**: 13 files changed (11 new + 2 modified)

## ✅ Definition of Done

- [x] `poc/app-a/blueprint-session.md` 작성 (Step 1~3 + 출력 YAML)
- [x] `poc/app-a/REQUIREMENTS.md` 작성 (placeholder 0 잔존)
- [x] `poc/app-a/DESIGN.md` 작성 (스키마 준수, 시각 상세는 의도적 TODO)
- [x] `poc/app-a/AGENT.md` 작성
- [x] `poc/app-a/findings.md` 작성 (7 항목)
- [x] 자기검증 체크리스트 PASS (placeholder 0 / Page ID / i18n / 토큰 / findings)
- [x] `walkthrough.md` + `pr_description.md` 작성 및 ship commit
- [ ] `spec-5-01-app-a-blueprint` 브랜치 push 완료 (push 직전)
- [ ] 사용자 검토 요청 알림 완료 (PR 생성 후)

## 🔗 관련 자료

- Phase: `backlog/phase-5.md`
- Walkthrough: `specs/spec-5-01-app-a-blueprint/walkthrough.md`
- PoC 산출물: `poc/app-a/`
- Findings 입력처: spec-5-05 (회고), phase-6 (Studio v1)
- Phase 4 회고 부채 연결: queue.md Icebox §"거버넌스 부채 — phase-4 회고 발견"
