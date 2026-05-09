import { Label } from "@/components/ui/label";
import type { DesignDocument } from "../types";

interface Props {
  doc: DesignDocument;
  onChange: (patch: Partial<DesignDocument>) => void;
}

export function Section9AgentGuide({ doc, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="agentGuide">Agent Prompt Guide</Label>
      <p className="text-xs text-muted-foreground">
        AI 에이전트가 코드 생성 시 참조하는 빠른 레퍼런스. 주요 색상 hex, 컴포넌트 프롬프트 예시 등을 포함하세요.
      </p>
      <textarea
        id="agentGuide"
        className="w-full min-h-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={"**Quick Color Reference**:\n- Primary: #6366F1\n- Background: #F8FAFC\n- Text: #0F172A\n\n**Example Component Prompts**:\n1. \"Create a primary CTA button with 8px radius and indigo fill\"\n2. \"Build a card with subtle shadow and 16px padding\"\n3. \"Design a navigation sidebar with dark background (#0F172A) and active item highlight\""}
        value={doc.agentGuide}
        onChange={(e) => onChange({ agentGuide: e.target.value })}
      />
    </div>
  );
}
