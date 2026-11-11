/**
 * Open Pets Companion Bank (Real Animated GIF89a + Horizontal SVG/PNG Sprite Sheets + CSS Keyframes + JSON Atlas)
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * 4 Open Pets:
 * 1. aphrody-fox   (Cobalt & Terracotta workstation fox)
 * 2. cachy-lynx    (Emerald & Slate kernel lynx)
 * 3. omarchy-owl   (Tokyo Night indigo & gold nocturnal owl)
 * 4. bun-hare      (Warm cream & amber high-speed hare)
 *
 * Each pet includes 8 crisp pixel-art frames across 4 states:
 * - idle  (frames 0..1)
 * - walk  (frames 2..3)
 * - work  (frames 4..5)
 * - sleep (frames 6..7)
 * Upscaled 4x from 16x16 logical grid -> 64x64 crisp pixels (512x64 horizontal sprite sheet).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { encodeAnimatedGif, type GifPaletteEntry } from "./gif-encoder.ts";
import { encodePngRgba } from "./png-encoder.ts";

export interface OpenPetDefinition {
  id: "aphrody-fox" | "cachy-lynx" | "omarchy-owl" | "bun-hare";
  name: string;
  species: string;
  palette: GifPaletteEntry[];
  /** 16x16 base character grid using characters '.', '1'..'7' */
  baseGrid: string[];
}

const PET_DEFINITIONS: OpenPetDefinition[] = [
  {
    id: "aphrody-fox",
    name: "Aphrody Fox",
    species: "Vulpes Architectus",
    palette: [
      { r: 0, g: 0, b: 0 }, // 0: transparent
      { r: 22, g: 27, b: 34 }, // 1: dark ink outline
      { r: 232, g: 109, b: 56 }, // 2: terracotta coat
      { r: 248, g: 249, b: 250 }, // 3: warm cream chest/muzzle
      { r: 26, g: 115, b: 232 }, // 4: aphrody cobalt collar/visor
      { r: 251, g: 188, b: 4 }, // 5: amber terminal spark
      { r: 52, g: 168, b: 83 }, // 6: emerald active indicator
      { r: 138, g: 180, b: 248 }, // 7: sleep/work indicator
    ],
    baseGrid: [
      "................",
      "..11........11..",
      ".1221......1221.",
      ".12321111112321.",
      ".12222222222221.",
      ".12212222221221.",
      ".12333111133321.",
      "..133333333331..",
      "...1444444441...",
      "..122233332221..",
      ".12222333322221.",
      "132222333322221.",
      "13312222222211..",
      ".11.12211221....",
      "....111..111....",
      "................",
    ],
  },
  {
    id: "cachy-lynx",
    name: "Cachy Lynx",
    species: "Lynx Borealis",
    palette: [
      { r: 0, g: 0, b: 0 }, // 0: transparent
      { r: 11, g: 20, b: 22 }, // 1: deep slate outline
      { r: 0, g: 204, b: 136 }, // 2: cachyos emerald coat
      { r: 226, g: 241, b: 238 }, // 3: ice mint chest
      { r: 6, g: 182, b: 212 }, // 4: cyan collar/tufts
      { r: 245, g: 158, b: 11 }, // 5: golden eyes/spark
      { r: 56, g: 189, b: 248 }, // 6: sky accent
      { r: 148, g: 226, b: 213 }, // 7: soft teal highlight
    ],
    baseGrid: [
      ".1............1.",
      ".141........141.",
      ".1221......1221.",
      ".12221111112221.",
      ".12222222222221.",
      ".12512222225121.",
      ".12233111133221.",
      ".13233333333231.",
      "...1444444441...",
      "..122233332221..",
      "..1222333322221.",
      "..12222222222141",
      "...1222222221.1.",
      "...1221..1221...",
      "...111....111...",
      "................",
    ],
  },
  {
    id: "omarchy-owl",
    name: "Omarchy Owl",
    species: "Strix Nocturna",
    palette: [
      { r: 0, g: 0, b: 0 }, // 0: transparent
      { r: 19, g: 20, b: 28 }, // 1: tokyo night outline
      { r: 122, g: 162, b: 247 }, // 2: indigo plumage
      { r: 192, g: 202, b: 245 }, // 3: starlight breast
      { r: 224, g: 175, b: 104 }, // 4: warm gold beak/talons
      { r: 158, g: 206, b: 106 }, // 5: sage terminal glow
      { r: 187, g: 154, b: 247 }, // 6: lavender wing trim
      { r: 125, g: 207, b: 255 }, // 7: cyan sleep rune
    ],
    baseGrid: [
      "................",
      "..111......111..",
      "..122111111221..",
      "..123322223321..",
      "..131322223131..",
      "..133324423331..",
      "...1222442221...",
      "..162233332261..",
      ".16623333332661.",
      ".16623233232661.",
      ".16223333332261.",
      "..112233332211..",
      "....12222221....",
      "....141..141....",
      "................",
      "................",
    ],
  },
  {
    id: "bun-hare",
    name: "Bun Hare",
    species: "Lepus Velox",
    palette: [
      { r: 0, g: 0, b: 0 }, // 0: transparent
      { r: 32, g: 26, b: 24 }, // 1: espresso outline
      { r: 251, g: 240, b: 223 }, // 2: warm bun cream coat
      { r: 255, g: 252, b: 247 }, // 3: bright snow belly/tail
      { r: 244, g: 114, b: 182 }, // 4: coral inner ear
      { r: 245, g: 158, b: 11 }, // 5: amber speed badge
      { r: 16, g: 185, b: 129 }, // 6: emerald compile status
      { r: 96, g: 165, b: 250 }, // 7: cool sleep glyph
    ],
    baseGrid: [
      "...11......11...",
      "..1241....1421..",
      "..1241....1421..",
      "..1221....1221..",
      "..122211112221..",
      ".12212222221221.",
      ".12222244222221.",
      "..123333333321..",
      "...1555555551...",
      "..122333333221..",
      ".1312233332221..",
      ".133122222221...",
      "..11.12211221...",
      ".....111..111...",
      "................",
      "................",
    ],
  },
];

