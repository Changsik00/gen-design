# Walkthrough: spec-6-09

> Paper ↔ tokens 자동 동기화 PoC. resolver/converter 라이브러리 + Paper 캔버스 실측 + Go/No-Go 보고서.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| `paper-normalizer` 와 통합 vs 독립 라이브러리 | A: 통합 / B: 독립 | **B** | 정규화(값 형변환) 와 토큰 해소(참조 풀이)는 책임이 다름. 독립 폴더로 두면 phase-7 에서 확장(watch/CLI) 시 분리 부담 ↓. |
| converter 의 style key 매핑 단순화 | A: 카테고리별 분기 (backgroundColor/color/fill) / B: 전부 `fill` 출력 | **B (PoC), A (다음 단계)** | PoC 검증 단계에서는 인터페이스 단순화 우선. 실 적용 시 분기 필요 — F2 로 보고서 명시. |
| Paper 노드-토큰 매핑 자동화 범위 | A: 본 spec 에서 컨벤션까지 결정 / B: PoC 결과 보고 후 phase-7 에서 결정 | **B** | 컨벤션 결정은 디자인 가이드라인 합의가 선결. Out of Scope 로 분리. |
| Test 3 버튼의 Paper 노드 식별 | A: 자동 매칭 / B: 노드 ID hand-pick | **B** | F3 (매핑 컨벤션 부재) 가 미해결이라 자동 매칭 불가. PoC 목적상 hand-pick 으로 toolchain 검증. |

## 💬 사용자 협의

- **주제**: 워킹트리 install drift 처리
  - **사용자 의견**: "옵션 2단계 분리 정리 — chore 따로, spec 산출물 따로"
  - **합의**: 1) phase base 에서 install drift chore 커밋, 2) spec 브랜치에서 Pre-flight 산출물 docs 커밋, 3) Task 1 부터 정상 Strict Loop.
- **주제**: 권한 deny 규칙 충돌
  - **이슈**: `Edit(~/**)` / `Write(~/**)` deny 규칙이 프로젝트 파일까지 차단
  - **합의**: 옵션 2 — 광범위 `~/**` 제거, 민감 서브디렉토리만 잔존 (`~/.aws`, `~/.config/gcloud`, `~/.gnupg`, `~/.ssh`)

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `pnpm --filter studio test`
- **결과**: ✅ Passed (44 files / 266 tests / 3.64s) — paper-sync 자체 8/8 PASS 포함
- **로그 요약**:
```text
RUN  v4.1.5 /Users/dennis/Project/Design/studio
Test Files  44 passed (44)
     Tests  266 passed (266)
```

#### 빌드
- **명령**: `pnpm --filter studio run build`
- **결과**: ✅ Passed — token CSS 빌드 + tsc -b + vite production 빌드 성공 (198ms)

### 2. 수동 검증 (Paper PoC)

1. **Action**: `mcp__paper__get_basic_info`
   - **Result**: 17 아트보드 확인. "Token Test" (1A8-0) 가 PoC 후보.
2. **Action**: `mcp__paper__get_tree_summary` on `1A8-0`
   - **Result**: Test 3 의 3 개 Frame "Button" (1AR-0, 1AT-0, 1AV-0) 식별.
3. **Action**: `mcp__paper__get_screenshot` (before)
   - **Result**: bg-primary=검정 / bg-secondary=흰색 / bg-destructive=빨강 placeholder 색상.
4. **Action**: `mcp__paper__update_styles` 일괄 적용
   ```json
   [{"nodeIds":["1AR-0"], "styles":{"backgroundColor":"#6366F1"}},
    {"nodeIds":["1AT-0"], "styles":{"backgroundColor":"#F1F5F9"}},
    {"nodeIds":["1AV-0"], "styles":{"backgroundColor":"#EF4444"}}]
   ```
   - **Result**: 3 노드 모두 응답 정상.
5. **Action**: `mcp__paper__get_screenshot` (after)
   - **Result**: bg-primary=인디고 / bg-secondary=연회색 / bg-destructive=빨강 — tokens.json 의 light 테마 색상으로 정합.
6. **Action**: `mcp__paper__finish_working_on_nodes`
   - **Result**: 작업 indicator 해제.

## 🔍 발견 사항

- **F1**: resolver/converter Core 동작은 단위 테스트 + 실 캔버스 적용 모두 통과 — toolchain 검증 완료.
- **F2**: converter 의 `styles.fill` 출력이 Paper Frame 의 배경에는 직접 적용 불가. Paper API 는 React.CSSProperties 를 받으므로 `backgroundColor` 등으로 분기 필요.
- **F3**: Paper 노드와 토큰 키를 매핑할 컨벤션이 없어 자동 매핑 불가. 옵션(노드 이름 / 메타데이터 / 자식 텍스트 heuristic) 결정 필요.
- **F4**: tokens.json → 라이브러리 입력 흐름(파일 read, watch, trigger) 미정. phase-7 통합 시 결정.

## 🚧 이월 항목

- F2/F3/F4 — `poc-report.md` 의 phase-7 선결 과제로 이관. `backlog/queue.md` Icebox 추가는 phase-7 진입 시점에 사용자 승인 후 promote.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + Dennis |
| **작성 기간** | 2026-05-09 ~ 2026-05-09 |
| **최종 commit** | (Ship commit 직후 갱신) |
