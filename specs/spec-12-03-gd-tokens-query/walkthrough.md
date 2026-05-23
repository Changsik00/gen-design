# Walkthrough: spec-12-03

> gd tokens 조회 명령 — list / find / show 3종 구현

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| arg 파서 + 런타임 분리 여부 | (A) 별도 파일 / (B) 단일 tokens.ts | (B) 단일 파일 | doctor 대비 훨씬 작은 scope — 파일 분리 overhead 없음 |
| ANSI 출력 제어 | (A) chalk 라이브러리 / (B) 인라인 ANSI | (B) 인라인 | 외부 의존성 0 원칙; 사용하는 코드 2줄 분량 |
| tokens.json 탐색 기본 경로 | (A) cwd / (B) `templates/assets/tokens` | (B) doctor 와 동일 | 기존 doctor 기준과 일치 — 혼란 없음 |
| 단일값 토큰 (radius 등) 처리 | (A) dark 열 빈 칸 / (B) `값` 레이블 단일 출력 | (A) dark 열 빈 칸 | 컬럼 정렬 유지 + show 명령에서 `값:` 로 구분 |

### ADR 승격 가이드

- [x] 없음 — 모두 gd-cli 내부 구현 선택, cross-spec 영향 없음

## 💬 사용자 협의

- **브랜치 기반**: spec-12-02 Ship 후 phase-12 base 브랜치 pull (10 커밋) 적용 후 분기

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트

- **명령**: `cd packages/gd-cli && pnpm test`
- **결과**: ✅ 214 PASS (기존 186 + 신규 28)

```text
Test Files  20 passed (20)
     Tests  214 passed (214)
  Start at  13:34:41
  Duration  761ms
```

### 2. 수동 검증

1. **`gd tokens list`** (실제 preset tokens.json, 35 토큰)
   - Result: 35 토큰 카테고리별 출력 — color 29 / radius 3 / fontFamily 3

2. **`gd tokens list --category color`**
   - Result: color 29 토큰만 출력, radius/fontFamily 제외

3. **`gd tokens find primary`**
   - Result: `primary` / `primary-foreground` 2행 매칭

4. **`gd tokens show background`**
   - Result: `--background`, light `oklch(1 0 0)`, dark `oklch(0.145 0 0)`, 설명 `페이지 배경` 모두 출력

5. **`gd tokens show nonexistent`**
   - Result: exitCode 1, `찾을 수 없습니다` 메시지

6. **`gd tokens --help`**
   - Result: list / find / show 사용법 출력

## 🔍 발견 사항

- 🟢 tokens.json DTCG 구조가 예상보다 단순 — light/dark 분기 + 단일값 2케이스로 처리 완료
- 🟡 arg 파서와 런타임을 Task 3 에서 함께 구현해 Task 4/5 TDD Red 단계가 즉시 Green 으로 전환됨 — 작은 모듈이라 허용
- 🟡 gd-cli tsconfig 가 studio 소스를 참조 → studio 기존 TS 오류가 tsc 결과에 포함됨 (spec-12-03 미도입 오류)

## 🚧 이월 항목

- 없음

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent |
| **작성 기간** | 2026-05-23 |
| **최종 commit** | `73dcff5` |
