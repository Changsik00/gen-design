# Walkthrough: spec-09-04-external-alpha

## 실행 순서

### Task 1: 브랜치 생성

```bash
git checkout -b spec-09-04-external-alpha
```

`phase-09-gen-design-live` 에서 분기 완료.

---

### Task 2: handbook 통독 + 역할극 도그푸딩 세션

**통독**: `docs/handbook.md` 전체 (§1 ~ §8 + 부록) — "handbook 만 읽은 첫날 디자이너" 관점으로 통독.

**역할극 진행**:
1. §4 Day 1: Paper artboard 생성 단계 → `paper: artboard: null` 처리 (handbook 미명시)
2. §4 Day 2: 자연어 의도 → 3층 chat.md 작성 → frontmatter 형식 혼란 (§5 R5 충돌)
3. §4.5: catalog 확인 → StatCard `axes: []` vs 예시 variant 불일치 발견

**gen-design lint 검증**:

```bash
cd studio && pnpm exec tsx scripts/gen-design.ts lint --chat-root ../playground/chats --no-compile
# → All checks passed. (7 files)
```

**산출물**: `playground/chats/scenes/profile.chat.md` 작성 완료.

---

### Task 3: external-alpha-1.md 보고서 작성

`docs/external-alpha-1.md` 작성:
- 차단점 5건 (B-1 ~ B-5): §5 R5 frontmatter 불일치 / Paper 없이 시작 경로 미명시 / StatCard variant 불일치 / references 필드 미명시 / lint 실행 경로 불명확
- 매끄러운 부분 3건: 3층 구조 명확 / 살아있는 예시 링크 / catalog 조회 용이
- 보정 후보 4건 (C-1 ~ C-4): 임팩트 순 정렬

---

### Task 4: handbook 보정 적용

보정 C-1 (임팩트 최대) 적용 — `docs/handbook.md` §5 R5:

**Before**:
```
- frontmatter 미사용 (현재). 향후 도입 시 chat-md grammar 갱신 필수
```

**After**:
- "frontmatter 사용 중 (spec-08-01 이후)" 로 정정
- frontmatter 필드 정의 표 신규 추가 (9행: type / name / identity / created / shell / catalog / paper / applies / references)
- "Paper 없이 시작 가능" 안내 (B-2 도 동시 해소)

2개 차단점 (B-1 15분 + B-2 10분 = **25분 단축**) 을 단일 보정으로 해소.

---

### 테스트 결과

```bash
cd studio && pnpm test --run
# → 995 Tests passed (995)
```

코드 변경 없음 (Research spec) — 회귀 없음.

---

## 결론

외부 alpha 도그푸딩(역할극)을 통해 handbook 의 가장 큰 차단점인 "frontmatter 설명 부재"가 식별됐으며 즉시 보정. 다음 external-alpha iteration 에서 실제 외부 디자이너를 통한 재검증 권장.
