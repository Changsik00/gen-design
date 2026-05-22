# spec-6-09 PoC Report — Paper ↔ tokens 자동 동기화

## 📋 메타

| 항목 | 값 |
|---|---|
| **실행일** | 2026-05-09 |
| **실행자** | Dennis + Agent (Opus 4.7) |
| **환경** | Paper MCP (file: "Welcome to Paper", artboard "Token Test" 1A8-0) |
| **대상 라이브러리** | `studio/src/lib/paper-sync/` |
| **단위 테스트** | 8/8 PASS, studio 전체 266/266 PASS |

## 🧪 실행 절차

1. **resolver 검증** — `tokens.json` 의 `{primitive.indigo.500}` → `#6366F1` 참조 해소를 단위 테스트로 확인.
2. **converter 검증** — CSS 변수 레코드 → `PaperStylePayload[]` 변환 단위 테스트로 확인.
3. **Paper 캔버스 적용** — Token Test 아트보드(1A8-0) 의 Test 3 (`bg-primary` / `bg-secondary` / `bg-destructive` 버튼) 3 개 노드에 `update_styles` 호출.
4. **before/after 스크린샷 비교** — 색상 변경 시각 확인.

### 적용 매핑

| CSS 변수 | tokens.json 참조 | 해소 값 | 적용 노드 |
|---|---|---|---|
| `--primary` | `{primitive.indigo.500}` | `#6366F1` | Frame `1AR-0` (bg-primary) |
| `--secondary` | `{primitive.neutral.100}` | `#F1F5F9` | Frame `1AT-0` (bg-secondary) |
| `--destructive` | `{primitive.red.500}` | `#EF4444` | Frame `1AV-0` (bg-destructive) |

## ✅ 결과

- **before**: bg-primary=검정 / bg-secondary=흰색 / bg-destructive=빨강 (placeholder)
- **after**: bg-primary=인디고 / bg-secondary=연한 회색 / bg-destructive=빨강 (토큰 일치)
- 3 개 노드 모두 `update_styles` 응답 정상, 시각적 적용 확인됨.

## 🔍 발견 사항

### F1. 라이브러리 동작 정상 (Core 검증 통과)
- `resolveTokenValue` / `resolveSemanticColors` — `{primitive.xxx}` 참조 해소가 의도대로 작동.
- `tokensToPaperPayloads` — CSS 변수 레코드를 노드 패턴 + 스타일 페이로드로 변환.
- 8 개 단위 테스트 모두 PASS, 회귀 없음.

### F2. **Style key 매핑 단순화 — 추가 분기 필요** ⚠️
- 현 `converter.ts` 출력: `{ fill: <value> }` (SVG/Shape 용)
- Paper `update_styles` 가 받는 키는 React.CSSProperties 형식 (`backgroundColor`, `color`, `borderColor`, `fill` …)
- **Frame 배경색**에는 `backgroundColor` 가 필요 → PoC 에서는 hand-override 로 적용
- 다음 단계 필수: 토큰 카테고리 또는 타깃 노드 종류별로 style key 분기 (예: `*-foreground` 토큰 → `color`, `*-border` → `borderColor`, 그 외 색상 → `backgroundColor`).

### F3. **노드-토큰 매핑 컨벤션 부재** ⚠️
- 현 PoC: 노드 ID(1AR-0 등) 를 사람이 직접 골라서 적용.
- 자동 동기화에 필요한 것: Paper 노드가 어떤 토큰을 따르는지 명시할 컨벤션
  - 옵션 a) 노드 이름에 토큰 키 포함 (예: `Button [bg-primary]`)
  - 옵션 b) Paper 노드 메타데이터(아직 미확인, MCP API 조사 필요)
  - 옵션 c) 클래스명 텍스트(현재 Test 3) 를 자식에서 추출 — heuristic
- 컨벤션 결정 없이는 N→N 자동 매핑 불가능.

### F4. tokens.json → 라이브러리 입력 흐름 미정
- 현재 라이브러리는 `TokensJson` 객체를 인자로 받지만, 실제 파일을 어떻게 읽어 들일지(빌드 타임 import? watch? CLI?) 미정.
- phase-6 의 export 와 통합할 가능성도 검토 필요.

## 🚦 Go / No-Go 결론

| 영역 | 결론 | 근거 |
|---|---|---|
| **Core toolchain (resolver + converter)** | **Go ✓** | 단위 테스트 + 실 캔버스 적용 모두 성공. 인터페이스 안정적. |
| **End-to-end 자동 동기화 (CI/watch 파이프라인)** | **No-Go (조건부)** | F2 / F3 / F4 선결 필요 — phase-7 이월 대상 |

### phase-7 이월 시 선결 과제 (제안)

1. **F2 해결** — converter 의 style key 분기 로직 (토큰 카테고리/네이밍 컨벤션 → Paper API 키 매핑 테이블)
2. **F3 해결** — Paper 측 노드-토큰 매핑 컨벤션 정의 + 디자인 가이드라인 합의
3. **F4 해결** — tokens.json watch + 변경 감지 → 자동 update_styles trigger CLI/스크립트
4. (옵션) Paper plugin 직접 통합 가능성 조사 (MCP 외 통로)

## 📎 부록

### 적용 전후 스크린샷
- before: Test 3 의 3 개 버튼이 placeholder 색상 (검정/흰색/빨강)
- after: tokens.json 의 light 테마 색상으로 정합 (인디고/연회색/빨강)
- (스크린샷은 Paper 도구 응답으로 확인됨, 본 보고서에는 별도 첨부 없이 PoC 세션 로그 참조)

### 코드 산출물
- `studio/src/lib/paper-sync/types.ts`
- `studio/src/lib/paper-sync/resolver.ts`
- `studio/src/lib/paper-sync/converter.ts`
- `studio/src/lib/paper-sync/index.ts`
- `studio/src/lib/paper-sync/__tests__/{resolver,converter}.test.ts`
