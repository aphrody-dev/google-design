/**
 * Automated MDX Documentation Generator for Bun Docs
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Compiles rich MDX design guides directly inside C:\src\bun\docs\design\
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { generateDynamicTheme } from "../color-utils/hct.ts";
import { listAvailableSymbols } from "../symbols/catalog.ts";

const BUN_DOCS_DESIGN_DIR = "C:\\src\\bun\\docs\\design";
const BUN_DOCS_JSON = "C:\\src\\bun\\docs\\docs.json";

export interface GenerationResult {
  generatedFiles: string[];
  docsJsonUpdated: boolean;
  success: boolean;
}

/**
 * Generate all design system MDX documentation files
 */
export async function generateBunDesignDocs(): Promise<GenerationResult> {
  if (!existsSync(BUN_DOCS_DESIGN_DIR)) {
    mkdirSync(BUN_DOCS_DESIGN_DIR, { recursive: true });
  }

  const generatedFiles: string[] = [];
  const theme = generateDynamicTheme("#4285F4");
  const symbols = listAvailableSymbols();

  // 1. index.mdx
  const indexMdx = `---
title: Unified Sovereign Design System
description: Google Design, Material 3 Expressive, Fluent 2 Desktop, macOS Windowing, and GUI/TUI/Web/Desktop/Mobile parity in pure Bun.
---

## Overview

The Sovereign Design System provides a unified, cross-surface design architecture implemented in 100% pure Bun v1.4.4. It bridges Google Design, Material Design 3 (M3 Expressive), Microsoft Fluent 2, and Apple macOS windowing ergonomics across 7 distinct execution targets.

<CardGroup cols={3}>
  <Card title="Web Standards" icon="globe">
    Native CSS custom properties (\`--md-sys-color-*\`), responsive layout grids, and zero-layout-shift (\`CLS = 0\`).
  </Card>
  <Card title="Desktop Rust" icon="laptop">
    Direct bindings for \`taffy\`, Zed \`GPUI\`, System76 \`COSMIC\` RON, and Microsoft WinUI 3 Fluent 2 parity.
  </Card>
  <Card title="TUI & Terminals" icon="terminal">
    24-bit TrueColor ANSI escape sequences and Rio terminal configs with crisp Unicode box-drawing glyphs.
  </Card>
</CardGroup>

---

## Architecture Principles

<Steps>
  <Step title="CAM16 & HCT Perceptual Math">
    Color luminance and chroma are calculated via Google's official CAM16 color appearance model, guaranteeing contrast accessibility.
  </Step>
  <Step title="Universal Multi-Surface Compilation">
    From any single seed hex or image palette, design tokens compile simultaneously for Web, Figma, Stitch, Gemini Canvas, Desktop Rust, Mobile, and TUI.
  </Step>
  <Step title="Automated Gate Verification">
    Compile-time gates audit design artifacts against rogue hex values, off-grid dimensions, and contrast regressions.
  </Step>
</Steps>

<Info>All components and utilities are powered natively by Bun with zero external npm dependencies.</Info>
`;

  writeFileSync(join(BUN_DOCS_DESIGN_DIR, "index.mdx"), indexMdx, "utf8");
  generatedFiles.push(join(BUN_DOCS_DESIGN_DIR, "index.mdx"));

  // 2. hct-color-utils.mdx
  const hctMdx = `---
title: HCT Color Utilities & CAM16 Math
description: Perceptual color space, tonal palettes, and dynamic scheme generation powered by Google Material Color Utilities.
---

## What is HCT?

**HCT** (Hue, Chroma, Tone) combines the perceptual accuracy of CAM16 with the lightness metric $L^*$ from CIELAB. Unlike sRGB or HSL where identical values produce wildly different perceived brightness, HCT tone ($0..100$) maps directly to human visual perception.

<CardGroup cols={3}>
  <Card title="Hue (0° - 360°)" icon="palette">
    Perceptual color family (e.g. 265° for Google Blue).
  </Card>
  <Card title="Chroma (0 - 120+)" icon="sparkles">
    Color saturation and purity.
  </Card>
  <Card title="Tone (0 - 100)" icon="sun">
    Perceived luminance. Tone 100 is pure white, Tone 0 is pure black.
  </Card>
</CardGroup>

---

## Active Tonal Palette Sample

Derived from Google Blue (\`#4285F4\`):

| Tone | Hex Color | Description |
| :--- | :--- | :--- |
| **Tone 100** | \`${theme.palettes.primary[100] || "#ffffff"}\` | Maximum luminance (Pure White) |
| **Tone 90** | \`${theme.palettes.primary[90] || "#dbe1ff"}\` | Light mode primary container |
| **Tone 80** | \`${theme.palettes.primary[80] || "#adc6ff"}\` | Dark mode primary accent |
| **Tone 40** | \`${theme.palettes.primary[40] || "#445e91"}\` | Light mode primary fill |
| **Tone 20** | \`${theme.palettes.primary[20] || "#00285b"}\` | Dark mode primary container |
| **Tone 0** | \`${theme.palettes.primary[0] || "#000000"}\` | Minimum luminance (Pure Black) |

---

## Dynamic Scheme Variants

<Tabs>
  <Tab title="Tonal Spot">
    The default Material 3 variant. Balanced chroma with serene tonal harmony.
  </Tab>
  <Tab title="Expressive">
    Higher chroma with shifted secondary and tertiary hues for high energy.
  </Tab>
  <Tab title="Vibrant">
    Pushes chroma to gamut limits while maintaining strict WCAG 2.2 contrast.
  </Tab>
  <Tab title="Monochrome">
    Zero chroma across all tones. Grayscale precision for austere interfaces.
  </Tab>
</Tabs>
`;

  writeFileSync(
    join(BUN_DOCS_DESIGN_DIR, "hct-color-utils.mdx"),
    hctMdx,
    "utf8",
  );
  generatedFiles.push(join(BUN_DOCS_DESIGN_DIR, "hct-color-utils.mdx"));

  // 3. tokens-multi-surface.mdx
  const tokensMdx = `---
title: Multi-Surface Token Compiler
description: Compiles verified design tokens simultaneously across Web CSS, Figma W3C, Desktop Rust, Mobile, and TUI.
---

## Universal Token Architecture

The \`gds\` compiler takes a seed hex and generates synchronized tokens for all 7 surfaces:

<Tabs>
  <Tab title="Web CSS">
    \`\`\`css
    :root {
      --md-sys-color-primary: ${theme.light.primary};
      --md-sys-color-on-primary: ${theme.light.onPrimary};
      --md-sys-color-surface: ${theme.light.surface};
      --md-sys-color-on-surface: ${theme.light.onSurface};
    }
    \`\`\`
  </Tab>
  <Tab title="Figma W3C JSON">
    \`\`\`json
    {
      "color": {
        "primary": {
          "$value": "${theme.light.primary}",
          "$type": "color"
        }
      }
    }
    \`\`\`
  </Tab>
  <Tab title="Desktop Rust (Taffy)">
    \`\`\`rust
    pub const LIGHT_THEME: GoogleDesignTheme = GoogleDesignTheme {
        primary: M3Color::from_hex(0x${theme.light.primary.replace("#", "")}),
        surface: M3Color::from_hex(0x${theme.light.surface.replace("#", "")}),
    };
    \`\`\`
  </Tab>
  <Tab title="Android Jetpack Compose">
    \`\`\`kotlin
    val LightColorScheme = lightColorScheme(
        primary = Color(0xFF${theme.light.primary.replace("#", "").toUpperCase()}),
        surface = Color(0xFF${theme.light.surface.replace("#", "").toUpperCase()})
    )
    \`\`\`
  </Tab>
  <Tab title="TUI TrueColor">
    \`\`\`toml
    [colors]
    background = "${theme.dark.surface}"
    foreground = "${theme.dark.onSurface}"
    cursor = "${theme.dark.primary}"
    \`\`\`
  </Tab>
</Tabs>
`;

  writeFileSync(
    join(BUN_DOCS_DESIGN_DIR, "tokens-multi-surface.mdx"),
    tokensMdx,
    "utf8",
  );
  generatedFiles.push(join(BUN_DOCS_DESIGN_DIR, "tokens-multi-surface.mdx"));

  // 4. material-symbols.mdx
  const symbolsMdx = `---
title: Material Symbols Vector Catalog
description: Standard Google Material Symbols vector coordinates, variable font axes, and crisp viewBox guidelines.
---

## Crisp Vector Coordinate System

Material Symbols use a standardized vector bounding box:

\`\`\`xml
viewBox="0 -960 960 960"
\`\`\`

This standard viewBox aligns symbol paths on integer coordinates, preventing subpixel blur and anti-aliasing artifacts across all display densities.

---

## Available Core Symbols

<CardGroup cols={4}>
${symbols.map((s) => `  <Card title="${s}" icon="check">\n    \`viewBox="0 -960 960 960"\`\n  </Card>`).join("\n")}
</CardGroup>

