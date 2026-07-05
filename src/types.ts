// Shared TypeScript types for the Logos application

export interface ReadingPart {
  part_number: number;
  text: string;
}

export interface Presentation {
  title: string;
  reading_parts: ReadingPart[];
}


/** Typographic layout variants for the Thought Stream poster cards */
export type LayoutVariant = "thesis" | "blockquote" | "fragment" | "epigraph" | "interstitial";

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


export interface SavedVaultCard {
  id: string;
  base_id?: string;
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


export interface Node {
  id: string;
  label: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  group: "ancient" | "stoic" | "existential" | "literature" | "arts";
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

/** A curated sequence of thinkers forming a learning path */
export interface ReadingTrail {
  id: string;
  category: "philosophy" | "arts" | "literature";
  title: string;
  description: string;
  thinkerIds: string[]; // e.g. ["epictetus", "marcus", "seneca"]
}

