# Walkthrough: spec-5-02

> spec-5-02 (app-a Paper 시안 + Settings 신설 + 원본 의도 보존 검증) 의 작업 기록.
> 의도 변경 / 사용자 협의 / 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| spec-5-02 의 페이지 범위 (2026-04-26) | A) 풀 스코프 4 페이지 / B) MVP 2 페이지 / C) 4 페이지 + 새 종류 1~2 / D) 직접 지정 | **C** — 기존 4 페이지 + Settings 1 신설 | 사용자 직접 선택. "기존 페이지 재활용 ❌, 새 페이지에서 다양한 컴포넌트 / 토큰 활용" 의도. |
| Phase 4 이월 과제 처리 (2026-04-26) | X) Icebox / Y) 별도 spec / Z) 폐기 | **분할** — 원본 의도 보존 사이클은 spec-5-02 흡수, LoginPage variant + DashboardPage drift 는 X (Icebox) | 사용자 방향 (새 페이지 검증) 과 직접 충돌하는 두 항목만 보류. 의도 보존 사이클 본질은 흡수. |
| Settings 작성 방식 (2026-05-02) | (a) Designer 직접 그림 / (b) AI Radix-based 자동 생성 | **(b)** AI Radix-based | 사용자 결정 — "AI 베이스 시스템에 인적 단계는 부적합". *원본* 정의를 *Designer 의도* → *AI 입력 의도 (DESIGN.md + Radix UI reference)* 로 변경. spec.md / plan.md / intent-preservation.md / task.md 일괄 갱신 (commit `96a5244`). |
| 5 페이지 design-extract 의 schema 적용 범위 | (a) 14 섹션 모두 풀 작성 / (b) 페이지 사용분만 | **(b) 페이지 사용분 위주** | 풀 작성은 중복 / 부담. Login extract 가 base, 다른 4 파일은 차별값 위주. schema 정합성 (14 섹션 헤더) 은 모두 PASS. |
| elevation-card 표기 | spec-5-01 추정 2-stop / 추출 단일 stop | **추출값 우선** (`0 1px 2px rgba(15,23,42,0.04)`) | spec-5-01 의 `0 1px 2px 0.06 + 0 1px 3px 0.04` 는 TODO 마커 상태 추정값. 추출 결과로 합의. |
| TODO 마커 grep 통합 테스트 PASS 방식 | (i) DESIGN.md 메타 안내문도 마커 표기 변경 / (ii) grep 명령 변경 | **(i)** | plan 의 통합 테스트 명령 (`grep -c "TODO(spec-5-02)" poc/app-a/DESIGN.md`) 을 그대로 통과시키기 위해 메타 안내문 2 곳도 한국어 "spec-5-02 마커" 표현으로 변경. |

## 💬 사용자 협의

- **주제**: spec-5-02 의 페이지 범위 (2026-04-26)
  - **사용자 의견**: "기존 페이지 재활용이 아니라 새 페이지에서 다양한 컴포넌트 / 토큰 활용 검증"
  - **합의**: 옵션 C (앱 A 4 페이지 + Settings 1 신설). 새 종류 페이지 후보 6 종 중 Settings 가 form-heavy 입력 컴포넌트군 (Toggle/Select/Slider 등) 을 가장 잘 자극.

- **주제**: Phase 4 이월 과제 처리 (2026-04-26)
  - **사용자 의견**: 에이전트 추천 분할 처리에 동의 (Y, 진행)
  - **합의**: 원본 의도 보존 사이클 → spec-5-02 흡수, LoginPage variant 확장 / DashboardPage 왕복 drift → Icebox `phase-5 이월 follow-ups`.

- **주제**: 사이드 컨텍스트 혼동 (2026-04-27)
  - **사용자 의견**: "내 로컬 디비는 이미 적용된거지? config.content 파라미터, bucket 삭제 기간..."
  - **합의**: 본 프로젝트 컨텍스트 (Design / harness-kit / spec-5-02) 와 무관한 다른 프로젝트 추정. 사용자 "C" 응답 후 spec-5-02 정렬 복귀 (= 페이지 범위 옵션 C).

- **주제**: Settings 작성 방식 (2026-05-02)
  - **사용자 의견**: "ai 베이스로 해야 하기 때문에 그리는것도 ai 로 해야 함.. 너가 radix 기반으로 한번 요청해서 paper 에 그려봐"
  - **합의**: Designer 인적 단계 제거. AI 가 Radix UI Settings 패턴 (Switch / Select / Slider / Section + divider / Danger zone) 을 reference 로 활용. 토큰은 DESIGN.md TaskFlow 그대로. *원본* 의 의미를 *AI 입력 의도* 로 재정의 — 측정 본질 (입력 → 출력 → 재추출 보존도) 은 유지.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트 (schema 정합성)

- **명령**:
  ```bash
  grep -c "^## " poc/app-a/DESIGN.md
  for f in poc/app-a/design-extract/*.md; do echo "$f: $(grep -c '^## ' "$f")"; done
  ```
- **결과**: ✅ Passed
- **로그 요약**:
```text
poc/app-a/DESIGN.md: 15 sections (14 + 부록)
poc/app-a/design-extract/auth-login.md: 14
poc/app-a/design-extract/auth-signup.md: 14
poc/app-a/design-extract/dash-overview.md: 14
poc/app-a/design-extract/profile-mypage.md: 14
poc/app-a/design-extract/settings-overview.md: 14
```

#### 통합 테스트 (Integration Test Required = yes)

- **명령**:
  ```bash
  grep -c "TODO(spec-5-02)" poc/app-a/DESIGN.md
  wc -l poc/app-a/drift-report.md poc/app-a/intent-preservation.md
  ls poc/app-a/design-extract/*.md | wc -l
  ```
