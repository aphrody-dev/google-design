/**
 * Plan-First PRD (Cahier des charges) & DESIGN.md Maquette Synthesis Engine
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 *
 * Compatible with:
 * - google-labs-code/design.md normative YAML frontmatter + canonical 8-section schema
 * - VoltAgent/awesome-design-md visual world rationale
 * - Aphrody Anti-AI-Slop Design-First Studio Gate
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  calculateContrast,
  generateDynamicTheme,
  type SchemeVariant,
} from "../color-utils/hct.ts";

export type SurfaceMode = "operate" | "read" | "persuade" | "experience";

export interface PlanSpecOptions {
  name: string;
  summary?: string;
  seedColor?: string;
  variant?: SchemeVariant;
  mode?: SurfaceMode;
  domain?: string;
  owner?: string;
  outDir?: string;
}

export interface GeneratedPlanBundle {
  name: string;
  slug: string;
  seedColor: string;
  mode: SurfaceMode;
  prdMarkdown: string;
  designMarkdown: string;
  writtenFiles: string[];
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "aphrody-surface"
  );
}

/**
 * Synthesize a structured bilingual/technical Cahier des charges (PRD.md)
 * and normative DESIGN.md maquette for any web, desktop, TUI, or 3D surface.
 */
export function synthesizePrdAndDesignMd(
  options: PlanSpecOptions,
): GeneratedPlanBundle {
  const slug = slugify(options.name);
  const seedColor = options.seedColor || "#1A73E8";
  const variant = options.variant || "tonal_spot";
  const mode: SurfaceMode = options.mode || "operate";
  const domain = options.domain || `${slug}.aphrody.com`;
  const owner = options.owner || "Aphrody Sovereign Engineering";
  const summary =
    options.summary ||
    `${options.name} generalist high-clarity interface built on Material Design 3 HCT, Fluent UI 2 Mica layers, and hardware-accelerated Bun v1.4.4 architecture.`;

  const theme = generateDynamicTheme(seedColor, variant, 0.0);
  const lightContrast = calculateContrast(
    theme.light.onSurface,
    theme.light.surface,
  );
  const darkContrast = calculateContrast(
    theme.dark.onSurface,
    theme.dark.surface,
  );
  const ctaContrast = calculateContrast(
    theme.light.onPrimary,
    theme.light.primary,
  );

  const prdMarkdown = `# Cahier des Charges Technique (PRD) — ${options.name}

| Champ / Field | Specification |
|:--------------|:--------------|
| **Identifiant / Slug** | \`${slug}\` |
| **Domaine / Surface** | \`${domain}\` |
| **Mode d'Usage (Impeccable)** | \`${mode}\` |
| **Proprietaire / Owner** | ${owner} (\`contact@aphrody.com\`) |
| **Couleur Racine (HCT Seed)** | \`${theme.seed}\` (\`${variant}\`) |
| **Runtime & Verification** | Bun v1.4.4 Full-Rust, \`gds verify\`, \`gds audit-slop\`, Lighthouse / \`wck\` 100/100 |

## 1. Objectif Produit & Positionnement / Product Scope

${summary}

- **Frontiere Souveraine (Single AI Ownership)** : \`@aphrody/ai-os\` demeure l'unique produit IA public du monorepo. Cette surface (\`${options.name}\`) expose une interface generaliste sobre, rapide et deterministe inspiree par Linus Torvalds (structures plates), Jarred Sumner (vitesse native zero-dependance) et Larry Page (clarte visuelle immediate).
- **Politique Anti-Slop** : Zero emoji, zero jargon promotionnel genere automatiquement, zero degrade violet-rose generique, zero icone Unicode de substitution.

## 2. Utilisateurs Cibles & Parcours / Target Workflows

1. **Lecture & Orientation (< 100 ms)** : L'utilisateur identifie l'action principale, l'etat courant et la navigation primaire des le premier rendu sans decalage de mise en page (\`CLS = 0.00\`).
2. **Execution Clavier & Pointeur** : Toutes les commandes critiques disposent d'un raccourci clavier, d'un anneau \`:focus-visible\` haute visibilite (\`2px solid ${theme.light.primary}\`) et de cibles tactiles minimales de \`40x40px\` (desktop) / \`48x48px\` (mobile).
3. **Resilience d'Etat** : Chaque vue implemente explicitement les 8 etats canoniques : \`default\`, \`hover\`, \`focus-visible\`, \`active\`, \`disabled\`, \`loading\` (squelette geometrique stable), \`empty\` (action directe de creation) et \`error\` (diagnostic factuel et action de reprise).

## 3. Architecture de Maquette & Grille Spatiale / Wireframe Specification

\`\`\`text
+----------------------------------------------------------------------------------+
| TopAppBar (height: 56px, surface-container-low, 1px outline-variant bottom)      |
| [Brand Lockup 24px]   [Primary Context / Search 480px max]   [Theme] [Primary]   |
+--------------------+-------------------------------------------------------------+
| NavigationRail     | Main Stage (max-width: 1280px, padding: 24px, gap: 24px)    |
| (72px compact /    | +---------------------------------------------------------+ |
|  240px expanded)   | | Primary Focal Panel (surface-container-lowest, r=12px)  | |
|                    | | Headline (Space Grotesk 32px/40px) + Action Bar         | |
| - Workspace        | +---------------------------------------------------------+ |
| - Assets           | +---------------------------+-----------------------------+ |
| - Telemetry        | | Data / Inspector Region   | WebGPU / Vector Preview     | |
| - Settings         | | (tabular-nums, 4dp rows)  | (60fps / reduced-motion ok) | |
|                    | +---------------------------+-----------------------------+ |
+--------------------+-------------------------------------------------------------+
\`\`\`

- **Points de Rupture Responsifs / Breakpoints** :
  - \`Compact\` : \`375px - 599px\` (4 colonnes, marges \`16px\`, gouttieres \`12px\`, \`NavigationBar\` inferieure)
  - \`Medium\` : \`600px - 1023px\` (8 colonnes, marges \`24px\`, gouttieres \`16px\`, \`NavigationRail\`)
  - \`Expanded\` : \`1024px - 1440px+\` (12 colonnes, marges \`24px\`, gouttieres \`24px\`, \`NavigationDrawer\` ou Rail)

## 4. Contraste Perceptuel & Accessibilite / WCAG 2.2 Verification

- **Mode Clair (\`${theme.light.onSurface}\` sur \`${theme.light.surface}\`)** : Ratio \`${lightContrast.ratio}:1\` (WCAG AA: \`${lightContrast.passAA ? "PASS" : "FAIL"}\`, AAA: \`${lightContrast.passAAA ? "PASS" : "FAIL"}\`)
- **Mode Sombre (\`${theme.dark.onSurface}\` sur \`${theme.dark.surface}\`)** : Ratio \`${darkContrast.ratio}:1\` (WCAG AA: \`${darkContrast.passAA ? "PASS" : "FAIL"}\`, AAA: \`${darkContrast.passAAA ? "PASS" : "FAIL"}\`)
- **Action Primaire (\`${theme.light.onPrimary}\` sur \`${theme.light.primary}\`)** : Ratio \`${ctaContrast.ratio}:1\` (Delta Tone HCT: \`${ctaContrast.toneDelta}\`)

## 5. Budgets de Performance & Criteres d'Acceptation / Lighthouse & WCK 100/100

| Metrique / Gate | Cible Stricte | Commande de Verification |
|:----------------|:--------------|:-------------------------|
| **First Contentful Paint (FCP)** | \`<= 600 ms\` | \`wck\` / Lighthouse |
| **Largest Contentful Paint (LCP)** | \`<= 1200 ms\` | \`wck\` / Lighthouse |
| **Interaction to Next Paint (INP)** | \`<= 50 ms\` | \`wck\` / Performance |
| **Cumulative Layout Shift (CLS)** | \`0.00\` | Metriques \`size-adjust\` OFL |
| **Conformite Design System** | \`>= 90 / 100\`, \`0\` erreur | \`gds verify\` |
| **Audit Anti-Slop (Prose & CSS)** | \`clean: true\`, \`100 / 100\` | \`gds audit-slop\` |
`;

  const designMarkdown = `---
version: "1.0"
name: "${options.name}"
description: "${summary.replace(/"/g, "'")}"
colors:
  primary: "${theme.light.primary}"
  on-primary: "${theme.light.onPrimary}"
  primary-container: "${theme.light.primaryContainer}"
  on-primary-container: "${theme.light.onPrimaryContainer}"
  secondary: "${theme.light.secondary}"
  on-secondary: "${theme.light.onSecondary}"
  tertiary: "${theme.light.tertiary}"
  surface: "${theme.light.surface}"
  surface-container-lowest: "${theme.light.surfaceContainerLowest}"
  surface-container-low: "${theme.light.surfaceContainerLow}"
  surface-container: "${theme.light.surfaceContainer}"
  surface-container-high: "${theme.light.surfaceContainerHigh}"
  on-surface: "${theme.light.onSurface}"
  on-surface-variant: "${theme.light.onSurfaceVariant}"
  outline: "${theme.light.outline}"
  outline-variant: "${theme.light.outlineVariant}"
  error: "${theme.light.error}"
  dark-primary: "${theme.dark.primary}"
  dark-surface: "${theme.dark.surface}"
  dark-surface-container: "${theme.dark.surfaceContainer}"
  dark-on-surface: "${theme.dark.onSurface}"
  fluent-mica-light: "rgba(248, 249, 250, 0.86)"
  fluent-mica-dark: "rgba(18, 20, 24, 0.84)"
typography:
  display-lg:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: "3.5rem"
    letterSpacing: "-0.025em"
  headline-md:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: "2.25rem"
    letterSpacing: "-0.015em"
  title-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "-0.005em"
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  code-sm:
    fontFamily: "JetBrains Mono, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "1.25rem"
rounded:
  none: "0px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "9999px"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title-md}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
    height: "40px"
  panel-surface:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "24px"
  input-field:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "40px"
---

## Overview

${options.name} operates in \`${mode}\` mode with generalist architectural clarity. Every visual decision serves legibility, low cognitive load, and deterministic responsiveness. Material Design 3 CAM16/HCT tonal surfaces provide accessible contrast across light and dark modes, while Fluent UI 2 Mica translucency is reserved strictly for persistent top-level chrome.

## Colors

\`\`\`yaml
colors:
  seed: '${theme.seed}'
  primary: '${theme.light.primary}'
  onPrimary: '${theme.light.onPrimary}'
  primaryContainer: '${theme.light.primaryContainer}'
  surface: '${theme.light.surface}'
  surfaceContainer: '${theme.light.surfaceContainer}'
  onSurface: '${theme.light.onSurface}'
  outlineVariant: '${theme.light.outlineVariant}'
  darkPrimary: '${theme.dark.primary}'
  darkSurface: '${theme.dark.surface}'
  darkOnSurface: '${theme.dark.onSurface}'
\`\`\`

- **Primary (${theme.light.primary})**: Reserved for the single highest-priority action per viewport and active selection indicators.
- **Tonal Surface Hierarchy (${theme.light.surfaceContainerLowest} -> ${theme.light.surfaceContainerHigh})**: Grouping is achieved by stepping surface luminance rather than nesting bordered cards.
- **Browser Surfaces**: Style \`::selection\` with \`${theme.light.primaryContainer}\`, \`caret-color\` with \`${theme.light.primary}\`, and focus rings with a \`2px\` solid offset outline.

## Typography

\`\`\`yaml
typography:
  display: 'Space Grotesk, 48px/56px, weight 600, tracking -0.025em'
  headline: 'Space Grotesk, 28px/36px, weight 600, tracking -0.015em'
  body: 'Inter, 15px/24px, weight 400, measure 65ch-72ch'
  mono: 'JetBrains Mono, 13px/20px, weight 500, tabular-nums'
\`\`\`

- Keep long-form reading measure between \`65ch\` and \`75ch\`.
- Enable \`font-variant-numeric: tabular-nums\` on all counters, timestamps, prices, latencies, and data tables.
- Load Open Font License (OFL) variable fonts with metric-matched \`size-adjust\` fallback stacks so layout shift remains \`0.00\`.

## Layout

- Enforce the harmonic \`4dp / 8dp\` spatial grid across all margins, paddings, and flex/grid gaps.
- Provide more vertical space above section headings (\`32px\`) than below them (\`12px\`) so heading-to-content grouping is unambiguous.
- Maintain responsive parity at \`375px\`, \`768px\`, \`1024px\`, and \`1440px\` without horizontal overflow.

## Elevation & Depth

- Declare elevation once: either a subtle \`1px\` \`outline-variant\` border OR a stepped tonal container fill — never combine a visible border with a wide diffuse drop shadow ("ghost card").
- Shadows use physical vertical offset (\`0 2px 6px rgba(0, 0, 0, 0.12)\`); zero-offset neon glow halos are prohibited.

## Shapes

- Structural panels and workspaces use \`12px\` (\`rounded.md\`); inputs and buttons use \`8px\` (\`rounded.sm\`); compact status chips and toggles may use \`9999px\` (\`rounded.pill\`).
- Avoid mixing sharp \`0px\` brutalist corners and \`28px\` bubble cards on the same screen.

## Components

- \`AppScaffold\`: Top bar + adaptive navigation rail + main content stage.
- \`PrimaryButton\` / \`SecondaryButton\`: Explicit hover, active, disabled, and keyboard focus states.
- \`DataGrid\`: Right-aligned tabular numerals, sticky header, 1px horizontal hairline dividers, zero zebra-stripe clutter unless density exceeds 12 columns.
- \`WebGpuStage\`: Hardware-accelerated Three.js r186 \`WebGPURenderer\` / WGSL canvas with automatic static hero fallback under \`prefers-reduced-motion: reduce\`.

## Do's and Don'ts

- **Do** use crisp 24x24 geometric SVG icons (\`1.75px\` stroke) from \`@aphrody/google-design\`.
- **Do** write direct, factual UI labels where buttons name the exact verb ("Export Tokens", "Compile Binary").
- **Don't** use emojis anywhere in headings, badges, buttons, empty states, or documentation.
- **Don't** use generic purple-to-pink gradients (\`#8b5cf6 -> #ec4899\`), gradient-clipped text, or 3-column icon-badge marketing card grids.
- **Don't** place uppercase kicker/eyebrow labels above every heading or \`border-left: 4px solid\` stripes on rounded cards.
`;

  const writtenFiles: string[] = [];
  if (options.outDir) {
    mkdirSync(options.outDir, { recursive: true });
    const prdPath = join(options.outDir, "PRD.md");
    const designPath = join(options.outDir, "DESIGN.md");
    writeFileSync(prdPath, prdMarkdown, "utf8");
    writeFileSync(designPath, designMarkdown, "utf8");
    writtenFiles.push(prdPath, designPath);
  }

  return {
    name: options.name,
    slug,
    seedColor: theme.seed,
    mode,
    prdMarkdown,
    designMarkdown,
    writtenFiles,
  };
}
