"use client";

import { useCallback, useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import { useChat } from "./useChat";

export function useInbox() {
  const { client, currentUser } = useChat();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInbox = useCallback(async () => {
    if (!client || !currentUser) return;

    try {
      setIsLoading(true);
      setError(null);

      const filters = {
        type: "messaging",
        members: {
          $in: [currentUser.id],
        },
      };

      const sort = {
        last_message_at: -1,
      };

      const result = await client.queryChannels(
        filters as never,
        sort as never,
        {
          watch: true,
          state: true,
          presence: true,
          limit: 50,
        },
      );

      setChannels(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải inbox.");
    } finally {
      setIsLoading(false);
    }
  }, [client, currentUser]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  useEffect(() => {
    if (!client) return;

    const refresh = () => {
      loadInbox();
    };

    client.on("message.new", refresh);
    client.on("notification.message_new", refresh);
    client.on("notification.mark_read", refresh);
    client.on("user.presence.changed", refresh);
    client.on("connection.changed", refresh);

    return () => {
      client.off("message.new", refresh);
      client.off("notification.message_new", refresh);
      client.off("notification.mark_read", refresh);
      client.off("user.presence.changed", refresh);
      client.off("connection.changed", refresh);
    };
  }, [client, loadInbox]);

  return {
    channels,
    isLoading,
    error,
    refresh: loadInbox,
  };
}