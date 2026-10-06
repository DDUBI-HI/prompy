import { Prompt, Category } from "./types";
import { mockPrompts, getPromptById } from "./mockPrompts";
import { ALL } from "./categories";
import { isSupabaseConfigured } from "./supabase/env";
import { createClient } from "./supabase/server";

// Supabase prompts 테이블의 행 (snake_case)
type PromptRow = {
  id: string;
  title: string;
  body: string;
  description: string;
  category: Category;
  model: string;
  image_url: string;
  aspect: "portrait" | "square" | "landscape";
  tags: string[] | null;
  author_name: string;
  author_avatar: string;
  likes: number;
  saves: number;
};

function rowToPrompt(r: PromptRow): Prompt {
  return {
    id: r.id,
    title: r.title,
    body: r.body,
    description: r.description,
    category: r.category,
    model: r.model,
    imageUrl: r.image_url,
    aspect: r.aspect,
    tags: r.tags ?? [],
    author: { name: r.author_name, avatarUrl: r.author_avatar },
    likes: r.likes,
    saves: r.saves,
  };
}

function filterMock(category?: string): Prompt[] {
  if (!category || category === ALL) return mockPrompts;
  return mockPrompts.filter((p) => p.category === category);
}

/** 피드용 프롬프트 목록 (카테고리 필터 선택) */
export async function getPrompts(category?: string): Promise<Prompt[]> {
  if (!isSupabaseConfigured()) return filterMock(category);

  const supabase = await createClient();
  let query = supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== ALL) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    console.error("getPrompts 실패:", error.message);
    return filterMock(category);
  }
  return (data as PromptRow[]).map(rowToPrompt);
}

/** 상세용 단일 프롬프트 */
export async function getPrompt(id: string): Promise<Prompt | null> {
  if (!isSupabaseConfigured()) return getPromptById(id) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToPrompt(data as PromptRow);
}
