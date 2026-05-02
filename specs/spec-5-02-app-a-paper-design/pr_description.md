# docs(spec-5-02): app-a Paper 시안 5 페이지 + Settings 신설 + 원본 의도 보존 검증

## 📋 Summary

### 배경 및 목적

phase-5 (PoC 검증) 의 두 번째 spec. spec-5-01 의 `poc/app-a/DESIGN.md` (앱 A "TaskFlow") 를 입력으로 Paper MCP 5 페이지 디자인 시안을 작성하고, 추출 사이클을 통해 *AI 입력 의도가 어떻게 보존/손실되는지* 측정한다.

핵심 질문 — "DESIGN.md → Paper artboard → DESIGN.md 회귀의 사이클에서 토큰 / 컴포넌트 / i18n 이 보존되는가" — 에 대해 5 페이지 평균 0.83, Settings AI 사이클 96.9% 보존도로 **PASS**.

### 주요 변경 사항

- [x] **Paper artboard 5 페이지 작성** — Login (modal) / Signup (split-screen) / Dashboard (shell) / MyPage (shell) / Settings (shell, AI Radix-based)
- [x] **DESIGN.md Settings 페이지 정의 추가** — §10/§11/§12/§14 보강 (Page Map / Page Spec / Composite 4 종 / i18n 16 키)
- [x] **DESIGN.md TODO(spec-5-02) 마커 14 곳 모두 채움** — Primary `#4F46E5` / Primary-hover `#4338CA` / Accent `#0EA5B7` / Status 4 종 / elevation 5 단계 / Token Mapping 표 hex 컬럼 일괄
- [x] **5 페이지 design-extract 작성** — `poc/app-a/design-extract/{auth-login,auth-signup,dash-overview,profile-mypage,settings-overview}.md` (각 14 섹션 PASS)
- [x] **drift-report.md** — 5 페이지 × N 항목 drift 표 + 표기 정규화 5 카테고리 + 페이지별 점수 (평균 0.83) + 결론
- [x] **intent-preservation.md** — Settings AI 사이클 보존도 측정 (32 항목 중 31 보존 = **96.9 %**)
- [x] **findings.md F-08 ~ F-10 추가** — paper-normalizer 5 카테고리 / DESIGN.md §12 Composite 9 종 미정의 / i18n 키 모델 확장
- [x] **Icebox 등재** — LoginPage variant 확장 / DashboardPage 왕복 drift (사용자 방향 전환에 따른 보류)

### Phase 컨텍스트

- **Phase**: `phase-5` (PoC 검증, End-to-End)
- **본 SPEC 의 역할**: phase-5 의 두 번째 spec. spec-5-01 (Blueprint → DESIGN.md) 의 출력을 입력으로 *시각 디자인 정확값* 을 채우고, *원본 의도 보존 검증* 사이클로 AI 베이스 파이프라인의 신뢰도를 측정. spec-5-03 (React 구현) 의 입력 (DESIGN.md TODO 채워진 상태 + 신규 Composite 9 종 / i18n 키 확장 요구사항) 을 준비.

## 🎯 Key Review Points

1. **AI 베이스 일관성 결정 (2026-05-02)** — Settings 도 AI Radix-based 자동 생성. 사용자 결정에 따라 Designer 인적 단계 제거. *원본* 의 의미를 *Designer 의도* → *AI 입력 의도 (DESIGN.md + Radix UI reference)* 로 재정의. spec.md / plan.md / intent-preservation.md / task.md 일괄 갱신 (commit `96a5244`). 측정 본질 (입력 → 출력 → 재추출 보존도) 은 유지.

2. **96.9 % 보존도의 의미** — Settings AI 사이클에서 32 항목 중 31 항목 보존. 손실 영역은 위계 1 단계 shift (H3 18→16) / spacing 24→32 확장 — 둘 다 cosmetic / 페이지 위계 의도. 본질적 손실 0 건. 추가 카피 19 건 + Composite 3 건은 *손실 아닌 확장* (정적 → 동적). PoC 가설 PASS.

