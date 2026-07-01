"use client";

type OnlineBadgeProps = {
  isOnline?: boolean;
};

export function OnlineBadge({ isOnline = false }: OnlineBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
      <span
        className={[
          "h-2 w-2 rounded-full",
          isOnline ? "bg-emerald-400" : "bg-white/25",
        ].join(" ")}
      />
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}
