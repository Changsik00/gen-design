# Templates Assets

> 앱 간 재사용 가능한 **시스템 리소스의 단일 소스**.
> studio 를 포함한 모든 소비자 앱은 Vite alias `@assets` 를 통해 이 디렉토리를 참조합니다.

## 디렉토리 구조

```
templates/assets/
├── i18n/                   # 다국어 텍스트 리소스
│   ├── ko.json             # 한국어 (기본)
│   └── en.json             # 영어
├── tokens/                 # 디자인 토큰
│   ├── tokens.json         # 기본 브랜드 토큰 (semantic.light / semantic.dark / radius / font)
│   └── tokens-brand-b.json # 대체 브랜드 토큰
├── images/                 # 공통 이미지 리소스 (로고, 아이콘 등)
└── README.md               # 이 파일
```

## 이주 상태 (spec-3-04 완료)

| 리소스 | 이전 위치 | 현재 위치 |
|---|---|---|
| i18n ko.json | `studio/src/i18n/ko.json` | `templates/assets/i18n/ko.json` ✓ |
| i18n en.json | `studio/src/i18n/en.json` | `templates/assets/i18n/en.json` ✓ |
| tokens.json | `studio/tokens/tokens.json` | `templates/assets/tokens/tokens.json` ✓ |
| tokens-brand-b.json | `studio/tokens/tokens-brand-b.json` | `templates/assets/tokens/tokens-brand-b.json` ✓ |

## 참조 방식: Vite alias `@assets`

studio 와 후속 앱은 **Vite alias + TypeScript path** 를 통해 `@assets/*` 경로로 접근한다.

### 설정

**`studio/vite.config.ts`**
```ts
resolve: {
  alias: {
    "@assets": path.resolve(__dirname, "../templates/assets"),
  },
}
```

**`studio/tsconfig.app.json`**
```json
"paths": {
  "@assets/*": ["../templates/assets/*"]
}
```

**`studio/vitest.config.ts`** — 동일 alias (테스트 환경 일관성)

### 사용 예

```ts
// studio/src/lib/i18n.ts
import koJson from "@assets/i18n/ko.json";
import enJson from "@assets/i18n/en.json";
```

```ts
// studio/tokens/build.mjs  (Node 스크립트 — alias 미적용, 상대 경로 사용)
const tokensDir = new URL("../../templates/assets/tokens/", import.meta.url);
```

### 기각된 대안

| 방식 | 기각 사유 |
|---|---|
| **심볼릭 링크** | Windows 관리자 권한 / Developer Mode 필요, `core.symlinks=false` 시 Git checkout 에서 텍스트 파일로 풀림, pnpm workspace symlink 와 이중 꼬임, Vite HMR / Docker 빌드 컨텍스트 불안정 |
| **빌드 시 복사** | 이중 source-of-truth (복사본 vs 원본), 드리프트 발생 위험, watcher 갱신 지연 |

`@assets` alias 는 크로스플랫폼, IDE/TS 1급 지원, 추가 빌드 단계 불요 — 유일한 지속 가능 방식으로 채택됨 (spec-3-04, 2026-04-19).

## 새 앱 생성 시 사용법

1. `templates/REQUIREMENTS.md.template` → Blueprint 질의서로 채움 → `REQUIREMENTS.md`
2. 앱의 `vite.config.*` / `tsconfig.json` 에 `@assets` alias 를 동일하게 추가
3. i18n / 토큰 참조는 `@assets/i18n/*`, `@assets/tokens/*` 로 통일
4. 브랜드 교체: `tokens.json` → `tokens-brand-b.json` 로 빌드 스위치 (복제 없음)
5. 언어 추가: `templates/assets/i18n/` 에 `{locale}.json` 추가
