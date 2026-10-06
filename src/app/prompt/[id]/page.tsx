import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CopyButton from "@/components/CopyButton";
import SaveButton from "@/components/SaveButton";
import { getPrompt } from "@/lib/prompts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) return { title: "프롬피" };
  return {
    title: `${prompt.title} — 프롬피`,
    description: prompt.description,
  };
}

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) notFound();

  return (
    <>
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* 뒤로 가기 */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M12.7 5.3a1 1 0 0 1 0 1.4L9.42 10l3.3 3.3a1 1 0 0 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
          둘러보기로 돌아가기
        </Link>

        {/* 핀터레스트식 클로즈업 카드 */}
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900 md:grid md:grid-cols-2">
          {/* 왼쪽: 결과 예시 이미지 */}
          <div className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prompt.imageUrl}
              alt={prompt.title}
              className="max-h-[70vh] w-full object-contain"
            />
          </div>

          {/* 오른쪽: 프롬프트 정보 */}
          <div className="flex flex-col gap-5 p-6 md:p-8">
            {/* 상단: 저장 + 통계 */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M10 17.5 3.8 11.3a3.9 3.9 0 0 1 5.5-5.5l.7.7.7-.7a3.9 3.9 0 1 1 5.5 5.5L10 17.5Z" />
                  </svg>
                  {prompt.likes.toLocaleString("ko-KR")}
                </span>
                <span>저장 {prompt.saves.toLocaleString("ko-KR")}</span>
              </span>
              <SaveButton />
            </div>

            {/* 모델 배지 + 제목 */}
            <div>
              <span className="inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">
                {prompt.model}
              </span>
              <h1 className="mt-3 text-2xl font-bold leading-snug">
                {prompt.title}
              </h1>
            </div>

            {/* 작성자 */}
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prompt.author.avatarUrl}
                alt={prompt.author.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{prompt.author.name}</span>
            </div>

            {/* 프롬프트 본문 + 복사 */}
            <div>
              <h2 className="mb-2 text-sm font-bold text-neutral-500">프롬프트</h2>
              <pre className="mb-3 whitespace-pre-wrap break-words rounded-2xl bg-neutral-100 p-4 font-mono text-sm leading-relaxed text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                {prompt.body}
              </pre>
              <CopyButton text={prompt.body} />
            </div>

            {/* 설명 / 사용법 */}
            <div>
              <h2 className="mb-2 text-sm font-bold text-neutral-500">
                이렇게 써보세요
              </h2>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {prompt.description}
              </p>
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
