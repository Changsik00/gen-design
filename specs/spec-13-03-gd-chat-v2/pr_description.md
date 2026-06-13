# docs(spec-13-03): gd-chat v2 재작성 — Data/API/Scenarios 레이어 추가

## 📋 Summary

### 배경 및 목적

`gd-chat` 스킬이 v1 포맷(3층: Narrative/Structure/History)만 안내하고 있었다. ADR-011에서 확정한 chat.md v2 포맷(5개 레이어)과 LLM-native 생성 흐름을 반영하여 스킬을 재작성한다.

### 주요 변경 사항

- [x] **v2 frontmatter** (`version: 2`) 예시 추가 (§4)
- [x] **§3.1 v1→v2 업그레이드 제안** (신규): 기존 v1 파일 발견 시 선택적 업그레이드 안내
- [x] **§5.5 checklist 7단계** (기존 5단계 → 7단계): Data 확인(vi), Scenarios 확인(vii) 추가
- [x] **§5.8 Data 레이어 작성** (신규): `{{data.X}}` 바인딩 발견 시 Data YAML 유도
- [x] **§5.9 API 레이어 작성** (신규): Data source → API 엔드포인트 정리
- [x] **§5.10 Scenarios 레이어 작성** (신규): 서버 데이터 있을 때 최소 3개 강제 (loaded/loading/error)
- [x] **§5.11 DB Hints** (신규, 선택): 백엔드 설계 초안 선택적 안내
- [x] **§9 LLM 생성 안내** (교체): `pnpm gd react` → "LLM 직접 요청 + gd extract" 3단계 안내
- [x] **§11 안티 패턴** 3개 추가: Scenarios 건너뛰기, Data 없이 Scenarios, `pnpm gd react` 안내
- [x] **§12 종료 조건** 7단계로 확장

### Phase 컨텍스트

- **Phase**: `phase-13`
- **본 SPEC의 역할**: spec-13-04 (gd extract)의 전제 조건. Scenarios 레이어 포맷이 확정되어야 extract 구현 가능.

## 🎯 Key Review Points

1. **Scenarios 강제 정책** (§5.10, §5.5-vii): 서버 데이터 있을 때만 강제. 정적 화면은 decisions.md에 "Scenarios 없음" 기록으로 skip.

2. **Data → API → Scenarios 연결 흐름** (§5.8~§5.10): 각 레이어가 이전 레이어 결과를 입력으로 받는 구조. 자연스러운 대화 흐름으로 3개 레이어 동시 완성.

3. **§9 LLM 생성 안내**: `pnpm gd react` 완전 제거. 방법 1(LLM 직접), 방법 2(gd extract), 방법 3(pnpm dev) 순서.

## 🧪 Verification

docs-only spec — 단위 테스트 해당 없음.

### 수동 검증 시나리오

1. **데이터 바인딩 있는 화면** → §5.8→§5.9→§5.10 순서로 3개 레이어 완성 ✓
2. **정적 화면 (데이터 없음)** → (vi)(vii) skip, decisions.md 기록 ✓
3. **v1 파일 수정** → §3.1 업그레이드 제안 Y/N ✓
4. **컴파일 안내** → `pnpm gd react` 없음, LLM 직접 요청 안내 ✓

## 📦 Files Changed

### 🛠 Modified Files

- `packages/gd-skills/skills/gd-chat.md` (+297, -336): v2 레이어 추가, 컴파일러 참조 제거, 안티패턴/종료조건 업데이트

**Total**: 1 file changed

## ✅ Definition of Done

- [x] docs-only spec — 단위 테스트 해당 없음
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-13.md`
- Walkthrough: `specs/spec-13-03-gd-chat-v2/walkthrough.md`
- 포맷 스펙: `docs/chatmd-v2-format.md`
- ADR: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
- 다음 Spec: spec-13-04 (gd extract — Scenarios YAML → MSW 핸들러 생성)
