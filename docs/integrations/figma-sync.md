# Figma 연동 가이드

> Figma Variables ↔ 디자인 토큰 동기화 및 컴포넌트 변환. Phase 4에서 PoC 후 상세 작성 예정.

## 연결 상태

- **MCP 연결**: 미확인 (조사 필요)
- **REST API**: Figma REST API v1 (공식)
- **플러그인**: Tokens Studio (구 Figma Tokens)

## 연동 경로 (후보)

### 경로 1: Figma REST API 직접

```
tokens.json → Figma REST API → Figma Variables 생성/갱신
Figma Variables → Figma REST API → tokens.json 풀
```

- Variables API 접근 권한 필요 (Enterprise 또는 Organization 플랜)
- Rate limit 주의

### 경로 2: Tokens Studio 플러그인

```
tokens.json ↔ Tokens Studio ↔ Figma Variables
         (GitHub/GitLab 동기화 지원)
```

- W3C DTCG 포맷 지원
- Style Dictionary 변환 내장
- 무료 플랜에서도 기본 기능 사용 가능

### 경로 3: Figma MCP (조사 필요)

- Figma 공식 또는 커뮤니티 MCP 서버 존재 여부 확인
- Paper MCP에 `get_guide("figma-import")` 가이드 내장 — Paper↔Figma 브릿지 가능

## 셋업 TODO

- [ ] Figma API 토큰 발급
- [ ] Figma MCP 서버 존재 여부 조사
- [ ] Tokens Studio 플러그인 설치 및 DTCG 연동 테스트
- [ ] Paper의 figma-import 가이드 확인 (`get_guide("figma-import")`)

## 프로젝트 내 활용 Phase

| Phase | 활용 방식 |
|-------|----------|
| Phase 4 | Figma Variables ↔ 토큰 동기화 PoC (spec-4-003) |
| Phase 7 | Figma 컴포넌트 → DESIGN.md 변환 (spec-7-004, spec-7-005) |
