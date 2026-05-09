import { useState } from "react";
import { TokenNav } from "./TokenNav";
import type { TokenCategory } from "./TokenNav";
import { ComponentPreview } from "./ComponentPreview";
import { ColorSection } from "./sections/ColorSection";
import { RadiusSection } from "./sections/RadiusSection";
import { TypographySection } from "./sections/TypographySection";
import { DEFAULT_TOKENS } from "./types";
import type { EditableTokens } from "./types";

const CATEGORY_TITLES: Record<TokenCategory, string> = {
  color: "Color Palette",
  radius: "Border Radius",
  typography: "Typography",
};

export function TokenEditor() {
  const [tokens, setTokens] = useState<EditableTokens>(DEFAULT_TOKENS);
  const [activeCategory, setActiveCategory] = useState<TokenCategory>("color");

  const updateTokens = (patch: Partial<EditableTokens>) =>
    setTokens((prev) => ({ ...prev, ...patch }));

  const resetTokens = () => setTokens(DEFAULT_TOKENS);

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left: category nav */}
      <div className="border-r border-border p-4 flex-shrink-0">
        <TokenNav active={activeCategory} onSelect={setActiveCategory} />
      </div>

      {/* Center: editor section */}
      <div className="flex-1 min-w-0 p-6 overflow-y-auto">
        <h2 className="text-base font-semibold mb-4">{CATEGORY_TITLES[activeCategory]}</h2>
        {activeCategory === "color" && (
          <ColorSection tokens={tokens} onChange={updateTokens} />
        )}
        {activeCategory === "radius" && (
          <RadiusSection tokens={tokens} onChange={updateTokens} />
        )}
        {activeCategory === "typography" && (
          <TypographySection tokens={tokens} onChange={updateTokens} />
        )}
      </div>

      {/* Right: component preview */}
      <div className="w-80 flex-shrink-0 border-l border-border p-4 flex flex-col min-h-0">
        <ComponentPreview tokens={tokens} onReset={resetTokens} />
      </div>
    </div>
  );
}