3. **i18n 이 가장 큰 drift 영역 (0.65)** — DESIGN.md §14 의 *flat 카피* 모델로는 helper / value enum / action label 같은 *컨텍스트 부가어* 를 담지 못함. F-10 으로 등재, spec-5-03 또는 phase-6 에서 키 모델 확장.

4. **Radix UI reference 활용 거리** — layout / 구조 패턴 (Switch / Select / Slider / group + divider / danger zone) 은 흡수, 토큰 (TaskFlow indigo / slate) 은 미차용. 외부 reference 의 *형식* 만 활용하고 *내용* 은 본 시스템 우선.

5. **paper-normalizer 함수 5 카테고리 (F-08)** — Paper export 표기 (color alpha hex8 / paddingBlock·Inline / lineHeight round / font fallback / border 분리) 와 React/CSS 표준 사이의 정규화 함수. phase-6 Studio v1 의 첫 spec 후보.

## 🧪 Verification

### 자동 테스트 (schema 정합성)

```bash
grep -c "^## " poc/app-a/DESIGN.md
# 15 (14 섹션 + 부록)

for f in poc/app-a/design-extract/*.md; do echo "$f: $(grep -c '^## ' "$f")"; done
# 모두 14 PASS
```

**결과 요약**:
- ✅ DESIGN.md schema 정합성: 14 섹션 + 부록 = 15
- ✅ design-extract 5 파일 모두 14 섹션 PASS

### 통합 테스트 (Integration Test Required = yes)

```bash
grep -c "TODO(spec-5-02)" poc/app-a/DESIGN.md
# 0

wc -l poc/app-a/drift-report.md poc/app-a/intent-preservation.md
# 227 / 150 lines

ls poc/app-a/design-extract/*.md | wc -l
# 5
```

**결과 요약**:
- ✅ TODO(spec-5-02) 마커 0 개 (모두 채움)
- ✅ drift-report.md / intent-preservation.md 모두 충실 작성 (227 / 150 lines)
- ✅ design-extract 5 파일

### 수동 검증 시나리오

1. **DESIGN.md 의 모든 색·그림자·size 단위가 추출값으로 채워졌는지** → 14 마커 모두 채움, grep 결과 0 PASS.
2. **Settings 의 원본 의도 vs 추출 결과 항목별 비교** → `intent-preservation.md` §2.1~2.5, 32 항목 중 31 보존 (96.9%).
3. **5 페이지 drift 패턴 일관성** → `drift-report.md` §3 점수표 + §3.2 5 패턴 요약. 토큰 0.96 / i18n 0.65.
4. **5 페이지 Paper artboard 가시성 확인** → walkthrough.md "수동 검증" 1 항목, 모든 artboard `get_screenshot` 검수 OK.
5. **paper-normalizer 함수 후보 식별** → `findings.md` F-08, 5 함수 카테고리 + 시그니처 + 변환 예시.

## 📦 Files Changed

### 🆕 New Files

