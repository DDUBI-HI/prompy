-- 프롬피 좋아요 기능용 테이블 + 카운트 자동 반영 트리거
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN 하세요.

-- 1) 좋아요 기록 테이블 (한 사람이 한 프롬프트에 1번)
create table if not exists public.likes (
  user_id    uuid not null references auth.users (id) on delete cascade,
  prompt_id  uuid not null references public.prompts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

-- 2) RLS: 내 좋아요 기록만 보고/추가/삭제 (좋아요 여부 표시에 필요)
alter table public.likes enable row level security;

drop policy if exists "users can view their own likes" on public.likes;
create policy "users can view their own likes"
  on public.likes for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert their own likes" on public.likes;
create policy "users can insert their own likes"
  on public.likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can delete their own likes" on public.likes;
create policy "users can delete their own likes"
  on public.likes for delete
  using (auth.uid() = user_id);

-- 3) 좋아요가 추가/삭제되면 prompts.likes 숫자를 자동으로 +1/-1
--    SECURITY DEFINER 라서 RLS를 우회해 카운트를 갱신한다.
create or replace function public.handle_like_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.prompts set likes = likes + 1 where id = new.prompt_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.prompts set likes = greatest(likes - 1, 0) where id = old.prompt_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists on_like_change on public.likes;
create trigger on_like_change
  after insert or delete on public.likes
  for each row execute function public.handle_like_change();
