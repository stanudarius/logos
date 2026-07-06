export interface ReadingPart {
  part_number: number;
  text: string;
}

export interface Presentation {
  title: string;
  reading_parts: ReadingPart[];
}

/** Typographic layout variants for the Thought Stream poster cards */
export type LayoutVariant =
  "thesis" | "blockquote" | "fragment" | "epigraph" | "interstitial";

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
  base_id?: string;
  /** Assigned programmatically — cycles through 4 typographic layouts */
  layoutVariant?: LayoutVariant;
}
