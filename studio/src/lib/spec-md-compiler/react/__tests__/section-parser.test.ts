import { describe, it, expect } from "vitest";
import { extractSections } from "../section-parser";
import type { Document, MarkdownText } from "../../../spec-md/parser/ast-types";

const loc = { line: 1, col: 1, offset: 0, length: 0 };

function md(text: string): MarkdownText {
  return { type: "MarkdownText", text, location: loc };
}

function doc(...texts: string[]): Document {
  return { type: "Document", body: texts.map(md) };
}

describe("extractSections", () => {
  it("parses a single state declaration", () => {
    const d = doc("## Behavior\n- state: count: number = 0");
    const result = extractSections(d);
    expect(result.behavior?.states).toEqual([
      { name: "count", type: "number", defaultValue: "0" },
    ]);
    expect(result.behavior?.handlers).toEqual([]);
  });

  it("parses a single handler declaration", () => {
    const d = doc("## Behavior\n- handler: handleSubmit");
    const result = extractSections(d);
    expect(result.behavior?.handlers).toEqual(["handleSubmit"]);
    expect(result.behavior?.states).toEqual([]);
  });

  it("parses mixed state and handler declarations", () => {
    const d = doc("## Behavior\n- state: open: boolean = false\n- handler: onToggle\n- handler: onClose");
    const result = extractSections(d);
    expect(result.behavior?.states).toEqual([{ name: "open", type: "boolean", defaultValue: "false" }]);
    expect(result.behavior?.handlers).toEqual(["onToggle", "onClose"]);
  });

  it("puts unrecognized lines into rawUnknown", () => {
    const d = doc("## Behavior\n- fetchData on mount\n- something else");
    const result = extractSections(d);
    expect(result.behavior?.rawUnknown).toEqual([
      "fetchData on mount",
      "something else",
    ]);
  });

  it("parses a single variant with one prop", () => {
    const d = doc("## Variants\n- Primary: variant=primary");
    const result = extractSections(d);
    expect(result.variants).toEqual([
      { name: "Primary", props: { variant: "primary" } },
    ]);
  });

  it("parses a variant with multiple props", () => {
    const d = doc("## Variants\n- LargePrimary: variant=primary, size=lg");
    const result = extractSections(d);
    expect(result.variants).toEqual([
      { name: "LargePrimary", props: { variant: "primary", size: "lg" } },
    ]);
  });

  it("returns null behavior when section absent", () => {
    const d = doc("Just some text without sections");
    expect(extractSections(d).behavior).toBeNull();
  });

  it("returns null variants when section absent", () => {
    const d = doc("Just some text without sections");
    expect(extractSections(d).variants).toBeNull();
  });

  it("bodyWithoutSections excludes section MarkdownText blocks", () => {
    const d: Document = {
      type: "Document",
      body: [
        md("## Behavior\n- state: x: number = 0"),
        md("## Variants\n- A: variant=a"),
        { type: "ComponentInstance", name: "Button", props: {}, children: [], location: loc },
      ],
    };
    const result = extractSections(d);
    expect(result.bodyWithoutSections).toHaveLength(1);
    expect(result.bodyWithoutSections[0].type).toBe("ComponentInstance");
  });
});
