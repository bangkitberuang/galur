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
  type text default 'flowchart', -- 'flowchart' | 'mindmap' | 'custom'
  data jsonb not null default '{"nodes": [], "edges": []}'::jsonb,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.diagrams enable row level security;

-- 3. Policy: Pengguna hanya bisa melihat diagram miliknya sendiri
create policy "Users can view own diagrams"
  on public.diagrams for select
  using (auth.uid() = user_id);

-- 4. Policy: Pengguna hanya bisa membuat diagram untuk dirinya sendiri
create policy "Users can insert own diagrams"
  on public.diagrams for insert
  with check (auth.uid() = user_id);

-- 5. Policy: Pengguna hanya bisa mengubah diagram miliknya sendiri
create policy "Users can update own diagrams"
  on public.diagrams for update
  using (auth.uid() = user_id);

-- 6. Policy: Pengguna hanya bisa menghapus diagram miliknya sendiri
create policy "Users can delete own diagrams"
  on public.diagrams for delete
  using (auth.uid() = user_id);

-- 7. Trigger Otomatis untuk memperbarui kolom 'updated_at'
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger set_diagrams_updated_at
  before update on public.diagrams
  for each row
  execute function public.handle_updated_at();

-- Index untuk performa pencarian berdasarkan user_id
create index if not exists idx_diagrams_user_id on public.diagrams(user_id);
create index if not exists idx_diagrams_updated_at on public.diagrams(updated_at desc);
