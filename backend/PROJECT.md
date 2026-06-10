# Remy — Project Overview

> A video/camera-based app that teaches everyday skills. We start with cooking,
> then expand to cleaning, organizing, and beyond.

## The big idea

Remy is a calm AI coach for real-world skills. It watches what you're doing
through your camera and helps in two phases:

1. **During the task** — live video analysis to see how you're doing and give
   specific, gentle guidance (e.g. *"loosen your grip on the spoon"*,
   *"you're holding the peeler the wrong way"*).
2. **After the task** — an agentic layer for higher-level guidance (e.g.
   *"this ingredient is on sale nearby"*, *"try vinegar instead of scrubbing with
   cold water"*, *"swap [expensive ingredient] for [cheap ingredient]"*).

## MVP use case — cooking in the kitchen

| Part | Phase | What it does |
|------|-------|--------------|
| **1** | During | Start from **what you already have** and conjure a recipe just for you. |
| **2** | During | Use video analysis to guide you through the cook step-by-step. |
| **3** | After  | Overall feedback + improvement suggestions. |
| **4** | After  | Find affordable ingredients + cheaper alternatives. |

**Why cooking?**
- Broad audience — everybody eats.
- Lower risk — assuming no fire / careful knife handling.
- Visually observable, stable environment.
- The agentic layer can promote affordable living ("ethics-maxxing").

## Components (hardest → easiest, roughly)

| Component | For | Resources |
|-----------|-----|-----------|
| CV + video analysis (objects, motion, trajectories) | Parts 2 + 3 | Local first; real-time later |
| Agent layer | Parts 1 + 4 | AI credits (minimal) |
| React Native + TypeScript + Expo | Frontend / UI | Expo, Codex, Lovable |
| Workers+D1+R2 **or** Supabase+R2, plus EC2-equivalent | Backend / DB / object storage | Cloudflare + Supabase free tiers (later) |

## Implementation plan

1. ✅ Frontend up and running → nice screenshots for portfolio.
2. **→ Local agent layer** *(this repo starts here)*.
3. Local video analysis (doesn't have to be real-time yet).
4. Fit the agent layer + video analysis into the app.
5. Figure out hosting.
6. Actual deployment.

## Visual direction

Calm, warm, editorial. Reference: https://remy-23d.pages.dev/

---

## What's in this repo right now

This repo is the **local agent layer** — specifically the **vision input/output
prototype** that powers Part 1 (and feeds Part 4).

**Input:** one or more images of your kitchen / fridge / counter.
**Output:** structured JSON of *what ingredients are there* and *how much of each*.

From that inventory we can (Part 1) conjure a recipe, and later (Part 4) find
cheaper alternatives. See [README.md](README.md) for how to run it.
