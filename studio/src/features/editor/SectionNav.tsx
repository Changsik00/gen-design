import { Button } from "@/components/ui/button";

export type SectionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const SECTIONS: { id: SectionId; label: string; required: boolean }[] = [
  { id: 1, label: "Visual Theme & Atmosphere", required: true },
  { id: 2, label: "Color Palette & Roles", required: true },
  { id: 3, label: "Typography Rules", required: true },
  { id: 4, label: "Component Stylings", required: true },
  { id: 5, label: "Layout Principles", required: true },
  { id: 6, label: "Depth & Elevation", required: true },
  { id: 7, label: "Do's and Don'ts", required: false },
  { id: 8, label: "Responsive Behavior", required: true },
  { id: 9, label: "Agent Prompt Guide", required: true },
];

interface Props {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}

export function SectionNav({ active, onSelect }: Props) {
  return (
    <nav aria-label="섹션 목록" className="flex flex-col gap-1 w-56 flex-shrink-0">
      <p className="text-xs font-medium text-muted-foreground px-2 pb-1 uppercase tracking-wide">
        섹션
      </p>
      {SECTIONS.map(({ id, label, required }) => (
        <Button
          key={id}
          variant={active === id ? "secondary" : "ghost"}
          className="justify-start text-left h-auto py-2 px-3"
          onClick={() => onSelect(id)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-muted-foreground w-4 flex-shrink-0">{id}.</span>
            <span className="truncate text-sm">{label}</span>
            {required && (
              <span className="text-[10px] text-muted-foreground flex-shrink-0">✅</span>
            )}
          </span>
        </Button>
      ))}
    </nav>
  );
}
