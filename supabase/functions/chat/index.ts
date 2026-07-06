import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const MAX_TOPIC_LENGTH = 200
const MAX_ESSAY_CONTEXT_LENGTH = 8000
const MAX_MESSAGE_TEXT_LENGTH = 2000
const MAX_MESSAGES = 40

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { philosopher, topic, essayContext, messages } = body ?? {}

    if (typeof philosopher !== 'string' || !philosopher.trim() || philosopher.length > MAX_TOPIC_LENGTH) {
      throw new Error('Invalid "philosopher".')
    }
    if (typeof topic !== 'string' || !topic.trim() || topic.length > MAX_TOPIC_LENGTH) {
      throw new Error('Invalid "topic".')
    }
    if (essayContext !== undefined && essayContext !== null) {
      if (typeof essayContext !== 'string' || essayContext.length > MAX_ESSAY_CONTEXT_LENGTH) {
        throw new Error('Invalid "essayContext".')
      }
    }
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      throw new Error('Invalid "messages".')
    }
    for (const msg of messages) {
      if (!msg || typeof msg !== 'object' || typeof msg.text !== 'string' || msg.text.length > MAX_MESSAGE_TEXT_LENGTH) {
        throw new Error('Invalid message in "messages".')
      }
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

    let reply = "";

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY is not set');
    }

    try {
      const dsMessages = [
        { role: "system", content: systemInstruction },
        ...messages.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text
        }))
      ];

      const dsRes = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepseekApiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: dsMessages,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (dsRes.ok) {
        const dsData = await dsRes.json();
        if (dsData.choices && dsData.choices.length > 0) {
          reply = dsData.choices[0].message.content.trim();
        }
      } else {
        const errText = await dsRes.text();
        console.error('[chat] deepseek error:', errText);
        throw new Error(`Deepseek API error: ${dsRes.status} ${errText}`);
      }
    } catch (err) {
      console.error('[chat] deepseek fetch error:', err);
      throw err;
    }

    if (!reply) {
      reply = "The philosopher is lost in thought.";
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('[chat] request failed:', error)
    return new Response(
      JSON.stringify({ error: "Something went wrong, please try again." }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
