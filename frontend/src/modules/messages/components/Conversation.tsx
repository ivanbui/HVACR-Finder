"use client";

import { useEffect, useRef, useState } from "react";
import type { Channel, MessageResponse } from "stream-chat";
import { useTyping } from "../hooks/useTyping";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

type UiMessage = {
  id?: string;
  text?: string;
  user?: {
    id?: string;
  };
};

type ConversationProps = {
  channel: Channel;
  currentUserId: string;
};

export function Conversation({ channel, currentUserId }: ConversationProps) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { isOtherTyping, startTyping, stopTyping } = useTyping({
    channel,
    currentUserId,
  });

  useEffect(() => {
    setMessages((channel.state.messages || []) as UiMessage[]);

    const handleNewMessage = (event: { message?: MessageResponse }) => {
      if (!event.message) return;

      setMessages((prev) => {
        const existed = prev.some((item) => item.id === event.message?.id);
        if (existed) return prev;

        return [...prev, event.message as UiMessage];
      });
    };

    channel.on("message.new", handleNewMessage);

    return () => {
      channel.off("message.new", handleNewMessage);
    };
  }, [channel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  async function handleSend(text: string) {
    try {
      setIsSending(true);
      await stopTyping();

      await channel.sendMessage({
        text,
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="rounded-3xl bg-white/5 p-4 text-sm leading-6 text-slate-300">
            Gợi ý: Anh có thể hỏi người bán về tồn kho, giá hiện tại, bảo hành
            hoặc phí giao hàng.
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || `message-${index}`}
            text={message.text}
            isMine={message.user?.id === currentUserId}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <TypingIndicator visible={isOtherTyping} />

      <Composer
        disabled={isSending}
        onSend={handleSend}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
      />
    </section>
  );
}