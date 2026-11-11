/**
 * Architectural 4K Vector (3840x2160 SVG) & Compressed Downloadable PNG Wallpapers
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * 8 Sovereign Wallpapers (zero SaaS purple-pink slop gradients):
 * 1. aphrody-m3-aurora       (Google M3 Cobalt & Deep Sapphire tonal wave)
 * 2. fluent-mica-slate       (Win11 Fluent 2 Mica obsidian & sky glass planes)
 * 3. cachyos-bore-grid       (CachyOS Emerald precision scheduler drafting grid)
 * 4. omarchy-tokyo-horizon   (Omarchy Tokyo Night indigo & warm dusk horizon)
 * 5. wayland-prism           (WSLg / Hyprland tiling compositor geometric prism)
 * 6. torvalds-monolith       (Monochrome graphite & amber kernel monolith)
 * 7. raptorlake-silicon      (Intel Raptor Lake / Ada sm_89 die floorplan)
 * 8. arctic-topography       (Nordic limestone & glacier contour lines)
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { encodePngRgba } from "./png-encoder.ts";

export interface WallpaperSpec {
  id: string;
  title: string;
  bgStart: [number, number, number];
  bgEnd: [number, number, number];
  accentA: [number, number, number];
  accentB: [number, number, number];
  motif:
    | "aurora"
    | "mica"
    | "grid"
    | "horizon"
    | "prism"
    | "monolith"
    | "silicon"
    | "topo";
}

export const WALLPAPER_SPECS: WallpaperSpec[] = [
  {
    id: "aphrody-m3-aurora",
    title: "Aphrody Material 3 Cobalt Aurora",
    bgStart: [10, 16, 29],
    bgEnd: [19, 34, 62],
    accentA: [26, 115, 232],
    accentB: [52, 168, 83],
    motif: "aurora",
  },
  {
    id: "fluent-mica-slate",
    title: "Fluent 2 Mica Slate",
    bgStart: [18, 21, 26],
    bgEnd: [32, 38, 46],
    accentA: [96, 205, 255],
    accentB: [138, 180, 248],
    motif: "mica",
  },
  {
    id: "cachyos-bore-grid",
    title: "CachyOS BORE Scheduler Grid",
    bgStart: [7, 15, 17],
    bgEnd: [14, 31, 35],
    accentA: [0, 204, 136],
    accentB: [6, 182, 212],
    motif: "grid",
  },
  {
    id: "omarchy-tokyo-horizon",
    title: "Omarchy Tokyo Night Horizon",
    bgStart: [19, 20, 28],
    bgEnd: [36, 40, 59],
    accentA: [122, 162, 247],
    accentB: [224, 175, 104],
    motif: "horizon",
  },
  {
    id: "wayland-prism",
    title: "Wayland Tiling Compositor Prism",
    bgStart: [13, 17, 23],
    bgEnd: [24, 32, 44],
    accentA: [56, 189, 248],
    accentB: [16, 185, 129],
    motif: "prism",
  },
  {
    id: "torvalds-monolith",
    title: "Torvalds Kernel Monolith",
    bgStart: [14, 14, 15],
    bgEnd: [28, 29, 32],
    accentA: [230, 142, 13],
    accentB: [212, 190, 152],
    motif: "monolith",
  },
  {
    id: "raptorlake-silicon",
    title: "Raptor Lake & Ada sm_89 Silicon Die",
    bgStart: [8, 14, 24],
    bgEnd: [16, 28, 46],
    accentA: [0, 180, 216],
    accentB: [118, 185, 0],
    motif: "silicon",
  },
  {
    id: "arctic-topography",
    title: "Arctic Limestone Topography",
    bgStart: [239, 242, 246],
    bgEnd: [221, 228, 236],
    accentA: [32, 94, 166],
    accentB: [86, 148, 159],
    motif: "topo",
  },
];

function rgbHex([r, g, b]: [number, number, number]): string {
  return (
    "#" +
    [r, g, b]
      .map((c) =>
        Math.max(0, Math.min(255, Math.round(c)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

export function renderWallpaper4kSvg(spec: WallpaperSpec): string {
  const c0 = rgbHex(spec.bgStart);
  const c1 = rgbHex(spec.bgEnd);
  const a0 = rgbHex(spec.accentA);
  const a1 = rgbHex(spec.accentB);

  let geometry = "";
  switch (spec.motif) {
    case "aurora":
      geometry = `
  <path d="M0 1520 C 960 1240, 1820 1760, 3840 1320 L 3840 2160 L 0 2160 Z" fill="${a0}" fill-opacity="0.18"/>
  <path d="M0 1720 C 1220 1480, 2460 1920, 3840 1580 L 3840 2160 L 0 2160 Z" fill="${a1}" fill-opacity="0.14"/>
  <circle cx="2920" cy="640" r="520" fill="${a0}" fill-opacity="0.10"/>`;
      break;
    case "mica":
      geometry = `
  <rect x="360" y="260" width="1680" height="1040" rx="24" fill="${a0}" fill-opacity="0.06" stroke="${a0}" stroke-opacity="0.22" stroke-width="2"/>
  <rect x="1520" y="720" width="1960" height="1140" rx="24" fill="${a1}" fill-opacity="0.07" stroke="${a1}" stroke-opacity="0.20" stroke-width="2"/>`;
      break;
    case "grid": {
      const lines: string[] = [];
      for (let x = 240; x < 3840; x += 240) {
        lines.push(
          `<line x1="${x}" y1="0" x2="${x}" y2="2160" stroke="${a0}" stroke-opacity="0.09" stroke-width="2"/>`,
        );
      }
      for (let y = 240; y < 2160; y += 240) {
        lines.push(
          `<line x1="0" y1="${y}" x2="3840" y2="${y}" stroke="${a1}" stroke-opacity="0.09" stroke-width="2"/>`,
        );
      }
      lines.push(
        `<circle cx="1920" cy="1080" r="480" fill="none" stroke="${a0}" stroke-opacity="0.32" stroke-width="4"/>`,
      );
      lines.push(
        `<circle cx="1920" cy="1080" r="240" fill="none" stroke="${a1}" stroke-opacity="0.45" stroke-width="3"/>`,
      );
      geometry = lines.join("\n  ");
      break;
    }
    case "horizon":
      geometry = `
  <circle cx="1920" cy="1280" r="460" fill="${a1}" fill-opacity="0.20"/>
  <path d="M0 1420 L920 1120 L1680 1360 L2540 1040 L3320 1310 L3840 1180 L3840 2160 L0 2160 Z" fill="${c0}" fill-opacity="0.88"/>
  <line x1="0" y1="1420" x2="3840" y2="1420" stroke="${a0}" stroke-opacity="0.35" stroke-width="3"/>`;
      break;
    case "prism":
      geometry = `
  <polygon points="1920,340 2640,1640 1200,1640" fill="${a0}" fill-opacity="0.12" stroke="${a0}" stroke-opacity="0.55" stroke-width="4"/>
  <polygon points="1920,560 2420,1520 1420,1520" fill="${a1}" fill-opacity="0.10" stroke="${a1}" stroke-opacity="0.45" stroke-width="3"/>`;
      break;
    case "monolith":
      geometry = `
  <rect x="1640" y="280" width="560" height="1600" fill="${c0}" stroke="${a0}" stroke-opacity="0.65" stroke-width="4"/>
  <line x1="1920" y1="280" x2="1920" y2="1880" stroke="${a1}" stroke-opacity="0.25" stroke-width="2"/>`;
      break;
    case "silicon": {
      const blocks: string[] = [];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
          const bx = 540 + col * 460;
          const by = 340 + row * 380;
          const stroke = (row + col) % 2 === 0 ? a0 : a1;
          blocks.push(
            `<rect x="${bx}" y="${by}" width="400" height="320" rx="8" fill="${stroke}" fill-opacity="0.07" stroke="${stroke}" stroke-opacity="0.38" stroke-width="3"/>`,
          );
        }
      }
      geometry = blocks.join("\n  ");
      break;
    }
    case "topo":
      geometry = `
  <ellipse cx="1920" cy="1080" rx="1480" ry="780" fill="none" stroke="${a0}" stroke-opacity="0.22" stroke-width="3"/>
  <ellipse cx="1920" cy="1080" rx="1120" ry="580" fill="none" stroke="${a1}" stroke-opacity="0.28" stroke-width="3"/>
  <ellipse cx="1920" cy="1080" rx="760" ry="380" fill="none" stroke="${a0}" stroke-opacity="0.34" stroke-width="3"/>
  <ellipse cx="1920" cy="1080" rx="400" ry="190" fill="none" stroke="${a1}" stroke-opacity="0.42" stroke-width="3"/>`;
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2160" width="3840" height="2160">
  <title>${spec.title}</title>
  <defs>
    <linearGradient id="bg-${spec.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c0}"/>
      <stop offset="100%" stop-color="${c1}"/>
    </linearGradient>
  </defs>
  <rect width="3840" height="2160" fill="url(#bg-${spec.id})"/>
  ${geometry.trim()}
</svg>
`;
}

/**
 * Render a crisp 16:9 widescreen raster PNG wallpaper (640x360 clean mathematical rasterization)
 * compressed with zlib level 9 so generation stays sub-50ms while producing real downloadable PNGs.
 */
