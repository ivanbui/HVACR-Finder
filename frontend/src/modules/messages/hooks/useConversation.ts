"use client";

import { useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import { getTradingChannel } from "../services/stream-channel";
import type { ProductContextData } from "../types";
import { useChat } from "./useChat";

type UseConversationParams = {
  buyerId: string;
  sellerId: string;
  product: ProductContextData;
};

export function useConversation({ buyerId, sellerId, product }: UseConversationParams) {
  const { client } = useChat();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadChannel() {
      if (!client) return;

      try {
        setIsLoading(true);
        setError(null);

        const tradingChannel = await getTradingChannel({
          client,
          buyerId,
          sellerId,
          product,
        });

        if (mounted) {
          setChannel(tradingChannel);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Không thể mở cuộc trò chuyện.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadChannel();

    return () => {
      mounted = false;
    };
  }, [client, buyerId, sellerId, product.productId]);

  return {
    channel,
    isLoading,
    error,
  };
}
