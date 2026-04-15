import type { ActivityRowData } from "@/components/templates/types";

interface ActivityTableProps {
  title: string;
  viewAllLabel: string;
  columns: {
    user: string;
    action: string;
    status: string;
    time: string;
  };
  rows: ActivityRowData[];
}

const statusColorMap: Record<ActivityRowData["statusColor"], string> = {
  green: "text-green-600",
  blue: "text-blue-600",
  red: "text-red-500",
  gray: "text-muted-foreground",
};

export function ActivityTable({
  title,
  viewAllLabel,
  columns,
  rows,
}: ActivityTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="font-semibold">{title}</h2>
        <a href="#" className="text-sm text-muted-foreground hover:underline">
          {viewAllLabel}
        </a>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-t text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="px-6 py-3">{columns.user}</th>
            <th className="px-6 py-3">{columns.action}</th>
            <th className="px-6 py-3">{columns.status}</th>
            <th className="px-6 py-3">{columns.time}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {row.initials}
                  </div>
                  <span className="text-sm">{row.userName}</span>
                </div>
              </td>
              <td className="px-6 py-3 text-sm text-muted-foreground">
                {row.action}
              </td>
              <td className="px-6 py-3">
                <span className={`text-sm font-medium ${statusColorMap[row.statusColor]}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-muted-foreground">
                {row.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
