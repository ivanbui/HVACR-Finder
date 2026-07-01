"use client";

import type { Channel } from "stream-chat";
import { getProductSnapshotFromChannel } from "../services/trading-context";
import { useInbox } from "../hooks/useInbox";

type InboxProps = {
  activeChannelId?: string;
  onSelectChannel?: (channel: Channel) => void;
};

function getLastMessage(channel: Channel) {
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  return lastMessage?.text || "Chưa có tin nhắn.";
}

function getUnread(channel: Channel) {
  if (typeof channel.countUnread === "function") {
    return channel.countUnread();
  }

  return 0;
}

function formatTime(channel: Channel) {
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  const date = lastMessage?.created_at;

  if (!date) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function Inbox({ activeChannelId, onSelectChannel }: InboxProps) {
  const { channels, isLoading, error } = useInbox();

  return (
    <aside className="flex h-full min-h-[360px] flex-col border-r border-white/10 bg-[#11161a]">
      <div className="border-b border-white/10 px-4 py-4">
        <h1 className="text-[18px] font-black text-white">Tin nhắn</h1>
        <p className="mt-1 text-xs text-slate-500">
          Hội thoại mua bán trong HVACR Finder
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="px-4 py-5 text-sm text-slate-500">
            Đang tải inbox...
          </div>
        )}

        {error && <div className="px-4 py-5 text-sm text-red-300">{error}</div>}

        {!isLoading && !error && channels.length === 0 && (
          <div className="px-4 py-5 text-sm leading-6 text-slate-500">
            Chưa có cuộc trò chuyện nào.
          </div>
        )}

        {!isLoading &&
          !error &&
          channels.map((channel) => {
            const product = getProductSnapshotFromChannel(channel);
            const unread = getUnread(channel);
            const isActive = activeChannelId === channel.id;

            return (
              <button
                key={channel.cid}
                type="button"
                onClick={() => onSelectChannel?.(channel)}
                className={`flex w-full gap-3 border-b border-white/5 px-4 py-3 text-left transition ${
                  isActive ? "bg-sky-500/10" : "hover:bg-white/[0.04]"
                }`}
              >
                <img
                  src={product.productImage || "/demo-compressor.jpeg"}
                  alt={product.productName}
                  className="h-12 w-12 shrink-0 rounded-2xl bg-white object-contain p-1"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 text-[14px] font-black text-white">
                      {product.productName}
                    </p>
                    <span className="shrink-0 text-[11px] text-slate-500">
                      {formatTime(channel)}
                    </span>
                  </div>

                  <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-500">
                    {product.sellerName}
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="line-clamp-1 text-[12px] text-slate-400">
                      {getLastMessage(channel)}
                    </p>

                    {unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[11px] font-black text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </aside>
  );
}