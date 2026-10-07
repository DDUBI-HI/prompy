import { isSupabaseConfigured } from "./supabase/env";
import { createClient } from "./supabase/server";

export type Profile = {
  id: string;
  displayName: string;
  avatarUrl: string;
};

export type FollowStats = {
  followers: number;
  following: number;
  isFollowing: boolean; // 현재 로그인 사용자가 이 사람을 팔로우 중인지
  isSelf: boolean; // 내 프로필인지
};

/** 프로필 1명 */
export async function getProfile(id: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
  };
}

/** 팔로워/팔로잉 수 + 내 팔로우 여부 */
export async function getFollowStats(profileId: string): Promise<FollowStats> {
  const empty: FollowStats = {
    followers: 0,
    following: 0,
    isFollowing: false,
    isSelf: false,
  };
  if (!isSupabaseConfigured()) return empty;

  const supabase = await createClient();

  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", profileId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", profileId),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFollowing = false;
  if (user && user.id !== profileId) {
    const { data } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id)
      .eq("following_id", profileId)
      .maybeSingle();
    isFollowing = Boolean(data);
  }

  return {
    followers: followers ?? 0,
    following: following ?? 0,
    isFollowing,
    isSelf: Boolean(user && user.id === profileId),
  };
}
