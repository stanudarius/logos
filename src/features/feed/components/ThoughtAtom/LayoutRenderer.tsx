import React from "react";
import type { FeedCard, LayoutVariant } from "@/src/features/feed/types";

import { InterstitialLayout } from "./layouts/InterstitialLayout";
import { ThesisLayout } from "./layouts/ThesisLayout";
import { BlockquoteLayout } from "./layouts/BlockquoteLayout";
import { FragmentLayout } from "./layouts/FragmentLayout";
import { EpigraphLayout } from "./layouts/EpigraphLayout";

interface LayoutRendererProps {
  card: FeedCard;
  layoutVariant: LayoutVariant;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  card,
  layoutVariant,
}) => {
  switch (layoutVariant) {
    case "interstitial":
      return <InterstitialLayout card={card} />;
    case "thesis":
      return <ThesisLayout card={card} />;
    case "blockquote":
      return <BlockquoteLayout card={card} />;
    case "fragment":
      return <FragmentLayout card={card} />;
    case "epigraph":
    default:
      return <EpigraphLayout card={card} />;
  }
};
