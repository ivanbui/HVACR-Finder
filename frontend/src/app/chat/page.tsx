"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import {
  ChatProvider,
  Conversation,
  Inbox,
  useChat,
  useConversation,
  type ChatUser,
  type ProductContextData,
} from "@/modules/messages";

const demoBuyer: ChatUser = {
  id: "buyer-demo",
  name: "Buyer Demo",
};

const demoSeller = {
  id: "seller-demo",
  name: "MIANMI",
};

const demoProduct: ProductContextData = {
  productId: "kulthorn-wj9460ek-sa",
  productName: "Kulthorn WJ9460EK-SA",
  productImage: "/demo-compressor.jpeg",
  sellerId: demoSeller.id,
  sellerName: demoSeller.name,
  priceText: "4.200.000đ",
};

function ChatScreen() {
  const { client, isConnecting, error: chatError } = useChat();

  const {
    channel: defaultChannel,
    isLoading,
    error: conversationError,
  } = useConversation({
    buyerId: demoBuyer.id,
    sellerId: demoSeller.id,
    product: demoProduct,
  });

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const currentChannel = activeChannel || defaultChannel;

  useEffect(() => {
    if (!defaultChannel || activeChannel) return;
    setActiveChannel(defaultChannel as Channel);
  }, [defaultChannel, activeChannel]);

  if (isConnecting || isLoading || !client || !currentChannel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1316] text-white">
        Đang mở chat...
      </main>
    );
  }

  if (chatError || conversationError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1316] px-6 text-center text-white">
        <div>
          <p className="text-lg font-black">Không thể mở chat</p>
          <p className="mt-2 text-sm text-slate-400">
            {chatError || conversationError}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1316] text-white">
      <section className="mx-auto flex h-screen max-w-5xl overflow-hidden border-x border-white/10">
        <div className="hidden w-[340px] shrink-0 md:block">
          <Inbox
            activeChannelId={currentChannel.id}
            onSelectChannel={setActiveChannel}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
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
                <h1 className="line-clamp-1 text-[16px] font-black">
                  {demoSeller.name}
                </h1>
                <p className="text-[12px] text-slate-500">Đang hỏi sản phẩm</p>
              </div>

              <button className="text-xl text-slate-400">⋯</button>
            </div>

            <div className="mt-3 rounded-2xl bg-white/5 p-3">
              <div className="flex gap-3">
                <img
                  src={demoProduct.productImage}
                  alt={demoProduct.productName}
                  className="h-16 w-14 shrink-0 object-contain"
                />

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[14px] font-black text-sky-400">
                    {demoProduct.productName}
                  </p>
                  <p className="mt-1 text-[12px] text-slate-400">
                    R22 | 220V/50Hz | 1HP
                  </p>
                  <p className="mt-1 text-[15px] font-black text-white">
                    {demoProduct.priceText}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <Conversation channel={currentChannel} currentUserId={demoBuyer.id} />
        </div>
      </section>
    </main>
  );
}

export default function ChatPage() {
  return (
    <ChatProvider user={demoBuyer}>
      <ChatScreen />
    </ChatProvider>
  );
}