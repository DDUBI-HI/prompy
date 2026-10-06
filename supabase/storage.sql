-- 프롬피 이미지 저장소(Storage) 설정
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 RUN 하세요.

-- 1) 공개 버킷 생성 (이미 있으면 통과)
insert into storage.buckets (id, name, public)
values ('prompt-images', 'prompt-images', true)
on conflict (id) do nothing;

-- 2) 권한 정책
-- 누구나 이미지 읽기 가능 (공개 피드용)
drop policy if exists "prompt images are public" on storage.objects;
create policy "prompt images are public"
  on storage.objects for select
  using (bucket_id = 'prompt-images');

-- 로그인한 사용자는 자기 폴더(= 자기 user id)에 업로드 가능
drop policy if exists "users can upload prompt images" on storage.objects;
create policy "users can upload prompt images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'prompt-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 자기가 올린 이미지만 삭제 가능
drop policy if exists "users can delete their prompt images" on storage.objects;
create policy "users can delete their prompt images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'prompt-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
