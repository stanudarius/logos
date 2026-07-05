import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";

dotenv.config();

// Initialize express app
const app = express();
const PORT = 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for Vite dev server compatibility
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// Validation Schemas
const generateSchema = z.object({
  rawText: z.string().optional().nullable(),
  rabbitHoleContext: z.array(z.string()).optional()
});

const chatSchema = z.object({
  philosopher: z.string().min(1),
  topic: z.string().min(1),
  essayContext: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(["user", "model"]),
    text: z.string()
  }))
});

// Initialize Gemini SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Robust fallback generator with exponential backoff
async function generateWithFallback(params: any) {
  const models = ["gemini-3.5-flash", "gemini-2.5-flash"];
  let lastError;

  for (const modelName of models) {
    let retries = 3;
    let delay = 1500; // start with 1.5s delay
    
    while (retries > 0) {
      try {
        return await ai.models.generateContent({ ...params, model: modelName });
      } catch (e: any) {
        if (e.status === 429 || e.status === 503) {
          retries--;
          console.warn(`[${modelName}] rate limited (Status: ${e.status}). Retries left: ${retries}. Waiting ${delay}ms...`);
          lastError = e;
          if (retries > 0) {
            await sleep(delay);
            delay *= 2; // exponential backoff
          }
        } else if (e.status === 404 || e.status === 400) {
          console.warn(`[${modelName}] unsupported or not found (Status: ${e.status}). Skipping model...`);
          lastError = e;
          break; // break the retry loop and try the next model
        } else {
          throw e; // throw unhandled errors
        }
      }
    }
  }
  throw lastError || new Error("All Gemini models failed after retries.");
}

// JSON Schema
const microlearningSchema = {
  type: Type.OBJECT,
  properties: {
    stack_id: {
      type: Type.STRING,
      description: "A lowercase snake_case short identifier, e.g. 'phi_socrates_01'."
    },
    category: {
      type: Type.STRING,
      description: "The category/domain of this stack. Must be exactly one of: 'philosophy', 'arts', 'literature', 'architecture'."
    },
    topic: {
      type: Type.STRING,
      description: "The main philosophical, artistic, literary, or architectural theory/concept/movement (e.g., 'Doctrina Meieutică', 'Post-Impressionism')."
    },
    philosopher: {
      type: Type.STRING,
      description: "The central figure, thinker, artist, author, or architect associated (e.g., 'Socrates', 'Van Gogh', 'Frank Lloyd Wright')."
    },
    visual_mood: {
      type: Type.STRING,
      description: "Select the best fitting aesthetic mood. Must be one of: 'blinding_sunlight', 'cosmic_void', 'crimson_twilight', 'emerald_mist', 'amber_glow'."
    },
    cards: {
      type: Type.ARRAY,
      description: "Exactly 4 sequential slides breaking down this concept in bites.",
      items: {
        type: Type.OBJECT,
        properties: {
          explore_title: {
            type: Type.STRING,
            description: "A short poetic heading, max 5 words."
          },
          explore_subtext: {
            type: Type.STRING,
            description: "A beautiful, deep explanation (1-2 sentences, max 25 words)."
          }
        },
        required: ["explore_title", "explore_subtext"]
      }
    },
    presentation: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "The full formal essay title for deep reading (e.g. 'Apologia lui Socrate', 'Fallingwater Analysis')."
        },
        reading_parts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              part_number: {
                type: Type.INTEGER,
                description: "Sequential line/paragraph segment number, starting from 1."
              },
              text: {
                type: Type.STRING,
                description: "Structured paragraph of the essay (70-130 words long). Elegant and profound."
              }
            },
            required: ["part_number", "text"]
          }
        }
      },
      required: ["title", "reading_parts"]
    }
  },
  required: ["stack_id", "category", "topic", "philosopher", "visual_mood", "cards", "presentation"]
};

