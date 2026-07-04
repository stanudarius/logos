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