---

## Variable Font Axes

Material Symbols are governed by 4 variable font axes:

1. **FILL** (\`0\` or \`1\`): Inactive outline vs active solid fill.
2. **wght** (\`100\` through \`700\`): Vector stroke thickness.
3. **GRAD** (\`-25\` through \`200\`): Contrast gradient adjustment.
4. **opsz** (\`20\`, \`24\`, \`40\`, \`48\`): Optical size optimization.
`;

  writeFileSync(
    join(BUN_DOCS_DESIGN_DIR, "material-symbols.mdx"),
    symbolsMdx,
    "utf8",
  );
  generatedFiles.push(join(BUN_DOCS_DESIGN_DIR, "material-symbols.mdx"));

  // 5. stitch-figma-canvas.mdx
  const stitchMdx = `---
title: Stitch, Figma & Gemini Canvas Integration
description: Interactive prompt-to-screen compilation, DESIGN.md specs, and Nano Banana asset slot synchronization.
---

## Workflow Integration

\`gds\` connects three generative design surfaces:

<Steps>
  <Step title="Figma Code Connect">
    Every UI component is linked to its Figma component node and typed design variables, ensuring zero drift between Figma and production code.
  </Step>
  <Step title="Google Stitch Engine">
    Transforms text prompts into structured Material 3 screens adhering to \`DESIGN.md\` specifications and harmonic spatial grids.
  </Step>
  <Step title="Gemini Web Canvas & Nano Banana">
    Generative UI canvas with embedded \`gemini-2.5-flash-image\` asset slots matched to the primary tonal palette.
  </Step>
</Steps>

---

## DESIGN.md Specification

The \`DESIGN.md\` format captures visual identity, prose rationale, and token constraints for coding agents:

\`\`\`yaml
# DESIGN.md
name: Google Material 3 Sovereign
colors:
  paper: '#F9F9FF'
  ink: '#1A1C1E'
  primary: '#445E91'
\`\`\`
`;

  writeFileSync(
    join(BUN_DOCS_DESIGN_DIR, "stitch-figma-canvas.mdx"),
    stitchMdx,
    "utf8",
  );
  generatedFiles.push(join(BUN_DOCS_DESIGN_DIR, "stitch-figma-canvas.mdx"));

  // 6. web-vitals-lighthouse.mdx
  const vitalsMdx = `---
title: Core Web Vitals & Lighthouse Gates
description: Compile-time verification for CLS = 0, sub-second LCP, WCAG 2.2 AA contrast, and 100% Lighthouse audit compliance.
---

## Performance Directives

Google Design surfaces must enforce strict performance standards:

| Metric | Target | Verification Method |
| :--- | :--- | :--- |
| **CLS (Cumulative Layout Shift)** | \`0.0\` | Explicit aspect ratios and reservation slots for all dynamic assets |
| **LCP (Largest Contentful Paint)** | \`< 800ms\` | Inlined critical CSS tokens and optimized SVG symbols |
| **INP (Interaction to Next Paint)** | \`< 50ms\` | Passive event listeners and zero heavy JavaScript runtimes |
| **WCAG 2.2 Contrast** | \`>= 4.5:1 (AA)\` | Mathematical HCT tone delta $\\Delta \\text{Tone} \\ge 40$ |

---

## UI Gate Verifier (\`gds verify\`)

Audit any directory with the 3-letter CLI:

\`\`\`bash terminal icon="terminal"
gds verify C:\\src\\aphrody
\`\`\`

The gate checks:
- Strict M3 token usage (flags rogue hex codes).
- 4dp/8dp grid adherence for margins, paddings, and gaps.
- Material Symbols viewBox integrity.
- Contrast ratio mathematical verification.
`;

  writeFileSync(
    join(BUN_DOCS_DESIGN_DIR, "web-vitals-lighthouse.mdx"),
    vitalsMdx,
    "utf8",
  );
  generatedFiles.push(join(BUN_DOCS_DESIGN_DIR, "web-vitals-lighthouse.mdx"));

  // Update docs.json if present
  let docsJsonUpdated = false;
  if (existsSync(BUN_DOCS_JSON)) {
    try {
      const raw = readFileSync(BUN_DOCS_JSON, "utf8");
      const docsJson = JSON.parse(raw);

      const designGroup = {
        group: "Design",
        icon: "palette",
        pages: [
          "/design/index",
          "/design/hct-color-utils",
          "/design/tokens-multi-surface",
          "/design/material-symbols",
          "/design/stitch-figma-canvas",
          "/design/web-vitals-lighthouse",
        ],
      };

      if (docsJson?.navigation?.tabs?.[0]?.groups) {
        const existingIdx = docsJson.navigation.tabs[0].groups.findIndex(
          (g: any) => g.group === "Design",
        );
        if (existingIdx >= 0) {
          docsJson.navigation.tabs[0].groups[existingIdx] = designGroup;
        } else {
          docsJson.navigation.tabs[0].groups.push(designGroup);
        }
        writeFileSync(BUN_DOCS_JSON, JSON.stringify(docsJson, null, 2), "utf8");
        docsJsonUpdated = true;
      }
    } catch {
      // Ignored if docs.json parsing fails
    }
  }

  // Format generated MDX files and docs.json with Bun
  try {
    const proc = Bun.spawn(["bun", "fmt", BUN_DOCS_DESIGN_DIR, BUN_DOCS_JSON], {
      stdout: "ignore",
      stderr: "ignore",
    });
    await proc.exited;
  } catch {
    // Formatting fallback
  }

  return {
    generatedFiles,
    docsJsonUpdated,
    success: true,
  };
}