app.post("/api/generate", async (req, res) => {
  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload", details: parsed.error.issues });
    }
    
    let { rawText, rabbitHoleContext } = parsed.data;

    // If rawText is not provided or specifically set to "RANDOM" for infinite scroll feeds, generate a random subject.
    if (!rawText || rawText.trim().length === 0 || rawText === "RANDOM") {
      const randomSubjects = [
        "Friedrich Nietzsche", "Socrates", "Claude Monet", "Rembrandt", "Pablo Picasso",
        "Frida Kahlo", "Salvador Dali", "Jane Austen", "Virginia Woolf", "Homer",
        "Zaha Hadid", "Le Corbusier", "Antoni Gaudi", "Sigmund Freud", "Carl Jung",
        "Immanuel Kant", "Rene Descartes", "Oscar Wilde", "George Orwell", "Toni Morrison",
        "Mies van der Rohe", "Michelangelo", "Jean-Paul Sartre", "Simone de Beauvoir", "T.S. Eliot",
        "William Shakespeare", "F. Scott Fitzgerald", "Andy Warhol", "Jackson Pollock", "Plato"
      ];
      rawText = randomSubjects[Math.floor(Math.random() * randomSubjects.length)];
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured. Specify it in your Secrets."
      });
    }

    let prompt = `
    Transform the following raw textual concepts into an elite microlearning content stack JSON package.
    Ensure there are EXACTLY 4 sequential cards that tell a beautiful, captivating narrative arc about this subject (philosophy, arts, literature, or architecture).
    The insights must be exceptionally profound, avoiding clichés, and designed to induce awe and deep contemplation in the reader.
    The reading_parts must contain a coherent, masterfully written essay broken down into 2 to 4 parts, exploring the philosophical depths of the subject.
    
    Raw Concepts to Digest:
    ---
    ${rawText}
    ---
    `;

    if (rabbitHoleContext && Array.isArray(rabbitHoleContext) && rabbitHoleContext.length > 0) {
      prompt += `
      CRITICAL INSTRUCTION (RABBIT HOLE ALGORITHM):
      The user is currently exploring and highly engaged in these themes: ${rabbitHoleContext.join(", ")}.
      Instead of just outputting the raw concepts, blend the raw concepts with the user's current interests. 
      Generate 2 cards that dive deeper into their exact interests, and 2 cards that introduce adjacent, opposing, or highly provocative philosophical concepts (e.g. Absurdism vs Nihilism) to organically pull them down a rabbit hole of endless intellectual discovery. Make the transitions seamless and thought-provoking.
      `;
    }

    // Query Gemini 2.5 Flash for high performance and structured accuracy
    const response = await generateWithFallback({
      contents: prompt,
      config: {
        temperature: 0.5,
        systemInstruction: "You are an elite, poetic university professor and master microlearning designer. You output beautiful, world-class, profound explanations entirely in English covering Philosophy, Arts, Literature, or Architecture depending on the subject. Your writing style is evocative, intellectually rigorous, and breathtaking. Do not output in Romanian or any other language, ensuring everything is standard, natural English. Always determine and assign the correct category in the JSON ('philosophy', 'arts', 'literature', or 'architecture').",
        responseMimeType: "application/json",
        responseSchema: microlearningSchema,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No response string received from the Gemini Engine.");
    }

    // Parse the generated structural JSON
    const parsedData = JSON.parse(outputText.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({
      error: error.message || "An error occurred while running the Gemini Content Engine."
    });
  }
});

// Socratic AI Tutor — conversational debate endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload", details: parsed.error.issues });
    }
    
    const { philosopher, topic, essayContext, messages } = parsed.data;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    const systemInstruction = `You are ${philosopher}, the great thinker. You are having an intimate, intellectually rigorous philosophical conversation with a curious student.

PERSONA RULES:
- Speak in first person AS ${philosopher}. Use "I" and refer to your own works, specific theories, and ideas directly.
- Embody the exact tone, vocabulary, and worldview of ${philosopher}. If you are Nietzsche, be fiery and poetic; if you are Kant, be analytical and categorical.
- Be warm but intellectually challenging — push the student to question their fundamental assumptions.
- Use the Socratic method: answer questions with provocative counter-questions when appropriate to stimulate deeper thought.
- Reference your actual philosophical positions, historical context, and major texts accurately and naturally.
- Keep responses concise (2-4 sentences max) to maintain a natural, rapid conversational rhythm.
- If the student disagrees or presents a flawed argument, engage genuinely. Do not blindly agree. Defend your positions vigorously but respectfully.
- Occasionally use a memorable aphorism or quote from your actual writings to anchor your point.

TOPIC CONTEXT: The conversation revolves around the concept of "${topic}".
${essayContext ? `\nESSAY BEING DISCUSSED:\n${essayContext}` : ""}`;

    // Build conversation history for Gemini
    const contents = (messages || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await generateWithFallback({
      contents,
      config: {
        temperature: 0.8,
        systemInstruction,
        maxOutputTokens: 800,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from the philosopher.");
    }

    res.json({ reply: text.trim() });
  } catch (error: any) {
    console.error("Socratic Chat Error:", error);
    res.status(500).json({
      error: error.message || "The philosopher is momentarily lost in thought."
    });
  }
});

// Commonplace Book API: Export Essay
app.post("/api/export", async (req, res) => {
  try {
    const { cards } = req.body;
    if (!cards || cards.length === 0) {
      return res.json({ summary: "Your commonplace book is empty." });
    }

    const cardsContext = cards.map((c: any) => 
      `Thinker: ${c.philosopher}\nIdea: ${c.explore_title}\nInsight: ${c.explore_subtext}\nMy Annotation: ${c.annotation || "None"}\n`
    ).join("\n---\n");

    const prompt = `Act as an elite literary editor compiling a personal 'Commonplace Book'. Weave the following saved ideas and personal annotations into a cohesive, beautifully written, and profound summary essay (about 300-500 words). Draw deep, unexpected connections between the distinct thoughts, elevating the user's annotations into a grand philosophical narrative.\n\nHere are the notes:\n${cardsContext}`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: "You are a master essayist and philosopher synthesizing disparate ideas into a profound, intellectually breathtaking narrative essay. Your writing is elegant, cohesive, and insightful. Use clear markdown formatting.",
      },
    });

    res.json({ summary: response.text.trim() });
  } catch (error: any) {
    console.error("Export API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Configure Vite middleware / asset-serving depending on NODE_ENV
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

// trigger reload to fix hanging requests
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Logos] Running on http://localhost:${PORT}`);
  });
}

configureServer();
