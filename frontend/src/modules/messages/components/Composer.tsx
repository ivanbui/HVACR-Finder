"use client";

import { useState } from "react";

type ComposerProps = {
  disabled?: boolean;
  onSend: (text: string) => Promise<void> | void;
};

export function Composer({ disabled = false, onSend }: ComposerProps) {
  const [text, setText] = useState("");

  async function handleSend() {
    const body = text.trim();
    if (!body || disabled) return;

    setText("");
    await onSend(body);
  }

  return (
    <footer className="border-t border-white/10 bg-[#151a1f] px-3 py-3">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={1}
          disabled={disabled}
          placeholder="Nhập tin nhắn..."
          className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl bg-[#20262b] px-4 py-3 text-[14px] outline-none placeholder:text-slate-500 disabled:opacity-50"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="h-11 rounded-2xl bg-sky-500 px-4 text-sm font-black text-white disabled:opacity-40"
        >
          Gửi
        </button>
      </div>
    </footer>
  );
}