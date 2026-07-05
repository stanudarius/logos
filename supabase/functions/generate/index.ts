import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { rabbitHoleContext, seenIds } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: allCards, error } = await supabaseClient.from('feed_cards').select('*')
    if (error) throw error

    const stacksMap = new Map<string, any[]>()
    for (const card of allCards || []) {
      if (!stacksMap.has(card.stack_id)) stacksMap.set(card.stack_id, [])
      // Restore layoutVariant property that was saved as layout_variant
      card.layoutVariant = card.layout_variant;
      stacksMap.get(card.stack_id)!.push(card)
    }
    const stacksArray = Array.from(stacksMap.values())

    const seenSet = new Set(seenIds || [])
    const availableStacks = stacksArray
      .map(stack => stack.filter(card => !seenSet.has(card.id)))
      .filter(stack => stack.length > 0)

    if (availableStacks.length === 0) {
      return new Response(JSON.stringify({ error: "Feed exhausted.", feed_exhausted: true }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let matchingStacks = availableStacks
    let nonMatchingStacks: any[][] = []

    if (rabbitHoleContext && rabbitHoleContext.length > 0) {
      const contextString = rabbitHoleContext.join(" ").toLowerCase()
      matchingStacks = availableStacks.filter(stack => {
        const first = stack[0]
        const str = `${first.topic} ${first.philosopher} ${first.category}`.toLowerCase()
        return contextString.split(" ").some((kw: string) => str.includes(kw))
      })
      nonMatchingStacks = availableStacks.filter(stack => !matchingStacks.includes(stack))
    }

    const returnedCards: any[] = []
    let lastPhilosopher = ""

    for (let i = 0; i < 4; i++) {
      let chosenStack: any[] | undefined
      const roll = Math.random()
      
      const validMatching = matchingStacks.filter(s => s.length > 0 && s[0].philosopher !== lastPhilosopher)
      const validNonMatching = nonMatchingStacks.filter(s => s.length > 0 && s[0].philosopher !== lastPhilosopher)
      const validAll = availableStacks.filter(s => s.length > 0 && s[0].philosopher !== lastPhilosopher)

      if (roll < 0.70 && validMatching.length > 0) {
        chosenStack = validMatching[Math.floor(Math.random() * validMatching.length)]
      } else if (validNonMatching.length > 0) {
        chosenStack = validNonMatching[Math.floor(Math.random() * validNonMatching.length)]
      } else if (validAll.length > 0) {
        chosenStack = validAll[Math.floor(Math.random() * validAll.length)]
      } else {
        const fallback = availableStacks.filter(s => s.length > 0)
        if (fallback.length > 0) chosenStack = fallback[Math.floor(Math.random() * fallback.length)]
      }

      if (chosenStack && chosenStack.length > 0) {
        const cardIndex = Math.floor(Math.random() * chosenStack.length)
        const card = chosenStack[cardIndex]
        chosenStack.splice(cardIndex, 1) // Remove the card so it can't be picked again in this batch
        returnedCards.push(card)
        lastPhilosopher = card.philosopher
      } else {
        break
      }
    }

    const uniqueStack = returnedCards.map(card => ({
      ...card,
      base_id: card.id,
      id: `${card.id}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
    }))

    return new Response(JSON.stringify(uniqueStack), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