function parseBaseGrid(grid: string[]): Uint8Array {
  const buf = new Uint8Array(16 * 16);
  for (let y = 0; y < 16; y++) {
    const row = grid[y] ?? "................";
    for (let x = 0; x < 16; x++) {
      const ch = row[x] ?? ".";
      buf[y * 16 + x] = ch === "." ? 0 : Number.parseInt(ch, 10) || 0;
    }
  }
  return buf;
}

/**
 * Derive 8 distinct 16x16 animation frames across idle (0,1), walk (2,3), work (4,5), sleep (6,7).
 */
function build8LogicalFrames(base16: Uint8Array): Uint8Array[] {
  const frames: Uint8Array[] = [];

  for (let f = 0; f < 8; f++) {
    const out = new Uint8Array(16 * 16);
    const yShift = f === 1 || f === 3 ? -1 : f >= 6 ? 1 : 0;

    for (let y = 0; y < 16; y++) {
      const srcY = y - yShift;
      if (srcY < 0 || srcY >= 16) continue;
      for (let x = 0; x < 16; x++) {
        out[y * 16 + x] = base16[srcY * 16 + x];
      }
    }

    // Walk frames (2, 3): alternate foot stride on rows 13..14
    if (f === 2) {
      out[14 * 16 + 3] = 1;
      out[14 * 16 + 11] = 0;
    } else if (f === 3) {
      out[13 * 16 + 12] = 1;
    }

    // Work frames (4, 5): draw mini workstation console in front with active status pixel
    if (f === 4 || f === 5) {
      for (let wx = 11; wx <= 15; wx++) {
        out[13 * 16 + wx] = 1;
        out[14 * 16 + wx] = 4;
      }
      out[12 * 16 + (f === 4 ? 12 : 14)] = f === 4 ? 5 : 6;
      out[11 * 16 + (f === 4 ? 13 : 12)] = 6;
    }

    // Sleep frames (6, 7): close eyes & float crisp pixel Z glyphs top-right
    if (f === 6 || f === 7) {
      // Soften eye pixels on rows 5..6
      for (let ry = 4; ry <= 6; ry++) {
        for (let rx = 3; rx <= 12; rx++) {
          if (out[ry * 16 + rx] === 1 && rx > 3 && rx < 12) {
            out[ry * 16 + rx] = 2;
          }
        }
      }
      const zx = f === 6 ? 12 : 13;
      const zy = f === 6 ? 1 : 0;
      if (zy + 2 < 16 && zx + 2 < 16) {
        out[zy * 16 + zx] = 7;
        out[zy * 16 + zx + 1] = 7;
        out[(zy + 1) * 16 + zx + 1] = 7;
        out[(zy + 2) * 16 + zx] = 7;
        out[(zy + 2) * 16 + zx + 1] = 7;
      }
    }

    frames.push(out);
  }

  return frames;
}

