"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StreamChat } from "stream-chat";
import { getBrowserStreamClient } from "../services/stream-client";
import { requestStreamToken } from "../services/stream-auth";
import type { ChatUser, MessagesContextValue } from "../types";

const MessagesContext = createContext<MessagesContextValue | null>(null);

type ChatProviderProps = {
  user: ChatUser;
  children: ReactNode;
};

export function ChatProvider({ user, children }: ChatProviderProps) {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function connect() {
      try {
        setIsConnecting(true);
        setError(null);

        const tokenData = await requestStreamToken(user);
        const streamClient = getBrowserStreamClient(tokenData.apiKey);

        if (streamClient.userID !== tokenData.user.id) {
          await streamClient.connectUser(tokenData.user, tokenData.token);
        }

        if (mounted) {
          setClient(streamClient);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Không thể kết nối chat.");
        }
      } finally {
        if (mounted) {
          setIsConnecting(false);
        }
      }
    }

    connect();

    return () => {
      mounted = false;
      // Không disconnect ở đây.
      // Nếu disconnect khi chuyển trang Product -> Messages,
      // Stream client sẽ mất token và gây lỗi sendMessage.
    };
  }, [user.id, user.name, user.image]);

  const value = useMemo<MessagesContextValue>(
    () => ({
      client,
      currentUser: user,
      isConnecting,
      error,
    }),
    [client, user, isConnecting, error],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessagesContext() {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error("useMessagesContext phải được dùng bên trong ChatProvider.");
  }

  return context;
}