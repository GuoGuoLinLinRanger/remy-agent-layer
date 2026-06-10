/**
 * CLI: detect ingredients in one or more images.
 *
 *   npm run detect -- path/to/fridge.jpg
 *   npm run detect -- a.jpg b.jpg --merge
 *   npm run detect -- fridge.jpg --json > inventory.json
 *
 * With no ANTHROPIC_API_KEY set, it uses the offline mock detector so you can
 * try the whole flow immediately.
 */
import "./env.js";
import { detectorFromEnv, loadImage } from "./detector.js";
import { mergeInventories, type DetectionResult, type DetectionRun } from "./types.js";

interface Args {
  paths: string[];
  json: boolean;
  merge: boolean;
}

function parseArgs(argv: string[]): Args {
  const paths: string[] = [];
  let json = false;
  let merge = false;
  for (const a of argv) {
    if (a === "--json") json = true;
    else if (a === "--merge") merge = true;
    else if (a.startsWith("--")) throw new Error(`Unknown flag: ${a}`);
    else paths.push(a);
  }
  return { paths, json, merge };
}

function printTable(result: DetectionResult): void {
  if (result.items.length === 0) {
    console.log("  (no ingredients detected)");
  }
  for (const item of result.items) {
    const qty =
      item.quantityKind === "unknown"
        ? "?".padStart(7)
        : `${item.quantity} ${item.unit}`.padStart(7);
    const conf = `${Math.round(item.confidence * 100)}%`.padStart(4);
    const flag = item.quantityKind === "estimate" ? "~" : " ";
    console.log(
      `  ${conf}  ${flag}${qty}  ${item.name}  ${dim(`[${item.category}]`)}`,
    );
  }
  if (result.notes.trim()) console.log(dim(`\n  note: ${result.notes.trim()}`));
}

function dim(s: string): string {
  return `\x1b[2m${s}\x1b[0m`;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.paths.length === 0) {
    console.error(
      "usage: npm run detect -- <image> [more images...] [--merge] [--json]",
    );
    process.exit(1);
  }

  const detector = detectorFromEnv();
  if (!args.json) console.error(dim(`detector: ${detector.name}\n`));

  const runs: DetectionRun[] = [];
  for (const path of args.paths) {
    const image = await loadImage(path);
    runs.push(await detector.detect(image));
  }

  if (args.json) {
    const payload = args.merge
      ? { merged: mergeInventories(runs.map((r) => r.result)), runs }
      : { runs };
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  for (const run of runs) {
    const { meta } = run;
    const cost = meta.usage
      ? `, ${meta.usage.inputTokens}->${meta.usage.outputTokens} tok`
      : "";
    console.log(`${meta.label ?? "image"}  ${dim(`(${meta.elapsedMs}ms${cost})`)}`);
    printTable(run.result);
    console.log("");
  }

  if (args.merge && runs.length > 1) {
    console.log("merged inventory:");
    printTable(mergeInventories(runs.map((r) => r.result)));
  }
}

main().catch((err) => {
  console.error(`\nerror: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
