import ts from "typescript";

export interface VerifyResult {
  ok: boolean;
  diagnostics: { code: number; category: string; message: string; line?: number }[];
}

/**
 * 생성된 TSX 의 syntactic + 핵심 semantic 진단.
 *
 * 외부 모듈 (`react`, `@/components/...`) 은 해소하지 않음 (`noResolve: true`).
 * 미해소 import 자체는 critical 이 아님 — syntax error, JSX malformed,
 * duplicate identifier (C9) 등 컴파일러 정합성 문제만 잡음.
 *
 * `ts.transpileModule` 가 syntax/JSX 진단을 제공.
 * Duplicate identifier 는 createSourceFile + statement scan 으로 별도 확인.
 */
export function verifyTsx(tsx: string): VerifyResult {
  const diagnostics: VerifyResult["diagnostics"] = [];

  const tr = ts.transpileModule(tsx, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      noResolve: true,
      isolatedModules: true,
      esModuleInterop: true,
      strict: false,
    },
    reportDiagnostics: true,
  });

  for (const d of tr.diagnostics ?? []) {
    if (isBenign(d)) continue;
    diagnostics.push(toDiag(d));
  }

  // Duplicate identifier — function name vs import (C9 regression guard).
  const sf = ts.createSourceFile("__virtual__.tsx", tsx, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const declaredNames = new Set<string>();
  for (const stmt of sf.statements) {
    if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      const n = stmt.name.text;
      if (declaredNames.has(n)) {
        diagnostics.push({
          code: 9001,
          category: "error",
          message: `Duplicate identifier '${n}' (function declared more than once)`,
        });
      }
      declaredNames.add(n);
    }
    if (ts.isImportDeclaration(stmt) && stmt.importClause?.namedBindings && ts.isNamedImports(stmt.importClause.namedBindings)) {
      for (const el of stmt.importClause.namedBindings.elements) {
        const n = el.name.text;
        if (declaredNames.has(n)) {
          diagnostics.push({
            code: 9001,
            category: "error",
            message: `Duplicate identifier '${n}' (declared by both function and import)`,
          });
        }
        declaredNames.add(n);
      }
    }
  }

  return { ok: diagnostics.length === 0, diagnostics };
}

function isBenign(d: ts.Diagnostic): boolean {
  // module-resolution 관련 진단은 noResolve 모드에서 발생 — benign.
  return d.code === 2307 /* Cannot find module */
    || d.code === 2304 /* Cannot find name (often runtime ambient) */
    || d.code === 2769 /* No overload matches (semantic, not syntax) */;
}

function toDiag(d: ts.Diagnostic): VerifyResult["diagnostics"][number] {
  const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
  let line: number | undefined;
  if (d.file && d.start !== undefined) {
    line = d.file.getLineAndCharacterOfPosition(d.start).line + 1;
  }
  return { code: d.code, category: ts.DiagnosticCategory[d.category].toLowerCase(), message, line };
}
