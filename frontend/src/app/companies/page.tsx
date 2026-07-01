import Link from "next/link";
import { getProducts } from "@/lib/api";

type SellerItem = {
  slug: string;
  shop_name: string;
  city?: string | null;
  phone?: string | null;
  zalo?: string | null;
  logo_url?: string | null;
  is_verified?: boolean;
  offerCount: number;
  tags: string[];
};

function uniq(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).slice(0, 6);
}

export default async function CompaniesPage() {
  const products = await getProducts();
  const sellerMap = new Map<string, SellerItem>();

  products.forEach((product) => {
    product.offers.forEach((offer) => {
      const seller = offer.seller;
      const key = seller.slug || seller.shop_name;
      const current = sellerMap.get(key);

      sellerMap.set(key, {
        slug: seller.slug,
        shop_name: seller.shop_name,
        city: seller.city,
        phone: seller.phone,
        zalo: seller.zalo,
        logo_url: seller.logo_url,
        is_verified: seller.is_verified,
        offerCount: (current?.offerCount || 0) + 1,
        tags: uniq([
          ...(current?.tags || []),
          product.brand?.name || "",
          product.category?.name || "",
          product.refrigerant || "",
          product.model_code || "",
        ]),
      });
    });
  });

  const sellers = Array.from(sellerMap.values());

  return (
    <main className="min-h-screen bg-[#0f1316] text-white">
      <section className="mx-auto max-w-md px-4 pb-24 pt-4">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-bold text-sky-400">
              ← Sản phẩm
            </Link>
            <h1 className="mt-1 text-[28px] font-black leading-none">
              Doanh nghiệp
            </h1>
          </div>

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
              placeholder="Tìm tên công ty, khu vực..."
            />
          </div>

          <button className="shrink-0 rounded-2xl bg-[#20262b] px-3 py-3 text-sm font-bold text-sky-400">
            Lọc
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-3 text-sm">
          <button className="font-bold text-sky-400">Uy tín ↑↓</button>
          <button className="text-slate-400">
            {sellers.length} doanh nghiệp
          </button>
        </div>

        <div className="divide-y divide-white/10">
          {sellers.map((seller) => (
            <Link
              key={seller.slug}
              href={`/companies/${seller.slug}`}
              className="flex gap-3 py-3 active:opacity-80"
            >
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-white p-2">
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
                <div className="flex items-center gap-1.5">
                  <h2 className="line-clamp-1 text-[15px] font-black leading-tight text-sky-400">
                    {seller.shop_name}
                  </h2>

                  {seller.is_verified && (
                    <span
                      title="HVACR Finder đã xác thực người bán"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-400/10 text-[11px] font-black text-teal-300"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[13px] text-slate-400">
                  {seller.city || "Chưa rõ khu vực"}
                </p>

                <p className="mt-1 line-clamp-2 text-[13px] leading-[18px] text-slate-200">
                  Nhà bán thiết bị, vật tư và linh kiện ngành điện lạnh.
                </p>

                <div className="mt-1 flex flex-wrap gap-x-1 gap-y-0.5 text-[11px] leading-4 text-slate-500">
                  {seller.tags.map((tag, index) => (
                    <span key={`${seller.slug}-${tag}`}>
                      {index > 0 && <span className="mx-1">•</span>}
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-[13px] font-bold text-white">
                    ★ {seller.is_verified ? "5.0" : "4.6"}
                    <span className="ml-1 font-normal text-slate-500">
                      ({seller.is_verified ? "28" : "9"})
                    </span>
                  </p>

                  <div className="flex shrink-0 items-center gap-2 text-[12px] font-bold text-slate-400">
                    <span
                      title={`${seller.offerCount} sản phẩm đang có người bán này`}
                      className="cursor-help"
                    >
                      {seller.offerCount} SP
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{seller.is_verified ? "Xác thực" : "Chưa xác thực"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-3xl text-slate-500">›</div>
            </Link>
          ))}
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