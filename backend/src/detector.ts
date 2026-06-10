import { readFile } from "node:fs/promises";
import { extname, basename } from "node:path";
import {
  SUPPORTED_MEDIA_TYPES,
  type Detector,
  type ImageInput,
  type SupportedMediaType,
} from "./types.js";
import { ClaudeVisionDetector } from "./detectors/claudeVision.js";
import { GeminiDetector } from "./detectors/gemini.js";
import { MockDetector } from "./detectors/mock.js";

export { ClaudeVisionDetector } from "./detectors/claudeVision.js";
export { GeminiDetector } from "./detectors/gemini.js";
export { MockDetector } from "./detectors/mock.js";

const EXT_TO_MEDIA: Record<string, SupportedMediaType> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

/**
 * Pick a detector from the environment. Explicit REMY_DETECTOR wins; otherwise
 * prefer Gemini (free tier) then Claude based on which key is present, and fall
 * back to the offline mock so the project always runs out of the box.
 */
export function detectorFromEnv(): Detector {
  const choice = (process.env.REMY_DETECTOR || "").toLowerCase();
  if (choice === "mock") return new MockDetector();
  if (choice === "gemini") return new GeminiDetector();
  if (choice === "claude") return new ClaudeVisionDetector();
  if (process.env.GEMINI_API_KEY) return new GeminiDetector();
  if (process.env.ANTHROPIC_API_KEY) return new ClaudeVisionDetector();
  return new MockDetector();
}

/** Load an image file from disk into the ImageInput shape. */
export async function loadImage(path: string): Promise<ImageInput> {
  const ext = extname(path).toLowerCase();
  const mediaType = EXT_TO_MEDIA[ext];
  if (!mediaType) {
    throw new Error(
      `Unsupported image type "${ext || "(none)"}" for ${path}. ` +
        `Supported: ${SUPPORTED_MEDIA_TYPES.join(", ")}.`,
    );
  }
  const bytes = await readFile(path);
  return { base64: bytes.toString("base64"), mediaType, label: basename(path) };
}

/** Build an ImageInput from an in-memory buffer (used by the HTTP server). */
export function imageFromBuffer(
  buf: Buffer,
  mediaType: SupportedMediaType,
  label?: string,
): ImageInput {
  return { base64: buf.toString("base64"), mediaType, label };
}
