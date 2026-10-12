-- Schema catalogue/admin requis par les seeds et l'interface de gestion.
-- A executer avant 001_analytics.sql, 002_seed_catalog.sql et 003_seed_clients.sql.

create table if not exists public.catalog_projects (
  id bigint generated always as identity primary key,
  title text not null,
  location text not null default 'Libreville',
  image text not null,
  images text[] not null default array[]::text[],
  description text,
  category text not null check (category in ('batiments', 'travaux')),
  year integer not null default extract(year from now())::integer,
  client text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_projects_public_idx
  on public.catalog_projects (published, sort_order, id);

alter table public.catalog_projects enable row level security;

drop policy if exists "Public can read published catalog projects" on public.catalog_projects;
create policy "Public can read published catalog projects"
  on public.catalog_projects
  for select
  to anon
  using (published = true);

drop policy if exists "Authenticated can manage catalog projects" on public.catalog_projects;
create policy "Authenticated can manage catalog projects"
  on public.catalog_projects
  for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.catalog_reports (
  id text primary key,
  slug text not null unique,
  title text not null,
  client text not null default 'OCT',
  client_slug text not null default 'oct',
  location text not null default '',
  category text not null check (category in ('batiments', 'travaux')),
  objective text not null default '',
  start_date text not null default '',
  end_date text not null default '',
  start_label text not null default '',
  end_label text not null default '',
  refs text[] not null default array[]::text[],
  before_images text[] not null default array[]::text[],
  after_images text[] not null default array[]::text[],
  cover text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_reports_public_idx
  on public.catalog_reports (published, sort_order, id);

alter table public.catalog_reports enable row level security;

drop policy if exists "Public can read published catalog reports" on public.catalog_reports;
create policy "Public can read published catalog reports"
  on public.catalog_reports
  for select
  to anon
  using (published = true);

drop policy if exists "Authenticated can manage catalog reports" on public.catalog_reports;
create policy "Authenticated can manage catalog reports"
  on public.catalog_reports
  for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.site_clients (
  id text primary key,
  name text not null,
  short_name text not null,
  logo text,
  featured boolean not null default false,
  slug text not null unique,
  summary text,
  projects jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_clients_public_idx
  on public.site_clients (published, sort_order, id);

alter table public.site_clients enable row level security;

drop policy if exists "Public can read published site clients" on public.site_clients;
create policy "Public can read published site clients"
  on public.site_clients
  for select
  to anon
  using (published = true);

drop policy if exists "Authenticated can manage site clients" on public.site_clients;
create policy "Authenticated can manage site clients"
  on public.site_clients
  for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('catalogue', 'catalogue', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read catalogue media" on storage.objects;
create policy "Public can read catalogue media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'catalogue');

drop policy if exists "Authenticated can upload catalogue media" on storage.objects;
create policy "Authenticated can upload catalogue media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'catalogue');

drop policy if exists "Authenticated can update catalogue media" on storage.objects;
create policy "Authenticated can update catalogue media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'catalogue')
  with check (bucket_id = 'catalogue');

drop policy if exists "Authenticated can delete catalogue media" on storage.objects;
create policy "Authenticated can delete catalogue media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'catalogue');
