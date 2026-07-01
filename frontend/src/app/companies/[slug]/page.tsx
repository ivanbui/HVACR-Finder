import Link from "next/link";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/catalog";

function formatVnd(value?: number | null) {
  if (!value) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function getSellerProducts(products: Product[], slug: string) {
  return products
    .map((product) => {
      const offers = product.offers.filter(
        (offer) => offer.seller.slug === slug
      );
      return offers.map((offer) => ({ product, offer }));
    })
    .flat();
}

function getTags(items: ReturnType<typeof getSellerProducts>) {
  return Array.from(
    new Set(
      items
        .map(({ product }) => [
          product.brand?.name,
          product.category?.name,
          product.refrigerant,
        ])
        .flat()
        .filter(Boolean) as string[]
    )
  ).slice(0, 6);
}

const demoReviews = [
  {
    id: 1,
    name: "Vũ",
    question: "Giòăng có màu gì?",
    answer:
      "Chào anh chị, giòăng bên em có các màu cơ bản: Trắng, Đen, Xám đậm, Xám nhạt ạ.",
    date: "4 tháng 4, 2026",
  },
  {
    id: 2,
    name: "Minh Khang",
    question: "Có CTKM gì ko em?",
    answer:
      "Dạ, em đã gửi chương trình khuyến mãi tháng này cho anh qua Zalo và email nhé. Anh kiểm tra giúp em ạ.",
    date: "4 tháng 4, 2026",
  },
  {
    id: 3,
    name: "Mi Mi",
    question: "Có Ron bắt vít không?",
    answer: "Dạ có nha anh chị.",
    date: "4 tháng 4, 2026",
  },
];

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const sellerItems = getSellerProducts(products, slug);
  const firstOffer = sellerItems[0]?.offer;
  const seller = firstOffer?.seller;

  if (!seller) {
    return (
      <main className="min-h-screen bg-[#0f1316] px-4 py-8 text-white">
        <p>Không tìm thấy doanh nghiệp.</p>
        <Link href="/companies" className="mt-4 block text-sky-400">
          ← Quay lại
        </Link>
      </main>
    );
  }

  const tags = getTags(sellerItems);

  const grouped = sellerItems.reduce<Record<string, typeof sellerItems>>(
    (acc, item) => {
      const category = item.product.category?.name || "Khác";
      acc[category] ||= [];
      acc[category].push(item);
      return acc;
    },
    {}
  );

  const groupCount = Object.keys(grouped).length;
  const ratingValue = seller.is_verified ? "5.0" : "4.6";

  return (
    <main className="min-h-screen bg-[#0f1316] text-white">
      <section className="mx-auto max-w-md pb-24">
        <div className="relative h-[220px] overflow-hidden bg-sky-300">
          <Link
            href="/companies"
            className="absolute left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/20 text-3xl text-white"
          >
            ‹
          </Link>

          <button className="absolute right-16 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-lg text-white">
            ⋯
          </button>

          <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-lg text-white">
            ✎
          </button>

          <div className="flex h-full items-center justify-center text-center">
            <div>
              <div className="text-6xl font-black text-white/90">HVAC</div>
              <div className="mt-1 text-sm tracking-[0.35em] text-white/80">
                COMPANY
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5">
          <div className="flex items-start gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2">
              <img
                src={
                  seller.logo_url ||
                  "https://dummyimage.com/160x160/ffffff/0f766e.png&text=HVAC"
                }
                alt={seller.shop_name}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="line-clamp-1 text-[24px] font-black uppercase leading-tight">
                  {seller.shop_name}
                </h1>

                {seller.is_verified && (
                  <span
                    title="HVACR Finder đã xác thực người bán"
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/10 text-sm font-black text-teal-300"
                  >
                    ✓
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-400">
                <span className="font-bold text-amber-400">★★★★★</span>
                <span className="font-bold text-white">{ratingValue}</span>
                <span className="text-slate-600">•</span>
                <span>234 đánh giá</span>
                <span className="text-slate-600">•</span>
                <span>1.2k 👁</span>
                <span className="text-slate-600">•</span>
                <span>86 ❤</span>
              </div>
              
          

              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-bold text-slate-400">
                <span className="text-teal-300">✓ Đã xác thực</span>
                <span>🏆 Premium Seller</span>
                <span>📅 Thành viên từ 2020</span>
                <span>⚡ Phản hồi &lt; 15 phút</span>
              </div>
            </div>
          </div>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <p className="mt-4 line-clamp-4 text-[14px] leading-6 text-slate-200">
            Nhà bán chuyên thiết bị, vật tư và linh kiện điện lạnh. Cung cấp
            máy nén, gas lạnh, vật tư kho lạnh và hỗ trợ khách hàng chọn đúng
            model phù hợp nhu cầu thực tế.
          </p>

          <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-3xl bg-white/5 py-3 text-center">
            <div>
              <p className="text-lg font-black">{sellerItems.length}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Sản phẩm</p>
            </div>
            <div>
              <p className="text-lg font-black">{groupCount}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Nhóm hàng</p>
            </div>
            <div>
              <p className="text-lg font-black">{ratingValue}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Đánh giá</p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-white/10 border-y border-white/10 text-[14px]">
            <div className="flex justify-between gap-4 py-3">
              <span className="text-slate-500">Địa chỉ</span>
              <span className="text-right text-slate-200">
                {seller.city || "Đang cập nhật"}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-3">
              <span className="text-slate-500">Website</span>
              <span className="text-right font-bold text-sky-400">
                hvacr-finder.vn/{seller.slug}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-3">
              <span className="text-slate-500">Số điện thoại</span>
              <span className="text-right text-slate-200">
                {seller.phone || "Liên hệ"}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-3">
              <span className="text-slate-500">Zalo</span>
              <span className="text-right text-slate-200">
                {seller.zalo || "Liên hệ"}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl">
                👩🏻‍🦰
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-slate-500">Người liên hệ</p>
                <p className="text-[14px] font-black text-white">Ms. Alice</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button className="rounded-2xl bg-sky-500 py-3 text-sm font-black text-white">
                Chat
              </button>
              <button className="rounded-2xl bg-white/10 py-3 text-sm font-black text-slate-200">
                Gọi
              </button>
              <button className="rounded-2xl bg-white/10 py-3 text-sm font-black text-slate-200">
                Zalo
              </button>
            </div>
          </div>


          <section className="mt-8 border-t border-white/10 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black">Đối tác / Thương hiệu</h2>
              <span className="text-[12px] text-slate-500">Đang phân phối</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {["Kulthorn", "Copeland", "Panasonic", "Bitzer", "Danfoss"].map(
                (brand) => (
                  <div
                    key={brand}
                    className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-slate-300"
                  >
                    {brand}
                  </div>
                )
              )}
            </div>
          </section>

          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#20262b] px-3 py-3">
              <span className="text-xl text-slate-400">⌕</span>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="Tìm sản phẩm trong doanh nghiệp..."
              />
            </div>

            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black">Danh mục SP</h2>

              <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-black text-white">
                + Add
              </button>
            </div>

            <div className="divide-y divide-white/10">
              {Object.entries(grouped).map(([categoryName, items]) => (
                <details key={categoryName} open className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-sky-400 group-open:hidden">
                        +
                      </span>
                      <span className="hidden text-lg text-sky-400 group-open:inline">
                        −
                      </span>
                      <span className="text-[15px] font-black text-sky-400">
                        {categoryName}
                      </span>
                      <span className="text-[13px] text-slate-500">
                        ({items.length})
                      </span>
                    </div>
                  </summary>

                  <div className="mt-2 divide-y divide-white/10 pl-5">
                    {items.map(({ product, offer }) => (
                      <Link
                        key={`${product.id}-${offer.id}`}
                        href={`/products/${product.slug}`}
                        className="flex gap-3 py-3 active:opacity-80"
                      >
                        <div className="flex h-[72px] w-[58px] shrink-0 items-center justify-center">
                          <img
                            src="/demo-compressor.jpeg"
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-1 text-[15px] font-black text-sky-400">
                            {product.model_code || product.name}
                          </h3>

                          <p className="mt-1 text-[12px] text-slate-400">
                            {product.refrigerant || "-"}{" "}
                            <span className="text-slate-600">|</span>{" "}
                            {product.voltage || "-"}{" "}
                            <span className="text-slate-600">|</span>{" "}
                            {product.horsepower || "N/A"}
                          </p>

                          <p className="mt-1 line-clamp-1 text-[12px] text-slate-300">
                            {product.short_description ||
                              "Sản phẩm điện lạnh đang có người bán."}
                          </p>

                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-[15px] font-black text-white">
                              {formatVnd(offer.price)}
                            </p>

                            <p className="text-[12px] font-bold text-slate-400">
                              Tồn {offer.stock_qty ?? "?"} {offer.unit}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-2xl text-slate-500">
                          ›
                        </div>
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <section className="mt-8 border-t border-white/10 pt-6">
            <h2 className="mb-4 text-xl font-black">Đánh giá tổng quan</h2>

            <div className="rounded-3xl bg-white/5 p-4">
              <div className="flex items-center gap-5">
                <div className="w-24 shrink-0 text-center">
                  <div className="text-5xl font-black leading-none">4.9</div>
                  <div className="mt-2 text-[15px] text-amber-400">★★★★★</div>
                  <div className="mt-1 text-[12px] text-slate-500">
                    20 đánh giá
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star, index) => {
                    const widths = [90, 12, 0, 0, 0];
                    const counts = [18, 2, 0, 0, 0];

                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-[12px] text-slate-400"
                      >
                        <span className="w-6">{star}★</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${widths[index]}%` }}
                          />
                        </div>
                        <span className="w-5 text-right">{counts[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 border-t border-white/10 pt-6">
            <h2 className="mb-5 text-xl font-black">Đánh giá & Hỏi đáp</h2>

            <div className="space-y-7">
              {demoReviews.map((review) => (
                <article key={review.id} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                    👤
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-black text-white">
                      {review.question}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="font-bold text-slate-300">
                        {review.name}
                      </span>
                      <span>•</span>
                      <span>{review.date}</span>
                      <button className="rounded-md bg-white/10 px-1.5 py-0.5 font-bold text-slate-300">
                        Trả lời
                      </button>
                    </div>

                    <div className="mt-3 border-l-2 border-sky-400/30 bg-white/[0.04] px-4 py-3">
                      <p className="text-[12px] font-bold text-slate-500">
                        {seller.shop_name.toUpperCase()} trả lời {review.name}
                      </p>

                      <p className="mt-2 text-[14px] leading-6 text-slate-200">
                        {review.answer}
                      </p>

                      <p className="mt-2 text-[12px] text-slate-500">
                        {seller.shop_name.toUpperCase()} Admin • {review.date}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-[#20262b]/95 px-4 py-2.5 backdrop-blur">
        <div className="grid grid-cols-3 text-center text-xs font-bold">
          <Link href="/" className="text-slate-400">
            🏠
            <br />
            Sản phẩm
          </Link>
          <Link href="/companies" className="text-sky-400">
            🏢
            <br />
            Doanh nghiệp
          </Link>
          <Link href="/account" className="text-slate-400">
            👤
            <br />
            Tài khoản
          </Link>
        </div>
      </nav>
    </main>
  );
}