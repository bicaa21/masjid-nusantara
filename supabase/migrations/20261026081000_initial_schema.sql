create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('Pembangunan', 'Renovasi', 'Pemberdayaan', 'Kemanusiaan')),
  excerpt text not null,
  description text not null,
  location text not null,
  image_url text,
  target_amount bigint not null check (target_amount > 0),
  raised_amount bigint not null default 0 check (raised_amount >= 0),
  donors_count integer not null default 0 check (donors_count >= 0),
  display_order smallint not null default 0 check (display_order >= 0),
  build_progress smallint not null default 0 check (build_progress between 0 and 100),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.program_updates (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  body text not null,
  occurred_at date not null,
  is_published boolean not null default false
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete restrict,
  amount bigint not null check (amount >= 10000),
  donor_name text,
  donor_email text not null,
  donor_phone text not null,
  message text,
  is_anonymous boolean not null default false,
  payment_method text not null check (payment_method in ('qris', 'transfer')),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  receipt_code text not null unique default (
    'MN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))
  ),
  created_at timestamptz not null default now(),
  constraint donations_name_required_for_named_donors
    check (is_anonymous or nullif(btrim(donor_name), '') is not null),
  constraint donations_message_length check (message is null or char_length(message) <= 1000)
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  image_url text,
  published_at timestamptz not null default now(),
  is_published boolean not null default false
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint contact_messages_name_length check (char_length(btrim(name)) between 1 and 120),
  constraint contact_messages_message_length check (char_length(btrim(message)) between 1 and 5000),
  constraint contact_messages_email_format check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create index program_updates_public_order_idx
  on public.program_updates (program_id, occurred_at desc)
  where is_published;
create index programs_public_order_idx
  on public.programs (created_at desc)
  where is_published;
create index news_public_order_idx
  on public.news (published_at desc)
  where is_published;
create index donations_program_status_idx
  on public.donations (program_id, status);

alter table public.programs enable row level security;
alter table public.program_updates enable row level security;
alter table public.donations enable row level security;
alter table public.news enable row level security;
alter table public.contact_messages enable row level security;

revoke all on public.programs, public.program_updates, public.donations, public.news, public.contact_messages
  from public, anon, authenticated;

grant select on public.programs, public.program_updates, public.news to anon, authenticated;
grant insert (name, email, message) on public.contact_messages to anon, authenticated;

create policy "Published programs are public"
  on public.programs for select to anon, authenticated
  using (is_published);

create policy "Published updates for published programs are public"
  on public.program_updates for select to anon, authenticated
  using (
    is_published
    and exists (
      select 1
      from public.programs
      where programs.id = program_updates.program_id
        and programs.is_published
    )
  );

create policy "Published news is public"
  on public.news for select to anon, authenticated
  using (is_published);

create policy "Anyone may submit a contact message"
  on public.contact_messages for insert to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 120
    and char_length(btrim(message)) between 1 and 5000
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );

