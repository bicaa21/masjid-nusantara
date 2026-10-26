import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { createContactMessage } from "@/lib/supabase-data";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — Masjid Nusantara" },
      { name: "description", content: "Hubungi Yayasan Masjid Nusantara." },
      { property: "og:title", content: "Kontak — Masjid Nusantara" },
      {
        property: "og:description",
        content: "Email, telepon, dan alamat Yayasan Masjid Nusantara.",
      },
    ],
  }),
  component: Kontak,
});

function Kontak() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Hubungi Kami</h1>
        <p className="mt-3 text-muted-foreground">
          Punya pertanyaan atau ingin mengusulkan masjid untuk dibantu? Kami siap mendengar.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex gap-3">
            <Mail className="h-5 w-5 text-gold" /> info@masjidnusantara.org
          </li>
          <li className="flex gap-3">
            <Phone className="h-5 w-5 text-gold" /> +62 812-0000-0000
          </li>
          <li className="flex gap-3">
            <MapPin className="h-5 w-5 text-gold" /> Jakarta, Indonesia
          </li>
        </ul>
        <div className="mt-6 flex gap-3 text-primary">
          <Instagram className="h-5 w-5" />
          <Facebook className="h-5 w-5" />
          <Youtube className="h-5 w-5" />
        </div>
      </div>
      {sent ? (
        <div className="rounded-2xl border bg-card p-8">
          Terima kasih, pesan Anda sudah kami terima.
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            setSending(true);
            setError(null);
            try {
              await createContactMessage({
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                message: String(formData.get("message") ?? ""),
              });
              setSent(true);
            } catch (submissionError) {
              setError(
                submissionError instanceof Error
                  ? submissionError.message
                  : "Pesan gagal dikirim. Silakan coba lagi.",
              );
            } finally {
              setSending(false);
            }
          }}
          className="space-y-3 rounded-2xl border bg-card p-6"
        >
          <input
            name="name"
            required
            maxLength={120}
            placeholder="Nama"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <input
            name="email"
            required
            type="email"
            maxLength={320}
            placeholder="Email"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <textarea
            name="message"
            required
            maxLength={5000}
            placeholder="Pesan"
            rows={5}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            disabled={sending}
            className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-gold-foreground disabled:opacity-60"
          >
            {sending ? "Mengirim pesan..." : "Kirim Pesan"}
          </button>
        </form>
      )}
    </section>
  );
}
