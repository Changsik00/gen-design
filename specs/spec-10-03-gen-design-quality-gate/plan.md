# Plan: spec-10-03 — gen-design 품질 게이트 강화

## 📋 Branch Strategy

- 신규 브랜치: `spec-10-03-gen-design-quality-gate`
- 시작 지점: `phase-10-verification-automation` (phase base branch)

## 🎯 핵심 전략

세 독립 작업을 순서대로 1 commit 씩 처리한다.

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|---|---|---|
| workspace alias | `pnpm --filter studio gen-design` pass-through | 인자 전달 그대로 됨 |
| StatCard variant | cva `variants.variant` + `cn()` | 프로젝트 기존 cva 패턴 일관성 |
| dogfooding script | `tsx scripts/dogfooding-score.ts` glob + count | 별도 라이브러리 불필요 |

### ADR 후보

- [x] 없음

## 📂 Proposed Changes

### Task 1: workspace root gen-design alias

#### [MODIFY] `package.json` (repo root)

`scripts` 에 추가:
```json
"gen-design": "pnpm --filter studio gen-design"
```
→ `pnpm gen-design lint --chat-root playground/chats` 가 studio 의 `gen-design` script 로 포워딩됨.

### Task 2: StatCard variant cva 구현

#### [MODIFY] `studio/src/components/templates/types.ts`

`StatCardData` 에 `variant?: "compact" | "highlighted" | "default"` 추가.

#### [MODIFY] `studio/src/components/composites/StatCard/index.tsx`

```ts
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      compact: "[&_[data-card-content]]:pt-2 [&_.text-2xl]:text-xl",
      highlighted: "border-2 border-primary",
    },
  },
  defaultVariants: { variant: "default" },
});
```

Card 에 `className={cn(statCardVariants({ variant }))}` 적용.

#### [MODIFY] `studio/src/components/composites/StatCard/StatCard.test.tsx`

variant 테스트 3건 추가 (default / compact / highlighted).

#### 실행: `pnpm --filter studio vocab`

catalog.json StatCard axes 에 variant 자동 등재.

### Task 3: dogfooding-score.ts + CI step

#### [NEW] `studio/scripts/dogfooding-score.ts`

```ts
// src/**/*.tsx glob → @/components/ui import 포함 파일 수 / 전체 비율 계산
// stdout: 표 출력 (Total / WithUi / Score%)
// exit 0 (게이트 아님)
```

#### [MODIFY] `studio/package.json`

```json
"dogfooding": "tsx scripts/dogfooding-score.ts"
```

#### [MODIFY] `.github/workflows/ci.yml`

`test` job 마지막에:
```yaml
- name: Dogfooding score
  run: pnpm --filter studio dogfooding
```

## 🧪 검증 계획

### 단위 테스트
```bash
pnpm --filter studio test --run   # 995+ PASS
```

### 수동 검증
1. `pnpm gen-design lint --chat-root playground/chats` (repo root) → exit 0
2. StatCard variant="highlighted" 렌더링 → border-primary 클래스 확인
3. `pnpm --filter studio vocab` → catalog.json StatCard axes 에 variant 있음
4. `pnpm --filter studio dogfooding` → 표 출력 (score %)

## 🔁 Rollback Plan

- package.json script 제거, StatCard index.tsx 되돌리기, dogfooding-score.ts 삭제

## 📦 Deliverables 체크

- [x] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