create function public.submit_donation(
  p_program_slug text,
  p_amount bigint,
  p_donor_name text,
  p_donor_email text,
  p_donor_phone text,
  p_message text,
  p_is_anonymous boolean,
  p_payment_method text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_program_id uuid;
  v_receipt_code text;
begin
  if p_amount is null or p_amount < 10000 then
    raise exception 'Minimal donasi adalah Rp 10.000.';
  end if;

  if p_payment_method not in ('qris', 'transfer') then
    raise exception 'Metode pembayaran tidak valid.';
  end if;

  if p_donor_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    or char_length(p_donor_phone) not between 6 and 32 then
    raise exception 'Email atau nomor telepon tidak valid.';
  end if;

  if not p_is_anonymous and nullif(btrim(p_donor_name), '') is null then
    raise exception 'Nama donatur wajib diisi.';
  end if;

  if p_message is not null and char_length(p_message) > 1000 then
    raise exception 'Pesan maksimal 1000 karakter.';
  end if;

  select id into v_program_id
  from public.programs
  where slug = p_program_slug and is_published;

  if v_program_id is null then
    raise exception 'Program tidak ditemukan atau tidak tersedia.';
  end if;

  insert into public.donations (
    program_id,
    amount,
    donor_name,
    donor_email,
    donor_phone,
    message,
    is_anonymous,
    payment_method,
    status
  )
  values (
    v_program_id,
    p_amount,
    nullif(btrim(p_donor_name), ''),
    lower(btrim(p_donor_email)),
    btrim(p_donor_phone),
    nullif(btrim(p_message), ''),
    p_is_anonymous,
    p_payment_method,
    'pending'
  )
  returning receipt_code into v_receipt_code;

  return v_receipt_code;
end;
$$;

revoke all on function public.submit_donation(text, bigint, text, text, text, text, boolean, text)
  from public, anon, authenticated;
grant execute on function public.submit_donation(text, bigint, text, text, text, text, boolean, text)
  to anon, authenticated;

create function public.sync_verified_donation_totals()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.status = 'verified' then
      update public.programs
      set raised_amount = greatest(0, raised_amount - old.amount),
          donors_count = greatest(0, donors_count - 1)
      where id = old.program_id;
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' and old.status = 'verified' then
    update public.programs
    set raised_amount = greatest(0, raised_amount - old.amount),
        donors_count = greatest(0, donors_count - 1)
    where id = old.program_id;
  end if;

  if new.status = 'verified' then
    update public.programs
    set raised_amount = raised_amount + new.amount,
        donors_count = donors_count + 1
    where id = new.program_id;
  end if;

  return new;
end;
$$;

create trigger donations_sync_verified_totals
  after insert or update or delete on public.donations
  for each row execute function public.sync_verified_donation_totals();

insert into public.programs (
  slug, title, category, excerpt, description, location,
  target_amount, raised_amount, donors_count, display_order, build_progress, is_published
)
values
  (
    'pembangunan-masjid-pelosok', 'Pembangunan Masjid Pelosok', 'Pembangunan',
    'Membangun masjid baru di daerah terpencil dan minim akses.',
    'Masjid ini akan dibangun di daerah pelosok yang masih minim akses sarana ibadah. Dengan adanya masjid ini, masyarakat dapat beribadah dengan lebih nyaman, sekaligus menjadi pusat kegiatan keagamaan, pendidikan, dan sosial.',
    'Kabupaten Sumbawa, NTT', 250000000, 162500000, 342, 1, 56, true
  ),
  (
    'renovasi-masjid-daerah', 'Renovasi Masjid Daerah', 'Renovasi',
    'Memperbaiki masjid yang sudah ada agar lebih layak dan nyaman.',
    'Renovasi atap, dinding, dan tempat wudhu musholla yang rusak agar jamaah dapat kembali beribadah dengan aman dan nyaman.',
    'Kabupaten Lebak, Banten', 120000000, 84000000, 215, 2, 70, true
  ),
  (
    'pendidikan-islam', 'Pendidikan Islam', 'Pemberdayaan',
    'Mendukung kegiatan belajar mengajar di masjid dan pesantren.',
    'Penyediaan Al-Qur''an, kitab, dan honor pengajar TPQ di masjid-masjid binaan agar anak-anak pelosok dapat belajar agama dengan baik.',
    'Kabupaten Garut, Jawa Barat', 75000000, 41250000, 188, 3, 55, true
  ),
  (
    'bantuan-kemanusiaan', 'Bantuan Kemanusiaan', 'Kemanusiaan',
    'Memberikan bantuan untuk masyarakat sekitar masjid.',
    'Paket sembako dan kebutuhan pokok bagi lansia dan keluarga prasejahtera di sekitar masjid binaan.',
    'Kabupaten Brebes, Jawa Tengah', 50000000, 38500000, 260, 4, 77, true
  ),
  (
    'masjid-pesisir-maluku', 'Masjid Pesisir Maluku', 'Pembangunan',
    'Membangun masjid untuk desa nelayan di pesisir Maluku.',
    'Pembangunan masjid sederhana dan kokoh untuk desa nelayan yang belum memiliki tempat ibadah permanen.',
    'Kabupaten Seram Bagian Timur, Maluku', 300000000, 96000000, 140, 5, 25, true
  ),
  (
    'renovasi-surau-sumbar', 'Renovasi Surau Tua', 'Renovasi',
    'Merawat surau bersejarah agar tetap makmur.',
    'Perbaikan struktur dan lantai surau tua yang menjadi pusat kegiatan warga.',
    'Kabupaten Agam, Sumatera Barat', 90000000, 22500000, 77, 6, 20, true
  );

insert into public.program_updates (program_id, body, occurred_at, is_published)
select p.id, update_row.body, update_row.occurred_at::date, true
from (
  values
    ('pembangunan-masjid-pelosok', 'Pemasangan rangka atap kayu selesai.', '2026-10-12'),
    ('pembangunan-masjid-pelosok', 'Pengecoran pondasi dan lantai utama.', '2026-09-20'),
    ('pembangunan-masjid-pelosok', 'Peletakan batu pertama bersama warga.', '2026-08-01'),
    ('renovasi-masjid-daerah', 'Penggantian rangka atap yang lapuk.', '2026-10-05'),
    ('renovasi-masjid-daerah', 'Survei dan pembelian material.', '2026-09-10'),
    ('pendidikan-islam', 'Distribusi 500 mushaf ke 12 TPQ binaan.', '2026-10-01'),
    ('bantuan-kemanusiaan', 'Penyaluran 300 paket sembako.', '2026-10-18'),
    ('masjid-pesisir-maluku', 'Pembebasan lahan wakaf selesai.', '2026-10-02'),
    ('renovasi-surau-sumbar', 'Penggalangan dana dimulai.', '2026-10-15')
) as update_row(program_slug, body, occurred_at)
join public.programs p on p.slug = update_row.program_slug;

insert into public.news (slug, title, excerpt, published_at, is_published)
values
  (
    'peletakan-batu-pertama-masjid-pelosok-sumbawa',
    'Peletakan batu pertama Masjid Pelosok Sumbawa',
    'Warga dan relawan bergotong royong memulai pembangunan masjid pertama di desa.',
    '2026-08-01 00:00:00+00', true
  ),
  (
    'renovasi-musholla-al-ikhlas-memasuki-tahap-atap',
    'Renovasi musholla Al-Ikhlas memasuki tahap atap',
    'Rangka atap lama yang lapuk diganti dengan material baru yang lebih kokoh.',
    '2026-10-05 00:00:00+00', true
  ),
  (
    '500-mushaf-dibagikan-ke-tpq-binaan',
    '500 mushaf dibagikan ke TPQ binaan',
    'Anak-anak di 12 TPQ kini memiliki Al-Qur''an sendiri untuk belajar.',
    '2026-10-01 00:00:00+00', true
  ),
  (
    'penyaluran-300-paket-sembako-untuk-lansia',
    'Penyaluran 300 paket sembako untuk lansia',
    'Bantuan disalurkan langsung ke rumah warga di sekitar masjid binaan.',
    '2026-10-18 00:00:00+00', true
  );
