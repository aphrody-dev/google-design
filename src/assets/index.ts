/**
 * Master Open Creative Asset Bank Orchestrator & SHA-256 Catalog Manifest Generator
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { generateBrandAndLegalAssets } from "./brand-legal.ts";
import { generateThemeStylesheetAssets } from "./themes-stylesheets.ts";
import { generateIconsAndSpritesAssets } from "./icons-sprites.ts";
import { generateOpenPetsAssets } from "./open-pets.ts";
import { generateWallpaperAssets } from "./wallpapers.ts";
import { generate3dModelAssets } from "./models-3d.ts";
import { generateAudioAndVideoAssets } from "./audio-video.ts";

export interface AssetManifestEntry {
  path: string;
  category:
    | "brand"
    | "fonts"
    | "legal"
    | "themes"
    | "icons"
    | "sprites"
    | "open-pets"
    | "wallpapers"
    | "models-3d"
    | "audio"
    | "video";
  mimeType: string;
  byteSize: number;
  sha256: string;
  license: "CC0-1.0" | "MIT" | "SIL-OFL-1.1";
  dimensionsOrDuration?: string;
}

export interface AssetBankGenerationResult {
  outDir: string;
  manifestPath: string;
  totalFiles: number;
  totalBytes: number;
  counts: {
    themes: number;
    icons: number;
    openPets: number;
    wallpapers: number;
    models3d: number;
    audioClips: number;
  };
  entries: AssetManifestEntry[];
}

function getMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".md":
      return "text/markdown; charset=utf-8";
    case ".glb":
      return "model/gltf-binary";
    case ".gltf":
      return "model/gltf+json";
    case ".obj":
      return "model/obj";
    case ".wav":
      return "audio/wav";
    default:
      return "application/octet-stream";
  }
}

function inferDimensionsOrDuration(relPosix: string): string | undefined {
  if (relPosix.startsWith("icons/") && relPosix.endsWith(".svg")) {
    return "24x24";
  }
  if (relPosix.startsWith("open-pets/")) {
    if (relPosix.endsWith(".gif")) return "64x64 (8 frames)";
    if (relPosix.endsWith("-sheet.svg") || relPosix.endsWith("-sheet.png")) {
      return "512x64";
    }
  }
  if (relPosix.startsWith("wallpapers/")) {
    if (relPosix.endsWith(".svg")) return "3840x2160";
    if (relPosix.endsWith(".png")) return "640x360";
  }
  if (relPosix === "video/aphrody-hero-loop.svg") return "960x320";
  if (relPosix === "video/aphrody-kinetic-banner.gif")
    return "160x48 (10 frames)";
  if (relPosix === "brand/aphrody-monogram-bimi.svg") return "100x100";
  if (relPosix === "brand/aphrody-wordmark.svg") return "220x40";
  return undefined;
}

/**
 * Generate the complete Sovereign Open Creative Asset Bank into `outDir`
 * and write a deterministic SHA-256 `manifest.json`.
 */
export function generateAssetBank(outDir: string): AssetBankGenerationResult {
  mkdirSync(outDir, { recursive: true });

  const brandLegal = generateBrandAndLegalAssets(outDir);
  const themesRes = generateThemeStylesheetAssets(outDir);
  const iconsRes = generateIconsAndSpritesAssets(outDir);
  const petsRes = generateOpenPetsAssets(outDir);
  const wallpapersRes = generateWallpaperAssets(outDir);
  const modelsRes = generate3dModelAssets(outDir);
  const audioVideoRes = generateAudioAndVideoAssets(outDir);

  const audioDurationMap = new Map(
    audioVideoRes.audioMetadata.map((m) => [
      m.file,
      `${m.durationSec}s @ ${m.sampleRate}Hz`,
    ]),
  );

  const allWrittenPaths = [
    ...brandLegal.files,
    ...themesRes.files,
    ...iconsRes.files,
    ...petsRes.files,
    ...wallpapersRes.files,
    ...modelsRes.files,
    ...audioVideoRes.files,
  ];

  const entries: AssetManifestEntry[] = [];
  let totalBytes = 0;

  for (const absPath of allWrittenPaths) {
    const relPosix = relative(outDir, absPath).replace(/\\/g, "/");
    const topFolder = relPosix.split("/")[0] as AssetManifestEntry["category"];
    const bytes = readFileSync(absPath);
    const byteSize = statSync(absPath).size;
    totalBytes += byteSize;

    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const ext = extname(absPath);

    const license: AssetManifestEntry["license"] =
      topFolder === "fonts"
        ? "SIL-OFL-1.1"
        : topFolder === "themes" || ext === ".js"
          ? "MIT"
          : "CC0-1.0";

    const dimensionsOrDuration =
      audioDurationMap.get(relPosix) ?? inferDimensionsOrDuration(relPosix);

    entries.push({
      path: relPosix,
      category: topFolder,
      mimeType: getMimeType(ext),
      byteSize,
      sha256,
      license,
      ...(dimensionsOrDuration ? { dimensionsOrDuration } : {}),
    });
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));

  const manifest = {
    name: "Aphrody Sovereign Open Creative Asset Bank",
    version: "2.0.0",
    generator: "@aphrody/google-design (gds)",
    owner: "Aphrody",
    contact: "contact@aphrody.com",
    defaultLicense: "CC0-1.0",
    totalFiles: entries.length,
    totalBytes,
    counts: {
      themes: themesRes.themes.length,
      icons: iconsRes.iconCount,
      openPets: petsRes.petCount,
      wallpapers: wallpapersRes.wallpaperCount,
      models3d: modelsRes.modelCount,
      audioClips: audioVideoRes.audioMetadata.length,
    },
    assets: entries,
  };

  const manifestPath = join(outDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  return {
    outDir,
    manifestPath,
    totalFiles: entries.length + 1, // including manifest.json
    totalBytes: totalBytes + statSync(manifestPath).size,
    counts: manifest.counts,
    entries,
  };
}

export * from "./png-encoder.ts";
export * from "./gif-encoder.ts";
export * from "./brand-legal.ts";
export * from "./themes-stylesheets.ts";
export * from "./icons-sprites.ts";
export * from "./open-pets.ts";
export * from "./wallpapers.ts";
export * from "./models-3d.ts";
export * from "./audio-video.ts";
