"use client";

import { useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import { useChat } from "./useChat";

type UseOnlineStatusParams = {
  channel: Channel;
  currentUserId: string;
};

function getOtherMemberId(channel: Channel, currentUserId: string) {
  const members = Object.values(channel.state.members || {});
  const other = members.find((member) => member.user?.id !== currentUserId);

  return other?.user?.id || "";
}

function getMemberOnline(channel: Channel, userId: string) {
  if (!userId) return false;

  const members = Object.values(channel.state.members || {});
  const member = members.find((item) => item.user?.id === userId);

  return Boolean(member?.user?.online);
}

export function useOnlineStatus({
  channel,
  currentUserId,
}: UseOnlineStatusParams) {
  const { client } = useChat();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const otherMemberId = getOtherMemberId(channel, currentUserId);

    function refreshOnline() {
      setIsOnline(getMemberOnline(channel, otherMemberId));
    }

    refreshOnline();

    if (!client) return;

    client.on("user.presence.changed", refreshOnline);
    client.on("connection.changed", refreshOnline);

    return () => {
      client.off("user.presence.changed", refreshOnline);
      client.off("connection.changed", refreshOnline);
    };
  }, [client, channel, currentUserId]);

  return {
    isOnline,
  };
}
