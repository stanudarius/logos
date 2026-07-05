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
    const { philosopher, topic, essayContext, messages } = await req.json()
    
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const ai = new GoogleGenAI({ apiKey })

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

    const contents = (messages || []).map((msg: any) => ({
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

    return new Response(
      JSON.stringify({ reply: response.text?.trim() || "The philosopher is lost in thought." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
