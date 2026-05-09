/**
 * Tier 1 — ARIA 1.3 role 어휘 (정적).
 *
 * ADR-004 D-2, D-5 의 *최저층 어휘* 로서 a11y 자동 정합의 ground.
 * spec.md 작성 어휘 / Paper 노드 매핑 / React 출력 모두 본 데이터 참조.
 *
 * 출처: data/aria-roles.json (W3C ARIA 1.3 editor's draft 2025-08).
 * shadcn 컴포넌트의 ariaRole 매핑 reference 로도 사용.
 */

import ariaData from "../../../../../data/aria-roles.json";

export interface AriaRole {
  name: string;
  description: string;
  category: AriaCategory;
}

export type AriaCategory =
  | "abstract"
  | "widget"
  | "composite"
  | "documentStructure"
  | "landmark"
  | "liveRegion"
  | "windowLike";

interface AriaSourceCategory {
  [category: string]: Array<{ name: string; description: string }> | undefined;
}

interface AriaSource {
  specVersion?: string;
  source?: string;
  categories: AriaSourceCategory;
}

const source = ariaData as unknown as AriaSource;

/** 평탄화된 모든 ARIA role. category 별로 분류된 메타 포함. */
export const ARIA_ROLES: AriaRole[] = (() => {
  const flat: AriaRole[] = [];
  for (const [category, list] of Object.entries(source.categories ?? {})) {
    if (!Array.isArray(list)) continue;
    for (const role of list) {
      flat.push({
        name: role.name,
        description: role.description,
        category: category as AriaCategory,
      });
    }
  }
  return flat;
})();

/** name → AriaRole lookup. O(1) 조회. */
export const ARIA_BY_NAME: Map<string, AriaRole> = new Map(
  ARIA_ROLES.map((role) => [role.name, role]),
);

/** 등록된 ARIA role 인지 검증. */
export function isAriaRole(name: string): boolean {
  return ARIA_BY_NAME.has(name);
}

/** 특정 category 의 role 만 반환. */
export function ariaRolesByCategory(category: AriaCategory): AriaRole[] {
  return ARIA_ROLES.filter((role) => role.category === category);
}

/** ARIA spec 메타 (version, source URL). */
export const ARIA_SPEC_META = {
  version: source.specVersion ?? "ARIA 1.3",
  source: source.source ?? "https://w3c.github.io/aria/",
} as const;
