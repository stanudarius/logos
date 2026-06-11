import { ReadingTrail } from "../types";

export const READING_TRAILS: ReadingTrail[] = [
  // ================= PHILOSOPHY =================
  {
    id: "stoic-control_epictetus",
    category: "philosophy",
    title: "The Dichotomy of Control",
    description: "Map the borders of your own mind with Epictetus.",
    thinkerIds: ["Epictetus"]
  },
  {
    id: "existential-absurd_camus",
    category: "philosophy",
    title: "The Absurd",
    description: "The collision between human longing and the silent universe.",
    thinkerIds: ["Albert Camus"]
  },
  {
    id: "will-to-power_nietzsche",
    category: "philosophy",
    title: "Overcoming and Autonomy",
    description: "The raw, surging current driving all organic life.",
    thinkerIds: ["Friedrich Nietzsche"]
  },
  {
    id: "cynic-bite_diogenes",
    category: "philosophy",
    title: "Radical Authenticity",
    description: "The barefoot provocateur exposing civilization's masks.",
    thinkerIds: ["Diogenes of Sinope"]
  },
  {
    id: "simulacra-desert_baudrillard",
    category: "philosophy",
    title: "Hyperreality and Media",
    description: "The physical world replaced by synthetic simulation.",
    thinkerIds: ["Jean Baudrillard"]
  },

  // ================= ARTS =================
  {
    id: "cubist-fracture_picasso",
    category: "arts",
    title: "Deconstruction of Perspective",
    description: "Shattering the single lens of Western painting.",
    thinkerIds: ["Pablo Picasso"]
  },
  {
    id: "surreal-dream_dali",
    category: "arts",
    title: "The Paranoid-Critical Method",
    description: "Melting the imperial metric of rational time.",
    thinkerIds: ["Salvador Dalí"]
  },
  {
    id: "abstract-abyss_rothko",
    category: "arts",
    title: "Color Field and Transcendence",
    description: "Vast, breathing gateways to induce spiritual vertigo.",
    thinkerIds: ["Mark Rothko"]
  },
  {
    id: "pop-factory_warhol",
    category: "arts",
    title: "Consumerism and Celebrity",
    description: "The synthetic reproduction of fame and tragedy.",
    thinkerIds: ["Andy Warhol"]
  },
  {
    id: "performance-wound_abramovic",
    category: "arts",
    title: "The Present Body",
    description: "Transforming pain and endurance into living art.",
    thinkerIds: ["Marina Abramović"]
  },

  // ================= LITERATURE =================
  {
    id: "modernist-void_kafka",
    category: "literature",
    title: "The Bureaucratic Nightmare",
    description: "The crushing architecture of meaningless guilt.",
    thinkerIds: ["Franz Kafka"]
  },
  {
    id: "hyperborean-ice_dostoevsky",
    category: "literature",
    title: "The Underground Man",
    description: "Diving into the agonizing depths of the Russian soul.",
    thinkerIds: ["Fyodor Dostoevsky"]
  },
  {
    id: "lost-time_proust",
    category: "literature",
    title: "Involuntary Memory",
    description: "Reclaiming the lost past through visceral sensation.",
    thinkerIds: ["Marcel Proust"]
  },
  {
    id: "magical-solitude_marquez",
    category: "literature",
    title: "Magical Realism and History",
    description: "Mythic cycles of love, violence, and isolation.",
    thinkerIds: ["Gabriel García Márquez"]
  },
  {
    id: "postmodern-maze_borges",
    category: "literature",
    title: "The Infinite Library",
    description: "Labyrinths, mirrors, and the architecture of infinity.",
    thinkerIds: ["Jorge Luis Borges"]
  },

  // ================= NEW PHILOSOPHY =================
  {
    id: "socratic-method_socrates",
    category: "philosophy",
    title: "The Examined Life",
    description: "Questioning assumptions through rigorous dialogue.",
    thinkerIds: ["Socrates"]
  },
  {
    id: "ideal-forms_plato",
    category: "philosophy",
    title: "The Theory of Forms",
    description: "Ascending from shadows to the realm of perfect ideas.",
    thinkerIds: ["Plato"]
  },
  {
    id: "golden-mean_aristotle",
    category: "philosophy",
    title: "The Golden Mean",
    description: "Finding virtue between the extremes of excess and deficiency.",
    thinkerIds: ["Aristotle"]
  },
  {
    id: "stoic-logic_zeno",
    category: "philosophy",
    title: "The Porch of Reason",
    description: "The founding principles of Stoic logic and physics.",
    thinkerIds: ["Zeno of Citium"]
  },
  {
    id: "stoic-duty_seneca",
    category: "philosophy",
    title: "Letters from a Stoic",
    description: "Practical wisdom for navigating the treacherous waters of life.",
    thinkerIds: ["Seneca"]
  },
  {
    id: "inner-citadel_marcus",
    category: "philosophy",
    title: "The Inner Citadel",
    description: "Meditations on duty, mortality, and rational composure.",
    thinkerIds: ["Marcus Aurelius"]
  },
  {
    id: "leap-of-faith_kierkegaard",
    category: "philosophy",
    title: "The Leap of Faith",
    description: "Navigating dread and the individual's relation to the divine.",
    thinkerIds: ["Kierkegaard"]
  },
  {
    id: "radical-freedom_sartre",
    category: "philosophy",
    title: "Radical Freedom",
    description: "Existence precedes essence in the face of agonizing liberty.",
    thinkerIds: ["Sartre"]
  },
  {
    id: "second-sex_beauvoir",
    category: "philosophy",
    title: "The Second Sex",
    description: "Deconstructing the myth of woman as the eternal 'Other'.",
    thinkerIds: ["Simone de Beauvoir"]
  },
  {
    id: "cogito-ergo_descartes",
    category: "philosophy",
    title: "Radical Doubt",
    description: "Stripping away all belief to find the indubitable 'I'.",
    thinkerIds: ["Descartes"]
  },
  {
    id: "categorical-imperative_kant",
    category: "philosophy",
    title: "The Categorical Imperative",
    description: "Duty, reason, and the absolute laws of morality.",
    thinkerIds: ["Kant"]
  },

  // ================= NEW LITERATURE =================
  {
    id: "epic-journey_homer",
    category: "literature",
    title: "The Epic Journey",
    description: "Gods, monsters, and the foundational myths of the West.",
    thinkerIds: ["Homer"]
  },
  {
    id: "divine-comedy_dante",
    category: "literature",
    title: "The Divine Comedy",
    description: "A visionary descent through hell and ascent to paradise.",
    thinkerIds: ["Dante"]
  },
  {
    id: "human-condition_shakespeare",
    category: "literature",
    title: "The Human Condition",
    description: "The infinite variety of human passion and tragedy.",
    thinkerIds: ["Shakespeare"]
  },
  {
    id: "social-satire_austen",
    category: "literature",
    title: "Social Satire",
    description: "Piercing observations of class, marriage, and morality.",
    thinkerIds: ["Jane Austen"]
  },
  {
    id: "stream-consciousness_woolf",
    category: "literature",
    title: "Stream of Consciousness",
    description: "Capturing the fleeting, fragmented nature of inner time.",
    thinkerIds: ["Virginia Woolf"]
  },
  {
    id: "dystopian-truth_orwell",
    category: "literature",
    title: "Dystopian Truth",
    description: "Language, power, and the terrifying fragility of freedom.",
    thinkerIds: ["George Orwell"]
  },

  // ================= NEW ARTS =================
  {
    id: "renaissance-man_davinci",
    category: "arts",
    title: "The Renaissance Mind",
    description: "The marriage of rigorous science and sublime artistry.",
    thinkerIds: ["Da Vinci"]
  },
  {
    id: "divine-sculpture_michelangelo",
    category: "arts",
    title: "Divine Sculpture",
    description: "Carving the human soul from rough blocks of marble.",
    thinkerIds: ["Michelangelo"]
  },
  {
    id: "chiaroscuro-soul_rembrandt",
    category: "arts",
    title: "Chiaroscuro of the Soul",
    description: "Illuminating the psychological depths of ordinary humanity.",
    thinkerIds: ["Rembrandt"]
  },
  {
    id: "impressionist-light_monet",
    category: "arts",
    title: "Impressionist Light",
    description: "Capturing the ephemeral dance of atmosphere and color.",
    thinkerIds: ["Monet"]
  },
  {
    id: "post-impressionist-emotion_vangogh",
    category: "arts",
    title: "Post-Impressionist Emotion",
    description: "Thick impasto and the swirling turbulence of inner life.",
    thinkerIds: ["Van Gogh"]
  },
  {
    id: "surreal-pain_kahlo",
    category: "arts",
    title: "Surreal Pain",
    description: "Unflinching self-portraits bridging agony and myth.",
    thinkerIds: ["Frida Kahlo"]
  },

  // ================= NEW ARCHITECTURE (Assimilated to ARTS) =================
  {
    id: "organic-architecture_gaudi",
    category: "arts",
    title: "Organic Architecture",
    description: "Structures echoing the fluid, undulating forms of nature.",
    thinkerIds: ["Gaudi"]
  },
  {
    id: "prairie-style_wright",
    category: "arts",
    title: "Prairie Style",
    description: "Harmony between human habitation and the natural world.",
    thinkerIds: ["Frank Lloyd Wright"]
  },
  {
    id: "modernist-machine_corbusier",
    category: "arts",
    title: "The Machine for Living",
    description: "Rationalist design and the bold geometry of modernism.",
    thinkerIds: ["Le Corbusier"]
  }
];
