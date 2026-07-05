import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI } from "npm:@google/genai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cards } = await req.json()
    
    if (!cards || cards.length === 0) {
      throw new Error('At least one card is required')
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const ai = new GoogleGenAI({ apiKey })

    const cardsContext = cards.map((c: any) =>
      `Thinker: ${c.philosopher}\nIdea: ${c.explore_title}\nInsight: ${c.explore_subtext}\nMy Annotation: ${c.annotation || "None"}\n`
    ).join("\n---\n");

    const prompt = `Act as an elite literary editor compiling a personal 'Commonplace Book'. Weave the following saved ideas and personal annotations into a cohesive, beautifully written, and profound summary essay (about 300-500 words). Draw deep, unexpected connections between the distinct thoughts, elevating the user's annotations into a grand philosophical narrative.\n\nHere are the notes:\n${cardsContext}`;

    const response = await ai.models.generateContent({
      contents: prompt,
      model: "gemini-3.5-flash",
      config: {
        temperature: 0.7,
        systemInstruction: "You are a master essayist and philosopher synthesizing disparate ideas into a profound, intellectually breathtaking narrative essay. Your writing is elegant, cohesive, and insightful. Use clear markdown formatting.",
      },
    });

    return new Response(
      JSON.stringify({ summary: response.text?.trim() || "" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
