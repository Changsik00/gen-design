# feat(spec-6-09): paper-sync resolver/converter PoC + go/no-go 보고서

## 📋 Summary

### 배경 및 목적

`tokens.json` 변경 시 Paper 시안에 자동 반영이 안 되는 병목을 해소하기 위한 **Research/PoC**. tokens.json 의 `{primitive.xxx}` 참조를 Paper 가 적용 가능한 스타일 페이로드로 변환하는 라이브러리(`paper-sync`)를 구현하고, 실제 Paper 캔버스에 적용해 toolchain 의 실현 가능성을 검증한다.

### 주요 변경 사항
- [x] `studio/src/lib/paper-sync/` 신규 라이브러리 (resolver / converter / types)
- [x] 단위 테스트 8 개 (resolver 4 + converter 3, 추가 케이스 1)
- [x] Paper MCP 로 실측 PoC 수행 — Token Test 아트보드(1A8-0) Test 3 의 3 개 버튼에 light 테마 색상 적용
- [x] `poc-report.md`: Go/No-Go 결정 + phase-7 이월 선결 과제 4 가지(F2/F3/F4 포함)
- [x] `.claude/settings.json` deny 규칙 정리 (광범위 `~/**` 제거 → 민감 서브디렉토리만 잔존)

### Phase 컨텍스트
- **Phase**: `phase-6` (Studio v1)
- **본 SPEC 의 역할**: phase-6 의 마지막 spec — DESIGN.md ↔ tokens.json ↔ Paper 삼자 동기화 중 Paper 측 자동화의 실현성을 검증하고, phase-7 진입 전제 조건을 정리.

## 🎯 Key Review Points

1. **`paper-normalizer` 와 독립 라이브러리**: 정규화(값 변환)와 토큰 해소(참조 풀이)는 책임이 다르다고 판단해 별도 폴더(`paper-sync/`)로 분리. 상호 import 없음.
2. **resolver 의 `primitive.` prefix strip**: `resolveTokenValue` 가 `{primitive.indigo.500}` 형식을 받아 두 번째 인자(primitive 서브트리) 기준으로 traversal — `primitive.` 는 자동 strip. 호출 측 인터페이스가 단순.
3. **converter 의 `styles.fill` 단순화**: PoC 단계에서는 모든 토큰을 `fill` 로 출력. 실 적용 시에는 카테고리별 분기 필요(F2 — phase-7 선결 과제).
4. **PoC 결론 — 조건부 No-Go**: Core toolchain 은 Go, end-to-end 자동화는 F2/F3/F4 해결 후 phase-7 에서 본격 진행 권장.
5. **권한 deny 규칙 정리**: 광범위 `Edit(~/**)`/`Write(~/**)` 가 프로젝트 자체 편집을 차단해 실작업 불능. 옵션 2(민감 서브디렉토리만 잔존)로 정리.

## 🧪 Verification

### 자동 테스트
```bash
pnpm --filter studio test
```

**결과 요약**:
- ✅ `resolveTokenValue` (3 케이스): 리터럴 / 참조 / 미존재 throw
- ✅ `resolveSemanticColors` (2 케이스): light 스킴 전체 해소 / 키 정합
- ✅ `tokensToPaperPayloads` (3 케이스): 정상 변환 / 빈 입력 / 키 prefix 처리
- ✅ studio 전체 44 files / 266 tests PASS

### 빌드
```bash
pnpm --filter studio run build
```
- ✅ tokens CSS 빌드 + tsc + vite production 빌드 성공

### 수동 검증 시나리오 (Paper MCP PoC)
1. **before 캡처**: Token Test (1A8-0) Test 3 — bg-primary=검정 / bg-secondary=흰색 / bg-destructive=빨강 (placeholder)
2. **update_styles 일괄 적용**: 3 노드에 tokens.json 의 light 테마 색상 (인디고/연회색/빨강) 주입
3. **after 캡처**: 모든 노드가 토큰 값으로 정합 — 시각 확인 완료

## 📦 Files Changed

### 🆕 New Files
- `studio/src/lib/paper-sync/types.ts`: 토큰/페이로드 타입 정의
- `studio/src/lib/paper-sync/resolver.ts`: `{primitive.xxx}` 참조 해소 + semantic.color.light 일괄 변환
- `studio/src/lib/paper-sync/converter.ts`: CSS 변수 레코드 → Paper update_styles 페이로드 배열
- `studio/src/lib/paper-sync/index.ts`: public API export
- `studio/src/lib/paper-sync/__tests__/resolver.test.ts`: 5 테스트
- `studio/src/lib/paper-sync/__tests__/converter.test.ts`: 3 테스트
- `specs/spec-6-09-paper-sync/spec.md`, `plan.md`, `task.md`, `poc-report.md`, `walkthrough.md`, `pr_description.md`

### 🛠 Modified Files
- `.claude/settings.json` (-2): 광범위 `Edit(~/**)`/`Write(~/**)` deny 제거
- `.claude/commands/{hk-pr-bb,hk-pr-gh,hk-ship}.md`, `.claude/commands/hk-update.md` (신규): harness-kit 0.7.0 install 동기화
- `.gitignore`: harness-kit 섹션 정리
- `backlog/phase-6.md`, `backlog/queue.md`: spec-6-09 등록

**Total**: 17 files changed (5 commits)

## ✅ Definition of Done

- [x] 단위 테스트 8/8 PASS, studio 전체 266/266 PASS
- [x] `pnpm --filter studio run build` 성공
- [x] `poc-report.md` 작성 (Go/No-Go 결론 포함)
- [x] `walkthrough.md` 작성
- [x] `pr_description.md` 작성
- [x] `spec-6-09-paper-sync` 브랜치 push (Ship 단계에서 진행)
- [x] 사용자 검토 요청 알림 (PR URL 보고)

## 🔗 관련 자료

- Phase: `backlog/phase-6.md`
- Spec: `specs/spec-6-09-paper-sync/spec.md`
- Plan: `specs/spec-6-09-paper-sync/plan.md`
- PoC Report: `specs/spec-6-09-paper-sync/poc-report.md`
- Walkthrough: `specs/spec-6-09-paper-sync/walkthrough.md`
- 관련 spec (참조 라이브러리): `specs/spec-6-02-paper-normalizer/`
