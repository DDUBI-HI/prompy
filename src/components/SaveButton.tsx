"use client";

import { useSavePrompt } from "@/lib/useSavePrompt";

export default function SaveButton({
  promptId,
  initialSaved,
}: {
  promptId: string;
  initialSaved: boolean;
}) {
  const { saved, loading, toggle } = useSavePrompt(promptId, initialSaved);

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-6 py-3 text-sm font-bold transition disabled:opacity-60 ${
        saved
          ? "border border-black/15 text-neutral-700 hover:bg-black/5 dark:border-white/20 dark:text-neutral-200 dark:hover:bg-white/10"
          : "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      }`}
    >
      {saved ? "저장됨" : "저장"}
    </button>
  );
}
