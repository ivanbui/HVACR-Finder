"use client";

import { ChatProvider } from "./ChatProvider";
import { useStartConversation } from "../hooks/useStartConversation";
import { useChat } from "../hooks/useChat";
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
  const { client, isConnecting } = useChat();
  const { start, isStarting, error } = useStartConversation();

  const disabled = isConnecting || isStarting || !client;

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => start({ context, snapshot })}
        className={
          className ||
          "w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
        }
      >
        {isConnecting
          ? "Đang kết nối chat..."
          : isStarting
            ? "Đang mở chat..."
            : "Chat với người bán"}
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