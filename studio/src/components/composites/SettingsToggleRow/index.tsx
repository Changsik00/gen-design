import { Switch } from "@/components/ui/switch";
import type { Switch as SwitchPrimitive } from "@base-ui/react/switch";

interface SettingsToggleRowProps {
  label: string;
  helperText?: string;
  checked: boolean;
  onCheckedChange?: SwitchPrimitive.Root.Props["onCheckedChange"];
  disabled?: boolean;
}

export function SettingsToggleRow({
  label,
  helperText,
  checked,
  onCheckedChange,
  disabled,
}: SettingsToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        {helperText ? (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        ) : null}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}
