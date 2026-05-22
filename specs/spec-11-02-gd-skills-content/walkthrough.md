# Walkthrough: spec-11-02 — `.claude/skills/gd-*` 본문 + `.gd/memory/` 디스크 캐시

## 실행 증거

### 1. 단위 테스트 — 28 PASS (25 → 28, +3)

```
> create-gd-react@0.1.0 test
> vitest run

 Test Files  4 passed (4)
      Tests  28 passed (28)
   Duration  227ms
```

추가된 3 tests (postprocess.test.ts):
- 4 memory entry 모두 생성 검증 (designer / project / decisions / feedback)
- frontmatter 형식 검증 (name / description / type)
- idempotent — 디자이너가 채운 내용 보존

### 2. 통합 테스트 — 5/5 PASS

```
[1/5] CLI 빌드 ✓
[2/5] Scaffold (--offline --no-install) ✓ 0초
[3/5] 핵심 파일 검증 ✓ 44개 파일 모두 존재 (이전 41 → 44)
      + 4 스킬 본문 모두 100+ 줄 (placeholder 아닌 실 본문 보장)
      + 4 memory entry frontmatter 정합 (name/description/type)
[4/5] Placeholder 치환 검증 ✓
[5/5] pnpm install + typecheck ✓ (4초 + 1초)

✅ Integration Test PASSED
```

### 3. 회귀 — studio 998 PASS 유지

```
 Test Files  131 passed (131)
      Tests  998 passed (998)
```

---

## 산출물 (8 commits)

| # | Commit | 내용 |
|---|---|---|
| 1 | (pre-flight) | spec / plan / task |
| 2 | `f27bf00` | `.gd/memory/` 4 entry + postprocess 초기화 + 3 tests |
| 3 | `8b690f1` | gd-start 본문 (188 줄) |
| 4 | `6f6e975` | gd-chat 본문 (268 줄) |
| 5 | `1159d09` | gd-token 본문 (258 줄) |
| 6 | `e925a9f` | gd-design 본문 (226 줄) |
| 7 | `52f0554` | 통합 테스트 갱신 (스킬 본문 + frontmatter 검증) |

---

## 핵심 산출물

### 4 능동 스킬 (총 ~940 줄)

각 스킬은 *능동 도구* 의 4 요건 충족:
1. **위치 인지** — scaffold 표준 경로 명시
2. **포맷 템플릿 내장** — 예시 채워진 템플릿
3. **없으면 자동 생성** — 디렉토리 / 파일 missing 시 자동
4. **컨텍스트 자동 로딩** — FRONT / DESIGN / TOKEN / `.gd/memory/` / catalog

#### gd-start (188 줄)
- §1 자동 로딩 9 파일
- §2 환영 + 프로젝트 의도
- §3 디자이너 정보 1-2 질문 → designer.md append
- §4 프로젝트 정보 1-2 질문 → project.md append
- §5 **5축 어휘 요약** (chat ≡ Paper ≡ React ≡ shadcn ≡ MSW)
- §6 워크플로 다이어그램
- §7 다음 단계 안내 (/gd-token → /gd-design → /gd-chat)
- §8 FAQ 6건

#### gd-chat (268 줄)
- §5 **카탈로그 기반 컴포넌트 추천** (LoginScene 예시)
- §6-§8 Narrative + Structure + History 3층 walkthrough
- `{{i18n.ko.X}}` placeholder 강제
- §9 컴파일 명령 안내
- §10 decisions.md append

#### gd-token (258 줄) — **shadcn 표준 토큰 잠금 핵심**
- §2 **24개 표준 토큰 이름 잠금** (이름 변경 요청 즉시 거부 + 이유)
- §3 다양한 색 형식 → OKLCH 자동 변환
- §4 **light + dark 동기 변경 강제**
- §5 **WCAG 2.1 AA 8 페어 즉시 검증** + 미달 시 가장 가까운 합격 OKLCH 제안
- §6 cva variant 영향 안내 (Button 6 variant 영향 매핑)
- §8 decisions.md append

#### gd-design (226 줄)
- §2 **빈 섹션 자동 감지**
- §3 Stitch 9 섹션 각각 질문 1-2개 (직접 짐작 금지)
- §4 i18n schema 확장
- §5 **Components 어휘 매핑 확장** (gen-design 의 핵심)

### 5 memory entry (Claude auto-memory 호환)

- `MEMORY.md` — 인덱스 + 사용 규약 + 새 entry 추가 가이드
- `designer.md` — `type: user` (호칭 / 톤 / 선호 / 도구)
- `project.md` — `type: project` (한 줄 / 타깃 / 가치 / 도메인 / 톤)
- `decisions.md` — `type: project` (history 표준 entry 형식)
- `feedback.md` — `type: feedback` (반응 카테고리)

### CLI postprocess 갱신

`initMemoryIfPresent` 가 4 entry 모두 초기화:
- 없을 때만 생성 (디자이너가 채운 내용 보존 — idempotent)
- MEMORY.md 는 매번 갱신 (projectName 반영)
- 4 placeholder 템플릿 추가 (DESIGNER / PROJECT / DECISIONS / FEEDBACK)

### 통합 테스트 강화

- `EXPECTED_FILES` 44개 (이전 41 + 3 memory entry)
- 4 스킬 본문 길이 검증 (`wc -l ≥ 100`) — placeholder 가 아닌 실 본문 보장
- 4 memory entry frontmatter 검증 (`---` + name/description/type)

---

## 핵심 결정 (phase-11.md 결정 반영)

| 결정 | 본 spec 의 구현 |
|---|---|
| 능동 스킬 4 요건 | 각 스킬에 §1 자동 로딩 / §3 자동 생성 / §4 frontmatter 템플릿 / §5 카탈로그 추천 |
| 스킬 길이 정책 | 자기 완결성 + 200-300 줄 (외부 문서 참조 최소) |
| 토큰 이름 잠금 | gd-token §2 — *행동 규칙* (실 기계 검증은 spec-11-03 의 gd doctor) |
| memory entry frontmatter | Claude auto-memory 패턴 호환 (`name` / `description` / `type`) |
| 한국어 우선 | 모든 스킬 본문 + agent 출력 |
| `gd-` prefix 일괄 | 4 스킬 모두 |

---

## DoD 체크

- [x] `gd-start.md` 본문 (능동 동작 + handbook 요약)
- [x] `gd-chat.md` 본문 (카탈로그 추천 + 3층)
- [x] `gd-token.md` 본문 (shadcn 이름 잠금 + WCAG AA)
- [x] `gd-design.md` 본문 (Stitch 9 + gen-design 확장 2)
- [x] `.gd/memory/` 4 entry (designer / project / decisions / feedback)
- [x] `postprocess.ts` 갱신 + 단위 테스트 +3
- [x] 통합 테스트 갱신 (44 파일 + 본문 길이 + frontmatter)
- [x] 단위 테스트 28 PASS / studio 998 PASS / 통합 5/5 PASS
- [x] walkthrough + pr_description 작성
