import Link from "next/link";
import { getProduct } from "@/lib/api";
import SellerActionMenu from "@/components/SellerActionMenu";
import { StartConversationButton } from "@/modules/messages";

function formatVnd(value?: number | null) {
  if (!value) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function priceFreshness(createdAt?: string) {
  if (!createdAt) {
    return {
      text: "Chưa rõ thời gian cập nhật",
      dot: "bg-red-400",
      textColor: "text-red-300",
    };
  }

  const diffMs = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (minutes < 60) {
    return {
      text: minutes <= 1 ? "Vừa cập nhật" : `${minutes} phút trước`,
      dot: "bg-emerald-400",
      textColor: "text-emerald-300",
    };
  }

  if (hours < 24) {
    return {
      text: `${hours} giờ trước`,
      dot: "bg-emerald-400",
      textColor: "text-emerald-300",
    };
  }

  if (days <= 7) {
    return {
      text: `${days} ngày trước`,
      dot: "bg-amber-400",
      textColor: "text-amber-300",
    };
  }

  if (days <= 30) {
    return {
      text: `${days} ngày trước`,
      dot: "bg-orange-400",
      textColor: "text-orange-300",
    };
  }

  return {
    text: `${months || 1} tháng trước`,
    dot: "bg-red-400",
    textColor: "text-red-300",
  };
}

function productImage(productName: string, imageUrl?: string | null) {
  return (
    imageUrl ||
    `https://dummyimage.com/720x720/2b3137/e5e7eb.png&text=${encodeURIComponent(
      productName
    )}`
  );
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const mainImage = productImage(product.name, product.image_url);

  return (
    <main className="min-h-screen bg-[#15191d] text-white">
      <section className="mx-auto max-w-md px-4 pb-24 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-teal-400">
            ← Quay lại
          </Link>
          <div className="flex gap-4 text-xl text-slate-200">♡ ⤴</div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#20262b] p-5 shadow-xl">
          <div className="rounded-3xl bg-[#e5e7eb] p-4">
            <img
              src={mainImage}
              alt={product.name}
              className="mx-auto h-64 w-full object-contain"
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-[#2b3137] p-2"
              >
                <img
                  src={mainImage}
                  alt={`${product.name} ${i + 1}`}
                  className="h-16 w-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.brand?.name && (
              <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
                {product.brand.name}
              </span>
            )}
            {product.refrigerant && (
              <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
                {product.refrigerant}
              </span>
            )}
            {product.voltage && (
              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                {product.voltage}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-black leading-tight">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Model: {product.model_code || "Đang cập nhật"} ·{" "}
            {product.horsepower || "N/A"}
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            {product.short_description}
          </p>

          <div className="mt-5 border-t border-white/10 pt-4">
            <h2 className="mb-3 font-black">Thông số kỹ thuật</h2>

            <div className="grid gap-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Gas</span>
                <span className="font-bold">{product.refrigerant || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Công suất</span>
                <span className="font-bold">{product.horsepower || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Điện áp</span>
                <span className="font-bold">{product.voltage || "-"}</span>
              </div>
            </div>
          </div>

          <button className="mt-5 w-full rounded-2xl border border-teal-500 py-4 font-black text-teal-300">
            📄 Hồ sơ kỹ thuật (PDF)
          </button>

          <button className="mt-3 w-full rounded-2xl bg-teal-500 py-4 font-black text-white">
            Xem {product.offers.length} người bán
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-xl font-black">
            {product.offers.length} người bán đang có
          </h2>
        </div>

        <StartConversationButton
          user={{
            id: "buyer-demo",
            name: "Buyer Demo",
          }}
          context={{
            buyerId: "buyer-demo",
            sellerId: "seller-demo",
            productId: String(product.id || product.slug),
          }}
          snapshot={{
            productId: String(product.id || product.slug),
            productName: product.name,
            productImage: product.image_url || "/demo-compressor.jpeg",
            sellerId: "seller-demo",
            sellerName: "MIANMI",
            priceText: undefined,
            subtitle: undefined,
          }}
        />

        <div className="mt-3 grid gap-4">
          {product.offers.map((offer) => {
            const freshness = priceFreshness(offer.created_at);

            return (
              <article
                key={offer.id}
                className="overflow-visible rounded-[28px] border border-white/10 bg-[#20262b] p-4 shadow-xl"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-2xl bg-[#e5e7eb] object-contain p-1"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-lg font-black">
                            {offer.seller.shop_name}
                          </h3>

                          {offer.seller.is_verified && (
                            <span className="group relative inline-flex">
                              <span className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-teal-400/10 text-sm font-black text-teal-300">
                                ✓
                              </span>

                              <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#111418] p-3 text-xs leading-5 text-slate-200 opacity-0 shadow-2xl transition group-hover:opacity-100">
                                HVACR Finder đã xác thực người bán
                              </span>
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-400">
                          {offer.city || offer.seller.city || "Chưa rõ khu vực"}
                        </p>

                        <p className="mt-2 text-sm text-slate-300">
                          <span className="text-amber-400">★</span>{" "}
                          {offer.seller.is_verified ? "5.0" : "4.6"}{" "}
                          <span className="text-slate-500">
                            ({offer.seller.is_verified ? "28" : "9"})
                          </span>
                        </p>
                      </div>

                      <SellerActionMenu offer={offer} />
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-slate-500">
                            Giá tham khảo
                          </p>

                          <span className="group relative inline-flex">
                            <span className="-mt-1 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-500 text-[10px] font-black text-slate-300">
                              i
                            </span>

                            <span className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-60 rounded-2xl border border-white/10 bg-[#111418] p-3 text-xs leading-5 text-slate-200 opacity-0 shadow-2xl transition group-hover:opacity-100">
                              Giá có thể thay đổi theo thời điểm. Vui lòng xác
                              nhận với người bán trước khi giao dịch.
                            </span>
                          </span>
                        </div>

                        <p className="mt-1 text-xl font-black text-teal-400">
                          {formatVnd(offer.price)}
                        </p>

                        <div
                          className={`mt-1 flex items-center gap-1.5 text-xs font-bold ${freshness.textColor}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${freshness.dot}`}
                          />
                          {freshness.text}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">Tồn</p>
                        <p className="mt-1 text-sm font-bold text-slate-300">
                          {offer.stock_qty ?? "Liên hệ"} {offer.unit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
                        Free ship toàn quốc
                      </span>

                      {offer.warranty && (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                          BH {offer.warranty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="font-bold text-white">Ưu tiên người bán xác thực</p>
          <p className="mt-1">
            Thông tin giá chỉ để tham khảo, hai bên tự giao dịch.
          </p>
        </div>
      </section>
    </main>
  );
}