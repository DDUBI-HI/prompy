export type Category =
  | "업무/생산성"
  | "디자인/이미지"
  | "글쓰기/콘텐츠"
  | "공부/학습"
  | "개발/코딩"
  | "취미/일상"
  | "재미/캐릭터";

export type Prompt = {
  id: string;
  title: string;
  /** 복사해서 바로 쓸 수 있는 프롬프트 본문 */
  body: string;
  /** 이 프롬프트가 무엇이고 어떻게 쓰는지에 대한 설명 */
  description: string;
  /** 목적 기반 상위 카테고리 */
  category: Category;
  /** 대상 AI / 모델 (예: Midjourney, DALL·E, ChatGPT) */
  model: string;
  /** 결과 예시 이미지 URL */
  imageUrl: string;
  /** 썸네일 세로 비율 힌트 — 메이슨리에서 높이를 다양하게 보이게 함 */
  aspect: "portrait" | "square" | "landscape";
  tags: string[];
  author: {
    name: string;
    avatarUrl: string;
  };
  likes: number;
  saves: number;
};
