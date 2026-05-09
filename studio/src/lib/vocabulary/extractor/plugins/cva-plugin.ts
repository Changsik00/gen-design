/**
 * cva (class-variance-authority) 패턴 추출 plugin.
 *
 * 인식 대상:
 * ```typescript
 * const buttonVariants = cva("base-classes", {
 *   variants: {
 *     variant: { default: "...", outline: "...", ... },
 *     size:    { default: "...", sm: "...", ... }
 *   },
 *   defaultVariants: { variant: "default", size: "default" }
 * });
 * ```
 *
 * - cva() 호출의 두 번째 인자 ObjectLiteral 의 `variants` 속성을 walk
 * - 각 axis 의 키들을 enum 값으로 추출
 * - `defaultVariants` 객체에서 디폴트 값 추출
 * - 컴포넌트 이름은 같은 파일 내 PascalCase 함수 export 에서 추출
 *
 * ADR-004 D-1, D-2 의 핵심 구현.
 */

import * as ts from "typescript";
import type { ExtractedAxis, ExtractedComponent, ExtractorPlugin } from "./types";

export const cvaPlugin: ExtractorPlugin = {
  name: "cva",

  matches(sourceFile) {
    // 빠른 사전 필터: 파일에 "cva(" 텍스트가 있는지
    return sourceFile.text.includes("cva(");
  },

  extract(sourceFile, filePath) {
    const components: ExtractedComponent[] = [];
    const cvaCalls = findCvaCalls(sourceFile);

    if (cvaCalls.length === 0) return components;

    const componentName = inferComponentName(sourceFile, filePath);
    const ariaRole = inferAriaRole(componentName);

    // 한 파일에 여러 cva() 호출이 있을 수 있으나, 보통 1 개. 최초만 사용.
    const primaryCall = cvaCalls[0];
    const { axes, defaultVariants } = extractCvaConfig(primaryCall);

    const entry: ExtractedComponent = {
      name: componentName,
      filePath,
      axes,
      defaultVariants,
      pattern: "cva",
    };
    if (ariaRole) entry.ariaRole = ariaRole;
    components.push(entry);

    return components;
  },
};

/** SourceFile 내 모든 `cva(...)` CallExpression 을 찾는다. */
function findCvaCalls(sourceFile: ts.SourceFile): ts.CallExpression[] {
  const calls: ts.CallExpression[] = [];
  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "cva") {
      calls.push(node);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return calls;
}

/** cva() 의 두 번째 인자 ObjectLiteral 에서 variants + defaultVariants 추출. */
function extractCvaConfig(call: ts.CallExpression): {
  axes: ExtractedAxis[];
  defaultVariants: Record<string, string>;
} {
  const axes: ExtractedAxis[] = [];
  const defaultVariants: Record<string, string> = {};

  if (call.arguments.length < 2) return { axes, defaultVariants };

  const configArg = call.arguments[1];
  if (!ts.isObjectLiteralExpression(configArg)) return { axes, defaultVariants };

  for (const prop of configArg.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = propertyKeyName(prop.name);
    if (!key) continue;

    if (key === "variants" && ts.isObjectLiteralExpression(prop.initializer)) {
      // variants: { variant: { default: ..., ... }, size: { ... } }
      for (const axisProp of prop.initializer.properties) {
        if (!ts.isPropertyAssignment(axisProp)) continue;
        const axisName = propertyKeyName(axisProp.name);
        if (!axisName) continue;
        if (!ts.isObjectLiteralExpression(axisProp.initializer)) continue;
        const values: string[] = [];
        for (const valueProp of axisProp.initializer.properties) {
          if (!ts.isPropertyAssignment(valueProp)) continue;
          const valueName = propertyKeyName(valueProp.name);
          if (valueName) values.push(valueName);
        }
        axes.push({ name: axisName, values });
      }
    } else if (key === "defaultVariants" && ts.isObjectLiteralExpression(prop.initializer)) {
      for (const dvProp of prop.initializer.properties) {
        if (!ts.isPropertyAssignment(dvProp)) continue;
        const axisName = propertyKeyName(dvProp.name);
        if (!axisName) continue;
        const literal = stringLiteralValue(dvProp.initializer);
        if (literal !== null) {
          defaultVariants[axisName] = literal;
        }
      }
    }
  }

  return { axes, defaultVariants };
}

/** PropertyName (Identifier / StringLiteral / ComputedPropertyName) 의 텍스트. */
function propertyKeyName(name: ts.PropertyName | undefined): string | null {
  if (!name) return null;
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  if (ts.isNumericLiteral(name)) return name.text;
  return null;
}

/** Expression 에서 StringLiteral 값 추출. */
function stringLiteralValue(expr: ts.Expression): string | null {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  return null;
}

/**
 * 같은 파일 내 PascalCase 함수 export 를 컴포넌트 이름으로 추출.
 * 없으면 파일 basename 의 PascalCase 변환.
 */
function inferComponentName(sourceFile: ts.SourceFile, filePath: string): string {
  let found: string | null = null;

  function visit(node: ts.Node): void {
    if (found) return;

    // export function PascalName(...) {}
    if (ts.isFunctionDeclaration(node) && node.name && isPascalCase(node.name.text)) {
      const isExported = (node.modifiers ?? []).some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported) {
        found = node.name.text;
        return;
      }
    }
    // export const PascalName = ...
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

  if (found) return found;

  // fallback: file basename
  const base = filePath.split("/").pop()?.replace(/\.tsx?$/, "") ?? "Unknown";
  return toPascalCase(base);
}

function isPascalCase(s: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(s);
}

function toPascalCase(s: string): string {
  return s
    .split(/[-_]/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join("");
}

/** 컴포넌트 이름 → ARIA role 매핑 (휴리스틱 — 명백한 case 만). */
function inferAriaRole(componentName: string): string | undefined {
  const lower = componentName.toLowerCase();
  const map: Record<string, string> = {
    button: "button",
    homebutton: "button",
    input: "textbox",
    label: "none",
    select: "combobox",
    slider: "slider",
    switch: "switch",
    dialog: "dialog",
    card: "group",
    sidebar: "navigation",
    link: "link",
    checkbox: "checkbox",
    radio: "radio",
  };
  return map[lower];
}
