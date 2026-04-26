# spec-5-01 Findings — Blueprint Pipeline 실측 결과

> 본 spec 산출물 4 종 (`blueprint-session.md`, `REQUIREMENTS.md`, `DESIGN.md`, `AGENT.md`) 을 작성하면서 발견한 Blueprint 프로토콜 / 템플릿 / 스키마의 결함 / 모호성 / 과대 명세 / placeholder 불일치 항목.
>
> **범위 규칙**: 본 spec 에서는 결함을 *수정하지 않고 기록만* 한다. 수정은 spec-5-05 (회고) 또는 phase-6 (Studio v1) 에서 일괄 처리.
>
> **분류 태그**:
> - `gap` — 명세 자체가 비어있음 (있어야 할 규칙이 없음)
> - `ambiguity` — 명세는 있으나 해석이 둘 이상
> - `over-spec` — 본 PoC 단계 대비 과도한 명세
> - `placeholder-mismatch` — 템플릿 placeholder 와 입력 스키마의 키 / 형식 불일치

---

## F-01 — Step 1.5 (NFR) 의 spec.md 누락 (`gap`)

- **발견 위치**: `specs/spec-5-01-app-a-blueprint/spec.md` Functional Requirements §1, `schema/blueprint-protocol.md` §Step 1.5
- **현상**: protocol 은 Step 1 / 1.5 / 2 / 3 의 4 단계로 정의되어 있으나, spec.md 의 요구사항 1 은 "Step 1 / Step 2 / Step 3 의 질문, 응답, 결정 근거 기록" 으로 1.5 를 누락했다. 본 spec 작성 중 prototype 적용 시 NFR (auth / i18n / theme) 이 없으면 REQUIREMENTS.md 의 NFR 섹션을 채울 수 없음을 인지하고 blueprint-session.md 에 Step 1.5 를 직접 추가했다.
- **영향**: 향후 spec 에서 동일한 누락이 반복될 위험. spec.md 작성 시 protocol 의 모든 단계를 빠짐없이 반영하는 체크리스트가 필요.
- **처리 제안**: spec 템플릿 또는 protocol 문서에 "필수 단계: 1, 1.5, 2, 3" 명시 + 각 단계의 산출 키를 spec 작성 가이드에 포함.

---

## F-02 — DESIGN.md 템플릿이 Blueprint 출력만으로는 채워지지 않음 (`placeholder-mismatch`)

- **발견 위치**: `templates/DESIGN.md.template`, `schema/blueprint-protocol.md` §"DESIGN.md 전용 확장 필드"
- **현상**: DESIGN.md.template 은 `{{visualTheme.description}}`, `{{colors.primary[].hex}}`, `{{typography.hierarchy[].size}}`, `{{tokenMapping.colors[].hex}}` 등 디자인 도구 (Paper / Figma) 추출값을 placeholder 로 사용한다. 그러나 Blueprint Step 1~3 의 출력 YAML 에는 이 키들이 존재하지 않는다. protocol §"자동 주입 / 외부 소스" 표가 "DESIGN.md 시각 디자인 필드 → 디자인 도구 추출 (Phase 4 ~ 7 파이프라인)" 으로 위임하지만, **위임 시점 / 실행 주체 / 미완 표기 규약은 명시되어 있지 않다**.
- **영향**: 본 spec (Blueprint phase) 단계에서 DESIGN.md 를 작성할 때 50% 이상의 placeholder 가 즉시 치환 불가. 본 spec 은 `TODO(spec-5-02)` 임시 마커로 표기했으나, 이는 protocol 이 정의한 규칙이 아닌 ad-hoc 결정.
- **처리 제안**: protocol 에 "Blueprint phase 산출물 vs Design tool extraction 산출물" 의 두 단계 분리를 명시하고, 각 단계에서 채워지는 placeholder 목록과 미완 표기 규약 (`TODO(...)`) 을 정의. 또는 DESIGN.md 템플릿을 두 단계로 분할 (DESIGN.intent.md + DESIGN.visual.md).

---

## F-03 — `route` / `layout` / `sections` 기본값 규칙은 있으나 출력 YAML 에 키 없음 (`gap`)

- **발견 위치**: `schema/blueprint-protocol.md` §"DESIGN.md 전용 확장 필드"
- **현상**: protocol 은 "Blueprint Step 1~3 에서 수집되지 않으면 아래 기본값을 적용한다" 라고 `route`, `layout`, `description`, `sections` 의 기본값 규칙을 정의하지만, Step 3 출력 YAML 의 `finalPages[]` 항목 스키마에는 이 키들이 존재하지 않는다. AI direct-fill 의 "누락 키 → fail fast" 원칙 (§"direct-fill 실행 순서" 3 항) 과 "기본값 자동 적용" 규칙이 충돌한다.
- **영향**: 본 spec 에서 DESIGN.md §10 Page Map / §11 Page Specifications 의 route 와 layout 을 임의로 결정 (예: `/login`, `centered-card`). 이 결정이 protocol 에 의한 자동 유도인지, agent 의 추론인지 추적 불가.
- **처리 제안**: Step 3 출력 YAML 에 `finalPages[].route`, `finalPages[].layout` 을 명시적 필드로 추가하거나, "fill 단계에서 기본값 적용" 을 fail-fast 규칙의 예외로 명시.

