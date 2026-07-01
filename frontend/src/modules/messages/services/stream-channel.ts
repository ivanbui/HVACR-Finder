import type { StreamChat } from "stream-chat";
import type { ProductSnapshot, TradingContext } from "../types";

type GetTradingChannelParams = {
  client: StreamChat;
  context: TradingContext;
  snapshot?: ProductSnapshot;
};

export function buildTradingChannelId(context: TradingContext) {
  return `product-${context.productId}-buyer-${context.buyerId}-seller-${context.sellerId}`;
}

export async function getTradingChannel({
  client,
  context,
  snapshot,
}: GetTradingChannelParams) {
  const channelId = buildTradingChannelId(context);

  const channelData = {
    members: [context.buyerId, context.sellerId],
    buyer_id: context.buyerId,
    seller_id: context.sellerId,
    product_id: context.productId,

    product_name: snapshot?.productName,
    product_image: snapshot?.productImage,
    seller_name: snapshot?.sellerName,
    price_text: snapshot?.priceText,
    product_subtitle: snapshot?.subtitle,
  } as Record<string, unknown>;

  const channel = client.channel("messaging", channelId, channelData);

  await channel.watch();

  return channel;
}