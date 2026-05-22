# spec-11-05: Fix dogfooding-alpha findings (hotfix)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-11-05` |
| **Phase** | `phase-11` |
| **Branch** | `spec-11-05-fix-dogfooding-findings` |
| **상태** | Plan Accepted |
| **타입** | Fix (hotfix) |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

spec-11-04 dogfooding alpha 가 5 진짜 막힘 발견. phase-11 Success Criteria #2 가 *부분 PASS*. PR #68 가 open 인 동안 4 fix 를 phase-11 안에 포함시켜 *깨진 깃발 X*.

5 진짜 막힘 중 본 spec 의 scope:
1. 🔴 `gd react` Structure 본문 누락 — `gd-chat.md` 스킬의 ` ```chat ` 펜스 안내 문제
2. 🟠 `// @gd:` annotation 경로 — react.ts 의 cwd 기준
3. 🟠 doctor `extractChatComponents` HTML 주석 미처리
5. 🟠 dark destructive-foreground 대비 미달

분리: #4 `@gd/cli` npm 분리는 *큰 인프라 작업* → phase-12.

## 🎯 요구사항

### Functional Requirements

1. **Fix #1** — `gd-chat.md` §7 의 ` ```chat ` 펜스 제거 + bare 형식 명시 + 안티 패턴 예시
2. **Fix #2** — `react.ts` 의 `chatRelPath` = `relative(resolve(chatRoot, ".."), chatPath)`
3. **Fix #3** — `check-vocab-similar.ts` + `check-token-ref.ts` 에 `stripHtmlComments` 추가
4. **Fix #5** — `tokens.json` 과 `globals.css` 의 dark destructive-foreground 를 `oklch(0.205 0 0)` 로 변경
5. **재dogfooding** — `experiments/dogfood-alpha/` 에서 재실행하여 Structure 본문 컴파일 / doctor false positive 0 / contrast PASS 검증
6. **보고서 갱신** — `dogfooding-alpha-2026-05.md` §3.1 4건 ✅ 해소 표시

### Non-Functional Requirements

1. studio 1055 / create-gd-react 28 tests PASS 유지
2. doctor HTML 주석 처리 / annotation 경로 단위 테스트 추가
3. fix 전후 비교 가능 (git history)

## 🚫 Out of Scope

- #4 `@gd/cli` npm 분리 → phase-12
- 외부 디자이너 alpha → phase-12
- `gd doctor --fix`, `gd api` → phase-12+
- chat.md grammar 의 ` ```chat ` fenced block 지원 추가 → 본 spec 은 스킬 본문 수정으로 회피

## 📑 ADR 후보

- [ ] 없음 (hotfix)

## ✅ Definition of Done

- [ ] Fix #5 (destructive-foreground), Fix #3 (HTML 주석), Fix #2 (annotation), Fix #1 (스킬) 모두 적용
- [ ] 재dogfooding: gd react Structure 컴파일 + gd doctor false positive 0 + destructive PASS
- [ ] 보고서 갱신: §3.1 4건 ✅
- [ ] 회귀: studio 1055 / create-gd-react 28 PASS
- [ ] walkthrough.md + pr_description.md ship
- [ ] PR #68 에 fix 통합 후 main 머지 가능 상태
