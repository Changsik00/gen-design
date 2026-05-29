---
name: gd-start
description: 첫 사용자 onboarding + 기존 자산 intake. 기획 문서·DESIGN.md·TOKEN.md 등 어떤 형태로 진입해도 우리 포맷으로 수렴시켜 chat.md v2 작성 준비를 완료한다. 새 디렉토리에서 첫 호출 시, 또는 기존 자산 정규화가 필요할 때 호출.
---

# gd-start — Onboarding & 기존 자산 Intake

> 본 스킬은 *능동 도구*입니다. 사용자가 무엇을 가져오든 — 빈 슬레이트이든, 기획 문서이든, 기존 디자인 파일이든 — 질문 → 정규화 → 다음 단계 안내의 흐름을 실행합니다.

---

## §1 자동 로딩 컨텍스트

호출 즉시 다음을 읽어 컨텍스트로 보유:

| 파일 | 역할 |
|---|---|
| `templates/FRONT.md` | React stack 결정 |
| `templates/AGENT.md` | agent 행동 규칙 |
| `templates/DESIGN.md` | 디자인 명세 (우리 포맷 기준선) |
| `templates/TOKEN.md` | 토큰 명세 (shadcn 24개 표준) |
| `templates/assets/tokens/tokens.json` | 토큰 기본값 |
| `.gd/memory/MEMORY.md` | 메모리 인덱스 |
| `.gd/memory/{designer,project,decisions,feedback}.md` | 4개 메모리 엔트리 |
| **`DESIGN.md`** (현재 디렉토리, 있으면) | 사용자의 기존 디자인 문서 |
| **`TOKEN.md`** (현재 디렉토리, 있으면) | 사용자의 기존 토큰 문서 |

→ 이미 `.gd/memory/designer.md`가 채워져 있으면 §3 자산 감지로 바로 이동.

---

## §2 환영 메시지

호출 시 사용자에게 짧게 인사:

```
안녕하세요. gen-design 시작을 도와드리겠습니다.

이 도구는 어떤 자산으로 시작하든 — 기획 문서, 기존 디자인 가이드, 토큰 파일,
또는 아무것도 없는 빈 슬레이트 — React (shadcn + Tailwind) 화면을 만들어냅니다.

먼저 어떤 자산을 가지고 계신지 파악할게요.
```

---

## §3 자산 감지 (Asset Detection)

**AskUserQuestion 사용** (uxMode: interactive일 때):

```
어떤 자산을 가지고 계신가요? (복수 선택 가능)
  A) 없음 — 처음 시작
  B) 기획/요구사항 문서 (PRD, 기획서, 요구사항 목록 등)
  C) DESIGN.md 또는 디자인 가이드
  D) TOKEN.md / CSS 변수 / 색상 팔레트
```

→ 선택에 따라 §4 intake 경로 분기.
→ A만 선택하면 §5 디자이너 정보 수집으로 이동.
→ B/C/D 중 하나라도 선택하면 해당 intake 경로 먼저 실행, 이후 필요 시 §5 이동.

**파일 자동 감지**: 현재 디렉토리에 `DESIGN.md` 또는 `TOKEN.md`가 존재하면:

```
[DESIGN.md / TOKEN.md]를 발견했습니다. 이 파일을 기반으로 시작할까요?
  Y) 네, 이 파일을 사용하겠습니다
  N) 아니요, 새로 시작하겠습니다
```

---

## §4 Intake 경로

### §4-A 빈 슬레이트

→ §5 디자이너 정보 수집으로 이동 (기존 흐름).

---

### §4-B 기획 문서 Intake

> 기획서·PRD·요구사항 문서에서 화면 목록과 핵심 데이터를 추출한다.

**단계 1 — 문서 수집**:

```
기획 문서를 여기에 붙여넣거나, 파일 경로를 알려주세요.
(핵심 내용만 요약해서 알려주셔도 됩니다)
```

**단계 2 — LLM이 추출**:

받은 문서에서 다음을 추출:

```
📋 추출 결과를 확인해주세요:

화면 목록:
  - [로그인] — 이메일 + 비밀번호 입력
  - [대시보드] — 매출 통계 + 주문 목록
  - [설정] — 프로필 편집
  ...

핵심 데이터 (비즈니스 로직 힌트):
  - 매출: orders.amount 합산
  - 활성 사용자: last_login > 30일
  ...

타깃 사용자: <추출된 내용>

맞나요? 수정할 부분이 있으면 말씀해주세요.
```

