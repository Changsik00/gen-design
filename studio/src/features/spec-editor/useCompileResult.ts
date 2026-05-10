import { useState, useEffect, type ReactNode } from "react";
import { parse } from "@/lib/chat-md/parser";
import { buildReactTree } from "@/lib/chat-md-compiler/paper/react-builder";
import { compileToPaper } from "@/lib/chat-md-compiler/paper/compile";
import { compileToReact } from "@/lib/chat-md-compiler/react/compile";
import { COMPONENT_REGISTRY } from "@/lib/chat-md-compiler/paper/component-registry";
import koBundle from "@/i18n/ko.json";

export interface CompileResult {
  reactTree: ReactNode[];
  paperHtml: string;
  tsxContent: string;
  errors: string[];
}

const EMPTY: CompileResult = {
  reactTree: [],
  paperHtml: "",
  tsxContent: "",
  errors: [],
};

function compile(text: string): CompileResult {
  if (!text.trim()) return EMPTY;

  const errors: string[] = [];

  const parsed = parse(text);
  if (!parsed.ok || !parsed.ast) {
    return {
      ...EMPTY,
      errors: parsed.errors.map((e) => `[parse] ${e.message}`),
    };
  }

  const reactTree = buildReactTree(parsed.ast, {
    registry: COMPONENT_REGISTRY,
    bundle: koBundle,
  });

  const paperResult = compileToPaper(text);
  if (paperResult.errors?.length) {
    errors.push(...paperResult.errors.map((e) => `[paper] ${e.message}`));
  }

  const reactResult = compileToReact({ ast: parsed.ast, componentName: "SpecPreview" });
  if (!reactResult.ok) {
    errors.push(...reactResult.errors.map((e) => `[react] ${e.message}`));
  }

  return {
    reactTree,
    paperHtml: paperResult.html ?? "",
    tsxContent: reactResult.tsx ?? "",
    errors,
  };
}

export function useCompileResult(text: string, debounceMs = 300): CompileResult {
  const [result, setResult] = useState<CompileResult>(EMPTY);

  useEffect(() => {
    if (!text.trim()) {
      setResult(EMPTY);
      return;
    }
    const id = setTimeout(() => {
      setResult(compile(text));
    }, debounceMs);
    return () => clearTimeout(id);
  }, [text, debounceMs]);

  return result;
}
