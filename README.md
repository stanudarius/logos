# Logos

> Cinematic microlearning for philosophical thinking, built around short-form ideas, visual storytelling, and guided exploration.

**Live:** https://www-logos.com

## What it is

Logos turns philosophy into a swipeable stream of typographically designed thought cards. You can follow thinkers, explore relationships between ideas, talk to a Socratic AI, and save the ideas that stay with you.

## Highlights

- **Thought stream** — thesis, blockquote, epigraph, fragment, and interstitial card layouts
- **Socratic chat** — conversational exploration with an AI designed to respond in a Socratic style
- **Constellation map** — interactive graph of thinkers and their connections
- **Reading trails** — curated paths through a thinker's ideas
- **Vault** — save, export, and share cards
- **Quiz + Zen mode** — lightweight review and focused reading
- **Accounts + PWA** — authentication, password reset, and installable web app
- **iOS app** — Capacitor project included

## Tech stack

| Area | Stack |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS 4, Motion |
| Backend | Supabase (Auth, Postgres, Edge Functions) |
| AI | OpenRouter via Supabase Edge Functions |
| Mobile | Capacitor / iOS, PWA |
| Hosting | Vercel, Analytics, Speed Insights |

## Getting started

### Prerequisites

- Node.js
- A Supabase project

### Install

    npm install

Create .env.local:

    VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
    VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

Create the database schema by running supabase_schema.sql in the Supabase SQL editor.

Deploy the Edge Functions and configure the required secrets:

    npx supabase secrets set OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
    npx supabase functions deploy chat
    npx supabase functions deploy generate

Then start the app:

    npm run dev

## Scripts

| Command | Purpose |
| --- | --- |
| npm run dev | Start the Vite development server |
| npm run build | Type-check and build the production bundle |
| npm start | Preview the production build |
| npm run lint | Run TypeScript checks with tsc --noEmit |
| npm run mobile:sync | Build and sync the web bundle into the iOS project |

## Project structure

    src/
      features/     auth, chat, feed, graph, quiz, trails, vault, zen
      data/         thinkers, trails, quiz and interstitial content
      layouts/      desktop and mobile app shell
      lib/          Supabase client

    supabase/
      functions/    chat and generate Edge Functions

    ios/            Capacitor iOS project