**단계 3 — 기록**:

확인 후 `.gd/memory/project.md`에 append:

```markdown
## 프로젝트 정의 (기획 문서에서 추출)

- **화면 목록**: <목록>
- **핵심 데이터**: <목록>
- **타깃**: <추출된 타깃>
- **출처**: 기획 문서 intake (gd-start §4-B)
```

**단계 4 — 안내**:

```
좋습니다. 이 화면들을 하나씩 만들어볼게요.

→ /gd-chat 을 호출하면 첫 화면부터 시작합니다.
   어느 화면부터 시작할까요?
```

---

### §4-C DESIGN.md Intake

> 기존 디자인 문서를 우리 포맷(Stitch 9섹션 + 확장 2섹션)으로 수렴시킨다.

**단계 1 — 형식 확인**:

```
DESIGN.md의 형식을 확인할게요.

어떤 형식인가요?
  A) gen-design 포맷 (이미 우리 포맷)
  B) Stitch 포맷 (§1 Overview ~ §9 Iconography 섹션)
  C) 자체 형식 / 기타 디자인 가이드
  D) 모르겠음 (내용을 보여주시면 파악하겠습니다)
```

**단계 2 — 포맷별 처리**:

**(A) 이미 우리 포맷**:
- gd-design §2 스캔 방식으로 빈 섹션만 채우기
- "이미 채워진 섹션이 있군요. 빈 섹션부터 하나씩 채워봅시다."

**(B) Stitch 포맷**:
- Stitch 9개 섹션 → 우리 섹션으로 직접 매핑 가능
- "Stitch 포맷이네요. 섹션별로 우리 포맷으로 옮겨드리겠습니다."
- 각 섹션 읽고 → `templates/DESIGN.md` 업데이트

**(C) 자체 형식**:

```
[문서 내용 요약]

이 내용을 우리 9가지 섹션에 매핑하겠습니다:
  §1 Overview — <추출된 내용>
  §2 Brand — <추출된 내용>
  §3 Colors → TOKEN.md 참조 필요
  ...

이렇게 이해한 게 맞나요? 수정할 부분은?
```

**(D) 내용 보여주면 파악**:
- 내용 읽고 → (A)/(B)/(C) 중 하나로 분류 후 해당 경로 실행

**단계 3 — 결과**:
- `templates/DESIGN.md` 업데이트 (우리 포맷)
- decisions.md에 "외부 DESIGN.md intake 완료" 기록

---

### §4-D TOKEN.md / CSS 변수 Intake

> shadcn 24개 표준 토큰과 매핑하여 일관성을 확보한다.

**단계 1 — 파일 수집**:

```
TOKEN.md, CSS 변수 파일, 또는 색상 팔레트를 보여주세요.
(예: CSS :root 변수, Figma 토큰 JSON, 색상 목록 등)
```

**단계 2 — shadcn 24개 매핑 확인**:

받은 토큰을 shadcn 표준과 비교:

```
토큰 매핑 분석:

✓ 매핑됨 (shadcn 표준 이름 일치):
  - --primary: oklch(0.546 0.252 264) → primary
  - --background: #FFFFFF → background

⚠ 커스텀 이름 발견 (매핑 필요):
  - --brand-blue → primary 로 매핑 권장
    이유: Button의 기본 배경색이 primary를 씁니다
  - --text-gray → muted-foreground 로 매핑 권장

매핑 확정할까요?
```

**단계 3 — WCAG 대비 간이 검증**:

색상 변경이 있으면 gd-token §5 방식으로 주요 페어 대비 확인:

```
✓ primary-foreground on primary: 7.2:1 — PASS
⚠ muted-foreground on background: 3.8:1 — FAIL (4.5:1 필요)
  → muted-foreground를 oklch(0.498 0 0)으로 조정하면 PASS
```

**단계 4 — 결과**:
- `templates/TOKEN.md` + `templates/assets/tokens/tokens.json` 업데이트
- decisions.md에 매핑 결정 기록

---

## §5 디자이너 정보 수집

`.gd/memory/designer.md`가 비어있으면:

```
1. 어떻게 호칭하면 좋을까요?
2. 작업 스타일은? (예: 빠른 결정 / 신중한 검토)
```

→ `.gd/memory/designer.md`에 append.

---

## §6 프로젝트 정보 수집

`.gd/memory/project.md`가 비어있고 §4-B에서 채워지지 않았다면:

