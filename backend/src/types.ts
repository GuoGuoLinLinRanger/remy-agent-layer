import { z } from "zod";

/**
 * The vocabulary the model is asked to bucket items into. Keeping it a small,
 * fixed enum makes downstream logic (recipe generation, store lookups) simpler
 * and keeps the model's output stable.
 */
export const CATEGORIES = [
  "produce",
  "dairy",
  "meat",
  "seafood",
  "pantry",
  "grain",
  "spice",
  "condiment",
  "beverage",
  "frozen",
  "bakery",
  "other",
] as const;

/** How a quantity was arrived at — lets the UI show "~3" vs an exact count. */
export const QUANTITY_KINDS = ["exact", "estimate", "unknown"] as const;

export const IngredientSchema = z.object({
  /** Canonical lowercase name, e.g. "roma tomato", "whole milk". */
  name: z.string(),
  /** Numeric amount. Use 0 when the kind is "unknown". */
  quantity: z.number(),
  /** Unit for the quantity, e.g. "count", "g", "ml", "bunch", "clove". */
  unit: z.string(),
  /** Whether the quantity is a hard count, a rough estimate, or unknowable. */
  quantityKind: z.enum(QUANTITY_KINDS),
  /** Coarse category for downstream grouping. */
  category: z.enum(CATEGORIES),
  /** Model confidence this item is present and correctly identified, 0..1. */
  confidence: z.number(),
});

export const DetectionResultSchema = z.object({
  items: z.array(IngredientSchema),
  /** Free-text observations (lighting issues, occluded items, etc.). */
  notes: z.string(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type DetectionResult = z.infer<typeof DetectionResultSchema>;

/** A single image to analyze, as raw bytes plus its MIME type. */
export interface ImageInput {
  /** Base64-encoded image data (no data: prefix). */
  base64: string;
  /** e.g. "image/jpeg", "image/png". */
  mediaType: SupportedMediaType;
  /** Optional label for logs / batch results. */
  label?: string;
}

export const SUPPORTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
export type SupportedMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number];

/** Result of detecting over one image, with timing/cost metadata. */
export interface DetectionRun {
  result: DetectionResult;
  meta: {
    detector: string;
    model?: string;
    label?: string;
    /** Wall-clock ms for the detection call. */
    elapsedMs: number;
    /** Token usage when the backend reports it (Claude does; mock doesn't). */
    usage?: { inputTokens: number; outputTokens: number };
  };
}

/**
 * The contract every detector implements. New backends (a local CV model, a
 * different vision API, a fine-tuned model) only have to satisfy this.
 */
export interface Detector {
  readonly name: string;
  detect(image: ImageInput): Promise<DetectionRun>;
}

/** Merge several single-image inventories into one deduped inventory. */
export function mergeInventories(results: DetectionResult[]): DetectionResult {
  const byKey = new Map<string, Ingredient>();
  const notes: string[] = [];

  for (const r of results) {
    if (r.notes.trim()) notes.push(r.notes.trim());
    for (const item of r.items) {
      const key = `${item.name.toLowerCase()}::${item.unit.toLowerCase()}`;
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, { ...item });
        continue;
      }
      // Same ingredient seen in multiple images: sum quantities, keep the
      // highest confidence, and soften the quantity kind if either is fuzzy.
      existing.quantity += item.quantity;
      existing.confidence = Math.max(existing.confidence, item.confidence);
      if (existing.quantityKind !== item.quantityKind) {
        existing.quantityKind = "estimate";
      }
    }
  }

  return {
    items: [...byKey.values()].sort((a, b) => b.confidence - a.confidence),
    notes: notes.join(" "),
  };
}
