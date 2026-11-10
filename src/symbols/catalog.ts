/**
 * Material Symbols Vector Catalog & Inline SVG Generator
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Coordinate space: standard crisp Google Material Symbols viewBox="0 -960 960 960"
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export interface SymbolDescriptor {
  name: string;
  style: "outlined" | "rounded" | "sharp";
  fill: 0 | 1;
  weight: number;
  size: 20 | 24 | 40 | 48;
  svgPath: string;
}

export interface SymbolSearchResult {
  name: string;
  category: string;
  availableStyles: string[];
  svg: string;
}

const UPSTREAM_SYMBOLS_DIR = join(
  import.meta.dir,
  "../../upstream/material-design-icons/symbols/web",
);

/**
 * List available symbols in local sparse repository
 */
export function listAvailableSymbols(): string[] {
  if (!existsSync(UPSTREAM_SYMBOLS_DIR)) {
    return [
      "search",
      "home",
      "settings",
      "mic",
      "photo_camera",
      "apps",
      "dark_mode",
      "palette",
      "terminal",
      "memory",
    ];
  }
  return readdirSync(UPSTREAM_SYMBOLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/**
 * Load raw SVG content for a given symbol
 */
export function getSymbolSvg(
  name: string,
  style: "outlined" | "rounded" | "sharp" = "outlined",
  size: 20 | 24 | 40 | 48 = 24,
  fill: 0 | 1 = 0,
): string {
  const styleDir = `materialsymbols${style}`;
  const fillSuffix = fill === 1 ? "fill1_" : "";
  const fileName = `${name}_${fillSuffix}${size}px.svg`;
  const fullPath = join(UPSTREAM_SYMBOLS_DIR, name, styleDir, fileName);

  if (existsSync(fullPath)) {
    return readFileSync(fullPath, "utf8").trim();
  }

  // Fallback to default 24px outlined or synthesized standard M3 path
  const fallbackPath = join(
    UPSTREAM_SYMBOLS_DIR,
    name,
    "materialsymbolsoutlined",
    `${name}_24px.svg`,
  );
  if (existsSync(fallbackPath)) {
    return readFileSync(fallbackPath, "utf8").trim();
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" height="${size}" viewBox="0 -960 960 960" width="${size}" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>`;
}

/**
 * Search symbols matching query substring
 */
export function searchSymbols(query = ""): SymbolSearchResult[] {
  const all = listAvailableSymbols();
  const q = query.trim().toLowerCase();
  const filtered = q ? all.filter((s) => s.toLowerCase().includes(q)) : all;

  return filtered.map((name) => ({
    name,
    category: "system",
    availableStyles: ["outlined", "rounded", "sharp"],
    svg: getSymbolSvg(name, "outlined", 24, 0),
  }));
}
