import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { compileToReact } from "../compile";
import { verifyTsx } from "./utils/ts-verifier";

const SPEC_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "spec");
const fixtures = readdirSync(SPEC_DIR).filter((f) => f.endsWith(".spec.md"));

function toComponentName(filename: string): string {
  return basename(filename, ".spec.md")
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

describe("ts-diagnose — 28 fixtures must produce TS-clean TSX (Integration Test)", () => {
  it("found 28 fixtures", () => {
    expect(fixtures.length).toBe(28);
  });

  for (const file of fixtures) {
    it(`${file} — generated TSX has no critical TS diagnostics`, () => {
      const text = readFileSync(join(SPEC_DIR, file), "utf-8");
      const componentName = toComponentName(file);
      const result = compileToReact({ text, componentName });

      expect(result.ok, `compile error: ${result.errors.map((e) => e.message).join("; ")}`).toBe(true);
      const tsx = result.tsx ?? "";
      expect(tsx.length).toBeGreaterThan(0);

      const diag = verifyTsx(tsx);
      const messages = diag.diagnostics
        .map((d) => `[${d.category} ${d.code}${d.line ? ` L${d.line}` : ""}] ${d.message}`)
        .join("\n");
      expect(diag.ok, `TS diagnostics in ${file}:\n${messages}\n--- TSX ---\n${tsx}`).toBe(true);
    });
  }
});
