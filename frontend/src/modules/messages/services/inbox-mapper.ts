import type { Channel } from "stream-chat";
import { getProductSnapshotFromChannel } from "./trading-context";

export type InboxItemData = {
  channel: Channel;
  channelId: string;
  productName: string;
  productImage: string;
  otherUserName: string;
  otherUserImage?: string;
  otherUserInitial: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
};

function getLastMessage(channel: Channel) {
  return channel.state.messages[channel.state.messages.length - 1];
}

function formatMessageTime(date?: string | Date) {
  if (!date) return "";

  const messageDate = new Date(date);
  const now = new Date();

  const sameDay =
    messageDate.getFullYear() === now.getFullYear() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getDate() === now.getDate();

  if (sameDay) {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(messageDate);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(messageDate);
}

function getUnreadCount(channel: Channel) {
  if (typeof channel.countUnread === "function") {
    return channel.countUnread();
  }

  return 0;
}

function getOtherMember(channel: Channel, currentUserId: string) {
  const members = Object.values(channel.state.members || {});
  return members.find((member) => member.user?.id !== currentUserId);
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}

export function mapChannelToInboxItem(
  channel: Channel,
  currentUserId: string,
): InboxItemData {
  const product = getProductSnapshotFromChannel(channel);
  const lastMessage = getLastMessage(channel);
  const otherMember = getOtherMember(channel, currentUserId);

  const otherUserName =
    otherMember?.user?.name ||
    product.sellerName ||
    "Người dùng HVACR";

  return {
    channel,
    channelId: channel.id || channel.cid,
    productName: product.productName,
    productImage: product.productImage || "/demo-compressor.jpeg",
    otherUserName,
    otherUserImage: otherMember?.user?.image,
    otherUserInitial: getInitial(otherUserName),
    lastMessageText: lastMessage?.text || "Chưa có tin nhắn.",
    lastMessageTime: formatMessageTime(lastMessage?.created_at),
    unreadCount: getUnreadCount(channel),
    isOnline: Boolean(otherMember?.user?.online),
  };
}