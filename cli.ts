#!/usr/bin/env bun
/**
 * 3-Letter CLI: gds (Google Design System)
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 */

import { parseArgs } from "node:util";
import {
  getHctColorInfo,
  generateDynamicTheme,
} from "./src/color-utils/hct.ts";
import { compileUniversalTokens } from "./src/theme-builder/exporter.ts";
import { verifyTarget } from "./src/verifier/ui-gate.ts";
import { searchSymbols } from "./src/symbols/catalog.ts";
import { generateStitchScreen } from "./src/stitch/stitch-engine.ts";
import { generateBunDesignDocs } from "./src/mdx/bun-docs-generator.ts";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const command = args[0] || "help";

async function main() {
  switch (command) {
    case "serve": {
      const portIdx = args.indexOf("--port");
      if (portIdx !== -1 && args[portIdx + 1]) {
        process.env.PORT = args[portIdx + 1];
      }
      await import("./server.ts");
      break;
    }

    case "verify": {
      const target = args[1] || process.cwd();
      console.log(`Running UI Gate Verification on: ${target}`);
      const report = verifyTarget(target);
      console.log("--------------------------------------------------");
      console.log(`Target:         ${report.targetPath}`);
      console.log(`Files Scanned:  ${report.scannedFilesCount}`);
      console.log(`Audit Score:    ${report.score}/100`);
      console.log(`Status:         ${report.passed ? "PASS" : "FAIL"}`);
      console.log("Metrics:");
      console.log(
        `  Token Compliance:  ${(report.metrics.tokenComplianceRate * 100).toFixed(1)}%`,
      );
      console.log(
        `  Grid Adherence:    ${(report.metrics.gridAdherenceRate * 100).toFixed(1)}%`,
      );
      console.log(
        `  SVG Crispness:     ${(report.metrics.svgCrispnessRate * 100).toFixed(1)}%`,
      );
      console.log(
        `  Contrast Accuracy: ${(report.metrics.contrastComplianceRate * 100).toFixed(1)}%`,
      );
      console.log("--------------------------------------------------");

      if (report.issues.length > 0) {
        console.log(`Issues Found (${report.issues.length}):`);
        for (const issue of report.issues.slice(0, 10)) {
          console.log(
            `  [${issue.severity.toUpperCase()}] ${issue.file}:${issue.line} - ${issue.message}`,
          );
        }
        if (report.issues.length > 10) {
          console.log(`  ... and ${report.issues.length - 10} more issues.`);
        }
      } else {
        console.log("Zero design violations detected.");
      }

      if (!report.passed) {
        process.exit(1);
      }
      break;
    }

    case "tokens": {
      const seedIdx = args.indexOf("--seed");
      const seed =
        seedIdx !== -1 && args[seedIdx + 1] ? args[seedIdx + 1] : "#4285F4";
      const outIdx = args.indexOf("--out");
      const outDir =
        outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : null;

      const bundle = compileUniversalTokens(seed);
      console.log(`Compiled Universal Tokens for seed: ${seed}`);
      console.log(`Surfaces: ${Object.keys(bundle.surfaces).join(", ")}`);

      if (outDir) {
        mkdirSync(outDir, { recursive: true });
        writeFileSync(
          join(outDir, "tokens.css"),
          bundle.surfaces.webCss,
          "utf8",
        );
        writeFileSync(
          join(outDir, "figma-tokens.json"),
          JSON.stringify(bundle.surfaces.figmaW3c, null, 2),
          "utf8",
        );
        writeFileSync(
          join(outDir, "colors.xml"),
          bundle.surfaces.mobile.androidXml,
          "utf8",
        );
        writeFileSync(
          join(outDir, "desktop.rs"),
          bundle.surfaces.desktopRust.taffy,
          "utf8",
        );
        writeFileSync(
          join(outDir, "rio.toml"),
          bundle.surfaces.tui.rioConfig,
          "utf8",
        );
        console.log(`Written multi-surface token assets to: ${outDir}`);
      } else {
        console.log(JSON.stringify(bundle.surfaces.figmaW3c, null, 2));
      }
      break;
    }

    case "hct": {
      let hex = args[1] || "#4285F4";
      if (!hex.startsWith("#")) hex = "#" + hex;
      const info = getHctColorInfo(hex);
      console.log(`HCT Color Analysis for ${hex}:`);
      console.log(`  Hue:    ${info.hue}°`);
      console.log(`  Chroma: ${info.chroma}`);
      console.log(`  Tone:   ${info.tone}`);
      console.log(`  RGB:    (${info.rgb.r}, ${info.rgb.g}, ${info.rgb.b})`);
      break;
    }

    case "symbols": {
      const q = args[1] || "";
      const list = searchSymbols(q);
      console.log(`Material Symbols (${list.length} available):`);
      for (const item of list) {
        console.log(`  - ${item.name} (viewBox="0 -960 960 960")`);
      }
      break;
    }

    case "stitch": {
      const prompt =
        args.slice(1).join(" ") || "Google Cloud Management Console";
      const screen = generateStitchScreen(prompt);
      console.log(`Generated Stitch Screen for prompt: "${prompt}"`);
      console.log(`Screen ID: ${screen.id}`);
      console.log(screen.html);
      break;
    }

    case "mdx": {
      console.log("Generating Bun Docs Design MDX suite...");
      const res = await generateBunDesignDocs();
      console.log(
        `Generated ${res.generatedFiles.length} MDX documents in C:\\src\\bun\\docs\\design\\`,
      );
      for (const f of res.generatedFiles) {
        console.log(`  + ${f}`);
      }
      console.log(`docs.json updated: ${res.docsJsonUpdated}`);
      break;
    }

    case "help":
    default: {
      console.log(`
Google Design System CLI (gds)
Pure Bun v1.4.4 Full Rust Architecture - Zero External Dependencies

Usage:
  gds <command> [options]

Commands:
  serve [--port 3030]       Start the Google Design & Material 3 local mirror server
  verify [path]             Run UI Gate verifier on design system compliance
  tokens [--seed <hex>]     Compile universal tokens across all 7 surfaces
  hct <hex>                 Analyze color in CAM16 / HCT perceptual space
  symbols [query]           Search crisp Material Symbols vector catalog
  stitch <prompt>           Generate Material 3 UI screen from prompt
  mdx                       Generate & format full MDX documentation suite in bun docs
  help                      Show this help message
`);
      break;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
