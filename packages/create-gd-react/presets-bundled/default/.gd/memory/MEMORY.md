# Memory Index — {{project-name}}

> 이 디렉토리는 디자이너 / 프로젝트 / 결정 / 피드백 정보를 누적합니다.
> gd-* 스킬이 매 세션 시작 시 자동 로딩 — 사용자가 알려준 정보를 잊지 않기 위함 (session 압축 대비).
>
> 형식: Claude Code 의 auto-memory 호환 (frontmatter `name` / `description` / `type`).
> 이 파일을 *수동 편집* 해도 무방. 단 각 entry 는 'file.md — one-line hook' 형식 유지.

- [Designer](designer.md) — 디자이너 정보 (이름 / 톤 / 선호 / 도구)
- [Project](project.md) — 프로젝트 정보 (브랜드 / 타깃 / 도메인 / 비전)
- [Decisions](decisions.md) — 디자인 결정 history (시간순)
- [Feedback](feedback.md) — 누적 피드백 (거절 / 수정 패턴)

## 사용 규약 (스킬 / agent 용)

- **읽기**: 모든 `gd-*` 스킬은 호출 시 본 인덱스 + 4 entry 자동 로딩.
- **쓰기**: 새 정보 받을 때마다 *해당 entry 에 append* (덮어쓰기 X).
- **충돌**: 기존 entry 와 충돌 시 *디자이너에게 확인* 후 갱신 (자동 변경 금지).
- **민감 정보**: API key / 비밀번호 / PII 절대 append 금지.

## 새 entry 추가가 필요할 때

본 4 종으로 부족한 경우 (예: `inspiration.md`, `competitors.md`):
1. 새 entry 파일 작성 + frontmatter (name / description / type)
2. 본 MEMORY.md 에 한 줄 추가: `- [Title](file.md) — 한 줄 hook`
