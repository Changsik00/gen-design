/**
 * 어휘 추출기 — public API.
 *
 * 사용법:
 * ```typescript
 * const components = extractFromFile("studio/src/components/ui/button.tsx");
 * const allComponents = extractFromDirectory("studio/src/components/ui");
 * ```
 *
 * plugin 기반: 현재 cva plugin 만. 향후 다른 패턴 추가 가능 (data-state 등).
 *
 * ADR-004 D-1 (로컬 .tsx ground truth) + NFR-1 (plugin 가능 설계).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
import type { ExtractedComponent, ExtractorPlugin } from "./plugins/types";
import { cvaPlugin } from "./plugins/cva-plugin";

const PLUGINS: ExtractorPlugin[] = [cvaPlugin];

/** 단일 .tsx 파일에서 어휘 추출. */
export function extractFromFile(filePath: string): ExtractedComponent[] {
  const sourceText = fs.readFileSync(filePath, "utf8");
  return extractFromSource(sourceText, filePath);
}

/** 소스 텍스트에서 직접 추출 — 테스트 친화. */
export function extractFromSource(
  sourceText: string,
  filePath: string,
): ExtractedComponent[] {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.ES2022,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  );

  const components: ExtractedComponent[] = [];
  for (const plugin of PLUGINS) {
    if (!plugin.matches(sourceFile)) continue;
    components.push(...plugin.extract(sourceFile, filePath));
  }
  return components;
}

/** 디렉토리 재귀 스캔 → 모든 .tsx 파일에서 추출. test 파일 제외. */
export function extractFromDirectory(dirPath: string): ExtractedComponent[] {
  const components: ExtractedComponent[] = [];
  walkDir(dirPath, (filePath) => {
    if (!filePath.endsWith(".tsx")) return;
    if (filePath.includes("__tests__/") || filePath.endsWith(".test.tsx")) return;
    components.push(...extractFromFile(filePath));
  });
  return components;
}

function walkDir(dir: string, visitor: (filePath: string) => void): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, visitor);
    } else if (entry.isFile()) {
      visitor(full);
    }
  }
}

export type { ExtractedComponent, ExtractedAxis, ExtractorPlugin } from "./plugins/types";
