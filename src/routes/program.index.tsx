import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { images, programs, categories } from "@/lib/data";
import { PageBanner, ProgramRow } from "@/components/site";

const PER_PAGE = 4;

export const Route = createFileRoute("/program/")({
  validateSearch: (s: Record<string, unknown>) => ({
    kategori: typeof s.kategori === "string" ? s.kategori : "Semua",
    q: typeof s.q === "string" ? s.q : "",
    page: Number(s.page) || 1,
  }),
  head: () => ({
    meta: [
      { title: "Program Kami — Masjid Nusantara" },
      { name: "description", content: "Program pembangunan, renovasi, pemberdayaan, dan kemanusiaan Yayasan Masjid Nusantara." },
      { property: "og:title", content: "Program Kami — Masjid Nusantara" },
      { property: "og:description", content: "Wujud nyata untuk masjid yang lebih baik dan umat yang lebih kuat." },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { kategori, q, page } = Route.useSearch();
  const navigate = useNavigate({ from: "/program/" });
  const filtered = programs.filter(
    (p) => (kategori === "Semua" || p.category === kategori) && p.title.toLowerCase().includes(q.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <PageBanner title="Program Kami" subtitle="Wujud nyata untuk masjid yang lebih baik dan umat yang lebih kuat." image={images.hero} />
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => navigate({ search: (prev) => ({ ...prev, kategori: c.value, page: 1 }) })}
                className={`rounded-full border px-4 py-2 text-sm transition ${kategori === c.value ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => navigate({ search: (prev) => ({ ...prev, q: e.target.value, page: 1 }), replace: true })}
              placeholder="Cari program..."
              className="w-40 bg-transparent text-sm outline-none"
            />
          </label>
        </div>
        <div className="mt-4">
          {shown.length ? shown.map((p) => <ProgramRow key={p.slug} p={p} />) : (
            <p className="py-12 text-center text-muted-foreground">Program tidak ditemukan.</p>
          )}
        </div>
        {pages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => navigate({ search: (prev) => ({ ...prev, page: n }) })}
                className={`h-9 w-9 rounded-full text-sm ${n === page ? "bg-primary text-primary-foreground" : "border bg-card"}`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
