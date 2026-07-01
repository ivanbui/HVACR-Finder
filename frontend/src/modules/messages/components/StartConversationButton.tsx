"use client";

import { ChatProvider } from "./ChatProvider";
import { useStartConversation } from "../hooks/useStartConversation";
import type { ChatUser, ProductSnapshot, TradingContext } from "../types";

type StartConversationButtonInnerProps = {
  context: TradingContext;
  snapshot: ProductSnapshot;
  className?: string;
};

function StartConversationButtonInner({
  context,
  snapshot,
  className,
}: StartConversationButtonInnerProps) {
  const { start, isStarting, error } = useStartConversation();

  return (
    <div>
      <button
        type="button"
        disabled={isStarting}
        onClick={() => start({ context, snapshot })}
        className={
          className ||
          "w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
        }
      >
        {isStarting ? "Đang mở chat..." : "Chat với người bán"}
      </button>

      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

type StartConversationButtonProps = {
  user: ChatUser;
  context: TradingContext;
  snapshot: ProductSnapshot;
  className?: string;
};

export function StartConversationButton({
  user,
  context,
  snapshot,
  className,
}: StartConversationButtonProps) {
  return (
    <ChatProvider user={user}>
      <StartConversationButtonInner
        context={context}
        snapshot={snapshot}
        className={className}
      />
    </ChatProvider>
  );
}
