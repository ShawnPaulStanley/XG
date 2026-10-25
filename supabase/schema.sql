create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (username ~ '^[a-z0-9_]{3,}$'),
  created_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_username_check;
alter table public.profiles add constraint profiles_username_check
  check (username ~ '^[a-z0-9_]{3,}$');

create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_username text := lower(trim(new.raw_user_meta_data ->> 'username'));
begin
  if requested_username is null or requested_username !~ '^[a-z0-9_]{3,}$' then
    raise exception 'Invalid username';
  end if;

  insert into public.profiles (id, username)
  values (new.id, requested_username);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_username_available(requested_username text)
returns boolean
language sql
security definer set search_path = public
as $$
  select not exists (
    select 1 from public.profiles
    where lower(username) = lower(trim(requested_username))
  );
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;

create table if not exists public.players (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  preferred_positions text[] not null default '{}',
  kit_number integer,
  notes text,
  is_attending boolean not null default true,
  created_at bigint not null
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  played_at timestamptz not null default now(),
  team_a_score integer not null default 0 check (team_a_score >= 0),
  team_b_score integer not null default 0 check (team_b_score >= 0),
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
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
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

create table if not exists public.match_appearances (
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id text not null references public.players(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  primary key (match_id, player_id)
);

alter table public.players add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.matches add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.matches add column if not exists team_a_score integer not null default 0;
alter table public.matches add column if not exists team_b_score integer not null default 0;
alter table public.goals add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.players enable row level security;
alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.match_players enable row level security;
alter table public.goals enable row level security;
alter table public.player_stats enable row level security;
alter table public.match_appearances enable row level security;

alter table public.match_players add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
alter table public.player_stats add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();

drop policy if exists "Public player access" on public.players;
drop policy if exists "Public match access" on public.matches;
drop policy if exists "Public match player access" on public.match_players;
drop policy if exists "Public goal access" on public.goals;
drop policy if exists "Public player stats access" on public.player_stats;
drop policy if exists "Users manage their players" on public.players;
drop policy if exists "Users read their profile" on public.profiles;
drop policy if exists "Users manage their matches" on public.matches;
drop policy if exists "Users manage their match players" on public.match_players;
drop policy if exists "Users manage their goals" on public.goals;
drop policy if exists "Users manage their player stats" on public.player_stats;
drop policy if exists "Users manage their match appearances" on public.match_appearances;

create policy "Users read their profile" on public.profiles for select
  using (auth.uid() = id);
create policy "Users manage their players" on public.players for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their matches" on public.matches for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their match players" on public.match_players for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their goals" on public.goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their player stats" on public.player_stats for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their match appearances" on public.match_appearances for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
