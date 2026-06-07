// Shared TypeScript types for the Logos application

export interface ReadingPart {
  part_number: number;
  text: string;
}

export interface Presentation {
  title: string;
  reading_parts: ReadingPart[];
}

export interface Preset {
  category: "philosophy" | "arts" | "literature" | "architecture";
  title: string;
  icon: string;
  text: string;
}

export interface CardData {
  explore_title: string;
  explore_subtext: string;
  vault_question: string;
  vault_answer: string;
}

export interface FeedCard {
  id: string;
  category: string;
  topic: string;
  philosopher: string;
  visual_mood: string;
  explore_title: string;
  explore_subtext: string;
  vault_question: string;
  vault_answer: string;
  presentation: Presentation;
  stack_id?: string;
}

export interface ContentStack {
  stack_id: string;
  category: string;
  topic: string;
  philosopher: string;
  visual_mood: string;
  cards: CardData[];
  presentation: Presentation;
}

export interface SavedVaultCard {
  id: string;
  stack_id: string;
  topic: string;
  philosopher: string;
  visual_mood: string;
  explore_title: string;
  explore_subtext: string;
  vault_question: string;
  vault_answer: string;
  savedAt: string;
  reviewCount: number;
  masteryLevel: string;
}

export interface MoodAesthetic {
  bg: string;
  text: string;
  sub: string;
  accent: string;
  border: string;
  glow: string;
  cardBg: string;
  btnColor: string;
  badgeColor: string;
  display: string;
}
