"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChatProvider,
  Conversation,
  ConversationHeader,
  Inbox,
  getProductSnapshotFromChannel,
  getSellerTestUser,
  useChannelById,
  useOnlineStatus,
} from "@/modules/messages";

const sellerUser = getSellerTestUser();

function SellerMessageDetailScreen() {
  const params = useParams<{ channelId: string }>();
  const channelId = params.channelId;
  const router = useRouter();

  const [readRefreshKey, setReadRefreshKey] = useState(0);

  const { channel, isLoading, error } = useChannelById(channelId);

  const { isOnline } = useOnlineStatus({
    channel,
    currentUserId: sellerUser.id,
  });

  if (isLoading || !channel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1316] text-white">
        Seller đang mở hội thoại...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1316] px-6 text-center text-white">
        <div>
          <p className="text-lg font-black">Seller không thể mở hội thoại</p>
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
          <Inbox
            activeChannelId={channel.id}
            refreshKey={readRefreshKey}
            onSelectChannel={(nextChannel) => {
              if (nextChannel.id) {
                router.push(`/messages-seller/${nextChannel.id}`);
              }
            }}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <ConversationHeader
            sellerName="Buyer Demo"
            product={product}
            isOnline={isOnline}
          />

          <Conversation
            channel={channel}
            currentUserId={sellerUser.id}
            onRead={() => setReadRefreshKey((value) => value + 1)}
          />
        </div>
      </section>
    </main>
  );
}

export default function SellerMessageDetailPage() {
  return (
    <ChatProvider user={sellerUser}>
      <SellerMessageDetailScreen />
    </ChatProvider>
  );
}