/**
 * Fails when lib/brand.ts and app/globals.css disagree about a colour.
 *
 * Run with: npm run verify:brand
 *
 * The palette has to exist twice — Tailwind needs the values as custom
 * properties at stylesheet-parse time, while Satori (the OpenGraph images)
 * and the web manifest need literals in TypeScript and can read no CSS at
 * all. Neither side can be generated from the other without adding a build
 * step, so the duplication is real.
 *
 * What can be removed is the *silence*. Left unchecked, changing a brand
 * colour in one place and not the other produces no error and no failed
 * build — just social cards and an app icon quietly serving the old brand,
 * which is the kind of thing nobody notices for weeks. This makes that
 * mismatch loud.
 */
import { readFileSync } from "node:fs";
import { brand, brandDark } from "../lib/brand.ts";

const CSS_PATH = new URL("../app/globals.css", import.meta.url);
const css = readFileSync(CSS_PATH, "utf8");

/** The declarations inside one CSS block, e.g. `:root` or `.dark`. */
function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) {
    console.error(`Could not find a "${selector}" block in app/globals.css.`);
    process.exit(1);
  }
  const end = css.indexOf("}", start);
  return css.slice(start, end);
}

let failures = 0;

function compare(source: string, declarations: string, expected: Record<string, string>) {
  for (const [name, value] of Object.entries(expected)) {
    const match = declarations.match(new RegExp(`--${name}:\\s*([^;]+);`));
    const found = match?.[1]?.trim();

    if (!found) {
      failures++;
      console.log(` MISSING  --${name} is not declared in ${source}`);
    } else if (found.toLowerCase() !== value.toLowerCase()) {
      failures++;
      console.log(` DRIFT    --${name}: ${source} has ${found}, lib/brand.ts has ${value}`);
    } else {
      console.log(`   ok     --${name} ${value}`);
    }
  }
}

console.log("\nglobals.css :root  vs  brand");
compare(":root", block(":root"), brand);

console.log("\nglobals.css .dark  vs  brandDark");
compare(".dark", block(".dark"), brandDark);

console.log(
  failures === 0
    ? "\nPalette is in sync.\n"
    : `\n${failures} mismatch(es). Update lib/brand.ts and app/globals.css together.\n`,
);
process.exit(failures === 0 ? 0 : 1);
