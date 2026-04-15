import { LayoutDashboard, MessageSquare, Database, Settings } from "lucide-react";

const navIcons = [LayoutDashboard, MessageSquare, Database, Settings];

interface SidebarProps {
  appName: string;
  navItems: string[];
  activeIndex?: number;
}

export function Sidebar({ appName, navItems, activeIndex = 0 }: SidebarProps) {
  return (
    <aside className="flex h-full w-56 flex-col bg-card border-r">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          {appName.charAt(0)}
        </div>
        <span className="font-semibold">{appName}</span>
      </div>
      <nav className="flex-1 px-3">
        <p className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item, i) => {
            const Icon = navIcons[i % navIcons.length];
            const isActive = i === activeIndex;
            return (
              <li key={item}>
                <a
                  href="#"
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
