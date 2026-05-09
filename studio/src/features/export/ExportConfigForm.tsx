import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
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
        <Label htmlFor="appType">앱 유형</Label>
        <Select
          value={config.appType}
          onValueChange={(v) => onChange({ appType: v as ExportConfig["appType"] })}
          options={APP_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="앱 유형 선택"
        />
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
        <Label htmlFor="packageManager">패키지 매니저</Label>
        <Select
          value={config.packageManager}
          onValueChange={(v) => onChange({ packageManager: v as ExportConfig["packageManager"] })}
          options={PACKAGE_MANAGERS.map((p) => ({ value: p.value, label: p.label }))}
          placeholder="패키지 매니저 선택"
        />
      </div>
    </div>
  );
}
