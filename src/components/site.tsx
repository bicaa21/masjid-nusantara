import { Link } from "@tanstack/react-router";
import { Menu, Search, X, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import { type Program, percent } from "@/lib/data";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const s = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <svg viewBox="0 0 40 40" className={s} aria-hidden>
        <circle cx="20" cy="20" r="20" className="fill-gold" />
        <path d="M11 12 L20 30 L29 12 L24 12 L20 21 L16 12 Z" className="fill-primary-foreground" />
      </svg>
      <span className="font-serif text-sm font-bold leading-tight text-primary">
        Masjid
        <br />
        Nusantara
      </span>
    </Link>
  );
}

const nav = [
  { to: "/", label: "Beranda" },
  { to: "/program", label: "Program" },
  { to: "/galeri", label: "Galeri" },
  { to: "/berita", label: "Berita" },
  { to: "/donasi", label: "Donasi" },
  { to: "/tentang", label: "Tentang Kami" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm text-muted-foreground transition-colors hover:text-primary data-[status=active]:font-semibold data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-primary">
          <Link to="/program" aria-label="Cari program"><Search className="h-5 w-5" /></Link>
          <button aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-card px-4 py-3">
          {[...nav, { to: "/kontak", label: "Kontak" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2 text-sm text-foreground">
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center">
        <Logo size="lg" />
        <div className="hidden h-8 w-px bg-border md:block" />
        <p className="text-sm text-muted-foreground">
          Bersama Membangun Masjid • Menguatkan Umat • Menuju Indonesia yang Lebih Baik
        </p>
        <Link to="/kontak" className="text-sm font-semibold text-primary md:ml-auto">Kontak Kami</Link>
      </div>
    </footer>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

export function ProgramRow({ p }: { p: Program }) {
  return (
    <Link
      to="/program/$slug"
      params={{ slug: p.slug }}
      className="group flex items-center gap-5 border-b py-5 last:border-0"
    >
      <img src={p.image} alt={p.title} loading="lazy" className="h-24 w-36 shrink-0 rounded-lg object-cover md:h-28 md:w-44" />
      <div className="min-w-0 flex-1">
        <h3 className="font-sans text-base font-bold text-foreground">{p.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{p.excerpt}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-gold" /> {p.location}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="max-w-xs flex-1"><Progress value={percent(p)} /></div>
          <span className="text-xs font-semibold text-primary">{percent(p)}%</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function PageBanner({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <section className="relative overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-md text-primary-foreground/85">{subtitle}</p>
      </div>
    </section>
  );
}
