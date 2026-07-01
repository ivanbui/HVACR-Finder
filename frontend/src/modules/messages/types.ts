import type { Channel, StreamChat } from "stream-chat";

export type ChatUser = {
  id: string;
  name: string;
  image?: string;
};

export type TradingContext = {
  buyerId: string;
  sellerId: string;
  productId: string;
};

export type ProductSnapshot = {
  productId: string;
  productName: string;
  productImage?: string;
  sellerId: string;
  sellerName: string;
  priceText?: string;
  subtitle?: string;
};

export type ProductContextData = ProductSnapshot;

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