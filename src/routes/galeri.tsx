import { createFileRoute } from "@tanstack/react-router";
import { images } from "@/lib/data";
import { PageBanner } from "@/components/site";

const items = [
  [images.hero, "Pembangunan"], [images.renovasi, "Renovasi"], [images.pendidikan, "Pendidikan Islam"],
  [images.kemanusiaan, "Kegiatan Sosial"], [images.renovasi, "Gotong Royong"], [images.hero, "Masjid Binaan"],
] as const;

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "Galeri — Masjid Nusantara" },
      { name: "description", content: "Dokumentasi pembangunan, renovasi, pendidikan Islam, dan kegiatan sosial." },
      { property: "og:title", content: "Galeri — Masjid Nusantara" },
      { property: "og:description", content: "Dokumentasi kegiatan Yayasan Masjid Nusantara." },
    ],
  }),
  component: () => (
    <>
      <PageBanner title="Galeri" subtitle="Dokumentasi perjalanan kami di pelosok nusantara." image={images.pendidikan} />
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-12 md:grid-cols-3">
        {items.map(([src, label], i) => (
          <figure key={i} className="group relative overflow-hidden rounded-xl">
            <img src={src} alt={label} loading="lazy" className="aspect-square w-full object-cover transition group-hover:scale-105" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold">{label}</figcaption>
          </figure>
        ))}
      </section>
    </>
  ),
});
