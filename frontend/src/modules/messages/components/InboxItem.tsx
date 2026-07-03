"use client";

import type { Channel } from "stream-chat";
import type { InboxItemData } from "../services/inbox-mapper";

type InboxItemProps = {
  item: InboxItemData;
  isActive?: boolean;
  onSelect?: (channel: Channel) => void;
};

export function InboxItem({ item, isActive = false, onSelect }: InboxItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.channel)}
      className={`group flex w-full gap-3 border-b border-white/5 px-4 py-3 text-left transition ${
        isActive
          ? "bg-sky-500/10 ring-1 ring-inset ring-sky-400/40"
          : "hover:bg-white/[0.04]"
      }`}
    >
      <div className="relative h-12 w-12 shrink-0">
        {item.otherUserImage ? (
          <img
            src={item.otherUserImage}
            alt={item.otherUserName}
            className="h-12 w-12 rounded-full bg-white object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-[15px] font-black text-white">
            {item.otherUserInitial}
          </div>
        )}

        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#11161a] ${
            item.isOnline ? "bg-emerald-400" : "bg-slate-600"
          }`}
        />

        <img
          src={item.productImage}
          alt={item.productName}
          className="absolute -bottom-1 -left-1 h-5 w-5 rounded-lg border border-white/10 bg-white object-contain p-0.5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`line-clamp-1 text-[14px] font-black ${
              item.unreadCount > 0 ? "text-white" : "text-slate-100"
            }`}
          >
            {item.otherUserName}
          </p>

          <span
            className={`shrink-0 text-[11px] ${
              item.unreadCount > 0 ? "text-sky-300" : "text-slate-500"
            }`}
          >
            {item.lastMessageTime}
          </span>
        </div>

        <p className="mt-0.5 line-clamp-1 text-[12px] text-sky-300">
          {item.productName}
        </p>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p
            className={`line-clamp-1 text-[12px] ${
              item.unreadCount > 0 ? "font-semibold text-slate-200" : "text-slate-500"
            }`}
          >
            {item.lastMessageText}
          </p>

          {item.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[11px] font-black text-white">
              {item.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}