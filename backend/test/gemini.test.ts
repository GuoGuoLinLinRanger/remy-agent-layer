import { test } from "node:test";
import assert from "node:assert/strict";
import { GeminiDetector } from "../src/detectors/gemini.js";
import { imageFromBuffer } from "../src/detector.js";
import { DetectionResultSchema } from "../src/types.js";

/**
 * Proves the Gemini input -> output path WITHOUT a real key, by injecting a fake
 * fetch that returns a canned Gemini response. Exercises the real request
 * builder, response parser, and Zod validation.
 */

const SAMPLE_INVENTORY = {
  items: [
    { name: "cucumber", quantity: 2, unit: "count", quantityKind: "exact", category: "produce", confidence: 0.9 },
    { name: "feta", quantity: 150, unit: "g", quantityKind: "estimate", category: "dairy", confidence: 0.7 },
  ],
  notes: "Clear shot.",
};

function fakeGeminiFetch(captured: { url?: string; body?: any }): typeof fetch {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    captured.url = String(url);
    captured.body = init?.body ? JSON.parse(String(init.body)) : undefined;
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          candidates: [
            {
              content: { parts: [{ text: JSON.stringify(SAMPLE_INVENTORY) }] },
              finishReason: "STOP",
            },
          ],
          usageMetadata: { promptTokenCount: 321, candidatesTokenCount: 88 },
        };
      },
      async text() {
        return "";
      },
    } as unknown as Response;
  }) as unknown as typeof fetch;
}

test("GeminiDetector parses a response into a schema-valid inventory", async () => {
  const captured: { url?: string; body?: any } = {};
  const det = new GeminiDetector({
    apiKey: "test-key",
    model: "gemini-2.5-flash",
    fetchFn: fakeGeminiFetch(captured),
  });

  const run = await det.detect(
    imageFromBuffer(Buffer.from("fakeimage"), "image/png", "salad.png"),
  );

  assert.doesNotThrow(() => DetectionResultSchema.parse(run.result));
  assert.equal(run.result.items.length, 2);
  assert.equal(run.result.items[0]!.name, "cucumber");
  assert.equal(run.meta.detector, "gemini-vision");
  assert.equal(run.meta.model, "gemini-2.5-flash");
  assert.deepEqual(run.meta.usage, { inputTokens: 321, outputTokens: 88 });
});

test("GeminiDetector sends the image and prompt in the request", async () => {
  const captured: { url?: string; body?: any } = {};
  const det = new GeminiDetector({ apiKey: "test-key", fetchFn: fakeGeminiFetch(captured) });
  await det.detect(imageFromBuffer(Buffer.from("img"), "image/jpeg"));

  assert.match(captured.url ?? "", /gemini-2\.5-flash:generateContent/);
  const parts = captured.body?.contents?.[0]?.parts ?? [];
  const hasImage = parts.some((p: any) => p.inline_data?.mime_type === "image/jpeg");
  const hasText = parts.some((p: any) => typeof p.text === "string");
  assert.ok(hasImage, "request should include the image inline_data");
  assert.ok(hasText, "request should include the text instruction");
  assert.equal(
    captured.body?.generationConfig?.responseMimeType,
    "application/json",
    "should request JSON output",
  );
});

test("GeminiDetector throws a clear error without a key", () => {
  const prev = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    assert.throws(() => new GeminiDetector(), /GEMINI_API_KEY/);
  } finally {
    if (prev !== undefined) process.env.GEMINI_API_KEY = prev;
  }
});
