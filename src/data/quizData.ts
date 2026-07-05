import type { FeedCard } from "@/src/features/feed/types";

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "persona",
    question: "Which best describes you?",
    options: [
      { label: "Deep thinker", value: "deep_thinker" },
      { label: "Curious explorer", value: "explorer" },
      { label: "Student", value: "student" },
      { label: "Professional", value: "professional" }
    ]
  },
  {
    id: "intent",
    question: "What brought you here?",
    options: [
      { label: "I want to think more clearly", value: "clarity" },
      { label: "I'm going through a hard time", value: "hard_time" },
      { label: "I love philosophy", value: "love_philosophy" },
      { label: "I need perspective", value: "perspective" }
    ]
  },
  {
    id: "thinker",
    question: "Which thinker resonates most?",
    options: [
      { label: "Marcus Aurelius", value: "Marcus Aurelius" },
      { label: "Friedrich Nietzsche", value: "Friedrich Nietzsche" },
      { label: "Simone de Beauvoir", value: "Simone de Beauvoir" },
      { label: "Epictetus", value: "Epictetus" },
      { label: "Aristotle", value: "Aristotle" },
      { label: "Seneca", value: "Seneca" },
      { label: "Jean-Paul Sartre", value: "Jean-Paul Sartre" },
      { label: "Albert Camus", value: "Albert Camus" },
      { label: "None yet", value: "Socrates" } // Default to Socrates
    ]
  },
  {
    id: "frequency",
    question: "How often do you reflect?",
    options: [
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
      { label: "When I'm stuck", value: "stuck" },
      { label: "Never — I want to start", value: "never" }
    ]
  },
  {
    id: "craving",
    question: "What does your mind crave?",
    options: [
      { label: "Silence & clarity", value: "silence" },
      { label: "Deep conversations", value: "conversations" },
      { label: "Big ideas", value: "ideas" },
      { label: "Practical wisdom", value: "wisdom" }
    ]
  },
  {
    id: "uncertainty",
    question: "How do you handle uncertainty?",
    options: [
      { label: "I plan for the worst", value: "plan" },
      { label: "I try to embrace it", value: "embrace" },
      { label: "I seek guidance", value: "guidance" },
      { label: "I get overwhelmed", value: "overwhelmed" }
    ]
  },
  {
    id: "failure",
    question: "What is your approach to failure?",
    options: [
      { label: "It's a learning opportunity", value: "learning" },
      { label: "It's an unavoidable part of life", value: "unavoidable" },
      { label: "I struggle to move past it", value: "struggle" },
      { label: "I fear it deeply", value: "fear" }
    ]
  },
  {
    id: "knowledge",
    question: "What kind of knowledge do you seek?",
    options: [
      { label: "Self-knowledge", value: "self" },
      { label: "Understanding the universe", value: "universe" },
      { label: "How to live a good life", value: "good_life" },
      { label: "How to change the world", value: "change_world" }
    ]
  }
];

