"use client";

import { useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import { useChat } from "./useChat";

export function useChannelById(channelId: string) {
  const { client } = useChat();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadChannel() {
      if (!client || !channelId) return;

      try {
        setIsLoading(true);
        setError(null);

        const nextChannel = client.channel("messaging", channelId);
        await nextChannel.watch({
          presence: true,
          watchers: {
            limit: 10,
          },
        });

        if (mounted) {
          setChannel(nextChannel);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Không thể tải hội thoại.");
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
  }, [client, channelId]);

  return {
    channel,
    isLoading,
    error,
  };
}
