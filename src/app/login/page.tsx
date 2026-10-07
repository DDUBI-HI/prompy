"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      // 이메일 확인이 켜져 있으면 세션이 바로 안 생김
      if (!data.session) {
        return setMessage(
          "가입 완료! 이메일로 온 확인 링크를 눌러주세요. (확인 메일이 번거로우면 Supabase 설정에서 끌 수 있어요)"
        );
      }
      router.push("/");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) return setError(error.message);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-xl font-black text-white dark:bg-white dark:text-neutral-900">
          P
        </span>
        <span className="text-2xl font-bold tracking-tight">프롬피</span>
      </Link>

      <h1 className="mb-1 text-center text-xl font-bold">
        {mode === "signin" ? "로그인" : "회원가입"}
      </h1>
      <p className="mb-6 text-center text-sm text-neutral-500">
        프롬프트를 저장하고 공유해보세요
      </p>

      {!configured ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          아직 Supabase가 연결되지 않았어요. <br />
          <code>.env.local</code> 에 키를 넣으면 로그인이 활성화됩니다. 그 전까지는
          둘러보기만 가능해요.
          <Link
            href="/"
            className="mt-3 block font-semibold text-neutral-900 hover:underline dark:text-white"
          >
            둘러보기로 돌아가기 →
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:border-white/15 dark:bg-neutral-900"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:border-white/15 dark:bg-neutral-900"
            />

            {error && <p className="text-sm text-rose-600">{error}</p>}
            {message && (
              <p className="text-sm text-emerald-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-full bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {loading
                ? "처리 중…"
                : mode === "signin"
                  ? "로그인"
                  : "회원가입"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setMessage(null);
            }}
            className="mt-4 text-center text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            {mode === "signin"
              ? "계정이 없으신가요? 회원가입"
              : "이미 계정이 있으신가요? 로그인"}
          </button>
        </>
      )}
    </main>
  );
}
