import { readFileSync } from "node:fs";
import { parse } from "./index";
import type { ParseResult } from "./ast-types";

export function parseFile(path: string): ParseResult {
  const text = readFileSync(path, "utf-8");
  return parse(text);
}
