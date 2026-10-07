-- 프롬피 저장(담기) 기능용 테이블
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN 하세요.

create table if not exists public.saves (
  user_id    uuid not null references auth.users (id) on delete cascade,
  prompt_id  uuid not null references public.prompts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

create index if not exists saves_user_idx on public.saves (user_id, created_at desc);

-- RLS: 내 저장 기록만 보고/추가/삭제 가능
alter table public.saves enable row level security;

drop policy if exists "users can view their own saves" on public.saves;
create policy "users can view their own saves"
  on public.saves for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert their own saves" on public.saves;
create policy "users can insert their own saves"
  on public.saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can delete their own saves" on public.saves;
create policy "users can delete their own saves"
  on public.saves for delete
  using (auth.uid() = user_id);
