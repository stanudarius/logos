import { Presentation } from "@/src/features/feed/types";

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
