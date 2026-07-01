"use client";

import { useMessagesContext } from "../components/ChatProvider";

export function useChat() {
  return useMessagesContext();
}
