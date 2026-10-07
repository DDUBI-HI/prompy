import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

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
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
          >
            인기
          </Link>
        </nav>

        <div className="flex flex-1 items-center">
          <label className="flex w-full items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 focus-within:ring-2 focus-within:ring-rose-400 dark:bg-neutral-800">
            <svg
              className="h-4 w-4 shrink-0 text-neutral-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 2.9 10.17l3.21 3.22a1 1 0 0 0 1.42-1.42l-3.22-3.21A5.5 5.5 0 0 0 9 3.5ZM5.5 9a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="search"
              placeholder="프롬프트 검색 (예: 사이버펑크, 수채화…)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
          </label>
        </div>

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
            <span
              className="hidden max-w-[10rem] truncate text-sm text-neutral-600 sm:block dark:text-neutral-400"
              title={user.email ?? ""}
            >
              {user.email}
            </span>
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
