# Walkthrough: spec-3-04-ship-fixup

> phase-3 독립 감사에서 드러난 Critical 4건 (C1~C4) 정리 및 dogfooding 실체화 작업 기록.
> phase base branch 에 쌓이는 마지막 spec 으로, Phase PR #14 머지 전 정직 채점의 근거가 된다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| C2 이주 방식 | A) 심볼릭 링크 / B) 빌드 복사 / C) Vite alias | **C Vite alias** | symlink 는 Windows 관리자 권한·`core.symlinks=false` 손상·pnpm workspace symlink 와 이중 꼬임·HMR/Docker 불안정 등 6가지 리스크. 빌드 복사는 이중 source-of-truth + watcher 지연. alias 는 크로스플랫폼·IDE/TS 1급 지원·빌드 단계 추가 불요 |
| C4 정합 방향 | A) 템플릿 placeholder 제거 / B) 질의서 YAML 에 12필드 추가 | **B 필드 추가** | placeholder 제거는 REQUIREMENTS.md 정보 밀도 저하. 질의서는 사용자가 답하는 구조이므로 필드 추가가 자연스럽고 Step 1.5 비기능 요구사항 질의로 일괄 수집 가능 |
| schema 접근 방식 | A) flat key / B) nested (`{{obj.field}}`) | **B nested** | Fill Executor 가 이미 `{{obj.field}}` 해석 규칙을 포함. flat 화 하면 category 구분 소실 — 의미 구조 유지 우선 |
| `tokens.dark.json` / `tokens.semantic.json` 이주 (plan 기재) | 계획대로 / 실제 파일 기준 | **실제 파일 (`tokens.json`, `tokens-brand-b.json`) 기준** | plan 작성 시 파일명을 추정으로 적었으나 실파일 확인 후 `tokens-brand-b.json` 으로 정정. dark/semantic 은 `tokens.json` 내부 계층으로 존재 |
| `.harness-uninstall-backup-20260417-135520/` 물리 삭제 | 즉시 삭제 / `.gitignore` 만 추가 | **`.gitignore` 만 추가** | `rm -rf` 권한 거부됨 + harness upgrade 롤백용 백업이라 보관 여부는 사용자 판단 영역. git 시야에서 제거하는 것이 최소·안전 조치 |
| Phase PR #14 body 갱신 시점 | 본 spec 작업 중 동시에 / spec-3-04 머지 후 | **spec-3-04 머지 후** | #14 는 이미 승인 상태. 중간에 본문만 수정하면 리뷰 타임라인이 흐트러짐. spec-3-04 가 phase 브랜치에 머지된 뒤 한 번에 갱신하는 것이 commit 이력과 정합 |

## 💬 사용자 협의

- **주제**: Phase Ship 도중 세션 종료 → 컨텍스트 복구
  - **사용자 의견**: "context 를 다시 가져 올 수 있을까?"
  - **합의**: PR #14 가 이미 열린 상태 확인 → phase-review 로 본 spec 분기 결정

- **주제**: Phase-3 회고 결과 대응 옵션
  - **사용자 의견**: "1번으로 시행" (Critical 4건을 새 spec 으로 묶어 phase 브랜치에 추가 커밋)
  - **합의**: spec-3-04-ship-fixup 생성, FR1~FR6 로 범위 확정, W3 variant 보강 등은 phase-5/spec-x 로 이월

- **주제**: 심볼릭 링크 위험 지적
  - **사용자 의견**: "심볼릭 링크는 위험성이 있음 지금 이렇게 하려고 한건 왜 였을까?"
  - **합의**: plan 에 symlink/빌드 복사 3-옵션 나열 자체가 잘못된 판단 prior. Vite alias 단일 결정으로 정정, README 도 기각 근거 보존 형태로 정리

- **주제**: 후속 Phase 와의 연관 확인
  - **사용자 의견**: "phase 다음 단계에 있는것들 중 지금 작업 하고 있는거와 연관 있는게 있을까?"
  - **합의**: phase-4 spec-4-003, phase-5 spec-5-001/002, phase-6 spec-6-004/005, phase-7 spec-7-004 와 직접 연관 확인. 후속 phase.md 수정은 불요 (각 phase 시작 시 spec 재정의 시점에 반영 — option A)

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm --dir /Users/dennis/Project/Design/studio build` 및 `pnpm -s exec vitest run` (cwd: studio)
- **결과**: ✅ Passed
- **로그 요약**:
```text
> studio@0.0.0 build
> node tokens/build.mjs && tsc -b && vite build

