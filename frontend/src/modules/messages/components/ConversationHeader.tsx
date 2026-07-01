"use client";

import Link from "next/link";
import type { ProductSnapshot } from "../types";
import { ProductContext } from "./ProductContext";

type ConversationHeaderProps = {
  sellerName: string;
  sellerImage?: string;
  product: ProductSnapshot;
};

export function ConversationHeader({
  sellerName,
  sellerImage,
  product,
}: ConversationHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#151a1f] px-4 py-3">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-2xl text-sky-400">
          ‹
        </Link>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
          <img
            src={
              sellerImage ||
              "https://dummyimage.com/160x160/ffffff/0f766e.png&text=HVAC"
            }
            alt={sellerName}
            className="h-full w-full rounded-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="line-clamp-1 text-[16px] font-black">{sellerName}</h1>
          <p className="text-[12px] text-slate-500">Đang hỏi sản phẩm</p>
        </div>

        <button className="text-xl text-slate-400">⋯</button>
      </div>

      <ProductContext product={product} />
    </header>
  );
}