import hero from "@/assets/hero-masjid.jpg";
import renovasi from "@/assets/renovasi.jpg";
import pendidikan from "@/assets/pendidikan.jpg";
import kemanusiaan from "@/assets/kemanusiaan.jpg";

export const images = { hero, renovasi, pendidikan, kemanusiaan };

export type Category = "Pembangunan" | "Renovasi" | "Pemberdayaan" | "Kemanusiaan";

export interface Program {
  slug: string;
  title: string;
  category: Category;
  excerpt: string;
  description: string;
  location: string;
  image: string;
  target: number;
  raised: number;
  donors: number;
  buildProgress: number;
  updates: { date: string; text: string }[];
}

export const categories: { label: string; value: "Semua" | Category }[] = [
  { label: "Semua", value: "Semua" },
  { label: "Pembangunan", value: "Pembangunan" },
  { label: "Renovasi", value: "Renovasi" },
  { label: "Pemberdayaan", value: "Pemberdayaan" },
  { label: "Kemanusiaan", value: "Kemanusiaan" },
];

export const percent = (p: Program) => Math.min(100, Math.round((p.raised / p.target) * 100));
export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}
