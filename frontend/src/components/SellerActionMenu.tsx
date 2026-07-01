"use client";

import { useState } from "react";
import type { ProductOffer } from "@/types/catalog";

export default function SellerActionMenu({ offer }: { offer: ProductOffer }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full px-2 py-1 text-2xl font-black text-slate-300"
      >
        ⋮
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
          <button className="absolute inset-0" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-md rounded-t-[30px] border border-white/10 bg-[#20262b] px-5 pb-6 pt-3 text-white shadow-2xl">
            <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-slate-500" />

            <div className="flex items-center gap-3">
              <img
                src={offer.seller.logo_url || "https://dummyimage.com/160x160/ffffff/0f766e.png&text=HVAC"}
                alt={offer.seller.shop_name}
                className="h-16 w-16 rounded-2xl bg-white object-cover"
              />

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black">{offer.seller.shop_name}</h3>
                  {offer.seller.is_verified && <span className="text-teal-400">✓</span>}
                </div>
                <p className="text-sm text-slate-300">
                  {offer.city || offer.seller.city || "Chưa rõ khu vực"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={offer.seller.phone ? `tel:${offer.seller.phone}` : "#"} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-xl">☎</div>
                <p className="font-black">Gọi điện</p>
                <p className="mt-1 text-sm text-slate-400">{offer.seller.phone || "Chưa có số"}</p>
              </a>

              <a href={offer.seller.zalo ? `https://zalo.me/${offer.seller.zalo}` : "#"} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-sm font-black">Zalo</div>
                <p className="font-black">Zalo</p>
                <p className="mt-1 text-sm text-slate-400">{offer.seller.zalo || "Chưa có Zalo"}</p>
              </a>

              <button className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-xl">💬</div>
                <p className="font-black">Chat</p>
                <p className="mt-1 text-sm text-slate-400">Với người bán</p>
              </button>

              <button className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-500 text-xl">🌐</div>
                <p className="font-black">Xem công ty</p>
                <p className="mt-1 text-sm text-slate-400">Thông tin chi tiết</p>
              </button>
            </div>

            <button onClick={() => setOpen(false)} className="mt-5 w-full rounded-2xl bg-white/10 py-4 font-black">
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}