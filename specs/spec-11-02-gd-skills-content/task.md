# Task List: spec-11-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-11.md SPEC 표 자동 갱신됨)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-11-02-gd-skills-content`
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: `.gd/memory/` 4 entry 초기 양식

### 2-1. 4 memory entry 작성 + postprocess 갱신 (TDD)
- [ ] `presets-bundled/default/.gd/memory/designer.md` (frontmatter: user)
- [ ] `presets-bundled/default/.gd/memory/decisions.md` (frontmatter: project, history pattern)
- [ ] `presets-bundled/default/.gd/memory/feedback.md` (frontmatter: feedback)
- [ ] `presets-bundled/default/.gd/memory/MEMORY.md` 보강 (4 entry 모두 인덱스)
- [ ] `packages/create-gd-react/src/postprocess.ts` — `initMemoryIfPresent` 에 4 entry 초기화 추가
- [ ] `packages/create-gd-react/__tests__/postprocess.test.ts` — 4 entry 생성 검증 + idempotent
- [ ] `pnpm --filter create-gd-react test --run` PASS 확인
- [ ] Commit: `feat(spec-11-02): add 4 .gd/memory entries (designer/project/decisions/feedback) + postprocess init`

---

## Task 3: gd-start 스킬 본문

### 3-1. gd-start.md 본문 작성
- [ ] §1 환영 + 본 프로젝트 의도
- [ ] §2 자동 로딩 컨텍스트 명세
- [ ] §3 디자이너 정보 1-2 질문 + designer.md append
- [ ] §4 프로젝트 정보 1-2 질문 + project.md append
- [ ] §5 4축 어휘 5분 요약 (chat ≡ Paper ≡ React ≡ shadcn ≡ MSW)
- [ ] §6 워크플로 다이어그램
- [ ] §7 다음 단계 (/gd-token → /gd-design → /gd-chat)
- [ ] §8 FAQ
- [ ] Commit: `feat(spec-11-02): write gd-start skill body (onboarding + 4-axis summary)`

---

## Task 4: gd-chat 스킬 본문

### 4-1. gd-chat.md 본문 작성
- [ ] §1 자동 로딩: FRONT/DESIGN/_shell/기존 scenes
- [ ] §2 "어떤 화면?" 질문 + memory/project 활용
- [ ] §3 카탈로그 후보 컴포넌트 추천 (LoginScene 예시)
- [ ] §4 파일 위치 자동 결정 + 디렉토리 자동 생성
- [ ] §5 frontmatter 템플릿 자동 삽입
- [ ] §6-§8 Narrative / Structure / History 3층 walkthrough
- [ ] §9 컴파일 명령 안내
- [ ] §10 안티 패턴
- [ ] Commit: `feat(spec-11-02): write gd-chat skill body (catalog recommendation + 3-layer walkthrough)`

---

## Task 5: gd-token 스킬 본문

### 5-1. gd-token.md 본문 작성
- [ ] §1 자동 로딩: TOKEN.md + tokens.json + memory/project
- [ ] §2 shadcn 표준 토큰 이름 잠금 (이름 변경 요청 거부 + 이유)
- [ ] §3 light + dark 동기 변경 유도
- [ ] §4 WCAG 2.1 AA 8 페어 자동 검증
- [ ] §5 미달 시 가장 가까운 합격 OKLCH 제안
- [ ] §6 cva variant 매핑 (Button 6 variant)
- [ ] §7 결정 후 memory/decisions.md append
- [ ] §8 안티 패턴
- [ ] Commit: `feat(spec-11-02): write gd-token skill body (shadcn token lock + WCAG AA auto-check)`

---

## Task 6: gd-design 스킬 본문

### 6-1. gd-design.md 본문 작성
- [ ] §1 자동 로딩: DESIGN.md + FRONT.md Tier 3 + memory/project
- [ ] §2 빈 섹션 자동 감지
- [ ] §3 Stitch 9 섹션 walkthrough (각 섹션 질문 1-2)
- [ ] §4 gen-design 확장 2 (i18n + Components 어휘)
- [ ] §5 §8 Components — 어휘 정의 + catalog 동기화
- [ ] §6 작성 후 gd doctor 안내
- [ ] §7 안티 패턴
- [ ] Commit: `feat(spec-11-02): write gd-design skill body (Stitch 9 + gen-design extensions)`

---

## Task 7: 통합 테스트 갱신

### 7-1. test-integration.sh 갱신
- [ ] `EXPECTED_FILES` 에 추가: designer.md / decisions.md / feedback.md
- [ ] 4 스킬 파일 본문 길이 검증 (wc -l ≥ 100)
- [ ] Memory entry 들 frontmatter 형식 검증 (`name:` / `description:` / `type:`)
- [ ] 통합 테스트 PASS 확인
- [ ] Commit: `test(spec-11-02): verify skill bodies and memory entries in integration test`

---

## Task 8: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm --filter create-gd-react lint`
- [ ] 단위 테스트: `pnpm --filter create-gd-react test --run`
- [ ] 통합 테스트: `bash packages/create-gd-react/scripts/test-integration.sh`
- [ ] 기존 회귀: `pnpm --filter studio test --run`
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-11-02): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-11-02-gd-skills-content`
- [ ] **PR 생성**: `gh pr create --base phase-11-designer-onboarding-skill`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **예상 commit 수** | 8 (pre-flight 1 + Task 1: 0 (브랜치) + Task 2-7: 6 + Task 8: 1) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |

---

## 작업 의존성

```
Task 1 (브랜치)
  ↓
Task 2 (memory 4 entry + postprocess)
  ↓
Task 3-6 (스킬 4종 본문 — 병렬 가능하지만 순차로)
  ↓
Task 7 (통합 테스트 갱신)
  ↓
Task 8 (Ship)
```
