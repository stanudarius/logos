export interface PhilosopherBio {
  years?: string;
  position?: string;
  keyWorks?: string[];
}

export const PHILOSOPHER_BIOS: Record<string, PhilosopherBio> = {
  Socrates: {
    years: "470–399 BC",
    position:
      "Foundational ancient Greek philosopher who shifted focus to ethics.",
    keyWorks: ["(No written works)"],
  },
  Plato: {
    years: "c. 428–348 BC",
    position:
      "Rationalist founder of the Academy, established the theory of Forms.",
    keyWorks: ["The Republic", "Symposium", "Apology"],
  },
  Aristotle: {
    years: "384–322 BC",
    position:
      "Empiricist who formalized logic and categorized human knowledge.",
    keyWorks: ["Nicomachean Ethics", "Politics", "Metaphysics"],
  },
  "Diogenes of Sinope": {
    years: "c. 412–323 BC",
    position:
      "Founder of Cynicism, famously lived in a barrel and rejected societal norms.",
    keyWorks: ["(No written works)"],
  },

  "Zeno of Citium": {
    years: "c. 334–262 BC",
    position:
      "Founder of Stoicism, taught that peace of mind comes from living in accordance with nature.",
    keyWorks: ["Republic (fragments)"],
  },
  Epictetus: {
    years: "c. 50–135 AD",
    position:
      "Stoic philosopher and former slave who emphasized self-discipline.",
    keyWorks: ["Enchiridion", "Discourses"],
  },
  Seneca: {
    years: "c. 4 BC–65 AD",
    position: "Roman Stoic philosopher, statesman, and dramatist.",
    keyWorks: ["Letters from a Stoic", "On the Shortness of Life"],
  },
  "Marcus Aurelius": {
    years: "121–180 AD",
    position: "Roman Emperor and Stoic philosopher.",
    keyWorks: ["Meditations"],
  },

  Kierkegaard: {
    years: "1813–1855",
    position:
      "Father of existentialism, focused on individual choice and religious faith.",
    keyWorks: ["Either/Or", "Fear and Trembling"],
  },
  Nietzsche: {
    years: "1844–1900",
    position:
      "Cultural critic who challenged conventional morality and championed the Übermensch.",
    keyWorks: ["Thus Spoke Zarathustra", "Beyond Good and Evil"],
  },
  Sartre: {
    years: "1905–1980",
    position:
      "Key figure in existentialism, posited that 'existence precedes essence'.",
    keyWorks: ["Being and Nothingness", "No Exit"],
  },
  "Albert Camus": {
    years: "1913–1960",
    position:
      "Absurdist philosopher who explored the human search for meaning.",
    keyWorks: ["The Stranger", "The Myth of Sisyphus"],
  },
  "Simone de Beauvoir": {
    years: "1908–1986",
    position: "Existentialist and feminist philosopher.",
    keyWorks: ["The Second Sex", "The Mandarins"],
  },
  Descartes: {
    years: "1596–1650",
    position: "Rationalist who coined 'Cogito, ergo sum'.",
    keyWorks: ["Meditations on First Philosophy"],
  },
  Kant: {
    years: "1724–1804",
    position:
      "Synthesized rationalism and empiricism, formulated the categorical imperative.",
    keyWorks: [
      "Critique of Pure Reason",
      "Groundwork of the Metaphysics of Morals",
    ],
  },
  "Jean Baudrillard": {
    years: "1929–2007",
    position:
      "Sociologist and philosopher known for his theories of simulacra and hyperreality.",
    keyWorks: ["Simulacra and Simulation", "The System of Objects"],
  },

  Homer: {
    years: "c. 8th Century BC",
    position:
      "Legendary author of the foundational epic poems of ancient Greece.",
    keyWorks: ["The Iliad", "The Odyssey"],
  },
  Dante: {
    years: "c. 1265–1321",
    position: "Italian poet whose work defines the medieval worldview.",
    keyWorks: ["Divine Comedy", "La Vita Nuova"],
  },
  Shakespeare: {
    years: "1564–1616",
    position:
      "English playwright widely regarded as the greatest writer in the English language.",
    keyWorks: ["Hamlet", "Macbeth", "King Lear"],
  },
  "Jane Austen": {
    years: "1775–1817",
    position: "English novelist known for her social commentary and irony.",
    keyWorks: ["Pride and Prejudice", "Emma"],
  },
  Dostoevsky: {
    years: "1821–1881",
    position:
      "Russian novelist who explored human psychology in the context of political and social turmoil.",
    keyWorks: ["Crime and Punishment", "The Brothers Karamazov"],
  },
  Kafka: {
    years: "1883–1924",
    position:
      "Bohemian novelist whose works explore themes of alienation and existential anxiety.",
    keyWorks: ["The Metamorphosis", "The Trial"],
  },
  "Virginia Woolf": {
    years: "1882–1941",
    position:
      "English writer and pioneer of the modernist stream-of-consciousness narrative.",
    keyWorks: ["Mrs Dalloway", "To the Lighthouse"],
  },
  "George Orwell": {
    years: "1903–1950",
    position:
      "English novelist and critic, known for his lucid prose and opposition to totalitarianism.",
    keyWorks: ["1984", "Animal Farm"],
  },
  "Marcel Proust": {
    years: "1871–1922",
    position:
      "French novelist whose work focuses on involuntary memory and the passage of time.",
    keyWorks: ["In Search of Lost Time"],
  },
  "Gabriel García Márquez": {
    years: "1927–2014",
    position: "Colombian author who popularized magical realism.",
    keyWorks: ["One Hundred Years of Solitude", "Love in the Time of Cholera"],
  },
  "Jorge Luis Borges": {
    years: "1899–1986",
    position:
      "Argentine short-story writer known for his labyrinthine philosophical fiction.",
    keyWorks: ["Ficciones", "The Aleph"],
  },

  "Da Vinci": {
    years: "1452–1519",
    position:
      "Italian polymath of the High Renaissance who exemplified the humanist ideal.",
    keyWorks: ["Mona Lisa", "The Last Supper"],
  },
  Michelangelo: {
    years: "1475–1564",
    position:
      "Italian sculptor, painter, and architect of the High Renaissance.",
    keyWorks: ["David", "Sistine Chapel ceiling"],
  },
  Rembrandt: {
    years: "1606–1669",
    position:
      "Dutch Golden Age painter and printmaker known for his mastery of light and shadow.",
    keyWorks: ["The Night Watch", "The Anatomy Lesson"],
  },
  Monet: {
    years: "1840–1926",
    position: "French painter and founder of impressionist painting.",
    keyWorks: ["Impression, Sunrise", "Water Lilies"],
  },
  "Van Gogh": {
    years: "1853–1890",
    position: "Dutch Post-Impressionist painter with profound emotional depth.",
    keyWorks: ["The Starry Night", "Sunflowers"],
  },
  Picasso: {
    years: "1881–1973",
    position:
      "Spanish painter and sculptor who co-founded the Cubist movement.",
    keyWorks: ["Guernica", "Les Demoiselles d'Avignon"],
  },
  "Salvador Dalí": {
    years: "1904–1989",
    position:
      "Spanish Surrealist painter known for his technical skill and bizarre images.",
    keyWorks: ["The Persistence of Memory", "Swans Reflecting Elephants"],
  },
  "Mark Rothko": {
    years: "1903–1970",
    position: "American abstract painter, known for his color field paintings.",
    keyWorks: ["No. 61 (Rust and Blue)", "Four Darks in Red"],
  },
  "Andy Warhol": {
    years: "1928–1987",
    position: "American visual artist, leading figure in the pop art movement.",
    keyWorks: ["Campbell's Soup Cans", "Marilyn Diptych"],
  },
  "Marina Abramović": {
    years: "1946–present",
    position: "Serbian conceptual and performance artist.",
    keyWorks: ["Rhythm 0", "The Artist Is Present"],
  },
  "Frida Kahlo": {
    years: "1907–1954",
    position:
      "Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.",
    keyWorks: [
      "The Two Fridas",
      "Self-Portrait with Thorn Necklace and Hummingbird",
    ],
  },
  Gaudi: {
    years: "1852–1926",
    position:
      "Catalan architect known as the greatest exponent of Catalan Modernism.",
    keyWorks: ["Sagrada Família", "Park Güell"],
  },
  "Frank Lloyd Wright": {
    years: "1867–1959",
    position: "American architect, designer, writer, and educator.",
    keyWorks: ["Fallingwater", "Guggenheim Museum"],
  },
  "Le Corbusier": {
    years: "1887–1965",
    position:
      "Swiss-French architect, designer, urbanist, and pioneer of modern architecture.",
    keyWorks: ["Villa Savoye", "Unité d'habitation"],
  },
};
