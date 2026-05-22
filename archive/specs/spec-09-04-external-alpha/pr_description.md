# spec-09-04: external-alpha — handbook 도그푸딩 + 보정

## 요약

- agent 가 "첫날 디자이너" 역할극으로 handbook §4 워크플로 도그푸딩 수행
- 차단점 5건 식별 → `docs/external-alpha-1.md` 보고서 작성
- 임팩트 최대 차단점(frontmatter 설명 부재) → `docs/handbook.md` §5 R5 즉시 보정
- 세션 산출물: `playground/chats/scenes/profile.chat.md` 신규 작성

## 변경 파일

| 파일 | 변경 | 설명 |
|---|---|---|
| `playground/chats/scenes/profile.chat.md` | NEW | 도그푸딩 산출물 — ProfileScene chat.md |
| `docs/external-alpha-1.md` | NEW | alpha 보고서 (차단점 5건 / 매끄러운 부분 3건 / 보정 후보 4건) |
| `docs/handbook.md` | MODIFY | §5 R5 frontmatter 설명 보정 + 필드 정의 표 추가 |

## 주요 차단점 (보고서 요약)

| # | 차단점 | 심각도 | 예상 소요 |
|---|---|---|---|
| B-1 | §5 R5 "frontmatter 미사용" vs §4 예시/실제 파일 충돌 | 🔴 HIGH | 15분 |
| B-2 | Paper 없이 시작 경로 미명시 | 🟡 MEDIUM | 10분 |
| B-3 | StatCard variant catalog 불일치 | 🟡 MEDIUM | 10분 |
| B-4 | references frontmatter 필드 미명시 | 🟡 MEDIUM | 5분 |
| B-5 | gen-design lint 실행 경로 불명확 | 🟠 LOW | 5분 |

## handbook 보정 내용

`docs/handbook.md` §5 R5 에 frontmatter 필드 정의 표 추가:

- `type` / `name` / `identity` / `created` / `shell` / `catalog` / `paper` / `applies` / `references` 필드 정의
- "Paper 없이 시작 가능 (`paper: artboard: null`)" 안내 추가
- "frontmatter 미사용 (현재)" 오표현 제거

## 검증

```bash
cd studio && pnpm test --run  # 995 PASS
cd studio && pnpm exec tsx scripts/gen-design.ts lint --chat-root ../playground/chats --no-compile  # 7 files PASS
```

## 방법론 주의

본 alpha 세션은 **실제 외부 디자이너 없음 — agent 역할극** 방식으로 수행됨. 보고서 §1 에 명시. 다음 iteration 에서 실제 외부인 피드백 권장.

## 후속 작업 (Out of scope — 별도 spec 권장)

- C-3: StatCard variant 구현 + catalog 갱신 spec
- C-4: `pnpm gen-design` alias workspace root 동작 확인
