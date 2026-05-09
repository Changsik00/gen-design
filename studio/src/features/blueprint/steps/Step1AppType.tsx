import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AppType } from "../types";

interface AppTypeOption {
  id: AppType;
  label: string;
  description: string;
}

const APP_TYPES: AppTypeOption[] = [
  { id: "saas", label: "SaaS", description: "대시보드 + 관리 기능 중심 B2B 서비스" },
  { id: "ecommerce", label: "E-commerce", description: "상품 목록 + 장바구니 + 결제" },
  { id: "social", label: "Social", description: "피드 + 프로필 + 소통 중심 커뮤니티" },
  { id: "content", label: "Content", description: "콘텐츠 소비 + 검색 미디어 앱" },
  { id: "utility", label: "Utility", description: "기능 중심, 최소 UI 도구 앱" },
  { id: "custom", label: "Custom", description: "빈 상태에서 직접 구성" },
];

interface Props {
  selected: AppType | null;
  appName: string;
  onSelectType: (type: AppType) => void;
  onChangeAppName: (name: string) => void;
  onNext: () => void;
}

export function Step1AppType({ selected, appName, onSelectType, onChangeAppName, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div>
        <h2 className="text-xl font-semibold">Step 1 — 앱유형 선택</h2>
        <p className="text-sm text-muted-foreground mt-1">어떤 유형의 앱을 만들고 싶으신가요?</p>
      </div>

      <div>
        <label className="text-sm font-medium">앱 이름</label>
        <input
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="My App"
          value={appName}
          onChange={(e) => onChangeAppName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {APP_TYPES.map((opt) => (
          <Card
            key={opt.id}
            className={`cursor-pointer p-4 transition-colors hover:border-primary ${
              selected === opt.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onSelectType(opt.id)}
          >
            <p className="font-medium">{opt.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button disabled={!selected || !appName.trim()} onClick={onNext}>
          다음 →
        </Button>
      </div>
    </div>
  );
}
