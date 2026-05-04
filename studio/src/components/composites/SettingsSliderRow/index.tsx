import { Slider } from "@/components/ui/slider";

interface SettingsSliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  displayValue?: string;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
}

export function SettingsSliderRow({
  label,
  value,
  min,
  max,
  displayValue,
  onValueChange,
  disabled,
}: SettingsSliderRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_3fr] items-center gap-4 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {displayValue ?? String(value)}
      </span>
      <Slider
        value={value}
        min={min}
        max={max}
        onValueChange={(next) => {
          if (typeof next === "number") onValueChange?.(next);
        }}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}
