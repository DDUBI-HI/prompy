"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-black/5 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/10"
    >
      로그아웃
    </button>
  );
}
