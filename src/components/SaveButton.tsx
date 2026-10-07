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
      className={`rounded-full px-6 py-3 text-sm font-bold text-white transition disabled:opacity-60 ${
        saved
          ? "bg-neutral-900 hover:bg-neutral-800"
          : "bg-rose-600 hover:bg-rose-700"
      }`}
    >
      {saved ? "저장됨" : "저장"}
    </button>
  );
}
