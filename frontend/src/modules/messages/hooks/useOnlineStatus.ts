"use client";

import { useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import { useChat } from "./useChat";

type UseOnlineStatusParams = {
  channel: Channel | null;
  currentUserId: string;
};

function getOtherUserId(channel: Channel, currentUserId: string) {
  const members = Object.values(channel.state.members || {});
  const other = members.find((member) => member.user?.id !== currentUserId);
  return other?.user?.id || "";
}

function isUserWatching(channel: Channel, userId: string) {
  const watchers = Object.values(channel.state.watchers || {});
  return watchers.some((watcher) => watcher.id === userId);
}

export function useOnlineStatus({
  channel,
  currentUserId,
}: UseOnlineStatusParams) {
  const { client } = useChat();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!client || !channel) {
      setIsOnline(false);
      return;
    }

    const otherUserId = getOtherUserId(channel, currentUserId);

    function refreshOnline() {
      if (!channel || !otherUserId) {
        setIsOnline(false);
        return;
      }

      const watching = isUserWatching(channel, otherUserId);
      const userOnline = Boolean(client?.state.users[otherUserId]?.online);

      setIsOnline(watching || userOnline);
    }

    refreshOnline();

    client.on("user.presence.changed", refreshOnline);
    client.on("connection.changed", refreshOnline);
    channel.on("user.watching.start", refreshOnline);
    channel.on("user.watching.stop", refreshOnline);
    channel.on("member.updated", refreshOnline);

    return () => {
      client.off("user.presence.changed", refreshOnline);
      client.off("connection.changed", refreshOnline);
      channel.off("user.watching.start", refreshOnline);
      channel.off("user.watching.stop", refreshOnline);
      channel.off("member.updated", refreshOnline);
    };
  }, [client, channel, currentUserId]);

  return { isOnline };
}