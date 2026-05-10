import { describe, it, expect } from "vitest";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { parse } from "../index";
import { parseFile } from "../node";
import type { ComponentInstance, Placeholder } from "../ast-types";

describe("parse() — public API 결과 envelope", () => {
  it("성공 시 { ok: true, ast, errors: [] }", () => {
    const r = parse("<Login />");
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
    expect(r.ast?.type).toBe("Document");
    const c = r.ast!.body[0] as ComponentInstance;
    expect(c.name).toBe("Login");
  });

  it("실패 시 { ok: false, errors: [...] }", () => {
    const r = parse("<A>foo</B>");
    expect(r.ok).toBe(false);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].stage).toBe("parse");
    expect(r.errors[0].message).toMatch(/Mismatched closing tag/);
  });

  it("parse error 의 location (line/col/offset)", () => {
    const r = parse("Hello\nworld\n{{xxx.foo}}");
    expect(r.ok).toBe(false);
    const err = r.errors[0];
    // 3 번째 줄에서 실패
    expect(err.location.line).toBe(3);
    expect(err.location.col).toBeGreaterThan(0);
  });
});

describe("parse() — 결정성 (deterministic)", () => {
  it("같은 입력 → 같은 AST (deep equal)", () => {
    const text = '<Card variant="primary"><Button label={{i18n.x}} /></Card>';
    const a = parse(text);
    const b = parse(text);
    expect(a).toEqual(b);
  });
});

describe("parse() — SourceLocation 정확도", () => {
  it("placeholder 의 line/col/offset/length", () => {
    const text = "before {{i18n.x}} after";
    const r = parse(text);
    expect(r.ok).toBe(true);
    const ph = r.ast!.body[1] as Placeholder;
    expect(ph.location.line).toBe(1);
    expect(ph.location.col).toBe(8);
    expect(ph.location.offset).toBe(7);
    expect(ph.location.length).toBe(10);
  });

  it("multi-line 의 line 추적", () => {
    const text = "line1\nline2\n<Button />";
    const r = parse(text);
    expect(r.ok).toBe(true);
    const c = r.ast!.body[1] as ComponentInstance; // body[0] is the markdown text
    expect(c.location.line).toBe(3);
  });
});

describe("parseFile() — 파일 입력", () => {
  it("임시 파일 → 동일 AST", () => {
    const dir = mkdtempSync(join(tmpdir(), "spec-md-test-"));
    try {
      const file = join(dir, "fixture.spec.md");
      writeFileSync(file, "<Login />\n", "utf-8");
      const r = parseFile(file);
      expect(r.ok).toBe(true);
      expect((r.ast!.body[0] as ComponentInstance).name).toBe("Login");
    } finally {
      rmSync(dir, { recursive: true });
    }
  });
});
