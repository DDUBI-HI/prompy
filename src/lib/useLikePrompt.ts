"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./supabase/client";

/** 좋아요 토글 로직 (카운트 즉시 반영 → 서버에서 최종 동기화) */
export function useLikePrompt(
  promptId: string,
  initialLiked: boolean,
  initialCount: number
) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const next = !liked;
    // 낙관적 업데이트 (화면 먼저 바꾸기)
    setLiked(next);
    setCount((c) => Math.max(c + (next ? 1 : -1), 0));
    setLoading(true);

    if (next) {
      await supabase
        .from("likes")
        .insert({ user_id: user.id, prompt_id: promptId });
    } else {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("prompt_id", promptId);
    }

    setLoading(false);
    router.refresh();
  }

  return { liked, count, loading, toggle };
}
