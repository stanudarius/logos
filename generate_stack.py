#!/usr/bin/env python3
"""
Aura Stack - Milestone 1 Content Generator Engine
This script takes raw text about philosophical/historical concepts and uses 
Google's Gemini API via the google-generativeai SDK to convert it into a highly 
structured, premium microlearning JSON pack ready for Supabase injection.

Prerequisites:
  pip install google-generativeai pydantic

Usage:
  1. Set your Gemini API key in your terminal env:
     export GEMINI_API_KEY="your-api-key-here"
  2. Run the script:
     python generate_stack.py
"""

import os
import json
import sys
from typing import List
from pydantic import BaseModel, Field
import google.generativeai as genai

# Define the exact structural schema required by Aura Stack using Pydantic.
# This ensures that Gemini will output valid, structured data.

class Card(BaseModel):
    explore_title: str = Field(
        description="Punchy, cinematic title for this slide card (max 5 words, e.g. 'Tăcerea Lumii' or 'The Eternal Struggle')."
    )
    explore_subtext: str = Field(
        description="Fascinating brief commentary or quote-level thought (1-2 poetic sentences, max 25 words)."
    )
    vault_question: str = Field(
        description="Anki-style spaced-repetition active recall question for Vault testing."
    )
    vault_answer: str = Field(
        description="Anki-style micro-answer (1 short sentence) answering the vault_question."
    )

class ReadingPart(BaseModel):
    part_number: int = Field(
        description="Sequential step index starting from 1."
    )
    text: str = Field(
        description="A rich paragraph of philosophy (70-130 words) for deep-dive continuous reading."
    )

class Presentation(BaseModel):
    title: str = Field(
        description="The aesthetic essay title (e.g. 'Mitul lui Sisif' or 'Stoic Indifference')."
    )
    reading_parts: List[ReadingPart] = Field(
        description="An essay broken down into exactly 3-5 logical paragraph blocks."
    )

class ContentStack(BaseModel):
    stack_id: str = Field(
        description="Lowercase, unique snake_case identifier (e.g. 'phi_camus_01', 'hist_marcus_02')."
    )
    topic: str = Field(
        description="The overarching domain or philosophy (e.g. 'Filosofia Absurdului', 'Stoicism')."
    )
    philosopher: str = Field(
        description="Primary author or philosopher key to this concept (e.g. 'Albert Camus')."
    )
    visual_mood: str = Field(
        description="Visual aesthetic. Choose one of: 'blinding_sunlight', 'cosmic_void', 'crimson_twilight', 'emerald_mist', 'amber_glow'."
    )
    cards: List[Card] = Field(
        description="Exactly 4 sequential microlearning cards capturing the absolute essence of this topic."
    )
    presentation: Presentation = Field(
        description="The continuous essay deep dive framework."
    )

def main():
    # 1. Retrieve the Gemini API key from environment variables
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("[!] Error: GEMINI_API_KEY environment variable is not set.", file=sys.stderr)
        print("Please set it using: export GEMINI_API_KEY='your_api_key_here'", file=sys.stderr)
        sys.exit(1)

    # 2. Configure the Generative AI library
    genai.configure(api_key=api_key)

    # 3. Define raw prompt text to parse (We provide a high-quality Stoic template by default)
    raw_material = """
    Marcus Aurelius was born in Rome in 121 AD and became Emperor in 161 AD. 
    He was one of the most prominent Stoic philosophers. In his private journal, compiled 
    as the 'Meditations', he writes extensively about Stoic indifference and personal duty.
    He notes that we do not control external events, only our reaction to them. This is the 
    core dichotomy of control.
    Another central tenet is 'Amor Fati'—loving one's fate, whatever it brings. Acceptance 
    is not submission, but an active alignment with nature. 
    He also discusses the brevity of life and the concept of Memento Mori, reminding 
    ourselves that we are mortals so that we live each day with supreme intention and clarity.
    The Meditations were never intended for publication; they were an ultimate practice in self-discipline.
    """

    print("[*] Contacting Gemini API for structured generation...")

    try:
        # 4. Initialize model. We use gemini-2.5-flash which is perfect for lightning-fast structured generation.
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # 5. Call generate_content with structured options.
        response = model.generate_content(
            f"Please restructure the following raw material into an elite microlearning stack with exactly 4 cards:\n\n{raw_material}",
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=ContentStack,
                temperature=0.4,
            )
        )
        
        # 6. Parse and pretty-print the result
        generated_json = json.loads(response.text)
        print("\n=== GENERATED DATA PACK ===")
        print(json.dumps(generated_json, indent=2, ensure_ascii=False))
        print("============================\n")
        print("[+] Content stack generated successfully! Ready for Supabase ingestion.")

    except Exception as e:
        print(f"[!] Compilation or Generation Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
