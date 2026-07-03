import type { ChatUser } from "../types";

export function getCurrentChatUser(): ChatUser {
  return {
    id: "buyer-demo",
    name: "Buyer Demo",
  };
}

export function getSellerTestUser(): ChatUser {
  return {
    id: "seller-demo",
    name: "MIANMI",
  };
}
