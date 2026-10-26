import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, MapPin, Target, Wallet, User } from "lucide-react";
import { programs, percent, rupiah } from "@/lib/data";
import { Progress } from "@/components/site";

export const Route = createFileRoute("/program/$slug")({
  loader: async ({ params }) => {
    const p = programs.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — Masjid Nusantara` : "Program — Masjid Nusantara" },
      { name: "description", content: loaderData?.excerpt ?? "Detail program Masjid Nusantara." },
      { property: "og:title", content: loaderData?.title ?? "Program Masjid Nusantara" },
      { property: "og:description", content: loaderData?.excerpt ?? "Detail program." },
    ],
  }),
  notFoundComponent: () => <div className="p-16 text-center">Program tidak ditemukan.</div>,
  errorComponent: ({ error }) => <div className="p-16 text-center">{error.message}</div>,
  component: Detail,
});

function Detail() {
  const p = Route.useLoaderData();
  const pct = percent(p);
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl">
        <img src={p.image} alt={p.title} className="aspect-[16/8] w-full object-cover" />
        <Link to="/program" className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-gold-foreground">
          <ArrowLeft className="h-4 w-4" /> {p.category}
        </Link>
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card text-primary"><Heart className="h-5 w-5" /></span>
      </div>
      <h1 className="mt-6 text-3xl font-bold">{p.title}</h1>
      <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {p.location}</p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm font-semibold"><span>Progress Penggalangan Dana</span><span>{pct}%</span></div>
        <Progress value={pct} />
        <p className="mt-2 text-xs text-muted-foreground">Progress pembangunan fisik: {p.buildProgress}%</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Target, l: "Target Dana", v: rupiah(p.target) },
          { icon: Wallet, l: "Terkumpul", v: rupiah(p.raised) },
          { icon: User, l: "Donatur", v: p.donors.toLocaleString("id-ID") },
        ].map(({ icon: I, l, v }) => (
          <div key={l} className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <I className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <div><div className="text-xs text-muted-foreground">{l}</div><div className="text-sm font-bold">{v}</div></div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-bold">Tentang Program</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">{p.description}</p>

      <h2 className="mt-8 text-xl font-bold">Riwayat Perkembangan</h2>
      <ol className="mt-3 border-l-2 border-gold pl-5">
        {p.updates.map((u) => (
          <li key={u.date} className="mb-4">
            <div className="text-xs font-semibold text-gold">{u.date}</div>
            <div className="text-sm">{u.text}</div>
          </li>
        ))}
      </ol>

      <Link to="/donasi" search={{ program: p.slug }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 font-semibold text-gold-foreground shadow-soft">
        Donasi Sekarang <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
