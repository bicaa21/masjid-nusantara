import { createFileRoute } from "@tanstack/react-router";
import { images } from "@/lib/data";
import { fetchNews } from "@/lib/supabase-data";
import { DataError, DataLoading, PageBanner } from "@/components/site";

export const Route = createFileRoute("/berita")({
  loader: fetchNews,
  pendingComponent: DataLoading,
  errorComponent: DataError,
  head: () => ({
    meta: [
      { title: "Berita — Masjid Nusantara" },
      { name: "description", content: "Berita dan artikel kegiatan Yayasan Masjid Nusantara." },
      { property: "og:title", content: "Berita — Masjid Nusantara" },
      { property: "og:description", content: "Kabar terbaru dari lapangan." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const news = Route.useLoaderData();
  return (
    <>
      <PageBanner
        title="Berita"
        subtitle="Kabar terbaru dari masjid-masjid binaan kami."
        image={images.kemanusiaan}
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2">
        {news.map((n) => (
          <article key={n.title} className="overflow-hidden rounded-2xl border bg-card">
            <img
              src={n.image}
              alt=""
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-5">
              <div className="text-xs font-semibold text-gold">{n.date}</div>
              <h2 className="mt-1 text-lg font-bold">{n.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
