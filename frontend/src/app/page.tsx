import Link from "next/link";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/catalog";

function formatVnd(value?: number | null) {
  if (!value) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function getLowestPrice(product: Product) {
  const prices = product.offers
    .map((offer) => offer.price)
    .filter((price): price is number => typeof price === "number");

  return prices.length ? Math.min(...prices) : null;
}

function priceFreshness(createdAt?: string) {
  if (!createdAt) return { text: "Chưa rõ", dot: "bg-red-400" };

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
  );

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (minutes < 60) {
    return {
      text: minutes <= 1 ? "Vừa cập nhật" : `${minutes} phút trước`,
      dot: "bg-emerald-400",
    };
  }

  if (hours < 24) return { text: `${hours} giờ trước`, dot: "bg-emerald-400" };
  if (days <= 7) return { text: `${days} ngày trước`, dot: "bg-amber-400" };
  if (days <= 30) return { text: `${days} ngày trước`, dot: "bg-orange-400" };

  return { text: `${months || 1} tháng trước`, dot: "bg-red-400" };
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#0f1316] text-white">
      <section className="mx-auto max-w-md px-4 pb-24 pt-4">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-[28px] font-black leading-none">
            <span className="text-sky-400">HVACR</span> Finder
          </h1>

          <div className="flex items-center gap-4 text-2xl text-white">
            <span>⌕</span>
            <span>☰</span>
          </div>
        </header>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-[#20262b] px-3 py-3">
            <span className="text-xl text-slate-400">⌕</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
              placeholder="Tìm model, gas, hãng..."
            />
          </div>

          <button className="shrink-0 rounded-2xl bg-[#20262b] px-3 py-3 text-sm font-bold text-sky-400">
            Lọc
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-3 text-sm">
          <button className="font-bold text-sky-400">Giá ↑↓</button>
          <button className="text-slate-400">Tăng dần / Giảm dần</button>
        </div>

        <div className="divide-y divide-white/10">
          {products.map((product) => {
            const lowestPrice = getLowestPrice(product);
            const freshness = priceFreshness(product.offers[0]?.created_at);

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex gap-3 py-3 active:opacity-80"
              >
                <div className="flex h-[96px] w-[78px] shrink-0 items-center justify-center">
                  <img
                    src="/demo-compressor.jpeg"
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-1 text-[17px] font-black leading-tight text-sky-400">
                    {product.model_code || product.name}
                  </h2>

                  <p className="mt-1 text-[13px] text-slate-400">
                    {product.refrigerant || "-"}{" "}
                    <span className="text-slate-600">|</span>{" "}
                    {product.voltage || "-"}{" "}
                    <span className="text-slate-600">|</span>{" "}
                    {product.horsepower || "N/A"}
                  </p>

                  <p className="mt-1 line-clamp-2 text-[13px] leading-[18px] text-slate-200">
                    {product.short_description ||
                      "Sản phẩm điện lạnh đang có người bán."}
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-[18px] font-black leading-tight text-white">
                      {formatVnd(lowestPrice)}
                    </p>

                    <div className="flex shrink-0 items-center gap-2 text-[12px] font-bold text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${freshness.dot}`}
                        />
                        {freshness.text}
                      </span>

                      <span className="text-slate-600">•</span>

                      <span
                        title={`${product.offers.length} nhà bán có sản phẩm này`}
                        className="cursor-help"
                      >
                        {product.offers.length} 👤
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-3xl text-slate-500">›</div>
              </Link>
            );
          })}
        </div>
      </section>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-[#20262b]/95 px-4 py-2.5 backdrop-blur">
        <div className="grid grid-cols-3 text-center text-xs font-bold">
          <Link href="/" className="text-sky-400">
            🏠
            <br />
            Sản phẩm
          </Link>
          <Link href="/companies" className="text-slate-400">
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