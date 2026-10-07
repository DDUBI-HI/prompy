"use client";

import { useLikePrompt } from "@/lib/useLikePrompt";

export default function LikeButton({
  promptId,
  initialLiked,
  initialCount,
}: {
  promptId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const { liked, count, loading, toggle } = useLikePrompt(
    promptId,
    initialLiked,
    initialCount
  );

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        liked
          ? "border-rose-600 bg-rose-50 text-rose-600 dark:bg-rose-500/10"
          : "border-black/10 text-neutral-600 hover:border-rose-300 hover:text-rose-500 dark:border-white/15 dark:text-neutral-300"
      }`}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.6}
        aria-hidden
      >
        <path d="M10 17.5 3.8 11.3a3.9 3.9 0 0 1 5.5-5.5l.7.7.7-.7a3.9 3.9 0 1 1 5.5 5.5L10 17.5Z" />
      </svg>
      {count.toLocaleString("ko-KR")}
    </button>
  );
}
