"use client";

import { getCurrentChatUser } from "../services/current-user";

export function useCurrentChatUser() {
  return getCurrentChatUser();
}
