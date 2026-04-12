# Paper MCP 연동 가이드

> Paper는 Anthropic의 전문 디자인 도구. MCP(Model Context Protocol)를 통해 AI 에이전트가 디자인을 읽고 쓸 수 있다.

## 연결 상태

- **MCP 연결**: 활성 (Claude Code에서 자동 연결)
- **도구 수**: 24개
- **설정 위치**: Claude Code MCP 설정 (별도 인증 불필요)

## 도구 목록

### 읽기 (Read)

| 도구 | 용도 | 주요 파라미터 |
|------|------|--------------|
| `get_basic_info` | 파일명, 페이지명, 아트보드 목록, 사용 폰트 | 없음 |
| `get_tree_summary` | 노드 계층 구조 텍스트 요약 | `nodeId`, `depth` (기본 3, 최대 10) |
| `get_node_info` | 개별 노드 상세 정보 (크기, 가시성, 잠금, 텍스트) | `nodeId` |
| `get_children` | 직계 자식 노드 목록 | `nodeId` |
| `get_selection` | 현재 선택된 노드 정보 | 없음 |

### 시각 검증 (Visual)

| 도구 | 용도 | 주요 파라미터 |
|------|------|--------------|
| `get_screenshot` | 노드 스크린샷 (base64 JPEG) | `nodeId`, `scale` (1 또는 2), `transparent` |
| `get_computed_styles` | 계산된 CSS 스타일 추출 (배치 지원) | `nodeIds[]` |
| `get_fill_image` | 이미지 채우기 데이터 추출 | `nodeId` |
| `get_font_family_info` | 폰트 패밀리 가용성 및 웨이트 정보 | `familyNames[]` |

### 코드 추출 (Code)

| 도구 | 용도 | 주요 파라미터 |
|------|------|--------------|
| `get_jsx` | JSX 코드 생성 (Tailwind 또는 inline) | `nodeId`, `format` ("tailwind" / "inline-styles") |

### 쓰기 (Write)

| 도구 | 용도 | 주요 파라미터 |
|------|------|--------------|
| `create_artboard` | 새 아트보드 생성 | `name`, `styles` (width, height 필수) |
| `write_html` | HTML → Paper 디자인 노드 변환 | `html`, `targetNodeId`, `mode` ("insert-children" / "replace") |
| `update_styles` | 기존 노드 스타일 수정 (배치 지원) | `updates[{nodeIds[], styles}]` |
| `set_text_content` | 텍스트 노드 내용 수정 (배치 지원) | `updates[{nodeId, textContent}]` |

### 관리 (Manage)

| 도구 | 용도 | 주요 파라미터 |
|------|------|--------------|
| `delete_nodes` | 노드 삭제 (하위 포함) | `nodeIds[]` |
| `duplicate_nodes` | 노드 복제 (딥 클론) | `nodes[{id, parentId?}]` |
| `rename_nodes` | 레이어 이름 변경 | `updates[{nodeId, name}]` |
| `finish_working_on_nodes` | 작업 표시 해제 | `nodeIds[]` (선택) |

### 가이드 (Guide)

| 도구 | 용도 | 주요 파라미터 |
|------|------|--------------|
| `get_guide` | 내장 가이드 조회 | `topic` ("figma-import") |

## 기본 크기 규격

| 디바이스 | 크기 |
|---------|------|
| Desktop | 1440 × 900px |
| Tablet | 768 × 1024px |
| Mobile | 390 × 844px |

## 워크플로우

### 정방향: DESIGN.md → Paper 시안

```
1. create_artboard         → 아트보드 생성 (디바이스별 크기)
2. write_html (반복)       → HTML을 작은 단위로 점진적 삽입
                              (헤더 → 각 행 → 푸터 순서)
3. update_styles           → 토큰 기반 스타일 미세 조정
4. get_screenshot          → 결과 스크린샷으로 검증
```

**중요 규칙**:
- `write_html`은 한 번에 하나의 시각적 그룹만 (카드, 버튼바, 헤더 등)
- 반복 요소는 첫 번째 생성 후 `duplicate_nodes`로 복제
- 인라인 스타일만 사용 (`style="..."`)
- `display: flex`가 기본 레이아웃 모드
- `<x-paper-clone node-id="ID" />` 로 기존 노드 복제 삽입 가능

### 역방향: Paper 시안 → DESIGN.md

```
1. get_basic_info           → 전체 구조 파악
2. get_tree_summary         → 노드 계층 탐색
3. get_computed_styles      → CSS 값 추출 (색상, 타이포, 간격 등)
4. get_jsx (tailwind)       → Tailwind 클래스 기반 코드 추출
5. 추출값 → DESIGN.md 토큰으로 변환
```

### 리뷰 체크포인트

2~3회 수정마다 `get_screenshot`으로 다음을 검증:
- **Spacing**: 간격 균일성, 시각적 리듬
- **Typography**: 읽기 크기, line-height, 계층 구분
- **Contrast**: 텍스트 대비, 배경과의 구분
- **Alignment**: 수직/수평 정렬
- **Clipping**: 컨테이너 경계에서 잘림 여부

## 프로젝트 내 활용 Phase

| Phase | 활용 방식 |
|-------|----------|
| Phase 2 | LoginPage 디자인 시안 생성 + 토큰 검증 |
| Phase 4 | 협업 Flow PoC — 양방향 동기화 |
| Phase 5 | PoC 앱 A/B 시안 생성 |
| Phase 7 | 정방향/역방향 파이프라인 안정화 |
