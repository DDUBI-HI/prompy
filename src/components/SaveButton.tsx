"use client";

import { useState } from "react";

export default function SaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <button
      onClick={() => setSaved((s) => !s)}
      className={`rounded-full px-6 py-3 text-sm font-bold text-white transition ${
        saved ? "bg-neutral-900 hover:bg-neutral-800" : "bg-rose-600 hover:bg-rose-700"
      }`}
    >
      {saved ? "저장됨" : "저장"}
    </button>
  );
}
