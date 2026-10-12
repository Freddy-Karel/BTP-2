-- Analytics + fondation contenu admin
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);

alter table public.page_views enable row level security;

-- Visiteurs anonymes : enregistrer une vue
drop policy if exists "Anyone can insert page views" on public.page_views;
create policy "Anyone can insert page views"
  on public.page_views
  for insert
  to anon, authenticated
  with check (true);

-- Admin connecté : lire les stats
drop policy if exists "Authenticated can read page views" on public.page_views;
create policy "Authenticated can read page views"
  on public.page_views
  for select
  to authenticated
  using (true);

-- Paramètres site (Phase 2+)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can write settings" on public.site_settings;
create policy "Authenticated can write settings"
  on public.site_settings
  for all
  to authenticated
  using (true)
  with check (true);
