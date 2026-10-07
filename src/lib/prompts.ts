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

/** 현재 로그인 사용자가 저장한 프롬프트 id 집합 (저장 버튼 상태 표시용) */
export async function getSavedPromptIds(): Promise<Set<string>> {
  if (!isSupabaseConfigured()) return new Set();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("saves")
    .select("prompt_id")
    .eq("user_id", user.id);

  return new Set((data ?? []).map((r) => r.prompt_id as string));
}

/** 내 저장함: 내가 저장한 프롬프트 목록 (최근 저장순) */
export async function getSavedPrompts(): Promise<Prompt[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saves")
    .select("created_at, prompt:prompts(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data
    .map((r) => (r.prompt as unknown as PromptRow | null))
    .filter((p): p is PromptRow => Boolean(p))
    .map(rowToPrompt);
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
