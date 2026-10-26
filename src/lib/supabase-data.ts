import { getSupabaseClient } from "@/integrations/supabase/client";
import { images, type Category, type NewsItem, type Program } from "@/lib/data";

const programColumns =
  "id, slug, title, category, excerpt, description, location, image_url, target_amount, raised_amount, donors_count, display_order, build_progress";

function localProgramImage(slug: string, category: Category) {
  if (slug === "pembangunan-masjid-pelosok" || slug === "masjid-pesisir-maluku") return images.hero;
  if (slug === "pendidikan-islam") return images.pendidikan;
  if (slug === "bantuan-kemanusiaan") return images.kemanusiaan;
  if (category === "Renovasi") return images.renovasi;
  return images.hero;
}

function toProgram(row: {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  description: string;
  location: string;
  image_url: string | null;
  target_amount: number;
  raised_amount: number;
  donors_count: number;
  build_progress: number;
}): Program {
  const category = row.category as Category;
  return {
    ...row,
    category,
    image: row.image_url || localProgramImage(row.slug, category),
    target: row.target_amount,
    raised: row.raised_amount,
    donors: row.donors_count,
    buildProgress: row.build_progress,
    updates: [],
  };
}

export async function fetchPrograms() {
  const { data, error } = await getSupabaseClient()
    .from("programs")
    .select(programColumns)
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) throw new Error(`Gagal memuat program: ${error.message}`);
  return data.map(toProgram);
}

export async function fetchProgram(slug: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("programs")
    .select(programColumns)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error(`Gagal memuat program: ${error.message}`);
  if (!data) return undefined;

  const { data: updates, error: updatesError } = await supabase
    .from("program_updates")
    .select("body, occurred_at")
    .eq("program_id", data.id)
    .eq("is_published", true)
    .order("occurred_at", { ascending: false });

  if (updatesError) throw new Error(`Gagal memuat perkembangan program: ${updatesError.message}`);

  const program = toProgram(data);
  program.updates = updates.map((update) => ({
    date: new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(`${update.occurred_at}T00:00:00`)),
    text: update.body,
  }));
  return program;
}

const newsImages: Record<string, string> = {
  "peletakan-batu-pertama-masjid-pelosok-sumbawa": images.hero,
  "renovasi-musholla-al-ikhlas-memasuki-tahap-atap": images.renovasi,
  "500-mushaf-dibagikan-ke-tpq-binaan": images.pendidikan,
  "penyaluran-300-paket-sembako-untuk-lansia": images.kemanusiaan,
};

export async function fetchNews(): Promise<NewsItem[]> {
  const { data, error } = await getSupabaseClient()
    .from("news")
    .select("slug, title, excerpt, image_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Gagal memuat berita: ${error.message}`);
  return data.map((item) => ({
    ...item,
    date: new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(item.published_at)),
    image: item.image_url || newsImages[item.slug] || images.hero,
  }));
}

export async function createDonation(input: {
  amount: number;
  donorName: string | null;
  donorEmail: string;
  donorPhone: string;
  message: string | null;
  isAnonymous: boolean;
  paymentMethod: "qris" | "transfer";
  programSlug: string;
}) {
  const { data, error } = await getSupabaseClient().rpc("submit_donation", {
    p_amount: input.amount,
    p_donor_email: input.donorEmail,
    p_donor_name: input.donorName,
    p_donor_phone: input.donorPhone,
    p_is_anonymous: input.isAnonymous,
    p_message: input.message,
    p_payment_method: input.paymentMethod,
    p_program_slug: input.programSlug,
  });

  if (error) throw new Error(`Donasi gagal disimpan: ${error.message}`);
  return data;
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  message: string;
}) {
  const { error } = await getSupabaseClient().from("contact_messages").insert(input);
  if (error) throw new Error(`Pesan gagal dikirim: ${error.message}`);
}
