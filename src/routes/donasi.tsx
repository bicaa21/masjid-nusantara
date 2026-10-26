import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { useState } from "react";
import { percent, rupiah } from "@/lib/data";
import { createDonation, fetchPrograms } from "@/lib/supabase-data";
import { DataError, DataLoading, Progress } from "@/components/site";

export const Route = createFileRoute("/donasi")({
  loader: fetchPrograms,
  pendingComponent: DataLoading,
  errorComponent: DataError,
  validateSearch: (s: Record<string, unknown>): { program?: string | undefined } => ({
    program: typeof s["program"] === "string" ? s["program"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Donasi — Masjid Nusantara" },
      {
        name: "description",
        content: "Salurkan donasi untuk pembangunan dan pemakmuran masjid di pelosok nusantara.",
      },
      { property: "og:title", content: "Donasi — Masjid Nusantara" },
      { property: "og:description", content: "Pilih program dan salurkan donasi terbaik Anda." },
    ],
  }),
  component: Donasi,
});

const amounts = [
  [50000, "1 paket semen"],
  [100000, "1 paket batu bata"],
  [250000, "5 zak semen"],
  [500000, "1 paket besi"],
] as const;

function Donasi() {
  const programs = Route.useLoaderData();
  const search = Route.useSearch();
  const initialProgram = programs.find((program) => program.slug === search.program) ?? programs[0];
  const [slug, setSlug] = useState(initialProgram?.slug ?? "");
  const [amount, setAmount] = useState<number>(50000);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"qris" | "transfer">("qris");
  const [anon, setAnon] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const p = programs.find((x) => x.slug === slug);
  const total = custom ? Number(custom.replace(/\D/g, "")) : amount;

  if (code)
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Donasi Tercatat</h1>
        <p className="mt-3 text-muted-foreground">
          Kode transaksi: <b className="text-foreground">{code}</b>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Status:{" "}
          <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
            Pending
          </span>
          . Donasi {rupiah(total)} sudah tercatat. Integrasi pembayaran otomatis belum tersedia;
          silakan hubungi admin untuk langkah pembayaran dan verifikasi.
        </p>
        <Link
          to="/program"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Lihat Program Lain
        </Link>
      </div>
    );

  if (!programs.length) {
    return (
      <p className="mx-auto max-w-2xl px-4 py-12 text-center text-muted-foreground">
        Belum ada program donasi yang tersedia.
      </p>
    );
  }

  return (
    <form
      className="mx-auto max-w-2xl px-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        if (total < 10000) {
          setError("Minimal donasi Rp 10.000.");
          return;
        }
        setSubmitting(true);
        setError(null);
        try {
          const receiptCode = await createDonation({
            amount: total,
            donorName: anon ? null : name,
            donorEmail: email,
            donorPhone: phone,
            message: message || null,
            isAnonymous: anon,
            paymentMethod: method,
            programSlug: slug,
          });
          setCode(receiptCode);
        } catch (submissionError) {
          setError(
            submissionError instanceof Error
              ? submissionError.message
              : "Donasi gagal disimpan. Silakan coba lagi.",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Link to="/program" className="flex items-center gap-2 font-serif text-2xl font-bold">
        <ArrowLeft className="h-6 w-6" /> Donasi
      </Link>

      <select
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="mt-5 w-full rounded-lg border bg-card px-3 py-2 text-sm"
      >
        {programs.map((x) => (
          <option key={x.slug} value={x.slug}>
            {x.title}
          </option>
        ))}
      </select>
      {p && (
        <div className="mt-3 flex gap-4 rounded-xl border bg-card p-3">
          <img src={p.image} alt="" className="h-20 w-28 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">{p.title}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {p.location}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={percent(p)} />
              <span className="text-xs font-semibold">{percent(p)}%</span>
            </div>
          </div>
        </div>
      )}

      <h2 className="mt-6 font-sans text-sm font-bold">Pilih Nominal Donasi</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {amounts.map(([v, l]) => {
          const active = !custom && amount === v;
          return (
            <button
              type="button"
              key={v}
              onClick={() => {
                setAmount(v);
                setCustom("");
              }}
              className={`rounded-xl border py-4 text-center transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
            >
              <div className="text-sm font-bold">{rupiah(v)}</div>
              <div
                className={`text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                ({l})
              </div>
            </button>
          );
        })}
      </div>
      <label className="mt-4 block text-sm font-semibold">
        Nominal Lainnya
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          inputMode="numeric"
          placeholder="Masukkan nominal donasi"
          className="mt-2 w-full rounded-lg border bg-card px-3 py-2 text-sm font-normal"
        />
      </label>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={!anon}
          disabled={anon}
          placeholder="Nama donatur"
          className="rounded-lg border bg-card px-3 py-2 text-sm disabled:opacity-50"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="Email"
          className="rounded-lg border bg-card px-3 py-2 text-sm"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          type="tel"
          placeholder="Nomor telepon"
          className="rounded-lg border bg-card px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />{" "}
          Donasi sebagai anonim
        </label>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Pesan atau doa (opsional)"
        className="mt-3 w-full rounded-lg border bg-card px-3 py-2 text-sm"
        rows={3}
      />

      <h2 className="mt-6 font-sans text-sm font-bold">Metode Pembayaran</h2>
      <div className="mt-3 space-y-3">
        {[
          {
            id: "qris" as const,
            t: "QRIS",
            d: "Scan QRIS melalui GoPay, OVO, DANA, ShopeePay, dan aplikasi e-wallet lainnya.",
          },
          {
            id: "transfer" as const,
            t: "Transfer Bank",
            d: "Transfer ke rekening yayasan, diverifikasi manual oleh admin.",
          },
        ].map((m) => (
          <button
            type="button"
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left ${method === m.id ? "border-gold" : ""}`}
          >
            <span className="font-sans text-lg font-black text-foreground">{m.t}</span>
            <span className="flex-1 text-xs text-muted-foreground">{m.d}</span>
            {method === m.id && (
              <Check className="h-5 w-5 rounded-full bg-gold p-0.5 text-gold-foreground" />
            )}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {submitting ? (
          "Menyimpan donasi..."
        ) : (
          <>
            Catat Donasi {total > 0 && `· ${rupiah(total)}`} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
