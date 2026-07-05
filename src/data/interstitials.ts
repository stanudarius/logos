import type { FeedCard } from "@/src/features/feed/types";

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

const INTERSTITIAL_CARDS: FeedCard[] = [
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
  ),
  createInterstitial(
    "interstitial_schrodinger",
    "Schrödinger's Cat",
    "A cat in a sealed box with a radioactive mechanism is simultaneously both alive and dead until an observer opens the box. Does reality only exist when we look at it?"
  ),
  createInterstitial(
    "interstitial_trolley",
    "The Trolley Problem",
    "A runaway trolley is hurtling towards five tied-up people. You can pull a lever to divert it onto a track where it will kill only one. Is it just to actively cause one death to passively prevent five?"
  ),
  createInterstitial(
    "interstitial_veil_ignorance",
    "The Veil of Ignorance",
    "If you had to design a society without knowing what your race, class, gender, or health would be within it, what rules would you make? True justice requires blind empathy."
  ),
  createInterstitial(
    "interstitial_brain_vat",
    "Brain in a Vat",
    "How do you know you are not just a brain floating in a jar of nutrient fluid, connected to a supercomputer feeding you electrical impulses that simulate this exact moment?"
  ),
  createInterstitial(
    "interstitial_eternal_return",
    "The Eternal Return",
    "If a demon told you that you would have to live this exact life, with every pain and every joy, over and over again for eternity, would you curse him or praise him as a god?"
  ),
  createInterstitial(
    "interstitial_beetle_box",
    "The Beetle in a Box",
    "Suppose everyone has a box containing something they call a 'beetle', but no one can look into anyone else's box. How do we know we are all experiencing the same thing when we use the same words?"
  ),
  createInterstitial(
    "interstitial_mary_room",
    "Mary's Room",
    "Mary is a brilliant scientist confined to a black-and-white room. She knows every physical fact about the color red. When she finally steps outside and sees an apple, does she learn something new?"
  ),
  createInterstitial(
    "interstitial_pascal_wager",
    "Pascal's Wager",
    "If God exists and you believe, you gain heaven. If he does not, you lose nothing. If you disbelieve and he exists, you face damnation. Is faith a rational bet?"
  ),
  createInterstitial(
    "interstitial_infinite_monkey",
    "The Infinite Monkey Theorem",
    "If you give an infinite number of monkeys an infinite number of typewriters for an infinite amount of time, they will eventually type the complete works of Shakespeare. Chaos inevitably produces order."
  ),
  createInterstitial(
    "interstitial_panopticon",
    "The Panopticon",
    "A circular prison where guards can see every cell, but inmates cannot see the guards. Knowing they might be watched at any moment, the prisoners police themselves. Is society a Panopticon?"
  ),
  createInterstitial(
    "interstitial_grandfather",
    "The Grandfather Paradox",
    "If you travel back in time and kill your own grandfather before your parent is conceived, you would never be born. But if you were never born, who killed your grandfather?"
  ),
  createInterstitial(
    "interstitial_long_spoons",
    "Allegory of the Long Spoons",
    "In Hell, people starve trying to feed themselves with spoons too long for their arms. In Heaven, they use the exact same spoons, but they feed each other."
  ),
  createInterstitial(
    "interstitial_library_babel",
    "The Library of Babel",
    "An infinite library contains every possible book, representing every combination of letters. It holds all truth, but it is entirely useless, buried beneath an infinite ocean of gibberish."
  ),
  createInterstitial(
    "interstitial_twin_earth",
    "Twin Earth",
    "Imagine a planet exactly like ours, but their 'water' is made of XYZ instead of H2O. When they say 'water', do they mean the same thing we do? Is meaning inside the head, or in the world?"
  ),
  createInterstitial(
    "interstitial_occam",
    "Occam's Razor",
    "Entities should not be multiplied without necessity. When faced with competing explanations for the same phenomenon, the simplest one is usually the correct one."
  )
];

let interstitialDeck: FeedCard[] = [];

export const getRandomInterstitial = (): FeedCard => {
  if (interstitialDeck.length === 0) {

    interstitialDeck = [...INTERSTITIAL_CARDS].sort(() => Math.random() - 0.5);
  }


  const card = { ...interstitialDeck.pop()! };


  card.id = `${card.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return card;
};
