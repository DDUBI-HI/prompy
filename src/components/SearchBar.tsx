"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    router.push(t ? `/?q=${encodeURIComponent(t)}` : "/");
  }

  return (
    <form onSubmit={submit} className="flex flex-1 items-center">
      <label className="flex w-full items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 focus-within:ring-2 focus-within:ring-neutral-300 dark:bg-neutral-800 dark:focus-within:ring-neutral-600">
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
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="프롬프트 검색 (예: 사이버펑크, 수채화…)"
          className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
        />
      </label>
    </form>
  );
}
