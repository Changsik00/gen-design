# Plan: spec-12-02 — gd-chat 대화 깊이 + 버튼 의도 + form validation

## 🎯 접근

**단일 모듈** — `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` 본문 강화.

기존 §1-§12 구조 유지 + 추가:
- §5.5 (NEW) — *대화 깊이 checklist* (5 단계)
- §7.5 (NEW) — Input 만나면 *validation 의도* 묻기
- §7.6 (NEW) — Button 만나면 *버튼 의도* 묻기 (CTA/nav/submit/external)
- §11 (강화) — 안티 패턴 2 항목 추가
- §12 (강화) — 종료 조건 5 단계 checkbox

검증: 이지 페르소나 v5 simulation — 4 신 재현 + 대화 turn 기록.

## 📑 ADR 결정

### ADR-12-02-A — form validation 표준

**결정**: **react-hook-form + zod** (preset 의 기존 dep)

스킬 안내 예시:
```ts
const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
const form = useForm({ resolver: zodResolver(schema) });
```

(자동 생성은 spec-12-05. 본 spec 은 *안내* 만)

### ADR-12-02-B — 버튼 의도 4 옵션

| 옵션 | 의미 | chat.md 안내 |
|---|---|---|
| **A. form submit** | 폼 제출 | `<Button type="submit">` |
| **B. page navigation** | 라우터 이동 | `<Link to="/path"><Button asChild>...</Button></Link>` |
| **C. external link** | 외부 URL | `<a href="..." target="_blank"><Button asChild>...</Button></a>` |
| **D. modal/dialog open** | 모달 열기 | `<Dialog><DialogTrigger asChild>...</DialogTrigger></Dialog>` |

추가 (AI 호출 등) 은 후속.

## 🔧 작업 단위

### Task 1: pre-flight commit

### Task 2: gd-chat.md 본문 강화

- §5.5 (대화 깊이 checklist) — §5 와 §6 사이 삽입
- §7.5 (Input → validation 의도)
- §7.6 (Button → 버튼 의도)
- §11 안티 패턴 2 항목 추가
- §12 종료 조건 5 단계 checkbox
- ≤ 400 줄 유지

**Commit**: `feat(spec-12-02): gd-chat depth checklist + validation/button intent`

### Task 3: 이지 v5 시뮬레이션 — 신 1 (로그인)

- `experiments/dogfood-alpha-v5/` scaffold
- 이지 v5 페르소나 memory
- **transcript** `transcripts/scene-1-login.md` (≥ 5 turn)
- `chats/scenes/login.chat.md` + `gd react` + `gd doctor`
- decisions.md — validation + 버튼 의도 entry

**Commit**: `feat(spec-12-02): scene 1 (login) — v5 depth simulation`

### Task 4: 신 2 (회원가입)

신 1 form 재사용 + Checkbox + 강화된 대화.

**Commit**: `feat(spec-12-02): scene 2 (signup) — form reuse + dialog`

### Task 5: 신 3 (대시보드)

StatCard + 버튼 의도 (nav).

**Commit**: `feat(spec-12-02): scene 3 (dashboard) — button intent (nav)`

### Task 6: 신 4 (마이페이지)

Tabs + Form + 다중 의도.

**Commit**: `feat(spec-12-02): scene 4 (mypage) — multi intent`

### Task 7: 종합 보고서

`experiments/dogfooding-alpha-v5-depth-2026-05.md` — v4 vs v5 비교.

**Commit**: `docs(spec-12-02): v5 depth report`

### Task 8: Ship

walkthrough + pr_description + sdd ship + push + PR (`--base phase-12-conversation-depth-and-orchestration`).

## ⚠️ 위험 + 완화

| 위험 | 완화 |
|---|---|
| 스킬 본문 ≥ 400 줄 (학습 부담) | §5.5/7.5/7.6 짧고 명확 |
| validation 안내 너무 기술적 (페르소나 깨짐) | "agent 자동 처리, 결정만" 명시 |
| 버튼 의도 4 옵션 부족 | "추가 옵션 후속" 명시 |
| v5 가 self-evidence (진정 검증 X) | 실 외부 alpha 는 OPT |

## 🧪 검증 체크리스트

- [ ] gd-chat.md ≤ 400 줄
- [ ] §5.5/§7.5/§7.6/§11/§12 모두 적용
- [ ] 4 신 0 errors / 대화 turn ≥ 5 평균
- [ ] decisions.md *validation* + *버튼 의도* entry ≥ 1
- [ ] studio / @gd/cli / create-gd-react 회귀 무
- [ ] 보고서 ~300 줄
