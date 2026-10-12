create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views (created_at desc);
create index if not exists page_views_path_idx on page_views (path);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists catalog_projects (
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
  on catalog_projects (published, sort_order, id);

create table if not exists catalog_reports (
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
  on catalog_reports (published, sort_order, id);

create table if not exists site_clients (
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
  on site_clients (published, sort_order, id);

create table if not exists site_image_assets (
  key text primary key,
  area text not null,
  label text not null,
  original_url text not null,
  replacement_url text,
  status text not null default 'provisional'
    check (status in ('provisional', 'validated', 'replace')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_image_assets_sort_idx
  on site_image_assets (sort_order, key);

create table if not exists admin_users (
  id bigint generated always as identity primary key,
  email text not null unique,
  password_salt text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
