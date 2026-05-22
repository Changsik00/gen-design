import { mkdir, cp, stat } from "node:fs/promises";

/**
 * preset 디렉토리의 모든 파일을 target 으로 recursive 복사.
 * dot-prefixed 디렉토리 (.claude/, .gd/) 도 포함.
 * 변환 없이 그대로 복사 (placeholder 치환은 postprocess 단계).
 */
export async function copyPreset(source: string, target: string): Promise<void> {
  const sourceStat = await stat(source).catch(() => null);
  if (!sourceStat || !sourceStat.isDirectory()) {
    throw new Error(`preset 디렉토리를 찾을 수 없습니다: ${source}`);
  }

  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true });
}
