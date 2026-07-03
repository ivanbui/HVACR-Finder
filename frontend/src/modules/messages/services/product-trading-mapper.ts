import type { ProductSnapshot, TradingContext } from "../types";

type ProductLike = {
  id?: string | number;
  slug?: string;
  name: string;
  image_url?: string | null;
};

type BuildTradingPayloadParams = {
  product: ProductLike;
  buyerId: string;
  sellerId?: string;
  sellerName?: string;
};

function getProductId(product: ProductLike) {
  return String(product.id || product.slug || product.name);
}

export function buildProductTradingPayload({
  product,
  buyerId,
  sellerId = "seller-demo",
  sellerName = "MIANMI",
}: BuildTradingPayloadParams) {
  const productId = getProductId(product);

  const context: TradingContext = {
    buyerId,
    sellerId,
    productId,
  };

  const snapshot: ProductSnapshot = {
    productId,
    productName: product.name,
    productImage: product.image_url || "/demo-compressor.jpeg",
    sellerId,
    sellerName,
    priceText: undefined,
    subtitle: undefined,
  };

  return {
    context,
    snapshot,
  };
}
