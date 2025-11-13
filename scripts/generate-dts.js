// scripts/generate-dts.js
// Usage: node scripts/generate-dts.js
const fs = require("fs");
const path = require("path");

const iconsDir = path.join(__dirname, "..", "icons"); // adjust if icons are elsewhere
const outPath = path.join(__dirname, "..", "index.d.ts");

if (!fs.existsSync(iconsDir)) {
  console.error("icons directory not found:", iconsDir);
  process.exit(1);
}

function toExportName(fileBase) {
  // fileBase examples: "uil-0-plus", "500px", "arrow-right", "uil-arrow-right"
  // 1) remove extension already done before calling
  // 2) remove a leading "uil-" if present (we'll re-add "Uil" later to normalize)
  let name = fileBase.replace(/^uil[-_]?/i, "");

  // split on non-alphanumeric characters
  const parts = name.split(/[^0-9a-zA-Z]+/).filter(Boolean);

  // capitalize each part (but keep digits as-is)
  const pascal = parts
    .map((p) => {
      if (/^[0-9]+$/.test(p)) return p; // number-only part
      return p.charAt(0).toUpperCase() + p.slice(1);
    })
    .join("");

  let exportName = pascal;

  // ensure it starts with a letter; if it starts with a digit, prefix with 'Uil'
  if (!/^[A-Za-z]/.test(exportName)) {
    exportName = "Uil" + exportName;
  }

  // ensure it starts with Uil (optional but matches community convention)
  if (!/^Uil/.test(exportName)) {
    exportName = "Uil" + exportName;
  }

  // final sanity: remove any characters that are still invalid
  exportName = exportName.replace(/[^0-9A-Za-z_]/g, "");

  return exportName;
}

const files = fs
  .readdirSync(iconsDir, { withFileTypes: true })
  .filter((d) => d.isFile() && /\.(js|cjs|mjs|jsx|ts|tsx)$/.test(d.name))
  .map((d) => d.name.replace(/\.(js|cjs|mjs|jsx|ts|tsx)$/, ""));

// dedupe and map to export names
const mapped = files.map((f) => {
  const exportName = toExportName(f);
  return { file: f, exportName };
});

// build file content
const header = `import * as React from "react";

export interface UniconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: string | number;
  className?: string;
}

export type UniconComponent = React.FC<UniconProps>;

/**
 * Named exports (generated)
 */\n\n`;

const exportLines = mapped.map((m) => `export const ${m.exportName}: UniconComponent;`).join("\n");

const footer = `

/**
 * Default export map (for "import icons from '@iconscout/react-unicons'")
 */
declare const icons: Record<string, UniconComponent>;
export default icons;
`;

const content = header + exportLines + footer;

fs.writeFileSync(outPath, content, "utf8");
console.log("Wrote", outPath, "with", mapped.length, "icons");

// For debugging: print a few mappings:
console.log("Sample mappings:", mapped.slice(0, 12));
