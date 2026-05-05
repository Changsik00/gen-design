# Implementation Plan: spec-5-04

## 📋 Branch Strategy

- 신규 브랜치: `spec-5-04-app-b-reusability`
- 시작 지점: `main`
- 첫 task 가 브랜치 생성 — 단, alignment 단계에서 §10.1 재발 방지 차원으로 이미 생성됨 → task 1 [-] pass + 사유 기록 (spec-5-03 와 동일 패턴)

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **앱 B 의 브랜드명 / 정체성** — "FlowDesk" / "플로우데스크" 로 결정 (spec-5-03 의 미정 사항 1 의 추천 옵션 A — 같은 SaaS 톤, 다른 색상). 도메인 / 비주얼 톤은 추가 변경 가능
> - [ ] **Primary 색** — emerald `#059669` (Tailwind emerald-600 동급). 다른 hue 선호 시 변경 가능 (예: amber / rose / sky / violet 등)
> - [ ] **Accent 색** — primary 와 보색 관계의 hue. emerald 의 경우 amber `#F59E0B` 가 자연스러우나 주관 영역
> - [ ] **studio 코드 변경 정책** — hardcode 발견 시 본 spec 에서 수정 vs spec-x 분리. 추천: 발견만 본 spec, 수정은 spec-5-05 직전 별도 spec-x

> [!WARNING]
> - [ ] **app-a 페이지 코드 복제** — 라우트 / 페이지 / hook 의 거의 그대로 복제 후 텍스트만 변경. 코드 중복이 발생하지만 PoC 답게 단순. spec-5-05 회고에서 페이지 진입점 추상화 (예: `<AppShell tokens i18n />` 컴포넌트) 필요성 평가
> - [ ] **i18n ko.json 번역 품질** — Native 한국어 번역, 의미 전달 우선 (직역 회피). DESIGN.md §14 의 60+ 키 모두 번역

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```mermaid
flowchart LR
  subgraph studio[studio 공유 라이브러리 (변경 0)]
    direction TB
    TPL[templates × 6]
    COMP[composites × 20]
    UI[ui atoms × 8]
  end
  subgraph appa[poc/app-a — TaskFlow]
    AT[tokens.json<br/>indigo + teal]
    AI[i18n/en.json]
    AP[src/pages × 6]
  end
  subgraph appb[poc/app-b — FlowDesk]
    BT[tokens.json<br/>emerald + amber]
    BI[i18n/ko.json]
    BP[src/pages × 6]
  end
  studio --> appa
  studio --> appb
  AT -. compare .-> BT
  AI -. compare .-> BI
  AP -. compare .-> BP
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **monorepo** | `pnpm-workspace.yaml` 에 `poc/app-b` 추가 (3 패키지: studio + app-a + app-b) | spec-5-03 패턴 답습 |
| **app-b 셋업** | `poc/app-a/{vite.config,tsconfig*,index.html,package.json,src/test-setup,src/index.css,tokens/build.mjs}` 패턴 그대로 복사 후 brand name / 의존성만 변경 | 변경 폭 최소화 가설 |
| **tokens.json** | DTCG, color 만 변경 (emerald primary), 나머지 (radius/spacing/font/elevation) app-a 와 동일값 | "토큰 중에서도 color 만 교체" 의 minimum 검증 |
| **i18n/ko.json** | DESIGN.md §14 의 60+ 키를 한국어로 직역 + Native 화. namespace 키 이름은 동일 (`login.title`, `dashboard.stats.activeTasks` 등) | i18n 키 수준의 정합성 + 한국어 표시 |
| **src/pages** | app-a 의 6 페이지 (`login/signup/dashboard/mypage/settings/error`) 그대로 복제. mock 데이터 (이름/숫자) 만 한국어로 변경 | "페이지 코드 동일" 검증 |
| **useTexts hook** | 동일 구조, i18n source 만 ko.json | i18n 흐름 동일성 |
| **공유 비율 측정** | `cloc` 또는 `wc -l` 기반 단순 LOC. studio_LOC vs (appa_LOC + appb_LOC). 80%+ 목표 | PoC 단순 |

## 📂 Proposed Changes

### Workspace 설정

#### [MODIFY] `pnpm-workspace.yaml`

```yaml
packages:
  - 'studio'
  - 'poc/app-a'
  - 'poc/app-b'  # 신규
