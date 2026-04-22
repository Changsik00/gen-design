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

