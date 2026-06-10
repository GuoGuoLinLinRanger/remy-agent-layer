import { test } from "node:test";
import assert from "node:assert/strict";
import { MockDetector } from "../src/detectors/mock.js";
import { imageFromBuffer } from "../src/detector.js";
import {
  DetectionResultSchema,
  mergeInventories,
  type ImageInput,
} from "../src/types.js";
import { generateRecipe, RecipeSchema } from "../src/recipe.js";

function fakeImage(seed: string): ImageInput {
  // The mock hashes the base64 bytes, so different seeds -> different fixtures.
  return imageFromBuffer(Buffer.from(seed.repeat(64)), "image/jpeg", `${seed}.jpg`);
}

test("mock detector returns schema-valid inventory", async () => {
  const run = await new MockDetector().detect(fakeImage("a"));
  assert.doesNotThrow(() => DetectionResultSchema.parse(run.result));
  assert.ok(run.result.items.length > 0);
  assert.equal(run.meta.detector, "mock");
});

test("mock detector is deterministic per image", async () => {
  const det = new MockDetector();
  const a1 = await det.detect(fakeImage("same"));
  const a2 = await det.detect(fakeImage("same"));
  assert.deepEqual(a1.result, a2.result);
});

test("different images can yield different inventories", async () => {
  const det = new MockDetector();
  const seen = new Set<string>();
  for (const seed of ["a", "b", "c", "d", "e", "f"]) {
    const run = await det.detect(fakeImage(seed));
    seen.add(JSON.stringify(run.result.items.map((i) => i.name)));
  }
  assert.ok(seen.size > 1, "expected fixture variety across images");
});

test("confidence and quantity are within sane bounds", async () => {
  const run = await new MockDetector().detect(fakeImage("a"));
  for (const item of run.result.items) {
    assert.ok(item.confidence >= 0 && item.confidence <= 1, item.name);
    assert.ok(item.quantity >= 0, item.name);
    if (item.quantityKind === "unknown") assert.equal(item.quantity, 0);
  }
});

test("mergeInventories sums quantities and dedupes by name+unit", () => {
  const merged = mergeInventories([
    {
      items: [
        { name: "egg", quantity: 6, unit: "count", quantityKind: "exact", category: "dairy", confidence: 0.9 },
        { name: "milk", quantity: 1, unit: "carton", quantityKind: "exact", category: "dairy", confidence: 0.8 },
      ],
      notes: "fridge",
    },
    {
      items: [
        { name: "egg", quantity: 4, unit: "count", quantityKind: "exact", category: "dairy", confidence: 0.95 },
      ],
      notes: "counter",
    },
  ]);

  const egg = merged.items.find((i) => i.name === "egg");
  assert.ok(egg);
  assert.equal(egg.quantity, 10, "egg quantities should sum");
  assert.equal(egg.confidence, 0.95, "should keep the higher confidence");
  assert.equal(merged.items.length, 2, "egg+milk, not three rows");
  assert.match(merged.notes, /fridge/);
  assert.match(merged.notes, /counter/);
});

test("offline recipe generation produces a schema-valid recipe", async () => {
  const inventory = (await new MockDetector().detect(fakeImage("a"))).result;
  const recipe = await generateRecipe(inventory, { mock: true });
  assert.doesNotThrow(() => RecipeSchema.parse(recipe));
  assert.ok(recipe.steps.length > 0);
  assert.ok(recipe.usesFromInventory.length > 0);
});
