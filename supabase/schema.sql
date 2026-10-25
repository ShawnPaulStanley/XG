create table if not exists public.players (
  id text primary key,
  name text not null,
  preferred_positions text[] not null default '{}',
  kit_number integer,
  notes text,
  is_attending boolean not null default true,
  created_at bigint not null
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  played_at timestamptz not null default now(),
  venue text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.match_players (
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id text not null references public.players(id) on delete cascade,
  team text not null check (team in ('A', 'B')),
  position text,
  is_starter boolean not null default true,
  primary key (match_id, player_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  scorer_id text not null references public.players(id) on delete cascade,
  assist_id text references public.players(id) on delete set null,
  minute integer check (minute is null or minute >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.player_stats (
  player_id text primary key references public.players(id) on delete cascade,
  appearances integer not null default 0,
  starts integer not null default 0,
  goals integer not null default 0,
  assists integer not null default 0,
  clean_sheets integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.match_players enable row level security;
alter table public.goals enable row level security;
alter table public.player_stats enable row level security;

create policy "Public player access" on public.players for all using (true) with check (true);
create policy "Public match access" on public.matches for all using (true) with check (true);
create policy "Public match player access" on public.match_players for all using (true) with check (true);
create policy "Public goal access" on public.goals for all using (true) with check (true);
create policy "Public player stats access" on public.player_stats for all using (true) with check (true);
