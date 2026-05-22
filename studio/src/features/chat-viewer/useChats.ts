import { useEffect, useState } from "react";
import type { ChatEntry } from "./chatApiPlugin";

export type { ChatEntry };

export interface UseChatsResult {
  chats: ChatEntry[];
  loading: boolean;
  error: string | null;
}

function fixturesAsFallback(): ChatEntry[] {
  // prod build 에서는 FIXTURES 를 ChatEntry[] 형태로 변환
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { FIXTURES } = require("../preview/fixtures.generated") as {
      FIXTURES: Array<{ name: string; text: string }>;
    };
    return FIXTURES.map((f) => ({
      id: `fixtures/scenes/${f.name}`,
      name: f.name,
      fileType: "scene" as const,
      text: f.text,
      source: "fixtures",
    }));
  } catch {
    return [];
  }
}

export function useChats(): UseChatsResult {
  const [chats, setChats] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      setChats(fixturesAsFallback());
      setLoading(false);
      return;
    }

    fetch("/api/chats")
      .then((r) => {
        if (!r.ok) throw new Error(`/api/chats returned ${r.status}`);
        return r.json() as Promise<ChatEntry[]>;
      })
      .then((data) => {
        setChats(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return { chats, loading, error };
}
