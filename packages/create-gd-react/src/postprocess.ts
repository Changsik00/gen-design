import { readFile, writeFile, stat, readdir } from "node:fs/promises";
import { join } from "node:path";

const PLACEHOLDER_RE = /\{\{project-name\}\}/g;

const MEMORY_INDEX_TEMPLATE = (projectName: string) =>
  `# Memory Index — ${projectName}

> 이 디렉토리는 디자이너 / 프로젝트 / 결정 / 피드백 정보를 누적합니다.
> gd-* 스킬이 매 세션 시작 시 자동 로딩합니다 — 사용자가 알려준 정보를 잊지 않기 위함.
>
> 이 파일을 *수동 편집* 해도 무방. 단 각 entry 는 'file.md — one-line hook' 형식 유지.

- [Designer](designer.md) — 디자이너 정보 (이름 / 톤 / 선호)
- [Project](project.md) — 프로젝트 정보 (브랜드 / 타깃 유저 / 도메인)
- [Decisions](decisions.md) — 디자인 결정 history
- [Feedback](feedback.md) — 누적 피드백
`;

const PROJECT_PLACEHOLDER = `---
name: project
description: 프로젝트 정보 (브랜드 / 타깃 유저 / 도메인 / 비전)
type: project
---

<!-- 디자이너가 알려준 프로젝트 정보가 여기 누적됩니다. gd-start 스킬이 채워나갑니다.

작성 가이드:
- 한 줄 정의: <이 프로젝트는 무엇인가>
- 타깃 사용자: <누가 쓰는가>
- 핵심 가치: <왜 이걸 쓰는가, 다른 대안 대비>
- 도메인: <어떤 산업 / 분야 / 카테고리>
- 브랜드 톤: <친근 / 전문적 / 미니멀 / 활기 등>

-->
`;

const DESIGNER_PLACEHOLDER = `---
name: designer-profile
description: 이 프로젝트를 작업하는 디자이너의 정보 (이름 / 톤 / 선호 / 도구)
type: user
---

<!-- gd-start 스킬이 채워나갑니다. 디자이너가 직접 편집해도 무방.

작성 가이드:
- 이름 또는 호칭:
- 작업 톤: <빠른 결정 / 신중한 검토 / etc>
- 선호: <짧은 답변 / 자세한 설명 / 코드 우선 / 예시 우선>
- 도구 친숙도: <Figma 사용 / Paper 사용 / Claude Code 친숙도>
- 기타 컨텍스트: <개인 / 팀 / 회사 환경>

-->
`;

const DECISIONS_PLACEHOLDER = `---
name: design-decisions
description: 디자인 결정의 history (왜 이 색 / 왜 이 레이아웃 / 왜 이 컴포넌트)
type: project
---

<!-- gd-* 스킬들이 결정 시점에 한 entry 씩 append. 최신이 위에 추가됩니다.

표준 entry 형식:

## YYYY-MM-DD <결정 요약>

- **결정**: <한 줄>
- **이유**: <왜 — 대안 무엇이었나>
- **영향**: <어떤 cva variant / chat / scene 에 영향>
- **출처 스킬**: gd-token / gd-design / gd-chat 중 어디서 기록된 결정인지

-->
`;

const FEEDBACK_PLACEHOLDER = `---
name: feedback
description: 누적된 피드백 (디자이너가 거절한 제안 / 반복된 요청 / 회피 패턴)
type: feedback
---

<!-- agent 가 디자이너의 거절/수정 패턴을 발견할 때마다 append.
     향후 세션에서 동일 제안 회피 / 패턴 반복.

표준 entry 형식:

## YYYY-MM-DD <피드백 요약>

- **상황**: <어떤 제안에 대해>
- **반응**: <거절 / 수정 / 승인>
- **이유**: <왜 그렇게 반응했나>
- **적용 범위**: <전역 행동 규칙 / 특정 카테고리만>

-->
`;

/**
 * scaffold 후처리:
 * - package.json 의 name 필드 치환
 * - 모든 텍스트 파일의 {{project-name}} placeholder 치환
 * - .gd/memory/{MEMORY.md,project.md} 초기 생성 (디렉토리가 존재할 때만)
 *
 * idempotent — 두 번 실행해도 결과 동일.
 */
export async function postprocess(targetDir: string, projectName: string): Promise<void> {
  await replacePackageJsonName(targetDir, projectName);
  await replacePlaceholdersInTextFiles(targetDir, projectName);
  await initMemoryIfPresent(targetDir, projectName);
}

async function replacePackageJsonName(dir: string, projectName: string): Promise<void> {
  const path = join(dir, "package.json");
  const exists = await stat(path).catch(() => null);
  if (!exists) return;

  const raw = await readFile(path, "utf-8");
  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return;
  }
  pkg.name = projectName;
  await writeFile(path, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".txt",
  ".json",
  ".jsonc",
  ".yaml",
  ".yml",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".html",
  ".css",
  ".env",
]);

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next"]);

async function replacePlaceholdersInTextFiles(
  dir: string,
  projectName: string,
  root = dir,
): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await replacePlaceholdersInTextFiles(full, projectName, root);
      continue;
    }
    if (!entry.isFile()) continue;

    // package.json 은 위에서 별도 처리 (JSON 파싱)
    if (full === join(root, "package.json")) continue;

    const ext = entry.name.includes(".") ? "." + entry.name.split(".").pop() : "";
    if (!TEXT_EXTENSIONS.has(ext)) continue;

    const content = await readFile(full, "utf-8");
    if (!PLACEHOLDER_RE.test(content)) {
      PLACEHOLDER_RE.lastIndex = 0;
      continue;
    }
    PLACEHOLDER_RE.lastIndex = 0;
    const replaced = content.replace(PLACEHOLDER_RE, projectName);
    await writeFile(full, replaced, "utf-8");
  }
}

async function initMemoryIfPresent(dir: string, projectName: string): Promise<void> {
  const memoryDir = join(dir, ".gd", "memory");
  const exists = await stat(memoryDir).catch(() => null);
  if (!exists || !exists.isDirectory()) return;

  // 인덱스는 매번 갱신 (projectName 반영)
  await writeFile(join(memoryDir, "MEMORY.md"), MEMORY_INDEX_TEMPLATE(projectName), "utf-8");

  // 4 entry 는 *없을 때만* 초기화 (디자이너가 채운 내용 보존 — idempotent)
  const entries: Array<[string, string]> = [
    ["designer.md", DESIGNER_PLACEHOLDER],
    ["project.md", PROJECT_PLACEHOLDER],
    ["decisions.md", DECISIONS_PLACEHOLDER],
    ["feedback.md", FEEDBACK_PLACEHOLDER],
  ];
  for (const [name, template] of entries) {
    const path = join(memoryDir, name);
    const entryExists = await stat(path).catch(() => null);
    if (!entryExists) {
      await writeFile(path, template, "utf-8");
    }
  }
}
