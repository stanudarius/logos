# Logos

A cinematic microlearning app for philosophical thinking. Logos presents ideas as a swipeable stream of typographically designed "thought cards", and lets you follow thinkers, explore how they connect, and keep what resonates.

## Features

- **Thought stream** – a feed of ideas rendered in distinct layouts (thesis, blockquote, epigraph, fragment, interstitial)
- **Socratic chat** – converse with an AI that responds in a Socratic style
- **Constellation map** – an interactive graph of thinkers and the links between them
- **Reading trails** – curated paths through a thinker's ideas
- **Vault** – a commonplace book for saving cards, with image export and sharing
- **Quiz** and **Zen mode** for review and focused reading
- Accounts with sign-in and password reset, installable as a PWA

## Tech stack

| Area | Tools |
| :--- | :--- |
| Frontend | React, TypeScript, Vite, Tailwind CSS 4, Motion |
| Backend | Supabase (Auth, Postgres, Edge Functions) |
| AI | LLM requests proxied through OpenRouter inside Supabase Edge Functions |
| Mobile | Capacitor (iOS project included), PWA via `vite-plugin-pwa` |
| Hosting | Vercel (with Analytics and Speed Insights) |

## Getting started

**Prerequisites:** Node.js and a [Supabase](https://supabase.com) project.

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create `.env.local` with your Supabase project values:

   ```sh
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```

3. Create the database tables by running [`supabase_schema.sql`](supabase_schema.sql) in the Supabase SQL editor.

4. Deploy the Edge Functions (`chat` and `generate`) and set their secrets:

   ```sh
   npx supabase secrets set OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
   npx supabase functions deploy chat
   npx supabase functions deploy generate
   ```

   `OPENROUTER_APP_NAME` and `OPENROUTER_HTTP_REFERER` can optionally be set the same way.

5. Start the dev server:

   ```sh
   npm run dev
   ```

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm start` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run mobile:sync` | Build and sync the web bundle into the native iOS project |

## Project structure

```
src/
  features/     auth, chat, feed, graph, quiz, trails, vault, zen
  data/         thinkers, trails, quiz and interstitial content
  layouts/      desktop and mobile app shell
  lib/          Supabase client
supabase/
  functions/    chat and generate Edge Functions
ios/            Capacitor iOS project
```
