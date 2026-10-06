import { Category } from "./types";

/** "전체"는 필터 해제를 뜻하는 가상 카테고리 */
export const ALL = "전체" as const;

export const CATEGORIES: Category[] = [
  "업무/생산성",
  "디자인/이미지",
  "글쓰기/콘텐츠",
  "공부/학습",
  "개발/코딩",
  "취미/일상",
  "재미/캐릭터",
];

/** 칩 줄에 표시할 목록 (맨 앞에 전체) */
export const CATEGORY_CHIPS: string[] = [ALL, ...CATEGORIES];