---

## F-04 — Template status 어휘 불일치 (`placeholder-mismatch`)

- **발견 위치**: `schema/page-catalog.md` (✅/⬜), `schema/blueprint-protocol.md` Step 3 출력 YAML (`templateMapping.status: implemented | not-implemented`), REQUIREMENTS.md.template 매핑 표 (`{{templateMapping.status}}`)
- **현상**: 동일한 의미가 세 곳에서 서로 다른 어휘로 표현된다.
  - page-catalog: `✅ LoginPage` / `⬜`
  - protocol Step 3 YAML: `implemented` / `not-implemented`
  - REQUIREMENTS.md 출력 (예시): `✅ 구현 완료` / `⬜ 미구현`
- **영향**: Fill Executor (AI direct-fill) 가 `{{templateMapping.status}}` 를 어떤 어휘로 출력해야 하는지 명시 없음. 본 spec 은 `✅ 구현 완료` / `⬜ 미구현` 한국어 표기를 임의 채택.
- **처리 제안**: 어휘 변환 표를 protocol 또는 design-component-mapping.md 에 명시. 예: `implemented → ✅ 구현 완료`, `not-implemented → ⬜ 미구현`.

---

## F-05 — Optional sections 빈 배열의 표시 규약 부재 (`ambiguity`)

- **발견 위치**: `templates/REQUIREMENTS.md.template` `{{#each optionalSections}}` 블록, `templates/DESIGN.md.template` 동일 패턴
- **현상**: `optionalSections` 가 빈 배열일 때 (예: common-error 페이지) `{{#each}}` 블록이 빈 출력을 만든다. Markdown 결과는 "**선택 섹션**:" 헤더 + 빈 본문이 되어 어색하다.
- **영향**: 본 spec 의 REQUIREMENTS.md 는 임의로 `- (없음)` 라인을 추가했고, DESIGN.md 는 헤더 자체를 생략했다. 두 처리가 서로 다름.
- **처리 제안**: Handlebars 의 `{{#each}}...{{else}}...{{/each}}` 또는 protocol 에 "빈 배열 표시 규약 (`-` 또는 행 생략)" 을 명시.

---

## F-06 — 미구현 Template 의 이름 유추 규칙 없음 (`ambiguity`)

- **발견 위치**: `schema/blueprint-protocol.md` Step 3 출력 YAML `templateMapping.template`
- **현상**: page-catalog.md 에서 `⬜` 인 페이지는 Template 이름이 없다. 본 spec 은 페이지 ID (`profile-mypage`) 에서 PascalCase 유추 (`MyPage`) 했으나, protocol 에 이 규칙이 명시되어 있지 않다.
- **영향**: 다른 agent 가 같은 spec 을 작성하면 다른 이름 (`ProfileMyPage` 등) 을 채택할 수 있음 — 비결정성.
- **처리 제안**: protocol 에 "미구현 Template 이름 유추 규칙: `{category}-{slug}` → PascalCase, 단 1 어절 페이지는 prefix 생략 (`profile-mypage` → `MyPage`)" 또는 Step 3 응답에서 사용자에게 직접 입력받는 절차 추가.

---

## F-07 — Phase 2 Template 재사용 vs 복제 결정 시점 (`gap`)

- **발견 위치**: `templates/AGENT.md.template` §4 Template 매핑, 본 spec 의 AGENT.md §2 디렉토리 구조
- **현상**: 본 PoC (TaskFlow) 가 Phase 2 의 `studio/src/components/templates/LoginPage` 를 import 로 재사용할지, 별도로 `poc/app-a/src/components/templates/LoginPage` 로 복제할지 protocol / template 에 명시 없음. AGENT.md 작성 시 양쪽 옵션을 모두 언급하고 spec-5-03 으로 결정 위임했다.
- **영향**: spec-5-03 React 구현 단계에서 결정 부담 + 잘못된 선택 시 spec-5-04 (앱 B) 의 재사용성 측정에 영향. import 재사용은 모놀리식 결합도 증가, 복제는 재사용성 측정 노이즈.
- **처리 제안**: Phase 5 PoC 가이드 (phase-5.md) 에 "Phase 2 Template 의 PoC 활용 정책" 추가. import 가 기본, 변형 필요 시 wrap 또는 fork.

---

## 항목 요약

| ID | 분류 | 한 줄 요약 |
|---|---|---|
| F-01 | gap | spec.md 가 protocol Step 1.5 (NFR) 를 누락 |
| F-02 | placeholder-mismatch | DESIGN.md 시각 필드는 Blueprint 출력만으로 채울 수 없음 |
| F-03 | gap | route / layout 기본값 규칙은 있으나 YAML 키 없음 (fail-fast 와 충돌) |
| F-04 | placeholder-mismatch | Template status 어휘 (✅ / implemented / 구현 완료) 3 종 불일치 |
| F-05 | ambiguity | optionalSections 빈 배열 표시 규약 부재 |
| F-06 | ambiguity | 미구현 Template 이름 유추 규칙 없음 |
| F-07 | gap | Phase 2 Template 의 PoC 재사용 / 복제 정책 없음 |

> 본 7 항목은 spec-5-05 (파이프라인 회고) 와 phase-6 (Studio v1) 의 입력으로 활용된다.
