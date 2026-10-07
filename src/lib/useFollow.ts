"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./supabase/client";

/** 팔로우 토글 */
export function useFollow(
  profileId: string,
  initialFollowing: boolean,
  initialFollowers: number
) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
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

    const next = !following;
    setFollowing(next);
    setFollowers((c) => Math.max(c + (next ? 1 : -1), 0));
    setLoading(true);

    if (next) {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: profileId });
    } else {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", profileId);
    }

    setLoading(false);
    router.refresh();
  }

  return { following, followers, loading, toggle };
}
