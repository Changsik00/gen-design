/**
 * StudioLayout — Studio 앱의 메인 chrome.
 *
 * 자체 Sidebar 컴포넌트 재사용 (dogfooding).
 * Sidebar 의 nav 클릭은 wrapper 의 capture-phase listener 로 가로채 router 와 연동.
 */

import { type ReactNode, useCallback } from "react";
import { Sidebar } from "@/components/composites/Sidebar";
import { ROUTE_PATHS, navigate, useCurrentRoute, type StudioRoute } from "@/lib/router";

interface NavItem {
  route: Exclude<StudioRoute, "playground" | "blueprint" | "editor" | "preview">; // 숨김/legacy route 는 nav 미노출
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { route: "spec", label: "Spec Editor" },
  { route: "new", label: "New Spec" },
  { route: "design", label: "Design MD" },
  { route: "tokens", label: "Tokens" },
  { route: "export", label: "Export" },
];

export function StudioLayout({ children }: { children: ReactNode }) {
  const current = useCurrentRoute();
  const activeIndex = NAV_ITEMS.findIndex((it) => it.route === current);

  // Sidebar 가 nav item 을 <a href="#"> 로 렌더하므로 wrapper 가 클릭 가로채 navigate 호출
  const handleNavClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    // Sidebar 의 nav <a> 안의 텍스트로 라우트 매칭
    const label = anchor.textContent?.trim() ?? "";
    const item = NAV_ITEMS.find((it) => label.includes(it.label));
    if (!item) return;
    event.preventDefault();
    navigate(item.route);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <div onClick={handleNavClick}>
        <Sidebar
          appName="Design Studio"
          navItems={NAV_ITEMS.map((it) => it.label)}
          activeIndex={activeIndex >= 0 ? activeIndex : 0}
        />
      </div>
      <main className="flex flex-1 flex-col overflow-auto">
        {children}
      </main>
    </div>
  );
}

export { NAV_ITEMS, ROUTE_PATHS };
