import { createFileRoute } from "@tanstack/react-router";
import { images } from "@/lib/data";
import { PageBanner } from "@/components/site";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — Masjid Nusantara" },
      { name: "description", content: "Sejarah, visi, misi, dan nilai Yayasan Masjid Nusantara." },
      { property: "og:title", content: "Tentang Kami — Masjid Nusantara" },
      { property: "og:description", content: "Membangun dan memakmurkan masjid di pelosok nusantara." },
    ],
  }),
  component: () => (
    <>
      <PageBanner title="Tentang Kami" subtitle="Membangun dan memakmurkan masjid di pelosok nusantara." image={images.renovasi} />
      <section className="mx-auto max-w-4xl space-y-10 px-4 py-12">
        <p className="text-lg leading-relaxed">
          Masjid Nusantara adalah lembaga profesional yang berfokus pada pembangunan, renovasi, dan pemakmuran masjid di daerah pelosok serta wilayah dengan keterbatasan akses sarana ibadah.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
            <h2 className="text-2xl font-bold text-gold">Visi</h2>
            <p className="mt-3">Membangun dan memakmurkan masjid di pelosok nusantara.</p>
          </div>
          <div className="rounded-2xl border bg-card p-8">
            <h2 className="text-2xl font-bold">Misi</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Membangun dan memperbaiki sarana ibadah yang layak dan kokoh.</li>
              <li>Memakmurkan masjid sebagai pusat kegiatan umat.</li>
              <li>Bekerja sama dalam penguatan peran dan fungsi masjid.</li>
            </ol>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Nilai Kami</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[["Amanah", "Setiap rupiah dilaporkan secara transparan."], ["Profesional", "Dikelola tim berpengalaman di lapangan."], ["Berkelanjutan", "Masjid dimakmurkan, bukan sekadar dibangun."]].map(([t, d]) => (
              <div key={t} className="rounded-xl border bg-card p-5"><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  ),
});
