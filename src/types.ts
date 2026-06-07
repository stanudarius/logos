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

/** Typographic layout variants for the Thought Stream poster cards */
export type LayoutVariant = "thesis" | "blockquote" | "fragment" | "epigraph";

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
  /** Assigned programmatically — cycles through 4 typographic layouts */
  layoutVariant?: LayoutVariant;
  /**
   * Cloze deletion segments for spaced-repetition cards.
   * Odd-indexed segments are the "blanked" words to be revealed on tap.
   * e.g., ["The unexamined life is not worth ", "living", "."]
   */
  quote?: string[];
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
  presentation: Presentation;
  date_added: string;
  ease_factor: number;
  interval: number;
  next_review_date: string;
  review_count: number;
  /** Cloze deletion segments inherited from FeedCard */
  quote?: string[];
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

/** Relationship types for Knowledge Constellation edges */
export type EdgeRelationship = "Influenced" | "Critiqued" | "Contradicts" | "Contemporaries" | "Inspired";

/** Graph edge with philosophical relationship metadata */
export interface GraphEdge {
  from: string;
  to: string;
  relationship: EdgeRelationship;
  dashed?: boolean;
}
