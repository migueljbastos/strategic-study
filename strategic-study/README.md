# Strategic Study Synthesizer

A tiny React + Tailwind app that ingests the **JSON** produced by your *Strategic Thinking Study Synthesizer* prompt and turns it into a study site with TL;DR, takeaways, concepts, flashcards, exam questions, and a spaced plan.

## Quickstart
1) **Install**: `npm install`
2) **Run locally**: `npm run dev` then open the printed URL.
3) **Paste JSON**: In the "Load JSON" card, paste the JSON block from your AI output (or import a file).

## Deploy (Vercel, easiest)
1) Push this folder to a new GitHub repo.
2) Go to vercel.com → New Project → Import your repo.
3) Framework preset: **Vite** (auto-detected). Build command: `npm run build`. Output: `dist`.
4) Click **Deploy**.

## Deploy (Netlify)
- New site from Git: pick the repo
- Build command: `npm run build`
- Publish directory: `dist`

## JSON schema (excerpt)
See `src/data/sample.json` for the expected shape.

## Notes
- Your last pasted JSON is saved in `localStorage`.
- No backend required; it's a static site.
