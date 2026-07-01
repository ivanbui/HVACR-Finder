import type { ChatTokenResponse, ChatUser } from "../types";

export async function requestStreamToken(user: ChatUser): Promise<ChatTokenResponse> {
  const response = await fetch("/api/stream/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });

  if (!response.ok) {
    throw new Error("Không thể lấy Stream token.");
  }

  return response.json();
}
