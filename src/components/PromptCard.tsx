"use client";

import { useState } from "react";
import Link from "next/link";
import { Prompt } from "@/lib/types";
import { useSavePrompt } from "@/lib/useSavePrompt";
import { useLikePrompt } from "@/lib/useLikePrompt";

export default function PromptCard({
  prompt,
  saved: initialSaved = false,
  liked: initialLiked = false,
}: {
  prompt: Prompt;
  saved?: boolean;
  liked?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { saved, loading, toggle } = useSavePrompt(prompt.id, initialSaved);
  const like = useLikePrompt(prompt.id, initialLiked, prompt.likes);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(prompt.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 클립보드 접근 실패 시 무시 */
    }
  }

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    toggle();
  }

  return (
    <div className="group">
      {/* 정사각 이미지 (1:1) */}
      <Link
        href={`/prompt/${prompt.id}`}
        className="relative block aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prompt.imageUrl}
          alt={prompt.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* 호버 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

        {/* 저장 (우상단) */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`absolute right-2.5 top-2.5 rounded-full px-3.5 py-1.5 text-xs font-bold opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 disabled:opacity-50 ${
            saved
              ? "bg-white/95 text-neutral-900"
              : "bg-neutral-900/80 text-white hover:bg-neutral-900"
          }`}
        >
          {saved ? "저장됨" : "저장"}
        </button>

        {/* 복사 (하단) */}
        <button
          onClick={handleCopy}
          className="absolute bottom-2.5 left-2.5 right-2.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-neutral-900 opacity-0 shadow-sm backdrop-blur transition hover:bg-white group-hover:opacity-100"
        >
          {copied ? "✓ 복사됨" : "프롬프트 복사"}
        </button>
      </Link>

      {/* 정보 */}
      <div className="px-0.5 pt-2.5">
        <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
          {prompt.title}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-400">{prompt.model}</p>

        <div className="mt-2 flex items-center justify-between">
          {prompt.author.id ? (
            <Link
              href={`/u/${prompt.author.id}`}
              className="flex min-w-0 items-center gap-1.5 hover:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prompt.author.avatarUrl}
                alt={prompt.author.name}
                className="h-5 w-5 shrink-0 rounded-full object-cover"
              />
              <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {prompt.author.name}
              </span>
            </Link>
          ) : (
            <div className="flex min-w-0 items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prompt.author.avatarUrl}
                alt={prompt.author.name}
                className="h-5 w-5 shrink-0 rounded-full object-cover"
              />
              <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {prompt.author.name}
              </span>
            </div>
          )}

          <button
            onClick={like.toggle}
            disabled={like.loading}
            aria-label="좋아요"
            className={`flex shrink-0 items-center gap-1 text-xs transition active:scale-90 disabled:opacity-50 ${
              like.liked
                ? "text-rose-500"
                : "text-neutral-400 hover:text-rose-400"
            }`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill={like.liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={1.6}
              aria-hidden
            >
              <path d="M10 17.5 3.8 11.3a3.9 3.9 0 0 1 5.5-5.5l.7.7.7-.7a3.9 3.9 0 1 1 5.5 5.5L10 17.5Z" />
            </svg>
            {like.count.toLocaleString("ko-KR")}
          </button>
        </div>
      </div>
    </div>
  );
}