✔︎ src/styles/_tokens-light.css
✔︎ src/styles/_tokens-dark.css
✔︎ src/styles/_tokens-brand-b.css
vite v8.0.8 building client environment for production...
✓ 1906 modules transformed.
dist/assets/index-BlUwU6xg.js  314.99 kB │ gzip: 100.58 kB
✓ built in 149ms

 RUN  v4.1.4 /Users/dennis/Project/Design/studio
 Test Files  12 passed (12)
      Tests  63 passed (63)
```

#### 통합 테스트
- **Integration Test Required**: no (phase-5 PoC 에서 실제 Blueprint→REQUIREMENTS 변환으로 대체)

### 2. 수동 검증

1. **Action**: `ls templates/assets/{i18n,tokens}/`
   - **Result**: `ko.json, en.json` / `tokens.json, tokens-brand-b.json` 실파일 확인 ✅
2. **Action**: `cat templates/DESIGN.md.template | head -20`
   - **Result**: 헤더 + 14 섹션 placeholder 구조 확인, assets 경로 안내 포함 ✅
3. **Action**: `grep -n "Fill Executor" schema/blueprint-protocol.md`
   - **Result**: `## 변환 실행 주체 (Fill Executor)` 섹션 존재 ✅
4. **Action**: REQUIREMENTS.md / AGENT.md / DESIGN.md.template 의 `{{...}}` 전수 grep
   - **Result**: 모든 placeholder 가 schema (nested) + 자동 주입 + literal 중 하나로 분류됨, 누락/잉여 0건 ✅
5. **Action**: `git status --ignored | grep harness-uninstall-backup`
   - **Result**: `.gitignore` 패턴 적용, working tree 에서 untracked 제거 ✅

## 🔍 발견 사항

- **plan 작성 시 파일명 추정 위험**: `studio/tokens/` 의 실제 파일(`tokens.json`, `tokens-brand-b.json`)과 plan 의 추정(`tokens.dark.json`, `tokens.semantic.json`) 불일치. 향후 plan 에서 파일명 언급 시 **ls 확인 필수** 를 규칙화 후보로 제안.
- **tsconfig.app.json `include: ["src"]` 와 `../templates/assets/*.json`**: bundler mode + resolveJsonModule 조합에서 include 밖 JSON 이 paths 를 통해 참조 가능함을 실증. `include` 확장 불필요.
- **README.md L114 디렉토리 트리 ↔ 실제 산출물 불일치 (phase-3 감사의 C1)**: 트리에는 `DESIGN.md.template` 이 있었지만 실파일은 없던 상태. 트리를 SSOT 로 두고 산출물 존재 여부를 CI 검증 후보로 추가할 만함.
- **Blueprint Step 3 출력이 "최종 통합" 으로 명시되지 않음 (감사의 C4 원인)**: 이전에는 각 Step 의 "내부 상태" 로만 표기되어 하류 소비자가 어떤 구조를 받는지 불명확. 본 spec 에서 "최종 출력" 명명으로 정리.

## 🚧 이월 항목

- **W3 카탈로그 variant 2+ 보강** (18페이지 중 9개 단일 variant) → phase-5 PoC 에서 실사용 검증 후 판단
- **W2 spec ID 자릿수 통일** (`spec-3-01` vs `spec-3-001` 본문 표기 불일치) → 거버넌스 spec-x 별도
- **W8 매핑 명세 예시 코드 정확도** (FormSection / CredentialBlock 등 가상 이름) → 후속 phase 에서 실제 composite 1:1 검증
- **`.harness-uninstall-backup-20260417-135520/` 물리 삭제** → 사용자 판단 (harness upgrade 롤백용 백업 보관 여부)
- **Phase PR #14 body 정직 채점 수정** → spec-3-04 머지 직후 `gh pr edit 14` 실행 예정 (3 PASS / 2 PARTIAL → PATCHED 로)

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Claude Opus 4.7) + Dennis |
| **작성 기간** | 2026-04-19 |
| **commit 수** | 7 (브랜치 생성 제외) |
| **최종 commit** | `4c26ae2` (FR6 시점, ship commit 는 본 walkthrough 포함 직후) |
