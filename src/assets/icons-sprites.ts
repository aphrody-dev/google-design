/**
 * 32 Crisp Geometric 24x24 Architectural SVG Icons + <symbol> Sprite Sheet & JSON Atlas
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * Strict specification:
 * - viewBox="0 0 24 24", width="24", height="24"
 * - stroke="currentColor", stroke-width="1.75", stroke-linecap="round", stroke-linejoin="round"
 * - Pixel-grid aligned coordinates, zero emojis, CC0-1.0 license
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface ArchitecturalIconDef {
  id: string;
  category: "system" | "creative" | "network" | "interface";
  keywords: string[];
  body: string;
}

export const ARCHITECTURAL_ICONS: ArchitecturalIconDef[] = [
  {
    id: "search",
    category: "interface",
    keywords: ["find", "query", "lookup"],
    body: `<circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/>`,
  },
  {
    id: "terminal",
    category: "system",
    keywords: ["cli", "shell", "tty", "posix"],
    body: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>`,
  },
  {
    id: "kernel",
    category: "system",
    keywords: ["linux", "cpu", "core", "ring0"],
    body: `<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4"/>`,
  },
  {
    id: "wayland",
    category: "system",
    keywords: ["compositor", "window", "tiling", "hyprland"],
    body: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16M12 12h9"/>`,
  },
  {
    id: "gpu",
    category: "system",
    keywords: ["cuda", "webgpu", "shader", "rtx"],
    body: `<rect x="3" y="6" width="18" height="11" rx="2"/><circle cx="9" cy="11.5" r="2.5"/><circle cx="15.5" cy="11.5" r="2.5"/><path d="M6 17v3M10 17v3"/>`,
  },
  {
    id: "package",
    category: "system",
    keywords: ["bun", "module", "archive", "bundle"],
    body: `<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5M16 5.25l-8 4.5"/>`,
  },
  {
    id: "shield",
    category: "system",
    keywords: ["security", "auth", "verify", "sovereign"],
    body: `<path d="M12 3l7 3v5.5c0 4.6-3 8.4-7 9.5-4-1.1-7-4.9-7-9.5V6l7-3z"/><path d="M9 12l2 2 4-4"/>`,
  },
  {
    id: "palette",
    category: "creative",
    keywords: ["color", "hct", "theme", "tokens"],
    body: `<path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h4a5 5 0 0 0 5-5c0-2.2-4-4-9-4z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/>`,
  },
  {
    id: "cube-3d",
    category: "creative",
    keywords: ["gltf", "glb", "mesh", "threejs"],
    body: `<path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3L12 2.5z"/><path d="M12 2.5v9.5M12 12l8.5 4.7M12 12L3.5 16.7"/>`,
  },
  {
    id: "audio",
    category: "creative",
    keywords: ["wav", "sound", "pcm", "waveform"],
    body: `<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4"/>`,
  },
  {
    id: "video",
    category: "creative",
    keywords: ["motion", "canvas", "scene", "stream"],
    body: `<rect x="3" y="5" width="13" height="14" rx="2"/><path d="M16 10l5-3v10l-5-3v-4z"/>`,
  },
  {
    id: "pet",
    category: "creative",
    keywords: ["companion", "sprite", "open-pets", "mascot"],
    body: `<path d="M6 9L4 4l4.5 2.5h7L20 4l-2 5a6 6 0 0 1-12 0z"/><circle cx="9.5" cy="11" r="1"/><circle cx="14.5" cy="11" r="1"/><path d="M10.5 14c1 .8 2 .8 3 0"/>`,
  },
  {
    id: "download",
    category: "interface",
    keywords: ["export", "save", "fetch", "asset"],
    body: `<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M4 19h16"/>`,
  },
  {
    id: "git-merge",
    category: "system",
    keywords: ["branch", "forge", "commit", "jj"],
    body: `<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M6 8.5v7M8.5 6H12a4 4 0 0 1 4 4v-.5"/>`,
  },
  {
    id: "mail",
    category: "network",
    keywords: ["stalwart", "bimi", "smtp", "message"],
    body: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>`,
  },
  {
    id: "cloud",
    category: "network",
    keywords: ["gcp", "mesh", "deploy", "edge"],
    body: `<path d="M6.5 18h11a4.5 4.5 0 0 0 .7-8.95A6 6 0 0 0 6.3 8.2 4 4 0 0 0 6.5 18z"/>`,
  },
  {
    id: "grid",
    category: "creative",
    keywords: ["layout", "spatial", "8dp", "wireframe"],
    body: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`,
  },
  {
    id: "typography",
    category: "creative",
    keywords: ["font", "text", "ofl", "scale"],
    body: `<path d="M4 6V4h16v2M12 4v16M9 20h6"/>`,
  },
  {
    id: "contrast",
    category: "creative",
    keywords: ["wcag", "a11y", "dark-mode", "tone"],
    body: `<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/>`,
  },
  {
    id: "layers",
    category: "creative",
    keywords: ["elevation", "surface", "mica", "stack"],
    body: `<path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z"/><path d="M3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5"/>`,
  },
  {
    id: "sliders",
    category: "interface",
    keywords: ["settings", "controls", "preferences"],
    body: `<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>`,
  },
  {
    id: "code",
    category: "system",
    keywords: ["source", "typescript", "rust", "syntax"],
    body: `<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>`,
  },
  {
    id: "database",
    category: "system",
    keywords: ["sqlite", "sql", "storage", "cache"],
    body: `<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6"/><path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"/>`,
  },
  {
    id: "network-mesh",
    category: "network",
    keywords: ["wireguard", "masque", "vpn", "nodes"],
    body: `<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8M7.2 7.7L11 16.2M16.8 7.7L13 16.2"/>`,
  },
  {
    id: "check-circle",
    category: "interface",
    keywords: ["pass", "verified", "clean", "ok"],
    body: `<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3 4.7-5"/>`,
  },
  {
    id: "alert-triangle",
    category: "interface",
    keywords: ["warning", "violation", "audit"],
    body: `<path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4M12 17h.01"/>`,
  },
  {
    id: "wallpaper",
    category: "creative",
    keywords: ["image", "backdrop", "4k", "canvas"],
    body: `<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 16l-5.5-5.5L7 19"/>`,
  },
  {
    id: "spark-free",
    category: "creative",
    keywords: ["anti-slop", "precision", "compass", "drafting"],
    body: `<circle cx="12" cy="6" r="2"/><path d="M11 8L6 20M13 8l5 12M7.5 15h9"/>`,
  },
  {
    id: "book-spec",
    category: "interface",
    keywords: ["prd", "design-md", "docs", "legal"],
    body: `<path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2V5z"/><path d="M6 18h13M8 7h7M8 11h5"/>`,
  },
  {
    id: "key",
    category: "system",
    keywords: ["oauth", "pkce", "credential", "env"],
    body: `<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L20 3M16 7l3 3M18.5 4.5L21 7"/>`,
  },
  {
    id: "gauge",
    category: "system",
    keywords: ["benchmark", "lighthouse", "wck", "latency"],
    body: `<path d="M4.5 16.5a9 9 0 1 1 15 0"/><path d="M12 13l4-4"/><circle cx="12" cy="13" r="1.5"/>`,
  },
  {
    id: "external-link",
    category: "interface",
    keywords: ["open", "navigate", "url", "share"],
    body: `<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>`,
  },
];

export function renderArchitecturalIconSvg(icon: ArchitecturalIconDef): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.body}</svg>\n`;
}

export function generateIconsAndSpritesAssets(outDir: string): {
  files: string[];
  iconCount: number;
} {
  const iconsDir = join(outDir, "icons");
  const spritesDir = join(outDir, "sprites");
  mkdirSync(iconsDir, { recursive: true });
  mkdirSync(spritesDir, { recursive: true });

  const written: string[] = [];
  const symbols: string[] = [];

  for (const icon of ARCHITECTURAL_ICONS) {
    const svg = renderArchitecturalIconSvg(icon);
    const iconPath = join(iconsDir, `${icon.id}.svg`);
    writeFileSync(iconPath, svg, "utf8");
    written.push(iconPath);

    symbols.push(
      `  <symbol id="icon-${icon.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icon.body}</symbol>`,
    );
  }

  const spriteSvg = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>\n`;
  const spritePath = join(spritesDir, "aphrody-icons.sprite.svg");
  writeFileSync(spritePath, spriteSvg, "utf8");
  written.push(spritePath);

  const atlas = {
    name: "Aphrody Architectural Vector Icon Set",
    version: "2.0.0",
    license: "CC0-1.0",
    viewBox: "0 0 24 24",
    strokeWidth: 1.75,
    count: ARCHITECTURAL_ICONS.length,
    spriteFile: "sprites/aphrody-icons.sprite.svg",
    icons: ARCHITECTURAL_ICONS.map((ic, index) => ({
      id: ic.id,
      symbolId: `icon-${ic.id}`,
      file: `icons/${ic.id}.svg`,
      category: ic.category,
      keywords: ic.keywords,
      index,
    })),
  };
  const atlasPath = join(spritesDir, "aphrody-icons.atlas.json");
  writeFileSync(atlasPath, JSON.stringify(atlas, null, 2), "utf8");
  written.push(atlasPath);

  return { files: written, iconCount: ARCHITECTURAL_ICONS.length };
}
