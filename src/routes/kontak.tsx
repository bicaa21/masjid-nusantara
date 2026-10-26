import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — Masjid Nusantara" },
      { name: "description", content: "Hubungi Yayasan Masjid Nusantara." },
      { property: "og:title", content: "Kontak — Masjid Nusantara" },
      { property: "og:description", content: "Email, telepon, dan alamat Yayasan Masjid Nusantara." },
    ],
  }),
  component: Kontak,
});

function Kontak() {
  const [sent, setSent] = useState(false);
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Hubungi Kami</h1>
        <p className="mt-3 text-muted-foreground">Punya pertanyaan atau ingin mengusulkan masjid untuk dibantu? Kami siap mendengar.</p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex gap-3"><Mail className="h-5 w-5 text-gold" /> info@masjidnusantara.org</li>
          <li className="flex gap-3"><Phone className="h-5 w-5 text-gold" /> +62 812-0000-0000</li>
          <li className="flex gap-3"><MapPin className="h-5 w-5 text-gold" /> Jakarta, Indonesia</li>
        </ul>
        <div className="mt-6 flex gap-3 text-primary">
          <Instagram className="h-5 w-5" /><Facebook className="h-5 w-5" /><Youtube className="h-5 w-5" />
        </div>
      </div>
      {sent ? (
        <div className="rounded-2xl border bg-card p-8">Terima kasih, pesan Anda sudah kami terima.</div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3 rounded-2xl border bg-card p-6">
          <input required placeholder="Nama" className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email" className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          <textarea required placeholder="Pesan" rows={5} className="w-full rounded-lg border bg-background px-3 py-2 text-sm" />
          <button className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-gold-foreground">Kirim Pesan</button>
        </form>
      )}
    </section>
  );
}
