import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExportConfigForm } from "./ExportConfigForm";
import { FileTabList } from "./FileTabList";
import {
  generateDesignMdTemplate,
  generateRequirementsMdTemplate,
  generateAgentMd,
  generateTokensJson,
} from "./generators";
import { DEFAULT_CONFIG, FILE_TABS } from "./types";
import type { ExportConfig, FileType } from "./types";

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportPanel() {
  const [config, setConfig] = useState<ExportConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<FileType>("design");

  const updateConfig = (patch: Partial<ExportConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  const contents = {
    design: generateDesignMdTemplate(config),
    requirements: generateRequirementsMdTemplate(config),
    agent: generateAgentMd(config),
    tokens: generateTokensJson(),
  };

  const handleDownloadAll = () => {
    FILE_TABS.forEach(({ id, filename }, i) => {
      const mime = id === "tokens" ? "application/json" : "text/markdown";
      setTimeout(() => downloadFile(filename, contents[id], mime), i * 200);
    });
  };

  return (
    <div className="flex flex-1 min-h-0 gap-0">
      {/* Left: config + download all */}
      <div className="w-64 flex-shrink-0 border-r border-border p-4 flex flex-col gap-4 overflow-y-auto">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            프로젝트 설정
          </p>
          <ExportConfigForm config={config} onChange={updateConfig} />
        </div>

        <Card className="p-3 space-y-2">
          <p className="text-xs text-muted-foreground">
            4종 파일을 순차적으로 다운로드합니다.
          </p>
          <Button className="w-full" onClick={handleDownloadAll}>
            ⬇ 모두 다운로드
          </Button>
          <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
            {FILE_TABS.map(({ label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-primary">•</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right: file preview */}
      <div className="flex-1 min-w-0 p-4 flex flex-col min-h-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex-shrink-0">
          파일 미리보기
        </p>
        <FileTabList
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          contents={contents}
        />
      </div>
    </div>
  );
}
