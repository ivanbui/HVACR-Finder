"use client";

import { useEffect, useRef, useState } from "react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import Link from "next/link";

type ChatUser = {
  id: string;
  name: string;
  image?: string;
};

type UiMessage = {
  id?: string;
  text?: string;
  user?: {
    id?: string;
  };
};

export default function ChatPage() {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let chatClient: StreamChat | null = null;
    let chatChannel: StreamChannel | null = null;
    let isMounted = true;

    async function initChat() {
      try {
        const res = await fetch("/api/stream-token");
        const data = await res.json();

        chatClient = StreamChat.getInstance(data.apiKey);
        await chatClient.connectUser(data.user as ChatUser, data.token);

        const channelData = {
          members: ["buyer-demo", "seller-demo"],
          name: "Kulthorn WJ9460EK-SA",
          product_name: "Kulthorn WJ9460EK-SA",
          product_price: "4.200.000đ",
          seller_name: "MIANMI",
        } as Record<string, unknown>;

        chatChannel = chatClient.channel(
          "messaging",
          "hvacr-product-demo",
          channelData,
        );

        await chatChannel.watch();

        if (!isMounted) return;

        setClient(chatClient);
        setChannel(chatChannel);
        setMessages((chatChannel.state.messages || []) as UiMessage[]);
        setLoading(false);

        chatChannel.on("message.new", (event) => {
          if (event.message) {
            setMessages((prev) => [...prev, event.message as UiMessage]);
          }
        });
      } catch (error) {
        console.error("Init chat failed:", error);

        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initChat();

    return () => {
      isMounted = false;

      if (chatChannel) {
        chatChannel.stopWatching();
      }

      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!channel || !text.trim()) return;

    const body = text.trim();
    setText("");

    await channel.sendMessage({
      text: body,
    });
  }

  if (loading || !client || !channel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1316] text-white">
        Đang mở chat...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1316] text-white">
      <section className="mx-auto flex h-screen max-w-md flex-col">
        <header className="border-b border-white/10 bg-[#151a1f] px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl text-sky-400">
              ‹
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
              <img
                src="https://dummyimage.com/160x160/ffffff/0f766e.png&text=HVAC"
                alt="MIANMI"
                className="h-full w-full rounded-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="line-clamp-1 text-[16px] font-black">MIANMI</h1>
              <p className="text-[12px] text-slate-500">Đang hỏi sản phẩm</p>
            </div>

            <button className="text-xl text-slate-400">⋯</button>
          </div>

          <div className="mt-3 rounded-2xl bg-white/5 p-3">
            <div className="flex gap-3">
              <img
                src="/demo-compressor.jpeg"
                alt="Kulthorn WJ9460EK-SA"
                className="h-16 w-14 shrink-0 object-contain"
              />

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[14px] font-black text-sky-400">
                  Kulthorn WJ9460EK-SA
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  R22 | 220V/50Hz | 1HP
                </p>
                <p className="mt-1 text-[15px] font-black text-white">
                  4.200.000đ
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="rounded-3xl bg-white/5 p-4 text-sm leading-6 text-slate-300">
              Gợi ý: Anh có thể hỏi người bán về tồn kho, giá hiện tại, bảo hành
              hoặc phí giao hàng.
            </div>
          )}

          {messages.map((message, index) => {
            const isMine = message.user?.id === "buyer-demo";

            return (
              <div
                key={message.id || `message-${index}`}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-3xl px-4 py-3 text-[14px] leading-6 ${
                    isMine
                      ? "bg-sky-500 text-white"
                      : "bg-[#20262b] text-slate-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <footer className="border-t border-white/10 bg-[#151a1f] px-3 py-3">
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              placeholder="Nhập tin nhắn..."
              className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl bg-[#20262b] px-4 py-3 text-[14px] outline-none placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              className="h-11 rounded-2xl bg-sky-500 px-4 text-sm font-black text-white"
            >
              Gửi
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}