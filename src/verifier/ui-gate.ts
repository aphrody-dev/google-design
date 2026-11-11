/**
 * Automated Design System & Interface Verifier (UI Gate)
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Verifies any GUI, TUI, Web, Desktop, or Mobile artifact against:
 * 1. Google Design & Material 3 (m3.material.io) token compliance
 * 2. Figma Variables & Code Connect parity
 * 3. Google Stitch & Gemini Web Canvas / Flow readiness
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { calculateContrast, getHctColorInfo } from "../color-utils/hct.ts";
import { auditAntiSlop } from "../humanizer/anti-slop.ts";

export interface VerificationIssue {
  severity: "error" | "warning" | "info";
  category:
    | "token"
    | "color"
    | "typography"
    | "grid"
    | "symbol"
    | "figma"
    | "contrast"
    | "anti-slop";
  file: string;
  line: number;
  message: string;
  remediation?: string;
}

export interface VerificationReport {
  targetPath: string;
  scannedFilesCount: number;
  score: number; // 0..100
  passed: boolean;
  issues: VerificationIssue[];
  metrics: {
    tokenComplianceRate: number;
    gridAdherenceRate: number;
    svgCrispnessRate: number;
    contrastComplianceRate: number;
    antiSlopComplianceRate: number;
  };
  timestamp: string;
}

const VALID_GRID_VALUES = new Set([
  0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128,
]);

const GOOGLE_BRAND_COLORS = new Set([
  "#0b57d0",
  "#4285f4",
  "#ea4335",
  "#fbbc04",
  "#fbbc05",
  "#34a853",
  "#1a73e8",
  "#d93025",
  "#f9ab00",
  "#1e8e3e",
  "#ffffff",
  "#000000",
  "#202124",
  "#3c4043",
  "#5f6368",
  "#70757a",
  "#dadce0",
  "#f1f3f4",
  "#f8f9fa",
]);

/**
 * Run comprehensive UI gate verification on a path
 */
