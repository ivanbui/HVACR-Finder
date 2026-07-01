"use client";

type TypingIndicatorProps = {
  visible?: boolean;
};

export function TypingIndicator({ visible = false }: TypingIndicatorProps) {
  if (!visible) return null;

  return <p className="px-4 py-2 text-xs text-white/40">Đang nhập...</p>;
}
