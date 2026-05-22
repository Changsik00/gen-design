# spec-11-07: Fix v2 dogfooding findings + v3 재검증

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-11-07` |
| **Phase** | `phase-11` |
| **Branch** | `spec-11-07-fix-v2-findings` |
| **상태** | Planning |
| **타입** | Fix (hotfix + iteration) |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-23 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

spec-11-06 (v2 미경 dogfooding) 에서 **신규 발견 8건**. 사용자 결정: *converge 까지* phase-11 PR (#68) 안에서 반복 fix.

본 spec 의 scope:
- v2 의 *작은 fix* (HIGH 2 + MID 5) 적용
- v3 dogfooding 재실행 (별도 페르소나로 — 도훈 백엔드 개발자 또는 미경 재방문)
- v3 새 발견 *기록* — *명확한 PASS 조건* 충족 시 PR 머지, 아니면 spec-11-08

## 🎯 요구사항

### Functional Requirements — 7 fix

**🔴 HIGH 2**:

1. **Fix #v2-1 — doctor token-ref false positive**:
   - `extractChatMdTokenClasses` 가 `text-xs` / `text-lg` / `text-sm` 의 *typography modifier* 를 *토큰* 으로 잘못 추출
   - Tailwind 의 *size scale* (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`) 는 추출 제외
   - 다른 *size modifier* (`hidden`, `block`, `flex`, `inline-flex` 등) 도 색 토큰이 아닌 *레이아웃* 으로 제외

2. **Fix #v2-2 — shadcn Tier 2 catalog 등재**:
   - `studio/src/lib/vocabulary/catalog/catalog.json` 의 Tier 2 / shadcn 컴포넌트에 *Card / CardHeader / CardTitle / CardDescription / CardContent / CardFooter / Form / Field / Separator* 수동 등재
   - 또는 doctor 가 *shadcn 표준 컴포넌트 화이트리스트* 도 함께 검증 (코드 변경)

**🟠 MID 5** (모두 *작은 변경*):

3. **Fix #v2-3 — doctor 다중 진단 우선순위 + 그룹화**: top 3 critical 먼저 출력 + 나머지 collapse (`--verbose` 시 전체)
4. **Fix #v2-4 — gd-start §7 "A/B/C" 안내 표현**: "처음이면 *바로 화면부터 만들기* (/gd-chat)" 강한 추천 + 시각 결과 우선
5. **Fix #v2-5 — i18n placeholder 안내 명확화**: 스킬 본문에 "다국어 텍스트 자리 (나중에 실제 글자로 바뀜)" 명시
6. **Fix #v2-6 — Tailwind 유틸리티 *surface 외* 안내**: gd-chat §7 에 "Tailwind 클래스는 *자동 처리* — 디자이너가 만지지 않음" 명시
7. **Fix #v2-7 — 메타용어 안내**: gd-chat §4 의 frontmatter 표 위에 "이건 *자동 생성* — 미경님은 안 만지셔도 OK"

### Integration — v3 재dogfooding

- `experiments/dogfood-alpha-v3/` 신규 (도훈 또는 미경 재방문)
- 동일한 *대시보드* 또는 *다른 신* (설정 / empty state)
- 새 발견 *기록* — 보고서 §3 에 명시

### 종료 조건 (converge)

- HIGH 발견 *0건*
- MID 발견 *≤ 2건*
- 미경/도훈 입장에서 *멈춤 없음*

위 조건 미충족 시 → spec-11-08 로 사이클 계속.

## 🚫 Out of Scope

- `@gd/cli` npm 분리 — phase-12 (큰 인프라)
- `pnpm dev` 시각 확인 자동화 — phase-12 (Playwright 통합)
- 외부 디자이너 alpha 채용 — phase-12

## ✅ Definition of Done

- [ ] Fix #v2-1 ~ #v2-7 적용 (7 fix)
- [ ] 단위 테스트 — token-ref FP 검증 / catalog 등재 확인
- [ ] v3 재dogfooding — 새 발견 기록
- [ ] 보고서 작성: `experiments/dogfooding-alpha-v3-2026-05.md`
- [ ] 종료 조건 평가:
  - PASS → PR 생성 → phase-11 머지 가능
  - FAIL → spec-11-08 안내 (다음 사이클)
- [ ] 회귀: studio 1059 / create-gd-react 28 PASS
- [ ] walkthrough.md + pr_description.md
