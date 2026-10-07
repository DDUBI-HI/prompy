import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import PromptCard from "@/components/PromptCard";
import FollowButton from "@/components/FollowButton";
import { getProfile, getFollowStats } from "@/lib/social";
import {
  getPromptsByUser,
  getSavedPromptIds,
  getLikedPromptIds,
} from "@/lib/prompts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);
  return { title: profile ? `${profile.displayName} — 프롬피` : "프롬피" };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();

  const [prompts, stats, savedIds, likedIds] = await Promise.all([
    getPromptsByUser(id),
    getFollowStats(id),
    getSavedPromptIds(),
    getLikedPromptIds(),
  ]);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-screen-2xl px-4 py-8">
        {/* 프로필 헤더 */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="h-24 w-24 rounded-full bg-neutral-100 object-cover dark:bg-neutral-800"
          />
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>

          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <span>
              <b className="text-neutral-900 dark:text-white">
                {prompts.length}
              </b>{" "}
              프롬프트
            </span>
            <span>
              팔로워{" "}
              <b className="text-neutral-900 dark:text-white">
                {stats.followers}
              </b>
            </span>
            <span>
              팔로잉{" "}
              <b className="text-neutral-900 dark:text-white">
                {stats.following}
              </b>
            </span>
          </div>

          {!stats.isSelf && (
            <FollowButton
              profileId={id}
              initialFollowing={stats.isFollowing}
              initialFollowers={stats.followers}
            />
          )}
        </div>

        {/* 올린 프롬프트 */}
        {prompts.length > 0 ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                saved={savedIds.has(p.id)}
                liked={likedIds.has(p.id)}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-neutral-500">
            아직 올린 프롬프트가 없어요.
          </p>
        )}
      </main>
    </>
  );
}
