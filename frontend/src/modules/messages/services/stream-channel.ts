import type { StreamChat } from "stream-chat";
import type { ProductContextData } from "../types";

type GetTradingChannelParams = {
  client: StreamChat;
  buyerId: string;
  sellerId: string;
  product: ProductContextData;
};

export async function getTradingChannel({
  client,
  buyerId,
  sellerId,
  product,
}: GetTradingChannelParams) {
  const channelId = `product-${product.productId}-buyer-${buyerId}-seller-${sellerId}`;

  const channelData = {
    members: [buyerId, sellerId],
    product_id: product.productId,
    product_name: product.productName,
    product_image: product.productImage,
    seller_id: sellerId,
    seller_name: product.sellerName,
    price_text: product.priceText,
  } as Record<string, unknown>;

  const channel = client.channel("messaging", channelId, channelData);

  await channel.watch();

  return channel;
}