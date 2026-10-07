"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./supabase/client";

/** 저장(담기) 토글 로직. 카드/상세 버튼에서 공용으로 쓴다. */
export function useSavePrompt(promptId: string, initialSaved: boolean) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 로그인 안 했으면 로그인 페이지로
    if (!user) {
      router.push("/login");
      return;
    }

    if (saved) {
      await supabase
        .from("saves")
        .delete()
        .eq("user_id", user.id)
        .eq("prompt_id", promptId);
      setSaved(false);
    } else {
      await supabase
        .from("saves")
        .insert({ user_id: user.id, prompt_id: promptId });
      setSaved(true);
    }

    setLoading(false);
    router.refresh();
  }

  return { saved, loading, toggle };
}
