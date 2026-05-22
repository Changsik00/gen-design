# Walkthrough: spec-10-03 — gen-design 품질 게이트 강화

## 실행 증거

### 1. workspace root gen-design alias

```
$ pnpm gen-design lint --chat-root playground/chats

> design-monorepo@ gen-design /Users/dennis/Project/Design
> pnpm --filter studio gen-design lint --chat-root playground/chats

> studio@0.0.0 gen-design /Users/dennis/Project/Design/studio
> tsx --tsconfig tsconfig.app.json scripts/gen-design.ts lint --chat-root playground/chats

No chat.md files found.
```

exit 0 — studio 디렉토리 이동 없이 workspace root 에서 실행 가능.

### 2. `pnpm --filter studio test --run` — 998 PASS

```
 Test Files  131 passed (131)
      Tests  998 passed (998)
   Duration  8.65s
```

StatCard variant 테스트 3건 추가 (995 → 998).

### 3. StatCard catalog 갱신 결과

`pnpm --filter studio vocab` 실행 후 `catalog.json` StatCard 항목:

```json
{
  "name": "StatCard",
  "filePath": "src/components/composites/StatCard/index.tsx",
  "axes": [
    {
      "name": "variant",
      "values": ["default", "compact", "highlighted"]
    }
  ]
}
```

### 4. `pnpm --filter studio dogfooding` — 표 출력

```
Dogfooding Score — @/components/ui import ratio
──────────────────────────────────────────
Metric                 Value
──────────────────────────────────────────
Total .tsx files       110
Files with UI import   45
Score                  40.9%
──────────────────────────────────────────
```

### 5. lint — 0 errors

```
> studio@0.0.0 lint /Users/dennis/Project/Design/studio
> eslint .
(no output = 0 errors)
```

---

## 구현 내용

### Task 1: workspace root gen-design alias

- `package.json` (repo root) 에 `"gen-design": "pnpm --filter studio gen-design"` 추가
- `pnpm gen-design <subcommand> [args...]` 형태로 workspace root 에서 직접 실행 가능
- external-alpha-1 보정 후보 C-4 해소

### Task 2: StatCard variant cva 구현 + catalog 갱신

| variant | 적용 스타일 |
|---|---|
| `default` | 기존 스타일 (변경 없음) |
| `compact` | 클래스 `compact`, `CardContent pt-2`, 값 텍스트 `text-xl` |
| `highlighted` | `border-2 border-primary` |

- `cva` 로 `statCardVariants` 정의 → `cn(statCardVariants({ variant }))` 적용
- `StatCardData` 타입에 `variant?` 추가 (기존 코드 호환)
- `pnpm vocab` 으로 catalog 자동 재생성 → StatCard axes 에 variant 등재
- external-alpha-1 보정 후보 C-3 해소

### Task 3: dogfooding-score.ts + CI step

- `studio/scripts/dogfooding-score.ts`: `src/**/*.tsx` 에서 `@/components/ui` import 비율 계산
- `studio/package.json` 에 `"dogfooding"` 스크립트 추가
- `.github/workflows/ci.yml` `test` job 마지막 step 으로 `Dogfooding score` 추가 (게이트 아님)
- 현재 score: **40.9%** (110파일 중 45파일이 @/components/ui 사용)

---

## 커밋 내역

| SHA | 메시지 |
|---|---|
| `498f43c` | docs(spec-10-03): pre-flight spec plan task |
| `df8597d` | feat(spec-10-03): add workspace root gen-design script alias |
| `1bbb1e7` | feat(spec-10-03): add StatCard variant axis and update catalog |
| `9ae22c6` | feat(spec-10-03): add dogfooding-score script and CI step |

---

## DoD 체크

- [x] `pnpm gen-design lint --chat-root playground/chats` (workspace root) → 정상 실행
- [x] StatCard variant prop 구현 + 998 PASS
- [x] catalog.json StatCard axes 에 variant 등재 (`pnpm vocab` 후 확인)
- [x] `studio/scripts/dogfooding-score.ts` 실행 → 비율 표 출력 (40.9%)
- [x] CI dogfooding step 추가
- [x] walkthrough.md + pr_description.md ship 완료
