import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  searchPlaceholder: string;
}

export function DashboardHeader({ title, searchPlaceholder }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <Input
          placeholder={searchPlaceholder}
          className="w-48"
        />
        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
          <Bell className="size-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          D
        </div>
      </div>
    </header>
  );
}
