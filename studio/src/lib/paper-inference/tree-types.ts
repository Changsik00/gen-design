import type { IdentityRef } from "./identity";

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
  /**
   * spec-08-05 — paper-import 가 layer name 에서 [chat:type/slug] 마커 추출 시 채움.
   * 신규 입력 (raw Paper MCP 결과) 에는 부재. enrichWithIdentity() 가 채움.
   */
  identity?: IdentityRef;
}
