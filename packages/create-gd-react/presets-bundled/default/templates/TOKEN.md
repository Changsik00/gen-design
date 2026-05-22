# {{project-name}} — TOKEN.md

> DTCG 1.0 strict 호환 형식입니다. 본 파일은 *디자이너 surface* — 편집 환영.
> 실제 값은 `templates/assets/tokens/tokens.json` 에 저장. 본 문서는 *의미 설명*.
> Claude Code 에서 `/gd-token` 호출하면 작성을 가이드받습니다.

## 색상 (Colors)

| 토큰 | 의미 | 용도 |
|---|---|---|
| `primary` | 브랜드 메인 컬러 | 주요 CTA, active state, 강조 |
| `background` | 페이지 배경 | body 기본 |
| `foreground` | 텍스트 기본 | body 텍스트 |
| `muted` | 보조 배경 | secondary 영역, 비활성 상태 |
| `muted-foreground` | 보조 텍스트 | caption, 보조 정보 |
| `border` | 경계선 | Card 외곽, Input 외곽 |
| `destructive` | 위험 컬러 | 삭제 / 에러 |
| `destructive-foreground` | 위험 텍스트 | destructive bg 위 텍스트 |

> 색상 대비비 (WCAG 2.1 AA) 는 `pnpm gd doctor` 가 자동 측정합니다.

## 간격 (Spacing)

| 토큰 | 픽셀 |
|---|---|
| `space-xs` | 4 |
| `space-sm` | 8 |
| `space-md` | 16 |
| `space-lg` | 24 |
| `space-xl` | 32 |
| `space-2xl` | 48 |

## 타이포그래피 (Typography)

| 토큰 | 크기 / 무게 | 용도 |
|---|---|---|
| `text-xs` | 12px / 400 | caption |
| `text-sm` | 14px / 400 | body |
| `text-base` | 16px / 400 | body 강조 |
| `text-lg` | 18px / 600 | subtitle |
| `text-xl` | 20px / 700 | section title |
| `text-2xl` | 24px / 700 | page title |

## 그림자 (Elevation)

| 토큰 | 의미 |
|---|---|
| `shadow-sm` | 미세한 떠있는 느낌 (Card 기본) |
| `shadow-md` | 명확히 떠있음 (Modal, Popover) |
| `shadow-lg` | 강한 떠있음 (Drawer) |

## 모서리 (Radius)

| 토큰 | 픽셀 |
|---|---|
| `radius-sm` | 4 |
| `radius-md` | 8 |
| `radius-lg` | 16 |

## DTCG JSON 위치

실제 값: `templates/assets/tokens/tokens.json` — Style Dictionary 호환.
빌드: `pnpm gd build-tokens` (CSS vars 자동 생성 → `src/styles/globals.css`)
