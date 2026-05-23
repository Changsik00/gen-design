export interface ScaffoldOptions {
  /** 생성할 디렉토리 이름 (= 프로젝트 이름) */
  projectName: string;

  /** preset 이름 (기본 "default") */
  preset: string;

  /** GitHub preset repo URL (기본: gen-design/presets) */
  presetRepo: string;

  /** true 면 네트워크 미사용, presets-bundled/ 에서 복사 */
  offline: boolean;

  /** true 면 기존 디렉토리가 비어있지 않아도 진행 */
  force: boolean;

  /** true 면 `pnpm install` 건너뜀 */
  noInstall: boolean;

  /** 절대 경로 — 생성될 프로젝트의 위치 */
  targetDir: string;
}

export interface ParsedArgs {
  projectName: string | undefined;
  preset: string;
  presetRepo: string;
  offline: boolean;
  force: boolean;
  noInstall: boolean;
  help: boolean;
  version: boolean;
}

export type ScaffoldResult =
  | { ok: true; targetDir: string; usedOffline: boolean }
  | { ok: false; reason: ScaffoldErrorReason; detail?: string };

export type ScaffoldErrorReason =
  | "dir-exists"
  | "network-failed"
  | "preset-not-found"
  | "extract-failed"
  | "install-failed"
  | "invalid-name";
