# spec-7-03: spec.md → Paper compiler

phase-7 의 두 번째 spec — 디자이너의 *메인 루프* 첫 단계 (spec.md → 시각화).

## Summary

- **`compileToPaper()`** 공용 API — spec.md AST → React SSR → HTML/CSS payload (Studio iframe + Paper write_html 양쪽)
- **Studio Preview Panel** (`#/preview`) — fixture 선택 → 좌(React 실 컴포넌트) 우(Paper-compiled iframe) split + Copy/Send 버튼
- **CLI `spec-paper`** — `pnpm --filter studio spec-paper <file> [--payload] [--output]`
- **28 fixture 회귀** — 모두 컴파일 PASS + 결정성 + DOM 등가 스냅샷 3
- **Paper MCP 실 송신 1 회 검증** — 회고 phase-6 C1 의 *구조 round-trip* 확인 (시각 fidelity 갭은 phase-8 로 명문화)
- **paper-sync / paper-normalizer / paper-e2e 재사용** — 회고 C2 (lib import) 강화

## 결정 기록

### React SSR 채택 (vs hand-coded HTML)

studio 의 28 React 컴포넌트가 *진실 원천*. `ReactDOMServer.renderToStaticMarkup` 으로 같은 컴포넌트를 HTML 출력. spec-7-04 (React compiler) 도 동일 레지스트리 사용 가능 → DRY.

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

## 후속

- **spec-7-04**: React compiler — 동일 컴포넌트 레지스트리 활용, JSX (registry-item.json) emit
- **phase-8**: Tailwind 정밀 컴파일 (회고 C1 의 시각 fidelity 갭 해소)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
