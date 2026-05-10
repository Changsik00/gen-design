# ADR-008: per-spec 로컬 design 파일 정책 — 글로벌 직접 편집 (옵션 B)

> **상태**: 승인 (Accepted)
> **날짜**: 2026-05-10
> **의사결정자**: Dennis
> **연관 문서**: ADR-007 (FRONT.md = SSOT 4 문서 + 2 디렉토리), docs/handbook.md §3 (아키텍처 매트릭스)
> **선행 ADR**: ADR-007 (SSOT 구조 정의 — per-spec 슬라이스 정책의 전제)

## 컨텍스트

ADR-007 가 SSOT 4 문서 (`DESIGN.md` / `TOKEN.md` / `FRONT.md` / `spec/<x>.spec.md`) + 2 디렉토리 (`assets/` / `spec/`) 구조를 확정한 후, phase-7 9 spec 진행 중 다음 패턴이 관찰됨:

> 한 spec 의 PR 이 *글로벌 SSOT 의 일부* 만 변경. 예: spec-7-05 가 `templates/FRONT.md` 의 §3 (4 layer variant) + `studio/src/lib/spec-md-compiler/react/` 만 수정. spec-7-06 은 `templates/DESIGN.md` 의 §11 + `studio/src/features/spec-editor/` 만 수정.

즉 *spec 단위의 변경* 이 *글로벌 SSOT 의 슬라이스* 로 표현되고 있음. 자연스럽게 다음 질문:

> "spec dir 안에 *해당 spec 이 건드린 design 정보만* 별도 파일로 두면 더 좋지 않을까? `specs/spec-7-05-react-compiler/DESIGN.md`, `specs/spec-7-05-react-compiler/FRONT.md` 처럼."

### 현재 상태 (phase-7 9 spec 머지 시점)

- 모든 spec 의 design 변경이 *글로벌* 파일 (`templates/DESIGN.md`, `templates/FRONT.md`, `templates/TOKEN.md`) 에 직접 반영됨
- spec dir (`specs/spec-7-X-Y/`) 은 spec/plan/task/walkthrough/pr_description 만 보유 — design 슬라이스 0
- PR diff 가 *어느 글로벌 섹션이 어떻게 바뀌었는지* 를 보여주는 *유일한 슬라이스 표현*

### 문제점

| # | 문제 | 위험도 |
|---|---|---|
| 1 | *글로벌 충돌 가능성* — 두 spec 이 동시에 `templates/FRONT.md` 의 §3 을 수정하면 머지 충돌 | 낮음 (현재 phase-7 까지는 단일 spec 진행) |
| 2 | *결정 history 추적 어려움* — 글로벌 파일의 git blame 만으로 "이 줄이 어느 spec 에서 추가됐는지" 추적 가능하지만 *시각적 슬라이스 부재* | 중간 |
| 3 | *외부 디자이너 alpha 시 학습 곡선* — *spec 단위로 본 내가 무엇을 변경하는가* 를 보려면 git diff 를 직접 읽어야 함 | 중간 |
| 4 | *자동 생성의 부담* (옵션 A 채택 시) — 모든 spec 이 design 슬라이스를 *반드시* 생성해야 함. design 변경 0 인 spec (예: 빌드 픽스) 도 빈 파일이 쌓임 | 높음 |

## 결정

### D-1: 옵션 B (글로벌 직접 편집) 채택

- spec 의 design 변경은 *글로벌 SSOT* (`templates/DESIGN.md`, `templates/FRONT.md`, `templates/TOKEN.md`, `templates/assets/`, `spec/<x>.spec.md`) 를 *직접 편집*
- spec dir 안에는 design 슬라이스 파일을 *생성하지 않음*
- *변경 슬라이스의 시각적 표현* 은 *PR diff 자체* 가 담당

### D-2: 옵션 비교

| 옵션 | 장점 | 단점 |
|---|---|---|
| **A. spec dir 안 자동 생성** (`specs/spec-X-Y/DESIGN.md`, `FRONT.md`, `TOKEN.md`, `assets/`) + sdd 또는 gen-design init 명령 | 슬라이스 시각화 / 결정 history 가 spec dir 단위 / 충돌 위험 0 | 빈 파일 누적 / 글로벌 ↔ 슬라이스 동기화 매 spec 마다 필요 / sdd / gen-design 의 생성 / 머지 / lint 도구 부담 / *디자이너 학습 곡선 ↑* |
| **B. 글로벌 직접 편집** + PR diff 가 슬라이스 | 단일 진실 / 동기화 0 부담 / 도구 부담 0 / 디자이너 학습 곡선 ↓ | 다중 spec 동시 진행 시 글로벌 충돌 가능 / 결정 history 가 git blame 으로만 가시 / 외부 alpha 시 *spec 단위 슬라이스 가시화* 부재 |

