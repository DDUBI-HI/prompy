import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import SearchBar from "./SearchBar";

async function getUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-lg font-black text-white">
            P
          </span>
          <span className="hidden text-xl font-bold tracking-tight sm:block">
            프롬피
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            탐색
          </Link>
          <Link
            href="/?sort=popular"
            className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            인기
          </Link>
        </nav>

        <SearchBar />

        {user ? (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/saved"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-black/5 sm:block dark:text-neutral-300 dark:hover:bg-white/10"
            >
              저장함
            </Link>
            <Link
              href="/upload"
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              업로드
            </Link>
            <Link
              href={`/u/${user.id}`}
              className="hidden max-w-[10rem] truncate text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:block dark:text-neutral-400 dark:hover:text-white"
              title={user.email ?? ""}
            >
              {user.email}
            </Link>
            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="shrink-0 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
