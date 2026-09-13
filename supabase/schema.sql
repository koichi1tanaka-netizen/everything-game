-- The Everything Game — save data
-- Run this in the Supabase SQL editor for your project.

create table if not exists game_saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table game_saves enable row level security;

create policy "own save" on game_saves
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);