- `poc/app-a/intent-preservation.md`: Settings 입력 의도 (DESIGN.md + Radix UI) 의 AI 사이클 보존도 측정. §1 의도 선언 + §2 추출 결과 비교 + 96.9 % 결론.
- `poc/app-a/drift-report.md`: 5 페이지 × N 항목 drift 표 + 표기 정규화 5 카테고리 + 페이지 점수 + 결론.
- `poc/app-a/design-extract/auth-login.md`: Login artboard `1CH-0` 의 schema 14 섹션 추출.
- `poc/app-a/design-extract/auth-signup.md`: Signup artboard `1DR-0` 추출.
- `poc/app-a/design-extract/dash-overview.md`: Dashboard artboard `1FI-0` 추출.
- `poc/app-a/design-extract/profile-mypage.md`: MyPage artboard `1J5-0` 추출.
- `poc/app-a/design-extract/settings-overview.md`: Settings artboard `1LR-0` 추출 (AI Radix-based).
- `specs/spec-5-02-app-a-paper-design/spec.md`: 본 spec 정의.
- `specs/spec-5-02-app-a-paper-design/plan.md`: 실행 계획 (Branch / Decisions / Verification / Rollback).
- `specs/spec-5-02-app-a-paper-design/task.md`: 9 task 정의 + 진행 추적.
- `specs/spec-5-02-app-a-paper-design/walkthrough.md`: 작업 기록 + 결정 / 협의 / 검증 / 발견.
- `specs/spec-5-02-app-a-paper-design/pr_description.md`: 본 파일.

### 🛠 Modified Files

- `poc/app-a/DESIGN.md` (+86, -32): §10 Settings 행 / §11 settings-overview 섹션 / §12 Settings Composite 4 종 / §14 settings.* 16 키 + §2 / §6 / §13 의 TODO 마커 14 곳 모두 추출값으로 채움.
- `poc/app-a/findings.md` (+71, -20): spec-5-02 의 F-08 ~ F-10 추가 + 머리말 갱신 (누적 10 항목) + 처리 채널 명시.
- `backlog/phase-5.md`: spec-5-01 → Merged + spec-5-02 정의 갱신 (Settings 신설 / 원본 의도 보존 / Phase 4 이월 분할).
- `backlog/queue.md`: Icebox 에 `phase-5 이월 follow-ups` 신규 섹션 (LoginPage variant / DashboardPage drift).
- `.gitignore`: harness-kit 섹션 정렬.
- `specs/spec-5-01-app-a-blueprint/task.md`: ship 후처리 체크박스 갱신.

**Total**: 12 new / 6 modified = **18 files changed**

## ✅ Definition of Done

- [x] 5 페이지 Paper artboard 작성 (Login `1CH-0` / Signup `1DR-0` / Dashboard `1FI-0` / MyPage `1J5-0` / Settings `1LR-0`)
- [x] DESIGN.md 의 Settings 페이지 정의 추가 (Page Map / Page Spec / Composite / i18n)
- [x] DESIGN.md 의 TODO(spec-5-02) 마커 0 개 (모두 채움) — 통합 테스트 PASS
- [x] design-extract 5 파일 (각 14 섹션 PASS)
- [x] drift-report.md (5 페이지 평균 점수 0.83, 결론 포함)
- [x] intent-preservation.md (Settings 보존도 96.9%)
- [x] findings.md F-08 ~ F-10 추가
- [x] (단위 테스트 해당 없음 — 코드 변경 없는 디자인·문서 spec)
- [x] (통합 테스트 = yes) drift 표 / 의도 보존 표 모두 작성, 합리적 결론 도출
- [x] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [x] `spec-5-02-app-a-paper-design` 브랜치 push 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-5.md`
- Spec: `specs/spec-5-02-app-a-paper-design/spec.md`
- Plan: `specs/spec-5-02-app-a-paper-design/plan.md`
- Task: `specs/spec-5-02-app-a-paper-design/task.md`
- Walkthrough: `specs/spec-5-02-app-a-paper-design/walkthrough.md`
- Drift Report: `poc/app-a/drift-report.md`
- Intent Preservation: `poc/app-a/intent-preservation.md`
- Design Extracts: `poc/app-a/design-extract/*.md` (5 파일)
- Findings: `poc/app-a/findings.md` (F-08 ~ F-10)
- 이전 spec: `specs/spec-5-01-app-a-blueprint/` (Merged at PR #20)
- 다음 spec: `spec-5-03` (앱 A React 구현) — 본 spec 의 DESIGN.md 채워진 상태 + Composite 9 종 보강 요구사항 + i18n 키 모델 확장이 입력
