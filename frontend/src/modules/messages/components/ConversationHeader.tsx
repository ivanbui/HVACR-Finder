"use client";

type ConversationHeaderProps = {
  title: string;
  subtitle?: string;
};

export function ConversationHeader({ title, subtitle }: ConversationHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-white/50">{subtitle}</p> : null}
      </div>
    </header>
  );
}
