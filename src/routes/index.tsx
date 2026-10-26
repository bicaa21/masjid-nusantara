import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Landmark, Hammer, ShieldCheck, HandHeart } from "lucide-react";
import { images, programs } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Masjid Nusantara — Bersama Menguatkan Masjid di Seluruh Nusantara" },
      { name: "description", content: "Dukung pembangunan, renovasi, dan pemakmuran masjid di pelosok Indonesia bersama Yayasan Masjid Nusantara." },
      { property: "og:title", content: "Masjid Nusantara — Bersama Menguatkan Masjid" },
      { property: "og:description", content: "Pembangunan, renovasi, dan pemakmuran masjid di pelosok nusantara." },
    ],
  }),
  component: Index,
});

const cats = [
  { icon: Landmark, label: "Pembangunan Masjid" },
  { icon: Hammer, label: "Renovasi Masjid" },
  { icon: ShieldCheck, label: "Program Pemberdayaan" },
  { icon: HandHeart, label: "Bantuan Kemanusiaan" },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={images.hero} alt="Masjid kayu di pegunungan" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-32 pt-16 md:pb-40 md:pt-24">
          <h1 className="max-w-md text-4xl font-bold leading-tight text-primary-foreground md:text-5xl">
            Bersama Menguatkan Masjid di Seluruh Nusantara
          </h1>
          <p className="mt-5 max-w-sm text-primary-foreground/85">
            Dukung pembangunan, renovasi, dan pemakmuran masjid di pelosok serta wilayah dengan keterbatasan akses sarana ibadah.
          </p>
          <Link to="/donasi" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-soft transition hover:brightness-105">
            Donasi Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-10 flex flex-wrap gap-8 text-primary-foreground">
            {[["128", "Masjid dibangun"], ["342", "Masjid direnovasi"], ["85.000+", "Penerima manfaat"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-2xl font-bold text-gold">{n}</div>
                <div className="text-xs text-primary-foreground/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4">
        <div className="grid grid-cols-2 rounded-2xl border bg-card p-3 shadow-soft md:grid-cols-4">
          {cats.map(({ icon: Icon, label }) => (
            <Link key={label} to="/program" className="flex flex-col items-center gap-3 rounded-xl px-3 py-6 text-center transition hover:bg-muted md:border-r md:last:border-0">
              <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <span className="text-sm text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-foreground">Program Unggulan</h2>
          <Link to="/program" className="flex items-center gap-1 text-sm font-semibold text-gold">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {programs.slice(0, 4).map((p) => (
            <Link key={p.slug} to="/program/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-xl border bg-card transition hover:shadow-soft">
              <img src={p.image} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition group-hover:scale-105" />
              <p className="p-3 text-sm text-foreground">{p.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
