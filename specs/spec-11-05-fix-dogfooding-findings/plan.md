# Plan: spec-11-05 — Fix dogfooding-alpha findings (hotfix)

## 📋 Branch Strategy

- 신규 브랜치: `spec-11-05-fix-dogfooding-findings` (이미 생성됨, phase-11 base 에서 분기)

## 🎯 핵심 전략

### 작업 순서 (간단한 fix 부터)

```
1. Fix #5 (tokens.json + globals.css 1줄씩)
2. Fix #3 (doctor HTML 주석 — TDD)
3. Fix #2 (annotation 경로 — TDD)
4. Fix #1 (gd-chat 스킬 펜스 제거)
5. 재dogfooding
6. 보고서 갱신
7. Ship
```

### 주요 결정

| 항목 | 결정 |
|---|---|
| Fix #1 채널 | 스킬 본문 수정 (grammar 유지 — bare ComponentTag 표준) |
| Fix #2 base | `resolve(chatRoot, "..")` — chatRoot 부모 |
| Fix #3 HTML 주석 | `<!--...-->` 정규식 제거 |
| Fix #5 hotfix | dark destructive-foreground = `oklch(0.205 0 0)` |
| 재dogfooding | 같은 디렉토리 *덮어쓰기*, git log 로 before/after |

## 📂 Proposed Changes

### Fix #5 — destructive-foreground hotfix
- `presets-bundled/default/templates/assets/tokens/tokens.json`: dark 값 변경
- `presets-bundled/default/src/styles/globals.css`: `.dark { --destructive-foreground }` 동기

### Fix #3 — doctor HTML 주석 제거
- `studio/scripts/gen-design/doctor/check-vocab-similar.ts`: `stripHtmlComments` 추가
- `studio/scripts/gen-design/doctor/check-token-ref.ts`: 동일 적용
- 단위 테스트 추가 (vocab-similar / token-ref)

### Fix #2 — annotation 경로
- `studio/scripts/gen-design/react.ts`: `chatRelPath = relative(resolve(chatRoot, ".."), chatPath)`
- 단위 테스트 갱신 / 추가

### Fix #1 — gd-chat 스킬 펜스 제거
- `presets-bundled/default/.claude/skills/gd-chat.md` §7: ```chat ... ``` 제거
- bare 형식 명시 + 안티 패턴 예시 + grammar 한계 안내

### 재dogfooding
- `experiments/dogfood-alpha/chats/scenes/login.chat.md`: 펜스 제거
- `gd react` 재실행 → TSX 갱신
- `gd doctor` 재실행 → 검증

### 보고서 갱신
- `experiments/dogfooding-alpha-2026-05.md`: §3.1 4건 ✅ 해소 표시

## 🧪 검증 계획

- `pnpm --filter studio test --run` → 1055+ PASS
- 재dogfooding `gd react` 결과에 Card + Form + Input + Button 컴파일 확인
- 재dogfooding `gd doctor` 결과 — false positive 0 + destructive PASS

## 🔁 Rollback Plan

각 fix 가 독립 commit — 개별 revert 가능

## 📦 Deliverables 체크

- [x] task.md 작성
- [x] 사용자 Plan Accept
- [ ] 모든 task 완료
- [ ] walkthrough.md / pr_description.md ship
