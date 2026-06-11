import type { GraphEdge, Node } from "../types";

export const NODES: Node[] = [
  // Philosophy - Ancient
  { id: "socrates", label: "Socrates", x: 50, y: 20, group: "ancient" },
  { id: "plato", label: "Plato", x: 35, y: 35, group: "ancient" },
  { id: "aristotle", label: "Aristotle", x: 65, y: 30, group: "ancient" },

  // Philosophy - Stoic
  { id: "zeno", label: "Zeno of Citium", x: 20, y: 50, group: "stoic" },
  { id: "epictetus", label: "Epictetus", x: 15, y: 70, group: "stoic" },
  { id: "seneca", label: "Seneca", x: 30, y: 65, group: "stoic" },
  { id: "marcus", label: "Marcus Aurelius", x: 25, y: 85, group: "stoic" },

  // Philosophy - Existential
  { id: "kierkegaard", label: "Kierkegaard", x: 80, y: 50, group: "existential" },
  { id: "nietzsche", label: "Nietzsche", x: 75, y: 65, group: "existential" },
  { id: "sartre", label: "Sartre", x: 65, y: 80, group: "existential" },
  { id: "camus", label: "Albert Camus", x: 85, y: 85, group: "existential" },
  { id: "beauvoir", label: "Simone de Beauvoir", x: 70, y: 95, group: "existential" },

  // Philosophy - Enlightenment (newly added to support more trails)
  { id: "descartes", label: "Descartes", x: 45, y: 50, group: "existential" },
  { id: "kant", label: "Kant", x: 55, y: 60, group: "existential" },

  // Philosophy - Cynic & Postmodern (new)
  { id: "diogenes", label: "Diogenes of Sinope", x: 5, y: 30, group: "ancient" },
  { id: "baudrillard", label: "Jean Baudrillard", x: 95, y: 70, group: "existential" },

  // Literature
  { id: "homer", label: "Homer", x: 15, y: 10, group: "literature" },
  { id: "dante", label: "Dante", x: 30, y: 15, group: "literature" },
  { id: "shakespeare", label: "Shakespeare", x: 20, y: 25, group: "literature" },
  { id: "austen", label: "Jane Austen", x: 45, y: 15, group: "literature" },
  { id: "dostoevsky", label: "Dostoevsky", x: 60, y: 10, group: "literature" },
  { id: "kafka", label: "Kafka", x: 80, y: 25, group: "literature" },
  { id: "woolf", label: "Virginia Woolf", x: 75, y: 15, group: "literature" },
  { id: "orwell", label: "George Orwell", x: 90, y: 10, group: "literature" },

  // Literature - New Additions
  { id: "proust", label: "Marcel Proust", x: 50, y: 5, group: "literature" },
  { id: "marquez", label: "Gabriel García Márquez", x: 10, y: 20, group: "literature" },
  { id: "borges", label: "Jorge Luis Borges", x: 85, y: 5, group: "literature" },

  // Arts
  { id: "davinci", label: "Da Vinci", x: 10, y: 35, group: "arts" },
  { id: "michelangelo", label: "Michelangelo", x: 25, y: 35, group: "arts" },
  { id: "rembrandt", label: "Rembrandt", x: 40, y: 25, group: "arts" },
  { id: "monet", label: "Monet", x: 85, y: 35, group: "arts" },
  { id: "vangogh", label: "Van Gogh", x: 95, y: 45, group: "arts" },
  { id: "picasso", label: "Picasso", x: 75, y: 40, group: "arts" },
  { id: "kahlo", label: "Frida Kahlo", x: 65, y: 45, group: "arts" },

  // Arts - Modern & Abstract Additions
  { id: "dali", label: "Salvador Dalí", x: 80, y: 30, group: "arts" },
  { id: "rothko", label: "Mark Rothko", x: 95, y: 20, group: "arts" },
  { id: "warhol", label: "Andy Warhol", x: 85, y: 55, group: "arts" },
  { id: "abramovic", label: "Marina Abramović", x: 50, y: 45, group: "arts" },


  { id: "gaudi", label: "Gaudi", x: 90, y: 70, group: "arts" },
  { id: "wright", label: "Frank Lloyd Wright", x: 10, y: 80, group: "arts" },
  { id: "corbusier", label: "Le Corbusier", x: 15, y: 95, group: "arts" },
];

