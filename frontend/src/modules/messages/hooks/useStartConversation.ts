"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { startConversation } from "../services/start-conversation";
import type { ProductSnapshot, TradingContext } from "../types";
import { useChat } from "./useChat";

export function useStartConversation() {
  const router = useRouter();
  const { client } = useChat();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start(params: {
    context: TradingContext;
    snapshot: ProductSnapshot;
  }) {
    if (!client) {
      setError("Chat chưa sẵn sàng.");
      return;
    }

    try {
      setIsStarting(true);
      setError(null);

      const result = await startConversation({
        client,
        context: params.context,
        snapshot: params.snapshot,
      });

      router.push(`/messages/${result.channelId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể mở chat.");
    } finally {
      setIsStarting(false);
    }
  }

  return {
    start,
    isStarting,
    error,
  };
}
