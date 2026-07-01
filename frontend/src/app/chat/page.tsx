"use client";

import { useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import {
  ChatProvider,
  Conversation,
  ConversationHeader,
  Inbox,
  getProductSnapshotFromChannel,
  useChat,
  useConversation,
  type ChatUser,
  type ProductSnapshot,
  type TradingContext,
} from "@/modules/messages";

const demoBuyer: ChatUser = {
  id: "buyer-demo",
  name: "Buyer Demo",
};

const demoTradingContext: TradingContext = {
  buyerId: "buyer-demo",
  sellerId: "seller-demo",
  productId: "kulthorn-wj9460ek-sa",
};

const demoProductSnapshot: ProductSnapshot = {
  productId: "kulthorn-wj9460ek-sa",
  productName: "Kulthorn WJ9460EK-SA",
  productImage: "/demo-compressor.jpeg",
  sellerId: "seller-demo",
  sellerName: "MIANMI",
  priceText: "4.200.000đ",
  subtitle: "R22 | 220V/50Hz | 1HP",
};

function ChatScreen() {
  const { client, isConnecting, error: chatError } = useChat();

  const {
    channel: defaultChannel,
    isLoading,
    error: conversationError,
  } = useConversation({
    context: demoTradingContext,
    snapshot: demoProductSnapshot,
  });

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const currentChannel = activeChannel || defaultChannel;
  const currentProduct = currentChannel
    ? getProductSnapshotFromChannel(currentChannel)
    : demoProductSnapshot;

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
          <ConversationHeader
            sellerName={currentProduct.sellerName}
            product={currentProduct}
          />

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