// Shared TypeScript types for the Logos application

export interface ReadingPart {
  part_number: number;
  text: string;
}

export interface Presentation {
  title: string;
  reading_parts: ReadingPart[];
}

export interface CardData {
  explore_title: string;
  explore_subtext: string;
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
  presentation: Presentation;
  stack_id?: string;
  /** Assigned programmatically — cycles through 4 typographic layouts */
  layoutVariant?: LayoutVariant;
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
  presentation: Presentation;
  date_added: string;
  /** Personal annotation for the Commonplace Book */
  annotation?: string;
  user_folder?: string;
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
