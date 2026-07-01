"use client";

type OnlineBadgeProps = {
  isOnline?: boolean;
};

export function OnlineBadge({ isOnline = false }: OnlineBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
      <span
        className={`h-2 w-2 rounded-full ${
          isOnline ? "bg-emerald-400" : "bg-slate-600"
        }`}
      />
      {isOnline ? "Đang online" : "Offline"}
    </span>
  );
}