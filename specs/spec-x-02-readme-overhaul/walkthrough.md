# spec-x-02 Walkthrough

## 개요

spec-x-01 의 README 가 핵심 가치를 못 전달한다는 사용자 피드백 ("허접함") 에 따라 두 README 전면 개편.

## 변경 요약

### 루트 `README.md`

| 이전 | 이후 |
|---|---|
| 30s 시작 + 워크플로 + 스킬/CLI 테이블 | + 사용 예시 (5단계 대화) |
| 컴포넌트 / 토큰 구조 안내 부재 | **컴포넌트 3티어** (ARIA → shadcn/ui → Project) |
| 동기/배경 분리만 강조 | **토큰 3티어** (Primitive → Semantic → Component) |
| 평탄한 텍스트 | 다이어그램 + 코드 예시 + AI 대화 시뮬레이션 |

핵심 메시지: *"AI 가 비슷한 패턴을 먼저 제안한다 — 재사용 / 확장만 결정하면 일관성 자동 유지"*.

### `packages/gd-skills/README.md` (`@gen-design/skills@0.1.2`)

- npm 페이지에 표시되는 패키지 README. 동일 톤으로 사용 예시 + 스킬 4종 표.
- republish: `0.1.1` → `0.1.2`.

## 커밋 목록

1. `docs(spec-x-02): overhaul READMEs with 3-tier architecture and usage examples`
2. `docs(spec-x-02): ship walkthrough and pr description`
