-- ==============================================================================
-- GALUR - Database Setup for Supabase
-- Slogan: "Garis Alur, Ngajentrekeun Struktur"
-- ==============================================================================

-- 1. Buat Tabel Diagram
create table if not exists public.diagrams (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Diagram Baru Tanpa Judul',
  description text default '',
  type text default 'flowchart',
  data jsonb not null default '{"nodes": [], "edges": []}'::jsonb,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.diagrams enable row level security;

-- 3. Policy: Pengguna hanya bisa melihat diagram miliknya sendiri
drop policy if exists "Users can view own diagrams" on public.diagrams;
create policy "Users can view own diagrams"
  on public.diagrams for select
  using (auth.uid() = user_id);

-- 4. Policy: Pengguna hanya bisa membuat diagram untuk dirinya sendiri
drop policy if exists "Users can insert own diagrams" on public.diagrams;
create policy "Users can insert own diagrams"
  on public.diagrams for insert
  with check (auth.uid() = user_id);

-- 5. Policy: Pengguna hanya bisa mengubah diagram miliknya sendiri
drop policy if exists "Users can update own diagrams" on public.diagrams;
create policy "Users can update own diagrams"
  on public.diagrams for update
  using (auth.uid() = user_id);

-- 6. Policy: Pengguna hanya bisa menghapus diagram miliknya sendiri
drop policy if exists "Users can delete own diagrams" on public.diagrams;
create policy "Users can delete own diagrams"
  on public.diagrams for delete
  using (auth.uid() = user_id);

-- 7. Trigger Otomatis updated_at menggunakan ekstensi resmi Supabase moddatetime
-- (Bebas dari karakter dollar quote $$ sehingga 100% aman dijalankan di SQL Editor web)
create extension if not exists moddatetime schema extensions;

drop trigger if exists set_diagrams_updated_at on public.diagrams;
create trigger set_diagrams_updated_at
  before update on public.diagrams
  for each row
  execute function extensions.moddatetime(updated_at);

-- 8. Index untuk performa query pencarian dan sorting
create index if not exists idx_diagrams_user_id on public.diagrams(user_id);
create index if not exists idx_diagrams_updated_at on public.diagrams(updated_at desc);
