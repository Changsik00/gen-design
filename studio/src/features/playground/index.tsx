/**
 * Playground — 컴포넌트 시각 확인용 숨김 route (#/__playground).
 *
 * 기존 App.tsx 의 page/brand/locale/variant 토글 + LoginScene/DashboardScene
 * 데모를 그대로 보존. production 빌드에는 Sidebar nav 에 노출되지 않음.
 *
 * 향후 storybook 또는 별도 컴포넌트 갤러리로 발전 후보.
 */

import { useState, useEffect } from "react";
import { LoginScene, DashboardScene } from "@/components/templates";
import { getLoginSceneTexts, getDashboardSceneTexts } from "@/lib/i18n";
import type {
  StatCardData,
  ActivityRowData,
  SceneTemplateVariant,
} from "@/components/templates/types";

type Page = "login" | "dashboard";
type Brand = "a" | "b";
type Locale = "ko" | "en";

const mockStats: StatCardData[] = [
  { label: "TOTAL USERS", value: "12,847", change: "12.5% from last month", trend: "up" },
  { label: "AI CONVERSATIONS", value: "3,429", change: "8.2% from last month", trend: "up" },
  { label: "DB RECORDS", value: "58,102", change: "2.1% from last month", trend: "down" },
  { label: "UPTIME", value: "99.98%", change: "Stable", trend: "stable" },
];

const mockActivities: ActivityRowData[] = [
  { userName: "Jiwon Kim", initials: "JK", action: "Created new record", status: "Completed", statusColor: "green", time: "2 min ago" },
  { userName: "Soohan Park", initials: "SH", action: "AI Chat session", status: "In Progress", statusColor: "blue", time: "5 min ago" },
  { userName: "Yejin Lee", initials: "YJ", action: "Updated 3 records", status: "Completed", statusColor: "green", time: "12 min ago" },
  { userName: "Minjun Choi", initials: "MJ", action: "Deleted record #4821", status: "Deleted", statusColor: "red", time: "28 min ago" },
];

export function Playground() {
  const [page, setPage] = useState<Page>("login");
  const [brand, setBrand] = useState<Brand>("a");
  const [locale, setLocale] = useState<Locale>("ko");
  const [variant, setVariant] = useState<SceneTemplateVariant>("page");

  useEffect(() => {
    const root = document.documentElement;
    if (brand === "b") {
      root.classList.add("brand-b");
    } else {
      root.classList.remove("brand-b");
    }
  }, [brand]);

  const loginTexts = getLoginSceneTexts(locale);
  const dashboardTexts = getDashboardSceneTexts(locale);

  return (
    <>
      {/* Control panel */}
      <div className="fixed top-2 right-2 z-50 flex flex-col gap-2 rounded-lg bg-white p-3 shadow-lg ring-1 ring-black/10">
        <div className="flex gap-1">
          {(["login", "dashboard"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                page === p ? "bg-indigo-500 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["a", "b"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                brand === b ? "bg-indigo-500 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Brand {b.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["ko", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                locale === l ? "bg-indigo-500 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {page === "login" && (
          <div className="flex gap-1">
            {(["page", "modal", "bottom-sheet"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`rounded-md px-3 py-1 text-xs font-medium ${
                  variant === v ? "bg-indigo-500 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Page content */}
      {page === "login" && <LoginScene variant={variant} texts={loginTexts} />}
      {page === "dashboard" && (
        <DashboardScene
          variant="page"
          appName="Studio"
          texts={dashboardTexts}
          stats={mockStats}
          activities={mockActivities}
        />
      )}
    </>
  );
}
