import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select";
import { APP_TYPES, PACKAGE_MANAGERS } from "./types";
import type { ExportConfig } from "./types";

interface Props {
  config: ExportConfig;
  onChange: (patch: Partial<ExportConfig>) => void;
}

export function ExportConfigForm({ config, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appName">앱 이름</Label>
        <Input
          id="appName"
          value={config.appName}
          onChange={(e) => onChange({ appName: e.target.value })}
          placeholder="MyApp"
        />
      </div>

      <div className="space-y-2">
        <Label>앱 유형</Label>
        <Select
          value={config.appType}
          onValueChange={(v) => v && onChange({ appType: v as ExportConfig["appType"] })}
        >
          <SelectTrigger aria-label="앱 유형 선택">
            <SelectValue placeholder="앱 유형 선택" />
          </SelectTrigger>
          <SelectPopup>
            {APP_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack">기술 스택</Label>
        <Input
          id="techStack"
          value={config.techStack}
          onChange={(e) => onChange({ techStack: e.target.value })}
          placeholder="React + TypeScript + Tailwind CSS"
        />
      </div>

      <div className="space-y-2">
        <Label>패키지 매니저</Label>
        <Select
          value={config.packageManager}
          onValueChange={(v) => v && onChange({ packageManager: v as ExportConfig["packageManager"] })}
        >
          <SelectTrigger aria-label="패키지 매니저 선택">
            <SelectValue placeholder="패키지 매니저 선택" />
          </SelectTrigger>
          <SelectPopup>
            {PACKAGE_MANAGERS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>
    </div>
  );
}