function upscaleIndexedFrame(src16: Uint8Array, scale: number): Uint8Array {
  const size = 16 * scale;
  const dst = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    const sy = Math.floor(y / scale);
    for (let x = 0; x < size; x++) {
      const sx = Math.floor(x / scale);
      dst[y * size + x] = src16[sy * 16 + sx];
    }
  }
  return dst;
}

function renderSpriteSheetSvg(
  pet: OpenPetDefinition,
  frames16: Uint8Array[],
  scale: number,
): string {
  const framePx = 16 * scale;
  const totalWidth = framePx * frames16.length;
  const rects: string[] = [];

  const hexOf = (idx: number) => {
    const c = pet.palette[idx];
    return (
      "#" + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, "0")).join("")
    );
  };

  for (let f = 0; f < frames16.length; f++) {
    const grid = frames16[f];
    const xBase = f * framePx;
    for (let y = 0; y < 16; y++) {
      let x = 0;
      while (x < 16) {
        const colorIdx = grid[y * 16 + x];
        if (colorIdx === 0) {
          x++;
          continue;
        }
        let run = 1;
        while (x + run < 16 && grid[y * 16 + x + run] === colorIdx) {
          run++;
        }
        rects.push(
          `  <rect x="${xBase + x * scale}" y="${y * scale}" width="${run * scale}" height="${scale}" fill="${hexOf(colorIdx)}"/>`,
        );
        x += run;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${framePx}" width="${totalWidth}" height="${framePx}" shape-rendering="crispEdges">
  <title>${pet.name} Sprite Sheet</title>
${rects.join("\n")}
</svg>
`;
}

function renderSpriteSheetPng(
  pet: OpenPetDefinition,
  frames64: Uint8Array[],
  frameSize: number,
): Uint8Array {
  const sheetWidth = frameSize * frames64.length;
  const sheetHeight = frameSize;
  const rgba = new Uint8Array(sheetWidth * sheetHeight * 4);

  for (let f = 0; f < frames64.length; f++) {
    const frame = frames64[f];
    const xOffset = f * frameSize;
    for (let y = 0; y < frameSize; y++) {
      for (let x = 0; x < frameSize; x++) {
        const idx = frame[y * frameSize + x];
        const dstPos = (y * sheetWidth + (xOffset + x)) * 4;
        if (idx === 0) {
          rgba[dstPos] = 0;
          rgba[dstPos + 1] = 0;
          rgba[dstPos + 2] = 0;
          rgba[dstPos + 3] = 0;
        } else {
          const c = pet.palette[idx];
          rgba[dstPos] = c.r;
          rgba[dstPos + 1] = c.g;
          rgba[dstPos + 2] = c.b;
          rgba[dstPos + 3] = 255;
        }
      }
    }
  }

  return encodePngRgba(sheetWidth, sheetHeight, rgba);
}

export function generateOpenPetsAssets(outDir: string): {
  files: string[];
  petCount: number;
} {
  const petsDir = join(outDir, "open-pets");
  mkdirSync(petsDir, { recursive: true });

  const scale = 4; // 16x16 * 4 = 64x64
  const frameSize = 16 * scale;
  const written: string[] = [];
  const cssRules: string[] = [
    `/* Aphrody Open Pets CSS Sprite Keyframe Companion Kit (CC0-1.0) */`,
    `.open-pet{width:${frameSize}px;height:${frameSize}px;display:inline-block;background-repeat:no-repeat;background-size:${frameSize * 8}px ${frameSize}px;image-rendering:pixelated}`,
    `@keyframes open-pet-idle{from{background-position-x:0px}to{background-position-x:-${frameSize * 2}px}}`,
    `@keyframes open-pet-walk{from{background-position-x:-${frameSize * 2}px}to{background-position-x:-${frameSize * 4}px}}`,
    `@keyframes open-pet-work{from{background-position-x:-${frameSize * 4}px}to{background-position-x:-${frameSize * 6}px}}`,
    `@keyframes open-pet-sleep{from{background-position-x:-${frameSize * 6}px}to{background-position-x:-${frameSize * 8}px}}`,
    `.open-pet[data-state="idle"]{animation:open-pet-idle 900ms steps(2) infinite}`,
    `.open-pet[data-state="walk"]{animation:open-pet-walk 480ms steps(2) infinite}`,
    `.open-pet[data-state="work"]{animation:open-pet-work 360ms steps(2) infinite}`,
    `.open-pet[data-state="sleep"]{animation:open-pet-sleep 1400ms steps(2) infinite}`,
    `@media (prefers-reduced-motion:reduce){.open-pet{animation:none!important}}`,
  ];

  for (const pet of PET_DEFINITIONS) {
    const base16 = parseBaseGrid(pet.baseGrid);
    const frames16 = build8LogicalFrames(base16);
    const frames64 = frames16.map((f) => upscaleIndexedFrame(f, scale));

    // 1. Real Animated GIF89a binary
    const gifBytes = encodeAnimatedGif({
      width: frameSize,
      height: frameSize,
      palette: pet.palette,
      loopCount: 0,
      frames: frames64.map((pixels, idx) => ({
        pixels,
        delayCs: idx >= 6 ? 40 : idx >= 4 ? 16 : 24,
        transparentIndex: 0,
        disposalMethod: 2,
      })),
    });
    const gifPath = join(petsDir, `${pet.id}.gif`);
    writeFileSync(gifPath, gifBytes);
    written.push(gifPath);

    // 2. Crisp Horizontal Sprite Sheet SVG
    const sheetSvg = renderSpriteSheetSvg(pet, frames16, scale);
    const svgPath = join(petsDir, `${pet.id}-sheet.svg`);
    writeFileSync(svgPath, sheetSvg, "utf8");
    written.push(svgPath);

    // 3. Compressed Horizontal Sprite Sheet PNG
    const sheetPng = renderSpriteSheetPng(pet, frames64, frameSize);
    const pngPath = join(petsDir, `${pet.id}-sheet.png`);
    writeFileSync(pngPath, sheetPng);
    written.push(pngPath);

    // 4. Companion State/Frame Atlas JSON
    const atlas = {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      license: "CC0-1.0",
      frameWidth: frameSize,
      frameHeight: frameSize,
      sheetWidth: frameSize * 8,
      sheetHeight: frameSize,
      totalFrames: 8,
      files: {
        gif: `open-pets/${pet.id}.gif`,
        svgSheet: `open-pets/${pet.id}-sheet.svg`,
        pngSheet: `open-pets/${pet.id}-sheet.png`,
      },
      states: {
        idle: { startFrame: 0, frameCount: 2, durationMs: 450, loop: true },
        walk: { startFrame: 2, frameCount: 2, durationMs: 240, loop: true },
        work: { startFrame: 4, frameCount: 2, durationMs: 180, loop: true },
        sleep: { startFrame: 6, frameCount: 2, durationMs: 700, loop: true },
      },
      frames: Array.from({ length: 8 }, (_, i) => ({
        index: i,
        state: i < 2 ? "idle" : i < 4 ? "walk" : i < 6 ? "work" : "sleep",
        x: i * frameSize,
        y: 0,
        w: frameSize,
        h: frameSize,
      })),
    };
    const atlasPath = join(petsDir, `${pet.id}.atlas.json`);
    writeFileSync(atlasPath, JSON.stringify(atlas, null, 2), "utf8");
    written.push(atlasPath);

    cssRules.push(
      `.open-pet-${pet.id}{background-image:url("./${pet.id}-sheet.svg")}`,
    );
  }

  const cssPath = join(petsDir, "open-pets.css");
  writeFileSync(cssPath, cssRules.join("\n") + "\n", "utf8");
  written.push(cssPath);

  return { files: written, petCount: PET_DEFINITIONS.length };
}
