# spec-13-03: gd-chat v2 — 수직 단면 작성 가이드

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-03` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-03-gd-chat-v2` |
| **상태** | Planning |
| **타입** | Refactor |
| **Integration Test Required** | no |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gd-chat` 스킬은 v1 chat.md 포맷 (3층: Narrative / Structure / History)을 안내한다.
Structure 레이어를 `gd react` 컴파일러의 입력 소스로 쓰는 것을 전제로 설계됐다.

- 문법이 엄격 (`code fence 금지`, `bare 형식 강제`)
- UI 레이어만 다룸 — 데이터/API/시나리오 없음
- 컴파일러 폐기(spec-13-06) 이후 흐름과 맞지 않음

### 문제점

1. **포맷 불일치**: chat.md v2 (ADR-011)는 5개 레이어를 정의했으나 gd-chat은 여전히 3층만 안내
2. **LLM 생성 흐름 미반영**: "컴파일러가 파싱" → "LLM이 컨텍스트로 읽고 직접 생성"으로 바뀌었으나 스킬이 반영 안 됨
3. **MSW 시나리오 미지원**: Scenarios 레이어 작성 안내 없음 — spec-13-04(gd extract) 전제 조건

### 해결 방안 (요약)

`gd-chat`을 chat.md v2 포맷 기반으로 재작성한다. UI 레이어는 기존 방식 유지하되 Data / API / Scenarios / DB Hints 레이어 작성 안내를 추가한다. 컴파일러 참조를 제거하고 "LLM이 이 파일을 컨텍스트로 TSX를 직접 생성한다"는 새 흐름으로 교체한다.

## 📊 개념도

```
gd-chat (v2)
    │
    ├── 화면/컴포넌트 이름 파악 (기존)
    ├── Structure 레이어 작성 (기존 유지 — shadcn + 토큰)
    ├── Narrative / History 레이어 (기존 유지)
    │
    ├── Data 레이어 (신규) — 화면에 보여야 할 데이터 shape
    ├── API 레이어 (신규) — 필요한 엔드포인트
    ├── Scenarios 레이어 (신규) — MSW 시나리오 3개 이상
    └── DB Hints 레이어 (선택, 신규)
              │
              ▼
    "gd extract <file>" → MSW 핸들러 스텁 자동 생성 (spec-13-04)
    "LLM이 이 파일 + DESIGN.md + TOKEN.md로 TSX 생성"
```

## 🎯 요구사항

### Functional Requirements

1. **v2 포맷 안내**: ADR-011 / `docs/chatmd-v2-format.md` 기준 5개 레이어 작성 안내
2. **Data 레이어 질문 추가**: Structure에 데이터 바인딩(`{{data.X}}`)이 있으면 Data 레이어 채우도록 유도
3. **API 레이어 질문 추가**: Data의 `source:` 필드에서 API 경로 도출 또는 직접 질문
4. **Scenarios 레이어 강제**: 최소 3개 시나리오(loaded / loading / error) 작성 — `gd extract` 전제 조건
5. **컴파일러 참조 제거**: `pnpm gd react ...` 명령 안내 제거 → "LLM에게 직접 요청" 안내로 교체
6. **DB Hints 선택 안내**: 서버 데이터가 있는 화면에서 선택적으로 작성 유도

### Non-Functional Requirements

1. 기존 §5.5 checklist (5단계) 유지 — 의도/토큰/유사화면/validation/버튼 의도 확인
2. v1 포맷 호환: `version: 2` frontmatter 없으면 v1로 간주, v2 업그레이드 제안
3. AskUserQuestion 우선 사용 (uxMode: interactive)

## 🚫 Out of Scope

- `gd extract` 명령 구현 (spec-13-04)
- `gd react` 명령 실제 제거 (spec-13-06)
- DB Hints에서 실제 스키마 파일 생성

## 📑 ADR 후보

- [ ] 없음 (ADR-011로 충분)

## ✅ Definition of Done

- [ ] `packages/gd-skills/skills/gd-chat.md` 업데이트 — v2 레이어 안내 포함, 컴파일러 참조 제거
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-13-03-gd-chat-v2` 브랜치 push 완료
- [ ] PR → `phase-13-vertical-slice` 타겟
- [ ] 사용자 검토 요청 알림 완료
