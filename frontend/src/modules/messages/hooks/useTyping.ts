"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Channel } from "stream-chat";

type UseTypingParams = {
  channel: Channel;
  currentUserId: string;
};

export function useTyping({ channel, currentUserId }: UseTypingParams) {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTyping = useCallback(async () => {
    if (localTypingTimer.current) {
      clearTimeout(localTypingTimer.current);
      localTypingTimer.current = null;
    }

    try {
      await channel.stopTyping();
    } catch {
      // ignore typing stop error
    }
  }, [channel]);

  const startTyping = useCallback(async () => {
    try {
      await channel.keystroke();
    } catch {
      // ignore typing start error
    }

    if (localTypingTimer.current) {
      clearTimeout(localTypingTimer.current);
    }

    localTypingTimer.current = setTimeout(() => {
      stopTyping();
    }, 1800);
  }, [channel, stopTyping]);

  useEffect(() => {
    const handleTypingStart = (event: { user?: { id?: string } }) => {
      if (event.user?.id === currentUserId) return;

      setIsOtherTyping(true);

      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
      }

      stopTimer.current = setTimeout(() => {
        setIsOtherTyping(false);
      }, 2500);
    };

    const handleTypingStop = (event: { user?: { id?: string } }) => {
      if (event.user?.id === currentUserId) return;
      setIsOtherTyping(false);
    };

    channel.on("typing.start", handleTypingStart);
    channel.on("typing.stop", handleTypingStop);

    return () => {
      channel.off("typing.start", handleTypingStart);
      channel.off("typing.stop", handleTypingStop);

      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
      }

      if (localTypingTimer.current) {
        clearTimeout(localTypingTimer.current);
      }
    };
  }, [channel, currentUserId]);

  return {
    isOtherTyping,
    startTyping,
    stopTyping,
  };
}