### D-3: 옵션 B 선택 이유

1. **phase-7 9 spec 의 실증** — 단일 spec 흐름에서 충돌 0 회. 현재 워크플로의 마찰 없음.
2. **단일 진실의 단순함** — 글로벌 파일 한 곳에서 *지금* 의 진실 확인. 슬라이스 누적은 *git history* 로 검색 가능.
3. **자동 생성의 *영구* 부담** — 옵션 A 는 *모든* 미래 spec 에 design 파일 생성 / 동기화 책임을 부과. 디자인 변경 0 인 fix-spec (spec-7-08, 09, 10) 에는 *순수 부담*.
4. **외부 디자이너 alpha 의 진입 장벽** — handbook §3 매트릭스 + git diff 학습이 *설명 가능* 한 학습 곡선. 옵션 A 는 *추가* 디렉토리 컨벤션 학습 필요.

### D-4: Reconsider Trigger (옵션 A 재검토 조건)

다음 중 *하나* 이상 발생 시 ADR-008-revised 를 작성하여 옵션 A 로 전환 검토:

1. **다중 spec 동시 진행** 이 일상화되어 글로벌 SSOT 머지 충돌이 *반복적* 으로 발생 (예: 분기당 3+ 회).
2. **외부 디자이너 alpha 피드백** 에서 "한 spec 이 *내가 어디를* 바꿨는지 즉시 보이지 않음" 이 *반복* 보고 (3+ 명).
3. **spec 의 design 변경 단위가 작아지고 *다양해져* (variant 변경 / 토큰 추가 / 컴포넌트 swap 등) git diff 만으로는 슬라이스 의미가 *불명확* 한 케이스가 다수 발생.

위 trigger 발생 전까지는 옵션 B 유지. trigger 의 측정은 phase 회고 + 사용자 피드백 수집을 통해.

### D-5: 후속 액션

1. `docs/handbook.md` §3 (아키텍처 매트릭스) 의 *디렉토리 컬럼* 에 본 결정 반영 — *모든* 정보 종류는 *글로벌 우선*, 슬라이스 표현은 PR diff.
2. `docs/handbook.md` §4 (디자이너 일주일 워크플로) 의 *Day 4-5 통합 단계* 에서 글로벌 직접 편집 패턴 명시 — `templates/DESIGN.md` 의 해당 페이지 섹션 추가 / `spec/<x>.spec.md` 신규 / `templates/FRONT.md` 의 어휘 entry 갱신 (필요 시).
3. ADR-009 (gen-design CLI) 의 `merge` 명령은 *옵션 A 도입 시* 만 필요 — 본 ADR 의 결정 결과 *현재* 우선순위 ↓.

## 결과

### 즉시 영향

- phase-7 의 모든 spec PR 패턴이 *공식 정책* 화 — "글로벌 직접 편집 + PR diff = 슬라이스" 가 phase-8 부터의 *명문 룰*.
- spec dir 의 구조 변경 0 — `specs/spec-7-X-Y/` 는 spec/plan/task/walkthrough/pr_description 그대로.

### 장기 영향

- 외부 디자이너 alpha 진행 시 *글로벌 파일 직접 편집* 가이드를 handbook §4 워크플로 시나리오로 제공. 슬라이스 학습 부담 0.
- 다중 spec 동시 진행이 *불가피한 시점* 까지 옵션 A 도입 미룸. 그 시점의 측정 데이터 (충돌 빈도) 가 ADR-008-revised 의 근거.
- gen-design CLI (ADR-009) 의 `merge` 명령은 *옵션 A 채택 시점* 까지 도입 보류 — 즉 *현재* 는 5 명령 중 4 개만 phase-8 후보.

### Out of scope (본 ADR)

- gen-design 명령군의 설계 — ADR-009 별도.
- 글로벌 SSOT 의 *충돌 해결* 워크플로 — phase-8 의 다중 spec 시나리오에서 측정 후 결정.
- 외부 디자이너 alpha 의 진행 절차 — phase-7 ship 후 사용자 트랙.

## 회고

- 옵션 A 의 *시각화 매력* vs 옵션 B 의 *단순함* 의 trade-off. phase-7 9 spec 의 실증이 결정에 가중. *YAGNI* (You Aren't Gonna Need It) 원칙 적용 — 충돌이 *실제* 일어나기 전엔 옵션 A 의 도구 / 컨벤션 부담을 미룸.
- handbook §3 매트릭스가 *디렉토리 컬럼* 을 통해 본 ADR 의 결정을 *정보 종류별* 로 반복 명시 — 향후 신규 정보 종류 추가 시 매트릭스 행 갱신만으로 진실 유지.
- Reconsider trigger 가 *측정 가능한 조건* (분기당 3+, 알파 3+ 명, etc.) — *기분이 아닌 데이터* 로 ADR 재논의.