```

### app-b 신규 패키지

#### [NEW] `poc/app-b/{package.json, vite.config.ts, tsconfig*.json, index.html, src/test-setup.ts, src/index.css, tokens/build.mjs}`

app-a 의 동일 파일 복사 + name 만 `app-b` 로 변경.

#### [NEW] `poc/app-b/tokens.json`

DESIGN.md §13 의 토큰 셋에서 color 만 변경:

```jsonc
{
  "semantic": {
    "color": { "$type": "color", "light": {
      "primary": "#059669",        // emerald-600
      "primary-hover": "#047857",  // emerald-700
      "primary-active": "#065F46", // emerald-800
      "primary-subtle": "#D1FAE5", // emerald-100
      "accent": "#F59E0B",         // amber-500
      // ... 나머지는 app-a 와 동일 (text/surface/status/sidebar)
    }}
    // radius / spacing / font / elevation 은 app-a 와 동일
  }
}
```

#### [NEW] `poc/app-b/i18n/ko.json`

DESIGN.md §14 의 키 60+ 한국어:

```jsonc
{
  "app": { "name": "플로우데스크" },
  "nav": { "home": "홈", "tasks": "작업", "settings": "설정" },
  "login": {
    "title": "플로우데스크에 로그인",
    "form": {
      "email": { "label": "이메일", "placeholder": "you@company.com" },
      // ...
    },
    // ...
  },
  // signup / dashboard / mypage / settings / error 모두 한국어
}
```

#### [NEW] `poc/app-b/src/{main.tsx, App.tsx, hooks/useTexts.ts, pages/*.tsx, __tests__/routes.test.tsx}`

app-a 의 동일 파일 복사 + 변경:
- `useTexts.ts`: i18n source 를 `ko.json` 으로
- `pages/dashboard.tsx`: mock stats / activities 의 한국어 텍스트로
- `pages/mypage.tsx`: mock profile / summary 의 한국어 데이터
- `pages/settings.tsx`: themeOptions / languageOptions / timezoneOptions 의 label 한국어
- `index.html`: title 한국어
- `__tests__/routes.test.tsx`: 한국어 텍스트 검증

#### [NEW] `poc/app-b/reuse-report.md`

LOC 측정 + 80%+ 충족 여부 + 발견 hardcode 목록.

### Spec / Ship 산출물

#### [NEW] `specs/spec-5-04-app-b-reusability/{walkthrough.md, pr_description.md}`

Ship 단계.

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)

```bash
pnpm -r test
```

- studio: 30 files / 115 tests (변경 없음, 기존 PASS)
- poc/app-a: 1 file / 5 tests (변경 없음, 기존 PASS)
- poc/app-b: 1 file / 6 ~ 8 tests (신규 — 한국어 텍스트 + emerald primary 검증)

### 빌드 검증

```bash
pnpm -r build
```

- 3 패키지 모두 빌드 성공.

### 수동 검증 시나리오

1. **`pnpm install`** — 3 workspace projects 인식.
2. **`pnpm --filter app-b tokens`** — `_tokens.css` 생성, primary 가 emerald.
3. **`pnpm --filter app-b dev`** — http://localhost:5173 (또는 다른 포트) 에서 6 라우트 한국어 + emerald 색.
4. **시각 비교 (간단)**: app-a 와 app-b 를 동시에 띄워 같은 페이지 (예: /login) 가 토큰만 다른 시각 표현인지 확인.
5. **reuse-report.md 검토** — LOC 비율, 발견된 hardcode (있다면).

## 🔁 Rollback Plan

- pnpm workspace 에 app-b 추가가 문제면 `pnpm-workspace.yaml` 의 한 줄 제거.
- studio 컴포넌트에서 hardcode 발견 시 본 spec 에서는 reuse-report.md 에 기록만 (수정은 후속 spec).
- ko.json 번역 품질 이슈 시 native 검토 후 수정.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship + push + PR
