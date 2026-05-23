/**
 * checkVocabSimilar — chat.md 의 카탈로그 외 컴포넌트 어휘 검출 + Levenshtein "Did you mean?"
 *
 * - chat.md 의 <PascalCase /> 태그만 추출 (소문자 html 태그 제외, 코드 블록 무시)
 * - 카탈로그 (FRONT.md / catalog.json) 에 없는 어휘 → 진단
 * - Levenshtein 거리 ≤ 3 (또는 segment 매칭) 의 카탈로그 항목 제안
 * - 유사 후보 없으면 "FRONT.md 카탈로그 / Tier 3 승격 안내"
 *
 * 단, 본 검증은 `catalog-ref` 와 일부 중복 — 본 함수는 *"Did you mean?" 제안에 특화*.
 */

import type { DoctorDiag } from "./types";
import { diag, vocabMsg } from "./messages";
import { findSimilar } from "./levenshtein";

// PascalCase 컴포넌트 태그: <X> / <X /> / <XY>
// (X 는 대문자로 시작, 이후는 알파넘)
const TAG_RE = /<([A-Z][A-Za-z0-9]*)\b/g;

function stripCodeBlocks(text: string): string {
  return text.replace(/```[\s\S]*?```/g, "");
}

function stripHtmlComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

export function extractChatComponents(text: string): string[] {
  // HTML 주석 (예: <!-- 예시: <Header>... -->) + 코드 블록 모두 제거 후 추출
  // spec-11-05 fix #3 — dogfooding alpha 의 _shell.chat.md false positive 해소
  const stripped = stripHtmlComments(stripCodeBlocks(text));
  const set = new Set<string>();
  for (const m of stripped.matchAll(TAG_RE)) {
    if (m[1]) set.add(m[1]);
  }
  return Array.from(set);
}

/**
 * shadcn 표준 컴포넌트 화이트리스트 (Tier 2) — catalog.json 에 미등재여도 *알려진 어휘*.
 * (spec-11-07 fix #v2-2 — v2 dogfooding 에서 Card/CardHeader 등이 vocab-similar FP 발생)
 *
 * 보수적 화이트리스트 — shadcn/ui 의 *공식 컴포넌트* + 일반적 sub-component.
 */
export const SHADCN_KNOWN_COMPONENTS = new Set([
  // Layout / Surface
  "Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter",
  "Separator",
  // Form
  "Form", "FormField", "FormItem", "FormLabel", "FormControl", "FormDescription", "FormMessage",
  "Field",
  "Input", "Textarea", "Label", "Checkbox", "RadioGroup", "RadioGroupItem",
  "Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem", "SelectGroup", "SelectLabel",
  "Switch", "Slider",
  // Button / Interaction
  "Button", "Toggle", "ToggleGroup", "ToggleGroupItem",
  // Overlay
  "Dialog", "DialogTrigger", "DialogContent", "DialogHeader", "DialogTitle", "DialogDescription", "DialogFooter", "DialogClose",
  "Sheet", "SheetTrigger", "SheetContent", "SheetHeader", "SheetTitle", "SheetDescription", "SheetFooter", "SheetClose",
  "Popover", "PopoverTrigger", "PopoverContent",
  "DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuLabel", "DropdownMenuSeparator", "DropdownMenuGroup", "DropdownMenuSub", "DropdownMenuSubTrigger", "DropdownMenuSubContent", "DropdownMenuRadioGroup", "DropdownMenuRadioItem", "DropdownMenuCheckboxItem",
  "ContextMenu", "ContextMenuTrigger", "ContextMenuContent", "ContextMenuItem",
  "HoverCard", "HoverCardTrigger", "HoverCardContent",
  "Tooltip", "TooltipTrigger", "TooltipContent", "TooltipProvider",
  // Navigation
  "Tabs", "TabsList", "TabsTrigger", "TabsContent",
  "NavigationMenu", "NavigationMenuList", "NavigationMenuItem", "NavigationMenuTrigger", "NavigationMenuContent", "NavigationMenuLink",
  "Breadcrumb", "BreadcrumbList", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbSeparator", "BreadcrumbPage",
  "Pagination", "PaginationContent", "PaginationItem", "PaginationLink", "PaginationPrevious", "PaginationNext", "PaginationEllipsis",
  // Status / Feedback
  "Alert", "AlertTitle", "AlertDescription",
  "Toast", "ToastProvider", "Toaster",
  "Badge",
  "Progress",
  "Skeleton",
  "Spinner",
  // Data
  "Table", "TableHeader", "TableBody", "TableRow", "TableHead", "TableCell", "TableCaption", "TableFooter",
  "Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent",
  "Collapsible", "CollapsibleTrigger", "CollapsibleContent",
  // Media
  "Avatar", "AvatarImage", "AvatarFallback",
  "AspectRatio",
  // Calendar / Date
  "Calendar", "DatePicker",
  // Layout
  "ScrollArea", "ScrollBar",
  "ResizablePanelGroup", "ResizablePanel", "ResizableHandle",
  // Common HTML semantic via shadcn
  "Command", "CommandInput", "CommandList", "CommandEmpty", "CommandGroup", "CommandItem", "CommandSeparator",
  "Drawer", "DrawerTrigger", "DrawerContent", "DrawerHeader", "DrawerTitle", "DrawerDescription", "DrawerFooter", "DrawerClose",
]);

export function checkVocabSimilar(
  chatFiles: Array<{ path: string; content: string }>,
  catalog: Set<string>,
): DoctorDiag[] {
  const diags: DoctorDiag[] = [];

  for (const { path, content } of chatFiles) {
    const used = extractChatComponents(content);
    for (const name of used) {
      // catalog 등재 OR shadcn 표준 화이트리스트 통과 → 진단 X
      if (catalog.has(name)) continue;
      if (SHADCN_KNOWN_COMPONENTS.has(name)) continue;

      const similar = findSimilar(name, catalog, { maxDist: 3, topN: 3 });
      const hint =
        similar.length > 0 ? vocabMsg.didYouMean(name, similar) : vocabMsg.noSuggestion;

      diags.push(
        diag("vocab-similar", "error", path, vocabMsg.unknownComponent(name, path), {
          hint,
        }),
      );
    }
  }

  return diags;
}
