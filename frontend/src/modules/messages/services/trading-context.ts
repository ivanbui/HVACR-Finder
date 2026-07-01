import type { Channel } from "stream-chat";
import type { ProductSnapshot, TradingContext } from "../types";

function getString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function getTradingContextFromChannel(channel: Channel): TradingContext | null {
  const data = channel.data as Record<string, unknown>;

  const buyerId = getString(data.buyer_id);
  const sellerId = getString(data.seller_id);
  const productId = getString(data.product_id);

  if (!buyerId || !sellerId || !productId) {
    return null;
  }

  return {
    buyerId,
    sellerId,
    productId,
  };
}

export function getProductSnapshotFromChannel(channel: Channel): ProductSnapshot {
  const data = channel.data as Record<string, unknown>;

  return {
    productId: getString(data.product_id, "unknown-product"),
    productName: getString(data.product_name, "Sản phẩm HVACR"),
    productImage: getString(data.product_image, "/demo-compressor.jpeg"),
    sellerId: getString(data.seller_id, "unknown-seller"),
    sellerName: getString(data.seller_name, "Người bán"),
    priceText: getString(data.price_text),
    subtitle: getString(data.product_subtitle),
  };
}
