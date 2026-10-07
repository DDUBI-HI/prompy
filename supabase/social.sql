-- 프롬피 소셜 기능: 프로필 + 팔로우
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN 하세요.

-- ========== 1) 프로필 ==========
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  avatar_url   text not null default '',
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read"
  on public.profiles for select using (true);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update using (auth.uid() = id);

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    split_part(new.email, '@', 1),
    'https://api.dicebear.com/9.x/thumbs/png?seed=' || new.id
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 이미 가입한 사용자 프로필 채워넣기
insert into public.profiles (id, display_name, avatar_url)
select id, split_part(email, '@', 1),
       'https://api.dicebear.com/9.x/thumbs/png?seed=' || id
from auth.users
on conflict (id) do nothing;

-- ========== 2) 팔로우 ==========
create table if not exists public.follows (
  follower_id  uuid not null references auth.users (id) on delete cascade,
  following_id uuid not null references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index if not exists follows_following_idx on public.follows (following_id);

alter table public.follows enable row level security;

-- 팔로워/팔로잉 수는 공개 (누구나 읽기)
drop policy if exists "follows public read" on public.follows;
create policy "follows public read"
  on public.follows for select using (true);

drop policy if exists "follows insert own" on public.follows;
create policy "follows insert own"
  on public.follows for insert with check (auth.uid() = follower_id);

drop policy if exists "follows delete own" on public.follows;
create policy "follows delete own"
  on public.follows for delete using (auth.uid() = follower_id);
