# remy-backend

The agent layer for Remy.

**Tech**
- Image (and later video) processing/analysis
- Agentic search and making plans/recipes

**Features**
- photos of fridge and kitchen → list of what you have ✅ *(done)*
- list of what you have → recipes and suggestions ✅ *(done)*
- video of the entire process → figuring out what happened *(planned)*
- what happened → cheaper alternatives and food sourcing *(hook in place)*

This repo currently implements the **image → inventory → recipe** path (Part 1).
It's a TypeScript/Node service with a provider-agnostic detector so the vision
backend can be swapped without touching the rest of the code.

## How it works

- **`Detector` interface** ([src/types.ts](src/types.ts)) — the code doesn't care
  *how* detection happens. Swapping backends is one class.
- **Three backends:**
  - `GeminiDetector` — **free-tier** Google Gemini vision (raw `fetch`, no SDK).
    The default for deploys: one **server-side** key, $0 at low volume,
    **users never need a key.**
  - `ClaudeVisionDetector` — Claude vision via forced tool use (paid; higher quality).
  - `MockDetector` — deterministic fixtures, **no key, offline**. The whole
    pipeline (CLI, server, tests) runs on this.
- All real backends return **Zod-schema-validated** JSON — a result is always
  shape-correct or the call throws.

## Setup

```bash
npm install
cp .env.example .env   # optional — only for REAL detection
```

- **No key?** Runs on the mock detector.
- **Free real detection?** Free Gemini key at https://aistudio.google.com/apikey
  → put `GEMINI_API_KEY=...` in `.env`.
- **Higher quality?** Set `ANTHROPIC_API_KEY=...` instead (paid).

Keys live on the **server only** — the app/website never sends one.

## Run

```bash
# detect ingredients in image(s)
npm run detect -- path/to/fridge.jpg
npm run detect -- a.jpg b.jpg --merge          # combine multiple photos
npm run detect -- fridge.jpg --json            # machine-readable

# image(s) -> a recipe (end to end)
npm run recipe -- fridge.jpg --pref "vegetarian, under 20 min"

# HTTP API for the app/website
npm start            # or: npm run serve

# checks
npm test             # runs on the mock detector — no key, no cost
npm run typecheck
```

## HTTP API

The mobile app / website call these:

| Route | Body | Returns |
|-------|------|---------|
| `GET /health`  | — | `{ ok, detector }` |
| `POST /detect` | raw image bytes, `Content-Type: image/jpeg\|png\|gif\|webp` | `DetectionRun` (inventory + meta) |
| `POST /recipe` | JSON `{ inventory, preference? }` | `{ inventory, recipe }` |

```bash
curl -s --data-binary @fridge.jpg -H "Content-Type: image/jpeg" \
  https://<host>/detect | jq
```

### Output shape

```ts
DetectionResult = {
  items: {
    name: string;            // "roma tomato"
    quantity: number;        // 4
    unit: string;            // "count" | "g" | "ml" | "bunch" | ...
    quantityKind: "exact" | "estimate" | "unknown";
    category: "produce" | "dairy" | "meat" | ...;
    confidence: number;      // 0..1
  }[];
  notes: string;
}
```

## Deploy

Holds one server-side key; users hit the backend through the app/website.

1. Set `GEMINI_API_KEY` in the host's environment.
2. Deploy the Node server (`npm start`) to any Node host. A `render.yaml`
   blueprint is included for one-click Render deploys (build `npm install`,
   start `npm start`, prompts for `GEMINI_API_KEY`).
3. Point the app/website at `https://<host>/detect` and `/recipe`.

> The `GeminiDetector` uses raw `fetch`, so it's also Cloudflare-Workers-compatible
> (the `http` server would need a small `fetch`-handler wrapper for Workers).

## Configuration

| Env var | Default | Notes |
|---------|---------|-------|
| `GEMINI_API_KEY` | — | Free-tier detection + recipes (recommended). |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini vision model. |
| `ANTHROPIC_API_KEY` | — | Paid fallback; used if no Gemini key. |
| `REMY_MODEL` | `claude-opus-4-8` | Claude model. Cheaper: `claude-sonnet-4-6`, `claude-haiku-4-5`. |
| `REMY_DETECTOR` | auto | Force `gemini` / `claude` / `mock`. Auto = gemini → claude → mock by key presence. |
| `PORT` | `8787` | For the HTTP server. |

## Layout

```
src/
  types.ts              Schema, Detector interface, inventory merge
  prompt.ts             Vision system prompt
  detector.ts           Factory + image loading helpers
  detectors/
    gemini.ts           Free-tier Gemini vision (default)
    claudeVision.ts     Claude vision (forced tool use)
    mock.ts             Offline deterministic detector
  recipe.ts             Part 1: inventory -> recipe
  gemini.ts             Gemini fetch helper
  structured.ts         Claude forced-tool-use helper
  env.ts                Loads .env locally (no-op on hosts)
  cli.ts / recipe-cli.ts / server.ts   entry points
test/                   Runs on the mock — zero cost
```

See [PROJECT.md](PROJECT.md) for the full product vision.
