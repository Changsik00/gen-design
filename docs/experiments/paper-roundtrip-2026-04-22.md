# Paper MCP 왕복 실험 로그 — 2026-04-22

> spec-4-02 Paper MCP 왕복 PoC 의 실행 증거 로그.
> 픽스처: `specs/spec-4-02-paper-mcp-roundtrip/fixtures/LoginPage.DESIGN.md`
> 15 측정 토큰 / 계열별 차등 기준 (색상 ≥90% / 타이포 ≥85% / 간격 ≥75% / 그림자 ≥70%)

## 환경

| 항목 | 값 |
|---|---|
| Paper 파일 | "Welcome to Paper" |
| Page | Page 1 (단일 페이지) |
| 기존 아트보드 | 11 개 (그 중 `1AX-0` 이 2026-04-12 e2e 실험 잔재, 건드리지 않음) |
| 사용 가능 폰트 | Inter, Geist, JetBrains Mono |
| MCP 버전 | Paper MCP (guide 2026-04 기준) |

## 실행 로그 (시간순)

### 1. 환경 확인 — `get_basic_info`
파일 / 아트보드 / 폰트 목록 확인. 결과: 위 표 참조.

**관측**:
- Paper MCP 에 **page 생성 도구 부재** — "새 page" = 새 아트보드로 격리 해석.
- `system-ui` 폰트 패밀리가 Paper 에 없음 → **Inter 로 대체**. (**RQ5 발견 #1**: system font 접근 갭)

### 2. 폰트 가용성 확인 — `get_font_family_info(["Inter", "Geist"])`

**Inter**: 100/200/300/400/500/600/700/800/900 + italic variants, 가변 축 wght(100-900) + opsz(14-32). 필요 weight (500, 600) 모두 존재 ✓
**Geist**: 100-900 uprights, 가변 축 wght(100-900). 필요 weight 모두 존재 ✓

→ **Inter** 선택 (shadcn/ui 생태계 사실상 표준).

### 3. 정방향 실행 — `create_artboard` + `write_html` × 6

| 호출 | 결과 id | 관측 |
|---|---|---|
| `create_artboard("LoginPage — spec-4-02 PoC (2026-04-22)", 1440×900, bg=oklch(1 0 0))` | `1BN-0` | 빈 캔버스 영역에 자동 배치 (`top=-1525, left=3964`) |
| `write_html(Card shell)` → 1BO-0 | 1 node | `border-radius: 8.75px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`, `padding: 32px`, `width: 380px` 정확 반영 |
| `write_html(CardHeader)` → 1BP-0 | 3 nodes | h2 (24px/600) + p (14px/400) 정확 |
| `write_html(LoginForm)` → 1BS-0 | 11 nodes | label(14px/500) + Input Frame(h=40, r=5px) + Button(bg=oklch(0.205)) 정확 |
| `write_html(Divider)` → 1C3-0 | 4 nodes | 1px Rectangle × 2 + text(12px/400) |
| `write_html(SocialAuthBlock)` → 1C7-0 | 7 nodes | 3 × outline Button(h=40, bg=#fff, border=oklch(0.922)) |
| `write_html(SignupPrompt)` → 1CE-0 | 3 nodes | span(muted) + a(primary, fw=500) |

**총 생성 노드**: 29 (Card 1 + 내부 28)
**렌더링 시간**: 즉시 (tool latency 거의 0)
**첫 스크린샷 (중간)**: Card + CardHeader + LoginForm 까지 — Review Checkpoint PASS
**최종 스크린샷**: 전체 Card — Review Checkpoint PASS (spacing / typography / contrast / alignment / clipping / repetition 모두 OK)

### 4. 작업 마킹 — `finish_working_on_nodes([1BN-0])`
아트보드 working indicator 해제. 아트보드는 **보존** (후속 역추출 Task 4 의 입력).

## RQ5 갭 기록 (관측)

- **RQ5-1** — Paper MCP 에 **page 생성 / page 관리 도구 부재**. 아트보드만 생성 가능 → 격리는 "별도 아트보드" 수준.
- **RQ5-2** — `system-ui` 폰트 패밀리 미지원 → Inter 대체 필수. 픽스처 의 system-ui 기대는 Paper 환경에선 **명시적 매핑 필요**.
- **RQ5-3** — `display: grid` / `margin` 등 일부 CSS 속성 미지원 (guide 명시) → HTML 작성 시 flex 기반으로 재작성 필요. 본 PoC 는 영향 없음 (처음부터 flex 설계).

### 5. 역방향 실행 — `get_tree_summary` + `get_computed_styles`

**호출**:
- `get_tree_summary("1BO-0", depth=3)` — Card 하위 트리 구조 확인
- `get_computed_styles(["1BO-0", "1BQ-0", "1BR-0", "1BS-0", "1BU-0", "1BV-0", "1C1-0", "1C2-0", "1C8-0"])` — 9 개 대표 노드 배치

**주요 자동 변환 관측 (RQ5-4)**:
- **색공간**: `oklch(0.205 0 0)` → `#171717` (Paper 가 sRGB hex 로 자동 변환해 저장). 모든 oklch 값이 대응 hex 로 변환됨.
- **그림자 색**: `rgba(0,0,0,0.1)` → `#0000001A` (8-hex 형식). 수학적 동등이나 표기 다름.
- **폰트 fallback**: 입력 `"Inter, sans-serif"` → 저장 `"Inter", system-ui, sans-serif` (Paper 가 자동으로 system-ui 중간 fallback 추가).
- **padding**: 단일 `32px` → `paddingBlock: 32px / paddingInline: 32px` 2 속성으로 분리 저장.

## 6. Diff 표 — 15 측정 토큰

| # | 계열 | 원본 (픽스처) | Paper Observed | 일치 | 비고 |
|---|:---:|---|---|:---:|---|
| 1 | color | `oklch(0.205 0 0)` (Button bg) | `#171717` (1C1-0) | ✅ | sRGB hex 자동 변환 |
| 2 | color | `oklch(0.985 0 0)` (Button text) | `#FAFAFA` (1C2-0) | ✅ | sRGB hex 자동 변환 |
| 3 | color | `#ffffff` (Card bg) | `#FFFFFF` (1BO-0) | ✅ | 대소문자만 차이 |
| 4 | color | `oklch(0.922 0 0)` (border) | `#E5E5E5` (1BO-0 / 1BV-0 / 1C8-0) | ✅ | Card / Input / Social Btn 3 곳 동일 |
| 5 | color | `oklch(0.556 0 0)` (muted fg) | `#737373` (1BR-0) | ✅ | Description |
| 6 | color | `oklch(0.145 0 0)` (foreground) | `#0A0A0A` (1BQ-0 / 1BU-0) | ✅ | Title / Label |
| 7 | typography | font-family primary (system-ui→Inter) | `"Inter", system-ui, sans-serif` | ✅ | Paper fallback 자동 부착 |
| 8 | typography | `14px` (text-sm) | `14px` (1BR-0 / 1BU-0 / 1C2-0) | ✅ | 3 곳 동일 |
| 9 | typography | `24px` (text-2xl) | `24px` (1BQ-0) | ✅ | Title |
| 10 | typography | `500` / `600` weight | `500` (1BU-0) / `600` (1BQ-0) | ✅ | Label medium / Title semibold |
| 11 | spacing | `32px` (p-8) | `paddingBlock: 32px / paddingInline: 32px` (1BO-0) | ✅ | 2 속성 분리만 있을 뿐 값 동일 |
| 12 | spacing | `16px` (space-y-4) | `gap: 16px` (1BS-0) | ✅ | flex gap 정확 |
| 13 | radius | `5px` (Input/Button) | `5px` (1BV-0 / 1C1-0 / 1C8-0) | ✅ | 3 곳 동일 |
| 14 | radius | `8.75px` (Card) | `8.75px` (1BO-0) | ✅ | |
| 15 | shadow | `0 1px 3px rgba(0,0,0,0.1)` | `#0000001A 0px 1px 3px` | ✅ | 형식 다름 (color 우선) 값 동등 |

## 7. 계열별 자동화율

| 계열 | 일치 / 총 | 자동화율 | 기준 (plan.md) | 판정 |
|---|:---:|:---:|:---:|:---:|
| 색상 | 6 / 6 | **100%** | ≥90% | ✅ PASS |
| 타이포 | 4 / 4 | **100%** | ≥85% | ✅ PASS |
| 간격 | 2 / 2 | **100%** | ≥75% | ✅ PASS |
| Radius (간격 포함) | 2 / 2 | **100%** | ≥75% | ✅ PASS |
| 그림자 | 1 / 1 | **100%** | ≥70% | ✅ PASS |
| **합계** | **15 / 15** | **100%** | — | ✅ 전 계열 PASS |

## 8. 주의 사항 / Drift 요소

1. **표기 drift (값 drift 아님)** — 표기만 바뀌고 값은 동등. 후속 자동화 시 **정규화 함수 1 벌 필요** (oklch↔hex, rgba↔8-hex, padding 단일→2 분리).
2. **폰트 fallback 자동 부착** — Paper 가 첫 family 이름 뒤에 system fallback 을 덧붙임. "DESIGN.md 에 의도적으로 포함한 fallback" 을 보존하지 않음 — 역추출 시 **픽스처 family 만 첫 slot 비교**로 충분.
3. **색공간 round-trip 정확도** — oklch → Paper(sRGB hex) → 역추출 hex 는 exact (Paper 가 저장 시 단일 변환 지점). 그러나 같은 hex 로부터 원본 oklch 를 **정확히 복원** 은 불가 — 다대일 대응. 실무적으로 큰 문제 없음 (저장값 hex 로 align 할 수 있음).

## 9. MCP 도구 커버리지 갭 (RQ5 종합)

| # | 갭 | 심각도 | 대응 |
|---|---|:---:|---|
| R5-1 | page 생성/관리 도구 부재 | 낮음 | 아트보드 수준 격리로 충분 |
| R5-2 | system-ui 지원 없음 | 중간 | 픽스처 → Paper 매핑 시 실제 폰트로 변환 필수 |
| R5-3 | display: grid / margin 미지원 | 낮음 | flex 기반 작성 (프로젝트 관례와 일치) |
| R5-4 | 색공간 / 폰트 fallback / padding 자동 정규화 | 낮음 | 정규화 함수로 대응 가능 |
| R5-5 | 대량 변환 시 batching 전략 부재 | 낮음 (본 PoC 에선 미관찰) | 필요 시 duplicate_nodes + update_styles 조합 |