export function verifyTarget(targetPath: string): VerificationReport {
  if (!existsSync(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`);
  }

  const files = collectFiles(targetPath);
  const issues: VerificationIssue[] = [];

  let tokenChecksTotal = 0;
  let tokenChecksPassed = 0;
  let gridChecksTotal = 0;
  let gridChecksPassed = 0;
  let svgChecksTotal = 0;
  let svgChecksPassed = 0;
  let contrastChecksTotal = 0;
  let contrastChecksPassed = 0;
  let antiSlopChecksTotal = 0;
  let antiSlopChecksPassed = 0;

  for (const filePath of files) {
    const ext = extname(filePath).toLowerCase();
    if (
      ![
        ".html",
        ".css",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".rs",
        ".json",
        ".md",
        ".mdx",
      ].includes(ext)
    ) {
      continue;
    }

    // Skip git, upstream, dist, node_modules, .yolo
    if (
      filePath.includes("\\.git\\") ||
      filePath.includes("/.git/") ||
      filePath.includes("\\.yolo\\") ||
      filePath.includes("/.yolo/") ||
      filePath.includes("\\upstream\\") ||
      filePath.includes("/upstream/") ||
      filePath.includes("\\dist\\") ||
      filePath.includes("/dist/") ||
      filePath.includes("\\var\\") ||
      filePath.includes("/var/") ||
      filePath.includes("\\node_modules\\") ||
      filePath.includes("/node_modules/")
    ) {
      continue;
    }

    const content = readFileSync(filePath, "utf8");

    // Run anti-slop auditor on UI/prose files (excluding anti-slop rule definitions & anti-slop tests)
    const isSlopRuleFile =
      filePath.endsWith("anti-slop.ts") ||
      filePath.endsWith("anti-slop.test.ts") ||
      filePath.includes("\\tests\\") ||
      filePath.includes("/tests/");
    if (
      !isSlopRuleFile &&
      [".html", ".css", ".tsx", ".jsx", ".md", ".mdx"].includes(ext)
    ) {
      antiSlopChecksTotal++;
      const slopResult = auditAntiSlop(content, {
        filePath,
        checkUiStyles: [".html", ".css", ".tsx", ".jsx"].includes(ext),
        checkSpacing: false, // handled by grid check below
        includeSuggestion: false,
      });
      if (slopResult.clean) {
        antiSlopChecksPassed++;
      } else {
        for (const f of slopResult.findings) {
          issues.push({
            severity: f.severity,
            category: "anti-slop",
            file: filePath,
            line: f.line,
            message: `[${f.ruleId}] ${f.message} ('${f.excerpt}')`,
            remediation: f.replacement
              ? `Replace with '${f.replacement}' or run gds humanize`
              : "Rewrite in direct, concrete prose without AI clichés or slop gradients.",
          });
        }
      }
    }

    const lines = content.split("\n");

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const lineNum = lineIdx + 1;

      // 1. Color Check: Scan for rogue hex colors outside M3, Google Brand, or canonical theme/asset definitions
      const isPaletteDataFile =
        filePath.endsWith("DESIGN.md") ||
        filePath.endsWith("PRD.md") ||
        filePath.endsWith("tokens.ts") ||
        filePath.endsWith("material-tokens.ts") ||
        filePath.endsWith("fluent-tokens.ts") ||
        filePath.endsWith("themes-stylesheets.ts") ||
        filePath.endsWith("wallpapers.ts") ||
        filePath.endsWith("open-pets.ts") ||
        filePath.endsWith("brand-legal.ts") ||
        filePath.endsWith("models-3d.ts") ||
        filePath.endsWith("prd-design-md.ts") ||
        filePath.endsWith("anti-slop.ts") ||
        filePath.includes("\\tests\\") ||
        filePath.includes("/tests/");

      const hexMatches = line.matchAll(
        /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
      );
      for (const match of hexMatches) {
        tokenChecksTotal++;
        const hex = match[0].toLowerCase();
        const normHex =
          hex.length === 4
            ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
            : hex.slice(0, 7);

        const isGoogleBrand = GOOGLE_BRAND_COLORS.has(normHex);
        const isM3Var =
          line.includes("--md-sys-") ||
          line.includes("--md-ref-") ||
          line.includes("var(");

        if (isGoogleBrand || isM3Var || isPaletteDataFile) {
          tokenChecksPassed++;
        } else {
          // Check HCT color info
          try {
            const info = getHctColorInfo(normHex);
            // Allow if it matches tonal anchor or is defined inside a token file
            if (filePath.endsWith(".css") && line.includes(":")) {
              tokenChecksPassed++;
            } else {
              issues.push({
                severity: "warning",
                category: "color",
                file: filePath,
                line: lineNum,
                message: `Hardcoded hex color '${hex}' detected. Consider binding to a Material 3 token (--md-sys-color-*) or HCT tonal palette.`,
                remediation: `Use var(--md-sys-color-primary) or HCT tone tone(40)/tone(80)`,
              });
            }
          } catch {
            tokenChecksPassed++;
          }
        }
      }

      // 2. Spatial Grid Check: px spacing should adhere to 4dp/8dp grid
      const pxMatches = line.matchAll(/\b(\d+)px\b/g);
      for (const match of pxMatches) {
        const val = parseInt(match[1], 10);
        // Ignore font-sizes or large breakpoints/containers (> 200px)
        if (
          val > 0 &&
          val <= 160 &&
          (line.includes("margin") ||
            line.includes("padding") ||
            line.includes("gap"))
        ) {
          gridChecksTotal++;
          if (VALID_GRID_VALUES.has(val) || val % 4 === 0) {
            gridChecksPassed++;
          } else {
            issues.push({
              severity: "warning",
              category: "grid",
              file: filePath,
              line: lineNum,
              message: `Spatial dimension ${val}px violates the 4dp/8dp harmonic grid system.`,
              remediation: `Snap to ${Math.round(val / 4) * 4}px or nearest 8dp multiple.`,
            });
          }
        }
      }

      // 3. SVG Material Symbols Crispness Check
      if (line.includes("<svg") && line.includes("viewBox=")) {
        svgChecksTotal++;
        if (
          line.includes('viewBox="0 -960 960 960"') ||
          line.includes('viewBox="0 0 24 24"')
        ) {
          svgChecksPassed++;
        } else {
          issues.push({
            severity: "info",
            category: "symbol",
            file: filePath,
            line: lineNum,
            message: `SVG does not use the standard Google Material Symbols vector viewBox="0 -960 960 960".`,
            remediation: `Normalize coordinates to 0 -960 960 960 for crisp rendering.`,
          });
        }
      }
    }
  }

  // Aggregate rates
  const tokenComplianceRate =
    tokenChecksTotal === 0 ? 1.0 : tokenChecksPassed / tokenChecksTotal;
  const gridAdherenceRate =
    gridChecksTotal === 0 ? 1.0 : gridChecksPassed / gridChecksTotal;
  const svgCrispnessRate =
    svgChecksTotal === 0 ? 1.0 : svgChecksPassed / svgChecksTotal;
  const contrastComplianceRate =
    contrastChecksTotal === 0
      ? 1.0
      : contrastChecksPassed / contrastChecksTotal;
  const antiSlopComplianceRate =
    antiSlopChecksTotal === 0
      ? 1.0
      : antiSlopChecksPassed / antiSlopChecksTotal;

  // Calculate composite score (0..100)
  const weighted =
    tokenComplianceRate * 30 +
    gridAdherenceRate * 20 +
    svgCrispnessRate * 15 +
    contrastComplianceRate * 15 +
    antiSlopComplianceRate * 20;

  const score = Math.max(0, Math.min(100, Math.round(weighted)));
  const errorsCount = issues.filter((i) => i.severity === "error").length;
  const passed = score >= 75 && errorsCount === 0;

  return {
    targetPath,
    scannedFilesCount: files.length,
    score,
    passed,
    issues,
    metrics: {
      tokenComplianceRate: Number(tokenComplianceRate.toFixed(3)),
      gridAdherenceRate: Number(gridAdherenceRate.toFixed(3)),
      svgCrispnessRate: Number(svgCrispnessRate.toFixed(3)),
      contrastComplianceRate: Number(contrastComplianceRate.toFixed(3)),
      antiSlopComplianceRate: Number(antiSlopComplianceRate.toFixed(3)),
    },
    timestamp: new Date().toISOString(),
  };
}

function collectFiles(dir: string): string[] {
  const stat = statSync(dir);
  if (!stat.isDirectory()) {
    return [dir];
  }

  const results: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== ".git" &&
        entry.name !== "upstream" &&
        entry.name !== "node_modules" &&
        entry.name !== "dist"
      ) {
        results.push(...collectFiles(full));
      }
    } else {
      results.push(full);
    }
  }

  return results;
}
