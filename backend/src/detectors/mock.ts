import {
  type Detector,
  type DetectionResult,
  type DetectionRun,
  type ImageInput,
} from "../types.js";

/**
 * Offline detector. Returns deterministic fixture data so the entire pipeline —
 * CLI, server, recipe generation, tests — runs with zero API cost and no key.
 *
 * Determinism trick: we pick a fixture based on a cheap hash of the image bytes,
 * so the same image always yields the same inventory (good for snapshot tests),
 * but different images yield different inventories (good for demos).
 */
export class MockDetector implements Detector {
  readonly name = "mock";

  async detect(image: ImageInput): Promise<DetectionRun> {
    const start = performance.now();
    const idx = hashString(image.base64) % FIXTURES.length;
    const result: DetectionResult = structuredClone(FIXTURES[idx]!);
    return {
      result,
      meta: {
        detector: this.name,
        label: image.label,
        elapsedMs: Math.round(performance.now() - start),
      },
    };
  }
}

function hashString(s: string): number {
  let h = 2166136261;
  // Sample up to 4KB so large images stay fast; enough entropy to vary fixtures.
  const n = Math.min(s.length, 4096);
  for (let i = 0; i < n; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const FIXTURES: DetectionResult[] = [
  {
    items: [
      { name: "roma tomato", quantity: 4, unit: "count", quantityKind: "exact", category: "produce", confidence: 0.94 },
      { name: "yellow onion", quantity: 2, unit: "count", quantityKind: "exact", category: "produce", confidence: 0.9 },
      { name: "garlic", quantity: 1, unit: "head", quantityKind: "estimate", category: "produce", confidence: 0.82 },
      { name: "spaghetti", quantity: 500, unit: "g", quantityKind: "estimate", category: "grain", confidence: 0.88 },
      { name: "olive oil", quantity: 750, unit: "ml", quantityKind: "estimate", category: "condiment", confidence: 0.8 },
      { name: "parmesan", quantity: 200, unit: "g", quantityKind: "estimate", category: "dairy", confidence: 0.71 },
      { name: "basil", quantity: 1, unit: "bunch", quantityKind: "estimate", category: "produce", confidence: 0.66 },
    ],
    notes: "Mock inventory #1 (pasta night). Good lighting, all items clearly visible.",
  },
  {
    items: [
      { name: "egg", quantity: 6, unit: "count", quantityKind: "exact", category: "dairy", confidence: 0.96 },
      { name: "whole milk", quantity: 1, unit: "carton", quantityKind: "exact", category: "dairy", confidence: 0.91 },
      { name: "butter", quantity: 250, unit: "g", quantityKind: "estimate", category: "dairy", confidence: 0.85 },
      { name: "all-purpose flour", quantity: 1000, unit: "g", quantityKind: "estimate", category: "pantry", confidence: 0.8 },
      { name: "banana", quantity: 3, unit: "count", quantityKind: "exact", category: "produce", confidence: 0.93 },
      { name: "maple syrup", quantity: 0, unit: "ml", quantityKind: "unknown", category: "condiment", confidence: 0.55 },
    ],
    notes: "Mock inventory #2 (breakfast). Maple syrup bottle is opaque — amount unknown.",
  },
  {
    items: [
      { name: "chicken breast", quantity: 2, unit: "count", quantityKind: "exact", category: "meat", confidence: 0.89 },
      { name: "bell pepper", quantity: 3, unit: "count", quantityKind: "exact", category: "produce", confidence: 0.92 },
      { name: "jasmine rice", quantity: 800, unit: "g", quantityKind: "estimate", category: "grain", confidence: 0.84 },
      { name: "soy sauce", quantity: 300, unit: "ml", quantityKind: "estimate", category: "condiment", confidence: 0.78 },
      { name: "ginger", quantity: 50, unit: "g", quantityKind: "estimate", category: "produce", confidence: 0.6 },
      { name: "green onion", quantity: 1, unit: "bunch", quantityKind: "estimate", category: "produce", confidence: 0.7 },
    ],
    notes: "Mock inventory #3 (stir-fry). Back of fridge partially occluded.",
  },
];
