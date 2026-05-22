import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import type { Plugin } from "vite";

export interface ChatEntry {
  id: string;
  name: string;
  fileType: "scene" | "component" | "shell";
  text: string;
  source: string;
}

export function scanChats(roots: string[]): ChatEntry[] {
  const entries: ChatEntry[] = [];

  for (const root of roots) {
    if (!existsSync(root)) continue;

    const source = basename(root);

    // _shell.chat.md
    const shellPath = join(root, "_shell.chat.md");
    if (existsSync(shellPath)) {
      entries.push({
        id: `${source}/_shell`,
        name: "_shell",
        fileType: "shell",
        text: readFileSync(shellPath, "utf-8"),
        source,
      });
    }

    // scenes/ + components/
    for (const subdir of ["scenes", "components"] as const) {
      const dir = join(root, subdir);
      if (!existsSync(dir)) continue;
      for (const entry of readdirSync(dir)) {
        if (!entry.endsWith(".chat.md")) continue;
        const abs = join(dir, entry);
        const name = basename(entry, ".chat.md");
        entries.push({
          id: `${source}/${subdir}/${name}`,
          name,
          fileType: subdir === "scenes" ? "scene" : "component",
          text: readFileSync(abs, "utf-8"),
          source,
        });
      }
    }
  }

  return entries;
}

export function chatApiPlugin(chatRoots: string[]): Plugin {
  return {
    name: "chat-api",
    configureServer(server) {
      server.middlewares.use("/api/chats", (_req, res) => {
        try {
          const entries = scanChats(chatRoots);
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(JSON.stringify(entries));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}
