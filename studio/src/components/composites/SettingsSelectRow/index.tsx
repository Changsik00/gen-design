import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select";

interface SettingsSelectRowOption {
  value: string;
  label: string;
}

interface SettingsSelectRowProps {
  label: string;
  value: string;
  options: SettingsSelectRowOption[];
  onValueChange?: (value: string) => void;
}

export function SettingsSelectRow({
  label,
  value,
  options,
  onValueChange,
}: SettingsSelectRowProps) {
  const current = options.find((o) => o.value === value);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="w-44">
        <Select<string>
          value={value}
          onValueChange={(next) => onValueChange?.(next as string)}
        >
          <SelectTrigger aria-label={label}>
            <SelectValue>{current?.label ?? value}</SelectValue>
          </SelectTrigger>
          <SelectPopup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
    </div>
  );
}
