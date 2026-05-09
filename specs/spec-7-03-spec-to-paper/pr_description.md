# spec-7-03: spec.md → Paper compiler

phase-7 의 두 번째 spec — 디자이너의 *메인 루프* 첫 단계 (spec.md → 시각화).

## Summary

- **`compileToPaper()`** 공용 API — spec.md AST → React 정적 markup (`renderToStaticMarkup`) → HTML/CSS payload (Studio iframe + Paper write_html 양쪽). hydration-friendly SSR 이 아닌 *디자인 도구 export* 용 정적 export — 28 컴포넌트 모두 순수 presentational 이라 적합.
- **Studio Preview Panel** (`#/preview`) — fixture 선택 → 좌(React 실 컴포넌트) 우(Paper-compiled iframe) split + Copy/Send 버튼
- **CLI `spec-paper`** — `pnpm --filter studio spec-paper <file> [--payload] [--output]`
- **28 fixture 회귀** — 모두 컴파일 PASS + 결정성 + DOM 등가 스냅샷 3
- **Paper MCP 실 송신 1 회 검증** — 회고 phase-6 C1 의 *구조 round-trip* 확인 (시각 fidelity 갭은 phase-8 로 명문화)
- **paper-sync / paper-normalizer / paper-e2e 재사용** — 회고 C2 (lib import) 강화

## 결정 기록

### React 정적 markup export 채택 (vs hand-coded HTML)

studio 의 28 React 컴포넌트가 *진실 원천*. `react-dom/server` 의 **`renderToStaticMarkup`** (NOT `renderToString`) 으로 hydration 메타 없는 정적 HTML 만 emit. spec-7-04 (React compiler) 도 동일 레지스트리 사용 가능 → DRY.

**API 검증**: `renderToString` 의 pitfall (Suspense / streaming 미지원) 은 `renderToStaticMarkup` 에도 동일 적용되지만 — 28 컴포넌트 모두 순수 presentational (0 useState/useEffect/Suspense/async) 이라 영향 없음. React 공식 docs 도 *디자인 도구 export* 같은 정적 use case 에는 본 API 를 권장. 향후 async 컴포넌트 도입 시 `renderToReadableStream` 마이그레이션.

### Tailwind play CDN (vs PostCSS)

phase-7 MVP 는 *눈으로 확인 가능* 우선. Studio iframe 안에서 play CDN JIT 가 정상 작동.

발견 갭: Paper 자체는 Tailwind 미실행 → 시각 fidelity 는 phase-8 의 PostCSS 정밀 컴파일에서 해결.

### 4 layer 어휘 분리 (ADR-005 D-2 IR 매핑)

```typescript
buildReactTree:
  ComponentInstance → React.createElement(Comp, {...defaults, ...resolvedProps}, children)
  L3 theme="brand-a"  → wrapping <div data-theme="brand-a">
  L4 tokens={...}     → wrapping <div style={{...normalizedCssVars}}>
  Placeholder kind=i18n → resolved string (누락 시 빨간 background span)
  Placeholder kind=token → "var(--name)" (last-segment)
```

### default-props 자동 주입

spec.md 는 *시각 구조* 만 — texts/data 같은 복잡한 prop 은 명시 X. 컴파일 시 28 컴포넌트의 `default-props.ts` mock data 가 spec props 와 merge.

## 회고 C1 부분 해소

phase-6 회고 C1 ("Paper ↔ React 정합 미검증") 의 절차적 검증:
1. `compileToPaper(spec/login-page.spec.md)` payload 7.4KB
2. paper.create_artboard + write_html + get_screenshot
3. Studio dev server #/preview 의 React + iframe 비교

**결과**:
- ✅ 구조 round-trip — form / input / button / 한국어 i18n 모두 정상 노드 생성
- ⚠️ 시각 fidelity — Paper 의 Tailwind 미해석 → phase-8 명문화

C1 의 *완전* 해소는 phase-8 (Tailwind 정밀 컴파일) 후 가능. 그러나 spec-7-04 (React compiler) 진입에는 충분.

## 산출물

```
studio/src/lib/spec-md-compiler/
├── paper/        compile / react-builder / resolvers / page-wrapper / default-props / registry
└── cli/          spec-paper

studio/src/i18n/ko.json
studio/src/features/preview/        Studio Preview Panel (#/preview)
studio/scripts/generate-fixtures-index.ts
```

## 테스트 (45 case 신규)

| 영역 | case |
|---|---|
| component-registry + i18n bundle 1:1 | 5 |
| i18n + token resolvers | 13 |
| react-builder | 8 |
| compile (string / file / parse 실패) | 7 |
| 28 fixture 회귀 + 결정성 + 3 snapshot | 5 |
| CLI spec-paper (parseArgs + runCompile) | 8 |
| Preview panel | 4 |

**누적**: 432 → 477 (+45 신규).

## Test plan

- [x] `pnpm --filter studio test` — 72 files / 477 tests PASS
- [x] `pnpm --filter studio run build` — TypeScript + Vite 통과 (peggy 의 eval 경고는 inherited)
- [x] `pnpm --filter studio spec-paper /Users/.../spec/login-page.spec.md --output /tmp/x.html` — 7.6KB
- [x] Studio dev server `http://localhost:5174/#/preview` — fixture 선택 + 좌/우 비교
- [x] Paper MCP write_html 실 송신 — 1440×900 artboard 에 LoginPage 노드 생성 확인

## 📌 머지 직전 추가: ADR-006 (방향 pivot)

리뷰 시점에 사용자가 *근본적 방향 미스매치* 지적 — 디자이너 워크플로는 Paper → spec.md → React 인데 phase-7 가 spec.md → Paper / React 흐름으로 구축됨.

→ **ADR-006 (Paper-first workflow)** 본 PR 에 포함:
- spec-7-03 의 *의미* reframe (primary → round-trip 검증, 코드 변경 0)
- 다음 spec = Paper → spec.md inference (긴급)
- phase-7.md 우선순위 재정렬

자산은 모두 살아남음. spec-7-03 은 양방향 round-trip 의 *역방향 (spec.md → Paper)* 측면으로서 여전히 유용.

## 후속 (ADR-006 이후)

- **즉시 다음 spec**: Paper → spec.md inference (디자이너 워크플로 foundation)
- **연기**: spec.md → React compiler (IR 가 정해지고 Paper inference 검증 후)
- **phase-8**: Tailwind 정밀 컴파일 (회고 C1 의 시각 fidelity 갭 해소)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
