"use client";

type MessageBubbleProps = {
  text?: string;
  isMine?: boolean;
};

export function MessageBubble({ text, isMine = false }: MessageBubbleProps) {
  if (!text) return null;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-3xl px-4 py-3 text-[14px] leading-6 ${
          isMine ? "bg-sky-500 text-white" : "bg-[#20262b] text-slate-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
}