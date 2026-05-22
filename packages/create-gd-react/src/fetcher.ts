import { mkdir, stat } from "node:fs/promises";
import { get as httpsGet } from "node:https";
import type { RequestOptions } from "node:https";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { x as tarExtract } from "tar";

const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * GitHub tarball stream 에서 `*-main/presets/<presetName>/` 의 내용만 추출하여
 * targetDir 에 풀어놓는다 (prefix 제거).
 *
 * GitHub tarball 구조 예: `gen-design-presets-main/presets/default/...`
 */
export async function extractPresetFromStream(
  stream: Readable,
  presetName: string,
  targetDir: string,
): Promise<void> {
  await mkdir(targetDir, { recursive: true });

  let extractedCount = 0;

  // tar.x 의 stream 모드 — gzip 자동 감지
  await pipeline(
    stream,
    tarExtract({
      cwd: targetDir,
      strict: false,
      // path filter: GitHub 의 *-main/presets/<presetName>/* 만 매칭
      filter: (path) => {
        const segments = path.split("/");
        // segments[0] = "<repo>-<branch>", segments[1] = "presets", segments[2] = "<presetName>"
        if (segments.length < 4) return false;
        if (segments[1] !== "presets") return false;
        if (segments[2] !== presetName) return false;
        extractedCount++;
        return true;
      },
      // prefix 제거: *-main/presets/<presetName>/foo → foo
      // tar 는 strip 옵션으로 처리 (3 단계 strip)
      strip: 3,
    }),
  );

  if (extractedCount === 0) {
    throw new Error(`preset '${presetName}' 을 tarball 에서 찾을 수 없습니다.`);
  }
}

/**
 * URL 에서 tarball stream 생성. https.get 으로 직접 호출 (외부 deps X).
 * 5xx / 3xx / 타임아웃 시 reject.
 */
export async function fetchTarballStream(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Readable> {
  return new Promise<Readable>((resolve, reject) => {
    const opts: RequestOptions = { headers: { "user-agent": "create-gd-react" } };
    const req = httpsGet(url, opts, (res) => {
      // 3xx redirect 따라가기
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        fetchTarballStream(next, timeoutMs).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode ?? "?"} — ${url}`));
        return;
      }
      resolve(res);
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`타임아웃 (${timeoutMs}ms) — ${url}`));
    });
    req.on("error", reject);
  });
}

/**
 * 통합 헬퍼: URL → tarball → preset 추출.
 */
export async function fetchAndExtractPreset(
  url: string,
  presetName: string,
  targetDir: string,
): Promise<void> {
  const stream = await fetchTarballStream(url);
  await extractPresetFromStream(stream, presetName, targetDir);
}

/**
 * 디렉토리가 비어있는지 확인 (force flag 사용 판단용).
 */
export async function isDirectoryEmpty(dir: string): Promise<boolean> {
  const exists = await stat(dir).catch(() => null);
  if (!exists) return true;
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir);
  return entries.length === 0;
}
