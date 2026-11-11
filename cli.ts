#!/usr/bin/env bun
/**
 * Google Design System & Anti-AI-Slop Studio CLI (gds)
 * 100% Pure Bun v1.4.4 Full-Rust Architecture - Zero External Dependencies
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { getHctColorInfo } from "./src/color-utils/hct.ts";
import { compileUniversalTokens } from "./src/theme-builder/exporter.ts";
import { verifyTarget } from "./src/verifier/ui-gate.ts";
import { searchSymbols } from "./src/symbols/catalog.ts";
import { generateStitchScreen } from "./src/stitch/stitch-engine.ts";
import { generateBunDesignDocs } from "./src/mdx/bun-docs-generator.ts";
import {
  buildMaterialIconsFigmaManifest,
  fetchFigmaCurrentUser,
} from "./src/figma/figma-connect.ts";
import {
  auditPathAntiSlop,
  humanizeText,
} from "./src/humanizer/anti-slop.ts";
import {
  synthesizePrdAndDesignMd,
  type SurfaceMode,
} from "./src/spec/prd-design-md.ts";
import { generateAssetBank } from "./src/assets/index.ts";

const args = process.argv.slice(2);
const command = args[0] || "help";

function getFlagValue(flag: string): string | null {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return null;
}

async function main() {
  switch (command) {
    case "serve": {
      const port = getFlagValue("--port");
      if (port) {
        process.env.PORT = port;
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
        `  Token Compliance:   ${(report.metrics.tokenComplianceRate * 100).toFixed(1)}%`,
      );
      console.log(
        `  Grid Adherence:     ${(report.metrics.gridAdherenceRate * 100).toFixed(1)}%`,
      );
      console.log(
        `  SVG Crispness:      ${(report.metrics.svgCrispnessRate * 100).toFixed(1)}%`,
      );
      console.log(
        `  Contrast Accuracy:  ${(report.metrics.contrastComplianceRate * 100).toFixed(1)}%`,
      );
      console.log(
        `  Anti-Slop Clean:    ${(report.metrics.antiSlopComplianceRate * 100).toFixed(1)}%`,
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

    case "audit-slop": {
      const target = args[1] || process.cwd();
      const jsonOut = args.includes("--json");
      const report = auditPathAntiSlop(target);

      if (jsonOut) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(`Anti-AI-Slop Audit (impeccable + humanizer)`);
        console.log("--------------------------------------------------");
        console.log(`Target:         ${report.targetPath}`);
        console.log(`Files Scanned:  ${report.scannedFiles}`);
        console.log(`Average Score:  ${report.averageScore}/100`);
        console.log(`Total Findings: ${report.totalFindings}`);
        console.log(`Status:         ${report.clean ? "CLEAN" : "FINDINGS"}`);
        console.log("--------------------------------------------------");

        for (const fileReport of report.files) {
          for (const f of fileReport.findings.slice(0, 15)) {
            console.log(
              `  [${f.severity.toUpperCase()}] ${fileReport.file}:${f.line}:${f.column} (${f.ruleId}) - ${f.message}`,
            );
          }
        }
      }

      if (!report.clean) {
        process.exit(1);
      }
      break;
    }

    case "humanize": {
      const targetFile = args[1];
      if (!targetFile || !existsSync(targetFile)) {
        console.error("Usage: gds humanize <file> [--write]");
        process.exit(1);
      }
      const raw = readFileSync(targetFile, "utf8");
      const rewritten = humanizeText(raw);
      if (args.includes("--write") || args.includes("-w")) {
        writeFileSync(targetFile, rewritten, "utf8");
        console.log(`Humanized prose written in-place to: ${targetFile}`);
      } else {
        process.stdout.write(rewritten);
      }
      break;
    }

    case "plan": {
      const surfaceName =
        args[1] && !args[1].startsWith("--")
          ? args[1]
          : "Aphrody Generalist Surface";
      const outDir = resolve(getFlagValue("--out") || join(process.cwd(), "spec"));
      const seedColor = getFlagValue("--seed") || "#1A73E8";
      const mode = (getFlagValue("--mode") as SurfaceMode) || "operate";

      const bundle = synthesizePrdAndDesignMd({
        name: surfaceName,
        seedColor,
        mode,
        outDir,
      });

      console.log(`Generated Design-First Plan for '${bundle.name}' (${bundle.mode})`);
      for (const f of bundle.writtenFiles) {
        console.log(`  + ${f}`);
      }
      break;
    }

    case "assets": {
      const outDir = resolve(
        getFlagValue("--out") || join(process.cwd(), "dist", "assets"),
      );
      console.log(`Generating Sovereign Open Creative Asset Bank -> ${outDir}`);
      const res = generateAssetBank(outDir);
      console.log("--------------------------------------------------");
      console.log(`Manifest:       ${res.manifestPath}`);
      console.log(`Total Files:    ${res.totalFiles}`);
      console.log(`Total Size:     ${(res.totalBytes / 1024).toFixed(1)} KB`);
      console.log(`Themes:         ${res.counts.themes} (23 Omarchy + CachyOS + M3 + Fluent 2)`);
      console.log(`SVG Icons:      ${res.counts.icons} (+ symbol sprite & atlas)`);
      console.log(`Open Pets:      ${res.counts.openPets} (GIF89a + SVG/PNG sheets + CSS/JSON)`);
      console.log(`Wallpapers:     ${res.counts.wallpapers} (4K SVG + compressed PNG)`);
      console.log(`3D Models:      ${res.counts.models3d} (.glb + .gltf + .obj)`);
      console.log(`Audio Clips:    ${res.counts.audioClips} (16-bit 44.1kHz PCM .wav + motion scenes)`);
      console.log("--------------------------------------------------");
      break;
    }

    case "tokens": {
      const seed = getFlagValue("--seed") || "#4285F4";
      const outDir = getFlagValue("--out");

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
      console.log(`  Hue:    ${info.hue} deg`);
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

    case "figma": {
      const me = await fetchFigmaCurrentUser();
      const manifest = buildMaterialIconsFigmaManifest();
      mkdirSync(join(import.meta.dir, "dist"), { recursive: true });
      const outPath = join(
        import.meta.dir,
        "dist",
        "figma-material-icons.manifest.json",
      );
      writeFileSync(
        outPath,
        JSON.stringify(
          { user: { id: me.id, handle: me.handle }, icons: manifest },
          null,
          2,
        ),
        "utf8",
      );
      console.log(`Figma API Authenticated: @${me.handle} (id=${me.id})`);
      console.log(
        `Synced ${manifest.length} Material Design Icons -> ${outPath}`,
      );
      break;
    }

    case "--help":
    case "-h":
    case "help":
    default: {
      console.log(`
Google Design System & Anti-AI-Slop Studio CLI (gds v2.0.0)
Pure Bun v1.4.4 Full-Rust Architecture - Zero External Dependencies

Usage:
  gds <command> [options]

Commands:
  plan <name> [--out <dir>]     Synthesize PRD.md (Cahier des charges) + DESIGN.md maquette
  assets [--out <dir>]          Generate complete Open Creative Asset Bank + SHA-256 manifest
  audit-slop [path] [--json]    Audit prose & UI styles for AI clichés, emojis & SaaS slop
  humanize <file> [--write]     Deterministically rewrite AI tropes into direct human prose
  verify [path]                 Run UI Gate verifier (tokens, 4dp/8dp grid, SVG, anti-slop)
  tokens [--seed <hex>]         Compile universal tokens across all 7 surfaces
  hct <hex>                     Analyze color in CAM16 / HCT perceptual space
  symbols [query]               Search crisp Material Symbols vector catalog
  stitch <prompt>               Generate Material 3 UI screen wireframe from prompt
  mdx                           Generate & format full MDX documentation suite in bun docs
  serve [--port 3030]           Start the Google Design & Material 3 local mirror server
  help                          Show this help message
`);
      break;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
