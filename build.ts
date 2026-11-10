/**
 * Build Script for Google Design Sovereign Mirror
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { generateBunDesignDocs } from "./src/mdx/bun-docs-generator.ts";
import { compileUniversalTokens } from "./src/theme-builder/exporter.ts";
import {
  renderHome,
  renderHctPage,
  renderTokensPage,
  renderSymbolsPage,
  renderCanvasPage,
  renderStitchPage,
  renderFigmaPage,
  renderVerifyPage,
  renderLlmsTxt,
} from "./src/web/templates.ts";

const DIST_DIR = join(import.meta.dir, "dist");

async function build() {
  console.log("Building Google Design Sovereign Mirror...");
  mkdirSync(DIST_DIR, { recursive: true });

  // 1. Generate & format Bun docs MDX suite
  console.log("1/3 Generating MDX docs in C:\\src\\bun\\docs\\design\\...");
  const mdxResult = await generateBunDesignDocs();
  console.log(`    Generated ${mdxResult.generatedFiles.length} MDX files.`);

  // 2. Compile universal multi-surface tokens
  console.log("2/3 Compiling universal multi-surface tokens...");
  const bundle = compileUniversalTokens("#4285F4");
  writeFileSync(join(DIST_DIR, "tokens.css"), bundle.surfaces.webCss, "utf8");
  writeFileSync(
    join(DIST_DIR, "figma-tokens.json"),
    JSON.stringify(bundle.surfaces.figmaW3c, null, 2),
    "utf8",
  );
  writeFileSync(
    join(DIST_DIR, "stitch-canvas-schema.json"),
    JSON.stringify(bundle.surfaces.stitchAndCanvas, null, 2),
    "utf8",
  );
  writeFileSync(
    join(DIST_DIR, "taffy.rs"),
    bundle.surfaces.desktopRust.taffy,
    "utf8",
  );
  writeFileSync(
    join(DIST_DIR, "colors.xml"),
    bundle.surfaces.mobile.androidXml,
    "utf8",
  );
  writeFileSync(
    join(DIST_DIR, "compose-theme.kt"),
    bundle.surfaces.mobile.jetpackCompose,
    "utf8",
  );
  writeFileSync(
    join(DIST_DIR, "rio.toml"),
    bundle.surfaces.tui.rioConfig,
    "utf8",
  );

  // 3. Render static HTML mirror snapshots for offline distribution
  console.log("3/3 Emitting static HTML snapshots...");
  writeFileSync(join(DIST_DIR, "index.html"), renderHome(), "utf8");
  writeFileSync(join(DIST_DIR, "hct.html"), renderHctPage("#4285F4"), "utf8");
  writeFileSync(
    join(DIST_DIR, "tokens.html"),
    renderTokensPage("#4285F4"),
    "utf8",
  );
  writeFileSync(join(DIST_DIR, "symbols.html"), renderSymbolsPage(""), "utf8");
  writeFileSync(join(DIST_DIR, "canvas.html"), renderCanvasPage(), "utf8");
  writeFileSync(join(DIST_DIR, "stitch.html"), renderStitchPage(), "utf8");
  writeFileSync(join(DIST_DIR, "figma.html"), renderFigmaPage(), "utf8");
  writeFileSync(join(DIST_DIR, "verify.html"), renderVerifyPage(""), "utf8");
  writeFileSync(join(DIST_DIR, "llms.txt"), renderLlmsTxt(), "utf8");

  console.log("Google Design build completed successfully.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
