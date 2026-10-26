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

export const programs: Program[] = [
  {
    slug: "pembangunan-masjid-pelosok",
    title: "Pembangunan Masjid Pelosok",
    category: "Pembangunan",
    excerpt: "Membangun masjid baru di daerah terpencil dan minim akses.",
    description:
      "Masjid ini akan dibangun di daerah pelosok yang masih minim akses sarana ibadah. Dengan adanya masjid ini, masyarakat dapat beribadah dengan lebih nyaman, sekaligus menjadi pusat kegiatan keagamaan, pendidikan, dan sosial.",
    location: "Kabupaten Sumbawa, NTT",
    image: hero,
    target: 250_000_000,
    raised: 162_500_000,
    donors: 342,
    buildProgress: 56,
    updates: [
      { date: "12 Okt 2026", text: "Pemasangan rangka atap kayu selesai." },
      { date: "20 Sep 2026", text: "Pengecoran pondasi dan lantai utama." },
      { date: "01 Agu 2026", text: "Peletakan batu pertama bersama warga." },
    ],
  },
  {
    slug: "renovasi-masjid-daerah",
    title: "Renovasi Masjid Daerah",
    category: "Renovasi",
    excerpt: "Memperbaiki masjid yang sudah ada agar lebih layak dan nyaman.",
    description:
      "Renovasi atap, dinding, dan tempat wudhu musholla yang rusak agar jamaah dapat kembali beribadah dengan aman dan nyaman.",
    location: "Kabupaten Lebak, Banten",
    image: renovasi,
    target: 120_000_000,
    raised: 84_000_000,
    donors: 215,
    buildProgress: 70,
    updates: [
      { date: "05 Okt 2026", text: "Penggantian rangka atap yang lapuk." },
      { date: "10 Sep 2026", text: "Survei dan pembelian material." },
    ],
  },
  {
    slug: "pendidikan-islam",
    title: "Pendidikan Islam",
    category: "Pemberdayaan",
    excerpt: "Mendukung kegiatan belajar mengajar di masjid dan pesantren.",
    description:
      "Penyediaan Al-Qur'an, kitab, dan honor pengajar TPQ di masjid-masjid binaan agar anak-anak pelosok dapat belajar agama dengan baik.",
    location: "Kabupaten Garut, Jawa Barat",
    image: pendidikan,
    target: 75_000_000,
    raised: 41_250_000,
    donors: 188,
    buildProgress: 55,
    updates: [{ date: "01 Okt 2026", text: "Distribusi 500 mushaf ke 12 TPQ binaan." }],
  },
  {
    slug: "bantuan-kemanusiaan",
    title: "Bantuan Kemanusiaan",
    category: "Kemanusiaan",
    excerpt: "Memberikan bantuan untuk masyarakat sekitar masjid.",
    description:
      "Paket sembako dan kebutuhan pokok bagi lansia dan keluarga prasejahtera di sekitar masjid binaan.",
    location: "Kabupaten Brebes, Jawa Tengah",
    image: kemanusiaan,
    target: 50_000_000,
    raised: 38_500_000,
    donors: 260,
    buildProgress: 77,
    updates: [{ date: "18 Okt 2026", text: "Penyaluran 300 paket sembako." }],
  },
  {
    slug: "masjid-pesisir-maluku",
    title: "Masjid Pesisir Maluku",
    category: "Pembangunan",
    excerpt: "Membangun masjid untuk desa nelayan di pesisir Maluku.",
    description: "Pembangunan masjid sederhana dan kokoh untuk desa nelayan yang belum memiliki tempat ibadah permanen.",
    location: "Kabupaten Seram Bagian Timur, Maluku",
    image: hero,
    target: 300_000_000,
    raised: 96_000_000,
    donors: 140,
    buildProgress: 25,
    updates: [{ date: "02 Okt 2026", text: "Pembebasan lahan wakaf selesai." }],
  },
  {
    slug: "renovasi-surau-sumbar",
    title: "Renovasi Surau Tua",
    category: "Renovasi",
    excerpt: "Merawat surau bersejarah agar tetap makmur.",
    description: "Perbaikan struktur dan lantai surau tua yang menjadi pusat kegiatan warga.",
    location: "Kabupaten Agam, Sumatera Barat",
    image: renovasi,
    target: 90_000_000,
    raised: 22_500_000,
    donors: 77,
    buildProgress: 20,
    updates: [{ date: "15 Okt 2026", text: "Penggalangan dana dimulai." }],
  },
];

export const categories: { label: string; value: "Semua" | Category }[] = [
  { label: "Semua", value: "Semua" },
  { label: "Pembangunan", value: "Pembangunan" },
  { label: "Renovasi", value: "Renovasi" },
  { label: "Pemberdayaan", value: "Pemberdayaan" },
  { label: "Kemanusiaan", value: "Kemanusiaan" },
];

export const percent = (p: Program) => Math.min(100, Math.round((p.raised / p.target) * 100));
export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export const news = [
  { title: "Peletakan batu pertama Masjid Pelosok Sumbawa", date: "01 Agu 2026", image: hero, excerpt: "Warga dan relawan bergotong royong memulai pembangunan masjid pertama di desa." },
  { title: "Renovasi musholla Al-Ikhlas memasuki tahap atap", date: "05 Okt 2026", image: renovasi, excerpt: "Rangka atap lama yang lapuk diganti dengan material baru yang lebih kokoh." },
  { title: "500 mushaf dibagikan ke TPQ binaan", date: "01 Okt 2026", image: pendidikan, excerpt: "Anak-anak di 12 TPQ kini memiliki Al-Qur'an sendiri untuk belajar." },
  { title: "Penyaluran 300 paket sembako untuk lansia", date: "18 Okt 2026", image: kemanusiaan, excerpt: "Bantuan disalurkan langsung ke rumah warga di sekitar masjid binaan." },
];
