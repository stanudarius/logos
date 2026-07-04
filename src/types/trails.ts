/** A curated sequence of thinkers forming a learning path */
export interface ReadingTrail {
  id: string;
  category: "philosophy" | "arts" | "literature";
  title: string;
  description: string;
  thinkerIds: string[]; // e.g. ["epictetus", "marcus", "seneca"]
}
