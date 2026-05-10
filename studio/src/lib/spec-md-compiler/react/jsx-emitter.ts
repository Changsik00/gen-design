import type {
  Block,
  ComponentInstance,
  Document,
  AttrValue,
  Placeholder,
} from "../../spec-md/parser/ast-types";

export interface EmitContext {
  usedI18nKeys: Set<string>;
  usedTokenKeys: Set<string>;
  knownComponents: Set<string>;
}

export function emitJSX(node: Block, indent: number, ctx: EmitContext): string {
  const pad = "  ".repeat(indent);
  switch (node.type) {
    case "ComponentInstance":
      return emitComponent(node, indent, ctx);
    case "Placeholder":
      return emitPlaceholder(node, ctx);
    case "MarkdownText":
      return `${pad}{/* ${node.text} */}`;
    case "Comment":
      return `${pad}{/* ${node.text} */}`;
  }
}

export function emitDocument(doc: Document, ctx: EmitContext): string {
  return doc.body.map((node) => emitJSX(node, 0, ctx)).join("\n");
}

function emitComponent(
  node: ComponentInstance,
  indent: number,
  ctx: EmitContext
): string {
  const pad = "  ".repeat(indent);
  const attrs = buildAttrs(node, ctx);
  const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";

  if (node.children.length === 0) {
    return `${pad}<${node.name}${attrStr} />`;
  }

  const childPad = "  ".repeat(indent + 1);
  const children = node.children
    .map((c) => {
      const raw = emitJSX(c, indent + 1, ctx);
      // emitJSX for non-component nodes doesn't add pad; add it here
      if (c.type === "ComponentInstance") return raw;
      return `${childPad}${raw.trimStart()}`;
    })
    .join("\n");

  return `${pad}<${node.name}${attrStr}>\n${children}\n${pad}</${node.name}>`;
}

function buildAttrs(node: ComponentInstance, ctx: EmitContext): string[] {
  const parts: string[] = [];

  // theme → data-theme (before props for stable order)
  if (node.theme !== undefined) {
    parts.push(`data-theme="${node.theme}"`);
  }

  // props sorted alphabetically for determinism
  const propKeys = Object.keys(node.props).sort();
  for (const key of propKeys) {
    parts.push(emitAttr(key, node.props[key], ctx));
  }

  // tokens → style object
  if (node.tokens && Object.keys(node.tokens).length > 0) {
    const entries = Object.keys(node.tokens)
      .sort()
      .map((k) => `"${k}": "${node.tokens![k]}"`)
      .join(", ");
    parts.push(`style={{ ${entries} }}`);
  }

  return parts;
}

function emitAttr(key: string, value: AttrValue, ctx: EmitContext): string {
  if (value === null) return `${key}={null}`;
  if (typeof value === "string") return `${key}="${value}"`;
  if (typeof value === "number") return `${key}={${value}}`;
  if (typeof value === "boolean") return `${key}={${value}}`;
  if (typeof value === "object" && !Array.isArray(value) && "type" in value) {
    const ph = value as Placeholder;
    return `${key}=${emitPlaceholder(ph, ctx)}`;
  }
  return `${key}={${JSON.stringify(value)}}`;
}

function emitPlaceholder(node: Placeholder, ctx: EmitContext): string {
  if (node.kind === "i18n") {
    ctx.usedI18nKeys.add(node.path);
    return `{t("${node.path}")}`;
  }
  ctx.usedTokenKeys.add(node.path);
  return `{tokens["${node.path}"]}`;
}
