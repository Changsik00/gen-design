# Stitch MCP/SDK 연동 가이드

> Google Stitch는 AI 네이티브 UI 디자인 도구. DESIGN.md 개념의 원조이며, MCP와 SDK를 통해 프로그래밍 방식으로 디자인을 생성/관리할 수 있다.

## 연결 상태

- **MCP 연결**: 미연결 (셋업 필요)
- **SDK**: `@google/stitch-sdk` (npm)
- **Agent Skill**: `google-labs-code/stitch-skills` (design-md 생성)

## 연동 방법 (3가지)

### 방법 1: 공식 MCP 서버

```jsonc
// Claude Code MCP 설정
{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp"
    }
  }
}
```

**인증**:
- `STITCH_API_KEY` 환경변수 설정, 또는
- `gcloud auth login` 으로 OAuth 인증

**문서**: https://stitch.withgoogle.com/docs/mcp/setup/

### 방법 2: SDK 직접 사용

```bash
npm install @google/stitch-sdk
```

```typescript
import { stitch } from "@google/stitch-sdk";

// 프로젝트 생성
const project = stitch.project("my-app");

// 시안 생성
const screen = await project.generate("A login page with email and password");

// HTML / 이미지 추출
const html = await screen.getHtml();
const imageUrl = await screen.getImage();
```

**주요 기능**:
- 텍스트 프롬프트 → UI 시안 생성
- 기존 시안 편집
- 디자인 variant 생성 (최대 5개, 창의성 범위 조절)
- HTML 마크업 + PNG 스크린샷 추출
- 디바이스 타입 지정: `MOBILE`, `DESKTOP`, `TABLET`, `AGNOSTIC`
- Vercel AI SDK 통합 (`@google/stitch-sdk/ai`)

### 방법 3: Agent Skill (DESIGN.md 자동 생성)

```bash
npx skills add google-labs-code/stitch-skills --skill design-md --global
```

**5단계 파이프라인**:
1. **Retrieval** — Stitch MCP로 프로젝트 스크린/HTML 가져오기
2. **Extraction** — 디자인 토큰 식별 (색상, 타이포, 간격, 컴포넌트)
3. **Translation** — CSS/Tailwind 값 → 자연어 디자인 언어로 변환
4. **Synthesis** — DESIGN.md 시맨틱 디자인 시스템 포맷으로 생성
5. **Alignment** — Stitch Effective Prompting Guide 준수 확인

**호환 도구**: Claude Code, Cursor, Windsurf, VS Code, Gemini CLI

## 커뮤니티 도구

| 도구 | 설명 | 링크 |
|------|------|------|
| `davideast/stitch-mcp` | CLI + MCP 프록시 (serve, view, site, proxy, tool) | [GitHub](https://github.com/davideast/stitch-mcp) |
| `gemini-cli-extensions/stitch` | Gemini CLI 확장 | [GitHub](https://github.com/gemini-cli-extensions/stitch) |

## 워크플로우

### DESIGN.md 생성 (Stitch → DESIGN.md)

```
1. Stitch에서 디자인 작업 (웹 UI 또는 SDK)
2. design-md Agent Skill 실행
   → 5단계 파이프라인으로 DESIGN.md 자동 생성
3. DESIGN.md를 프로젝트 루트에 커밋
4. Claude Code가 DESIGN.md를 컨텍스트로 읽고 코드 생성
```

### 시안 생성 (DESIGN.md → Stitch)

```
1. DESIGN.md의 토큰/스타일 정보를 프롬프트에 포함
2. SDK 또는 MCP로 시안 생성 요청
3. 생성된 HTML/PNG 추출
4. Paper 또는 코드로 활용
```

### URL → DESIGN.md (기존 사이트 분석)

```
1. Stitch 웹 UI에서 URL 붙여넣기
2. Gemini가 렌더링된 CSS를 분석
3. DESIGN.md 자동 생성 (색상, 타이포, 간격, 컴포넌트)
4. 다운로드하여 프로젝트에 적용
```

## 셋업 TODO

- [ ] Stitch API Key 발급 (https://stitch.withgoogle.com/)
- [ ] Claude Code MCP 설정에 Stitch 추가
- [ ] `design-md` Agent Skill 설치 및 테스트
- [ ] SDK 연동 테스트 (시안 생성 → HTML 추출)

## 프로젝트 내 활용 Phase

| Phase | 활용 방식 |
|-------|----------|
| Phase 1 | Stitch 포맷 분석, 확장 포인트 정의 시 참조 |
| Phase 4 | 협업 Flow에서 Stitch 경로 탐색 |
| Phase 5 | PoC 앱 시안 생성 대안 도구 |
| Phase 7 | Stitch 연동 심화 (spec-7-003) |