export const STARTER_QUOTES: Record<string, FeedCard[]> = {
  "Marcus Aurelius": [
    {
      id: "starter_marcus_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Stoicism",
      philosopher: "Marcus Aurelius",
      visual_mood: "minimalist",
      explore_title: "The inner citadel",
      explore_subtext: "You have power over your mind",
      layoutVariant: "blockquote",
      presentation: {
        title: "The Inner Citadel",
        reading_parts: [{ part_number: 1, text: "You have power over your mind - not outside events. Realize this, and you will find strength." }]
      }
    },
    {
      id: "starter_marcus_2",
      stack_id: "starter",
      category: "philosophy",
      topic: "Stoicism",
      philosopher: "Marcus Aurelius",
      visual_mood: "dark",
      explore_title: "The obstacle is the way",
      explore_subtext: "Action and impediment",
      layoutVariant: "thesis",
      presentation: {
        title: "The Obstacle",
        reading_parts: [{ part_number: 1, text: "The impediment to action advances action. What stands in the way becomes the way." }]
      }
    }
  ],
  "Friedrich Nietzsche": [
    {
      id: "starter_nietzsche_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Existentialism",
      philosopher: "Friedrich Nietzsche",
      visual_mood: "expressive",
      explore_title: "He who has a why",
      explore_subtext: "Bearing the how",
      layoutVariant: "blockquote",
      presentation: {
        title: "Purpose",
        reading_parts: [{ part_number: 1, text: "He who has a why to live for can bear almost any how." }]
      }
    },
    {
      id: "starter_nietzsche_2",
      stack_id: "starter",
      category: "philosophy",
      topic: "Existentialism",
      philosopher: "Friedrich Nietzsche",
      visual_mood: "dark",
      explore_title: "Becoming who you are",
      explore_subtext: "The journey of self",
      layoutVariant: "thesis",
      presentation: {
        title: "Self-Actualization",
        reading_parts: [{ part_number: 1, text: "Become who you are." }]
      }
    }
  ],
  "Simone de Beauvoir": [
    {
      id: "starter_beauvoir_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Feminism",
      philosopher: "Simone de Beauvoir",
      visual_mood: "minimalist",
      explore_title: "Becoming a woman",
      explore_subtext: "Constructing identity",
      layoutVariant: "blockquote",
      presentation: {
        title: "Constructed Identity",
        reading_parts: [{ part_number: 1, text: "One is not born, but rather becomes, a woman." }]
      }
    },
    {
      id: "starter_beauvoir_2",
      stack_id: "starter",
      category: "philosophy",
      topic: "Existentialism",
      philosopher: "Simone de Beauvoir",
      visual_mood: "expressive",
      explore_title: "Change your life today",
      explore_subtext: "Don't gamble on the future",
      layoutVariant: "thesis",
      presentation: {
        title: "Action",
        reading_parts: [{ part_number: 1, text: "Change your life today. Don't gamble on the future, act now, without delay." }]
      }
    }
  ],
  "Epictetus": [
    {
      id: "starter_epictetus_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Stoicism",
      philosopher: "Epictetus",
      visual_mood: "minimalist",
      explore_title: "Power of perception",
      explore_subtext: "How you react matters",
      layoutVariant: "blockquote",
      presentation: {
        title: "Perception",
        reading_parts: [{ part_number: 1, text: "It's not what happens to you, but how you react to it that matters." }]
      }
    },
    {
      id: "starter_epictetus_2",
      stack_id: "starter",
      category: "philosophy",
      topic: "Stoicism",
      philosopher: "Epictetus",
      visual_mood: "classic",
      explore_title: "Self-creation",
      explore_subtext: "Decide who you are",
      layoutVariant: "thesis",
      presentation: {
        title: "Becoming",
        reading_parts: [{ part_number: 1, text: "First say to yourself what you would be; and then do what you have to do." }]
      }
    }
  ],
  "Socrates": [
    {
      id: "starter_socrates_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Epistemology",
      philosopher: "Socrates",
      visual_mood: "minimalist",
      explore_title: "True wisdom",
      explore_subtext: "Knowing what you don't know",
      layoutVariant: "blockquote",
      presentation: {
        title: "Socratic Ignorance",
        reading_parts: [{ part_number: 1, text: "The only true wisdom is in knowing you know nothing." }]
      }
    },
    {
      id: "starter_socrates_2",
      stack_id: "starter",
      category: "philosophy",
      topic: "Ethics",
      philosopher: "Socrates",
      visual_mood: "classic",
      explore_title: "The examined life",
      explore_subtext: "Reflecting on existence",
      layoutVariant: "thesis",
      presentation: {
        title: "Reflection",
        reading_parts: [{ part_number: 1, text: "The unexamined life is not worth living." }]
      }
    }
  ],
  "Aristotle": [
    {
      id: "starter_aristotle_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Ethics",
      philosopher: "Aristotle",
      visual_mood: "classic",
      explore_title: "Excellence as habit",
      explore_subtext: "We are what we repeatedly do",
      layoutVariant: "blockquote",
      presentation: {
        title: "Habitual Excellence",
        reading_parts: [{ part_number: 1, text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit." }]
      }
    }
  ],
  "Seneca": [
    {
      id: "starter_seneca_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Stoicism",
      philosopher: "Seneca",
      visual_mood: "minimalist",
      explore_title: "Suffering in imagination",
      explore_subtext: "The illusions of fear",
      layoutVariant: "thesis",
      presentation: {
        title: "Imagined Troubles",
        reading_parts: [{ part_number: 1, text: "We suffer more often in imagination than in reality." }]
      }
    }
  ],
  "Jean-Paul Sartre": [
    {
      id: "starter_sartre_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Existentialism",
      philosopher: "Jean-Paul Sartre",
      visual_mood: "expressive",
      explore_title: "Condemned to be free",
      explore_subtext: "The burden of choice",
      layoutVariant: "blockquote",
      presentation: {
        title: "Radical Freedom",
        reading_parts: [{ part_number: 1, text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does." }]
      }
    }
  ],
  "Albert Camus": [
    {
      id: "starter_camus_1",
      stack_id: "starter",
      category: "philosophy",
      topic: "Absurdism",
      philosopher: "Albert Camus",
      visual_mood: "organic",
      explore_title: "An invincible summer",
      explore_subtext: "Finding warmth",
      layoutVariant: "thesis",
      presentation: {
        title: "Inner Strength",
        reading_parts: [{ part_number: 1, text: "In the depth of winter, I finally learned that within me there lay an invincible summer." }]
      }
    },
    {
      id: "starter_camus_2",
      stack_id: "starter",
      category: "philosophy",
      topic: "Absurdism",
      philosopher: "Albert Camus",
      visual_mood: "dramatic",
      explore_title: "Act of rebellion",
      explore_subtext: "Existing freely",
      layoutVariant: "blockquote",
      presentation: {
        title: "Rebellion",
        reading_parts: [{ part_number: 1, text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion." }]
      }
    }
  ]
};
