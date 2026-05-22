# Walkthrough: spec-11-05 — Fix dogfooding-alpha findings

## 4 Fix 적용 + 재dogfooding 검증

### Fix #5 — dark destructive-foreground hotfix
- `tokens.json` + `globals.css`: `oklch(0.985 0 0)` → `oklch(0.205 0 0)` (어두운 텍스트)
- 재dogfooding doctor: contrast 진단 *사라짐* ✓

### Fix #3 — doctor HTML 주석 제거 (TDD)
- `check-vocab-similar.ts` + `check-token-ref.ts`: `stripHtmlComments` 추가
- 재dogfooding doctor: `_shell.chat.md` false positive 5건 (Header/Logo/Nav/Footer/Copyright) *제거* ✓
- 단위 테스트 +3 (vocab-similar 2 / token-ref 1)

### Fix #2 — annotation 경로 (TDD)
- `react.ts`: `chatRelPath = relative(resolve(chatRoot, ".."), chatPath)`
- 재dogfooding 결과: `// @gd: chats/scenes/login.chat.md` (project root 기준 — 이전 `../experiments/...`)
- 단위 테스트 +1 (runReact 통합 검증)

### Fix #1 — gd-chat 스킬 펜스 제거 (가장 큰 막힘)
- `gd-chat.md` §7: ` ```chat ` 펜스 제거 + bare 형식 강제 + 안티 패턴 예시
- §11 안티 패턴에 "펜스 안 작성 금지" 추가
- 재dogfooding gd react: **328 bytes → 1943 bytes** (Card + Form + Input + Button 본문 컴파일됨) ✓

---

## 재dogfooding 결과 비교

### Before (spec-11-04 끝)

```tsx
// @gd: ../experiments/dogfood-alpha/chats/scenes/login.chat.md
import React from 'react';
export function LoginScene() {
  return (
    <>
      {/*  외각 컴포넌트를 여기 배치. 예시:
      <Header>...
       */}
    </>
  );
}
// 328 bytes — Structure 본문 누락
```

### After (spec-11-05)

```tsx
// @gd: chats/scenes/login.chat.md
import React from 'react';
import { Button } from '@/components/ui/button';

export function LoginScene() {
  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("ko.auth.login.title")}</CardTitle>
          <CardDescription>{t("ko.auth.login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          ...
        </CardContent>
      </Card>
    </>
  );
}
// 1943 bytes — Structure 본문 컴파일됨
```

---

## 회귀 + 신규 테스트

| 영역 | 이전 | 현재 |
|---|---|---|
| studio total | 1055 | **1059** (+4) |
| - doctor (vocab-similar) | 9 | 11 (+2) |
| - doctor (token-ref) | 10 | 11 (+1) |
| - react-annotation | 4 | 5 (+1) |
| create-gd-react | 28 | 28 (회귀 0) |

---

## 5 진짜 막힘 → 4 ✅ 해소 / 1 ⏸ phase-12

| # | 막힘 | 상태 |
|---|---|---|
| 1 | gd react Structure 본문 누락 | ✅ spec-11-05 |
| 2 | annotation 경로 부정확 | ✅ spec-11-05 |
| 3 | doctor false positive | ✅ spec-11-05 |
| 4 | preset `pnpm gd` 미동작 (@gd/cli 분리) | ⏸ phase-12 |
| 5 | dark destructive 대비 미달 | ✅ spec-11-05 |

→ phase-11 Success Criteria #2 *완전 PASS*. PR #68 머지 가능.

---

## 보고서 갱신

`experiments/dogfooding-alpha-2026-05.md`:
- §3.1 진짜 막힘 표 — 5건 → 6건 (재dogfooding 발견 #6 추가: catalog.json 의 shadcn Tier 2 미등재)
- §4 phase-12 후보 — 12건 → 10건 (4 해소 strikethrough)
- §5 결론 — "5 진짜 막힘 중 4건 해소" + phase-12 새 spec 후보 정리

---

## 산출물 (8 commits)

| Commit | 산출물 |
|---|---|
| pre-flight | spec / plan / task |
| Fix #5 | tokens.json + globals.css |
| Fix #3 | doctor 2 파일 + tests 2 파일 |
| Fix #2 | react.ts + react-annotation.test.ts |
| Fix #1 | gd-chat.md §7 + §11 |
| 재dogfooding | experiments/dogfood-alpha/ 갱신 (chat.md + tokens.json + globals.css + login.tsx) |
| 보고서 | dogfooding-alpha-2026-05.md §3.1 / §4 / §5 |
