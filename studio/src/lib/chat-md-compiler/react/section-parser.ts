import type { Block, Document, MarkdownText } from "../../chat-md/parser/ast-types";

export interface StateDecl {
  name: string;
  type: string;
  defaultValue: string;
}

export interface BehaviorSpec {
  states: StateDecl[];
  handlers: string[];
  rawUnknown: string[];
}

export interface VariantSpec {
  name: string;
  props: Record<string, string>;
}

export interface SectionResult {
  behavior: BehaviorSpec | null;
  variants: VariantSpec[] | null;
  bodyWithoutSections: Block[];
}

const BEHAVIOR_HEADING = /^##\s+Behavior/m;
const VARIANTS_HEADING = /^##\s+Variants/m;

// - state: name: Type = default
const STATE_RE = /^-\s+state:\s+(\w+):\s+(\w+)\s*=\s*(.+)$/;
// - handler: name
const HANDLER_RE = /^-\s+handler:\s+(\w+)$/;
// - VariantName: prop=value[, prop=value]*
const VARIANT_RE = /^-\s+(\w+):\s+(.+)$/;

export function extractSections(doc: Document): SectionResult {
  const behaviorBlocks: MarkdownText[] = [];
  const variantBlocks: MarkdownText[] = [];
  const bodyWithoutSections: Block[] = [];

  for (const block of doc.body) {
    if (block.type !== "MarkdownText") {
      bodyWithoutSections.push(block);
      continue;
    }
    const text = block.text;
    if (BEHAVIOR_HEADING.test(text)) {
      behaviorBlocks.push(block);
    } else if (VARIANTS_HEADING.test(text)) {
      variantBlocks.push(block);
    } else {
      bodyWithoutSections.push(block);
    }
  }

  const behavior = behaviorBlocks.length > 0
    ? parseBehavior(behaviorBlocks)
    : null;

  const variants = variantBlocks.length > 0
    ? parseVariants(variantBlocks)
    : null;

  return { behavior, variants, bodyWithoutSections };
}

function parseBehavior(blocks: MarkdownText[]): BehaviorSpec {
  const states: StateDecl[] = [];
  const handlers: string[] = [];
  const rawUnknown: string[] = [];

  for (const block of blocks) {
    const lines = block.text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("-")) continue;

      const stateMatch = trimmed.match(STATE_RE);
      if (stateMatch) {
        states.push({
          name: stateMatch[1],
          type: stateMatch[2],
          defaultValue: stateMatch[3].trim(),
        });
        continue;
      }

      const handlerMatch = trimmed.match(HANDLER_RE);
      if (handlerMatch) {
        handlers.push(handlerMatch[1]);
        continue;
      }

      // unrecognized bullet
      rawUnknown.push(trimmed.replace(/^-\s+/, ""));
    }
  }

  return { states, handlers, rawUnknown };
}

function parseVariants(blocks: MarkdownText[]): VariantSpec[] {
  const variants: VariantSpec[] = [];

  for (const block of blocks) {
    const lines = block.text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("-")) continue;

      const m = trimmed.match(VARIANT_RE);
      if (!m) continue;

      const name = m[1];
      const propStr = m[2];
      const props: Record<string, string> = {};
      for (const pair of propStr.split(",")) {
        const [k, v] = pair.trim().split("=");
        if (k && v !== undefined) props[k.trim()] = v.trim();
      }
      variants.push({ name, props });
    }
  }

  return variants.length > 0 ? variants : null!;
}