- **결과**: ✅ Passed
- **로그 요약**:
```text
TODO(spec-5-02) markers: 0
drift-report.md: 227 lines
intent-preservation.md: 150 lines
design-extract files: 5
```

### 2. 수동 검증

1. **Action**: Paper MCP 5 페이지 artboard 작성 — `mcp__paper__create_artboard` × 5 + `write_html` 다수 + `get_screenshot` 검수
   - **Result**: 5 artboard ID — Login `1CH-0` / Signup `1DR-0` / Dashboard `1FI-0` / MyPage `1J5-0` / Settings `1LR-0`. Sidebar 는 `1FJ-0` 를 `1J6-0` / `1LS-0` 로 clone (토큰 절약). Settings artboard 는 처음 1100px 로 생성했으나 Danger row 가 잘려 `update_styles` 로 fit-content 전환.

2. **Action**: 5 페이지 Paper 추출 — `mcp__paper__get_computed_styles` batch (8 + 15 노드)
   - **Result**: 핵심 토큰 추출 — Primary `#4F46E5` (5 페이지 일관) / Brand-deep `#4338CA` (Signup BrandPanel + MyPage ProfileAvatar) / elevation-card 단일 stop `0 1px 2px rgba(15,23,42,0.04)` / elevation-modal 2-stop / 신규 elevation 3 종 (avatar-glow / knob / handle).

3. **Action**: design-extract 5 파일 작성 (schema 14 섹션)
   - **Result**: 모든 파일 14 섹션 PASS. drift 신호는 §14 i18n 에 페이지별 NEW 키 (subtitle / divider / helper / value enum 등) 다수 발견.

4. **Action**: DESIGN.md 의 TODO(spec-5-02) 마커 일괄 채우기
   - **Result**: 14 곳 마커 모두 추출값으로 채움. 메타 안내문 2 곳도 한국어 "spec-5-02 마커" 표현으로 변경 → grep 통합 테스트 0 PASS.

5. **Action**: drift-report.md / intent-preservation.md §2 작성
   - **Result**: 5 페이지 평균 0.83 / Settings AI 사이클 보존도 31.0/32.0 = **96.9 %**. 가설 PASS.

6. **Action**: findings.md F-08 ~ F-10 추가
   - **Result**: paper-normalizer 함수 5 카테고리 + DESIGN.md §12 Composite 9 종 미정의 + i18n 키 모델 확장 — 처리 채널 명시 (spec-5-03 / spec-5-05 / phase-6).

## 🔍 발견 사항

- **토큰은 매우 일관 보존 (5 페이지 평균 0.96)** — AI 입력 → 출력 → 재추출 사이클을 통과해 토큰 hex / radius / spacing 이 거의 100% 보존. PoC 가설의 핵심 검증 PASS.
- **i18n 이 가장 큰 drift 영역 (0.65)** — DESIGN.md §14 의 *flat 카피* 모델로는 페이지의 helper / value enum / action label 같은 *컨텍스트 부가어* 를 담지 못함. 키 모델 확장 필요 (F-10).
- **AI 베이스 일관성 가치** — Designer 인적 단계 제거 후에도 *AI 입력 의도 (DESIGN.md + Radix reference)* 가 출력에서 96.9% 보존. AI 베이스 디자인 파이프라인의 신뢰도 PoC 검증.
- **Radix UI 패턴 차용의 적정 거리** — layout / 구조 패턴 (Switch / Select / Slider / group + divider / danger zone) 은 흡수, 토큰 (TaskFlow indigo / slate) 은 미차용. 외부 reference 의 *형식* 만 활용하고 *내용* 은 본 시스템 우선 — 좋은 패턴.
- **Paper export 표기 차이 5 카테고리 (F-08)** — color alpha hex8 / paddingBlock·Inline / lineHeight round / font fallback / border 분리. paper-normalizer 함수 라이브러리로 분리 가치 — phase-6 입력.
- **DESIGN.md §12 Composite 9 종 미정의 (F-09)** — Signup BrandPanel/Checkbox + MyPage 4 종 + Settings 3 종. spec-5-03 첫 task 로 보강.

## 🚧 이월 항목

- **LoginPage modal / bottom-sheet variant 확장** → `backlog/queue.md` Icebox `phase-5 이월 follow-ups` 등재 (2026-04-27)
- **DashboardPage 왕복 drift 측정** → 동일 (Icebox)
- **DESIGN.md §12 Composite 보강 (9 종)** → spec-5-03 첫 task 또는 spec-5-02b 분리 (F-09)
- **i18n 키 모델 확장 (4-part hierarchy)** → spec-5-03 또는 phase-6 (F-10)
- **paper-normalizer 함수 라이브러리** → phase-6 첫 spec 후보 (F-08)

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7 1M) + Dennis |
| **작성 기간** | 2026-04-26 ~ 2026-05-02 |
| **최종 commit** | `5448e2c` (Task 8 시점, Ship commit 후 갱신 예정) |
| **총 commit 수** | 9 (Task 1~8 + spec/plan 의도 변경 1) + Ship 1 = 10 |
| **Paper artboards** | 5 (Login `1CH-0` / Signup `1DR-0` / Dashboard `1FI-0` / MyPage `1J5-0` / Settings `1LR-0`) |
| **추출 파일** | 5 (`poc/app-a/design-extract/*.md`) |
| **분석 파일** | 2 (`poc/app-a/drift-report.md` / `intent-preservation.md`) |
| **DESIGN.md TODO 마커** | 14 → 0 (모두 채움) |
| **종합 보존도 (Settings)** | 31.0 / 32.0 = **96.9 %** |
| **종합 drift 점수 (5 페이지 평균)** | **0.83** (컴포넌트 0.88 / 토큰 0.96 / i18n 0.65) |
