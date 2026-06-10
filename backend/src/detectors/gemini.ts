import {
  CATEGORIES,
  DetectionResultSchema,
  QUANTITY_KINDS,
  type Detector,
  type DetectionRun,
  type ImageInput,
} from "../types.js";
import {
  DETECTION_SYSTEM_PROMPT,
  DETECTION_USER_INSTRUCTION,
} from "../prompt.js";
import { geminiStructured, GEMINI_DEFAULT_MODEL } from "../gemini.js";

/** Gemini-format schema (types are UPPERCASE) mirroring DetectionResultSchema. */
const INVENTORY_GEMINI_SCHEMA = {
  type: "OBJECT",
  properties: {
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          quantity: { type: "NUMBER" },
          unit: { type: "STRING" },
          quantityKind: { type: "STRING", enum: [...QUANTITY_KINDS] },
          category: { type: "STRING", enum: [...CATEGORIES] },
          confidence: { type: "NUMBER" },
        },
        required: ["name", "quantity", "unit", "quantityKind", "category", "confidence"],
        propertyOrdering: ["name", "quantity", "unit", "quantityKind", "category", "confidence"],
      },
    },
    notes: { type: "STRING" },
  },
  required: ["items", "notes"],
  propertyOrdering: ["items", "notes"],
} as const;

export interface GeminiDetectorOptions {
  apiKey?: string;
  model?: string;
  fetchFn?: typeof fetch;
}

/**
 * Free-tier-friendly detector: Google Gemini vision via raw fetch. Holds a
 * single server-side key (GEMINI_API_KEY); end users never need one.
 */
export class GeminiDetector implements Detector {
  readonly name = "gemini-vision";
  private readonly apiKey: string;
  private readonly model: string;
  private readonly fetchFn?: typeof fetch;

  constructor(opts: GeminiDetectorOptions = {}) {
    this.apiKey = opts.apiKey ?? process.env.GEMINI_API_KEY ?? "";
    if (!this.apiKey) {
      throw new Error(
        "GeminiDetector needs a key. Set GEMINI_API_KEY (free at https://aistudio.google.com/apikey).",
      );
    }
    this.model = opts.model ?? GEMINI_DEFAULT_MODEL;
    this.fetchFn = opts.fetchFn;
  }

  async detect(image: ImageInput): Promise<DetectionRun> {
    const start = performance.now();
    const { value, usage } = await geminiStructured(DetectionResultSchema, {
      apiKey: this.apiKey,
      model: this.model,
      fetchFn: this.fetchFn,
      systemInstruction: DETECTION_SYSTEM_PROMPT,
      parts: [
        { inline_data: { mime_type: image.mediaType, data: image.base64 } },
        { text: DETECTION_USER_INSTRUCTION },
      ],
      responseSchema: INVENTORY_GEMINI_SCHEMA,
    });

    return {
      result: value,
      meta: {
        detector: this.name,
        model: this.model,
        label: image.label,
        elapsedMs: Math.round(performance.now() - start),
        usage,
      },
    };
  }
}
