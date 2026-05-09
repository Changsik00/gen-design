/**
 * Studio hash-based router.
 *
 * URL `#/path` ↔ StudioRoute enum 변환.
 * 외부 의존성 0 — Studio 의 단순 5 route 에 적합. 향후 nested / dynamic
 * params 필요 시 react-router 도입 검토.
 */

import { useEffect, useState } from "react";

export type StudioRoute = "blueprint" | "editor" | "tokens" | "export" | "preview" | "playground";

export const ROUTE_PATHS: Record<StudioRoute, string> = {
  blueprint: "/blueprint",
  editor: "/editor",
  tokens: "/tokens",
  export: "/export",
  preview: "/preview",
  playground: "/__playground",
};

const PATH_TO_ROUTE: ReadonlyMap<string, StudioRoute> = new Map(
  (Object.entries(ROUTE_PATHS) as [StudioRoute, string][]).map(([r, p]) => [p, r]),
);

/**
 * Hash 문자열 (예: `#/blueprint` 또는 `/blueprint`) 을 StudioRoute 로 변환.
 * 매칭되지 않으면 'blueprint' fallback.
 */
export function parseHash(hash: string): StudioRoute {
  const path = hash.replace(/^#/, "") || ROUTE_PATHS.blueprint;
  return PATH_TO_ROUTE.get(path) ?? "blueprint";
}

/** 프로그램ically 라우트 변경. window.location.hash 갱신 → hashchange 이벤트 발생. */
export function navigate(route: StudioRoute): void {
  if (typeof window === "undefined") return;
  window.location.hash = ROUTE_PATHS[route];
}

/** 현재 URL hash 의 라우트를 React state 로 노출. hashchange 이벤트 listener. */
export function useCurrentRoute(): StudioRoute {
  const getInitial = (): StudioRoute => {
    if (typeof window === "undefined") return "blueprint";
    return parseHash(window.location.hash);
  };

  const [route, setRoute] = useState<StudioRoute>(getInitial);

  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", handler);
    // 초기 동기화 (서버사이드 렌더링 후 클라이언트 hydration 시점 보호)
    handler();
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return route;
}
