# Masjid Nusantara

https://share.google/ux7Tppn3wwuItXVzT referensi isian website
https://share.google/72D1SIh4ZIKwr396x referensi isian website

sekarang buatkan aku website yayasan masjid nusantara , untuk tampilan websitenya seperti gambar 1 harus persis, dan untuk markdownnya saya sudah lampiran, untuk data nya saya sudah siapkan di link referensi!

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4f148d7e-44c8-4c5a-88d0-e6bd53f09880).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Supabase setup

1. Install dependencies and create a local environment file:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

   Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`. Use only the project's publishable/anon key in this frontend; never put a `service_role` or secret key in a `VITE_*` variable.

2. Install the Supabase CLI using its [official installation instructions](https://supabase.com/docs/guides/cli), then run these commands from the repository root:

   ```powershell
   supabase init
   supabase login
   supabase link --project-ref xxxx
   supabase db push
   ```

   `supabase init` creates the local CLI configuration, `login` authenticates the CLI, `link` associates this folder with your project, and `db push` applies the reviewed migrations in `supabase/migrations`.

3. Generate TypeScript types from the linked project's schema:

   ```powershell
   supabase gen types typescript --linked | Out-File -Encoding utf8 src\integrations\supabase\types.ts
   ```

   The checked-in types currently match the initial migration. Regenerate them after applying migrations or changing the database schema.

The initial migration seeds the existing program and news content. Program/news reads are limited to published rows. Donation submissions use a database function that always creates a pending record and returns its receipt code; donor details are not publicly readable. Contact messages are insert-only for visitors. Payment-provider checkout and an authenticated admin experience are not part of this integration, so pending donations still require trusted manual verification.
