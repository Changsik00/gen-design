# Walkthrough: spec-12-05

> 디자인 주문 명세 (`.order.md`) 도입 — gd react 에 zod schema + useForm 자동 주입

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| `.order.md` 위치 | (A) chat.md §Order 섹션 / (B) 별도 `.order.md` 파일 | (B) 별도 파일 | chat.md grammar 변경 없음, 하위 호환 보장, 디자이너/개발자 역할 분리 |
| TSX 주입 방법 | (A) compileToReact 수정 / (B) post-process 래퍼 | (B) 래퍼 | 기존 compileToReact 시그니처 + 36 tests 무손상 |
| YAML 파서 | (A) 직접 구현 / (B) js-yaml | (B) js-yaml | monorepo 기존 의존성, 검증된 구현 |
| useForm 위치 | (A) 컴포넌트 밖 / (B) 함수 본문 첫 줄 | (B) 함수 본문 | React hook 규칙 준수 |

### ADR 후보

- [x] `adr-012-order-md-separate-file` — chat.md §Order 섹션 vs 별도 파일 선택 근거 (spec.md 에 기록)

## 💬 사용자 협의

- **진행 방식**: TDD 2사이클 × 2 패턴 (동일 spec-12-03 구조)
- **js-yaml 추가**: monorepo lockfile 에 이미 있어 별도 설치 불필요 (pnpm add 로 활성화)

## 🧪 검증 결과

### 1. 자동화 테스트

| 파일 | 케이스 수 | 결과 |
|---|---|---|
| `order-args.test.ts` | 12 | ✅ All Green |
| `order-runtime.test.ts` | 10 | ✅ All Green |
| 기존 전체 (회귀) | 214 | ✅ All Green |
| **총계** | **236** | ✅ 22 files |

### 2. 수동 검증 (v5 시뮬레이션)

| 항목 | 결과 |
|---|---|
| 씬 | `login.chat.md` + `login.order.md` |
| §5.8 트리거 | ✅ Form + Button 있는 신에서 정상 진입 |
| `.order.md` 생성 | ✅ validation(email/password) + actions(submit/nav) |
| `gd react login` | ✅ `z.object` + `useForm` + `onSubmit(fetch)` 포함 TSX |
| 하위 호환 | ✅ `.order.md` 없는 씬 — 기존 TSX 동일 |

**gd-chat.md 최종 행수**: 496 → 552줄 (+56줄, §5.8 + §12 업데이트)

## 🔍 발견 사항

- 🟢 `.order.md` 없는 씬에서 완전 하위 호환 — 기존 22 파일 전체 회귀 없음
- 🟢 js-yaml 의 YAML 파싱이 중첩 객체 + 배열 모두 정확히 처리
- 🟡 `<Input>` 에 `form.register("email")` 자동 연결 미구현 — 이월 (수동으로 추가 필요)
- 🟡 `<Form onSubmit={form.handleSubmit(onSubmit)}>` 자동 바인딩 미구현 — 이월

## 🚧 이월 항목

- `form.register()` 를 `<Input>` 속성에 자동 주입 → Icebox
- `form.handleSubmit(onSubmit)` 을 `<Form onSubmit=...>` 에 자동 바인딩 → Icebox
- routing target 으로부터 router import 자동 추가 (next/link, react-router) → spec-12-06 이후 검토

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent |
| **작성 기간** | 2026-05-23 |
| **총 commit 수** | 7 |
| **최종 commit** | `4b5535b` |
