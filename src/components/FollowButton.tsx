"use client";

import { useFollow } from "@/lib/useFollow";

export default function FollowButton({
  profileId,
  initialFollowing,
  initialFollowers,
}: {
  profileId: string;
  initialFollowing: boolean;
  initialFollowers: number;
}) {
  const { following, loading, toggle } = useFollow(
    profileId,
    initialFollowing,
    initialFollowers
  );

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-6 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
        following
          ? "border border-black/15 text-neutral-700 hover:bg-black/5 dark:border-white/20 dark:text-neutral-200 dark:hover:bg-white/10"
          : "bg-rose-600 text-white hover:bg-rose-700"
      }`}
    >
      {following ? "팔로잉" : "팔로우"}
    </button>
  );
}
