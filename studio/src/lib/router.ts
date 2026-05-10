/**
 * Studio hash-based router.
 *
 * URL `#/path` ↔ StudioRoute enum 변환.
 * 외부 의존성 0 — Studio 의 단순 route 에 적합. 향후 nested / dynamic
 * params 필요 시 react-router 도입 검토.
 *
 * spec-7-06: spec/new/design 라우트 추가. blueprint/editor/preview 는
 * backward-compat redirect 로 유지.
 */

import { useEffect, useState } from "react";

export type StudioRoute =
  | "spec"
  | "new"
  | "design"
  | "tokens"
  | "export"
  | "playground"
  // legacy — redirect 대상으로만 존재, NAV 에는 미노출
  | "blueprint"
  | "editor"
  | "preview";

export const ROUTE_PATHS: Record<StudioRoute, string> = {
  spec: "/spec",
  new: "/new",
  design: "/design",
  tokens: "/tokens",
  export: "/export",
  playground: "/__playground",
  // legacy paths (redirect 용)
  blueprint: "/blueprint",
  editor: "/editor",
  preview: "/preview",
};

// 구 경로 → 새 경로 redirect 맵
const REDIRECTS: Partial<Record<StudioRoute, StudioRoute>> = {
  blueprint: "new",
  editor: "design",
  preview: "spec",
};

const PATH_TO_ROUTE: ReadonlyMap<string, StudioRoute> = new Map(
  (Object.entries(ROUTE_PATHS) as [StudioRoute, string][]).map(([r, p]) => [p, r]),
);

/**
 * Hash 문자열 (예: `#/spec` 또는 `/spec`) 을 StudioRoute 로 변환.
 * 구 경로는 redirect 맵 거쳐 새 경로로 반환.
 * 매칭되지 않으면 'spec' fallback.
 */
export function parseHash(hash: string): StudioRoute {
  const path = hash.replace(/^#/, "") || ROUTE_PATHS.spec;
  const route = PATH_TO_ROUTE.get(path) ?? "spec";
  return REDIRECTS[route] ?? route;
}

/** 프로그래밍적으로 라우트 변경. window.location.hash 갱신 → hashchange 이벤트 발생. */
export function navigate(route: StudioRoute): void {
  if (typeof window === "undefined") return;
  window.location.hash = ROUTE_PATHS[route];
}

/** 현재 URL hash 의 라우트를 React state 로 노출. hashchange 이벤트 listener. */
export function useCurrentRoute(): StudioRoute {
  const getInitial = (): StudioRoute => {
    if (typeof window === "undefined") return "spec";
    return parseHash(window.location.hash);
  };

  const [route, setRoute] = useState<StudioRoute>(getInitial);

  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", handler);
    handler();
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return route;
}
