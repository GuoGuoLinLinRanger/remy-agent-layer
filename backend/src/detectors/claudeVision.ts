import Anthropic from "@anthropic-ai/sdk";
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
import { runStructuredTool } from "../structured.js";

export const DEFAULT_MODEL = process.env.REMY_MODEL || "claude-opus-4-8";

/** JSON Schema mirror of DetectionResultSchema, used as the tool input schema. */
const INVENTORY_TOOL_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Canonical lowercase ingredient name." },
          quantity: { type: "number", description: "Amount; 0 when quantityKind is unknown." },
          unit: { type: "string", description: 'e.g. "count", "g", "ml", "bunch", "clove".' },
          quantityKind: { type: "string", enum: [...QUANTITY_KINDS] },
          category: { type: "string", enum: [...CATEGORIES] },
          confidence: { type: "number", description: "0..1 confidence." },
        },
        required: ["name", "quantity", "unit", "quantityKind", "category", "confidence"],
      },
    },
    notes: { type: "string", description: "Observations: lighting, occluded items, uncertainty." },
  },
  required: ["items", "notes"],
} as const;

export interface ClaudeVisionOptions {
  client?: Anthropic;
  model?: string;
  maxTokens?: number;
}

/**
 * Real detector: sends the image to Claude's vision API and gets back a
 * Zod-validated inventory via forced tool use.
 */
export class ClaudeVisionDetector implements Detector {
  readonly name = "claude-vision";
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor(opts: ClaudeVisionOptions = {}) {
    // The SDK reads ANTHROPIC_API_KEY from the environment by default.
    this.client = opts.client ?? new Anthropic();
    this.model = opts.model ?? DEFAULT_MODEL;
    this.maxTokens = opts.maxTokens ?? 4096;
  }

  async detect(image: ImageInput): Promise<DetectionRun> {
    const start = performance.now();

    const { value, usage } = await runStructuredTool(DetectionResultSchema, {
      client: this.client,
      model: this.model,
      maxTokens: this.maxTokens,
      system: DETECTION_SYSTEM_PROMPT,
      userContent: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: image.mediaType,
            data: image.base64,
          },
        },
        { type: "text", text: DETECTION_USER_INSTRUCTION },
      ],
      toolName: "report_inventory",
      toolDescription:
        "Report the full inventory of food ingredients and cooking items visible in the image.",
      inputSchema: INVENTORY_TOOL_SCHEMA,
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
