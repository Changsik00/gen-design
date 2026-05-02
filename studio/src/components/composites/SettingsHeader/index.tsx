import { Input } from "@/components/ui/input";

interface SettingsHeaderProps {
  title: string;
  searchPlaceholder?: string;
}

export function SettingsHeader({ title, searchPlaceholder }: SettingsHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 pb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {searchPlaceholder ? (
        <div className="w-72">
          <Input type="search" placeholder={searchPlaceholder} />
        </div>
      ) : null}
    </header>
  );
}
