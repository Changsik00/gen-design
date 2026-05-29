# docs(spec-13-02): gd-start 재작성 — 기존 자산 intake 경로 추가

## 📋 Summary

### 배경 및 목적

기존 `gd-start`는 빈 슬레이트만 가정했다. 실제 사용자는 기획 문서, 기존 DESIGN.md, TOKEN.md/CSS 변수 등 다양한 형태의 자산을 가져온다. 이 자산들을 처리하는 경로가 없어 사용자가 처음부터 다시 채워야 하는 마찰이 있었다.

본 spec에서 `gd-start`에 자산 감지 + 4가지 intake 경로를 추가하여 어떤 형태로 진입해도 우리 포맷(DESIGN.md + TOKEN.md + chat.md v2 준비)으로 수렴하게 한다.

### 주요 변경 사항

- [x] **§3 자산 감지 (신규)**: AskUserQuestion으로 4가지 타입 선택 + 파일 자동 감지
- [x] **§4-B 기획 문서 intake (신규)**: LLM이 화면 목록 + 핵심 데이터 추출 → project.md 기록
- [x] **§4-C DESIGN.md intake (신규)**: 4가지 포맷(우리/Stitch/자체/모름) 경로별 처리
- [x] **§4-D TOKEN.md intake (신규)**: shadcn 24개 매핑 + WCAG 대비 간이 검증
- [x] **§7 토큰-variant 규칙 안내 (신규)**: 모든 경로 완료 후 "색=토큰클래스, variant=shadcn표준" 명시

### Phase 컨텍스트

- **Phase**: `phase-13`
- **본 SPEC의 역할**: 어떤 진입 형태든 흡수하는 intake gate. spec-13-03 (gd-chat v2)이 이 결과물 위에서 동작한다.

## 🎯 Key Review Points

1. **§4-B 기획 문서 추출 결과 형식** — "화면 목록 + 핵심 데이터 + 타깃" 추출 후 사용자 확인 필수. 추측으로 바로 기록 금지.

2. **§4-C DESIGN.md 포맷 4가지 경로** — 자동 감지 대신 사용자 선택으로 설계한 이유: LLM 오판 방지. Stitch 포맷은 자동 매핑 가능.

3. **§7 토큰-variant 규칙** — gd-start 완료 시 한 번만 안내. 이후 모든 스킬이 이 규칙을 전제로 동작.

## 🧪 Verification

docs-only spec — 단위 테스트 해당 없음.

### 수동 검증 시나리오

1. **빈 슬레이트 선택** → §5 디자이너 정보 수집으로 진입 ✓
2. **TOKEN.md 있음 선택** → §4-D shadcn 매핑 안내 진입 ✓
3. **DESIGN.md 있음 선택** → §4-C 포맷 확인 후 누락 섹션 채우기 ✓
4. **기획 문서 있음 선택** → §4-B 화면 목록 추출 ✓

## 📦 Files Changed

### 🛠 Modified Files

- `packages/gd-skills/skills/gd-start.md` (+271, -111): 자산 감지 + 4가지 intake 경로 추가. 기존 온보딩 흐름(§5~§10) 유지.

**Total**: 1 file changed

## ✅ Definition of Done

- [x] docs-only spec — 단위 테스트 해당 없음
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-13.md`
- Walkthrough: `specs/spec-13-02-intake-existing-assets/walkthrough.md`
- 다음 Spec: spec-13-03 (gd-chat v2)
- 참조 ADR: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
