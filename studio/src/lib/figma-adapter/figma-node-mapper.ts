import type { FigmaNode, FigmaNodeType } from "./figma-types";
import type { PaperTreeNode, PaperFill } from "../paper-inference/tree-types";

const FIGMA_TO_PAPER: Record<FigmaNodeType, string> = {
  FRAME: "Frame",
  COMPONENT: "Frame",
  INSTANCE: "Frame",
  GROUP: "Group",
  TEXT: "Text",
  RECTANGLE: "Rectangle",
  VECTOR: "Rectangle",
};

export function normalizeLayerName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const segments = trimmed.split("/");
  const [first, ...rest] = segments;
  return [first, ...rest.map((s) => s.toLowerCase())].join(".");
}

export function mapFigmaNode(node: FigmaNode): PaperTreeNode {
  const fills: PaperFill[] = (node.fills ?? [])
    .filter((f) => f.type === "SOLID" && f.color)
    .map((f) => {
      const c = f.color!;
      const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
      return { type: "color" as const, color: `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}` };
    });

  return {
    id: node.id,
    name: normalizeLayerName(node.name),
    component: FIGMA_TO_PAPER[node.type] ?? "Frame",
    styles: node.style
      ? Object.fromEntries(Object.entries(node.style).map(([k, v]) => [k, String(v)]))
      : undefined,
    fills: fills.length ? fills : undefined,
    children: node.children?.map(mapFigmaNode),
  };
}
