"use client";

import type { ProductContextData } from "../types";

type ProductContextProps = {
  product: ProductContextData;
};

export function ProductContext({ product }: ProductContextProps) {
  return (
    <div className="flex gap-3 border-b border-white/10 bg-white/[0.02] p-3">
      {product.productImage ? (
        <img
          src={product.productImage}
          alt={product.productName}
          className="h-14 w-14 rounded-2xl object-cover"
        />
      ) : (
        <div className="h-14 w-14 rounded-2xl bg-white/10" />
      )}

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{product.productName}</p>
        <p className="mt-1 text-xs text-white/50">{product.sellerName}</p>
        {product.priceText ? (
          <p className="mt-1 text-xs font-medium text-emerald-300">{product.priceText}</p>
        ) : null}
      </div>
    </div>
  );
}
