# GALUR — Diagram & Flowchart Builder
> *"Garis Alur, Ngajentrekeun Struktur"*

**GALUR** adalah aplikasi web diagram alur teknikal modern ala Microsoft Visio dan Mind Map interaktif yang fleksibel, dirancang untuk tim dan individu. Dibangun dengan Next.js, React Flow, Supabase, dan siap di-deploy secara instan ke **Vercel**.

---

## 🌟 Fitur Utama

1. **Ketepatan Ala Visio (Flowchart & Architecture):**
   - Stencil bentuk bawaan: Kotak Proses, Belah Ketupat Keputusan (IF), Mulai/Selesai, Basis Data, Layanan Cloud, Catatan Tempel, dan Teks Bebas.
   - 4 titik sambungan magnetik (Atas, Bawah, Kiri, Kanan) pada setiap objek.
   - Pilihan gaya konektor: **Siku-siku Patah (Visio Standard)**, **Melengkung Halus (Bezier)**, dan **Garis Lurus**.
   - Drag and drop bentuk langsung dari panel samping ke kanvas.

2. **Mind Mapping Interaktif:**
   - Tambah anak cabang ide baru secara instan cukup dengan satu klik tombol `+` pada node.
   - Tidak kaku, visual bersih dan modern.

3. **Cetak & Ekspor Fleksibel:**
   - **Ekspor Dokumen PDF:** Format standar A4 (Pilihan orientasi Landscape / Portrait).
   - **Ekspor Gambar HD:** Format **JPG** dan **PNG** tajam (2x dan 3x resolusi untuk cetak).
   - **Print Kertas Langsung:** Tombol print fisik dengan CSS cetak khusus (`@media print`) yang otomatis menyembunyikan bilah navigasi dan toolbar.

4. **Multi-User dengan Akun Google (Supabase):**
   - Teman dan rekan Anda bisa login secara mandiri menggunakan akun Google mereka.
   - Terisolasi aman menggunakan **Row Level Security (RLS)** PostgreSQL: Setiap pengguna hanya dapat melihat dan mengedit diagram miliknya sendiri.
   - Tetap dapat berjalan secara *offline* / lokal browser (*fallback LocalStorage*) jika belum menghubungkan akun Supabase.

---

## 🚀 Panduan Menjalankan Proyek Lokal

1. Masuk ke direktori proyek:
   ```bash
   cd C:\Users\asist\.gemini\antigravity\scratch\galur
   ```

2. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

3. Buka browser di: `http://localhost:3000`

---

## 🗄️ Panduan Setup Supabase (Multi-User & Google Login)

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor** di Supabase, lalu jalankan seluruh skrip yang ada di berkas:
   ```
   supabase_setup.sql
   ```
   *(Skrip ini otomatis membuat tabel `diagrams`, relasi akun, serta aturan keamanan Row Level Security).*
3. Buka menu **Authentication -> Providers -> Google**:
   - Aktifkan Google Provider.
   - Masukkan *Client ID* dan *Client Secret* dari Google Cloud Console.
   - Masukkan URL Redirect dari Supabase ke Google Cloud Console Anda.
4. Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
5. Isi nilai `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sesuai project Supabase Anda.

---

## 🌐 Panduan Deploy ke Vercel

1. Buat repository baru di akun GitHub Anda (misal: `galur`).
2. Push seluruh kode proyek ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi GALUR Diagram & Flowchart Builder"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/galur.git
   git push -u origin main
   ```
3. Buka [Vercel](https://vercel.com) -> Klik **"Add New Project"** -> Pilih repository `galur`.
4. Pada bagian **Environment Variables** di Vercel, masukkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**! Aplikasi Anda langsung aktif dan dapat diakses publik oleh teman-teman Anda.
