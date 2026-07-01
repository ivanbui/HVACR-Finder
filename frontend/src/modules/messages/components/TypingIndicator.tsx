"use client";

type TypingIndicatorProps = {
  visible?: boolean;
  text?: string;
};

export function TypingIndicator({
  visible = false,
  text = "Đang nhập...",
}: TypingIndicatorProps) {
  if (!visible) return null;

  return (
    <div className="px-4 pb-2 text-[12px] text-slate-500">
      {text}
    </div>
  );
}