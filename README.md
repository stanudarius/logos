# Logos

Logos is an intelligent application designed for philosophical thinking and cinematic presentation of ideas.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Configure the deployed Supabase Edge Function:

   ```sh
   npx supabase secrets set OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
   npx supabase functions deploy chat
   ```

3. Start the dev server:
   `npm run dev`
