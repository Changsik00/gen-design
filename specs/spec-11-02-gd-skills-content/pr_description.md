# feat(spec-11-02): `.claude/skills/gd-*` 본문 + `.gd/memory/` 디스크 캐시

## Summary

- **4 능동 스킬 본문** (총 ~940 줄) — gd-start / gd-chat / gd-token / gd-design
- **5 memory entry** — MEMORY 인덱스 + designer / project / decisions / feedback (Claude auto-memory 호환)
- **shadcn 표준 토큰 이름 잠금** — gd-token §2: 이름 변경 요청 즉시 거부
- **WCAG 2.1 AA 8 페어 자동 검증** — gd-token §5: 미달 시 가장 가까운 합격 OKLCH 제안
- **카탈로그 기반 컴포넌트 추천** — gd-chat §5: LoginScene → Card+Form+Input+Label+Button 자동 제안
- **빈 섹션 자동 감지** — gd-design §2: 직접 짐작 금지, 디자이너에게 질문
- **postprocess 갱신** — 4 entry 초기화 (idempotent — 디자이너가 채운 내용 보존)
- **통합 테스트 강화** — 44 파일 + 스킬 본문 길이 + frontmatter 정합

## 능동 스킬의 4 요건 (각 스킬이 모두 충족)

1. **위치 인지** — `chats/scenes/*.chat.md` 등 표준 경로 명시
2. **포맷 템플릿 내장** — 빈 파일 X, 예시 채워진 템플릿
3. **없으면 자동 생성** — 디렉토리/파일 missing 시 자동 mkdir + 쓰기
4. **컨텍스트 자동 로딩** — FRONT/DESIGN/TOKEN + `.gd/memory/` + catalog

## 스킬별 핵심 동작

| 스킬 | 핵심 능동 동작 |
|---|---|
| **gd-start** | 디자이너/프로젝트 1-2 질문 → memory append + 5축 어휘 5분 요약 |
| **gd-chat** | 카탈로그에서 후보 컴포넌트 추천 + 3층 walkthrough + 자동 파일 생성 |
| **gd-token** | shadcn 24 토큰 이름 잠금 + light/dark 동기 + WCAG AA 8 페어 검증 |
| **gd-design** | 빈 섹션 자동 감지 + Stitch 9 + i18n + Components 어휘 매핑 |

## 변경 파일

| 구분 | 위치 |
|---|---|
| 신규 | `presets-bundled/default/.gd/memory/{designer,decisions,feedback}.md` (3개) |
| 수정 | `presets-bundled/default/.gd/memory/{MEMORY,project}.md` |
| 수정 | `presets-bundled/default/.claude/skills/gd-{start,chat,token,design}.md` (4개 본문) |
| 수정 | `packages/create-gd-react/src/postprocess.ts` (4 entry 초기화) |
| 수정 | `packages/create-gd-react/__tests__/postprocess.test.ts` (+3 tests) |
| 수정 | `packages/create-gd-react/scripts/test-integration.sh` (검증 강화) |

## Test plan

- [x] `pnpm --filter create-gd-react test --run` → **28 passed** (25 → 28)
- [x] `bash scripts/test-integration.sh` → **5/5 PASS**
  - 44 파일 모두 존재
  - 4 스킬 본문 모두 100+ 줄
  - 4 memory entry frontmatter 정합 (name/description/type)
- [x] `pnpm --filter studio test --run` → **998 passed** (회귀 0)

## 후속 작업

| 항목 | spec |
|---|---|
| `gd doctor` 구현 (DESIGN/TOKEN/chat 정합 + drift) — 스킬이 안내하는 명령의 실 구현 | spec-11-03 |
| dogfooding alpha — dennis 가 본 스킬들로 실제 신 만들기 | spec-11-04 |
