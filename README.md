# Remy — monorepo

Remy is a calm AI coach for real-world skills, starting with cooking. It watches
what you're doing through your camera and helps **during** the task (live
guidance + safety) and **after** (higher-level feedback, cheaper ingredients).
See [backend/PROJECT.md](backend/PROJECT.md) for the full product vision.

This repo brings the whole project under one roof:

```
remy-mono/
├── frontend/
│   ├── app/        Expo + React Native mobile app
│   └── website/    React + Vite marketing site
└── backend/        Agent layer — image → ingredient inventory → recipe + HTTP API
```

Each subproject keeps its own dependencies and is run from its own folder.

## frontend/app — mobile app

```bash
cd frontend/app
npm install
npx expo start
```

Then pick a target (iOS / Android / web) from the Expo dev server. This is where
the camera, on-device keypoint tracking, and the live safety/action layers live.

## frontend/website — marketing site

```bash
cd frontend/website
npm install
npm run dev      # build: npm run build, preview: npm run preview
```

## backend — agent layer

```bash
cd backend
npm install
cp .env.example .env   # optional — only needed for REAL detection
npm run detect -- path/to/fridge.jpg   # works offline on the mock detector
```

Image → inventory → recipe, plus a small HTTP API the app/website call. Runs
with zero credits on a mock detector, and flips to real Gemini/Claude vision the
moment a key is in the environment. Full usage in
[backend/README.md](backend/README.md).

## Architecture

The live "watch me cook" phase (action recognition, technique, real-time safety
warnings) runs **on-device**; only relaxed-latency work (recipes, pricing,
post-cook review) touches a server — so the MVP needs no persistent server. The
detailed write-up lives with the agent layer the design grew out of.
