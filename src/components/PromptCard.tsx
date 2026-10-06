"use client";

import { useState } from "react";
import Link from "next/link";
import { Prompt } from "@/lib/types";

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(prompt.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근 실패 시 조용히 무시 (M2에서 폴백 처리)
    }
  }

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    setSaved((s) => !s);
  }

  return (
    <div className="group mb-4 break-inside-avoid">
      <Link href={`/prompt/${prompt.id}`} className="block">
        {/* 이미지 + 호버 오버레이 */}
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            loading="lazy"
            className="w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />

          {/* 어둡게 덮는 오버레이 */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />

          {/* 저장 버튼 (우상단) */}
          <button
            onClick={handleSave}
            className={`absolute right-3 top-3 rounded-full px-4 py-2 text-sm font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100 ${
              saved ? "bg-neutral-900" : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {saved ? "저장됨" : "저장"}
          </button>

          {/* 복사 버튼 (하단) */}
          <button
            onClick={handleCopy}
            className="absolute bottom-3 left-3 right-3 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-neutral-900 opacity-0 shadow-lg backdrop-blur transition hover:bg-white group-hover:opacity-100"
          >
            {copied ? "✓ 복사됨!" : "프롬프트 복사"}
          </button>

          {/* 모델 배지 (좌상단) */}
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {prompt.model}
          </span>
        </div>
      </Link>

      {/* 제목 + 메타 */}
      <div className="px-1 pt-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {prompt.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prompt.author.avatarUrl}
              alt={prompt.author.name}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {prompt.author.name}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M10 17.5 3.8 11.3a3.9 3.9 0 0 1 5.5-5.5l.7.7.7-.7a3.9 3.9 0 1 1 5.5 5.5L10 17.5Z" />
            </svg>
            {prompt.likes.toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </div>
  );
}
