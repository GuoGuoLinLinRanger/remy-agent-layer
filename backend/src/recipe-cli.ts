/**
 * End-to-end Part 1: image(s) -> inventory -> a recipe you can make now.
 *
 *   npm run recipe -- fridge.jpg
 *   npm run recipe -- fridge.jpg counter.jpg --pref "vegetarian, under 20 min"
 *   npm run recipe -- fridge.jpg --json
 */
import "./env.js";
import { detectorFromEnv, loadImage } from "./detector.js";
import { mergeInventories } from "./types.js";
import { generateRecipe } from "./recipe.js";

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const paths: string[] = [];
  let json = false;
  let preference: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--json") json = true;
    else if (a === "--pref" || a === "--preference") preference = argv[++i];
    else if (a.startsWith("--")) throw new Error(`Unknown flag: ${a}`);
    else paths.push(a);
  }
  if (paths.length === 0) {
    console.error('usage: npm run recipe -- <image> [more...] [--pref "..."] [--json]');
    process.exit(1);
  }

  const detector = detectorFromEnv();
  const runs = [];
  for (const path of paths) runs.push(await detector.detect(await loadImage(path)));
  const inventory = mergeInventories(runs.map((r) => r.result));

  const recipe = await generateRecipe(inventory, { preference });

  if (json) {
    console.log(JSON.stringify({ inventory, recipe }, null, 2));
    return;
  }

  const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
  const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

  console.log(dim(`detector: ${detector.name}  |  ${inventory.items.length} ingredients on hand\n`));
  console.log(bold(recipe.title));
  console.log(recipe.description);
  console.log(dim(`\nserves ${recipe.servings}  •  ~${recipe.timeMinutes} min`));
  console.log(`\nuses: ${recipe.usesFromInventory.join(", ")}`);
  console.log(dim(`assumes you have: ${recipe.pantryAssumptions.join(", ")}`));
  if (recipe.missingButRecommended.length) {
    console.log("\nworth grabbing:");
    for (const m of recipe.missingButRecommended) console.log(`  • ${m.name} — ${m.why}`);
  }
  console.log("\nsteps:");
  recipe.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
}

main().catch((err) => {
  console.error(`\nerror: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
