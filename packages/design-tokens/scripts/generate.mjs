// Token generation script — outputs CSS custom properties, SCSS vars, and JSON
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "dist");

mkdirSync(outDir, { recursive: true });

function flattenObject(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// Import tokens dynamically
const { tokens } = await import("../dist/index.mjs");

const flat = flattenObject(tokens);

// Generate CSS custom properties
const cssLines = [":root {"];
for (const [key, value] of Object.entries(flat)) {
  cssLines.push(`  --fos-${key}: ${value};`);
}
cssLines.push("}");
writeFileSync(join(outDir, "tokens.css"), cssLines.join("\n"), "utf-8");

// Generate SCSS variables
const scssLines = [];
for (const [key, value] of Object.entries(flat)) {
  scssLines.push(`$fos-${key}: ${value};`);
}
writeFileSync(join(outDir, "tokens.scss"), scssLines.join("\n"), "utf-8");

// Generate JSON
writeFileSync(join(outDir, "tokens.json"), JSON.stringify(flat, null, 2), "utf-8");

console.log("✅ Design tokens generated: CSS, SCSS, JSON");
