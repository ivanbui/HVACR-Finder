"use client";

export function Conversation() {
  return (
    <section className="flex min-h-[480px] flex-col rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 p-4">
        <p className="text-sm font-medium text-white">Conversation</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 text-sm text-white/50">
        Nội dung chat realtime sẽ được ghép ở Commit 4.
      </div>
    </section>
  );
}
