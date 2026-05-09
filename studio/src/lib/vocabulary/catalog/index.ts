/**
 * 3-tier 어휘 카탈로그 빌더.
 *
 * Tier 1 — ARIA 1.3 roles (정적, 78 role)
 * Tier 2 — shadcn primitives (`studio/src/components/ui/`)
 * Tier 3 — 프로젝트 composites (`composites/`) + templates (`templates/`)
 *
 * 본 모듈이 spec.md grammar / Paper compiler / React compiler / lint 모두의 ground.
 * 결정성 (deterministic) 보장 — 같은 코드 → 같은 catalog.json.
 *
 * ADR-004 D-2 의 자동 추출 파이프라인 핵심.
 */

import * as path from "node:path";
import { extractFromDirectory, type ExtractedComponent } from "../extractor";
import { ARIA_ROLES, ARIA_SPEC_META, type AriaRole } from "./tier1-aria";

export interface VocabularyCatalog {
  /** Catalog 형식 버전. */
  version: string;
  /** 생성 시각 (deterministic test 시 고정). */
  generatedAt?: string;
  tiers: {
    tier1Aria: {
      specMeta: typeof ARIA_SPEC_META;
      roles: AriaRole[];
    };
    tier2Shadcn: {
      directory: string;
      components: ExtractedComponent[];
    };
    tier3Project: {
      composites: ExtractedComponent[];
      templates: ExtractedComponent[];
    };
  };
}

export interface BuildCatalogOptions {
  /** studio 의 src 절대/상대 경로 (e.g. "src" 또는 "/abs/path/studio/src"). */
  studioSrcRoot: string;
  /** Deterministic 테스트용 — generatedAt 고정. */
  generatedAt?: string;
}

/**
 * 3-tier 카탈로그를 빌드한다.
 *
 * - Tier 1: ARIA_ROLES 정적
 * - Tier 2: studio/src/components/ui/ 스캔
 * - Tier 3: composites/ + templates/ 스캔
 */
export function buildCatalog(options: BuildCatalogOptions): VocabularyCatalog {
  const { studioSrcRoot, generatedAt } = options;
  const uiDir = path.join(studioSrcRoot, "components", "ui");
  const compositesDir = path.join(studioSrcRoot, "components", "composites");
  const templatesDir = path.join(studioSrcRoot, "components", "templates");

  const tier2 = sortByName(extractFromDirectory(uiDir));
  const tier3Composites = sortByName(extractFromDirectory(compositesDir));
  const tier3Templates = sortByName(extractFromDirectory(templatesDir));

  return {
    version: "1",
    generatedAt,
    tiers: {
      tier1Aria: {
        specMeta: ARIA_SPEC_META,
        roles: ARIA_ROLES,
      },
      tier2Shadcn: {
        directory: relPath(uiDir, studioSrcRoot),
        components: tier2,
      },
      tier3Project: {
        composites: tier3Composites,
        templates: tier3Templates,
      },
    },
  };
}

/** name → ExtractedComponent lookup (Tier 2 + Tier 3 통합). */
export function buildLookup(catalog: VocabularyCatalog): Map<string, ExtractedComponent> {
  const lookup = new Map<string, ExtractedComponent>();
  for (const c of catalog.tiers.tier2Shadcn.components) lookup.set(c.name, c);
  for (const c of catalog.tiers.tier3Project.composites) lookup.set(c.name, c);
  for (const c of catalog.tiers.tier3Project.templates) lookup.set(c.name, c);
  return lookup;
}

/** 카탈로그의 모든 컴포넌트 이름 (Tier 2 + Tier 3). */
export function allComponentNames(catalog: VocabularyCatalog): string[] {
  const names: string[] = [];
  names.push(...catalog.tiers.tier2Shadcn.components.map((c) => c.name));
  names.push(...catalog.tiers.tier3Project.composites.map((c) => c.name));
  names.push(...catalog.tiers.tier3Project.templates.map((c) => c.name));
  return names.sort();
}

function sortByName(arr: ExtractedComponent[]): ExtractedComponent[] {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name));
}

function relPath(absOrRel: string, root: string): string {
  if (absOrRel.startsWith(root)) return absOrRel.slice(root.length).replace(/^\//, "");
  return absOrRel;
}

export type { ExtractedComponent } from "../extractor";
export { ARIA_ROLES, ARIA_BY_NAME, isAriaRole } from "./tier1-aria";
