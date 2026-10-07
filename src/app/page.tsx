import Link from "next/link";
import Header from "@/components/Header";
import PromptCard from "@/components/PromptCard";
import { getPrompts, getSavedPromptIds, getLikedPromptIds } from "@/lib/prompts";
import type { SortOption } from "@/lib/prompts";
import { ALL, CATEGORY_CHIPS } from "@/lib/categories";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sort?: string; q?: string }>;
}) {
  const { cat, sort, q } = await searchParams;
  const active = cat && CATEGORY_CHIPS.includes(cat) ? cat : ALL;
  const sortOpt: SortOption = sort === "popular" ? "popular" : "latest";
  const query = q?.trim() ?? "";

  const [prompts, savedIds, likedIds] = await Promise.all([
    getPrompts(active, sortOpt, query),
    getSavedPromptIds(),
    getLikedPromptIds(),
  ]);

  // 칩/정렬 링크에서 현재 선택값을 유지하기 위한 쿼리 조합
  const buildHref = (nextCat: string, nextSort: SortOption) => {
    const params = new URLSearchParams();
    if (nextCat !== ALL) params.set("cat", nextCat);
    if (nextSort !== "latest") params.set("sort", nextSort);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <>
      <Header />

      {/* 정렬 탭 (최신 / 인기) */}
      <div className="mx-auto max-w-screen-2xl px-4 pt-4">
        <div className="flex gap-2">
          {([
            ["latest", "최신"],
            ["popular", "🔥 인기"],
          ] as [SortOption, string][]).map(([key, label]) => (
            <Link
              key={key}
              href={buildHref(active, key)}
              scroll={false}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                sortOpt === key
                  ? "bg-rose-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* 카테고리 칩 줄 */}
      <div className="mx-auto max-w-screen-2xl px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORY_CHIPS.map((c) => {
            const isActive = c === active;
            return (
              <Link
                key={c}
                href={buildHref(c, sortOpt)}
                scroll={false}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {c}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 메이슨리 피드 (CSS columns) */}
      <main className="mx-auto max-w-screen-2xl px-4 pb-16">
        {query && (
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            <b className="text-neutral-900 dark:text-white">
              &lsquo;{query}&rsquo;
            </b>{" "}
            검색 결과 {prompts.length}개
          </p>
        )}

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
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-lg font-semibold">
              {query
                ? `'${query}'에 대한 결과가 없어요`
                : `아직 '${active}' 프롬프트가 없어요`}
            </p>
            <p className="text-sm text-neutral-500">
              {query
                ? "다른 검색어로 찾아보세요."
                : "첫 프롬프트를 올려보세요."}
            </p>
          </div>
        )}
      </main>
    </>
  );
}
