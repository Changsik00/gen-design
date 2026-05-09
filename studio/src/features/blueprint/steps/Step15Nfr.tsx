import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { NfrConfig } from "../types";

interface Props {
  nfr: NfrConfig;
  onChange: (nfr: NfrConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

function RadioGroup({
  label, options, value, onChange,
}: { label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md border px-3 py-1 text-xs transition-colors ${
              value === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:border-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Step15Nfr({ nfr, onChange, onNext, onBack }: Props) {
  function update<K extends keyof NfrConfig>(key: K, val: NfrConfig[K]) {
    onChange({ ...nfr, [key]: val });
  }

  const themeOptions = ["light", "dark", "auto"] as const;
  const isDarkToggled = nfr.theme.supportedThemes.includes("dark");

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div>
        <h2 className="text-xl font-semibold">Step 1.5 — 비기능 요구사항 (NFR)</h2>
        <p className="text-sm text-muted-foreground mt-1">앱 전체 설정을 확인합니다. 기본값이 미리 채워져 있습니다.</p>
      </div>

      {/* 인증 */}
      <Card className="p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold">🔐 인증</p>
        <RadioGroup
          label="인증 방식"
          value={nfr.auth.method}
          options={[
            { value: "email-password", label: "이메일/비밀번호" },
            { value: "social-only", label: "소셜만" },
            { value: "passwordless", label: "패스워드리스" },
            { value: "enterprise", label: "Enterprise SSO" },
          ]}
          onChange={(v) => update("auth", { ...nfr.auth, method: v as NfrConfig["auth"]["method"] })}
        />
        <RadioGroup
          label="세션 전략"
          value={nfr.auth.sessionStrategy}
          options={[
            { value: "jwt-refresh", label: "JWT Refresh" },
            { value: "cookie-session", label: "Cookie Session" },
            { value: "none", label: "없음" },
          ]}
          onChange={(v) => update("auth", { ...nfr.auth, sessionStrategy: v as NfrConfig["auth"]["sessionStrategy"] })}
        />
      </Card>

      {/* 다국어 */}
      <Card className="p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold">🌐 다국어</p>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">지원 언어 (쉼표 구분)</span>
          <input
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            value={nfr.i18n.supportedLocales.join(", ")}
            onChange={(e) =>
              update("i18n", {
                ...nfr.i18n,
                supportedLocales: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">기본 언어</span>
          <input
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm w-24"
            value={nfr.i18n.defaultLocale}
            onChange={(e) => update("i18n", { ...nfr.i18n, defaultLocale: e.target.value })}
          />
        </div>
      </Card>

      {/* 테마 */}
      <Card className="p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold">🎨 테마</p>
        <RadioGroup
          label="기본 테마"
          value={nfr.theme.defaultTheme}
          options={themeOptions.map((t) => ({ value: t, label: t }))}
          onChange={(v) => update("theme", { ...nfr.theme, defaultTheme: v as NfrConfig["theme"]["defaultTheme"] })}
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={isDarkToggled}
            onCheckedChange={(checked) =>
              update("theme", {
                ...nfr.theme,
                supportedThemes: checked
                  ? [...new Set([...nfr.theme.supportedThemes, "dark" as const])]
                  : nfr.theme.supportedThemes.filter((t) => t !== "dark"),
              })
            }
          />
          <span className="text-xs">다크 모드 지원</span>
        </div>
      </Card>

      {/* 성능 */}
      <Card className="p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold">⚡ 성능</p>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground w-36">Lighthouse 목표 점수</span>
          <input
            type="number"
            min={0}
            max={100}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm w-20"
            value={nfr.performance.targetLighthouseScore}
            onChange={(e) =>
              update("performance", { ...nfr.performance, targetLighthouseScore: Number(e.target.value) })
            }
          />
        </div>
      </Card>

      {/* 보안 */}
      <Card className="p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold">🔒 보안</p>
        <RadioGroup
          label="CSP 정책"
          value={nfr.security.csp}
          options={[
            { value: "strict-default", label: "Strict (권장)" },
            { value: "relaxed", label: "Relaxed" },
          ]}
          onChange={(v) => update("security", { ...nfr.security, csp: v as NfrConfig["security"]["csp"] })}
        />
        <RadioGroup
          label="인증 토큰 저장"
          value={nfr.security.authStorageMethod}
          options={[
            { value: "httpOnly-cookie", label: "httpOnly Cookie (권장)" },
            { value: "localStorage", label: "localStorage" },
            { value: "memory", label: "Memory" },
          ]}
          onChange={(v) =>
            update("security", { ...nfr.security, authStorageMethod: v as NfrConfig["security"]["authStorageMethod"] })
          }
        />
      </Card>

      {/* 호환성/접근성 */}
      <Card className="p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold">♿ 호환성 / 접근성</p>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">대상 브라우저</span>
          <input
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            value={nfr.compatibility.targetBrowsers}
            onChange={(e) => update("compatibility", { ...nfr.compatibility, targetBrowsers: e.target.value })}
          />
        </div>
        <RadioGroup
          label="접근성 등급"
          value={nfr.compatibility.a11yLevel}
          options={[
            { value: "WCAG 2.1 AA", label: "WCAG 2.1 AA (권장)" },
            { value: "WCAG 2.1 AAA", label: "WCAG 2.1 AAA" },
            { value: "AA-best-effort", label: "AA Best-effort" },
          ]}
          onChange={(v) =>
            update("compatibility", { ...nfr.compatibility, a11yLevel: v as NfrConfig["compatibility"]["a11yLevel"] })
          }
        />
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← 이전</Button>
        <Button onClick={onNext}>다음 →</Button>
      </div>
    </div>
  );
}
