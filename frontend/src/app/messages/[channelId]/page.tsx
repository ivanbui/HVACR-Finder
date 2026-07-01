"use client";

import { useParams } from "next/navigation";
import type { Channel } from "stream-chat";
import {
  ChatProvider,
  Conversation,
  ConversationHeader,
  Inbox,
  getProductSnapshotFromChannel,
  useChannelById,
  useOnlineStatus,
  type ChatUser,
} from "@/modules/messages";

const demoBuyer: ChatUser = {
  id: "buyer-demo",
  name: "Buyer Demo",
};

function MessageDetailScreen() {
  const params = useParams<{ channelId: string }>();
  const channelId = params.channelId;

  const { channel, isLoading, error } = useChannelById(channelId);

  const { isOnline } = useOnlineStatus({
    channel,
    currentUserId: demoBuyer.id,
  });

  if (isLoading || !channel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1316] text-white">
        Đang mở hội thoại...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1316] px-6 text-center text-white">
        <div>
          <p className="text-lg font-black">Không thể mở hội thoại</p>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
        </div>
      </main>
    );
  }

  const product = getProductSnapshotFromChannel(channel);

  return (
    <main className="min-h-screen bg-[#0f1316] text-white">
      <section className="mx-auto flex h-screen max-w-5xl overflow-hidden border-x border-white/10">
        <div className="hidden w-[340px] shrink-0 md:block">
          <Inbox activeChannelId={channel.id} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <ConversationHeader
            sellerName={product.sellerName}
            product={product}
            isOnline={isOnline}
          />

          <Conversation channel={channel} currentUserId={demoBuyer.id} />
        </div>
      </section>
    </main>
  );
}

export default function MessageDetailPage() {
  return (
    <ChatProvider user={demoBuyer}>
      <MessageDetailScreen />
    </ChatProvider>
  );
}
