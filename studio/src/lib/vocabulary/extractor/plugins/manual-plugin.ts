/**
 * Manual 패턴 plugin — cva 를 안 쓰는 컴포넌트 (composites / templates) 처리.
 *
 * Tier 3 의 composites/templates 는 보통 ui primitives 를 조합만 하므로
 * cva 호출 없음. 하지만 *카탈로그 등재* 는 필요 — variant 가 없는 컴포넌트로.
 *
 * 인식: 파일에 PascalCase 함수 export 가 있고 cva 호출 없음.
 * 출력: ExtractedComponent { pattern: "manual", axes: [] }
 *
 * cvaPlugin 다음 우선순위로 실행되어 cva 가 매칭된 파일은 중복 처리하지 않는다.
 */

import * as ts from "typescript";
import type { ExtractedComponent, ExtractorPlugin } from "./types";

export const manualPlugin: ExtractorPlugin = {
  name: "manual",

  matches(sourceFile) {
    if (sourceFile.text.includes("cva(")) return false;
    return findFirstPascalExport(sourceFile) !== null;
  },

  extract(sourceFile, filePath) {
    const exportName = findFirstPascalExport(sourceFile);
    if (!exportName) return [];
    return [
      {
        name: exportName,
        filePath,
        axes: [],
        defaultVariants: {},
        ariaRole: inferAriaRole(exportName),
        pattern: "manual",
      } satisfies ExtractedComponent,
    ];
  },
};

function findFirstPascalExport(sourceFile: ts.SourceFile): string | null {
  let found: string | null = null;
  function visit(node: ts.Node): void {
    if (found) return;
    if (ts.isFunctionDeclaration(node) && node.name && isPascalCase(node.name.text)) {
      const isExported = (node.modifiers ?? []).some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported) {
        found = node.name.text;
        return;
      }
    }
    if (ts.isVariableStatement(node)) {
      const isExported = (node.modifiers ?? []).some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name) && isPascalCase(decl.name.text)) {
            found = decl.name.text;
            return;
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return found;
}

function isPascalCase(s: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(s);
}

function inferAriaRole(componentName: string): string | undefined {
  const lower = componentName.toLowerCase();
  // composites/templates 의 흔한 이름 → ARIA role
  if (lower.endsWith("page") || lower === "page") return "main";
  if (lower.endsWith("header")) return "banner";
  if (lower === "sidebar") return "navigation";
  if (lower.endsWith("table")) return "table";
  if (lower.endsWith("form")) return "form";
  if (lower.endsWith("dialog") || lower.endsWith("modal")) return "dialog";
  if (lower.endsWith("button") || lower === "homebutton") return "button";
  if (lower.endsWith("card")) return "group";
  if (lower.endsWith("icon")) return "img";
  if (lower.endsWith("message")) return "status";
  return undefined;
}
