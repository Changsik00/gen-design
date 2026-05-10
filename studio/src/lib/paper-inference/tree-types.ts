export interface PaperFill {
  type: "image" | "color";
  src?: string;
  color?: string;
}

export interface PaperTreeNode {
  id: string;
  /** Layer name — e.g. "Button.primary.lg" (naming convention per spec-7-04 Task 2). */
  name: string;
  /** Paper component type: "Frame" | "Text" | "Rectangle" | "Group" | etc. */
  component: string;
  styles?: Record<string, string>;
  fills?: PaperFill[];
  children?: PaperTreeNode[];
}
