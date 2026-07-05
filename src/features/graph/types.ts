export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
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
