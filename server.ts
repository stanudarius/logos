import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize express app
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Robust fallback generator
async function generateWithFallback(params: any) {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-8b"];
  let lastError;

  for (const modelName of models) {
    try {
      return await ai.models.generateContent({ ...params, model: modelName });
    } catch (e: any) {
      if (e.status === 503 || e.status === 429) {
        console.warn(`[${modelName}] is busy/quota exceeded (Status: ${e.status}). Falling back...`);
        lastError = e;
      } else {
        throw e;
      }
    }
  }
  throw lastError || new Error("All Gemini models are currently overwhelmed.");
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
          },
          vault_question: {
            type: Type.STRING,
            description: "Anki active recall test question based on this slide's core knowledge."
          },
          vault_answer: {
            type: Type.STRING,
            description: "Bite-sized direct answer to the active recall question."
          }
        },
        required: ["explore_title", "explore_subtext", "vault_question", "vault_answer"]
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

// API Endpoint to transform raw material into the Content Stack JSON structure using Gemini
app.post("/api/generate", async (req, res) => {
  try {
    let { rawText } = req.body;

    // If rawText is not provided or specifically set to "RANDOM" for infinite scroll feeds, generate a random subject.
    if (!rawText || typeof rawText !== "string" || rawText.trim().length === 0 || rawText === "RANDOM") {
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

    const prompt = `
    Transform the following raw textual concepts into an elite microlearning content stack JSON package.
    Ensure there are EXACTLY 4 sequential cards that tell a beautiful narrative arc about this subject (philosophy, arts, literature, or architecture).
    The reading_parts must contain a coherent essay broken down into 2 to 4 parts.
    
    Raw Concepts to Digest:
    ---
    ${rawText}
    ---
    `;

    // Query Gemini 2.5 Flash for high performance and structured accuracy
    const response = await generateWithFallback({
      contents: prompt,
      config: {
        temperature: 0.5,
        systemInstruction: "You are an elite, poetic university professor and master microlearning designer. You output beautiful, world-class, profound explanations entirely in English covering Philosophy, Arts, Literature, or Architecture depending on the subject. Do not output in Romanian or any other language, ensuring everything is standard, natural English. Always determine and assign the correct category in the JSON ('philosophy', 'arts', 'literature', or 'architecture').",
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
    const { philosopher, topic, essayContext, messages } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    if (!philosopher || !topic) {
      return res.status(400).json({ error: "philosopher and topic are required." });
    }

    const systemInstruction = `You are ${philosopher}, the great thinker. You are having an intimate, intellectually rigorous philosophical conversation with a curious student.

PERSONA RULES:
- Speak in first person AS ${philosopher}. Use "I" and refer to your own works and ideas directly.
- Be warm but intellectually challenging — push the student to think deeper.
- Use the Socratic method: answer questions with provocative counter-questions when appropriate.
- Reference your actual philosophical positions, works, and historical context accurately.
- Keep responses concise (2-4 sentences max) to maintain a natural conversational rhythm.
- If the student disagrees, engage genuinely — don't just agree. Defend your positions.
- Occasionally use a memorable aphorism or quote from your actual writings.

TOPIC CONTEXT: The conversation is about "${topic}".
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
