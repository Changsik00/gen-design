import { useState } from "react";
import { Step1AppType } from "./steps/Step1AppType";
import { Step15Nfr } from "./steps/Step15Nfr";
import { Step2Pages } from "./steps/Step2Pages";
import { Step3Variants } from "./steps/Step3Variants";
import { OutputPreview } from "./OutputPreview";
import { getRecommendedPages } from "./catalog";
import type { AppType, BlueprintSession, NfrConfig, PageSelection } from "./types";
import { NFR_DEFAULTS } from "./types";

type WizardStep = "step1" | "step1_5" | "step2" | "step3" | "output";

const STEP_LABELS: Record<WizardStep, string> = {
  step1: "1. 앱유형",
  step1_5: "1.5 NFR",
  step2: "2. 페이지",
  step3: "3. Variant",
  output: "결과",
};

const STEP_ORDER: WizardStep[] = ["step1", "step1_5", "step2", "step3", "output"];

function WizardHeader({ current }: { current: WizardStep }) {
  const currentIdx = STEP_ORDER.indexOf(current);
  return (
    <div className="flex items-center gap-1 px-6 py-3 border-b bg-muted/30 overflow-x-auto">
      {STEP_ORDER.map((step, idx) => (
        <div key={step} className="flex items-center gap-1">
          <span
            className={`whitespace-nowrap text-xs px-2 py-1 rounded-full ${
              idx === currentIdx
                ? "bg-primary text-primary-foreground font-medium"
                : idx < currentIdx
                ? "text-muted-foreground line-through"
                : "text-muted-foreground"
            }`}
          >
            {STEP_LABELS[step]}
          </span>
          {idx < STEP_ORDER.length - 1 && (
            <span className="text-muted-foreground text-xs">›</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function BlueprintWizard() {
  const [step, setStep] = useState<WizardStep>("step1");
  const [appType, setAppType] = useState<AppType | null>(null);
  const [appName, setAppName] = useState("");
  const [nfr, setNfr] = useState<NfrConfig>(NFR_DEFAULTS);
  const [pages, setPages] = useState<PageSelection[]>([]);

  function handleSelectType(type: AppType) {
    setAppType(type);
  }

  function handleStep1Next() {
    if (!appType) return;
    setPages(getRecommendedPages(appType));
    setStep("step1_5");
  }

  function handleStep15Next() {
    setStep("step2");
  }

  function handleStep2Next() {
    setStep("step3");
  }

  function handleStep3Next() {
    setStep("output");
  }

  function restart() {
    setStep("step1");
    setAppType(null);
    setAppName("");
    setNfr(NFR_DEFAULTS);
    setPages([]);
  }

  const session: BlueprintSession | null =
    appType && appName
      ? { appType, appName, nfr, selectedPages: pages }
      : null;

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <WizardHeader current={step} />
      <div className="flex-1 overflow-auto">
        {step === "step1" && (
          <Step1AppType
            selected={appType}
            appName={appName}
            onSelectType={handleSelectType}
            onChangeAppName={setAppName}
            onNext={handleStep1Next}
          />
        )}
        {step === "step1_5" && (
          <Step15Nfr
            nfr={nfr}
            onChange={setNfr}
            onNext={handleStep15Next}
            onBack={() => setStep("step1")}
          />
        )}
        {step === "step2" && (
          <Step2Pages
            pages={pages}
            onChange={setPages}
            onNext={handleStep2Next}
            onBack={() => setStep("step1_5")}
          />
        )}
        {step === "step3" && (
          <Step3Variants
            pages={pages}
            onChange={setPages}
            onNext={handleStep3Next}
            onBack={() => setStep("step2")}
          />
        )}
        {step === "output" && session && (
          <OutputPreview
            session={session}
            onBack={() => setStep("step3")}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}
