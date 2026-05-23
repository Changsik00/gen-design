# docs(spec-11-04): Dogfooding Alpha — zero → React TSX 실증 보고서

## Summary

phase-11 의 *모든 도구* (scaffold + 4 스킬 + doctor) 를 *실제로 사용* 해 zero → React TSX 까지 도달하는 dennis simulation. **2 HIGH issue 발견** + phase-12 후보 12건 도출.

## 실증 흐름

| 단계 | 결과 |
|---|---|
| **scaffold** | `npx create-gd-react dogfood-alpha --offline` — 0.055s / 53 파일 / 0 errors |
| **/gd-start** simulation | designer.md + project.md memory entry 채움 |
| **/gd-chat** simulation | `chats/scenes/login.chat.md` 3층 작성 (Card + Form + Input + Button) |
| **gd react** | `src/scenes/login.tsx` 생성 — 1.32s, exit 0 / ⚠️ Structure 본문 누락 |
| **gd doctor** | 6 errors / 4ms — 한국어 친절한 메시지 + 한계 안내 동작 확인 |

## 핵심 발견 (5 분류, 19 항목)

| 분류 | 건수 |
|---|---|
| 🔴 진짜 막힘 (외부 디자이너도 막힘) | 5 |
| 🟡 알고 있어서 우회 (외부 디자이너는 막힐 것) | 4 |
| ⚠️ 스킬 본문 부정확 / 모호 | 6 |
| 📝 handbook / FRONT.md / AGENT.md 누락 | 4 |

## phase-12 첫 두 spec 후보

> [!IMPORTANT]
> 🔴 **HIGH** — 외부 디자이너 alpha 전 *반드시* 수정:
> 1. **`gd react` Structure 본문 컴파일** — ` ```chat ` 코드 블록 처리 결함. 결과물 빈 화면.
> 2. **`@gd/cli` npm package 분리** — preset 의 `pnpm gd doctor` 미동작. scaffold 사용자가 도구 못 씀.

## Test plan

- [x] `pnpm --filter studio test --run` → **1055 passed** (회귀 0)
- [x] `pnpm --filter create-gd-react test --run` → **28 passed** (회귀 0)
- [x] 실 명령 흐름 (npx → gd react → gd doctor) — 모두 실행 + 발견 사항 기록

## 후속

- spec-12-01: `gd react` Structure 본문 컴파일 + `// @gd:` annotation 경로 수정
- spec-12-02: `@gd/cli` npm 분리 + scaffold preset 실 동작
- spec-12-03: 실 외부 디자이너 alpha 채용 / 인터뷰 (편향 해소)

## 산출물

- `experiments/dogfood-alpha/` — scaffold 결과 53 파일 git 추적 (미래 alpha 재현 가능)
- `experiments/dogfooding-alpha-2026-05.md` — 209 줄 정량 + 정성 보고서
