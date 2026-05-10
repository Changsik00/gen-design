import { describe, it, expect } from "vitest";
import { parser } from "../../grammar";
import type { Document, ComponentInstance, Placeholder } from "../ast-types";

function parse(text: string): Document {
  return parser.parse(text) as Document;
}
function first(text: string): ComponentInstance {
  return parse(text).body[0] as ComponentInstance;
}

describe("attributes — String literal", () => {
  it('attr="value" double-quoted', () => {
    const c = first('<Button variant="primary" />');
    expect(c.props.variant).toBe("primary");
  });

  it("attr='value' single-quoted", () => {
    const c = first("<Button variant='primary' />");
    expect(c.props.variant).toBe("primary");
  });

  it("multiple string attrs", () => {
    const c = first('<Button variant="primary" size="lg" />');
    expect(c.props.variant).toBe("primary");
    expect(c.props.size).toBe("lg");
  });

  it("kebab-case attr names + dashed values", () => {
    const c = first('<Button data-test="login-btn" />');
    expect(c.props["data-test"]).toBe("login-btn");
  });

  it("escaped quote in string", () => {
    const c = first('<Button label="say \\"hi\\"" />');
    expect(c.props.label).toBe('say "hi"');
  });
});

describe("attributes — JSON literal", () => {
  it("attr={42} number", () => {
    const c = first("<Button count={42} />");
    expect(c.props.count).toBe(42);
  });

  it("attr={true} boolean", () => {
    const c = first("<Button disabled={true} />");
    expect(c.props.disabled).toBe(true);
  });

  it("attr={null} null", () => {
    const c = first("<Button onClick={null} />");
    expect(c.props.onClick).toBeNull();
  });

  it("negative + decimal number", () => {
    const c = first("<Slider min={-1.5} max={3.14} />");
    expect(c.props.min).toBe(-1.5);
    expect(c.props.max).toBeCloseTo(3.14);
  });
});

describe("attributes — JSON object / array", () => {
  it("attr={{ \"a\": \"b\" }} object", () => {
    const c = first('<Card meta={{ "a": "b" }} />');
    expect(c.props.meta).toEqual({ a: "b" });
  });

  it("attr={[\"a\", \"b\"]} array", () => {
    const c = first('<Tabs items={["a", "b"]} />');
    expect(c.props.items).toEqual(["a", "b"]);
  });

  it("nested object", () => {
    const c = first('<Card meta={{ "x": { "y": 1 } }} />');
    expect(c.props.meta).toEqual({ x: { y: 1 } });
  });
});

describe("attributes — Placeholder value", () => {
  it("attr={{i18n.path}}", () => {
    const c = first("<Login label={{i18n.ko.login}} />");
    const v = c.props.label as Placeholder;
    expect(v.type).toBe("Placeholder");
    expect(v.kind).toBe("i18n");
    expect(v.path).toBe("ko.login");
  });

  it("attr={{token.path}}", () => {
    const c = first("<Card color={{token.semantic.brand-2}} />");
    const v = c.props.color as Placeholder;
    expect(v.kind).toBe("token");
  });
});

describe("attributes — theme / tokens 분리 저장", () => {
  it('theme="brand-a" → ComponentInstance.theme', () => {
    const c = first('<Card theme="brand-a" />');
    expect(c.theme).toBe("brand-a");
    expect(c.props.theme).toBeUndefined();
  });

  it('tokens={{ "--primary": "..." }} → ComponentInstance.tokens', () => {
    const c = first('<Card tokens={{ "--primary": "{{token.brand-2}}" }} />');
    expect(c.tokens).toEqual({ "--primary": "{{token.brand-2}}" });
    expect(c.props.tokens).toBeUndefined();
  });
});

describe("attributes — 혼합 + paired tag", () => {
  it("4 layer attrs 동시: variant + size + theme + tokens", () => {
    const c = first(
      '<Button variant="primary" size="lg" theme="brand-a" tokens={{ "--primary": "x" }} />'
    );
    expect(c.props.variant).toBe("primary");
    expect(c.props.size).toBe("lg");
    expect(c.theme).toBe("brand-a");
    expect(c.tokens).toEqual({ "--primary": "x" });
  });

  it("paired tag with attrs + children", () => {
    const c = first('<Login variant="default">{{i18n.ko.login}}</Login>');
    expect(c.name).toBe("Login");
    expect(c.props.variant).toBe("default");
    expect(c.children).toHaveLength(1);
    expect((c.children[0] as Placeholder).path).toBe("ko.login");
  });

  it("multi-line attrs", () => {
    const c = first(
      `<Button
         variant="primary"
         size="lg"
       />`
    );
    expect(c.props.variant).toBe("primary");
    expect(c.props.size).toBe("lg");
  });
});
