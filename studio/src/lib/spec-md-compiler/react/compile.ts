import { parse } from "../../spec-md/parser";
import type { Document, ParseError } from "../../spec-md/parser/ast-types";
import { registeredNames } from "../paper/component-registry";
import { emitDocument, type EmitContext } from "./jsx-emitter";
import { extractSections } from "./section-parser";
import { emitHooks } from "./behavior-emitter";
import { emitVariants } from "./variant-emitter";
import { buildImports } from "./imports-builder";
import { toRegistryEntry, type RegistryEntry } from "./registry-writer";

export interface CompileInput {
  text?: string;
  ast?: Document;
  componentName: string;
}

export interface CompileError {
  message: string;
  stage: "parse" | "compile";
}

export interface CompileResult {
  ok: boolean;
  tsx?: string;
  registry?: RegistryEntry;
  errors: CompileError[];
}

export function compileToReact(input: CompileInput): CompileResult {
  let doc: Document;

  if (input.ast) {
    doc = input.ast;
  } else if (input.text !== undefined) {
    const parsed = parse(input.text);
    if (!parsed.ok || !parsed.ast) {
      return {
        ok: false,
        errors: (parsed.errors as ParseError[]).map((e) => ({
          message: e.message,
          stage: "parse",
        })),
      };
    }
    doc = parsed.ast;
  } else {
    return { ok: false, errors: [{ message: "No input provided", stage: "compile" }] };
  }

  const knownComponents = new Set(registeredNames());
  const ctx: EmitContext = {
    usedI18nKeys: new Set(),
    usedTokenKeys: new Set(),
    knownComponents,
  };

  const { behavior, variants, bodyWithoutSections } = extractSections(doc);
  const bodyDoc = { ...doc, body: bodyWithoutSections };

  const jsxBody = emitDocument(bodyDoc, ctx);
  const hookLines = behavior ? emitHooks(behavior) : "";
  const variantBlock = variants ? emitVariants(variants, input.componentName) : "";

  const usedComponents = [...knownComponents].filter((name) =>
    jsxBody.includes(`<${name}`) || (variantBlock && variantBlock.includes(`<${name}`))
  );

  const needsUseState = hookLines.includes("useState");
  const reactImports = needsUseState ? "import { useState } from 'react';" : "import React from 'react';";
  const importBlock = buildImports(ctx, usedComponents);

  const bodyContent = [hookLines, jsxBody].filter(Boolean).join("\n  ");

  const functionBody = [
    `${reactImports}`,
    importBlock,
    "",
    `export function ${input.componentName}() {`,
    `  ${bodyContent.split("\n").join("\n  ")}`,
    `  return (`,
    `    <>`,
    jsxBody
      .split("\n")
      .map((l) => `      ${l}`)
      .join("\n"),
    `    </>`,
    `  );`,
    `}`,
  ]
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");

  const tsx = variantBlock ? `${functionBody}\n\n${variantBlock}` : functionBody;

  const registry = toRegistryEntry(input.componentName, tsx, usedComponents);

  return { ok: true, tsx, registry, errors: [] };
}
