"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/types";

const MODELS = [
  "Midjourney",
  "DALL·E 3",
  "Stable Diffusion",
  "ChatGPT",
  "Claude",
  "기타",
];

/** 이미지 가로세로로 썸네일 비율 결정 */
function detectAspect(
  w: number,
  h: number
): "portrait" | "square" | "landscape" {
  if (h > w * 1.15) return "portrait";
  if (w > h * 1.15) return "landscape";
  return "square";
}

export default function UploadForm({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aspect, setAspect] =
    useState<"portrait" | "square" | "landscape">("square");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [category, setCategory] = useState<Category>(CATEGORIES[1]); // 디자인/이미지
  const [tagsText, setTagsText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const im = new Image();
    im.onload = () => setAspect(detectAspect(im.naturalWidth, im.naturalHeight));
    im.src = url;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) return setError("결과 예시 이미지를 올려주세요.");
    if (!title.trim()) return setError("제목을 입력해주세요.");
    if (!body.trim()) return setError("프롬프트 내용을 입력해주세요.");

    setLoading(true);
    const supabase = createClient();

    // 1) 이미지 업로드 (내 폴더: userId/파일명)
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("prompt-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (upErr) {
      setLoading(false);
      return setError("이미지 업로드 실패: " + upErr.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("prompt-images").getPublicUrl(path);

    // 2) 프롬프트 행 저장
    const tags = tagsText
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const authorName = userEmail.split("@")[0] || "익명";

    const { data: inserted, error: insErr } = await supabase
      .from("prompts")
      .insert({
        title: title.trim(),
        body: body.trim(),
        description: description.trim(),
        category,
        model,
        image_url: publicUrl,
        aspect,
        tags,
        author_name: authorName,
        author_avatar: `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(
          userId
        )}`,
        user_id: userId,
      })
      .select("id")
      .single();

    setLoading(false);

    if (insErr || !inserted) {
      return setError("저장 실패: " + (insErr?.message ?? "알 수 없는 오류"));
    }

    // 3) 방금 올린 상세로 이동
    router.push(`/prompt/${inserted.id}`);
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-400 dark:border-white/15 dark:bg-neutral-900";

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">프롬프트 올리기</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* 이미지 업로드 */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            결과 예시 이미지 <span className="text-rose-600">*</span>
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="flex min-h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-neutral-50 transition hover:border-rose-400 dark:border-white/15 dark:bg-neutral-900"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="미리보기"
                className="max-h-96 w-full object-contain"
              />
            ) : (
              <span className="text-sm text-neutral-500">
                클릭해서 이미지 선택
              </span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickFile}
            className="hidden"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            제목 <span className="text-rose-600">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 네온 사이버펑크 도시 야경"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            프롬프트 내용 <span className="text-rose-600">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="복사해서 바로 쓸 수 있는 프롬프트를 적어주세요"
            className={`${inputCls} font-mono`}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            설명 / 사용법
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="어떻게 쓰면 좋은지, 어떤 부분을 바꾸면 되는지 알려주세요"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold">모델</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={inputCls}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            태그 (쉼표로 구분)
          </label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="사이버펑크, 도시, 야경"
            className={inputCls}
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-rose-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {loading ? "올리는 중…" : "프롬프트 올리기"}
        </button>
      </form>
    </main>
  );
}
