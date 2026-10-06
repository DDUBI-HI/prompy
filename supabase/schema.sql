-- 프롬피 DB 스키마
-- Supabase 대시보드 → SQL Editor 에 그대로 붙여넣고 RUN 하세요.

-- 1) prompts 테이블
create table if not exists public.prompts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null,
  description   text not null default '',
  category      text not null,
  model         text not null,
  image_url     text not null,
  aspect        text not null default 'portrait',
  tags          text[] not null default '{}',
  author_name   text not null default '',
  author_avatar text not null default '',
  likes         integer not null default 0,
  saves         integer not null default 0,
  -- 업로더 (M4에서 사용). 시드 데이터는 null 허용
  user_id       uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

-- 카테고리별 조회 속도용 인덱스
create index if not exists prompts_category_idx on public.prompts (category);
create index if not exists prompts_created_at_idx on public.prompts (created_at desc);

-- 2) Row Level Security (RLS)
alter table public.prompts enable row level security;

-- 누구나 읽기 가능 (공개 피드)
drop policy if exists "prompts are viewable by everyone" on public.prompts;
create policy "prompts are viewable by everyone"
  on public.prompts for select
  using (true);

-- 로그인한 사용자는 자기 글로 등록 가능 (M4 업로드용)
drop policy if exists "users can insert their own prompts" on public.prompts;
create policy "users can insert their own prompts"
  on public.prompts for insert
  with check (auth.uid() = user_id);

-- 자기 글만 수정/삭제 가능
drop policy if exists "users can update their own prompts" on public.prompts;
create policy "users can update their own prompts"
  on public.prompts for update
  using (auth.uid() = user_id);

drop policy if exists "users can delete their own prompts" on public.prompts;
create policy "users can delete their own prompts"
  on public.prompts for delete
  using (auth.uid() = user_id);
