# Plan: spec-11-03 — `gd doctor` 구현 (DESIGN/TOKEN/chat 정합 + drift)

## 📋 Branch Strategy

- 신규 브랜치: `spec-11-03-gd-doctor`
- 시작 지점: `phase-11-designer-onboarding-skill`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **`doctor` 가 `lint` 와의 관계**: doctor 는 *기존 6 + 신규 6 = 12 카테고리* superset. lint 는 *alias* 로 유지 (deprecation X) — 기존 CI 호환성.
> - [ ] **OKLCH 색 대비 계산**: WCAG AA 4.5:1 측정에 사용할 라이브러리 — `culori` (oklch → relative luminance) 추가 install. 본 spec 의 deps 추가 결정.
> - [ ] **`// @gd:` annotation 위치**: TSX 파일 *최상단 주석* 으로 고정 (`// @gd: chats/scenes/login.chat.md`). 이미 spec-11-01 의 welcome.tsx 에 적용됨.

> [!WARNING]
> - [ ] 신규 검증 6개 중 `contrast` 는 *복잡* — culori 의존 + 8 페어 * (light + dark) = 16 측정. 단위 테스트 충실히.
> - [ ] doctor 가 *느려지면* 디자이너가 외면. 5초 budget enforce.

## 🎯 핵심 전략

### 아키텍처 — doctor 가 lint 의 superset

```
studio/scripts/gen-design.ts (router)
   ├── lint     → runLint    (기존 6 카테고리 — alias 유지)
   └── doctor   → runDoctor  (12 카테고리 = 기존 6 + 신규 6)
                    ├── runLint() 호출 (재사용)
                    └── 6 신규 검증 함수 추가
                        ├── checkTokenRef       (DESIGN ↔ TOKEN ↔ chat)
                        ├── checkTokenFormat    (DTCG strict)
                        ├── checkContrast       (WCAG 2.1 AA, culori)
                        ├── checkSceneDrift     (// @gd: + mtime)
                        ├── checkOrphanScene    (TSX without chat)
                        └── checkVocabSimilar   (Levenshtein 제안)
```

### 친절한 한국어 메시지 표준

각 진단:
```
✗ [contrast] templates/assets/tokens/tokens.json
  light primary-foreground on primary 대비 3.8:1 — WCAG AA 미달 (필요 4.5:1)
  → primary-foreground 를 oklch(0.985 0 0) 으로 조정하면 4.6:1 PASS
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|---|---|---|
| 위치 | studio/scripts/gen-design/doctor.ts | 기존 lint 와 같은 디렉토리, 코드 재사용 |
| 색 변환 | `culori` 추가 install | OKLCH → relative luminance 정확 |
| Levenshtein | 직접 구현 (외부 deps X) | 단순 알고리즘, 28 catalog * N 비교 충분히 빠름 |
| annotation 위치 | TSX 최상단 (`// @gd: <path>`) | 한 줄, regex 파싱 쉬움 |
| 출력 | 한국어 텍스트 / `--json` 옵션 | 디자이너 친화 + agent 친화 |

### ADR 후보

- [x] `ADR-013-gd-doctor-checks` — 12 카테고리 + 한국어 메시지 + drift annotation

## 📂 Proposed Changes

### 1. doctor 코어 (`studio/scripts/gen-design/doctor.ts` 신규)

```ts
// 12 카테고리 enum
export type DoctorCategory =
  | "frontmatter" | "grammar" | "catalog-ref" | "shell-inherit" | "naming" | "compile"
  | "token-ref" | "token-format" | "contrast" | "scene-drift" | "orphan-scene" | "vocab-similar";

export interface DoctorDiag {
  category: DoctorCategory;
  file: string;
  line: number;
  severity: "error" | "warn" | "info";
  message: string;    // 한국어
  hint?: string;      // "→ ..." 해결 방법 한 줄
}

export async function runDoctor(argv: string[]): Promise<RouterResult> {
  // 1) parseArgs (--chat-root / --templates-root / --no-compile / --json)
  // 2) 기존 lint 6 카테고리 실행 (lint.ts 재사용)
  // 3) 신규 6 검증 실행
  // 4) 메시지 한국어 출력 (또는 JSON)
  // 5) exitCode: errors === 0 ? 0 : 1
}
```

### 2. 신규 검증 함수 (각 ~50-100 줄)

#### `checkTokenRef.ts` — DESIGN/chat ↔ TOKEN 참조

- DESIGN.md 의 `{primary}` / `{token.name}` 형식 추출
- chat.md 의 `bg-primary` / `text-muted-foreground` 등 Tailwind 클래스 추출
- TOKEN.md / tokens.json 에 정의된 토큰과 비교
- 미정의 시 진단 + Levenshtein 제안

