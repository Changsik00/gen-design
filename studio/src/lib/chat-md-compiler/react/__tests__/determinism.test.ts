import { describe, it, expect, afterAll } from "vitest";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { createHash } from "node:crypto";
import { compileToReact } from "../compile";

const SPEC_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "spec");
const fixtures = readdirSync(SPEC_DIR).filter((f) => f.endsWith(".spec.md"));

interface FixtureResult {
  fixture: string;
  pass: boolean;
  reason?: string;
}

const results: FixtureResult[] = [];

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function toComponentName(filename: string): string {
  return basename(filename, ".spec.md")
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

describe("spec-react determinism benchmark — 28 fixtures", () => {
  for (const file of fixtures) {
    it(`${file} — two runs produce identical output`, () => {
      const text = readFileSync(join(SPEC_DIR, file), "utf-8");
      const componentName = toComponentName(file);

      const r1 = compileToReact({ text, componentName });
      const r2 = compileToReact({ text, componentName });

      if (!r1.ok || !r2.ok) {
        results.push({ fixture: file, pass: false, reason: "compile error" });
        expect(r1.ok, `first run failed: ${r1.errors.map((e) => e.message).join(", ")}`).toBe(true);
        return;
      }

      const hash1 = sha256(r1.tsx!);
      const hash2 = sha256(r2.tsx!);
      const pass = hash1 === hash2;
      results.push({ fixture: file, pass, reason: pass ? undefined : "hash mismatch" });
      expect(hash1).toBe(hash2);
    });
  }

  afterAll(() => {
    const passed = results.filter((r) => r.pass).length;
    const total = results.length;
    const lines = [
      "# spec-react Determinism Report",
      "",
      `**Fixtures**: ${total}`,
      `**Deterministic**: ${passed}/${total}`,
      `**Result**: ${passed === total ? "✓ PASS" : "✗ FAIL"}`,
      "",
      "## Per-fixture Results",
      "",
      "| Fixture | Result | Note |",
      "|---|:---:|---|",
      ...results.map(
        (r) => `| ${r.fixture} | ${r.pass ? "✅ PASS" : "❌ FAIL"} | ${r.reason ?? ""} |`
      ),
    ];
    writeFileSync(
      join(__dirname, "..", "..", "..", "..", "..", "..", "react-compile-report.md"),
      lines.join("\n")
    );
  });
});
