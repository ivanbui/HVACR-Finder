import Link from "next/link";

const posts = [
  {
    id: 1,
    source: "Kulthorn Vietnam",
    avatar: "K",
    type: "Tin doanh nghiệp",
    time: "15 phút trước",
    title: "Kulthorn WJ9460EK-SA còn hàng số lượng tốt",
    body: "Model R22, 220V/50Hz phù hợp thay thế cho nhiều hệ thống lạnh dân dụng và thương mại nhỏ.",
    image: "/demo-compressor.jpeg",
    likes: 48,
    comments: 12,
  },
  {
    id: 2,
    source: "HVACR Finder",
    avatar: "H",
    type: "Tin ngành",
    time: "2 giờ trước",
    title: "Giá vật tư điện lạnh có dấu hiệu tăng nhẹ",
    body: "Một số nhóm hàng như ống đồng, gas lạnh và linh kiện thay thế đang được nhiều nhà bán cập nhật lại giá.",
    image: null,
    likes: 86,
    comments: 24,
  },
  {
    id: 3,
    source: "Anh Bình - Thợ lạnh",
    avatar: "B",
    type: "Kỹ thuật",
    time: "Hôm nay",
    title: "Mẹo kiểm tra block trước khi thay mới",
    body: "Trước khi báo khách thay máy nén, nên kiểm tra dòng chạy, tụ, áp suất hút/xả và dấu hiệu kẹt cơ.",
    image: "/demo-compressor.jpeg",
    likes: 120,
    comments: 31,
  },
];

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-[#0f1316] text-white">
      <section className="mx-auto max-w-md px-4 pb-24 pt-4">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              HVACR Finder
            </p>
            <h1 className="mt-1 text-[28px] font-black leading-none">
              Feed ngành lạnh
            </h1>
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#20262b] text-xl">
            ＋
          </button>
        </header>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {["Tất cả", "Tin ngành", "Doanh nghiệp", "Kỹ thuật", "Hỏi đáp"].map(
            (item, index) => (
              <button
                key={item}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${
                  index === 0
                    ? "bg-sky-500 text-white"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div className="divide-y divide-white/10">
          {posts.map((post) => (
            <article key={post.id} className="py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sm font-black text-sky-300">
                  {post.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="line-clamp-1 text-[15px] font-black">
                      {post.source}
                    </h2>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{post.time}</span>
                    <span className="ml-auto text-slate-500">⋯</span>
                  </div>

                  <p className="mt-0.5 text-[12px] font-bold text-sky-400">
                    {post.type}
                  </p>
                </div>
              </div>

              <h3 className="mt-3 text-[18px] font-black leading-snug">
                {post.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-[14px] leading-6 text-slate-300">
                {post.body}
              </p>

              {post.image && (
                <div className="mt-3 rounded-3xl bg-white/5 p-3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="mx-auto h-44 w-full object-contain"
                  />
                </div>
              )}

              <div className="mt-3 flex items-center gap-5 text-[13px] font-bold text-slate-400">
                <button>❤️ {post.likes}</button>
                <button>💬 {post.comments}</button>
                <button>↗ Chia sẻ</button>
              </div>
            </article>
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
          <Link href="/companies" className="text-slate-400">
            🏢
            <br />
            Doanh nghiệp
          </Link>
          <Link href="/feed" className="text-sky-400">
            📰
            <br />
            Feed
          </Link>
        </div>
      </nav>
    </main>
  );
}
