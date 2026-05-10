export type FigmaNodeType =
  | "FRAME"
  | "COMPONENT"
  | "INSTANCE"
  | "TEXT"
  | "RECTANGLE"
  | "GROUP"
  | "VECTOR";

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaFill {
  type: "SOLID" | "IMAGE" | "GRADIENT_LINEAR" | string;
  color?: FigmaColor;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: FigmaNodeType;
  children?: FigmaNode[];
  fills?: FigmaFill[];
  style?: Record<string, string | number>;
}
