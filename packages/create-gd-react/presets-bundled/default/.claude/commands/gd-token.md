---
name: gd-token
description: TOKEN.md / tokens.json 작성 가이드. shadcn 표준 토큰 이름 잠금 + WCAG 2.1 AA 색 대비 즉시 검증 + light/dark 동기 + 결정 기록.
---

# gd-token — 디자인 토큰 작성 가이드

> 본 스킬은 *능동 도구* 입니다. 색을 받으면 *즉시 OKLCH 변환 + 대비 검증 + light/dark 동기 + tokens.json 갱신 + decisions.md append* 까지 자동 수행.

---

## §1 자동 로딩 컨텍스트

| 파일 | 역할 |
|---|---|
| `templates/TOKEN.md` | shadcn 표준 토큰 풀셋 + cva variant 매핑 |
| `templates/assets/tokens/tokens.json` | 현재 토큰 값 (DTCG, light + dark) |
| `src/styles/globals.css` | 빌드된 CSS vars + `@theme inline` 매핑 |
| `.gd/memory/project.md` | 브랜드 톤 (색 선택 기준) |
| `.gd/memory/decisions.md` | 과거 색 결정 history (왜 그 색이었는지) |

---

## §2 ⚠️ 가장 중요한 룰 — shadcn 표준 토큰 이름은 **잠금**

본 프로젝트는 shadcn 의 표준 토큰 이름을 그대로 사용합니다. **이름은 절대 변경하지 않습니다.**

### 잠긴 24개 토큰 이름 (값만 조정 가능)

```
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--chart-1 ~ --chart-5
--sidebar, --sidebar-foreground, --sidebar-primary, --sidebar-primary-foreground,
--sidebar-accent, --sidebar-accent-foreground, --sidebar-border, --sidebar-ring
```

### 디자이너가 *이름 변경* 요청 시 — 즉시 거부

```
사용자: "primary 를 brand 로 바꿔주세요"

당신: shadcn 표준 토큰 이름은 변경할 수 없습니다.
이유: cva variant (예: <Button variant="default">) 가 `bg-primary` 클래스를
사용하므로, 이름 변경 시 *모든 컴포넌트의 색이 깨집니다*.

대안:
- 값만 변경 (브랜드 색을 primary 의 OKLCH 값으로 설정)
- 새 색이 *추가* 필요하면 별도 chart-color 또는 custom 토큰 검토 (별도 협의)

primary 의 *값* 을 어떤 색으로 바꿀까요?
```

→ 새 토큰 *추가* 는 가능 (chart 시리즈 / 도메인 특화 색). 단 기존 24개 *이름* 은 잠금.

---

## §3 색 입력 받기 (다양한 형식 지원)

디자이너가 색을 알려주는 형식 → 자동 OKLCH 변환:

| 입력 | 처리 |
|---|---|
| `#4F46E5` (hex) | OKLCH 자동 변환 → `oklch(0.546 0.252 264.05)` |
| `rgb(79, 70, 229)` | OKLCH 변환 |
| `oklch(0.546 0.252 264.05)` | 그대로 사용 |
| `indigo-600` (Tailwind 이름) | Tailwind 4 의 OKLCH 값 사용 |
| "보라색 / 짙은 파랑 / 따뜻한 빨강" 같은 자연어 | 후보 3-5개 제시 후 선택 |

→ 항상 *OKLCH 로 저장* (shadcn 최신 표준 + 색공간 인지 일관성).

---

## §4 light + dark 동기 변경 유도

**한쪽 모드만 변경 시 즉시 경고**:

```
사용자: "primary 를 #4F46E5 로 바꿔주세요"

당신: 알겠습니다. light 모드 primary = oklch(0.546 0.252 264.05) 로 변경.

dark 모드 primary 도 함께 정의해야 합니다. 옵션:
A. 자동 보색 (대비 유지): oklch(0.745 0.165 264) 정도
B. 디자이너 직접 지정 (예: 더 밝은 보라 / 다른 색)
C. 같은 값 사용 (대비 검증 필요)

어떻게 갈까요?
```

→ light 만 수정하고 dark 안 만지면 *반드시 짚어줌*.

---

## §5 WCAG 2.1 AA 색 대비 즉시 검증

색 변경 시 *항상* 다음 페어를 자동 측정:

### 필수 검증 페어 (light 모드 + dark 모드 각각)

| 페어 | 최소 대비 | 의미 |
|---|---|---|
| `--foreground` on `--background` | 4.5:1 | 본문 텍스트 |
| `--primary-foreground` on `--primary` | 4.5:1 | Button default |
| `--destructive-foreground` on `--destructive` | 4.5:1 | Button destructive |
| `--secondary-foreground` on `--secondary` | 4.5:1 | Button secondary |
| `--accent-foreground` on `--accent` | 4.5:1 | Button ghost hover |
| `--card-foreground` on `--card` | 4.5:1 | Card 내부 |
| `--popover-foreground` on `--popover` | 4.5:1 | Popover 내부 |
| `--muted-foreground` on `--background` | 4.5:1 (또는 large text 시 3:1) | caption |

### 검증 출력 형식

```
✓ light primary (oklch 0.546 0.252 264) on primary-foreground (oklch 0.985 0 0):
   대비 7.2:1 — AA PASS ✓
✗ light muted-foreground (oklch 0.556 0 0) on background (oklch 1 0 0):
   대비 3.8:1 — AA FAIL (필요 4.5:1)
   ↳ 권장: muted-foreground 를 oklch 0.498 0 0 로 변경하면 4.6:1 — PASS
```

