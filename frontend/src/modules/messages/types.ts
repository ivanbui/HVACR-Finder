import type { Channel, StreamChat } from "stream-chat";

export type ChatUser = {
  id: string;
  name: string;
  image?: string;
};

export type ProductContextData = {
  productId: string;
  productName: string;
  productImage?: string;
  sellerId: string;
  sellerName: string;
  priceText?: string;
};

export type ChatTokenResponse = {
  apiKey: string;
  token: string;
  user: ChatUser;
};

export type MessagesContextValue = {
  client: StreamChat | null;
  currentUser: ChatUser | null;
  isConnecting: boolean;
  error: string | null;
};

export type ConversationChannel = Channel;
