"use client";

import type { ProductSnapshot } from "../types";

type ProductContextProps = {
  product: ProductSnapshot;
};

export function ProductContext({ product }: ProductContextProps) {
  return (
    <div className="mt-3 rounded-2xl bg-white/5 p-3">
      <div className="flex gap-3">
        <img
          src={product.productImage || "/demo-compressor.jpeg"}
          alt={product.productName}
          className="h-16 w-14 shrink-0 object-contain"
        />

        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-[14px] font-black text-sky-400">
            {product.productName}
          </p>

          {product.subtitle ? (
            <p className="mt-1 text-[12px] text-slate-400">{product.subtitle}</p>
          ) : null}

          {product.priceText ? (
            <p className="mt-1 text-[15px] font-black text-white">
              {product.priceText}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}