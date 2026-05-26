# CampusConnect

CampusConnect adalah platform forum enterprise modern untuk mahasiswa all-in-one. Platform ini dirancang menggunakan arsitektur scalable, modular, maintainable, dan production-ready untuk melayani komunitas kampus modern.

## 🚀 Fitur Utama

Platform ini dirancang dengan struktur *Clean Architecture* dan terdiri dari modul-modul berikut:

- **Forum Diskusi Mahasiswa**: Thread diskusi dengan fitur upvote/downvote bersarang, nested comments, tags, categories, dan moderation.
- **Sharing Catatan Kuliah**: Bagikan dan download file materi pembelajaran dan catatan kuliah mahasiswa. Termasuk rating 5 bintang dan sistem course tagging.
- **Artikel Edukasi**: Publikasi artikel pengetahuan menggunakan *Markdown (React Markdown + Tailwind Typography)* untuk kemudahan dan performa penulisan.
- **Marketplace Mahasiswa**: Jual beli barang mahasiswa (buku bekas, alat tulis) terintegrasi dengan cart (Zustand persistent) dan checkout flow menggunakan *Midtrans mock integration*.
- **Admin Panel Enterprise**: *Role Based Access Control* (RBAC) aman. Lacak metrik pengguna, pertumbuhan pesanan, utas aktif secara real-time.
- **Realtime Notifications**: Pemberitahuan interaktif websocket (via Supabase Realtime Channels) yang aktif seketika ada balasan di thread forum Anda.

## 🛠 Tech Stack

### Frontend
- Next.js 15 App Router
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS v4 & Tailwind Animate
- Shadcn UI (Radix Primitives / Headless components)
- Zustand (Persisted client state untuk keranjang belanja)
- TanStack React Query v5 (Untuk mutasi optimistic voting yang mulus)
- Framer Motion & Lucide Icons

### Backend & Database
- Next.js Route Handlers & Server Actions
- Prisma ORM
- PostgreSQL (dikelola lewat Supabase)
- NextAuth (Auth.js v5 Beta) untuk sesi JWT aman
- Zod (Strict Payload validation)
- React Hook Form terintegrasi Server Actions
- `@supabase/supabase-js` untuk Broadcast Channels Realtime

### DevOps & Pengujian
- **E2E Testing**: Playwright
- **Unit Testing**: Jest & React Testing Library (`next/jest`)
- **Linting & Code Quality**: ESLint 9 (Flat Config), Prettier, Husky (Pre-commit hooks), Commitlint (Conventional commits)
- **CI/CD**: GitHub Actions workflows & Dockerfile (Standalone builds)

## 📁 Struktur Folder (Clean Architecture)

```bash
/src
  ├── actions/       # Server actions (Mutasi aman)
  ├── app/           # App Router (Pages, Layouts, API Routes)
  ├── auth.ts        # NextAuth v5 Configurations
  ├── components/    # Reusable UI components (Shadcn, Providers, States)
  ├── features/      # Fitur terisolasi (contoh: forum, notes, marketplace)
  ├── hooks/         # Custom React hooks (contoh: useVoteMutation)
  ├── lib/           # Utility dan koneksi library (Prisma client)
  ├── repositories/  # Database access layer (Menjaga kueri DB tetap bersih)
  ├── services/      # Abstraksi eksternal (Payment mock, AI mock, Storage)
  ├── store/         # State Management Global (Zustand)
  └── types/         # Zod schemas dan definisi TypeScript global
```

## 🏗 Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js versi 20+ (direkomendasikan v22+)
- Database PostgreSQL
- Akun Supabase (opsional jika membutuhkan notifikasi realtime dan autentikasi sosial Google)

### Instalasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/hudayef/Forums.git
   cd Forums
   ```

2. Instal semua dependensi:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Buat file `.env` dan konfigurasikan akses berikut:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/campusconnect"
   NEXTAUTH_SECRET="random-string-secret"
   GOOGLE_CLIENT_ID="optional-for-oauth"
   GOOGLE_CLIENT_SECRET="optional-for-oauth"
   NEXT_PUBLIC_SUPABASE_URL="optional-for-realtime"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="optional-for-realtime"
   ```

4. Sinkronisasi Skema Database:
   ```bash
   npx prisma generate
   npx prisma db push
   # atau npx prisma migrate dev jika Anda merencanakan migrasi skema
   ```

5. Jalankan Development Server:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

### Pengujian

Untuk menjalankan Unit Testing (Jest):
```bash
npm run test
```

Untuk menjalankan E2E Testing (Playwright):
```bash
npx playwright test
```

Untuk mem-verifikasi kualitas kode sebelum commit (sama seperti Husky pre-commit hook):
```bash
npm run lint
```
