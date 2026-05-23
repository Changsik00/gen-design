# Walkthrough — spec-12-02: gd-chat 대화 깊이 + 버튼 의도 + form validation

> v4 retro (#1+#3+#5) 통합 해소. gd-chat 스킬 본문 강화 + 이지 v5 시뮬레이션 검증.

## 1. 단일 모듈 강화 — `gd-chat.md`

| 섹션 | 변경 |
|---|---|
| §5.5 (NEW) | 대화 깊이 checklist — 5 단계 (의도 / 토큰 / 재사용 / validation / 버튼 의도) |
| §7.5 (NEW) | Input/Form 만나면 validation 의도 묻기 (react-hook-form + zod 안내) |
| §7.6 (NEW) | Button 만나면 버튼 의도 묻기 (A/B/C/D 4 옵션) |
| §11 (강화) | 안티 패턴 2 항목 추가 (validation 안 묻기 / 버튼 의도 안 묻기) |
| §12 (강화) | 종료 조건 5 단계 checkbox |

308 → 402 줄 (plan 의 ≤ 400 거의 부합).

## 2. ADR 결정

- **ADR-12-02-A**: form validation 표준 = react-hook-form + zod (preset 의 기존 dep)
- **ADR-12-02-B**: 버튼 의도 4 옵션 = A submit / B nav / C external / D modal

## 3. 이지 v5 시뮬레이션 (4 신)

| 신 | TSX bytes | doctor | Turn | decisions |
|---|---|---|---|---|
| 1 로그인 | 2223 | 0 | 7 | 3 entry |
| 2 회원가입 | 3059 | 0 | 5 | 3 entry |
| 3 대시보드 | 2274 | 0 | 5 | 3 entry |
| 4 마이페이지 | 5029 | 0 | 5 | 3 entry |
| **합계** | **12,585** | **0** | **22 (평균 5.5)** | **12** |

→ v4 (4 entry 합계) 대비 **3 배** 결정 다양성.

## 4. 발견

- 🟢 **0 신규 막힘**
- 🟡 chat.md grammar 의 `<Link><Button asChild>` 패턴 parse 실패 — spec-12-05 (order.md) 후속
- 🟢 버튼 의도 추가 옵션 (AI 호출 / 데이터 refresh) — spec-12-05 또는 후속

## 5. 검증

| 항목 | 결과 |
|---|---|
| `studio pnpm test` | 875 PASS / 3 skipped (기존 snapshot — spec-12-01 처리) |
| `@gd/cli pnpm test` | 186 PASS |
| `create-gd-react pnpm test` | 28 PASS |
| v5 4 신 컴파일 + doctor | 0 errors |
| 대화 turn ≥ 5 평균 | ✓ (5.5) |
| decisions.md validation + 버튼 의도 entry | ✓ (각 ≥ 1) |

## 6. 다음

- **spec-12-03** (gd tokens 명령) 또는
- **spec-12-04** (비슷한 화면 자동 발견 + 토큰 재사용/확장 결정)

순서는 사용자 결정.
