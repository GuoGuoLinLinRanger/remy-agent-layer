import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { DetectionResult } from "./types.js";
import { DEFAULT_MODEL } from "./detectors/claudeVision.js";
import { runStructuredTool } from "./structured.js";
import { geminiStructured, GEMINI_DEFAULT_MODEL } from "./gemini.js";

/**
 * Part 1: "start with what you have and conjure a recipe just for you."
 * Also seeds Part 4: `missingButRecommended` is the hook for the cheaper-
 * alternatives / affordable-ingredient layer.
 */
export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  servings: z.number(),
  timeMinutes: z.number(),
  /** Inventory item names actually used. */
  usesFromInventory: z.array(z.string()),
  /** Common staples assumed on hand (salt, pepper, water, oil). */
  pantryAssumptions: z.array(z.string()),
  /** Not on hand but would improve the dish — feeds the Part 4 agent layer. */
  missingButRecommended: z.array(
    z.object({ name: z.string(), why: z.string() }),
  ),
  steps: z.array(z.string()),
});
export type Recipe = z.infer<typeof RecipeSchema>;

const RECIPE_TOOL_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    servings: { type: "number" },
    timeMinutes: { type: "number", description: "Total time in minutes." },
    usesFromInventory: {
      type: "array",
      items: { type: "string" },
      description: "Names of on-hand ingredients the recipe uses.",
    },
    pantryAssumptions: {
      type: "array",
      items: { type: "string" },
      description: "Staples assumed available (salt, pepper, water, oil).",
    },
    missingButRecommended: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, why: { type: "string" } },
        required: ["name", "why"],
      },
      description: "Not on hand but would improve the dish; recipe must work without these.",
    },
    steps: { type: "array", items: { type: "string" }, description: "One step per entry." },
  },
  required: [
    "title",
    "description",
    "servings",
    "timeMinutes",
    "usesFromInventory",
    "pantryAssumptions",
    "missingButRecommended",
    "steps",
  ],
} as const;

/** Gemini-format mirror of RECIPE_TOOL_SCHEMA (types UPPERCASE). */
const RECIPE_GEMINI_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    description: { type: "STRING" },
    servings: { type: "NUMBER" },
    timeMinutes: { type: "NUMBER" },
    usesFromInventory: { type: "ARRAY", items: { type: "STRING" } },
    pantryAssumptions: { type: "ARRAY", items: { type: "STRING" } },
    missingButRecommended: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { name: { type: "STRING" }, why: { type: "STRING" } },
        required: ["name", "why"],
        propertyOrdering: ["name", "why"],
      },
    },
    steps: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "title",
    "description",
    "servings",
    "timeMinutes",
    "usesFromInventory",
    "pantryAssumptions",
    "missingButRecommended",
    "steps",
  ],
  propertyOrdering: [
    "title",
    "description",
    "servings",
    "timeMinutes",
    "usesFromInventory",
    "pantryAssumptions",
    "missingButRecommended",
    "steps",
  ],
} as const;

const RECIPE_SYSTEM_PROMPT = `You are Remy, a warm, practical home-cooking coach. Given an inventory of ingredients someone already has, design ONE achievable recipe that leans on what they have.

Principles:
- Maximize use of the on-hand inventory; minimize what they need to buy.
- Assume basic staples (salt, pepper, water, cooking oil) are available; list them in pantryAssumptions.
- If a small addition would meaningfully improve the dish, put it in missingButRecommended with a short reason — but the recipe must work without it.
- Keep steps clear; each array entry is one step. Aim for something a nervous beginner can follow.
- Pick realistic servings and total time.`;

export interface RecipeOptions {
  client?: Anthropic;
  model?: string;
  /** Force the offline generator (no API call). */
  mock?: boolean;
  /** Optional nudge, e.g. "vegetarian", "under 20 minutes", "use up the basil". */
  preference?: string;
}

export async function generateRecipe(
  inventory: DetectionResult,
  opts: RecipeOptions = {},
): Promise<Recipe> {
  const useMock =
    opts.mock ??
    (!opts.client &&
      !process.env.ANTHROPIC_API_KEY &&
      !process.env.GEMINI_API_KEY);
  if (useMock) return mockRecipe(inventory);

  const inventoryLines = inventory.items
    .map((i) =>
      i.quantityKind === "unknown"
        ? `- ${i.name} (some)`
        : `- ${i.name}: ${i.quantity} ${i.unit}`,
    )
    .join("\n");

  const userText =
    `Here is what I have:\n${inventoryLines}\n\n` +
    (opts.preference ? `Preference: ${opts.preference}\n\n` : "") +
    `Design one recipe I can make right now.`;

  // Prefer Gemini (free tier) when its key is set and no explicit Anthropic
  // client was passed; otherwise use Claude via forced tool use.
  if (process.env.GEMINI_API_KEY && !opts.client) {
    const { value } = await geminiStructured(RecipeSchema, {
      apiKey: process.env.GEMINI_API_KEY,
      model: opts.model ?? GEMINI_DEFAULT_MODEL,
      systemInstruction: RECIPE_SYSTEM_PROMPT,
      parts: [{ text: userText }],
      responseSchema: RECIPE_GEMINI_SCHEMA,
    });
    return value;
  }

  const { value } = await runStructuredTool(RecipeSchema, {
    client: opts.client ?? new Anthropic(),
    model: opts.model ?? DEFAULT_MODEL,
    maxTokens: 4096,
    system: RECIPE_SYSTEM_PROMPT,
    userContent: userText,
    toolName: "propose_recipe",
    toolDescription: "Propose one recipe built from the on-hand inventory.",
    inputSchema: RECIPE_TOOL_SCHEMA,
  });
  return value;
}

/** Deterministic offline recipe so the flow runs with no key. */
function mockRecipe(inventory: DetectionResult): Recipe {
  const names = inventory.items.map((i) => i.name);
  const hero = names[0] ?? "whatever you have";
  return {
    title: `Simple ${hero} skillet`,
    description: `A quick one-pan dish built around your ${hero}. (Offline mock recipe — set GEMINI_API_KEY or ANTHROPIC_API_KEY for a real, tailored recipe.)`,
    servings: 2,
    timeMinutes: 25,
    usesFromInventory: names.slice(0, 5),
    pantryAssumptions: ["salt", "pepper", "water", "cooking oil"],
    missingButRecommended: [
      { name: "lemon", why: "a squeeze brightens almost any skillet dish" },
    ],
    steps: [
      "Prep everything: wash, peel, and chop your produce.",
      `Heat a little oil in a pan over medium heat and start your ${hero}.`,
      "Add the rest of your ingredients in order of how long they take to cook.",
      "Season with salt and pepper, taste, and adjust.",
      "Serve warm.",
    ],
  };
}
