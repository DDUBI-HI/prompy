import Link from "next/link";
import Header from "@/components/Header";
import PromptCard from "@/components/PromptCard";
import { getPrompts, getSavedPromptIds } from "@/lib/prompts";
import { ALL, CATEGORY_CHIPS } from "@/lib/categories";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = cat && CATEGORY_CHIPS.includes(cat) ? cat : ALL;

  const [prompts, savedIds] = await Promise.all([
    getPrompts(active),
    getSavedPromptIds(),
  ]);

  return (
    <>
      <Header />

      {/* 카테고리 칩 줄 */}
      <div className="mx-auto max-w-screen-2xl px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORY_CHIPS.map((c) => {
            const isActive = c === active;
            const href = c === ALL ? "/" : `/?cat=${encodeURIComponent(c)}`;
            return (
              <Link
                key={c}
                href={href}
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
        {prompts.length > 0 ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
            {prompts.map((p) => (
              <PromptCard key={p.id} prompt={p} saved={savedIds.has(p.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-lg font-semibold">
              아직 &lsquo;{active}&rsquo; 프롬프트가 없어요
            </p>
            <p className="text-sm text-neutral-500">
              첫 프롬프트를 올려보세요. (업로드 기능은 곧 추가됩니다)
            </p>
          </div>
        )}
      </main>
    </>
  );
}
