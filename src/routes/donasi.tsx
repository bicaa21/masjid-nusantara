import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Copy, MapPin } from "lucide-react";
import { useState } from "react";
import { donationAccounts, percent, programs, rupiah } from "@/lib/data";
import { Progress } from "@/components/site";

export const Route = createFileRoute("/donasi")({
  validateSearch: (s: Record<string, unknown>): { program?: string | undefined } => ({ program: typeof s["program"] === "string" ? s["program"] : undefined }),
  head: () => ({
    meta: [
      { title: "Donasi — Masjid Nusantara" },
      { name: "description", content: "Salurkan donasi untuk pembangunan dan pemakmuran masjid di pelosok nusantara." },
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
  const search = Route.useSearch();
  const [slug, setSlug] = useState(search.program ?? programs[0]!.slug);
  const [amount, setAmount] = useState<number>(50000);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"qris" | "transfer">("qris");
  const [anon, setAnon] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copyNumber = (n: string) => {
    navigator.clipboard?.writeText(n).catch(() => {});
    setCopied(n);
    setTimeout(() => setCopied((c) => (c === n ? null : c)), 2000);
  };
  const p = programs.find((x) => x.slug === slug) ?? programs[0]!;
  const total = custom ? Number(custom.replace(/\D/g, "")) : amount;

  if (code)
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Donasi Tercatat</h1>
        <p className="mt-3 text-muted-foreground">Kode transaksi: <b className="text-foreground">{code}</b></p>
        <p className="mt-2 text-sm text-muted-foreground">
          Status: <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">Pending</span>. Donasi {rupiah(total)} akan diverifikasi setelah pembayaran dikonfirmasi oleh {method === "qris" ? "penyedia QRIS" : "admin"}.
        </p>
        <Link to="/program" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Lihat Program Lain</Link>
      </div>
    );

  return (
    <form
      className="mx-auto max-w-2xl px-4 py-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (total < 10000) return alert("Minimal donasi Rp 10.000");
        setCode("MN-" + Date.now().toString(36).toUpperCase());
      }}
    >
      <Link to="/program" className="flex items-center gap-2 font-serif text-2xl font-bold"><ArrowLeft className="h-6 w-6" /> Donasi</Link>

      <select value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-5 w-full rounded-lg border bg-card px-3 py-2 text-sm">
        {programs.map((x) => <option key={x.slug} value={x.slug}>{x.title}</option>)}
      </select>
      <div className="mt-3 flex gap-4 rounded-xl border bg-card p-3">
        <img src={p.image} alt="" className="h-20 w-28 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">{p.title}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.location}</div>
          <div className="mt-2 flex items-center gap-2"><Progress value={percent(p)} /><span className="text-xs font-semibold">{percent(p)}%</span></div>
        </div>
      </div>

      <h2 className="mt-6 font-sans text-sm font-bold">Pilih Nominal Donasi</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {amounts.map(([v, l]) => {
          const active = !custom && amount === v;
          return (
            <button type="button" key={v} onClick={() => { setAmount(v); setCustom(""); }}
              className={`rounded-xl border py-4 text-center transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
              <div className="text-sm font-bold">{rupiah(v)}</div>
              <div className={`text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>({l})</div>
            </button>
          );
        })}
      </div>
      <label className="mt-4 block text-sm font-semibold">Nominal Lainnya
        <input value={custom} onChange={(e) => setCustom(e.target.value)} inputMode="numeric" placeholder="Masukkan nominal donasi" className="mt-2 w-full rounded-lg border bg-card px-3 py-2 text-sm font-normal" />
      </label>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <input required={!anon} disabled={anon} placeholder="Nama donatur" className="rounded-lg border bg-card px-3 py-2 text-sm disabled:opacity-50" />
        <input required type="email" placeholder="Email" className="rounded-lg border bg-card px-3 py-2 text-sm" />
        <input required type="tel" placeholder="Nomor telepon" className="rounded-lg border bg-card px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Donasi sebagai anonim</label>
      </div>
      <textarea placeholder="Pesan atau doa (opsional)" className="mt-3 w-full rounded-lg border bg-card px-3 py-2 text-sm" rows={3} />

      <h2 className="mt-6 font-sans text-sm font-bold">Metode Pembayaran</h2>
      <div className="mt-3 space-y-3">
        {[
          { id: "qris" as const, t: "QRIS", d: "Scan QRIS melalui GoPay, OVO, DANA, ShopeePay, dan aplikasi e-wallet lainnya." },
          { id: "transfer" as const, t: "Transfer Bank", d: "Transfer ke rekening yayasan, diverifikasi manual oleh admin." },
        ].map((m) => (
          <button type="button" key={m.id} onClick={() => setMethod(m.id)} className={`flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left ${method === m.id ? "border-gold" : ""}`}>
            <span className="font-sans text-lg font-black text-foreground">{m.t}</span>
            <span className="flex-1 text-xs text-muted-foreground">{m.d}</span>
            {method === m.id && <Check className="h-5 w-5 rounded-full bg-gold p-0.5 text-gold-foreground" />}
          </button>
        ))}
      </div>

      <div className={`mt-3 space-y-2 rounded-xl border bg-card p-4 ${method === "transfer" ? "border-gold" : ""}`}>
        <div className="font-sans text-sm font-bold">Rekening Donasi</div>
        <p className="text-xs text-muted-foreground">
          {method === "transfer"
            ? "Transfer ke salah satu rekening resmi yayasan di bawah ini, lalu donasi Anda akan diverifikasi manual oleh admin."
            : "Selain QRIS, donasi juga bisa ditransfer ke rekening resmi yayasan berikut."}
        </p>
        {donationAccounts.map((a) => (
          <div key={a.number} className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold">{a.bank}</div>
              <div className="font-mono text-sm tracking-wider text-foreground">{a.number}</div>
              <div className="text-[11px] text-muted-foreground">a.n. Yayasan Masjid Nusantara</div>
            </div>
            <button
              type="button"
              onClick={() => copyNumber(a.number)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
            >
              {copied === a.number ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === a.number ? "Disalin" : "Salin"}
            </button>
          </div>
        ))}
      </div>


      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
        Lanjutkan Pembayaran {total > 0 && `· ${rupiah(total)}`} <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
