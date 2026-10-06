/** .env.local 에 Supabase 키가 채워져 있으면 true.
 *  아직 미설정이면 앱은 목업 데이터로 동작한다. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