#### `checkTokenFormat.ts` — DTCG 1.0 strict

- tokens.json 의 각 토큰이 `$value` + `$type` 보유
- `$value` 가 `{ light, dark }` 형식 (본 프로젝트 컨벤션)
- shadcn 표준 24 토큰 이름 모두 존재 (잠금)

#### `checkContrast.ts` — WCAG 2.1 AA

- `culori` 사용: `oklch(...)` → relative luminance
- 8 페어 측정 (light + dark 각각 = 16 측정):
  - foreground/background, primary-fg/primary, secondary-fg/secondary, muted-fg/background, accent-fg/accent, destructive-fg/destructive, card-fg/card, popover-fg/popover
- 미달 시 가장 가까운 합격 OKLCH 제안 (L 조정만 — Hue/Chroma 보존)

#### `checkSceneDrift.ts` — `// @gd:` mtime 비교

- `src/scenes/*.tsx` 의 첫 줄 `// @gd: <path>` 파싱
- 해당 chat.md 의 mtime 과 TSX mtime 비교
- chat mtime > tsx mtime → drift 진단

#### `checkOrphanScene.ts` — TSX 만 남음

- `src/scenes/*.tsx` 의 `// @gd:` annotation 파싱
- annotation 의 chat.md 가 존재 안 하면 orphan
- 또는 annotation 자체가 없으면 unmanaged

#### `checkVocabSimilar.ts` — "Did you mean?"

- catalog-ref 카테고리에서 *not found* 인 컴포넌트에 대해 실행
- catalog 의 28 컴포넌트와 Levenshtein 거리 측정
- 거리 ≤ 3 이면 제안 ("`<MyBtn>` → `<Button>` 으로 바꾸시려는 건가요?")

### 3. `gen-design react` 가 annotation 자동 삽입

```ts
// studio/scripts/gen-design/react.ts
const annotation = `// @gd: ${chatRelPath}\n`;
const annotated = annotation + compiledTsx;
writeFileSync(outputPath, annotated);
```

### 4. `gen-design.ts` router 갱신

```ts
const COMMANDS: Record<string, Handler> = {
  "paper-import": runPaperImport,
  "diff": runDiff,
  "react": runReact,
  "merge": runMerge,
  "lint": runLint,
  "doctor": runDoctor,    // 신규
};
```

### 5. 단위 테스트 (fixture 기반)

- `__tests__/doctor/token-ref.test.ts`
- `__tests__/doctor/token-format.test.ts`
- `__tests__/doctor/contrast.test.ts`
- `__tests__/doctor/scene-drift.test.ts`
- `__tests__/doctor/orphan-scene.test.ts`
- `__tests__/doctor/vocab-similar.test.ts`

각 테스트:
- 통과 케이스 1개
- 실패 케이스 1-2개 + 메시지 한국어 검증

### 6. 통합 fixture

`studio/scripts/gen-design/__tests__/fixtures/doctor-fail/`:
- 의도적 오류 6종 (각 신규 검증당 1개) — `doctor` 가 모두 검출 확인

### 7. deps 추가

```json
"devDependencies": {
  "culori": "^4.0.1"
}
```

## 🧪 검증 계획

### 단위 테스트
```bash
pnpm --filter studio test --run scripts/gen-design/__tests__/doctor
```

### 통합 테스트
```bash
# 기존 fixture (정합 통과)
pnpm --filter studio exec tsx scripts/gen-design.ts doctor --chat-root playground/chats

# 의도적 오류 fixture (6 진단 모두 검출)
pnpm --filter studio exec tsx scripts/gen-design.ts doctor --chat-root scripts/gen-design/__tests__/fixtures/doctor-fail
```

### 수동 검증 시나리오

1. `playground/chats` 에서 `doctor` → 0 errors (현재 정합)
2. chat.md 에 `<MyBtn>` 추가 후 `doctor` → "vocab-similar: <MyBtn> → <Button>?" 한국어 메시지
3. chat.md 수정 후 `gd react` 안 함 → `doctor` → "scene-drift" 진단
4. `src/scenes/foo.tsx` 임의 생성 (chat 없이) → "orphan-scene" 진단
5. tokens.json 의 muted-foreground 를 의도적으로 낮은 대비 값으로 → "contrast" 진단 + 합격 OKLCH 제안

## 🔁 Rollback Plan

- `doctor.ts` + 6 신규 검증 + tests + fixtures 삭제
- `gen-design.ts` router 에서 `doctor` 제거
- `react.ts` 의 annotation 자동 삽입 되돌리기

## 📦 Deliverables 체크

- [x] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
