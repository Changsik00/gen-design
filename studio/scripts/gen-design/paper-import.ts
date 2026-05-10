/**
 * gen-design paper-import — Paper tree.json → enriched tree (옵션: chain inferChat → chat.md).
 *
 * 사용:
 *   gen-design paper-import <tree.json>
 *   gen-design paper-import <tree.json> --validate-only
 *   gen-design paper-import <tree.json> --chain inferChat --output chat.md
 *   gen-design paper-import --from-stdin --chain inferChat
 *
 * 옵션:
 *   --validate-only      검증만, 출력 없음
 *   --from-stdin         stdin 으로 tree.json 입력
 *   --output <path>      stdout 대신 파일 저장
 *   --chain inferChat    inferChat 까지 chain → chat.md 출력
 *   --threshold <0-1>    inferChat threshold (chain 시, 기본 0.8)
 *
 * 종료 코드: 0 (성공) / 1 (오류) / 2 (사용법 위반)
 */

export interface PaperImportArgs {
  file?: string;
  fromStdin?: boolean;
  validateOnly?: boolean;
  output?: string;
  chain?: "inferChat";
  threshold?: number;
  help?: boolean;
}

export function parsePaperImportArgs(argv: string[]): PaperImportArgs | { error: string } {
  const args: PaperImportArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--from-stdin") {
      args.fromStdin = true;
    } else if (a === "--validate-only") {
      args.validateOnly = true;
    } else if (a === "--output") {
      const next = argv[++i];
      if (!next) return { error: "--output requires a path argument" };
      args.output = next;
    } else if (a === "--chain") {
      const next = argv[++i];
      if (next !== "inferChat") return { error: `--chain only supports 'inferChat' (got '${next ?? "<missing>"}')` };
      args.chain = "inferChat";
    } else if (a === "--threshold") {
      const next = argv[++i];
      const val = parseFloat(next ?? "");
      if (isNaN(val) || val < 0 || val > 1) {
        return { error: "--threshold must be a number between 0 and 1" };
      }
      args.threshold = val;
    } else if (a.startsWith("--")) {
      return { error: `Unknown option: ${a}` };
    } else if (!args.file) {
      args.file = a;
    } else {
      return { error: `Unexpected argument: ${a}` };
    }
  }

  if (args.help) return args;
  if (!args.file && !args.fromStdin) {
    return { error: "Missing <tree.json> argument (or --from-stdin)" };
  }
  return args;
}

export function printPaperImportHelp(out: NodeJS.WriteStream = process.stdout): void {
  out.write(`Usage: gen-design paper-import <tree.json> [options]
       gen-design paper-import --from-stdin [options]

Options:
  --validate-only       Validate tree structure only (no output)
  --from-stdin          Read tree.json from stdin
  --output <path>       Write to file instead of stdout
  --chain inferChat     Chain to inferChat → chat.md output
  --threshold <0-1>     inferChat confident threshold (default: 0.8)
  --help, -h            Show this help

Examples:
  gen-design paper-import fixtures/paper-trees/scenes/login.tree.json
  gen-design paper-import tree.json --chain inferChat --output login.chat.md
  cat tree.json | gen-design paper-import --from-stdin --validate-only
`);
}