export const EDGES: GraphEdge[] = [
  // Philosophy edges
  { from: "socrates", to: "plato", relationship: "Influenced" },
  { from: "plato", to: "aristotle", relationship: "Influenced" },
  { from: "socrates", to: "zeno", relationship: "Influenced", dashed: true },
  { from: "zeno", to: "epictetus", relationship: "Influenced" },
  { from: "zeno", to: "seneca", relationship: "Influenced" },
  { from: "epictetus", to: "marcus", relationship: "Influenced" },
  { from: "seneca", to: "marcus", relationship: "Contemporaries" },
  { from: "socrates", to: "kierkegaard", relationship: "Influenced", dashed: true },
  { from: "kierkegaard", to: "nietzsche", relationship: "Critiqued" },
  { from: "nietzsche", to: "sartre", relationship: "Influenced" },
  { from: "nietzsche", to: "camus", relationship: "Influenced" },
  { from: "sartre", to: "camus", relationship: "Contradicts" },
  { from: "sartre", to: "beauvoir", relationship: "Contemporaries" },
  { from: "descartes", to: "kant", relationship: "Influenced" },
  { from: "kant", to: "kierkegaard", relationship: "Critiqued", dashed: true },

  // Arts edges
  { from: "davinci", to: "michelangelo", relationship: "Contemporaries" },
  { from: "socrates", to: "davinci", relationship: "Inspired", dashed: true },
  { from: "rembrandt", to: "vangogh", relationship: "Inspired", dashed: true },
  { from: "monet", to: "vangogh", relationship: "Influenced" },
  { from: "vangogh", to: "picasso", relationship: "Influenced", dashed: true },
  { from: "picasso", to: "kahlo", relationship: "Contemporaries", dashed: true },
  { from: "vangogh", to: "camus", relationship: "Inspired", dashed: true },

  // Literature edges
  { from: "homer", to: "dante", relationship: "Influenced", dashed: true },
  { from: "dante", to: "shakespeare", relationship: "Influenced", dashed: true },
  { from: "shakespeare", to: "dostoevsky", relationship: "Inspired", dashed: true },
  { from: "dostoevsky", to: "kafka", relationship: "Inspired" },
  { from: "dostoevsky", to: "nietzsche", relationship: "Inspired", dashed: true },
  { from: "kierkegaard", to: "kafka", relationship: "Inspired", dashed: true },
  { from: "austen", to: "woolf", relationship: "Influenced", dashed: true },
  { from: "kafka", to: "orwell", relationship: "Influenced", dashed: true },
  { from: "woolf", to: "sartre", relationship: "Contemporaries", dashed: true },


  { from: "gaudi", to: "vangogh", relationship: "Contemporaries", dashed: true },
  { from: "wright", to: "corbusier", relationship: "Critiqued" },

  // New Connections
  { from: "socrates", to: "diogenes", relationship: "Influenced", dashed: true },
  { from: "nietzsche", to: "baudrillard", relationship: "Influenced", dashed: true },
  { from: "picasso", to: "dali", relationship: "Contemporaries" },
  { from: "vangogh", to: "rothko", relationship: "Inspired", dashed: true },
  { from: "dali", to: "warhol", relationship: "Inspired", dashed: true },
  { from: "kahlo", to: "abramovic", relationship: "Inspired", dashed: true },
  { from: "dostoevsky", to: "proust", relationship: "Influenced", dashed: true },
  { from: "kafka", to: "marquez", relationship: "Inspired", dashed: true },
  { from: "kafka", to: "borges", relationship: "Inspired", dashed: true },
];
