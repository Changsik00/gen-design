/**
 * 추출 plugin 인터페이스 — cva 외 패턴 (data-state attribute, render prop, slot,
 * tw-variants 등) 의 향후 확장 포인트.
 *
 * 본 spec (7-01) 은 cva plugin 만 구현. 다른 plugin 은 phase-7 후반 또는
 * phase-8 의 별도 spec.
 *
 * ADR-004 NFR-1: 추출기는 plugin 가능 설계.
 */

import type * as ts from "typescript";

export interface ExtractedAxis {
  /** axis 이름 — variant / size / tone / 자체 추가 axis. */
  name: string;
  /** axis 의 enum 값 목록. cva variants 객체의 키. */
  values: string[];
}

export interface ExtractedComponent {
  /** PascalCase 컴포넌트 이름. */
  name: string;
  /** 절대 또는 프로젝트-상대 경로. */
  filePath: string;
  /** 추출된 axes (variant / size / 추가 axis 들). */
  axes: ExtractedAxis[];
  /** defaultVariants 매핑 — axisName → default value. */
  defaultVariants: Record<string, string>;
  /** ARIA role 매핑 (가능 시 추론). */
  ariaRole?: string;
  /** plugin 이 식별한 패턴 종류. */
  pattern: "cva" | "data-state" | "render-prop" | "slot" | "tw-variants" | "manual";
}

export interface ExtractorPlugin {
  /** plugin 이름 — log/디버깅용. */
  name: string;
  /** 본 plugin 이 처리할 수 있는 SourceFile 인지 미리 판별 (false 면 walk skip). */
  matches: (sourceFile: ts.SourceFile) => boolean;
  /** 실제 추출 — SourceFile → ExtractedComponent[]. */
  extract: (sourceFile: ts.SourceFile, filePath: string) => ExtractedComponent[];
}
