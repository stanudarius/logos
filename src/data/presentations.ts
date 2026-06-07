import type { Presentation } from "../types";

export const PRESENTATIONS: Record<string, Presentation> = {
  camus: {
    title: "The Myth of Sisyphus",
    reading_parts: [
      { part_number: 1, text: "Albert Camus introduces the concept of the Absurd as an invitation to human lucidity in the face of modern existential disorientation. The universe itself is not absurd, nor is human consciousness in isolation. The Absurd is born exclusively in the precise moment when our burning desire for clarity and transcendent purpose collides with the cold, silent, and irrational order of the cosmos." },
      { part_number: 2, text: "In his landmark essay, the philosopher rehabilitates the most tragic figure of Greek mythology. Sisyphus is condemned by the gods to push an enormous boulder up a mountain, only to watch it crash back into the valley below in an infinite, fruitless loop. But Camus highlights the moment of return: when Sisyphus walks back down the slope with a firm step, fully aware of the futility of his task. In that precise moment, he owns his destiny." },
      { part_number: 3, text: "Camus's ultimate conclusion becomes a doctrine of existential defiance. Rather than succumbing to 'philosophical suicide' (escaping into groundless metaphysical dogmas) or physical suicide, the mature individual must accept the meaninglessness of life as a source of sovereign liberation. Conscious rebellion against this condition gives us full authority over our actions. Sisyphus is happy because the struggle itself is entirely his own." }
    ]
  },
  seneca: {
    title: "On the Shortness of Life",
    reading_parts: [
      { part_number: 1, text: "Lucius Annaeus Seneca, the great Stoic philosopher, wrote On the Shortness of Life as an urgent warning that life is not short, but rather we waste most of it in useless activities, mindless luxuries, and anxious future planning." },
      { part_number: 2, text: "Stoic wisdom teaches that to live fully is to master the present moment, to appreciate human mortality, and to enter constant dialogue with the great minds of history. Seneca outlines that we should not measure a life by the number of gray hairs or wrinkles, but by the depth of conscious, attentive living. Putting off things is the biggest waste of life." }
    ]
  },
  marcus: {
    title: "Meditations",
    reading_parts: [
      { part_number: 1, text: "Marcus Aurelius wrote private notes reinforcing that by binding our happiness solely to our internal choices and remaining indifferent to external winds, we achieve absolute intellectual invulnerability." },
      { part_number: 2, text: "Amor Fati (love of fate) means embracing every random obstacle, tragedy, or change as perfect fuel for moral growth. 'The obstacle in the path becomes the path.'" }
    ]
  },
  socrates: {
    title: "The Socratic Dialogues",
    reading_parts: [
      { part_number: 1, text: "Socrates pursued truth through structured intellectual dialogue rather than dogmatic monologues. He called his approach 'Maieutics' (maternity midwifery), meaning his role was not to inject strange knowledge, but to help pregnant minds give birth to their own latent truths." },
      { part_number: 2, text: "His central technique is the Socratic Method (Elenchus), a form of cooperative argumentative dialogue that stimulates critical thinking and exposes the limits of a person's underlying beliefs and unexamined assumptions." }
    ]
  },
  vangogh: {
    title: "The Vision of Color",
    reading_parts: [
      { part_number: 1, text: "Vincent van Gogh redefined the limits of color and brush stroke in modern art. In masterpieces like 'The Starry Night' and 'Wheatfield with Crows', color is not a tool for realistic representation, but a direct channel for intense psychological projection." },
      { part_number: 2, text: "Vincent used thick, expressive paint and swirling brushstrokes to capture raw human feelings and spiritual longing. His works emphasize that art should bypass mere documentation to express the radiant, dynamic life of the soul." }
    ]
  },
  da_vinci: {
    title: "Sfumato & Optics",
    reading_parts: [
      { part_number: 1, text: "Leonardo da Vinci pioneered 'sfumato'—the subtle, smoky blending of tone and color that allows edges to melt into mysterious transitions. Rather than outlining figures with harsh lines, Leonardo observed that light and atmosphere blur boundaries in real life." },
      { part_number: 2, text: "Applying this atmospheric perspective of sfumato created an elusive, living quality, drawing the viewer's eye into a deeper three-dimensional space wherein scientific observation and poetic sensitivity find a singular, unified balance." }
    ]
  },
  kafka: {
    title: "Kafka's Bureaucracy",
    reading_parts: [
      { part_number: 1, text: "Franz Kafka's literature explores the terrifying sense of alienation, guilt, and faceless bureaucracy. In works like 'The Metamorphosis' and 'The Trial', characters are trapped in incomprehensible, labyrinthine systems with no escape." },
      { part_number: 2, text: "Kafka's clinical prose depicts the modern struggle as an absurd labyrinth, where individuals constantly seek meaning and relationship beneath the weight of an indifferent, supreme, and completely unaligned social power." }
    ]
  },
  dostoevsky: {
    title: "Guilt & Redemption",
    reading_parts: [
      { part_number: 1, text: "Fyodor Dostoevsky dives into the dark, chaotic depths of the human psyche in Crime and Punishment. He explores the crisis of morality, absolute freedom, and subsequent guilt." },
      { part_number: 2, text: "Dostoevsky asserts that genuine redemption is never achieved through abstract intellectual frameworks, but through active, selfless love, the courageous acceptance of personal suffering, and a profound spiritual rebirth." }
    ]
  },
  gothic: {
    title: "Gothic Cathedral Geometry",
    reading_parts: [
      { part_number: 1, text: "Gothic Architecture of the 12th century replaced heavy, dark Romanesque fortresses with soaring, skeleton-like structures of stone and stained glass. Through engineering breakthroughs like the flying buttress, builders allowed walls to open into monumental glass." },
      { part_number: 2, text: "These soaring stone monuments represented physical models of celestial geometry, where daylight filtered through stained-glass windows became 'lux nova'—a vibrant medium driving the spectator's spirit upward." }
    ]
  },
  wright: {
    title: "Organic Shelters",
    reading_parts: [
      { part_number: 1, text: "Frank Lloyd Wright revolutionized modern structures through 'Organic Architecture', the belief that a building should grow naturally from its environment rather than dominate it. His masterpiece is Fallingwater." },
      { part_number: 2, text: "Wright synthesized structural form with local masonry, raw river stones, timber, and flowing water. He eliminated the traditional 'box' structure to optimize open-plan layouts that flow sustainably inside out." }
    ]
  }
};
