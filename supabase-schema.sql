-- ============================================================
-- Supabase Database Schema for Lumen
-- Run this in your Supabase project → SQL Editor → New Query
-- ============================================================

-- ---------------------------------------------------------------
-- 1. Posts table (blog posts, pages, and team members)
-- ---------------------------------------------------------------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  category   text not null default 'Article',
  author     text not null default 'Admin',
  date       date not null default now(),
  status     text not null default 'Draft',
  excerpt    text,
  body       text,
  cover      text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- 2. Photos table (gallery images)
-- ---------------------------------------------------------------
create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  src          text not null,
  title        text not null,
  caption      text,
  storage_path text,
  uploaded_at  timestamptz default now()
);

-- ---------------------------------------------------------------
-- 3. Messages table (contact form submissions)
-- ---------------------------------------------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  read        boolean default false,
  received_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- 4. Supabase Storage bucket for gallery images
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- 5. Row Level Security (RLS) Policies
-- ---------------------------------------------------------------

-- Enable RLS on all tables
alter table public.posts enable row level security;
alter table public.photos enable row level security;
alter table public.messages enable row level security;

-- POSTS: Anyone can read published posts
create policy "Public read posts"
  on public.posts
  for select
  using (true);

-- POSTS: Only authenticated users can insert/update/delete
create policy "Auth insert posts"
  on public.posts
  for insert
  to authenticated
  with check (true);

create policy "Auth update posts"
  on public.posts
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete posts"
  on public.posts
  for delete
  to authenticated
  using (true);

-- PHOTOS: Anyone can read photos
create policy "Public read photos"
  on public.photos
  for select
  using (true);

-- PHOTOS: Only authenticated users can insert/update/delete
create policy "Auth insert photos"
  on public.photos
  for insert
  to authenticated
  with check (true);

create policy "Auth update photos"
  on public.photos
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete photos"
  on public.photos
  for delete
  to authenticated
  using (true);

-- MESSAGES: Anyone can submit messages (public insert)
create policy "Public insert messages"
  on public.messages
  for insert
  with check (true);

-- MESSAGES: Only authenticated users can read/update/delete messages
create policy "Auth read messages"
  on public.messages
  for select
  to authenticated
  using (true);

create policy "Auth update messages"
  on public.messages
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete messages"
  on public.messages
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------
-- 6. Storage policies for the gallery bucket
-- ---------------------------------------------------------------

-- Anyone can view gallery images
create policy "Public gallery read"
  on storage.objects
  for select
  using ( bucket_id = 'gallery' );

-- Only authenticated users can upload/delete gallery images
create policy "Auth gallery upload"
  on storage.objects
  for insert
  to authenticated
  with check ( bucket_id = 'gallery' );

create policy "Auth gallery delete"
  on storage.objects
  for delete
  to authenticated
  using ( bucket_id = 'gallery' );
