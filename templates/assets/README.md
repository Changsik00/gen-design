# Templates Assets

> 앱 간 재사용 가능한 리소스를 보관하는 디렉토리.
> 각 앱 프로젝트는 빌드 시 이 디렉토리의 리소스를 참조하거나 복사합니다.

## 디렉토리 구조

```
templates/assets/
├── i18n/               # 다국어 텍스트 리소스
│   ├── ko.json         # 한국어 (기본)
│   └── en.json         # 영어
├── tokens/             # 디자인 토큰
│   ├── tokens.json     # 기본 브랜드 토큰
│   └── tokens-brand-b.json  # 대체 브랜드 토큰
├── images/             # 공통 이미지 리소스
│   └── (로고, 아이콘 등)
└── README.md           # 이 파일
```

## 현재 상태

Phase 2에서 생성된 리소스가 아직 studio 내부에 위치합니다:

| 리소스 | 현재 위치 (앱 종속) | 목표 위치 (템플릿) |
|---|---|---|
| i18n ko.json | `studio/src/i18n/ko.json` | `templates/assets/i18n/ko.json` |
| i18n en.json | `studio/src/i18n/en.json` | `templates/assets/i18n/en.json` |
| tokens.json | `studio/tokens/tokens.json` | `templates/assets/tokens/tokens.json` |
| tokens-brand-b.json | `studio/tokens/tokens-brand-b.json` | `templates/assets/tokens/tokens-brand-b.json` |

> **참고**: 실제 파일 이동과 studio import 경로 변경은 향후 Phase에서 수행합니다.
> 이 Phase에서는 구조 설계와 디렉토리 생성만 합니다.

## studio 참조 방식 (향후)

### 방법 1: 심볼릭 링크

```bash
# studio 내부에서 templates/assets를 참조
ln -s ../../templates/assets/i18n studio/src/i18n
ln -s ../../templates/assets/tokens studio/tokens
```

### 방법 2: 빌드 스크립트 복사

```bash
# 빌드 전 복사
cp templates/assets/i18n/*.json studio/src/i18n/
cp templates/assets/tokens/*.json studio/tokens/
```

### 방법 3: Vite alias

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@assets': path.resolve(__dirname, '../templates/assets')
  }
}
```

> 최종 방식은 Phase 5(PoC 검증) 시 결정합니다.

## 새 앱 생성 시 사용법

1. `templates/REQUIREMENTS.md.template` → Blueprint 질의서로 채움 → `REQUIREMENTS.md`
2. `templates/assets/` → 앱 프로젝트에 복사 또는 참조
3. tokens.json → 디자인 도구(Paper 등)에서 추출한 값으로 교체
4. i18n JSON → 앱에 맞는 텍스트로 교체
