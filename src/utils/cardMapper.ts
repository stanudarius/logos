import type { ContentStack, FeedCard } from "../types";

/**
 * Maps a ContentStack (from the API response) into an array of FeedCard items.
 * This was previously duplicated 3 times in App.tsx.
 */
export function mapStackToFeedCards(stack: ContentStack): FeedCard[] {
  return (stack.cards || []).map((card, idx) => ({
    id: `gen_${stack.stack_id || "gen"}_card_${idx}_${Date.now()}`,
    stack_id: stack.stack_id,
    category: stack.category || "philosophy",
    topic: stack.topic,
    philosopher: stack.philosopher,
    visual_mood: stack.visual_mood,
    explore_title: card.explore_title || "Untitled",
    explore_subtext: card.explore_subtext || "",
    presentation: stack.presentation || { title: "", reading_parts: [] }
  }));
}