export function renderWallpaperRasterPng(
  spec: WallpaperSpec,
  width = 640,
  height = 360,
): Uint8Array {
  const rgba = new Uint8Array(width * height * 4);
  const [r0, g0, b0] = spec.bgStart;
  const [r1, g1, b1] = spec.bgEnd;
  const [ar, ag, ab] = spec.accentA;
  const [br, bg, bb] = spec.accentB;

  const cx = width * 0.5;
  const cy = height * 0.5;

  for (let y = 0; y < height; y++) {
    const ny = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const nx = x / (width - 1);
      const t = nx * 0.55 + ny * 0.45;

      let r = r0 + (r1 - r0) * t;
      let g = g0 + (g1 - g0) * t;
      let b = b0 + (b1 - b0) * t;

      if (spec.motif === "aurora") {
        const wave = 0.68 + 0.08 * Math.sin(nx * Math.PI * 2.5);
        if (ny > wave) {
          const alpha = Math.min(0.28, (ny - wave) * 0.9);
          r = r * (1 - alpha) + ar * alpha;
          g = g * (1 - alpha) + ag * alpha;
          b = b * (1 - alpha) + ab * alpha;
        }
      } else if (spec.motif === "grid" || spec.motif === "silicon") {
        const step = spec.motif === "grid" ? 40 : 64;
        if (x % step === 0 || y % step === 0) {
          r = r * 0.72 + ar * 0.28;
          g = g * 0.72 + ag * 0.28;
          b = b * 0.72 + ab * 0.28;
        }
      } else if (spec.motif === "monolith") {
        if (Math.abs(x - cx) < width * 0.08 && ny > 0.14 && ny < 0.86) {
          const edge = Math.abs(Math.abs(x - cx) - width * 0.08) < 2;
          const mix = edge ? 0.65 : 0.12;
          r = r * (1 - mix) + ar * mix;
          g = g * (1 - mix) + ag * mix;
          b = b * (1 - mix) + ab * mix;
        }
      } else {
        const dx = (x - cx) / width;
        const dy = (y - cy) / height;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ring = Math.abs(((dist * 10) % 1) - 0.5) < 0.03 ? 0.25 : 0.0;
        if (ring > 0) {
          r = r * (1 - ring) + br * ring;
          g = g * (1 - ring) + bg * ring;
          b = b * (1 - ring) + bb * ring;
        }
      }

      const idx = (y * width + x) * 4;
      rgba[idx] = Math.max(0, Math.min(255, Math.round(r)));
      rgba[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
      rgba[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
      rgba[idx + 3] = 255;
    }
  }

  return encodePngRgba(width, height, rgba);
}

export function generateWallpaperAssets(outDir: string): {
  files: string[];
  wallpaperCount: number;
} {
  const wpDir = join(outDir, "wallpapers");
  mkdirSync(wpDir, { recursive: true });

  const written: string[] = [];
  for (const spec of WALLPAPER_SPECS) {
    const svg = renderWallpaper4kSvg(spec);
    const svgPath = join(wpDir, `${spec.id}.svg`);
    writeFileSync(svgPath, svg, "utf8");
    written.push(svgPath);

    const pngBytes = renderWallpaperRasterPng(spec, 640, 360);
    const pngPath = join(wpDir, `${spec.id}.png`);
    writeFileSync(pngPath, pngBytes);
    written.push(pngPath);
  }

  return { files: written, wallpaperCount: WALLPAPER_SPECS.length };
}
