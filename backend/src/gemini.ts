import type { ZodType } from "zod";

/**
 * Thin helper around Google's Gemini `generateContent` endpoint, using raw fetch
 * (no SDK) so it stays dependency-free and runs anywhere with global fetch —
 * Node 20+, Cloudflare Workers, Deno, etc.
 *
 * The KEY lives on the server, never in the client app. Users hit your backend;
 * your backend holds one Gemini key and calls this. Gemini's free tier covers a
 * deployed MVP's traffic at $0.
 */
export const GEMINI_DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

export interface GeminiCall {
  apiKey: string;
  model: string;
  systemInstruction: string;
  parts: GeminiPart[];
  /** Gemini-format response schema (types are UPPERCASE: OBJECT/ARRAY/STRING…). */
  responseSchema: Record<string, unknown>;
  /** Injectable for tests; defaults to global fetch. */
  fetchFn?: typeof fetch;
}

export interface GeminiResult<T> {
  value: T;
  usage: { inputTokens: number; outputTokens: number };
}

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/** Call Gemini, get back JSON text + token usage. */
async function geminiGenerateJson(
  call: GeminiCall,
): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
  const fetchFn = call.fetchFn ?? fetch;
  const res = await fetchFn(`${BASE_URL}/${call.model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": call.apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: call.systemInstruction }] },
      contents: [{ role: "user", parts: call.parts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: call.responseSchema,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as GeminiResponse;
  const candidate = data.candidates?.[0];
  const text =
    candidate?.content?.parts
      ?.map((p) => p.text)
      .filter((t): t is string => typeof t === "string")
      .join("") ?? "";

  if (!text) {
    throw new Error(
      `Gemini returned no JSON (finishReason=${candidate?.finishReason ?? "unknown"}).`,
    );
  }

  const um = data.usageMetadata ?? {};
  return {
    text,
    usage: {
      inputTokens: um.promptTokenCount ?? 0,
      outputTokens: um.candidatesTokenCount ?? 0,
    },
  };
}

/** Call Gemini for structured JSON and validate it with a Zod schema. */
export async function geminiStructured<T>(
  schema: ZodType<T>,
  call: GeminiCall,
): Promise<GeminiResult<T>> {
  const { text, usage } = await geminiGenerateJson(call);
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON output: ${text.slice(0, 200)}`);
  }
  // responseSchema is advisory; Zod is the real guarantee.
  return { value: schema.parse(json), usage };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
}
