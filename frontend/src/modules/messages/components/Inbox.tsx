"use client";

import { useEffect, useMemo, useState } from "react";
import type { Channel } from "stream-chat";
import { useChat } from "../hooks/useChat";
import { useInbox } from "../hooks/useInbox";
import { mapChannelToInboxItem } from "../services/inbox-mapper";
import { InboxItem } from "./InboxItem";

type InboxProps = {
  activeChannelId?: string;
  refreshKey?: number;
  onSelectChannel?: (channel: Channel) => void;
};

type InboxFilter = "all" | "unread" | "online";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function Inbox({
  activeChannelId,
  refreshKey = 0,
  onSelectChannel,
}: InboxProps) {
  const { currentUser } = useChat();
  const { channels, isLoading, error, refresh } = useInbox();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InboxFilter>("all");

  useEffect(() => {
    refresh();
  }, [refreshKey, refresh]);

  const items = useMemo(() => {
    if (!currentUser) return [];

    return channels.map((channel) =>
      mapChannelToInboxItem(channel, currentUser.id),
    );
  }, [channels, currentUser]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      unread: items.filter((item) => item.unreadCount > 0).length,
      online: items.filter((item) => item.isOnline).length,
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    const keyword = normalizeText(query.trim());

    return items.filter((item) => {
      const matchFilter =
        filter === "all" ||
        (filter === "unread" && item.unreadCount > 0) ||
        (filter === "online" && item.isOnline);

      if (!matchFilter) return false;
      if (!keyword) return true;

      const searchable = normalizeText(
        [item.otherUserName, item.productName, item.lastMessageText].join(" "),
      );

      return searchable.includes(keyword);
    });
  }, [items, query, filter]);

  return (
    <aside className="flex h-full min-h-[360px] flex-col border-r border-white/10 bg-[#11161a]">
      <div className="border-b border-white/10 px-4 py-4">
        <h1 className="text-[18px] font-black text-white">Tin nhắn</h1>
        <p className="mt-1 text-xs text-slate-500">
          Hội thoại mua bán trong HVACR Finder
        </p>
      </div>

      <div className="border-b border-white/10 px-4 py-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm người mua, sản phẩm, tin nhắn..."
          className="w-full rounded-2xl bg-white/[0.06] px-3 py-2 text-[13px] text-slate-200 outline-none placeholder:text-slate-500"
        />

        <div className="mt-3 flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold ${
              filter === "all"
                ? "bg-sky-500 text-white"
                : "bg-white/[0.06] text-slate-400"
            }`}
          >
            Tất cả {counts.all}
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold ${
              filter === "unread"
                ? "bg-sky-500 text-white"
                : "bg-white/[0.06] text-slate-400"
            }`}
          >
            Chưa đọc {counts.unread}
          </button>

          <button
            type="button"
            onClick={() => setFilter("online")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold ${
              filter === "online"
                ? "bg-sky-500 text-white"
                : "bg-white/[0.06] text-slate-400"
            }`}
          >
            Online {counts.online}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="px-4 py-5 text-sm text-slate-500">
            Đang tải inbox...
          </div>
        )}

        {error && <div className="px-4 py-5 text-sm text-red-300">{error}</div>}

        {!isLoading && !error && visibleItems.length === 0 && (
          <div className="px-4 py-5 text-sm leading-6 text-slate-500">
            Không tìm thấy hội thoại phù hợp.
          </div>
        )}

        {!isLoading &&
          !error &&
          visibleItems.map((item) => (
            <InboxItem
              key={item.channel.cid}
              item={item}
              isActive={activeChannelId === item.channel.id}
              onSelect={onSelectChannel}
            />
          ))}
      </div>
    </aside>
  );
}