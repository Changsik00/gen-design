import { Button } from "@/components/ui/button";

export type TokenCategory = "color" | "radius" | "typography";

const TABS: { id: TokenCategory; label: string; icon: string }[] = [
  { id: "color", label: "Color", icon: "🎨" },
  { id: "radius", label: "Radius", icon: "⬛" },
  { id: "typography", label: "Typography", icon: "Aa" },
];

interface Props {
  active: TokenCategory;
  onSelect: (id: TokenCategory) => void;
}

export function TokenNav({ active, onSelect }: Props) {
  return (
    <nav aria-label="토큰 카테고리" className="flex flex-col gap-1 w-44 flex-shrink-0">
      <p className="text-xs font-medium text-muted-foreground px-2 pb-1 uppercase tracking-wide">
        카테고리
      </p>
      {TABS.map(({ id, label, icon }) => (
        <Button
          key={id}
          variant={active === id ? "secondary" : "ghost"}
          className="justify-start gap-2 h-9"
          onClick={() => onSelect(id)}
        >
          <span className="text-base leading-none">{icon}</span>
          <span className="text-sm">{label}</span>
        </Button>
      ))}
    </nav>
  );
}
