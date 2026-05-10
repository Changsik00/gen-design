import { readFileSync } from "node:fs";
import { adaptFigma } from "../adapt";
import type { FigmaNode } from "../figma-types";
import type { CatalogMap } from "../../paper-inference/ast-builder";

function main(): void {
  const args = process.argv.slice(2);
  const fixturePath = args[0];

  if (!fixturePath) {
    process.stderr.write("Usage: figma-adapt <fixture.json> [--catalog=<catalog.json>]\n");
    process.exit(1);
  }

  let figmaNode: FigmaNode;
  try {
    figmaNode = JSON.parse(readFileSync(fixturePath, "utf-8")) as FigmaNode;
  } catch (e) {
    process.stderr.write(`Error reading fixture: ${(e as Error).message}\n`);
    process.exit(1);
  }

  const catalogArg = args.find((a) => a.startsWith("--catalog="));
  const catalog: CatalogMap = new Map();
  if (catalogArg) {
    try {
      const raw = JSON.parse(readFileSync(catalogArg.slice(10), "utf-8")) as Record<string, { name: string; values: string[] }[]>;
      for (const [name, axes] of Object.entries(raw)) {
        catalog.set(name, axes);
      }
    } catch (e) {
      process.stderr.write(`Error reading catalog: ${(e as Error).message}\n`);
    }
  }

  const result = adaptFigma(figmaNode, catalog);

  process.stdout.write(result.text);

  const report = {
    total: result.report.total,
    matched: result.report.confident.length + result.report.confirm.length,
    lowConfidence: result.report.confirm.map((m) => m.paperId),
    unmatched: result.report.unknown.map((m) => m.paperId),
  };
  process.stderr.write(JSON.stringify(report, null, 2) + "\n");
}

if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))
) {
  main();
}
