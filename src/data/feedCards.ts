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
    vault_question: "How is the Absurd born according to Camus?",
    vault_answer: "Through the direct confrontation between the human desire for meaning and the cold, irrational silence of the world.",
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
    vault_question: "Who is the ultimate absurd hero described by Camus?",
    vault_answer: "Sisyphus, eternally condemned to push a boulder up a mountain only to watch it roll back down.",
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
    vault_question: "What does rebellion represent in Camusian philosophy?",
    vault_answer: "The active rejection of false metaphysical meanings, choosing to live life passionately with full awareness of its limits.",
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
    vault_question: "What is Camus's final conclusion about Sisyphus?",
    vault_answer: "One must imagine Sisyphus happy, because his persistent struggle gives form to human dignity and freedom.",
    presentation: PRESENTATIONS.camus
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
    vault_question: "What is Seneca's view on time conservation?",
    vault_answer: "He argues we guard our money and estates fiercely but scatter our days like fallen leaves, letting others steal them easily.",
    presentation: PRESENTATIONS.seneca
  },
  {
    id: "seneca_2",
    category: "philosophy",
    topic: "The Shortness of Life",
    philosopher: "Seneca",
    visual_mood: "amber_glow",
    explore_title: "Living vs. Existing",
    explore_subtext: "Do not measure a life by gray hairs; many people have merely existed for a long time, not lived.",
    vault_question: "How does Seneca distinguish living from existing?",
    vault_answer: "Existing is passive passage of time, whereas living is mindful, conscious, and attentive engagement with the present.",
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
    vault_question: "Where do we experience the greatest suffering according to Seneca?",
    vault_answer: "In our own minds and imaginations rather than the actual realities of our circumstances.",
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
    vault_question: "How does study expand our lifetime according to Seneca?",
    vault_answer: "By entering into dialogue with historic philosophers, we inherit centuries of wisdom, effectively elongating our life.",
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
    vault_question: "What is Epictetus's Dichotomy of Control?",
    vault_answer: "The distinction between things that are entirely up to us (judgment, action) and things that are not (reputation, outcome).",
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
    vault_question: "What is Amor Fati in Stoicism?",
    vault_answer: "The active embrace of destiny and choosing to view every tragedy or obstacle as perfect fuel for personal growth.",
    presentation: PRESENTATIONS.marcus
  },
  {
    id: "marcus_3",
    category: "philosophy",
    topic: "Dichotomy of Control",
    philosopher: "Marcus Aurelius",
    visual_mood: "crimson_twilight",
    explore_title: "Waking to Duty",
    explore_subtext: "When you struggle to wake, remind yourself: 'I am rising to do the work of a human being.'",
    vault_question: "How does Marcus Aurelius view morning resistance?",
    vault_answer: "As an opportunity to perform your natural duty and social responsibility as a human being.",
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
    vault_question: "What is the relationship between thoughts and the soul in Stoicism?",
    vault_answer: "The soul is stained and shaped by the nature and quality of the thoughts we repeatedly entertain.",
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
    vault_question: "What is Socrates's Maieutics?",
    vault_answer: "A method of dialogue that helps interlocutors bring out their own innate philosophical understandings rather than lecturing them.",
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
    vault_question: "What is the purpose of Elenchus?",
    vault_answer: "Using structured questions to expose contradictions, forcing others to shed false certainty and pursue genuine truth.",
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
    vault_question: "Why did Socrates declare the unexamined life not worth living?",
    vault_answer: "Because without self-knowledge and moral inquiry, we act on impulse and remain blind to our true purpose.",
    presentation: PRESENTATIONS.socrates
  },
  {
    id: "socrates_4",
    category: "philosophy",
    topic: "The Socratic Method",
    philosopher: "Socrates",
    visual_mood: "emerald_mist",
    explore_title: "Socratic Irony",
    explore_subtext: "By feigning ignorance, Socrates invites interlocutors to expose the fragility of assumptions.",
    vault_question: "What is the tactical purpose of Socratic Irony?",
    vault_answer: "To dismantle dogmatic confidence, clearing the intellectual way for genuine inquiry and collaborative exploration.",
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
    vault_question: "What was the purpose of color in Van Gogh's paintings?",
    vault_answer: "To serve as a direct portal for expressing intense psychological states and the inner struggle of the human spirit.",
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
    vault_question: "What did Van Gogh's starry skies try to capture?",
    vault_answer: "The spiritual, ecstatic energy of the cosmos rather than a simple astronomical depiction.",
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
    vault_question: "How did creation serve Van Gogh psychologically?",
    vault_answer: "It was a vital therapeutic release, translating his mental torment into physical beauty.",
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
    vault_question: "What do Van Gogh's late wheatfields express?",
    vault_answer: "Visual manifestations of deep solitude combined with an intense, untamed cosmic energy.",
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
    vault_question: "What does sfumato mean in Leonardo's paintings?",
    vault_answer: "A technique of smoky blending of shades, softening edges to represent light and atmosphere as they are seen in nature.",
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
    vault_question: "What is Leonardo's philosophy on art and science?",
    vault_answer: "They are inseparable. Painting is the ultimate synthesis of empirical observation and scientific understanding.",
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
    vault_question: "How does Leonardo create the illusion of movement in the Mona Lisa?",
    vault_answer: "Through masterly use of sfumato around her eyes and mouth, exploiting human peripheral optics.",
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
    vault_question: "What is 'Curiosita' in Leonardo's life work?",
    vault_answer: "An insatiable, childlike curiosity that drove him to dissect, document, and connect all natural phenomena.",
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
    vault_question: "What does the term 'Kafkaesque' represent?",
    vault_answer: "The feeling of being trapped in a bizarre, labyrinthine system of invisible regulations and arbitrary judgments.",
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
    vault_question: "What does Gregor's insect state symbolize in Kafka's work?",
    vault_answer: "Absolute existential displacement, and being viewed as a burden within a hyper-capitalist family dynamic.",
    presentation: PRESENTATIONS.kafka
  },
  {
    id: "kafka_3",
    category: "literature",
    topic: "The Kafkaesque Absurd",
    philosopher: "Franz Kafka",
    visual_mood: "cosmic_void",
    explore_title: "The Door to the Law",
    explore_subtext: "A doorkeeper guards the Law. A man waits his entire life to enter, only to learn the door was meant only for him.",
    vault_question: "What is the lesson of Kafka's parable 'Before the Law'?",
    vault_answer: "The tragic mistake of waiting for authority's permission to live or access ultimate truth.",
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
    vault_question: "What is the core conflict in 'The Trial'?",
    vault_answer: "A citizen trying to defend himself against a secretive, supreme authority that accuses everyone of guilt by existence.",
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
    vault_question: "How is redemption achieved in Crime and Punishment?",
    vault_answer: "Through active, selfless love, accepting moral responsibility, and embracing spiritual realization over intellectual formulas.",
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
    vault_question: "What does the Underground Man reject?",
    vault_answer: "The rationalist belief that humans will always choose self-interest and scientific reason over raw freedom.",
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
    vault_question: "What is the Inquisitor's argument against Christ?",
    vault_answer: "That giving humans absolute free will is a curse, and the Church must manage lives through mystery and bread.",
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
    vault_question: "How does Father Zosima describe active love?",
    vault_answer: "As a disciplined, practical struggle of devotion, in contrast to abstract or purely emotional love.",
    presentation: PRESENTATIONS.dostoevsky
  },

  // --- GOTHIC ARCHITECTURE (4 CARDS) ---
  {
    id: "gothic_1",
    category: "architecture",
    topic: "Elevation of Light",
    philosopher: "Gothic Guilds",
    visual_mood: "emerald_mist",
    explore_title: "Lux Nova (New Light)",
    explore_subtext: "Abbot Suger believed sunlight passing through colored glass was a sensory medium that elevated the soul.",
    vault_question: "What does Lux Nova represent in Gothic architecture?",
    vault_answer: "The theological concept that physical light is an active, divine force that draws the human gaze and spirit upward.",
    presentation: PRESENTATIONS.gothic
  },
  {
    id: "gothic_2",
    category: "architecture",
    topic: "Elevation of Light",
    philosopher: "Gothic Guilds",
    visual_mood: "emerald_mist",
    explore_title: "The Flying Buttress",
    explore_subtext: "By transferring heavy structural loads outward, architects opened up stone walls for towering glowing glass.",
    vault_question: "What structural problem did the flying buttress solve?",
    vault_answer: "It redirected the massive outward thrust of high stone vaults, allowing walls to be thin and filled with stained glass.",
    presentation: PRESENTATIONS.gothic
  },
  {
    id: "gothic_3",
    category: "architecture",
    topic: "Elevation of Light",
    philosopher: "Gothic Guilds",
    visual_mood: "emerald_mist",
    explore_title: "The Pointed Ascent",
    explore_subtext: "The pointed arch channels weight more directly downward, enabling cathedrals to reach soaring, sacred heights.",
    vault_question: "What are the engineering advantages of the pointed arch?",
    vault_answer: "It reduces lateral thrust and allows vault bays of different widths and heights to be spanned harmoniously.",
    presentation: PRESENTATIONS.gothic
  },
  {
    id: "gothic_4",
    category: "architecture",
    topic: "Elevation of Light",
    philosopher: "Gothic Guilds",
    visual_mood: "emerald_mist",
    explore_title: "Stone and Cosmos",
    explore_subtext: "Cathedrals were built as physical miniature replicas of the perfectly ordered, celestial universe.",
    vault_question: "What did cathedral geometry aim to model?",
    vault_answer: "The divine mathematical harmony of God's cosmos, materialized in earthbound stone.",
    presentation: PRESENTATIONS.gothic
  },

  // --- FRANK LLOYD WRIGHT (4 CARDS) ---
  {
    id: "wright_1",
    category: "architecture",
    topic: "Organic Design",
    philosopher: "Frank Lloyd Wright",
    visual_mood: "blinding_sunlight",
    explore_title: "Organic Architecture",
    explore_subtext: "A building should grow naturally from its environment, living in perfect, sustainable harmony with nature.",
    vault_question: "What is Frank Lloyd Wright's Organic Architecture?",
    vault_answer: "The belief that structures should grow organically from their environments and integrate natural local landscape elements.",
    presentation: PRESENTATIONS.wright
  },
  {
    id: "wright_2",
    category: "architecture",
    topic: "Organic Design",
    philosopher: "Frank Lloyd Wright",
    visual_mood: "blinding_sunlight",
    explore_title: "Inside and Outside",
    explore_subtext: "Wright used continuous floor planes and seamless corner windows to dissolve the boundary between rooms and the forest.",
    vault_question: "How did Wright break the traditional 'box' of interior rooms?",
    vault_answer: "By creating massive cantilever structures, low roofs, open layout plans, and glass curtain corners.",
    presentation: PRESENTATIONS.wright
  },
  {
    id: "wright_3",
    category: "architecture",
    topic: "Organic Design",
    philosopher: "Frank Lloyd Wright",
    visual_mood: "blinding_sunlight",
    explore_title: "Integrity of Stone",
    explore_subtext: "Structures must honor local natural materials, utilizing raw river stone and timber native to the landscape.",
    vault_question: "What does Wright's material integrity dictate?",
    vault_answer: "That a building should manifest local raw elements, making it visually inseparable from the geologic terrain.",
    presentation: PRESENTATIONS.wright
  },
  {
    id: "wright_4",
    category: "architecture",
    topic: "Organic Design",
    philosopher: "Frank Lloyd Wright",
    visual_mood: "blinding_sunlight",
    explore_title: "The Prairie Influence",
    explore_subtext: "Low, horizontal rooflines that embrace the flat plains, symbolizing peace and shelter.",
    vault_question: "What visual elements characterize Prairie Houses?",
    vault_answer: "Prominent flat horizontal bands, low-pitched roofs, overhanging eaves, and central hearth stacks.",
    presentation: PRESENTATIONS.wright
  }
];
