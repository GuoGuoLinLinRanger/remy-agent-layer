/**
 * Minimal HTTP API around the detector + recipe layer, using only Node built-ins
 * so there's nothing extra to install. The Expo app (or curl) can call this.
 *
 *   npm run serve
 *
 *   GET  /health                  -> { ok, detector }
 *   POST /detect                  -> DetectionRun
 *        body: raw image bytes, with Content-Type: image/jpeg|png|gif|webp
 *   POST /recipe                  -> { inventory, recipe }
 *        body: JSON { "inventory": DetectionResult, "preference"?: string }
 *
 * Example:
 *   curl -s --data-binary @fridge.jpg -H "Content-Type: image/jpeg" \
 *     http://localhost:8787/detect | jq
 */
import "./env.js";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { detectorFromEnv, imageFromBuffer } from "./detector.js";
import { generateRecipe } from "./recipe.js";
import {
  DetectionResultSchema,
  SUPPORTED_MEDIA_TYPES,
  type SupportedMediaType,
} from "./types.js";

const PORT = Number(process.env.PORT) || 8787;
const MAX_BODY_BYTES = 25 * 1024 * 1024; // 25 MB — generous for phone photos.
const detector = detectorFromEnv();

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(text),
  });
  res.end(text);
}

function normalizeMediaType(header: string | undefined): SupportedMediaType | null {
  const type = (header ?? "").split(";")[0]!.trim().toLowerCase();
  return (SUPPORTED_MEDIA_TYPES as readonly string[]).includes(type)
    ? (type as SupportedMediaType)
    : null;
}

async function handleDetect(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const mediaType = normalizeMediaType(req.headers["content-type"]);
  if (!mediaType) {
    sendJson(res, 415, {
      error: `Content-Type must be one of: ${SUPPORTED_MEDIA_TYPES.join(", ")}`,
    });
    return;
  }
  const body = await readBody(req);
  if (body.length === 0) {
    sendJson(res, 400, { error: "empty image body" });
    return;
  }
  const run = await detector.detect(imageFromBuffer(body, mediaType));
  sendJson(res, 200, run);
}

async function handleRecipe(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await readBody(req);
  let parsed: unknown;
  try {
    parsed = JSON.parse(body.toString("utf8"));
  } catch {
    sendJson(res, 400, { error: "body must be valid JSON" });
    return;
  }
  const obj = parsed as { inventory?: unknown; preference?: unknown };
  const inventory = DetectionResultSchema.safeParse(obj.inventory);
  if (!inventory.success) {
    sendJson(res, 400, {
      error: "body.inventory must be a DetectionResult",
      details: inventory.error.issues,
    });
    return;
  }
  const recipe = await generateRecipe(inventory.data, {
    preference: typeof obj.preference === "string" ? obj.preference : undefined,
  });
  sendJson(res, 200, { inventory: inventory.data, recipe });
}

const server = createServer((req, res) => {
  const route = `${req.method} ${(req.url ?? "/").split("?")[0]}`;
  const handle = async (): Promise<void> => {
    switch (route) {
      case "GET /health":
        sendJson(res, 200, { ok: true, detector: detector.name });
        return;
      case "POST /detect":
        await handleDetect(req, res);
        return;
      case "POST /recipe":
        await handleRecipe(req, res);
        return;
      default:
        sendJson(res, 404, { error: `no route for ${route}` });
    }
  };
  handle().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    sendJson(res, 500, { error: message });
  });
});

server.listen(PORT, () => {
  console.log(`remy agent layer listening on http://localhost:${PORT}`);
  console.log(`  detector: ${detector.name}`);
  console.log(`  POST /detect  (raw image body)`);
  console.log(`  POST /recipe  (JSON { inventory, preference? })`);
});
