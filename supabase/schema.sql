-- Supabase schema for member registrations
-- Run this SQL in the Supabase SQL editor for your project.

create extension if not exists "uuid-ossp";

create table if not exists member_registrations (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text not null,
  birth_date date not null,
  gender text not null,
  address text not null,
  organization text not null,
  education text,
  school text,
  motivation text,
  agree_terms boolean not null default false,
  status text not null default 'pending',
  submitted_at timestamptz not null default now()
);

create index if not exists idx_member_registrations_status on member_registrations (status);
create index if not exists idx_member_registrations_submitted_at on member_registrations (submitted_at desc);

create table if not exists suggestions (
  id uuid primary key default uuid_generate_v4(),
  user_name text not null default 'Anggota',
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_suggestions_status on suggestions (status);
create index if not exists idx_suggestions_created_at on suggestions (created_at desc);

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at on contact_messages (created_at desc);

-- Table for authenticated members (link to auth.users)
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  organization text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create index if not exists idx_members_email on members (email);
create index if not exists idx_members_role on members (role);

-- Enable Row Level Security
alter table members enable row level security;

-- Policy: Semua user yang login bisa membaca data members (untuk cek role)
create policy "Anyone authenticated can read members"
  on members for select
  using (auth.role() = 'authenticated');

-- Policy: Hanya admin yang bisa insert/update/delete members
create policy "Only admins can insert members"
  on members for insert
  with check (exists (
    select 1 from members where auth_id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can update members"
  on members for update
  using (exists (
    select 1 from members where auth_id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can delete members"
  on members for delete
  using (exists (
    select 1 from members where auth_id = auth.uid() and role = 'admin'
  ));

-- NOTE: Untuk membuat admin, lakukan di Supabase Dashboard:
-- 1. Buat user baru di Authentication > Users
-- 2. Copy user ID
-- 3. Jalankan: 
--    insert into members (auth_id, full_name, email, role) 
--    values ('USER_ID_DISINI', 'Admin IPNU IPPNU', 'admin@ipnuippnu-batursari.org', 'admin');
