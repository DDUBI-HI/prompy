import { redirect } from "next/navigation";
import Header from "@/components/Header";
import UploadForm from "@/components/UploadForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "프롬프트 올리기 — 프롬피" };

export default async function UploadPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-6 py-20 text-center text-sm text-neutral-500">
          업로드는 Supabase 연결 후에 쓸 수 있어요.
        </main>
      </>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 안 했으면 로그인 페이지로
  if (!user) redirect("/login");

  return (
    <>
      <Header />
      <UploadForm userId={user.id} userEmail={user.email ?? ""} />
    </>
  );
}
