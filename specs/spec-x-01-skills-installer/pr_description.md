# PR: spec-x-01 — skills-installer

## Summary

- `packages/gd-skills/` 신규: `npx @gd/skills` 로 `.claude/skills/` 에 스킬 4종 설치
- `README.md` 개편: 30s 퀵스타트 → 워크플로 → 스킬/CLI 테이블 중심으로 재작성
- 기존 동기/배경 내용 → `docs/motivation.md` 분리

## Test plan

- [ ] `npx @gd/skills` — 빈 디렉토리에서 4종 설치 확인
- [ ] 재실행 → "이미 존재 (스킵)" 확인
- [ ] `--force` → 덮어쓰기 후 설치 완료 확인
- [ ] README.md 렌더링 — quickstart / 테이블 / `<details>` 아코디언 정상 표시 확인
