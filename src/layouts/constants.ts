import { BookOpen, Bookmark, Waypoints } from "lucide-react";

export const NAV_TABS = [
  { id: "explore", label: "Stream", Icon: BookOpen },
  { id: "trails",  label: "Trails", Icon: Waypoints },
  { id: "vault",   label: "Vault",  Icon: Bookmark },
] as const;