```
1. 이 프로젝트는 어떤 서비스인가요? (한 문장)
2. 누가 쓸 건가요? (타깃 사용자)
```

→ `.gd/memory/project.md`에 append.

---

## §7 토큰-variant 컨텍스트 주입 규칙 안내

**모든 경로 완료 후 한 번** 다음 규칙을 명시:

```
💡 React 화면을 만들 때 이 규칙을 따릅니다:

1. 색은 반드시 TOKEN.md의 토큰 이름 클래스만 사용
   ✓ bg-primary, text-muted-foreground
   ✗ bg-blue-500, #4F46E5 직접 사용

2. 버튼·컴포넌트는 shadcn 표준 variant만 사용
   ✓ <Button variant="default">, <Button variant="destructive">
   ✗ <Button className="bg-indigo-600">

이 규칙 덕분에 디자이너가 TOKEN.md의 primary 색만 바꾸면
모든 버튼 색이 자동으로 바뀝니다.
```

---

## §8 4축 어휘 5분 요약

```
[디자이너 작성]   chat.md v2의 Structure 레이어
        ≡
[React 출력]      shadcn/ui 컴포넌트 + 토큰 클래스
        ≡
[LLM 학습]        shadcn 이름 = LLM 훈련 데이터 풍부
        ≡
[API contract]    MSW 시나리오 → 백엔드 계약
```

---

## §9 워크플로 다이어그램

```
디자이너 (당신)
   │
   ├─ /gd-token   → TOKEN.md + tokens.json (색 결정)
   ├─ /gd-design  → DESIGN.md (디자인 컨벤션)
   │
   └─ /gd-chat    → chats/scenes/<name>.chat.md (화면 명세 v2)
                      ↓
              LLM이 DESIGN.md + TOKEN.md 컨텍스트로
              직접 TSX 생성
                      ↓
              pnpm dev (시각 확인)
```

---

## §10 다음 단계 안내

intake 및 온보딩 완료 후:

```
준비 완료! 이제 첫 화면을 만들어볼게요.

🎨 추천: /gd-chat — 화면 명세 작성 시작
   → 기획 문서 intake를 했다면 목록의 첫 화면부터
   → 없다면 "로그인 화면" 같은 첫 화면 한 개부터

필요하면:
  • /gd-token  — 토큰 추가 조정
  • /gd-design — 디자인 컨벤션 추가 문서화
```

---

## §11 자주 묻는 질문 (FAQ)

| Q | A |
|---|---|
| **기존 DESIGN.md가 있는데 처음부터 다시 해야 하나요?** | 아니요. §4-C intake로 기존 파일을 우리 포맷으로 변환합니다. |
| **CSS 변수가 shadcn 이름과 다른데요** | §4-D에서 1:1 매핑을 안내합니다. 이름만 바꾸면 되는 경우가 많습니다. |
| **Paper MCP / Figma가 없어도 되나요?** | 네. chat.md v2 → LLM 생성이 기본 경로입니다. |
| **기획 문서가 길어요** | 핵심 화면 목록과 데이터 구조만 요약해서 주셔도 됩니다. |
| **chat.md v2가 뭔가요?** | UI + 데이터 + API + 시나리오를 한 파일에 담는 새 포맷입니다. /gd-chat이 안내합니다. |

---

## §12 안티 패턴 (스킬 본인 행동)

- ❌ 이미 채워진 memory entry 덮어쓰기 — append만
- ❌ 추측으로 DESIGN.md / TOKEN.md 채우기 — 항상 사용자 확인
- ❌ 기존 파일 형식 무시하고 처음부터 재작성 — intake 흐름 거칠 것
- ❌ 토큰 이름 임의 변경 — 반드시 사용자 동의 후
- ❌ 다음 단계 안내 생략 — 항상 /gd-chat으로 연결

---

## §13 종료 조건

다음이 모두 충족되면 완료:

- [ ] `.gd/memory/designer.md` 프로필 섹션 채워짐
- [ ] `.gd/memory/project.md` 프로젝트 정의 섹션 채워짐
- [ ] (해당 시) 기획 문서 → 화면 목록 추출 완료
- [ ] (해당 시) DESIGN.md → 우리 포맷으로 수렴 완료
- [ ] (해당 시) TOKEN.md → shadcn 매핑 완료
- [ ] 토큰-variant 규칙 안내 완료
- [ ] 사용자가 /gd-chat 다음 단계 선택

→ 사용자가 /gd-chat 호출하면 그 흐름 진입.
