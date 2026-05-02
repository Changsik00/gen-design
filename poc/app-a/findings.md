# Findings — Pipeline 실측 결과 (spec-5-01 / spec-5-02 누적)

> 각 spec 의 산출물 작성 / 추출 단계에서 발견한 프로토콜 / 템플릿 / 스키마의 결함 / 모호성 / 과대 명세 / placeholder 불일치 / Studio v1 (phase-6) 입력 항목.
>
> **범위 규칙**: 결함은 *수정하지 않고 기록만* 한다. 수정은 spec-5-05 (회고) 또는 phase-6 (Studio v1) 에서 일괄 처리.
>
> **누적 (2026-05-02)**: spec-5-01 (F-01 ~ F-07) + spec-5-02 (F-08 ~ F-10).
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

---

# spec-5-02 Findings — Paper 추출 / drift / 의도 보존 측정

> Paper artboard 5 페이지 작성 / 추출 / DESIGN.md TODO 채우기 / drift report / intent preservation 사이클을 거치며 발견한 항목.

## F-08 — paper-normalizer 함수 라이브러리 후보 (`phase-6 입력`)

- **발견 위치**: `poc/app-a/drift-report.md` §2 표기 정규화 비교 5 카테고리
- **현상**: Paper export 와 일반 React/CSS 표기 사이에 의미 동일하지만 표기가 다른 5 카테고리 발견.
  - `normalizeHexAlpha(hex8: string): string` — `#0F172A2E` → `rgba(15, 23, 42, 0.18)` (8자리 hex 의 마지막 2자리 = `0x2E / 0xFF` ≈ 0.18 변환)
  - `normalizePadding(block: string, inline: string): string` — `paddingBlock + paddingInline` → `padding` shorthand
  - `normalizeLineHeight(roundExpr: string): number | string` — `round(up, 130%, 1px)` → `1.3` (배수 표기)
  - `normalizeFontFallback(family: string, target: "react" | "tailwind"): string` — Paper export 의 짧은 fallback chain 을 DESIGN.md §3 의 풀 chain (`Inter, ui-sans-serif, system-ui, sans-serif`) 으로 확장
  - `normalizeBorder(width, style, color): string` — `borderWidth + borderStyle + borderColor` 3 분리 표기 → `border: 1px solid #E2E8F0` shorthand
- **영향**: phase-6 Studio v1 의 자동 코드 생성 단계에서 매번 ad-hoc 변환을 수행하면 일관성 / 유지보수 부담. 단일 함수 라이브러리로 분리하면 모든 Paper → React 변환에 동일 규칙 적용 가능.
- **처리 제안**: phase-6 의 첫 spec 으로 promote (`paper-normalizer` 라이브러리 단독 spec) — 입력은 본 spec 의 `poc/app-a/design-extract/*.md` 5 파일 + drift-report.md §2.

## F-09 — DESIGN.md §12 Composite 보강 필요 (`gap`)

- **발견 위치**: `poc/app-a/design-extract/profile-mypage.md` §12 / `settings-overview.md` §12 / `auth-signup.md` §12
- **현상**: 5 페이지 추출 결과에서 DESIGN.md §12 미정의 Composite 패턴 다수 발견.
  - **Signup**: `BrandPanel` (page-level 좌측 인디고 패널) / `Checkbox` (Atom — 18×18 indigo bg, radius 4)
  - **MyPage**: `ProfileChip` (height 22 / radius 6 / bg indigo-subtle) / `ProgressBar` (6px track + fill / radius 999) / `OutlineDangerButton` (white bg + red border + red text) / `AvatarUploadCard` (preview + description + actions)
  - **Settings**: `SettingsInfoRow` (label + inline button) / `SettingsActionRow` (동일 형태) / `DangerZone` (tinted bg + border + DangerButton)
- **영향**: spec-5-03 React 구현 시 Composite 정의 부재로 ad-hoc 컴포넌트 생성 위험. 앱 B (spec-5-04) 의 재사용성 측정에 노이즈.
- **처리 제안**: spec-5-03 첫 task 로 DESIGN.md §12 보강 (Composite 9 종 추가) 후 React 구현 진입. 또는 spec-5-02b 로 분리 (DESIGN.md §12 단독 보강) — 부담 적은 쪽 선택.

## F-10 — i18n 키 모델 확장 필요 (`gap`)

- **발견 위치**: `poc/app-a/design-extract/*.md` 5 페이지 모두의 §14, `poc/app-a/drift-report.md` §3.2 패턴 2
- **현상**: DESIGN.md §14 의 i18n 키는 *기본 카피* 만 정의 (`login.title` / `settings.notifications.email` 등). 실제 페이지에는 helper / value enum / action label 등 *컨텍스트 부가어* 가 다수 — 5 페이지 합산 NEW 70+ 키 발견.
  - 예: `settings.notifications.email` (DESIGN.md) → 추출은 `.email.label` + `.email.helper` 2 슬롯으로 분리.
  - 예: `mypage.avatar.upload` (DESIGN.md 단일 키) → 추출은 `.changeAvatar` / `.uploadNew` / `.remove` 3 종 action.
- **영향**: i18n 키 모델이 *flat 카피* 에서 *구조화 슬롯* (key + helper + value + action) 으로 확장되지 않으면 spec-5-04 (앱 B 토큰/i18n 교체) 시 카피 재정의에 부담. 또한 한국어 i18n 추가 시 슬롯 단위 매핑 규칙이 없으면 인적 작업 큼.
- **처리 제안**: spec-5-03 또는 phase-6 에서 i18n schema 확장. 권장 키 패턴: `{page}.{section}.{element}.{slot}` 4-part hierarchy + `slot` enum (`label` / `helper` / `placeholder` / `value` / `action` / `description`).

---

## 항목 요약

| ID | spec | 분류 | 한 줄 요약 |
|---|---|---|---|
| F-01 | 5-01 | gap | spec.md 가 protocol Step 1.5 (NFR) 를 누락 |
| F-02 | 5-01 | placeholder-mismatch | DESIGN.md 시각 필드는 Blueprint 출력만으로 채울 수 없음 |
| F-03 | 5-01 | gap | route / layout 기본값 규칙은 있으나 YAML 키 없음 (fail-fast 와 충돌) |
| F-04 | 5-01 | placeholder-mismatch | Template status 어휘 (✅ / implemented / 구현 완료) 3 종 불일치 |
| F-05 | 5-01 | ambiguity | optionalSections 빈 배열 표시 규약 부재 |
| F-06 | 5-01 | ambiguity | 미구현 Template 이름 유추 규칙 없음 |
| F-07 | 5-01 | gap | Phase 2 Template 의 PoC 재사용 / 복제 정책 없음 |
| **F-08** | **5-02** | **phase-6 입력** | **paper-normalizer 함수 5 카테고리 (color alpha / padding / lineHeight / font fallback / border)** |
| **F-09** | **5-02** | **gap** | **DESIGN.md §12 Composite 9 종 미정의 (BrandPanel / ProfileChip / DangerZone 등)** |
| **F-10** | **5-02** | **gap** | **i18n 키 모델 확장 — flat 카피 → 구조화 슬롯 (label/helper/value/action)** |

> spec-5-01 의 7 항목 + spec-5-02 의 3 항목 = 누적 10 항목.
> 처리 채널:
> - spec-5-03 (React 구현) — F-09 / F-10 흡수 또는 spec-5-02b 로 분리
> - spec-5-05 (파이프라인 회고) — F-01 ~ F-07
> - phase-6 (Studio v1) — F-08 + 누적 항목 통합 처리
