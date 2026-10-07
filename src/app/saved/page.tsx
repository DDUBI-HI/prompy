import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import PromptCard from "@/components/PromptCard";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getSavedPrompts } from "@/lib/prompts";

export const metadata = { title: "내 저장함 — 프롬피" };

export default async function SavedPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-6 py-20 text-center text-sm text-neutral-500">
          저장함은 Supabase 연결 후에 쓸 수 있어요.
        </main>
      </>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const prompts = await getSavedPrompts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-screen-2xl px-4 py-6">
        <h1 className="mb-1 text-2xl font-bold">내 저장함</h1>
        <p className="mb-6 text-sm text-neutral-500">
          저장한 프롬프트 {prompts.length}개
        </p>

        {prompts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {prompts.map((p) => (
              <PromptCard key={p.id} prompt={p} saved />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="text-lg font-semibold">아직 저장한 프롬프트가 없어요</p>
            <p className="text-sm text-neutral-500">
              마음에 드는 프롬프트의 <b>저장</b> 버튼을 눌러 모아보세요.
            </p>
            <Link
              href="/"
              className="mt-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              둘러보러 가기
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
