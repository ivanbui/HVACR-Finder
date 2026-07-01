"use client";

type MessageBubbleProps = {
  text: string;
  isMine?: boolean;
};

export function MessageBubble({ text, isMine = false }: MessageBubbleProps) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[78%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
          isMine ? "bg-emerald-500 text-black" : "bg-white/10 text-white",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}