### 미달 시 — 가장 가까운 합격 OKLCH 제안

알고리즘:
- *Lightness (L)* 만 조정 (Hue / Chroma 유지) → 색 의도 보존
- foreground 가 background 보다 어두우면 L 감소, 밝으면 L 증가
- 대비 ≥ 4.5:1 만족하는 *최소 변경* 값 제안

→ 디자이너 confirm 후 *tokens.json 갱신*.

---

## §6 cva variant 영향 안내

토큰 변경 시 *어떤 cva variant 가 영향받는지* 명시:

```
primary 변경 시 영향:

- <Button variant="default"> — 배경 색 변경 ✓
- <Button variant="link"> — text-primary 색 변경 ✓
- <Button variant="outline"> — focus-visible ring 영향
- chart 와 무관 (chart-* 는 별도 토큰)
- sidebar 와 무관 (sidebar-primary 는 별도)

primary-foreground 도 함께 검토하시겠어요?
```

---

## §7 tokens.json 갱신 패턴

색 결정되면 *tokens.json 의 해당 entry 갱신*:

```json
"primary": {
  "$type": "color",
  "$value": {
    "light": "oklch(0.546 0.252 264.05)",  // ← 변경
    "dark":  "oklch(0.745 0.165 264)"      // ← 동기 변경
  },
  "$description": "브랜드 메인 — Button default 배경"
}
```

→ globals.css 의 `:root {...}` + `.dark {...}` 도 *함께* 갱신.
→ (후속 spec) `pnpm gd build-tokens` 가 tokens.json → globals.css 자동 변환.

---

## §8 결정 기록 (memory/decisions.md append)

토큰 결정 시 *반드시* `.gd/memory/decisions.md` 에 append:

```markdown
## YYYY-MM-DD primary 색 결정

- **결정**: primary = oklch(0.546 0.252 264.05) (#4F46E5 / indigo-600)
- **이유**: 디자이너 브랜드 가이드 (project.md 의 "신뢰감 + 직진" 톤)
- **영향**: <Button variant="default"> / link / focus-visible ring
- **대비**: primary-foreground (white) 위 7.2:1 ✓ AA PASS
- **출처 스킬**: gd-token
```

→ 이후 *왜 이 색이었는지* 회상 가능.

---

## §9 Tailwind 스케일 외 spacing / typography 변경 요청 거부

색 외 토큰 변경 시도:

```
사용자: "spacing-large 를 추가해주세요"

당신: spacing 은 별도 토큰화하지 않습니다.
이유: Tailwind 의 표준 스케일 (p-1 / p-2 / p-4 / p-6 / p-8) 을 그대로 사용.
임의 spacing 추가 시 디자이너 / agent 의 *어휘 통일* 이 깨집니다.

대안:
- 기존 Tailwind 클래스로 충분한지 확인 (보통 충분)
- 정말 새 spacing 이 필요하면 Tailwind config 확장 검토 (별도 협의)
```

→ font-size, radius 도 동일 — Tailwind 표준 사용.

---

## §10 사용자 친화 검증 출력

복잡한 색 변경 후 *한 화면에* 요약:

```
✓ primary 색 변경 완료

  값 변경:
    - light: oklch(0.205 0 0) → oklch(0.546 0.252 264.05)
    - dark:  oklch(0.922 0 0) → oklch(0.745 0.165 264)

  대비 검증 (모두 PASS):
    ✓ light primary-foreground on primary: 7.2:1
    ✓ dark primary-foreground on primary: 5.4:1

  영향 받는 cva variant:
    - <Button variant="default">
    - <Button variant="link">

  기록:
    ✓ tokens.json 갱신
    ✓ globals.css 갱신
    ✓ decisions.md append

다음으로 진행하시려는 색이 있나요?
또는 /gd-design / /gd-chat 으로 넘어가시겠어요?
```

---

## §11 안티 패턴 (스킬 본인 행동)

- ❌ shadcn 표준 토큰 *이름 변경* 허용 — 절대 거부
- ❌ light 만 / dark 만 단방향 변경 — 항상 둘 함께
- ❌ 대비 검증 *생략* — 모든 색 변경 후 즉시 측정
- ❌ hex / rgb 그대로 저장 — 항상 OKLCH
- ❌ 미달 시 *침묵* — 가장 가까운 합격 OKLCH 제안
- ❌ Tailwind 스케일 외 spacing / radius / font 추가 허용 — 거부
- ❌ 결정 기록 (decisions.md) 생략 — 항상 append
- ❌ cva variant 영향 안내 생략 — 디자이너가 *무엇이 바뀌는지* 알아야 함

---

## §12 종료 조건

- [ ] tokens.json 의 변경 entry 갱신 (light + dark 모두)
- [ ] globals.css 의 `:root` + `.dark` 동기 갱신
- [ ] 대비 검증 PASS 또는 미달 시 대안 적용
- [ ] decisions.md 에 결정 append
- [ ] 영향 받는 cva variant 사용자에게 안내

→ 디자이너가 *시각 확인* 원하면 `pnpm dev` 안내. 토큰 변경 후 즉시 모든 컴포넌트에 반영.
