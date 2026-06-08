import type { FeedCard } from "../types";
import { PRESENTATIONS } from "./presentations";

export const INITIAL_FEED_CARDS: FeedCard[] = [
  // --- ALBERT CAMUS (4 CARDS) ---
  {
    id: "camus_1",
    category: "philosophy",
    topic: "Philosophy of the Absurd",
    philosopher: "Albert Camus",
    visual_mood: "blinding_sunlight",
    explore_title: "The Silence of the World",
    explore_subtext: "The Absurd is born out of the clash between our desperate search for meaning and the silent universe.",
    presentation: PRESENTATIONS.camus
  },
  {
    id: "camus_2",
    category: "philosophy",
    topic: "Philosophy of the Absurd",
    philosopher: "Albert Camus",
    visual_mood: "blinding_sunlight",
    explore_title: "The Myth of Sisyphus",
    explore_subtext: "Condemned to roll a boulder up a hill for eternity, Sisyphus becomes the ultimate absurd hero.",
    presentation: PRESENTATIONS.camus
  },
  {
    id: "camus_3",
    category: "philosophy",
    topic: "Philosophy of the Absurd",
    philosopher: "Albert Camus",
    visual_mood: "blinding_sunlight",
    explore_title: "Absurd Rebellion",
    explore_subtext: "Living without hope is not despair, but a continuous conscious rebellion that brings absolute inner freedom.",
    presentation: PRESENTATIONS.camus
  },
  {
    id: "camus_4",
    category: "philosophy",
    topic: "Philosophy of the Absurd",
    philosopher: "Albert Camus",
    visual_mood: "blinding_sunlight",
    explore_title: "Sisyphus Happy",
    explore_subtext: "The struggle itself toward the heights is enough to fill a human heart. One must imagine Sisyphus happy.",
    presentation: PRESENTATIONS.camus,
  },

  // --- SENECA (4 CARDS) ---
  {
    id: "seneca_1",
    category: "philosophy",
    topic: "The Shortness of Life",
    philosopher: "Seneca",
    visual_mood: "amber_glow",
    explore_title: "The Thieves of Time",
    explore_subtext: "Time is our most precious asset, yet it is the only resource we let others steal without reservation.",
    presentation: PRESENTATIONS.seneca,
  },
  {
    id: "seneca_2",
    category: "philosophy",
    topic: "The Shortness of Life",
    philosopher: "Seneca",
    visual_mood: "amber_glow",
    explore_title: "Living vs. Existing",
    explore_subtext: "Do not measure a life by gray hairs; many people have merely existed for a long time, not lived.",
    presentation: PRESENTATIONS.seneca
  },
  {
    id: "seneca_3",
    category: "philosophy",
    topic: "The Shortness of Life",
    philosopher: "Seneca",
    visual_mood: "amber_glow",
    explore_title: "The Present Is Ours",
    explore_subtext: "While we wait for life, life passes. We suffer more in imagination than in reality.",
    presentation: PRESENTATIONS.seneca
  },
  {
    id: "seneca_4",
    category: "philosophy",
    topic: "The Shortness of Life",
    philosopher: "Seneca",
    visual_mood: "amber_glow",
    explore_title: "Wisdom of the Past",
    explore_subtext: "To spend time with the ancient sages is to add all past ages to our own short lifespan.",
    presentation: PRESENTATIONS.seneca
  },

  // --- MARCUS AURELIUS (4 CARDS) ---
  {
    id: "marcus_1",
    category: "philosophy",
    topic: "Dichotomy of Control",
    philosopher: "Marcus Aurelius",
    visual_mood: "crimson_twilight",
    explore_title: "The Inner Citadel",
    explore_subtext: "Our thoughts, judgments, and actions are under our command. External variables are completely beyond our control.",
    presentation: PRESENTATIONS.marcus
  },
  {
    id: "marcus_2",
    category: "philosophy",
    topic: "Dichotomy of Control",
    philosopher: "Marcus Aurelius",
    visual_mood: "crimson_twilight",
    explore_title: "The Obstacle is the Path",
    explore_subtext: "What stands in the way becomes the way. Every barrier is an opportunity to practice virtue and patience.",
    presentation: PRESENTATIONS.marcus,
  },
  {
    id: "marcus_3",
    category: "philosophy",
    topic: "Dichotomy of Control",
    philosopher: "Marcus Aurelius",
    visual_mood: "crimson_twilight",
    explore_title: "Waking to Duty",
    explore_subtext: "When you struggle to wake, remind yourself: 'I am rising to do the work of a human being.'",
    presentation: PRESENTATIONS.marcus
  },
  {
    id: "marcus_4",
    category: "philosophy",
    topic: "Dichotomy of Control",
    philosopher: "Marcus Aurelius",
    visual_mood: "crimson_twilight",
    explore_title: "The Color of Your Mind",
    explore_subtext: "The soul becomes dyed with the color of its thoughts. Guard your mind's focus carefully.",
    presentation: PRESENTATIONS.marcus
  },

  // --- SOCRATES (4 CARDS) ---
  {
    id: "socrates_1",
    category: "philosophy",
    topic: "The Socratic Method",
    philosopher: "Socrates",
    visual_mood: "emerald_mist",
    explore_title: "Intellectual Midwifery",
    explore_subtext: "Socrates called his approach Maieutics: helping pregnant minds give birth to their own latent truths.",
    presentation: PRESENTATIONS.socrates
  },
  {
    id: "socrates_2",
    category: "philosophy",
    topic: "The Socratic Method",
    philosopher: "Socrates",
    visual_mood: "emerald_mist",
    explore_title: "The Goal of Refutation",
    explore_subtext: "His primary revelation was the limit of human knowing: 'I know that I know nothing.'",
    presentation: PRESENTATIONS.socrates
  },
  {
    id: "socrates_3",
    category: "philosophy",
    topic: "The Socratic Method",
    philosopher: "Socrates",
    visual_mood: "emerald_mist",
    explore_title: "The Unexamined Life",
    explore_subtext: "The unexamined life is not worth living. Self-reflection is the absolute threshold of virtue.",
    presentation: PRESENTATIONS.socrates,
  },
  {
    id: "socrates_4",
    category: "philosophy",
    topic: "The Socratic Method",
    philosopher: "Socrates",
    visual_mood: "emerald_mist",
    explore_title: "Socratic Irony",
    explore_subtext: "By feigning ignorance, Socrates invites interlocutors to expose the fragility of assumptions.",
    presentation: PRESENTATIONS.socrates
  },

  // --- VINCENT VAN GOGH (4 CARDS) ---
  {
    id: "vangogh_1",
    category: "arts",
    topic: "Expression of Color",
    philosopher: "Vincent Van Gogh",
    visual_mood: "cosmic_void",
    explore_title: "Psychological Projection",
    explore_subtext: "Van Gogh redefined color, using it as a direct channel for intense psychological projection rather than realism.",
    presentation: PRESENTATIONS.vangogh
  },
  {
    id: "vangogh_2",
    category: "arts",
    topic: "Expression of Color",
    philosopher: "Vincent Van Gogh",
    visual_mood: "cosmic_void",
    explore_title: "The Starry Sky",
    explore_subtext: "In painting the night sky, Vincent sought a spiritual window into the infinite cosmos, swirling with vibrant life.",
    presentation: PRESENTATIONS.vangogh
  },
  {
    id: "vangogh_3",
    category: "arts",
    topic: "Expression of Color",
    philosopher: "Vincent Van Gogh",
    visual_mood: "cosmic_void",
    explore_title: "Suffer for the Canvas",
    explore_subtext: "Artistic creation was a violent necessity for Vincent, a way to survive his internal tempest.",
    presentation: PRESENTATIONS.vangogh
  },
  {
    id: "vangogh_4",
    category: "arts",
    topic: "Expression of Color",
    philosopher: "Vincent Van Gogh",
    visual_mood: "cosmic_void",
    explore_title: "The Wheatfield's Quiet",
    explore_subtext: "His final works, painted under vast skies, convey both immense sadness and ultimate resilience.",
    presentation: PRESENTATIONS.vangogh
  },

  // --- LEONARDO DA VINCI (4 CARDS) ---
  {
    id: "da_vinci_1",
    category: "arts",
    topic: "Secrets of Sfumato",
    philosopher: "Leonardo da Vinci",
    visual_mood: "amber_glow",
    explore_title: "The Smoky Blend",
    explore_subtext: "Leonardo pioneered sfumato—the subtle, smoky blending of tone and color that allows edges to melt naturally.",
    presentation: PRESENTATIONS.da_vinci
  },
  {
    id: "da_vinci_2",
    category: "arts",
    topic: "Secrets of Sfumato",
    philosopher: "Leonardo da Vinci",
    visual_mood: "amber_glow",
    explore_title: "The Anatomy of Nature",
    explore_subtext: "Leonardo believed that art and science are one; to paint a leaf, you must understand the river of its sap.",
    presentation: PRESENTATIONS.da_vinci
  },
  {
    id: "da_vinci_3",
    category: "arts",
    topic: "Secrets of Sfumato",
    philosopher: "Leonardo da Vinci",
    visual_mood: "amber_glow",
    explore_title: "The Mystery of the Smile",
    explore_subtext: "Mona Lisa's smile is transient, shifting as our eyes move from direct gaze to peripheral vision.",
    presentation: PRESENTATIONS.da_vinci
  },
  {
    id: "da_vinci_4",
    category: "arts",
    topic: "Secrets of Sfumato",
    philosopher: "Leonardo da Vinci",
    visual_mood: "amber_glow",
    explore_title: "Universal Curiosita",
    explore_subtext: "A relentless quest for knowledge, tracking the flight of birds, water currents, and the human arm.",
    presentation: PRESENTATIONS.da_vinci
  },

  // --- FRANZ KAFKA (4 CARDS) ---
  {
    id: "kafka_1",
    category: "literature",
    topic: "The Kafkaesque Absurd",
    philosopher: "Franz Kafka",
    visual_mood: "cosmic_void",
    explore_title: "Labyrinthine Systems",
    explore_subtext: "Kafka explores the terrifying sense of alienation within incomprehensible, faceless bureaucracies and systems.",
    presentation: PRESENTATIONS.kafka
  },
  {
    id: "kafka_2",
    category: "literature",
    topic: "The Kafkaesque Absurd",
    philosopher: "Franz Kafka",
    visual_mood: "cosmic_void",
    explore_title: "The Metamorphosis",
    explore_subtext: "Upon waking, Gregor Samsa finds himself transformed into a monstrous insect—the ultimate physical alienation.",
    presentation: PRESENTATIONS.kafka,
  },
  {
    id: "kafka_3",
    category: "literature",
    topic: "The Kafkaesque Absurd",
    philosopher: "Franz Kafka",
    visual_mood: "cosmic_void",
    explore_title: "The Door to the Law",
    explore_subtext: "A doorkeeper guards the Law. A man waits his entire life to enter, only to learn the door was meant only for him.",
    presentation: PRESENTATIONS.kafka
  },
  {
    id: "kafka_4",
    category: "literature",
    topic: "The Kafkaesque Absurd",
    philosopher: "Franz Kafka",
    visual_mood: "cosmic_void",
    explore_title: "The Trial of Existence",
    explore_subtext: "K. is arrested without knowing his crime, showcasing our innate guilt before the court of life.",
    presentation: PRESENTATIONS.kafka
  },

  // --- FYODOR DOSTOEVSKY (4 CARDS) ---
  {
    id: "dostoevsky_1",
    category: "literature",
    topic: "Existential Redemption",
    philosopher: "Fyodor Dostoevsky",
    visual_mood: "crimson_twilight",
    explore_title: "Redemption via Sufferance",
    explore_subtext: "Under Dostoevsky's narrative lens, redemption is never achieved through intellect, but through active, selfless love.",
    presentation: PRESENTATIONS.dostoevsky
  },
  {
    id: "dostoevsky_2",
    category: "literature",
    topic: "Existential Redemption",
    philosopher: "Fyodor Dostoevsky",
    visual_mood: "crimson_twilight",
    explore_title: "The Underground State",
    explore_subtext: "Dostoevsky exposes the bitter, spiteful depths of human vanity in his portrait of the Underground Man.",
    presentation: PRESENTATIONS.dostoevsky
  },
  {
    id: "dostoevsky_3",
    category: "literature",
    topic: "Existential Redemption",
    philosopher: "Fyodor Dostoevsky",
    visual_mood: "crimson_twilight",
    explore_title: "The Grand Inquisitor",
    explore_subtext: "An administrative clerical power argues that mankind values bread and comfortable security much more than free choice.",
    presentation: PRESENTATIONS.dostoevsky
  },
  {
    id: "dostoevsky_4",
    category: "literature",
    topic: "Existential Redemption",
    philosopher: "Fyodor Dostoevsky",
    visual_mood: "crimson_twilight",
    explore_title: "Active Love is Labor",
    explore_subtext: "Active love is a harsh and dreadful thing compared to dreaming, requiring lifelong patience.",
    presentation: PRESENTATIONS.dostoevsky,
  }
];
