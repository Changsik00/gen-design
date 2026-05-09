import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionNav } from "./SectionNav";
import type { SectionId } from "./SectionNav";
import { MarkdownPreview } from "./MarkdownPreview";
import { Section1VisualTheme } from "./sections/Section1VisualTheme";
import { Section2Colors } from "./sections/Section2Colors";
import { Section3Typography } from "./sections/Section3Typography";
import { Section4Components } from "./sections/Section4Components";
import { Section5Layout } from "./sections/Section5Layout";
import { Section6Elevation } from "./sections/Section6Elevation";
import { Section7DosDonts } from "./sections/Section7DosDonts";
import { Section8Responsive } from "./sections/Section8Responsive";
import { Section9AgentGuide } from "./sections/Section9AgentGuide";
import { EMPTY_DOCUMENT } from "./types";
import type { DesignDocument } from "./types";

const SECTION_TITLES: Record<SectionId, string> = {
  1: "1. Visual Theme & Atmosphere",
  2: "2. Color Palette & Roles",
  3: "3. Typography Rules",
  4: "4. Component Stylings",
  5: "5. Layout Principles",
  6: "6. Depth & Elevation",
  7: "7. Do's and Don'ts",
  8: "8. Responsive Behavior",
  9: "9. Agent Prompt Guide",
};

function SectionForm({
  section,
  doc,
  onChange,
}: {
  section: SectionId;
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}) {
  switch (section) {
    case 1: return <Section1VisualTheme doc={doc} onChange={onChange} />;
    case 2: return <Section2Colors doc={doc} onChange={onChange} />;
    case 3: return <Section3Typography doc={doc} onChange={onChange} />;
    case 4: return <Section4Components doc={doc} onChange={onChange} />;
    case 5: return <Section5Layout doc={doc} onChange={onChange} />;
    case 6: return <Section6Elevation doc={doc} onChange={onChange} />;
    case 7: return <Section7DosDonts doc={doc} onChange={onChange} />;
    case 8: return <Section8Responsive doc={doc} onChange={onChange} />;
    case 9: return <Section9AgentGuide doc={doc} onChange={onChange} />;
  }
}

export function DesignEditor() {
  const [doc, setDoc] = useState<DesignDocument>(EMPTY_DOCUMENT);
  const [activeSection, setActiveSection] = useState<SectionId>(1);

  const updateDoc = (patch: Partial<DesignDocument>) =>
    setDoc((prev) => ({ ...prev, ...patch }));

  return (
    <div className="flex flex-col h-full">
      {/* Top bar: appName */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border flex-shrink-0">
        <Label htmlFor="appName" className="text-sm font-medium flex-shrink-0">
          앱 이름
        </Label>
        <Input
          id="appName"
          className="max-w-xs"
          value={doc.appName}
          onChange={(e) => updateDoc({ appName: e.target.value })}
          placeholder="MyApp"
        />
        <p className="text-xs text-muted-foreground">파일명과 마크다운 헤더에 사용됩니다.</p>
      </div>

      {/* Main: nav + form + preview */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* Left: section nav */}
        <div className="border-r border-border p-4 overflow-y-auto flex-shrink-0">
          <SectionNav active={activeSection} onSelect={setActiveSection} />
        </div>

        {/* Center: section form */}
        <div className="flex-1 min-w-0 p-6 overflow-y-auto">
          <h2 className="text-base font-semibold mb-4">{SECTION_TITLES[activeSection]}</h2>
          <SectionForm section={activeSection} doc={doc} onChange={updateDoc} />
        </div>

        {/* Right: markdown preview */}
        <div className="w-96 flex-shrink-0 border-l border-border p-4 flex flex-col min-h-0">
          <MarkdownPreview doc={doc} />
        </div>
      </div>
    </div>
  );
}
