import type { FeedCard } from "../types";

const createInterstitial = (id: string, title: string, subtext: string): FeedCard => ({
  id,
  category: "interstitial",
  topic: "Paradoxes & Parables",
  philosopher: "The Void",
  visual_mood: "cosmic_void",
  explore_title: title,
  explore_subtext: subtext,
  layoutVariant: "interstitial",
  presentation: {
    title: title,
    reading_parts: [
      {
        part_number: 1,
        text: subtext
      }
    ]
  }
});

export const INTERSTITIAL_CARDS: FeedCard[] = [
  createInterstitial(
    "interstitial_theseus",
    "The Ship of Theseus",
    "If you replace every wooden plank on a ship over time, is it still the same ship? If you are replacing your cells every seven years, are you still you?"
  ),
  createInterstitial(
    "interstitial_cave",
    "Plato's Cave",
    "Prisoners chained in a cave see only shadows cast on the wall and believe them to be reality. If one escapes into the blinding sun, he realizes the shadows were but illusions. Would the others believe him?"
  ),
  createInterstitial(
    "interstitial_zhuangzi",
    "The Butterfly Dream",
    "I dreamed I was a butterfly, flitting around in the sky. Then I awoke. Now I do not know whether I was a man dreaming I was a butterfly, or whether I am a butterfly dreaming I am a man."
  ),
  createInterstitial(
    "interstitial_zeno",
    "Zeno's Arrow",
    "If an arrow in flight occupies a specific space at any given instant, then at that instant it is motionless. How does it ever reach its target if time is composed of motionless instants?"
  ),
  createInterstitial(
    "interstitial_nietzsche_abyss",
    "The Abyss",
    "He who fights with monsters should look to it that he himself does not become a monster. And if you gaze long into an abyss, the abyss also gazes into you."
  ),
  createInterstitial(
    "interstitial_sorites",
    "The Sorites Paradox",
    "If you remove one grain of sand from a heap, it is still a heap. If you continue removing grains, at what exact point does it cease to be a heap?"
  ),
  createInterstitial(
    "interstitial_buridan",
    "Buridan's Ass",
    "A perfectly rational donkey is placed exactly halfway between two identical bales of hay. Unable to find a reason to prefer one over the other, it starves to death."
  ),
  createInterstitial(
    "interstitial_chinese_room",
    "The Chinese Room",
    "If a man in a locked room perfectly translates Chinese using only a rulebook without understanding the language, can the system itself be said to 'understand' Chinese?"
  ),
  createInterstitial(
    "interstitial_experience_machine",
    "The Experience Machine",
    "If you could plug your brain into a machine that flawlessly simulates a perfect, blissful reality, would you do it? Is truth more valuable than flawless happiness?"
  ),
  createInterstitial(
    "interstitial_gyges",
    "The Ring of Gyges",
    "If a shepherd discovers a ring that turns him invisible, freeing him from all societal consequences, will he remain just? Is morality merely the fear of being caught?"
  )
];

let interstitialDeck: FeedCard[] = [];

export const getRandomInterstitial = (): FeedCard => {
  if (interstitialDeck.length === 0) {
    // Refill and shuffle the deck
    interstitialDeck = [...INTERSTITIAL_CARDS].sort(() => Math.random() - 0.5);
  }

  // Pop a card from the deck so it doesn't repeat until the deck is empty
  const card = { ...interstitialDeck.pop()! };

  // Ensure unique ID for React keys
  card.id = `${card.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return card;
};
