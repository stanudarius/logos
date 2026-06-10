import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import helmet from "helmet";
import { z } from "zod";

dotenv.config({ quiet: true } as any);

// Initialize express app
const app = express();
const PORT = 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://cdn-icons-png.flaticon.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https://api.pwnedpasswords.com", "https://*.supabase.co", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    },
  },
}));
app.use(express.json());

// Initialize Gemini SDK server-side (Kept strictly for Socratic Tutor & Export features)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Load unified static database into memory for maximum efficiency
const DB_PATH = path.join(process.cwd(), "data", "database.json");
let cardsDatabase: Record<string, any[]> = {};
let stacksArray: any[][] = [];

try {
  if (fs.existsSync(DB_PATH)) {
    const rawData = fs.readFileSync(DB_PATH, "utf-8");
    cardsDatabase = JSON.parse(rawData);
    stacksArray = Object.values(cardsDatabase).filter(arr => Array.isArray(arr) && arr.length > 0);
  } else {
    console.warn(`[Logos] WARNING: Unified database not found at ${DB_PATH}.`);
  }
} catch (e) {
  console.error("[Logos] Error loading database.json.", e);
}

// Validation Schemas
const generateSchema = z.object({
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

// Helper for shuffling array
function shuffleArray(array: any[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

app.post("/api/generate", (req, res) => {
  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request payload", details: parsed.error.issues });
    }

    const { rabbitHoleContext } = parsed.data;

    if (stacksArray.length === 0) {
       return res.status(404).json({ error: "Feed exhausted. No more cards in database.", feed_exhausted: true });
    }

    let matchingStacks = stacksArray;
    let nonMatchingStacks: any[][] = [];

    if (rabbitHoleContext && rabbitHoleContext.length > 0) {
      const contextString = rabbitHoleContext.join(" ").toLowerCase();
      
      matchingStacks = stacksArray.filter(stack => {
        const firstCard = stack[0];
        const t = firstCard.topic?.toLowerCase() || "";
        const p = firstCard.philosopher?.toLowerCase() || "";
        const c = firstCard.category?.toLowerCase() || "";
        return contextString.includes(c) || contextString.includes(p) || contextString.includes(t);
      });
      
      nonMatchingStacks = stacksArray.filter(stack => {
        const firstCard = stack[0];
        const t = firstCard.topic?.toLowerCase() || "";
        const p = firstCard.philosopher?.toLowerCase() || "";
        const c = firstCard.category?.toLowerCase() || "";
        return !contextString.includes(c) && !contextString.includes(p) && !contextString.includes(t);
      });
    }

    const returnedCards = [];
    let lastPhilosopher = "";

    for (let i = 0; i < 4; i++) {
      let chosenStack;
      const roll = Math.random();
      
      const validMatching = matchingStacks.filter(s => s[0].philosopher !== lastPhilosopher);
      const validNonMatching = nonMatchingStacks.filter(s => s[0].philosopher !== lastPhilosopher);
      const validAll = stacksArray.filter(s => s[0].philosopher !== lastPhilosopher);

      if (roll < 0.70 && validMatching.length > 0) {
        chosenStack = validMatching[Math.floor(Math.random() * validMatching.length)];
      } else if (validNonMatching.length > 0) {
        chosenStack = validNonMatching[Math.floor(Math.random() * validNonMatching.length)];
      } else if (validAll.length > 0) {
        chosenStack = validAll[Math.floor(Math.random() * validAll.length)];
      } else {
        chosenStack = stacksArray[Math.floor(Math.random() * stacksArray.length)];
      }

      if (chosenStack) {
        const card = chosenStack[Math.floor(Math.random() * chosenStack.length)];
        returnedCards.push(card);
        lastPhilosopher = card.philosopher;
      }
    }

    const uniqueStack = returnedCards.map(card => ({
        ...card,
        id: `${card.id}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
    }));

    res.json(uniqueStack);
  } catch (error: any) {
    console.error("Feed API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/trail/:trailId", (req, res) => {
   const { trailId } = req.params;
   const trailCards = cardsDatabase[trailId];
   
   if (!trailCards) {
       return res.status(404).json({ error: "Trail not found" });
   }
   
   const uniqueTrail = trailCards.map((card: any) => ({
        ...card,
        id: `${card.id}_${Date.now()}`
   }));
   
   res.json(uniqueTrail);
});

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
- Embody the exact tone, vocabulary, and worldview of ${philosopher}.
- Be warm but intellectually challenging — push the student to question their fundamental assumptions.
- Use the Socratic method: answer questions with provocative counter-questions when appropriate.
- Keep responses concise (2-4 sentences max) to maintain a natural, rapid conversational rhythm.
- If the student disagrees, engage genuinely. Defend your positions vigorously but respectfully.

TOPIC CONTEXT: The conversation revolves around the concept of "${topic}".
${essayContext ? `\nESSAY BEING DISCUSSED:\n${essayContext}` : ""}`;

    const contents = (messages || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      contents,
      model: "gemini-2.5-flash",
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

// ------------------------------------------------------------------
// COMMONPLACE BOOK EXPORT (Keeps Gemini API)
// ------------------------------------------------------------------
app.post("/api/export", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    const { cards } = req.body;
    if (!cards || cards.length === 0) {
      return res.json({ summary: "Your commonplace book is empty." });
    }

    const cardsContext = cards.map((c: any) =>
      `Thinker: ${c.philosopher}\nIdea: ${c.explore_title}\nInsight: ${c.explore_subtext}\nMy Annotation: ${c.annotation || "None"}\n`
    ).join("\n---\n");

    const prompt = `Act as an elite literary editor compiling a personal 'Commonplace Book'. Weave the following saved ideas and personal annotations into a cohesive, beautifully written, and profound summary essay (about 300-500 words). Draw deep, unexpected connections between the distinct thoughts, elevating the user's annotations into a grand philosophical narrative.\n\nHere are the notes:\n${cardsContext}`;

    const response = await ai.models.generateContent({
      contents: prompt,
      model: "gemini-2.5-flash",
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Logos] Running on http://localhost:${PORT}`);
  });
}

configureServer();
