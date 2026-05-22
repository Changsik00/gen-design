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

<!-- 디자이너가 알려준 프로젝트 정보가 여기 누적됩니다. gd-start 스킬이 채워나갑니다. -->
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

  await writeFile(join(memoryDir, "MEMORY.md"), MEMORY_INDEX_TEMPLATE(projectName), "utf-8");

  const projectPath = join(memoryDir, "project.md");
  const projectExists = await stat(projectPath).catch(() => null);
  if (!projectExists) {
    await writeFile(projectPath, PROJECT_PLACEHOLDER, "utf-8");
  }
}
