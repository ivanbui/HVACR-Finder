"use client";

export function Composer() {
  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center gap-2 rounded-2xl bg-white/[0.06] p-2">
        <input
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/35"
          placeholder="Nhập tin nhắn..."
          disabled
        />
        <button
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white/60"
          disabled
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
